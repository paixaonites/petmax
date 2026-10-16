# PetStock — conexão com MySQL

Esta versão usa **MySQL 8+** e uma API Node.js. O aplicativo **não acessa o banco diretamente**.

1. Instale MySQL 8+ e Node.js 20+ no computador ou servidor.
2. Importe `backend/schema.sql` no MySQL (por exemplo, via MySQL Workbench). Crie um usuário MySQL com permissões sobre o banco `petstock`.
3. Na pasta `backend`, copie `.env.example` para `.env` e preencha `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME` e um `JWT_SECRET` forte (32+ caracteres).
4. Na pasta `backend`, execute `npm install` e `npm start`.
5. Na raiz do aplicativo, copie `.env.example` para `.env`. Defina `EXPO_PUBLIC_API_URL` como a URL da API, por exemplo `http://192.168.1.100:3001` na mesma rede Wi-Fi. **Não use localhost no celular.**
6. Na raiz, execute `npm install` e `npx expo start -c`.
7. Crie o primeiro usuário pelo aplicativo: ele será o administrador. Outros cadastros exigem aprovação na tela Funcionários.

**Segurança:** use HTTPS para acesso fora da rede local; não publique a porta MySQL na internet; não coloque senhas MySQL no `.env` do Expo. O endpoint `/health` verifica a conexão da API com o banco.

**Observação:** os módulos de romaneios, relatórios e telas genéricas permanecem com as funcionalidades que já existiam no aplicativo; este pacote conecta ao MySQL os fluxos de login, equipe, produtos, clientes, estoque e pedidos. Os dados antigos do Supabase **não são migrados automaticamente**.
