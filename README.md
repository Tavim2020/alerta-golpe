# Alerta Golpe

Plataforma para informar e conscientizar sobre golpes por meio de relatos em
vídeo. O público pode conhecer casos reais, aprender como os golpes acontecem
e compartilhar os conteúdos. A área administrativa permite manter os relatos e
os dados de apoio do site.

## Recursos

- Página inicial com relatos recentes.
- Catálogo público de golpes com busca e paginação.
- Página individual para cada relato, com descrição, contexto, conteúdo,
  orientações e opções para compartilhar.
- Organização dos relatos por categorias e subcategorias.
- Cadastro de advogados associados aos conteúdos.
- Área administrativa protegida para gerenciar relatos, categorias,
  subcategorias e advogados.
- Integração com Supabase para dados e arquivos, além de Google AdSense.

## Tecnologias

- Next.js 16 com App Router e React 19
- TypeScript
- Supabase (banco de dados, Storage e Edge Functions)
- Tailwind CSS 4
- React Query, React Hook Form e Zod

## Requisitos

- Node.js 20.9 ou superior
- npm
- Um projeto Supabase configurado com o banco, buckets e Edge Functions
  utilizados pela aplicação
- Credenciais do Google AdSense

## Configuração local

1. Instale as dependências:

   ```bash
   npm ci
   ```

2. Crie o arquivo `.env.local` na raiz do projeto e preencha as variáveis:

   ```dotenv
   NEXT_PUBLIC_SITE_URL=http://localhost:3000
   NEXT_PUBLIC_SUPABASE_URL=https://SEU-PROJETO.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_SUA_CHAVE
   SUPABASE_SERVICE_ROLE_KEY=sb_secret_SUA_CHAVE
   ADMIN_EMAIL=admin@example.com
   ADMIN_PASSWORD=defina-uma-senha-segura
   AUTH_SECRET=00000000-0000-4000-8000-000000000000
   NEXT_PUBLIC_ADSENSE_CLIENT=ca-pub-SEU_ID
   NEXT_PUBLIC_ADSENSE_SLOT=1234567890
   ```

   Todas as variáveis acima são validadas na inicialização. `AUTH_SECRET` deve
   ser um UUID v4. `NEXT_PUBLIC_SUPABASE_ANON_KEY` deve começar com
   `sb_publishable_`, `SUPABASE_SERVICE_ROLE_KEY` com `sb_secret_`,
   `NEXT_PUBLIC_ADSENSE_CLIENT` deve conter `ca-pub-` e
   `NEXT_PUBLIC_ADSENSE_SLOT` deve conter apenas números.

   Os valores são exemplos: substitua-os pelos dados dos seus serviços. Nunca
   publique nem exponha `SUPABASE_SERVICE_ROLE_KEY`, `ADMIN_PASSWORD` ou
   `AUTH_SECRET`. As variáveis com prefixo `NEXT_PUBLIC_` são incluídas no
   ambiente do cliente e não devem conter segredos.

3. Inicie o servidor de desenvolvimento:

   ```bash
   npm run dev
   ```

   Acesse [http://localhost:3000](http://localhost:3000).

## Comandos

| Comando | Descrição |
| --- | --- |
| `npm run dev` | Inicia o servidor de desenvolvimento do Next.js. |
| `npm run build` | Gera a versão de produção. |
| `npm start` | Inicia o servidor de produção após o build. |
| `npm run typecheck` | Executa a verificação de tipos TypeScript. |
| `npm run generate:types` | Gera os tipos TypeScript do banco Supabase. |

O comando `generate:types` requer o Supabase CLI e acesso ao projeto configurado
no script do `package.json`.

## Supabase

O código das Edge Functions fica em `supabase/functions/`:

- `save-fraud`: salva relatos e seus arquivos.
- `save-lawyer`: salva dados e fotos de advogados.
- `super-service`: processa tarefas de manutenção do Storage.

As funções precisam estar implantadas no projeto Supabase usado pela aplicação.
As Edge Functions usam `SUPABASE_URL` e `SUPABASE_SERVICE_ROLE_KEY` como
segredos do ambiente Supabase; configure esses segredos no projeto antes de
executá-las.

Este repositório não contém migrações SQL do banco. Portanto, o schema,
políticas de acesso e buckets necessários devem existir no projeto Supabase
antes de utilizar todas as funcionalidades.

## Estrutura do projeto

```text
app/            Páginas, layouts e rotas de API do Next.js
components/     Componentes compartilhados da interface
constants/      Constantes da aplicação
environments/   Validação das variáveis de ambiente
libs/           Integrações e serviços, incluindo Supabase
routes/         Definições de rotas da aplicação e da API
supabase/       Configuração e Edge Functions do Supabase
types/          Tipos TypeScript compartilhados
utils/          Utilitários e schemas
```
