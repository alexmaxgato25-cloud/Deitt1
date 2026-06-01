-- SQL MIGRATION FILE FOR DEITT ADMIN PANEL DATABASE INDEX
-- To be in sync with standard dynamic loading

-- Active Profiles Table
CREATE TABLE IF NOT EXISTS public.active_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT UNIQUE NOT NULL,
  age INT NOT NULL,
  location TEXT NOT NULL,
  score TEXT DEFAULT '98%',
  active_time TEXT DEFAULT 'Agora mesmo',
  avatar TEXT,
  verified BOOLEAN DEFAULT FALSE,
  bio TEXT,
  interests TEXT[],
  photos TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Reels Table
CREATE TABLE IF NOT EXISTS public.reels (
  id TEXT PRIMARY KEY,
  author_name TEXT NOT NULL,
  author_avatar TEXT,
  video_url TEXT NOT NULL,
  caption TEXT,
  music_on_chain TEXT DEFAULT 'Trilha Sonora Original',
  likes INT DEFAULT 0,
  liked BOOLEAN DEFAULT FALSE,
  views INT DEFAULT 0,
  rating_score TEXT DEFAULT '95%',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Reel Comments Table
CREATE TABLE IF NOT EXISTS public.reel_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reel_id TEXT NOT NULL REFERENCES public.reels(id) ON DELETE CASCADE,
  authorTEXT TEXT NOT NULL,
  avatar TEXT,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Support Tickets Table
CREATE TABLE IF NOT EXISTS public.tickets (
  id TEXT PRIMARY KEY,
  user_name TEXT NOT NULL,
  avatar TEXT,
  subject TEXT NOT NULL,
  category TEXT DEFAULT 'Disputa',
  status TEXT DEFAULT 'Aberto',
  date TEXT NOT NULL,
  description TEXT,
  replies JSONB DEFAULT '[]'::jsonb
);

-- Verification Queue Table
CREATE TABLE IF NOT EXISTS public.verification_queue (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  age INT NOT NULL,
  doc_photo TEXT NOT NULL,
  selfie_photo TEXT NOT NULL,
  similarity TEXT NOT NULL,
  status TEXT DEFAULT 'Pendente',
  submitted_at TEXT NOT NULL
);

-- Moderation Incidents Table
CREATE TABLE IF NOT EXISTS public.moderation_incidents (
  id TEXT PRIMARY KEY,
  target_name TEXT NOT NULL,
  reason TEXT NOT NULL,
  evidence_photo TEXT NOT NULL,
  blur_active BOOLEAN DEFAULT TRUE,
  safe_score TEXT NOT NULL,
  action_recommended TEXT NOT NULL,
  status TEXT DEFAULT 'Aguardando'
);

-- Reported Profiles Table
CREATE TABLE IF NOT EXISTS public.reported_profiles (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  reports INT DEFAULT 1,
  scammer_score INT DEFAULT 50,
  harassment_score INT DEFAULT 50,
  chargeback_score INT DEFAULT 50,
  severity TEXT DEFAULT 'Média',
  last_report TEXT DEFAULT 'Há 2 horas',
  status TEXT DEFAULT 'Pendente'
);

-- Insert Default Seeds (Fallbacks)
INSERT INTO public.active_profiles (name, age, location, score, active_time, avatar, verified, bio, interests, photos) VALUES
('Valentina Rosa', 24, 'Belo Horizonte, MG', '99%', 'Semáforo Verde', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150', true, 'Criadora de conteúdo e fã nata de samba de roda. No Deitt para conexões profundas e risadas sinceras!', ARRAY['Futebol', 'Samba', 'Vinho'], ARRAY['https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400', 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400']),
('Mateus Sol', 28, 'Florianópolis, SC', '97%', 'Ativo hoje', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150', false, 'Surfista nas horas vagas e engenheiro de dados. Procuro alguém para dividir uma pizza de rúcula.', ARRAY['Surf', 'Tecnologia', 'Pizza'], ARRAY['https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400', 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400']),
('Larissa Cruz', 22, 'Rio de Janeiro, RJ', '96%', 'Agora mesmo', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150', true, 'Arquiteta apaixonada por cafés especiais e gatos pretos. Me leve em exposições de arte e cafés vintage!', ARRAY['Design', 'Café', 'Gatos'], ARRAY['https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400']),
('Bernardo Paiva', 31, 'Recife, PE', '94%', 'Ontem à noite', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150', false, 'Músico de barzinho, fã nostálgico de Smiths, comédia stand-up e trilhas de moto de final de semana.', ARRAY['Música', 'Stand-up', 'Aventura'], ARRAY['https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400'])
ON CONFLICT (name) DO NOTHING;

INSERT INTO public.reels (id, author_name, author_avatar, video_url, caption, music_on_chain, likes, liked, views, rating_score) VALUES
('reel-1', 'Valentina Rosa', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150', 'https://assets.mixkit.co/videos/preview/mixkit-girl-walking-down-the-city-street-44243-large.mp4', 'A vida acontece fora das caixas de layout 🌃✨ #BeloHorizonte #Aventura', 'Trilha Autoral On-Chain #1', 124, false, 890, '99/100 Pulse'),
('reel-2', 'Larissa Cruz', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150', 'https://assets.mixkit.co/videos/preview/mixkit-hands-holding-steaming-coffee-cup-41221-large.mp4', 'Felicidade matinal em forma de cafeína líquida ☕🖤 #VisualDesign', 'Lo-Fi Chill Deitt Sessions', 89, false, 542, '96/100 Pulse')
ON CONFLICT (id) DO NOTHING;

-- Deitt Portal Users Table
CREATE TABLE IF NOT EXISTS public.deitt_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  avatar TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Disable RLS for all simulation tables to ensure frictionless testing in preview
ALTER TABLE public.active_profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.reels DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.reel_comments DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.tickets DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.verification_queue DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.moderation_incidents DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.reported_profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.deitt_users DISABLE ROW LEVEL SECURITY;

