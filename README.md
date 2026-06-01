# Deitt Cockpit - Guia de Implantação Prática no Vercel

Este é o painel administrativo de moderação e simulações do aplicativo **Deitt**. Siga este guia passo a passo em português para publicar seu projeto no **Vercel** sem complicações.

---

## 📋 Pré-requisitos

Antes de iniciar, tenha em mãos:
1. Uma conta no [GitHub](https://github.com).
2. Uma conta na [Vercel](https://vercel.com).
3. Um projeto ativo no [Supabase](https://supabase.com).

---

## 🚀 Passo a Passo de Implantação

### Passo 1: Enviar o Projeto para o GitHub

1. Baixe o código fonte do seu projeto (ZIP) do AI Studio ou sincronize-o diretamente com um repositório seu do GitHub.
2. Se estiver fazendo manualmente pelo terminal:
   ```bash
   git init
   git add .
   git commit -m "feat: setup deitt cockpit admin"
   # Crie um repositório novo no GitHub e conecte-o:
   git remote add origin <URL_DO_SEU_REPOSITORIO_GITHUB>
   git branch -M main
   git push -u origin main
   ```

---

### Passo 2: Executar as Migrações SQL no Supabase

Para que o aplicativo funcione perfeitamente com o banco de dados dinâmico, você precisará criar as tabelas no Supabase:

1. Acesse o painel do seu projeto no **Supabase**.
2. No menu lateral esquerdo, clique em **SQL Editor**.
3. Clique em **New Query** (Nova consulta).
4. Copie o script SQL completo disponível no rodapé do painel administrativo do Deitt (aba **Configurações Supabase**) ou use o arquivo localizado em `supabase/migrations/20260601000000_init_deitt.sql`.
5. Cole no editor do Supabase e clique em **Run** (Executar).
6. Pronto! As tabelas de perfis, reels, tickets e logs de moderação foram criadas com o RLS (Row Level Security) flexibilizado para testes.

---

### Passo 3: Importar o Projeto no Vercel

1. Acesse o painel da [Vercel](https://vercel.com).
2. Clique no botão **Add New...** e selecione **Project**.
3. Escolha o repositório do GitHub que você acabou de criar e clique em **Import**.
4. Mantenha os ajustes padrões:
   - **Framework Preset**: `Next.js`
   - **Root Directory**: `./` (Raiz)

---

### Passo 4: Configurar as Variáveis de Ambiente no Vercel

Antes de clicar em *Deploy*, espanda a seção **Environment Variables** (Variáveis de Ambiente) no formulário do Vercel e adicione as seguintes chaves idênticas ao arquivo `.env.example`:

1. **`NEXT_PUBLIC_SUPABASE_URL`**
   - *Onde encontrar*: No painel do seu Supabase, vá em **Project Settings** (Configurações do Projeto) > **API**. Procure por **Project URL**.
   - *Valor*: `https://xxxxxxxxxxxxxxxx.supabase.co`

2. **`NEXT_PUBLIC_SUPABASE_ANON_KEY`**
   - *Onde encontrar*: No mesmo menu **API** do Supabase, procure pela chave **anon public** (Public API Key).
   - *Valor*: Sua chave longa anon do Supabase.

3. **`GEMINI_API_KEY`**
   - *Onde encontrar*: No console do Google AI Studio ou Google Cloud Vertex AI.
   - *Valor*: Sua chave secreta Gemini para habilitar a IA avaliadora de risco e as recomendações de bios.

---

### Passo 5: Implantar (Deploy)

1. Com as três variáveis inseridas, clique em **Deploy**.
2. Aguarde entre 1 e 2 minutos enquanto a Vercel compila sua aplicação Next.js.
3. **Parabéns!** Seu Deitt Cockpit está no ar com SSL gratuito e pronto para uso real.
