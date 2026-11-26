import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import mysql from 'mysql2/promise';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { randomUUID } from 'node:crypto';

// ==========================================
// 1. VALIDAÇÃO DE CONFIGURAÇÃO E CONEXÃO COM O BANCO
// ==========================================

// Garante que o JWT_SECRET foi configurado corretamente no arquivo .env
if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32) {
  throw new Error('Configure JWT_SECRET com pelo menos 32 caracteres');
}

// Cria o pool de conexões com o banco de dados MySQL utilizando as variáveis de ambiente
const db = mysql.createPool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT || 3306),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  decimalNumbers: true
});

// ==========================================
// 2. CONFIGURAÇÃO DO EXPRESS E UTILITÁRIOS
// ==========================================

const app = express();
app.use(cors());
app.use(express.json({ limit: '1mb' }));

// Função auxiliar para disparar erros HTTP personalizados facilmente
const fail = (message, status = 400) => {
  const e = new Error(message);
  e.status = status;
  throw e;
};

// Middleware wrapper para capturar erros assíncronos automaticamente e repassá-los para o Express
const wrap = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

// ==========================================
// 3. MIDDLEWARES DE AUTENTICAÇÃO E AUTORIZAÇÃO
// ==========================================

// Middleware para verificar se o usuário possui um token JWT válido e está ativo no sistema
const auth = wrap(async (req, res, next) => {
  const token = (req.headers.authorization || '').replace(/^Bearer\s+/i, '').trim();
  if (!token) fail('Sessão inválida. Entre novamente.', 401);

  let payload;
  try {
    payload = jwt.verify(token, process.env.JWT_SECRET);
  } catch {
    fail('Sessão inválida. Entre novamente.', 401);
  }

  // Busca o usuário no banco para garantir que ele ainda existe e está ativo
  const [[u]] = await db.query('SELECT id, full_name, email, role, active FROM profiles WHERE id = ?', [payload.sub]);
  if (!u || !u.active) fail('Acesso não autorizado.', 403);
  
  req.user = u;
  next();
});

// Middleware para restringir o acesso apenas a usuários com o cargo (role) de 'admin'
const admin = (req, res, next) => 
  req.user.role === 'admin' ? next() : next(Object.assign(new Error('Acesso restrito ao administrador.'), { status: 403 }));

// Padroniza a resposta pública do usuário (removendo dados sensíveis como senha)
const publicUser = u => ({
  id: u.id,
  name: u.full_name,
  email: u.email,
  role: u.role,
  active: !!u.active
});

// ==========================================
// 4. ROTAS DE SISTEMA E AUTENTICAÇÃO
// ==========================================

// Rota de verificação de saúde da API e conexão com o banco
app.get('/health', wrap(async (req, res) => {
  await db.query('SELECT 1');
  res.json({ ok: true });
}));

// Rota para registrar um novo usuário
app.post('/auth/register', wrap(async (req, res) => {
  const { name, email, password } = req.body;
  
  // Validações básicas dos campos recebidos
  if (!name || name.trim().length < 3 || !email || !/^\S+@\S+\.\S+$/.test(email) || !password || password.length < 8) {
    fail('Informe nome, e-mail válido e senha de pelo menos 8 caracteres.');
  }

  const conn = await db.getConnection();
  try {
    await conn.beginTransaction();
    
    // Verifica se já existe algum usuário cadastrado; se for o primeiro, ele será automaticamente 'admin' e ativo
    await conn.query('SELECT id FROM profiles LIMIT 1 FOR UPDATE');
    const [[{ n }]] = await conn.query('SELECT COUNT(*) n FROM profiles');
    const first = n === 0;

    // Insere o novo usuário no banco com a senha criptografada (hash com bcrypt)
    await conn.query(
      'INSERT INTO profiles(id, full_name, email, password_hash, role, active) VALUES(?, ?, ?, ?, ?, ?)',
      [randomUUID(), name.trim(), email.trim().toLowerCase(), await bcrypt.hash(password, 12), first ? 'admin' : 'employee', first ? 1 : 0]
    );

    await conn.commit();
    res.status(201).json({ needsEmailConfirmation: false, pendingApproval: !first });
  } catch (e) {
    await conn.rollback();
    throw e;
  } finally {
    conn.release();
  }
}));

// Rota de login (autenticação)
app.post('/auth/login', wrap(async (req, res) => {
  const [[u]] = await db.query('SELECT * FROM profiles WHERE email = ?', [String(req.body.email || '').trim().toLowerCase()]);
  
  // Valida se o usuário existe e se a senha confere
  if (!u || !(await bcrypt.compare(String(req.body.password || ''), u.password_hash))) {
    fail('E-mail ou senha incorretos.', 401);
  }
  
  // Verifica se o cadastro do funcionário foi aprovado pelo administrador
  if (!u.active) fail('Aguarde a aprovação do administrador.', 403);

  // Retorna o Token JWT (válido por 7 dias) e os dados públicos do usuário
  res.json({
    token: jwt.sign({ sub: u.id }, process.env.JWT_SECRET, { expiresIn: '7d' }),
    user: publicUser(u)
  });
}));

// Retorna os dados do usuário logado atualmente com base no token
app.get('/auth/me', auth, (req, res) => res.json({ user: publicUser(req.user) }));

// ==========================================
// 5. ROTAS DE GESTÃO DE FUNCIONÁRIOS (ADMIN)
// ==========================================

// Lista todos os funcionários cadastrados no sistema
app.get('/employees', auth, admin, wrap(async (req, res) => {
  const [rows] = await db.query('SELECT id, full_name, email, role, active FROM profiles ORDER BY created_at');
  res.json(rows.map(r => ({ ...r, active: !!r.active })));
}));

// Ativa ou desativa o acesso de um funcionário específico
app.patch('/employees/:id', auth, admin, wrap(async (req, res) => {
  if (req.params.id === req.user.id) fail('Não é permitido alterar o próprio acesso.');
  await db.query('UPDATE profiles SET active = ? WHERE id = ?', [req.body.active ? 1 : 0, req.params.id]);
  res.json({ ok: true });
}));

// ==========================================
// 6. ROTA PRINCIPAL DE DADOS DO SISTEMA
// ==========================================

// Retorna em lote produtos, clientes, últimas ordens e movimentações de estoque para a aplicação
app.get('/data', auth, wrap(async (req, res) => {
  const [[products], [customers], [orders], [movements]] = await Promise.all([
    db.query(`SELECT p.id, p.name, COALESCE(b.name, 'Sem marca') brand, COALESCE(c.name, 'Sem categoria') category, p.weight, p.unit, p.internal_code code, COALESCE(p.barcode, '') barcode, COALESCE(i.physical_quantity, 0) quantity, COALESCE(i.reserved_quantity, 0) reserved, p.minimum_stock minimum, p.price, p.active FROM products p LEFT JOIN brands b ON b.id=p.brand_id LEFT JOIN categories c ON c.id=p.category_id LEFT JOIN inventory i ON i.product_id=p.id WHERE p.active=1 ORDER BY p.name`),
    db.query(`SELECT id, name, COALESCE(document, '') document, COALESCE(phone, '') phone, COALESCE(city, '') city FROM customers WHERE active=1 ORDER BY name`),
    db.query(`SELECT o.id, o.order_number number, c.name customerName, o.total, o.status, o.created_at createdAt FROM orders o JOIN customers c ON c.id=o.customer_id ORDER BY o.created_at DESC LIMIT 100`),
    db.query(`SELECT m.id, p.name productName, m.movement_type type, m.quantity_delta quantityDelta, m.balance_after balanceAfter, m.reason, u.full_name employeeName, m.created_at createdAt FROM inventory_movements m JOIN products p ON p.id=m.product_id JOIN profiles u ON u.id=m.employee_id ORDER BY m.created_at DESC LIMIT 100`)
  ]);

  res.json({
    products: products.map(p => ({ ...p, active: !!p.active })),
    customers,
    orders,
    movements
  });
}));

// ==========================================
// 7. LÓGICA DE MOVIMENTAÇÃO E ESTOQUE
// ==========================================

// Função auxiliar interna para registrar entradas, saídas e ajustes no estoque
async function movement(conn, { productId, type, quantity, reason, note }, userId) {
  // Trava a linha do estoque do produto para evitar concorrência (race conditions)
  const [[stock]] = await conn.query('SELECT physical_quantity, reserved_quantity FROM inventory WHERE product_id = ? FOR UPDATE', [productId]);
  if (!stock) fail('Produto sem registro de estoque.');

  const q = Number(quantity);
  if (!Number.isSafeInteger(q) || q === 0 || !reason?.trim()) fail('Quantidade ou motivo inválido.');

  // Define se a quantidade somará ou subtrairá do estoque físico com base no tipo de movimentação
  const delta = type === 'entrada' || type === 'devolucao' ? Math.abs(q) : type === 'ajuste' ? q : -Math.abs(q);
  
  if (!['entrada', 'saida', 'ajuste', 'devolucao', 'perda'].includes(type)) {
    fail('Tipo de movimentação inválido.');
  }

  const balance = stock.physical_quantity + delta;

  // Garante que o novo saldo não fure a quantidade reservada por pedidos pendentes
  if (balance < stock.reserved_quantity) fail('Estoque insuficiente ou reservado.');

  // Atualiza o saldo físico no estoque e registra o histórico na tabela de movimentações
  await conn.query('UPDATE inventory SET physical_quantity = ? WHERE product_id = ?', [balance, productId]);
  await conn.query(
    'INSERT INTO inventory_movements(id, product_id, movement_type, quantity_delta, balance_after, reason, note, employee_id) VALUES(?, ?, ?, ?, ?, ?, ?, ?)',
    [randomUUID(), productId, type, delta, balance, reason.trim(), note || null, userId]
  );
}

// ==========================================
// 8. ROTAS DE CADASTRO, EDIÇÃO E EXCLUSÃO (PRODUTOS, CLIENTES, MOVIMENTAÇÕES E PEDIDOS)
// ==========================================

// Rota para cadastrar um novo produto (cria marca/categoria se não existirem e já inicializa o estoque)
app.post('/products', auth, wrap(async (req, res) => {
  const x = req.body;

  if (!x.name?.trim() || !x.internalCode?.trim() || !x.brand?.trim() || !x.category?.trim()) {
    fail('Preencha nome, código, marca e categoria.');
  }

  const price = Number(String(x.price ?? '').replace(',', '.').trim());
  const minimumStock = Number(String(x.minimumStock ?? '').trim());
  const initialStock = Number(String(x.initialStock ?? '0').trim());

  if (!Number.isFinite(price) || price < 0 || !Number.isInteger(minimumStock) || minimumStock < 0 || !Number.isInteger(initialStock) || initialStock < 0) {
    fail('Valores de preço ou estoque inválidos.');
  }

  const conn = await db.getConnection();
  try {
    await conn.beginTransaction();

    // Insere marca e categoria caso não existam (evita duplicidade usando ON DUPLICATE KEY UPDATE)
    for (const [table, name] of [['brands', x.brand.trim()], ['categories', x.category.trim()]]) {
      await conn.query(`INSERT INTO ${table}(id, name) VALUES(?, ?) ON DUPLICATE KEY UPDATE name = VALUES(name)`, [randomUUID(), name]);
    }

    // Recupera os IDs corretos da marca e da categoria
    const [[brand]] = await conn.query('SELECT id FROM brands WHERE name = ?', [x.brand.trim()]);
    const [[category]] = await conn.query('SELECT id FROM categories WHERE name = ?', [x.category.trim()]);
    const id = randomUUID();

    // Insere o produto e o registro inicial na tabela de estoque
    await conn.query(
      'INSERT INTO products(id, internal_code, barcode, name, brand_id, category_id, weight, unit, price, minimum_stock, created_by) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [id, x.internalCode.trim(), x.barcode?.trim() || null, x.name.trim(), brand.id, category.id, x.weight || '', x.unit || 'UN', price, minimumStock, req.user.id]
    );

    await conn.query('INSERT INTO inventory(product_id) VALUES(?)', [id]);

    // Se houver estoque inicial maior que zero, registra uma movimentação de entrada automática
    if (initialStock > 0) {
      await movement(conn, { productId: id, type: 'entrada', quantity: initialStock, reason: 'Estoque inicial', note: 'Cadastro do produto' }, req.user.id);
    }

    await conn.commit();
    res.status(201).json({ id });
  } catch (e) {
    await conn.rollback();
    throw e;
  } finally {
    conn.release();
  }
}));

// Rota para editar um produto existente
app.patch('/products/:id', auth, wrap(async (req, res) => {
  const x = req.body;
  const { id } = req.params;

  if (!x.name?.trim() || !x.internalCode?.trim() || !x.brand?.trim() || !x.category?.trim()) {
    fail('Preencha nome, código, marca e categoria.');
  }

  const price = Number(String(x.price ?? '').replace(',', '.').trim());
  const minimumStock = Number(String(x.minimumStock ?? '').trim());

  if (!Number.isFinite(price) || price < 0 || !Number.isInteger(minimumStock) || minimumStock < 0) {
    fail('Valores de preço ou estoque mínimo inválidos.');
  }

  const conn = await db.getConnection();
  try {
    await conn.beginTransaction();

    const [[existing]] = await conn.query('SELECT id FROM products WHERE id = ? AND active = 1', [id]);
    if (!existing) fail('Produto não encontrado.', 404);

    for (const [table, name] of [['brands', x.brand.trim()], ['categories', x.category.trim()]]) {
      await conn.query(`INSERT INTO ${table}(id, name) VALUES(?, ?) ON DUPLICATE KEY UPDATE name = VALUES(name)`, [randomUUID(), name]);
    }

    const [[brand]] = await conn.query('SELECT id FROM brands WHERE name = ?', [x.brand.trim()]);
    const [[category]] = await conn.query('SELECT id FROM categories WHERE name = ?', [x.category.trim()]);

    await conn.query(
      'UPDATE products SET internal_code = ?, barcode = ?, name = ?, brand_id = ?, category_id = ?, weight = ?, unit = ?, price = ?, minimum_stock = ? WHERE id = ?',
      [x.internalCode.trim(), x.barcode?.trim() || null, x.name.trim(), brand.id, category.id, x.weight || '', x.unit || 'UN', price, minimumStock, id]
    );

    await conn.commit();
    res.json({ ok: true });
  } catch (e) {
    await conn.rollback();
    throw e;
  } finally {
    conn.release();
  }
}));

// Rota para exclusão lógica (desativação) de um produto
app.delete('/products/:id', auth, wrap(async (req, res) => {
  const { id } = req.params;

  const [[existing]] = await db.query(
    'SELECT p.id, COALESCE(i.reserved_quantity, 0) reserved FROM products p LEFT JOIN inventory i ON i.product_id = p.id WHERE p.id = ? AND p.active = 1',
    [id]
  );

  if (!existing) fail('Produto não encontrado.', 404);
  if (existing.reserved > 0) fail('Não é possível excluir um produto com estoque reservado em pedidos.');

  await db.query('UPDATE products SET active = 0 WHERE id = ?', [id]);
  res.json({ ok: true });
}));

// Rota para cadastrar um novo cliente
app.post('/customers', auth, wrap(async (req, res) => {
  const x = req.body;
  if (!x.name?.trim() || x.name.trim().length < 3) fail('Informe o nome ou razão social.');

  const id = randomUUID();
  await db.query(
    'INSERT INTO customers(id, name, document, phone, city, created_by) VALUES(?, ?, ?, ?, ?, ?)',
    [id, x.name.trim(), x.document?.trim() || null, x.phone?.trim() || null, x.city?.trim() || null, req.user.id]
  );

  res.status(201).json({ id });
}));

// Rota avulsa para criar movimentações manuais de estoque
app.post('/movements', auth, wrap(async (req, res) => {
  const conn = await db.getConnection();
  try {
    await conn.beginTransaction();
    await movement(conn, req.body, req.user.id);
    await conn.commit();
    res.json({ ok: true });
  } catch (e) {
    await conn.rollback();
    throw e;
  } finally {
    conn.release();
  }
}));

// Rota para criar um novo pedido (reserva itens no estoque e calcula o valor total)
app.post('/orders', auth, wrap(async (req, res) => {
  const { customerId, items, notes } = req.body;
  if (!customerId || !Array.isArray(items) || !items.length) fail('Informe cliente e produtos.');

  const conn = await db.getConnection();
  try {
    await conn.beginTransaction();

    // Valida se o cliente existe e está ativo
    const [[customer]] = await conn.query('SELECT id FROM customers WHERE id = ? AND active = 1', [customerId]);
    if (!customer) fail('Cliente inválido.');

    // Agrupa itens repetidos do mesmo produto no pedido somando suas quantidades
    const merged = new Map();
    for (const item of items) {
      const q = Number(item.quantity);
      if (!item.productId || !Number.isSafeInteger(q) || q <= 0) fail('Quantidade inválida.');
      merged.set(item.productId, (merged.get(item.productId) || 0) + q);
    }

    const id = randomUUID();
    await conn.query('INSERT INTO orders(id, customer_id, notes, created_by) VALUES(?, ?, ?, ?)', [id, customerId, notes || null, req.user.id]);

    let total = 0;

    // Processa cada produto do pedido ordenadamente para evitar deadlocks no banco
    for (const productId of [...merged.keys()].sort()) {
      const quantity = merged.get(productId);
      
      // Verifica preço e disponibilidade de estoque atual travando a linha (FOR UPDATE)
      const [[p]] = await conn.query('SELECT p.price, i.physical_quantity, i.reserved_quantity FROM products p JOIN inventory i ON i.product_id = p.id WHERE p.id = ? AND p.active = 1 FOR UPDATE', [productId]);
      
      if (!p || (p.physical_quantity - p.reserved_quantity) < quantity) {
        fail('Estoque insuficiente para um dos produtos.');
      }

      // Aumenta a quantidade reservada no estoque
      await conn.query('UPDATE inventory SET reserved_quantity = reserved_quantity + ? WHERE product_id = ?', [quantity, productId]);
      
      // Insere o item na tabela de itens do pedido
      await conn.query('INSERT INTO order_items(id, order_id, product_id, quantity, unit_price) VALUES(?, ?, ?, ?, ?)', [randomUUID(), id, productId, quantity, p.price]);
      
      total += quantity * p.price;
    }

    // Atualiza o valor total calculado do pedido
    await conn.query('UPDATE orders SET total = ? WHERE id = ?', [Math.round(total * 100) / 100, id]);

    await conn.commit();
    res.status(201).json({ id });
  } catch (e) {
    await conn.rollback();
    throw e;
  } finally {
    conn.release();
  }
}));

// ==========================================
// 9. MIDDLEWARE GLOBAL DE TRATAMENTO DE ERROS E INICIALIZAÇÃO DO SERVIDOR
// ==========================================

// Middleware centralizado que intercepta e formata qualquer erro lançado nas rotas
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || (err.code === 'ER_DUP_ENTRY' ? 409 : 500)).json({
    error: err.code === 'ER_DUP_ENTRY' ? 'Registro já cadastrado.' : err.status ? err.message : 'Erro interno no servidor.'
  });
});

// Inicialização da aplicação na porta configurada
const port = Number(process.env.PORT || 3001);
app.listen(port, '0.0.0.0', () => console.log(`PetStock API na porta ${port}`));