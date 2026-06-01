"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Database,
  Heart,
  X,
  Check,
  Users,
  Shield,
  MessageSquare,
  Video,
  ShieldAlert,
  Sparkles,
  Menu,
  CheckCircle,
  AlertTriangle,
  Send,
  Plus,
  Filter,
  RefreshCw,
  Layers,
  MapPin,
  LifeBuoy,
  Eye,
  EyeOff,
  Trash2,
  Edit,
  Copy,
  UserCheck,
  ThumbsUp,
  AlertCircle,
  Lock,
  LogIn,
  LogOut,
  User
} from "lucide-react";
import { isSupabaseConfigured, getSupabase } from "../lib/supabase";

// Interfaces
interface Profile {
  id: string;
  name: string;
  age: number;
  location: string;
  score: string;
  active_time: string;
  avatar: string;
  verified: boolean;
  bio: string;
  interests: string[];
  photos: string[];
}

interface Reel {
  id: string;
  authorName: string;
  authorAvatar: string;
  videoUrl: string;
  caption: string;
  musicOnChain: string;
  likes: number;
  liked: boolean;
  views: number;
  ratingScore: string;
}

interface Ticket {
  id: string;
  userName: string;
  avatar: string;
  subject: string;
  category: string;
  status: string;
  date: string;
  description: string;
  replies: string[];
}

interface VerificationItem {
  id: string;
  name: string;
  age: number;
  docPhoto: string;
  selfiePhoto: string;
  similarity: string;
  status: string;
  submittedAt: string;
}

interface Incident {
  id: string;
  targetName: string;
  reason: string;
  evidencePhoto: string;
  blurActive: boolean;
  safeScore: string;
  actionRecommended: string;
  status: string;
}

interface Message {
  sender: string;
  text: string;
  time: string;
}

// Global Static Mocks (Fallbacks for Local Storage)
const INITIAL_ACTIVE_PROFILES: Profile[] = [
  {
    id: "p-1",
    name: "Valentina Rosa",
    age: 24,
    location: "Belo Horizonte, MG",
    score: "99%",
    active_time: "Agora mesmo",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150",
    verified: true,
    bio: "Criadora de conteúdo e fã nata de samba de roda. No Deitt para conexões profundas e risadas sinceras!",
    interests: ["Samba", "Futebol", "Vinho"],
    photos: [
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400",
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400"
    ]
  },
  {
    id: "p-2",
    name: "Mateus Reis",
    age: 28,
    location: "Florianópolis, SC",
    score: "97%",
    active_time: "Há 10 min",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150",
    verified: false,
    bio: "Surfista nas horas vagas, desenvolvedor front-end e tutor de dois golden retrievers aventureiros.",
    interests: ["Surf", "Praia", "Pet"],
    photos: [
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400",
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400"
    ]
  },
  {
    id: "p-3",
    name: "Larissa Cunha",
    age: 22,
    location: "Rio de Janeiro, RJ",
    score: "94%",
    active_time: "Ontem",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150",
    verified: true,
    bio: "Arquiteta apaixonada por cafés especiais e gatos pretos. Me leve em exposições de arte e cafés vintage!",
    interests: ["História", "Café", "Música"],
    photos: [
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400"
    ]
  }
];

const INITIAL_REELS: Reel[] = [
  {
    id: "r-1",
    authorName: "Valentina Rosa",
    authorAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150",
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-girl-walking-down-the-city-street-44243-large.mp4",
    caption: "A vida acontece fora das caixas de layout 🌃✨ #BeloHorizonte #Aventura",
    musicOnChain: "Trilha Autoral On-Chain #1",
    likes: 124,
    liked: false,
    views: 890,
    ratingScore: "99% Pulse"
  },
  {
    id: "r-2",
    authorName: "Larissa Cunha",
    authorAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150",
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-hands-holding-steaming-coffee-cup-41221-large.mp4",
    caption: "Felicidade matinal em forma de cafeína líquida ☕🖤 #VisualDesign",
    musicOnChain: "Lo-Fi Chill Deitt Sessions",
    likes: 89,
    liked: false,
    views: 542,
    ratingScore: "96% Pulse"
  }
];

const INITIAL_TICKETS: Ticket[] = [
  {
    id: "TKT-304",
    userName: "Bernardo Santos",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150",
    subject: "Cobrança duplicada no Deitt Premium",
    category: "Financeiro",
    status: "Aberto",
    date: "Apenas hoje",
    description: "Olá suporte! Minha assinatura premium foi debitada duas vezes na minha conta nubank ontem. Solicito ressarcimento de um dos valores.",
    replies: ["Olá Bernardo, estamos revisando o histórico dos processamentos financeiros no Pix."]
  },
  {
    id: "TKT-298",
    userName: "Gabriela Faria",
    avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150",
    subject: "Denúncia de perfil usando minhas fotos pessoais",
    category: "Segurança",
    status: "Andamento",
    date: "Há 1 dia",
    description: "Descobri que há uma conta se passando por mim no Deitt de Florianópolis. Por favor, banam este perfil.",
    replies: []
  }
];

const INITIAL_VERIFICATION_QUEUE: VerificationItem[] = [
  {
    id: "V-82",
    name: "Mariana Alencar",
    age: 26,
    docPhoto: "https://images.unsplash.com/photo-1554151228-14d9def656e4?w=300",
    selfiePhoto: "https://images.unsplash.com/photo-1554151228-14d9def656e4?w=300",
    similarity: "98.7%",
    status: "Pendente",
    submittedAt: "Apenas hoje"
  },
  {
    id: "V-81",
    name: "Rodrigo Toledo",
    age: 30,
    docPhoto: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=300",
    selfiePhoto: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=300",
    similarity: "96.2%",
    status: "Pendente",
    submittedAt: "Ontem"
  }
];

const INITIAL_MODERATION_INCIDENTS: Incident[] = [
  {
    id: "MOD-401",
    targetName: "Juliana Mendes",
    reason: "Foto suspeita denunciada como 18+ (Spam de marca)",
    evidencePhoto: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400",
    blurActive: true,
    safeScore: "35% Seguro",
    actionRecommended: "Análise Requerida",
    status: "Investigando"
  }
];

const INITIAL_DIRECT_CHATS: Record<string, Message[]> = {
  "p-1": [
    { sender: "Valentina Rosa", text: "Oi! Curti muito o seu gosto por samba de roda e discos antigos.", time: "18:40" },
    { sender: "Você (Simulador)", text: "Nossa, sério?! Vamos combinar de tomar um chopp qualquer dia?", time: "18:42" },
    { sender: "Valentina Rosa", text: "Com certeza, amanhã no fim de tarde estarei livre!", time: "18:43" }
  ],
  "p-2": [
    { sender: "Você (Simulador)", text: "E aí Mateus, as ondas estavam boas hoje em Floripa?", time: "Ontem" },
    { sender: "Mateus Reis", text: "Fantástico cara! Altas ondas no Campeche.", time: "Ontem" }
  ]
};

const DEFAULT_USERS = [
  { email: "usuario@deitt.com", password: "senha123", name: "Lucas Souza", role: "user", avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150" },
  { email: "moderador@deitt.com", password: "admin123", name: "Marina Silva", role: "user", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150" }
];

const DEFAULT_AVATARS = [
  { name: "Sofia", url: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150" },
  { name: "Lucas", url: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150" },
  { name: "Isabela", url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150" },
  { name: "Gabriel", url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150" }
];

export default function App() {
  const [activeTab, setActiveTab] = useState<string>("swipe_mode");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastType, setToastType] = useState<"success" | "info" | "error">("success");

  // Local storage / state hooks
  const [profiles, setProfiles] = useState<Profile[]>(INITIAL_ACTIVE_PROFILES);
  const [reels, setReels] = useState<Reel[]>(INITIAL_REELS);
  const [tickets, setTickets] = useState<Ticket[]>(INITIAL_TICKETS);
  const [verificationQueue, setVerificationQueue] = useState<VerificationItem[]>(INITIAL_VERIFICATION_QUEUE);
  const [incidents, setIncidents] = useState<Incident[]>(INITIAL_MODERATION_INCIDENTS);
  const [directChats, setDirectChats] = useState<Record<string, Message[]>>(INITIAL_DIRECT_CHATS);

  // Connection indicator
  const [supabaseLogStatus, setSupabaseLogStatus] = useState<string>("Desconectado (Fallback Local Ativo)");
  const [isSyncingSubmitting, setIsSyncingSubmitting] = useState<boolean>(false);

  // States for Swipe Simulator
  const [swipeIndex, setSwipeIndex] = useState<number>(0);
  const [swipedStats, setSwipedStats] = useState({ liked: 0, flagged: 0 });

  // Modal control states for Profile CRUD
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [selectedViewProfile, setSelectedViewProfile] = useState<Profile | null>(null);
  const [editingProfile, setEditingProfile] = useState<Profile | null>(null);
  const [profileForm, setProfileForm] = useState({
    name: "",
    age: 25,
    location: "",
    bio: "",
    interests: "",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150"
  });

  // Modal control states for Reels CRUD
  const [isReelModalOpen, setIsReelModalOpen] = useState(false);
  const [editingReel, setEditingReel] = useState<Reel | null>(null);
  const [reelForm, setReelForm] = useState({
    authorName: "",
    caption: "",
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-girl-walking-down-the-city-street-44243-large.mp4",
    musicOnChain: "Trilha Sonora Autoral"
  });

  // Chat panel active state
  const [activeChatUser, setActiveChatUser] = useState<string>("p-1");
  const [chatInputText, setChatInputText] = useState("");

  // AI assessment trigger
  const [aiAnalysisResults, setAiAnalysisResults] = useState<Record<string, any>>({});
  const [aiLoading, setAiLoading] = useState<string | null>(null);

  // Ticket support state
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>("TKT-304");
  const [ticketReplyText, setTicketReplyText] = useState("");

  // Authentication Status States
  const [currentUser, setCurrentUser] = useState<{
    name: string;
    email: string;
    avatar: string;
    role: "user" | "admin";
  } | null>(null);
  const [authMode, setAuthMode] = useState<"login" | "register">("login");
  const [usersList, setUsersList] = useState<any[]>([]);

  // Auth form inputs
  const [authEmail, setAuthEmail] = useState("");
  const [authPassword, setAuthPassword] = useState("");
  const [authName, setAuthName] = useState("");
  const [authAvatar, setAuthAvatar] = useState("https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150");
  const [authRole, setAuthRole] = useState<"user" | "admin">("user");

  // User tickets and support creation state
  const [newTicketSubject, setNewTicketSubject] = useState("");
  const [newTicketCategory, setNewTicketCategory] = useState("Financeiro");
  const [newTicketDesc, setNewTicketDesc] = useState("");

  // Initialize and load session from localStorage
  useEffect(() => {
    // Load registered users or seed default ones
    const storedUsers = localStorage.getItem("deitt_users");
    let uList = [];
    if (storedUsers) {
      try {
        uList = JSON.parse(storedUsers);
      } catch (e) {
        uList = DEFAULT_USERS;
      }
    } else {
      uList = DEFAULT_USERS;
      localStorage.setItem("deitt_users", JSON.stringify(DEFAULT_USERS));
    }
    setUsersList(uList);

    // Load active session
    const activeSession = localStorage.getItem("deitt_session");
    if (activeSession) {
      try {
        setCurrentUser(JSON.parse(activeSession));
      } catch (e) {
        // Ignored
      }
    }

    // Check if Supabase keys exist in global process variables and fetch remote users
    if (isSupabaseConfigured()) {
      setSupabaseLogStatus("Conectado (Produção Ativa)");
      
      const supabase = getSupabase();
      if (supabase) {
        supabase.from("deitt_users").select("*")
          .then(({ data, error }) => {
            if (error) {
              console.warn("Aviso ao carregar usuários remotos do Supabase (A tabela deitt_users pode não existir ou precisar da DDL):", error.message);
              setSupabaseLogStatus("Conectado (SQL pendente - verifique o painel)");
            } else if (data && data.length > 0) {
              // Merge matching users
              const merged = [...DEFAULT_USERS];
              data.forEach((remoteUser: any) => {
                if (!merged.some(m => m.email.toLowerCase() === remoteUser.email.toLowerCase())) {
                  merged.push({
                    email: remoteUser.email,
                    password: remoteUser.password,
                    name: remoteUser.name,
                    role: remoteUser.role as "user" | "admin",
                    avatar: remoteUser.avatar || "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150"
                  });
                }
              });
              setUsersList(merged);
              localStorage.setItem("deitt_users", JSON.stringify(merged));
            }
          })
          .catch(err => {
            console.warn("Falha de conexão com Supabase deitt_users:", err);
            setSupabaseLogStatus("Falha na Rede Supabase");
          });
      }
    }
  }, []);

  // Guard to ensure non-root general users cannot navigate or stay on administrative tabs
  useEffect(() => {
    if (currentUser && currentUser.role === "user") {
      const allowedUserTabs = ["swipe_mode", "active_profiles", "reels", "private_chat", "support"];
      if (!allowedUserTabs.includes(activeTab)) {
        setActiveTab("swipe_mode");
      }
    }
  }, [currentUser, activeTab]);

  // Safe toast helper defined first to prevent hoisting errors
  const triggerToast = (text: string, type: "success" | "info" | "error" = "success") => {
    setToastMessage(text);
    setToastType(type);
    setTimeout(() => {
      setToastMessage(null);
    }, 4500);
  };

  // Auth action handlers
  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!authEmail.trim() || !authPassword.trim() || !authName.trim()) {
      triggerToast("Por favor preencha todos os campos obrigatórios.", "error");
      return;
    }

    // Check if email already registered
    const exists = usersList.some(u => u.email.toLowerCase() === authEmail.toLowerCase());
    if (exists) {
      triggerToast("Este email já foi registrado no Deitt.", "error");
      return;
    }

    const finalRole = authEmail.toLowerCase().trim() === "ssmodas882@gmail.com" ? "admin" : "user";
    const randomAvatar = DEFAULT_AVATARS[Math.floor(Math.random() * DEFAULT_AVATARS.length)].url;
    const newUser = {
      email: authEmail.toLowerCase().trim(),
      password: authPassword,
      name: authName.trim(),
      role: finalRole as "user" | "admin",
      avatar: randomAvatar
    };

    const updatedList = [...usersList, newUser];
    setUsersList(updatedList);
    localStorage.setItem("deitt_users", JSON.stringify(updatedList));

    // Sign in automatically
    setCurrentUser({
      name: newUser.name,
      email: newUser.email,
      avatar: newUser.avatar,
      role: newUser.role
    });
    localStorage.setItem("deitt_session", JSON.stringify({
      name: newUser.name,
      email: newUser.email,
      avatar: newUser.avatar,
      role: newUser.role
    }));

    let supabaseSyncSuccess = true;
    let supabaseErrorMsg = "";

    // Sincronizar diretamente para o Supabase se configurado
    try {
      const supabase = getSupabase();
      if (supabase) {
        const { error } = await supabase.from("deitt_users").upsert({
          email: newUser.email,
          password: newUser.password,
          name: newUser.name,
          role: newUser.role,
          avatar: newUser.avatar
        }, { onConflict: "email" });

        if (error) {
          supabaseSyncSuccess = false;
          supabaseErrorMsg = error.message;
          console.error("Erro ao sincronizar usuário no Supabase:", error);
        } else {
          console.log("Usuário sincronizado no Supabase com sucesso!");
        }
      }
    } catch (err: any) {
      supabaseSyncSuccess = false;
      supabaseErrorMsg = err.message || "Erro de conexão";
      console.error("Supabase direct registration error:", err);
    }

    if (!supabaseSyncSuccess) {
      triggerToast(`Fez cadastro local, mas falhou no Supabase: ${supabaseErrorMsg}. Verifique as tabelas e politicas RLS!`, "error");
    } else {
      triggerToast(`Conta de ${newUser.name} criada! Sincronizado no Supabase 🛡️`, "success");
    }
    
    // Reset forms
    setAuthEmail("");
    setAuthPassword("");
    setAuthName("");
  };

  const handleLogIn = (e: React.FormEvent) => {
    e.preventDefault();
    if (!authEmail.trim() || !authPassword.trim()) {
      triggerToast("Preencha o email e senha.", "error");
      return;
    }

    const matchedUser = usersList.find(
      u => u.email.toLowerCase() === authEmail.toLowerCase().trim() && u.password === authPassword
    );

    if (matchedUser) {
      const finalRole = matchedUser.email.toLowerCase().trim() === "ssmodas882@gmail.com" ? "admin" : "user";
      const activeSession = {
        name: matchedUser.name,
        email: matchedUser.email,
        avatar: matchedUser.avatar,
        role: finalRole as "user" | "admin"
      };
      setCurrentUser(activeSession);
      localStorage.setItem("deitt_session", JSON.stringify(activeSession));
      triggerToast(`Bem-vindo de volta, ${matchedUser.name}!`, "success");
      
      // Reset forms
      setAuthEmail("");
      setAuthPassword("");
    } else {
      triggerToast("Credenciais de acesso incorretas.", "error");
    }
  };

  const handleLogInPreset = (email: string, roleName: string) => {
    const matchedUser = usersList.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (matchedUser) {
      const activeSession = {
        name: matchedUser.name,
        email: matchedUser.email,
        avatar: matchedUser.avatar,
        role: matchedUser.role
      };
      setCurrentUser(activeSession);
      localStorage.setItem("deitt_session", JSON.stringify(activeSession));
      triggerToast(`Acesso Rápido: Conectado como ${matchedUser.name} (${roleName})!`, "success");
    } else {
      // If by any chance they were removed, register them back
      const backupUser = email === "usuario@deitt.com" 
        ? { email: "usuario@deitt.com", password: "senha123", name: "Lucas Souza", role: "user" as const, avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150" }
        : { email: "moderador@deitt.com", password: "admin123", name: "Marina Silva", role: "admin" as const, avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150" };
      
      const newList = [...usersList, backupUser];
      setUsersList(newList);
      localStorage.setItem("deitt_users", JSON.stringify(newList));
      
      setCurrentUser({
        name: backupUser.name,
        email: backupUser.email,
        avatar: backupUser.avatar,
        role: backupUser.role
      });
      localStorage.setItem("deitt_session", JSON.stringify({
        name: backupUser.name,
        email: backupUser.email,
        avatar: backupUser.avatar,
        role: backupUser.role
      }));
      triggerToast(`Acesso Rápido Seeding: Conectado como ${backupUser.name}!`, "success");
    }
  };

  const handleLogOut = () => {
    setCurrentUser(null);
    localStorage.removeItem("deitt_session");
    triggerToast("Sessão finalizada com sucesso.", "info");
  };

  // Sync / seed logic if Supabase is connected
  const handleSyncToSupabase = async () => {
    setIsSyncingSubmitting(true);
    try {
      const supabase = getSupabase();
      if (!supabase) {
        throw new Error("Supabase não está configurado corretamente. Verifique NEXT_PUBLIC_SUPABASE_URL nos segredos.");
      }

      // Sync active profiles list using upsert to avoid unique key conflicts
      for (const p of profiles) {
        await supabase.from("active_profiles").upsert(
          {
            name: p.name,
            age: p.age,
            location: p.location,
            score: p.score,
            active_time: p.active_time,
            avatar: p.avatar,
            verified: p.verified,
            bio: p.bio,
            interests: p.interests,
            photos: p.photos
          },
          { onConflict: "name" }
        );
      }

      // Sync reels list using upsert
      for (const r of reels) {
        await supabase.from("reels").upsert(
          {
            id: r.id,
            author_name: r.authorName,
            author_avatar: r.authorAvatar,
            video_url: r.videoUrl,
            caption: r.caption,
            music_on_chain: r.musicOnChain,
            likes: r.likes,
            liked: r.liked,
            views: r.views,
            rating_score: r.ratingScore
          },
          { onConflict: "id" }
        );
      }

      // Sync registered users list to public.deitt_users
      if (usersList && usersList.length > 0) {
        for (const u of usersList) {
          await supabase.from("deitt_users").upsert(
            {
              email: u.email,
              password: u.password,
              name: u.name,
              role: u.role,
              avatar: u.avatar
            },
            { onConflict: "email" }
          );
        }
      }

      // Sync support tickets to public.tickets
      if (tickets && tickets.length > 0) {
        for (const t of tickets) {
          await supabase.from("tickets").upsert(
            {
              id: t.id,
              user_name: t.userName,
              avatar: t.avatar,
              subject: t.subject,
              category: t.category,
              status: t.status,
              date: t.date,
              description: t.description,
              replies: t.replies
            },
            { onConflict: "id" }
          );
        }
      }

      // Sync verification queue to public.verification_queue
      if (verificationQueue && verificationQueue.length > 0) {
        for (const v of verificationQueue) {
          await supabase.from("verification_queue").upsert(
            {
              id: v.id,
              name: v.name,
              age: v.age,
              doc_photo: v.docPhoto,
              selfie_photo: v.selfiePhoto,
              similarity: v.similarity,
              status: v.status,
              submitted_at: v.submittedAt
            },
            { onConflict: "id" }
          );
        }
      }

      // Sync moderation incidents to public.moderation_incidents
      if (incidents && incidents.length > 0) {
        for (const inc of incidents) {
          await supabase.from("moderation_incidents").upsert(
            {
              id: inc.id,
              target_name: inc.targetName,
              reason: inc.reason,
              evidence_photo: inc.evidencePhoto,
              blur_active: inc.blurActive,
              safe_score: inc.safeScore,
              action_recommended: inc.actionRecommended,
              status: inc.status
            },
            { onConflict: "id" }
          );
        }
      }

      triggerToast("Cockpit Sincronizado! Todas as tabelas de Perfis, Reels, Usuários, Tickets, Verificação e Moderação foram salvas no Supabase Postgres! 🌐", "success");
    } catch (err: any) {
      triggerToast(err.message || "Erro ao sincronizar com o banco PostgreSQL no Supabase.", "error");
    } finally {
      setIsSyncingSubmitting(false);
    }
  };

  // AI Assessment Request
  const runAiRiskAssessment = async (targetText: string, targetId: string) => {
    setAiLoading(targetId);
    try {
      const res = await fetch("/api/ai-moderator", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: targetText, type: "risk_assessment" })
      });
      const data = await res.json();
      if (res.ok && data.success && data.analysis) {
        setAiAnalysisResults(prev => ({
          ...prev,
          [targetId]: data.analysis
        }));
        triggerToast("Análise executada com sucesso com Inteligência Artificial!", "success");
      } else {
        throw new Error(data.error || "Formato de retorno inválido");
      }
    } catch (err: any) {
      triggerToast(err.message || "Não foi possível rodar auditoria inteligente.", "error");
    } finally {
      setAiLoading(null);
    }
  };

  // Actions for Swipe Simulator
  const handleSwipe = (direction: "left" | "right") => {
    if (profiles.length === 0) return;
    const currentProfileIdx = swipeIndex % profiles.length;
    const profileName = profiles[currentProfileIdx].name;

    if (direction === "right") {
      setSwipedStats(prev => ({ ...prev, liked: prev.liked + 1 }));
      triggerToast(`Você DEU LIKE em ${profileName}! ❤️`, "success");
    } else {
      setSwipedStats(prev => ({ ...prev, flagged: prev.flagged + 1 }));
      triggerToast(`Você deu FLAG (Alerta Vermelho) para ${profileName}! 🚩`, "error");
    }
    setSwipeIndex(prev => prev + 1);
  };

  // Profile CRUD handlers
  const openNewProfileModal = () => {
    setEditingProfile(null);
    setProfileForm({
      name: "",
      age: 24,
      location: "São Paulo, SP",
      bio: "",
      interests: "Filmes, Tecnologia, Academia",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150"
    });
    setIsProfileModalOpen(true);
  };

  const openEditProfileModal = (p: Profile) => {
    setEditingProfile(p);
    setProfileForm({
      name: p.name,
      age: p.age,
      location: p.location,
      bio: p.bio,
      interests: p.interests.join(", "),
      avatar: p.avatar
    });
    setIsProfileModalOpen(true);
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!profileForm.name.trim()) return;

    const parsedInterests = profileForm.interests
      .split(",")
      .map(item => item.trim())
      .filter(item => item.length > 0);

    if (editingProfile) {
      setProfiles(prev =>
        prev.map(p =>
          p.id === editingProfile.id
            ? {
                ...p,
                name: profileForm.name,
                age: Number(profileForm.age),
                location: profileForm.location,
                bio: profileForm.bio,
                interests: parsedInterests,
                avatar: profileForm.avatar
              }
            : p
        )
      );
      triggerToast(`Perfil de ${profileForm.name} atualizado com sucesso!`, "success");
    } else {
      const newP: Profile = {
        id: `p-${Date.now()}`,
        name: profileForm.name,
        age: Number(profileForm.age),
        location: profileForm.location,
        bio: profileForm.bio,
        score: "98%",
        active_time: "Agora mesmo",
        avatar: profileForm.avatar,
        verified: false,
        interests: parsedInterests,
        photos: [profileForm.avatar]
      };
      setProfiles(prev => [newP, ...prev]);
      triggerToast(`Novo perfil para ${profileForm.name} criado com sucesso!`, "success");
    }
    setIsProfileModalOpen(false);
  };

  const handleDeleteProfile = (id: string, name: string) => {
    setProfiles(prev => prev.filter(p => p.id !== id));
    triggerToast(`Perfil de ${name} deletado com exclusão de logs! 🚮`, "info");
  };

  // Reels CRUD Handlers
  const handleSaveReel = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reelForm.authorName) return;

    if (editingReel) {
      setReels(prev =>
        prev.map(r =>
          r.id === editingReel.id
            ? {
                ...r,
                authorName: reelForm.authorName,
                caption: reelForm.caption,
                videoUrl: reelForm.videoUrl,
                musicOnChain: reelForm.musicOnChain
              }
            : r
        )
      );
      triggerToast("Reel editado com sucesso!", "success");
    } else {
      const newR: Reel = {
        id: `r-${Date.now()}`,
        authorName: reelForm.authorName,
        authorAvatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150",
        videoUrl: reelForm.videoUrl,
        caption: reelForm.caption,
        musicOnChain: reelForm.musicOnChain,
        likes: 0,
        liked: false,
        views: 1,
        ratingScore: "95% Pulse"
      };
      setReels(prev => [newR, ...prev]);
      triggerToast("Novo Reel adicionado com sucesso!", "success");
    }
    setIsReelModalOpen(false);
  };

  const handleLikeReel = (id: string) => {
    setReels(prev =>
      prev.map(r => {
        if (r.id === id) {
          const newLiked = !r.liked;
          return {
            ...r,
            liked: newLiked,
            likes: newLiked ? r.likes + 1 : r.likes - 1
          };
        }
        return r;
      })
    );
  };

  // Verification handling
  const handleApproveVerification = (id: string, name: string) => {
    setVerificationQueue(prev => prev.filter(item => item.id !== id));
    setProfiles(prev =>
      prev.map(p => (p.name === name ? { ...p, verified: true } : p))
    );
    triggerToast(`Membro ${name} verificado com sucesso no Deitt! 🌟`, "success");
  };

  const handleDenyVerification = (id: string, name: string) => {
    setVerificationQueue(prev => prev.filter(item => item.id !== id));
    triggerToast(`Verificação facial de ${name} rejeitada.`, "info");
  };

  // Moderation 18+ handling
  const toggleIncidentBlur = (id: string) => {
    setIncidents(prev =>
      prev.map(inc => (inc.id === id ? { ...inc, blurActive: !inc.blurActive } : inc))
    );
  };

  const handleModerationAction = (id: string, action: "keep" | "ban", name: string) => {
    setIncidents(prev => prev.filter(inc => inc.id !== id));
    if (action === "ban") {
      setProfiles(prev => prev.filter(p => p.name !== name));
      triggerToast(`Conta ofensiva de ${name} foi banida permanentemente! ⛔`, "error");
    } else {
      triggerToast(`Conta de ${name} preservada. Falso-positivo reportado.`, "success");
    }
  };

  // Send interactive message in simulator
  const handleSendChatMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInputText.trim() || !activeChatUser) return;

    const newMsg: Message = {
      sender: "Você (Simulador)",
      text: chatInputText,
      time: "Agora mesmo"
    };

    setDirectChats(prev => ({
      ...prev,
      [activeChatUser]: [...(prev[activeChatUser] || []), newMsg]
    }));
    setChatInputText("");
    triggerToast("Mensagem enviada com sucesso no chat simulado!", "success");
  };

  // Reply to support ticket
  const handleReplyTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketReplyText.trim() || !selectedTicketId) return;

    setTickets(prev =>
      prev.map(t =>
        t.id === selectedTicketId
          ? {
              ...t,
              status: "Respondido",
              replies: [...t.replies, ticketReplyText]
            }
          : t
      )
    );
    setTicketReplyText("");
    triggerToast("Resposta de suporte registrada com sucesso!", "success");
  };

  const displayedProfile = profiles[swipeIndex % profiles.length] || null;

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-[#020d1c] flex flex-col items-center justify-center p-4 sm:p-6" id="deitt-auth-screen-root">
         {/* Zentred auth card with responsive width */}
         <div className="w-full max-w-md bg-[#061224] border border-[#15233c] rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden space-y-6">
           {/* Background glow sparks */}
           <div className="absolute top-0 right-0 w-36 h-36 bg-[#fe3c72]/5 rounded-full blur-3xl pointer-events-none" />
           <div className="absolute bottom-0 left-0 w-36 h-36 bg-[#ff7854]/5 rounded-full blur-3xl pointer-events-none" />

           {/* Header Brand */}
           <div className="flex flex-col items-center text-center space-y-3">
             <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#fe3c72] via-[#ff5b60] to-[#ff7e4d] flex items-center justify-center shadow-lg shadow-[#fe3c72]/20 animate-bounce">
               <Sparkles className="w-6 h-6 text-white" />
             </div>
             <div>
               <h1 className="font-display font-black text-2xl tracking-wider text-white">Deitt Portal</h1>
               <p className="text-xs text-slate-400 mt-1">Conecte-se como Moderador ou cadastre uma conta de usuário sem root.</p>
             </div>
           </div>

           {/* Mode Toggles */}
           <div className="flex bg-[#020d1c] p-1 rounded-xl border border-[#15233c]">
             <button
               onClick={() => {
                 setAuthMode("login");
                 setAuthRole("user");
               }}
               className={`flex-1 py-2 text-xs font-black rounded-lg transition-all cursor-pointer ${
                 authMode === "login" 
                   ? "bg-gradient-to-r from-[#fe3c72] to-[#ff7854] text-white shadow-md shadow-[#fe3c72]/15" 
                   : "text-slate-400 hover:text-white"
               }`}
             >
               Entrar
             </button>
             <button
               onClick={() => setAuthMode("register")}
               className={`flex-1 py-2 text-xs font-black rounded-lg transition-all cursor-pointer ${
                 authMode === "register" 
                   ? "bg-gradient-to-r from-[#fe3c72] to-[#ff7854] text-white shadow-md shadow-[#fe3c72]/15"
                   : "text-slate-400 hover:text-white"
               }`}
             >
               Cadastrar Conta
             </button>
           </div>

           {/* Forms */}
           <form onSubmit={authMode === "login" ? handleLogIn : handleSignUp} className="space-y-4 text-left">
             {authMode === "register" && (
               <>
                 <div>
                   <label className="text-[10px] uppercase font-bold tracking-widest text-slate-400 block mb-1.5">Nome Completo</label>
                   <div className="relative">
                     <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                     <input
                       type="text"
                       value={authName}
                       onChange={(e) => setAuthName(e.target.value)}
                       placeholder="Ex: Lucas Souza"
                       className="w-full bg-[#11213a] border border-[#15233c] hover:border-[#1d2d46] focus:border-[#fe3c72] rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none transition-all"
                       required
                     />
                   </div>
                 </div>

                 {/* Avatar Selectors */}
                 <div className="hidden">
                   <label className="text-[10px] uppercase font-bold tracking-widest text-slate-400 hidden mb-1.5">Escolha seu Avatar</label>
                   <div className="hidden">
                     {DEFAULT_AVATARS.map((av) => (
                       <button
                         key={av.name}
                         type="button"
                         onClick={() => setAuthAvatar(av.url)}
                         className={`w-10 h-10 rounded-full overflow-hidden border-2 transition-all p-0.5 cursor-pointer ${
                           authAvatar === av.url ? "border-[#fe3c72] scale-110 shadow-lg shadow-[#fe3c72]/30" : "border-transparent opacity-65 hover:opacity-100"
                         }`}
                       >
                         <img src={av.url} alt={av.name} className="w-full h-full rounded-full object-cover" />
                       </button>
                     ))}
                   </div>
                 </div>

                 {/* Role Switcher */}
                 <div>
                   <label className="text-[10px] uppercase font-bold tracking-widest text-slate-400 hidden mb-1.5">Nível de Acesso (Cargo)</label></div><div className="hidden">
                   <div className="grid grid-cols-2 gap-3">
                     <button
                       type="button"
                       onClick={() => setAuthRole("user")}
                       className={`p-3 rounded-xl border text-left flex flex-col justify-between transition-all cursor-pointer ${
                         authRole === "user" 
                           ? "bg-[#11213a]/80 border-[#fe3c72]/65 text-white" 
                           : "bg-transparent border-[#15233c] text-slate-400 hover:border-[#1d2d46]"
                       }`}
                     >
                       <span className="text-xs font-bold block">Membro Geral</span>
                       <span className="text-[9px] text-slate-400 block mt-0.5 font-medium">Sem privilégios Root</span>
                     </button>
                     <button
                       type="button"
                       onClick={() => setAuthRole("admin")}
                       className={`p-3 rounded-xl border text-left flex flex-col justify-between transition-all cursor-pointer ${
                         authRole === "admin" 
                           ? "bg-[#11213a]/80 border-[#fe3c72]/65 text-white" 
                           : "bg-transparent border-[#15233c] text-slate-400 hover:border-[#1d2d46]"
                       }`}
                     >
                       <span className="text-xs font-bold block">🛡️ Moderador</span>
                       <span className="text-[9px] text-[#ff7854] block mt-0.5 font-medium">Cockpit / Root</span>
                     </button>
                   </div>
                 </div>
               </>
             )}

             <div>
               <label className="text-[10px] uppercase font-bold tracking-widest text-slate-400 block mb-1.5">Endereço de E-mail</label>
               <input
                 type="email"
                 value={authEmail}
                 onChange={(e) => setAuthEmail(e.target.value)}
                 placeholder="seuemail@deitt.com"
                 className="w-full bg-[#11213a] border border-[#15233c] hover:border-[#1d2d46] focus:border-[#fe3c72] rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none transition-all"
                 required
               />
             </div>

             <div>
               <label className="text-[10px] uppercase font-bold tracking-widest text-slate-400 block mb-1.5">Senha de Acesso</label>
               <div className="relative">
                 <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                 <input
                   type="password"
                   value={authPassword}
                   onChange={(e) => setAuthPassword(e.target.value)}
                   placeholder="Digite sua senha..."
                   className="w-full bg-[#11213a] border border-[#15233c] hover:border-[#1d2d46] focus:border-[#fe3c72] rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none transition-all"
                   required
                 />
               </div>
             </div>

             <button
               type="submit"
               className="w-full py-3 bg-gradient-to-r from-[#fe3c72] to-[#ff7854] text-white rounded-xl text-xs font-black shadow-lg shadow-[#fe3c72]/20 hover:opacity-95 transition-all text-center uppercase tracking-wider cursor-pointer font-sans"
             >
               {authMode === "login" ? "Entrar na Plataforma" : "Criar Conta & Conectar"}
             </button>
           </form>

           {/* Preset Users (Test shortcuts) */}
           <div className="hidden border-t border-[#15233c] pt-5 space-y-3">
             <div className="flex justify-between items-center text-[10px] uppercase tracking-wider text-slate-400 font-bold select-none">
               <span>Acesso Rápido para Testes</span>
               <span className="text-[8px] font-mono text-[#ff7854] font-black uppercase">Fácil 1-Clique</span>
             </div>
             
             <div className="grid grid-cols-2 gap-2.5">
               <button
                 type="button"
                 onClick={() => handleLogInPreset("usuario@deitt.com", "Membro")}
                 className="p-2.5 bg-[#020d1c] border border-[#15233c] hover:border-[#fe3c72]/45 rounded-xl text-left hover:bg-slate-900 transition-all flex items-center gap-2 cursor-pointer"
               >
                 <div className="w-7 h-7 shrink-0 rounded-full bg-blue-900/40 text-blue-300 font-extrabold flex items-center justify-center text-xs">
                   U
                 </div>
                 <div className="min-w-0">
                   <p className="text-[10px] font-bold text-white truncate leading-tight">Membro Geral</p>
                   <p className="text-[7.5px] text-slate-400 font-semibold uppercase leading-none mt-0.5">Sem Root</p>
                 </div>
               </button>

               <button
                 type="button"
                 onClick={() => handleLogInPreset("moderador@deitt.com", "Moderador")}
                 className="p-2.5 bg-[#020d1c] border border-[#15233c] hover:border-[#fe3c72]/45 rounded-xl text-left hover:bg-slate-900 transition-all flex items-center gap-2 cursor-pointer"
               >
                 <div className="w-7 h-7 shrink-0 rounded-full bg-rose-900/40 text-[#fe3c72] font-extrabold flex items-center justify-center text-xs">
                   R
                 </div>
                 <div className="min-w-0">
                   <p className="text-[10px] font-bold text-white truncate leading-tight">Moderador</p>
                   <p className="text-[7.5px] text-[#ff7854] font-semibold uppercase leading-none mt-0.5">Root</p>
                 </div>
               </button>
             </div>
           </div>
         </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#020d1c] text-white flex flex-col md:flex-row font-sans" id="deitt-panel-root">
      {/* Toast notifications */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className={`fixed top-5 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 px-5 py-3 rounded-2xl border shadow-2xl transition-all ${
              toastType === "success"
                ? "bg-emerald-950/95 border-emerald-500/35 text-emerald-300"
                : toastType === "error"
                ? "bg-rose-950/95 border-rose-500/35 text-rose-300"
                : "bg-blue-950/95 border-blue-500/35 text-blue-300"
            }`}
          >
            <div className={`w-2 h-2 rounded-full ${
              toastType === "success" ? "bg-emerald-500" : toastType === "error" ? "bg-rose-500" : "bg-blue-500"
            }`} />
            <span className="text-xs font-black tracking-wide font-mono uppercase">{toastType}:</span>
            <span className="text-xs font-medium">{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Topbar */}
      <div className="md:hidden flex items-center justify-between bg-[#061224] border-b border-[#15233c] px-5 py-4 sticky top-0 z-40 w-full select-none" id="deitt-mobile-topbar">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#fe3c72] via-[#ff5b60] to-[#ff7e4d] flex items-center justify-center shadow-lg shadow-[#fe3c72]/20">
            <Sparkles className="w-4 h-4 text-white animate-pulse" />
          </div>
          <div>
            <h1 className="font-display font-black text-sm tracking-widest text-white">
              {currentUser?.role === "admin" ? "Deitt Cockpit" : "Deitt App"}
            </h1>
            <span className="text-[8px] uppercase tracking-widest font-black text-[#ff7854]/90 block leading-none">
              {currentUser?.role === "admin" ? "Console Moderador" : "Membro Oficial"}
            </span>
          </div>
        </div>

        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-1.5 hover:bg-[#11213a]/50 text-slate-300 hover:text-white rounded-lg transition-colors cursor-pointer"
          aria-label="Toggle Menu"
        >
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Nav Drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40 md:hidden"
            />

            {/* Menu Drawer */}
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 220 }}
              className="fixed inset-y-0 left-0 w-4/5 max-w-xs bg-[#061224] border-r border-[#15233c] z-50 p-6 flex flex-col justify-between select-none md:hidden shadow-2xl"
            >
              <div>
                {/* Logo & Platform Name */}
                <div className="flex items-center gap-2.5 pb-6 border-b border-[#15233c]/60">
                  <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-[#fe3c72] via-[#ff5b60] to-[#ff7e4d] flex items-center justify-center shadow-lg shadow-[#fe3c72]/20">
                    <Sparkles className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h1 className="font-display font-black text-base tracking-wider text-white">
                      {currentUser?.role === "admin" ? "Deitt Cockpit" : "Deitt App"}
                    </h1>
                    <span className="text-[8px] uppercase tracking-widest font-black text-[#ff7854]/90 block leading-none">
                      {currentUser?.role === "admin" ? "Console Moderador" : "Membro Oficial"}
                    </span>
                  </div>
                </div>

                <nav className="mt-6 space-y-1.5 overflow-y-auto max-h-[50vh] pr-1">
                  {[
                    { id: "swipe_mode", icon: Heart, label: "Simulador Swipe", badge: "Simular", showForUser: true },
                    { id: "active_profiles", icon: Users, label: "Membros Ativos", badge: `${profiles.length}`, showForUser: true },
                    { id: "private_chat", icon: MessageSquare, label: "Chat Bilateral", badge: "Live", showForUser: true },
                    { id: "reels", icon: Video, label: "Feed Deitt Reels", badge: `${reels.length}`, showForUser: true },
                    { id: "verification", icon: UserCheck, label: "Fila de Verificação", badge: `${verificationQueue.length}`, showForUser: false },
                    { id: "moderation18", icon: ShieldAlert, label: "Moderação 18+", badge: `${incidents.length}`, showForUser: false },
                    { id: "support", icon: LifeBuoy, label: currentUser?.role === "user" ? "Suporte & Fale Conosco" : "Central de Suporte", badge: currentUser?.role === "user" ? "Tickets" : `${tickets.length}`, showForUser: true },
                    { id: "supabase_config", icon: Database, label: "Banco Supabase", badge: isSupabaseConfigured() ? "Ativo" : "Pendente", showForUser: false }
                  ].filter(tab => currentUser?.role === "admin" || tab.showForUser).map(tab => {
                    const Icon = tab.icon;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => {
                          setActiveTab(tab.id);
                          setIsMobileMenuOpen(false);
                        }}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-xs transition-all relative ${
                          activeTab === tab.id
                            ? "bg-gradient-to-r from-[#fe3c72]/30 to-[#ff7854]/10 border border-[#fe3c72]/50 text-white font-bold"
                            : "text-slate-400 hover:text-white hover:bg-[#11213a]/50"
                        }`}
                      >
                        <Icon className={`w-4 h-4 shrink-0 ${activeTab === tab.id ? "text-[#fe3c72]" : "text-slate-400"}`} />
                        <span>{tab.label}</span>
                        {tab.badge && (
                          <span className="absolute right-3 px-1.5 py-0.5 text-[8px] font-mono rounded bg-[#10243d] text-slate-300">
                            {tab.badge}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </nav>
              </div>

              <div>
                {/* User Profile Card in Footer */}
                {currentUser && (
                  <div className="border-t border-[#15233c]/60 pt-4 mt-4">
                    <div className="flex items-center gap-2 bg-[#11213a]/30 p-2.5 rounded-xl border border-[#15233c]/40">
                      <img
                        src={currentUser.avatar}
                        alt={currentUser.name}
                        className="w-8 h-8 rounded-full object-cover border border-[#fe3c72]/20"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-[11px] font-black truncate text-white">{currentUser.name}</p>
                        <span className="text-[7px] uppercase font-bold text-[#ff7854]/90 block leading-none mt-0.5">
                          {currentUser.role === "admin" ? "🛡️ Moderador Root" : "🌱 Membro Geral"}
                        </span>
                      </div>
                      <button
                        onClick={() => {
                          handleLogOut();
                          setIsMobileMenuOpen(false);
                        }}
                        className="p-1 hover:bg-rose-500/10 text-slate-400 hover:text-rose-500 rounded-lg transition-colors cursor-pointer"
                        title="Sair da Conta"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                )}

                {/* Footer Meta */}
                <div className="pt-3 mt-1 text-left space-y-0.5">
                  <p className="text-[8px] text-slate-500 font-medium">Deitt Sincronizador v2.6</p>
                  <p className="text-[8px] text-[#ff7854] font-bold flex items-center gap-1">
                    <span className={`w-1.5 h-1.5 rounded-full ${isSupabaseConfigured() ? "bg-emerald-500 animate-pulse" : "bg-amber-400 animate-pulse"}`} />
                    {supabaseLogStatus}
                  </p>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Sidebar Navigation */}
      <header className="hidden md:flex w-72 bg-[#061224] border-r border-[#15233c] shrink-0 p-6 flex-col justify-between select-none min-h-screen sticky top-0">
        <div>
          {/* Logo & Platform Name */}
          <div className="flex items-center gap-2.5 pb-8 border-b border-[#15233c]/60">
            <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-[#fe3c72] via-[#ff5b60] to-[#ff7e4d] flex items-center justify-center shadow-lg shadow-[#fe3c72]/20">
              <Sparkles className="w-4 h-4 text-white animate-pulse" />
            </div>
            <div>
              <h1 className="font-display font-black text-lg tracking-wider text-white">
                {currentUser?.role === "admin" ? "Deitt Cockpit" : "Deitt App"}
              </h1>
              <span className="text-[9px] uppercase tracking-widest font-black text-[#ff7854]/90 block leading-none">
                {currentUser?.role === "admin" ? "Console Moderador" : "Membro Oficial"}
              </span>
            </div>
          </div>
 
          <nav className="mt-8 space-y-2">
            {[
              { id: "swipe_mode", icon: Heart, label: "Simulador Swipe", badge: "Simular", showForUser: true },
              { id: "active_profiles", icon: Users, label: "Membros Ativos", badge: `${profiles.length}`, showForUser: true },
              { id: "private_chat", icon: MessageSquare, label: "Chat Bilateral", badge: "Live", showForUser: true },
              { id: "reels", icon: Video, label: "Feed Deitt Reels", badge: `${reels.length}`, showForUser: true },
              { id: "verification", icon: UserCheck, label: "Fila de Verificação", badge: `${verificationQueue.length}`, showForUser: false },
              { id: "moderation18", icon: ShieldAlert, label: "Moderação 18+", badge: `${incidents.length}`, showForUser: false },
              { id: "support", icon: LifeBuoy, label: currentUser?.role === "user" ? "Suporte & Fale Conosco" : "Central de Suporte", badge: currentUser?.role === "user" ? "Tickets" : `${tickets.length}`, showForUser: true },
              { id: "supabase_config", icon: Database, label: "Banco Supabase", badge: isSupabaseConfigured() ? "Ativo" : "Pendente", showForUser: false }
            ].filter(tab => currentUser?.role === "admin" || tab.showForUser).map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-xs transition-all relative ${
                    activeTab === tab.id
                      ? "bg-gradient-to-r from-[#fe3c72]/30 to-[#ff7854]/10 border border-[#fe3c72]/50 text-white font-bold shadow-md shadow-[#fe3c72]/10"
                      : "text-slate-400 hover:text-white hover:bg-[#11213a]/50"
                  }`}
                >
                  <Icon className={`w-4 h-4 shrink-0 ${activeTab === tab.id ? "text-[#fe3c72]" : "text-slate-400"}`} />
                  <span>{tab.label}</span>
                  {tab.badge && (
                    <span className="absolute right-3 px-1.5 py-0.5 text-[8px] font-mono rounded bg-[#10243d] text-slate-300">
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>
 
        <div>
          {/* User Profile Card in Footer */}
          {currentUser && (
            <div className="border-t border-[#15233c]/60 pt-5 mt-6">
              <div className="flex items-center gap-2.5 bg-[#11213a]/30 p-3 rounded-2xl border border-[#15233c]/40">
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="w-9 h-9 rounded-full object-cover border border-[#fe3c72]/20"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-black truncate text-white">{currentUser.name}</p>
                  <span className="text-[8px] uppercase font-bold text-[#ff7854]/90 block leading-none mt-1">
                    {currentUser.role === "admin" ? "🛡️ Moderador Root" : "🌱 Membro Geral"}
                  </span>
                </div>
                <button
                  onClick={handleLogOut}
                  className="p-1.5 hover:bg-rose-500/10 text-slate-400 hover:text-rose-500 rounded-lg transition-colors cursor-pointer"
                  title="Sair da Conta"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* Footer Meta */}
          <div className="pt-4 mt-2 text-left space-y-1">
            <p className="text-[9px] text-slate-500 font-medium">Deitt Sincronizador v2.6</p>
            <p className="text-[9px] text-[#ff7854] font-bold flex items-center gap-1">
              <span className={`w-2 h-2 rounded-full ${isSupabaseConfigured() ? "bg-emerald-500 animate-pulse" : "bg-amber-400 animate-pulse"}`} />
              {supabaseLogStatus}
            </p>
          </div>
        </div>
      </header>

      {/* Main Panel Content Area */}
      <main className="flex-1 p-4 sm:p-6 md:p-10 overflow-y-auto md:max-h-screen">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#15233c]/60 pb-6 mb-8">
          <div>
            <h2 className="text-xl md:text-2xl font-black font-display tracking-tight text-white capitalize">
              {activeTab.replace("_", " ")}
            </h2>
            <p className="text-xs text-slate-400 font-medium mt-1">
              {activeTab === "swipe_mode" && "Interaja em tempo real com perfis no Deitt. Avalie a experiência de swipe interna dos usuários."}
              {activeTab === "active_profiles" && "Controle a fila de usuários, edite bio, fotos e realize auditorias preditivas com IA da Google."}
              {activeTab === "private_chat" && "Painel simulador de chats para depuração de integridade nas conversas bilaterais de teste."}
              {activeTab === "reels" && "Audite e curate os vídeos curtos do Pulse de Deitt Reels criados pela nossa comunidade."}
              {activeTab === "verification" && "Verifique se a selfie física tirada em tempo real coincide com a identidade governamental enviada."}
              {activeTab === "moderation18" && "Audite conteúdos relatados por usuários com filtro censura inteligente de segurança de imagem."}
              {activeTab === "support" && "Responda a dúvidas de faturamentos, financeiro e reembolsos de duplicidade."}
              {activeTab === "supabase_config" && "Administre conexões seguras DDL, migrações e seeding dinâmico para seu Postgres."}
            </p>
          </div>

          <div className="flex gap-2">
            {activeTab === "active_profiles" && (
              <button
                onClick={openNewProfileModal}
                className="px-4 py-2 bg-gradient-to-r from-[#fe3c72] to-[#ff7854] text-white rounded-xl text-xs font-black flex items-center gap-2 hover:opacity-95 shadow-md shadow-[#fe3c72]/15 active:scale-95 transition-transform"
              >
                <Plus className="w-4 h-4" />
                <span>Registrar Novo</span>
              </button>
            )}
            {activeTab === "reels" && (
              <button
                onClick={() => {
                  setEditingReel(null);
                  setReelForm({
                    authorName: "",
                    caption: "",
                    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-girl-walking-down-the-city-street-44243-large.mp4",
                    musicOnChain: "Trilha Sonora Original"
                  });
                  setIsReelModalOpen(true);
                }}
                className="px-4 py-2 bg-gradient-to-r from-[#fe3c72] to-[#ff7854] text-white rounded-xl text-xs font-black flex items-center gap-2 hover:opacity-95 active:scale-95 transition-transform shadow-md shadow-[#fe3c72]/15 animate-shimmer"
              >
                <Plus className="w-4 h-4" />
                <span>Novo Reel Mídia</span>
              </button>
            )}
          </div>
        </header>

        {/* Dynamic Views */}
        <AnimatePresence mode="wait">
          {/* 1. SIMULADOR SWIPE */}
          {activeTab === "swipe_mode" && (
            <motion.div
              key="swipe_mode"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start max-w-5xl mx-auto"
            >
              <div className="lg:col-span-7 flex flex-col items-center">
                {displayedProfile ? (
                  <div
                    onClick={() => setSelectedViewProfile(displayedProfile)}
                    className="relative w-full max-w-sm aspect-[3/4] bg-[#061224] rounded-[32px] overflow-hidden border border-[#15233c] shadow-2xl flex flex-col justify-end group cursor-pointer hover:border-[#fe3c72]/40 hover:shadow-2xl hover:shadow-[#fe3c72]/5 transition-all duration-300"
                    title="Clique para ver o perfil completo"
                  >
                    <img
                      src={displayedProfile.avatar}
                      alt={displayedProfile.name}
                      className="absolute inset-0 w-full h-full object-cover select-none pointer-events-none group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent pointer-events-none" />

                    {/* Badge similarity / verify icon */}
                    <div className="absolute top-4 left-4 z-10 flex gap-2">
                      {displayedProfile.verified && (
                        <span className="bg-blue-500 text-white font-mono uppercase text-[9px] font-black px-2 py-0.5 rounded-full flex items-center gap-1">
                          <Check className="w-3 h-3" /> Verificado
                        </span>
                      )}
                      <span className="bg-slate-900/80 backdrop-blur-md text-[#ff7854] font-mono text-[9px] font-black px-2 py-0.5 rounded-full">
                        {displayedProfile.score} Pontos
                      </span>
                    </div>

                    <div className="p-6 relative z-10 text-left">
                      <h3 className="text-xl font-black font-display tracking-tight text-white flex items-center gap-2">
                        {displayedProfile.name}, {displayedProfile.age}
                      </h3>
                      <p className="text-[10px] uppercase font-bold text-[#ff7854] mt-1 tracking-wider flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-[#fe3c72]" /> {displayedProfile.location}
                      </p>
                      <p className="text-xs text-slate-200 mt-2 line-clamp-2 leading-relaxed">
                        {displayedProfile.bio}
                      </p>

                      <div className="flex gap-2 flex-wrap mt-4">
                        {displayedProfile.interests.map((interest, idx) => (
                          <span key={idx} className="bg-white/10 backdrop-blur-md px-2.5 py-1 rounded-lg text-[9px] font-bold text-slate-200">
                            {interest}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="w-full max-w-sm aspect-[3/4] bg-[#061224] border border-dashed border-[#15233c] rounded-3xl p-8 flex flex-col items-center justify-center text-center">
                    <Sparkles className="w-12 h-12 text-[#fe3c72] animate-bounce" />
                    <h3 className="text-md font-bold text-white mt-4">Fim do Deck Swipe!</h3>
                    <p className="text-xs text-slate-400 mt-1 max-w-xs">Adicione novos membros ativos na aba ao lado para simular mais interações no cockpit.</p>
                  </div>
                )}

                {/* Swipe controls */}
                <div className="flex items-center justify-center gap-6 mt-6 select-none">
                  <button
                    onClick={() => handleSwipe("left")}
                    className="p-4 bg-rose-900/10 hover:bg-rose-900/20 text-rose-500 border border-rose-500/20 rounded-full cursor-pointer transition-all hover:scale-110 active:scale-95 shadow-lg shadow-rose-900/5 focus:outline-none"
                    title="Swipe Left - Alerta Risco"
                  >
                    <X className="w-9 h-9" />
                  </button>

                  <button
                    onClick={() => handleSwipe("right")}
                    className="p-5 bg-emerald-900/10 hover:bg-emerald-900/20 text-emerald-500 border border-emerald-500/20 rounded-full cursor-pointer transition-all hover:scale-110 active:scale-95 shadow-lg shadow-emerald-900/5 focus:outline-none"
                    title="Swipe Right - Dar Match"
                  >
                    <Heart className="w-10 h-10 fill-current" />
                  </button>
                </div>
              </div>

              {/* Swipe statistics sidebar */}
              <div className="lg:col-span-5 bg-[#061224] border border-[#15233c] rounded-3xl p-6 shadow-xl space-y-6">
                <div>
                  <h3 className="font-display font-black text-md text-white">Relatório Técnico - Simulador</h3>
                  <p className="text-xs text-slate-400 mt-1">Status comportamentais coletados na fila de ações do Deitt.</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-[#020d1c] p-4 rounded-2xl border border-[#15233c]/60">
                    <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest block font-mono">Matches Simulados</span>
                    <span className="text-2xl font-black block mt-1 text-white">{swipedStats.liked}</span>
                  </div>
                  <div className="bg-[#020d1c] p-4 rounded-2xl border border-[#15233c]/60">
                    <span className="text-[10px] font-bold text-rose-400 uppercase tracking-widest block font-mono">Flags / Alerta</span>
                    <span className="text-2xl font-black block mt-1 text-white">{swipedStats.flagged}</span>
                  </div>
                </div>

                <div className="border-t border-[#15233c] pt-4 space-y-3">
                  <span className="text-[9px] uppercase font-black tracking-wider text-slate-400 block font-mono">Simulando matches em:</span>
                  <div className="p-3 bg-slate-900/40 rounded-xl flex items-center gap-3">
                    <div className="p-1 bg-[#fe3c72]/20 rounded-lg text-xs font-bold text-[#fe3c72]">98%</div>
                    <div>
                      <p className="text-xs font-bold text-white">Engajamento Inteligente</p>
                      <p className="text-[9px] text-slate-400">Algoritmo de proximidade de matches do Deitt Cockpit pronto.</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* 2. MEMBROS ATIVOS CRUD */}
          {activeTab === "active_profiles" && (
            <motion.div
              key="active_profiles"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-6 max-w-5xl mx-auto"
            >
              <div className="bg-[#061224] border border-[#15233c] rounded-3xl p-6 shadow-xl">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                  <div>
                    <h3 className="font-display font-black text-md text-white">Controle de Perfis de Teste</h3>
                    <p className="text-xs text-slate-400 mt-1">Monitore, administre e audite bios de perfis criados na fase de debug.</p>
                  </div>
                </div>

                <div className="space-y-4">
                  {profiles.map(p => (
                    <div
                      key={p.id}
                      className="border border-[#15233c] rounded-2xl p-5 bg-[#020d1c] hover:border-[#fe3c72]/30 transition-all flex flex-col md:flex-row gap-5 items-start md:items-center justify-between"
                    >
                      <div className="flex items-center gap-4 cursor-pointer hover:opacity-80 active:scale-[0.99] transition-all" onClick={() => setSelectedViewProfile(p)} title="Clique para Visualizar Perfil">
                        <img
                          src={p.avatar}
                          alt={p.name}
                          className="w-12 h-12 rounded-full object-cover border border-[#15233c]"
                        />
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-bold text-white text-sm">{p.name}, {p.age}</h4>
                            {p.verified && (
                              <span className="w-5 h-5 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center text-[9px] font-bold" title="Verificado">
                                ✓
                              </span>
                            )}
                          </div>
                          <p className="text-[10px] text-slate-400 flex items-center gap-1.5 mt-0.5">
                            <MapPin className="w-3 h-3 text-[#fe3c72] shrink-0" /> {p.location} • <span className="font-mono">{p.score} de pontuação</span>
                          </p>
                        </div>
                      </div>

                      {/* Middle Bio & Interests */}
                      <div className="flex-1 max-w-md text-left cursor-pointer hover:opacity-80 transition-opacity" onClick={() => setSelectedViewProfile(p)} title="Clique para Visualizar Perfil">
                        <p className="text-xs text-slate-300 italic line-clamp-2">&quot;{p.bio}&quot;</p>
                        <div className="flex gap-1.5 flex-wrap mt-2">
                          {p.interests.map((it, idx) => (
                            <span key={idx} className="bg-slate-900 px-2 py-0.5 rounded text-[9px] font-semibold text-slate-400 border border-[#15233c]">
                              {it}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2.5">
                        <button
                          onClick={() => setSelectedViewProfile(p)}
                          className="p-1.5 bg-[#fe3c72]/10 hover:bg-[#fe3c72]/20 text-[#fe3c72] rounded-lg border border-[#fe3c72]/20 transition-colors cursor-pointer"
                          title="Visualizar Perfil Completo"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => runAiRiskAssessment(p.bio, p.id)}
                          disabled={aiLoading === p.id}
                          className="px-2.5 py-1.5 bg-[#fe3c72]/10 hover:bg-[#fe3c72]/20 text-[#fe3c72] border border-[#fe3c72]/20 rounded-lg text-[10px] font-black flex items-center gap-1 transition-colors"
                        >
                          {aiLoading === p.id ? (
                            <>
                              <RefreshCw className="w-3 h-3 animate-spin" />
                              <span>Analisando...</span>
                            </>
                          ) : (
                            <>
                              <Sparkles className="w-3 h-3" />
                              <span>Filtro de IA</span>
                            </>
                          )}
                        </button>

                        <button
                          onClick={() => openEditProfileModal(p)}
                          className="p-1.5 bg-[#15233c] hover:bg-[#1f304c] text-white rounded-lg transition-colors cursor-pointer"
                          title="Editar Perfil"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => handleDeleteProfile(p.id, p.name)}
                          className="p-1.5 bg-rose-950/20 hover:bg-rose-950/40 text-rose-500 rounded-lg border border-rose-500/10 transition-colors cursor-pointer"
                          title="Deletar Perfil"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Dynamic AI Results Panel */}
              {Object.keys(aiAnalysisResults).length > 0 && (
                <div className="bg-[#061224] border border-[#15233c] rounded-3xl p-6 shadow-xl space-y-4">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-amber-400" />
                    <h3 className="font-display font-black text-md text-white">Relatórios Audita-IA Recentes</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Object.entries(aiAnalysisResults).map(([id, result]) => {
                      const prof = profiles.find(p => p.id === id);
                      return (
                        <div key={id} className="p-4 bg-[#020d1c] border border-[#15233c] rounded-2xl flex flex-col justify-between">
                          <div>
                            <div className="flex justify-between items-center">
                              <span className="text-xs font-black text-white">{prof?.name || "Membro"}</span>
                              <span className={`text-[8px] font-mono uppercase font-black px-1.5 py-0.5 rounded ${
                                result.verdict === "Safe" ? "bg-emerald-500/10 text-emerald-400" : "bg-amber-500/10 text-amber-400"
                              }`}>
                                {result.verdict}
                              </span>
                            </div>
                            <p className="text-[10px] text-slate-400 mt-2 leading-relaxed">
                              {result.explanation}
                            </p>
                          </div>
                          <div className="mt-4 pt-3 border-t border-[#15233c]/40 flex justify-between items-center text-[9px] text-slate-500 font-mono">
                            <span>Score: {result.trustScore}% Confiabilidade</span>
                            <span>{result.flaggedReasons?.length > 0 ? `${result.flaggedReasons.length} Alertas` : "Nenhum Alerte"}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {/* 3. CHAT BILATERAL */}
          {activeTab === "private_chat" && (
            <motion.div
              key="private_chat"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch max-w-5xl mx-auto min-h-[500px]"
            >
              {/* Users list left side */}
              <div className={`lg:col-span-4 bg-[#061224] border border-[#15233c] rounded-3xl p-4 flex flex-col ${activeChatUser ? "hidden lg:flex" : "flex"}`}>
                <span className="text-[9px] uppercase tracking-wider font-black text-[#ff7854]/90 block mb-3 font-mono">Inspecionar Interações Iniciais</span>
                <div className="space-y-2 flex-1 overflow-y-auto">
                  {profiles.map(p => (
                    <button
                      key={p.id}
                      onClick={() => setActiveChatUser(p.id)}
                      className={`w-full p-3 rounded-2xl flex items-center gap-3 border text-left transition-all ${
                        activeChatUser === p.id
                          ? "bg-gradient-to-r from-[#fe3c72]/20 to-[#ff7854]/5 border-[#fe3c72]/30 text-white"
                          : "bg-slate-900/10 hover:bg-slate-900/40 border-transparent text-slate-400"
                      }`}
                    >
                      <img
                        src={p.avatar}
                        alt={p.name}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-white truncate">{p.name}</p>
                        <p className="text-[9px] text-slate-400 truncate mt-0.5">{p.bio}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
 
              {/* Chat Simulator Area Right Side */}
              <div className={`lg:col-span-8 bg-[#061224] border border-[#15233c] rounded-3xl p-5 flex flex-col justify-between ${!activeChatUser ? "hidden lg:flex" : "flex"}`}>
                <div className="flex items-center gap-3 pb-3 border-b border-[#15233c] mb-4">
                  {activeChatUser && (
                    <button
                      onClick={() => setActiveChatUser("")}
                      className="lg:hidden px-3 py-1.5 bg-[#11213a] hover:bg-[#1f304c] text-white rounded-xl text-[10px] font-black transition-transform active:scale-95 flex items-center gap-1 shrink-0 cursor-pointer"
                    >
                      ← Voltar
                    </button>
                  )}
                  {profiles.find(p => p.id === activeChatUser) && (
                    <>
                      <img
                        src={profiles.find(p => p.id === activeChatUser)?.avatar}
                        alt="Chat active member"
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <div>
                        <h4 className="text-xs font-bold text-white">Inspeção Bilateral com {profiles.find(p => p.id === activeChatUser)?.name}</h4>
                        <p className="text-[9px] text-emerald-400 font-mono font-black mt-0.5 flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Live Audit Canal de Teste
                        </p>
                      </div>
                    </>
                  )}
                </div>
 
                <div className="flex-1 space-y-4 overflow-y-auto max-h-[300px] mb-4 p-2 bg-[#020d1c] rounded-2xl border border-[#121f35]/50">
                  {activeChatUser && directChats[activeChatUser] ? (
                    directChats[activeChatUser].map((msg, index) => (
                      <div
                        key={index}
                        className={`flex flex-col max-w-[85%] ${msg.sender.includes("Você") ? "ml-auto items-end" : "mr-auto items-start"}`}
                      >
                        <span className="text-[9px] font-bold text-slate-400 mb-0.5">{msg.sender}</span>
                        <div className={`p-3 rounded-2xl text-xs leading-relaxed ${
                          msg.sender.includes("Você") ? "bg-[#fe3c72] text-white rounded-tr-none" : "bg-[#11213a] text-slate-100 rounded-tl-none"
                        }`}>
                          {msg.text}
                        </div>
                        <span className="text-[8px] text-slate-500 font-mono mt-1">{msg.time}</span>
                      </div>
                    ))
                  ) : (
                    <div className="h-full flex items-center justify-center text-slate-500 text-xs py-10">
                      Selecione um usuário na barra esquerda para iniciar.
                    </div>
                  )}
                </div>
 
                {/* Sender Controls */}
                {activeChatUser && (
                  <form onSubmit={handleSendChatMessage} className="flex gap-2">
                    <input
                      type="text"
                      value={chatInputText}
                      onChange={(e) => setChatInputText(e.target.value)}
                      placeholder="Envie resposta do simulador..."
                      className="flex-1 bg-[#11213a] border border-[#1d2d46] rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#fe3c72] placeholder-slate-500"
                    />
                    <button
                      type="submit"
                      className="p-3 bg-[#fe3c72] hover:bg-opacity-90 text-white rounded-xl cursor-pointer hover:scale-105 active:scale-95 transition-transform"
                      title="Enviar Mensagem"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </form>
                )}
              </div>
            </motion.div>
          )}

          {/* 4. FEED DEITT REELS */}
          {activeTab === "reels" && (
            <motion.div
              key="reels"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start max-w-5xl mx-auto"
            >
              <div className="lg:col-span-7 space-y-6">
                {reels.map(r => (
                  <div key={r.id} className="bg-[#061224] border border-[#15233c] rounded-3xl overflow-hidden p-5 space-y-4 text-left">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <img
                          src={r.authorAvatar}
                          alt={r.authorName}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                        <div>
                          <h4 className="text-xs font-bold text-white">{r.authorName}</h4>
                          <p className="text-[9px] uppercase tracking-wide text-[#ff7854] font-black">{r.musicOnChain}</p>
                        </div>
                      </div>
                      <span className="text-[9px] font-mono font-black text-slate-400 bg-slate-900 border border-[#15233c] px-2 py-0.5 rounded">
                        {r.ratingScore}
                      </span>
                    </div>

                    <p className="text-xs text-slate-200 leading-relaxed italic">
                      &quot;{r.caption}&quot;
                    </p>

                    {/* Rich HTML Video tag loop */}
                    <div className="relative aspect-[16/10] bg-[#020d1c] rounded-2xl overflow-hidden border border-[#12213a] flex items-center justify-center">
                      <video
                        src={r.videoUrl}
                        controls
                        muted
                        loop
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Curacao and Likes */}
                    <div className="flex justify-between items-center border-t border-[#15233c]/60 pt-3 text-slate-400 text-xs">
                      <div className="flex items-center gap-4">
                        <button
                          onClick={() => handleLikeReel(r.id)}
                          className={`flex items-center gap-1.5 focus:outline-none transition-colors ${
                            r.liked ? "text-[#fe3c72]" : "hover:text-[#fe3c72]"
                          }`}
                        >
                          <ThumbsUp className="w-4 h-4" />
                          <span className="font-bold">{r.likes} Likes</span>
                        </button>
                        <span>{r.views} curtidas de simulação</span>
                      </div>

                      {currentUser?.role === "admin" && (
                        <button
                          onClick={() => {
                            setReels(prev => prev.filter(item => item.id !== r.id));
                            triggerToast("Reel removido de circulação.", "info");
                          }}
                          className="text-xs font-black text-rose-500 hover:underline cursor-pointer"
                        >
                          Banir Mídia
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Reels sidebar summary info */}
              <div className="lg:col-span-5 bg-[#061224] border border-[#15233c] rounded-3xl p-6 shadow-xl space-y-6 text-left">
                <div>
                  <h3 className="font-display font-black text-md text-white">Curadoria do Deitt Reels</h3>
                  <p className="text-xs text-slate-400 mt-1">Veja a performance de engajamento baseada no Pulse do criador.</p>
                </div>

                <div className="p-4 bg-[#020d1c] border border-[#15233c]/80 rounded-2xl space-y-3">
                  <div className="flex justify-between text-xs text-slate-400">
                    <span>Vídeos na fila</span>
                    <span className="text-white font-bold">{reels.length}</span>
                  </div>
                  <div className="flex justify-between text-xs text-slate-400">
                    <span>Taxa de conformidade</span>
                    <span className="text-emerald-400 font-bold">100% Segura</span>
                  </div>
                </div>

                <div className="border-t border-[#15233c] pt-4 flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                  <p className="text-[10px] text-slate-400 leading-relaxed">
                    <strong>Conformidade On-Chain:</strong> O Deitt Reels grava chaves hash par a par de conformidade em redes públicas de demonstração.
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {/* 5. FILA DE VERIFICACAO */}
          {activeTab === "verification" && (
            <motion.div
              key="verification"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-6 max-w-5xl mx-auto"
            >
              <div className="bg-[#061224] border border-[#15233c] rounded-3xl p-6 shadow-xl text-left">
                <h3 className="font-display font-black text-md text-white">Fila de Autenticação Facial</h3>
                <p className="text-xs text-slate-400 mt-1 mb-6">Compare a foto do documento com a selfie ao vivo enviada para liberação de selo azul.</p>

                {verificationQueue.length === 0 ? (
                  <div className="p-8 text-center bg-[#020d1c] border border-dashed border-[#15233c] rounded-2xl text-slate-400 text-xs">
                    Nenhum novo membro aguardando verificação por selfie no momento. Perfeito!
                  </div>
                ) : (
                  <div className="space-y-6">
                    {verificationQueue.map(item => (
                      <div key={item.id} className="p-5 bg-[#020d1c] border border-[#15233c] rounded-2xl space-y-4">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-[#15233c]/60 pb-3">
                          <div>
                            <h4 className="font-bold text-sm text-white">{item.name}, {item.age} anos</h4>
                            <p className="text-[9px] text-[#ff7854] font-mono mt-0.5 uppercase tracking-wider">Submetido: {item.submittedAt}</p>
                          </div>
                          <span className="text-[11px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 rounded-full font-black">
                            Face Match: {item.similarity} de precisão
                          </span>
                        </div>

                        {/* Side by side preview */}
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-1">
                            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest font-mono block">1. Foto do Documento Oficial</span>
                            <div className="aspect-[4/3] bg-slate-900 rounded-xl overflow-hidden border border-[#15233c]">
                              <img src={item.docPhoto} alt="Document capture preview" className="w-full h-full object-cover" />
                            </div>
                          </div>
                          <div className="space-y-1">
                            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest font-mono block">2. Selfie Foto ao Vivo</span>
                            <div className="aspect-[4/3] bg-slate-900 rounded-xl overflow-hidden border border-[#15233c]">
                              <img src={item.selfiePhoto} alt="Selfie capture preview" className="w-full h-full object-cover" />
                            </div>
                          </div>
                        </div>

                        {/* Verification Decisions */}
                        <div className="flex gap-2 justify-end pt-2">
                          <button
                            onClick={() => handleDenyVerification(item.id, item.name)}
                            className="px-4 py-2 bg-rose-500/10 hover:bg-rose-500/25 text-rose-500 border border-rose-500/20 rounded-xl text-xs font-black cursor-pointer"
                          >
                            Rejeitar Foto
                          </button>
                          <button
                            onClick={() => handleApproveVerification(item.id, item.name)}
                            className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl text-xs font-black hover:opacity-95 cursor-pointer flex items-center gap-1.5"
                          >
                            <Check className="w-3.5 h-3.5" /> Aprovar Selo Verificado
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* 6. MODERACAO 18+ */}
          {activeTab === "moderation18" && (
            <motion.div
              key="moderation18"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-6 max-w-5xl mx-auto"
            >
              <div className="bg-[#061224] border border-[#15233c] rounded-3xl p-6 shadow-xl text-left">
                <h3 className="font-display font-black text-md text-white">Central de Denúncias 18+</h3>
                <p className="text-xs text-slate-400 mt-1 mb-6">Audite conteúdos marcados ou denunciados por nudez, links externos não autorizados ou assédio comercial.</p>

                {incidents.length === 0 ? (
                  <div className="p-8 text-center bg-[#020d1c] border border-dashed border-[#15233c] rounded-2xl text-slate-400 text-xs">
                    Ótimo! Fila de denúncias de sensibilidade vazia.
                  </div>
                ) : (
                  <div className="space-y-6">
                    {incidents.map(inc => (
                      <div key={inc.id} className="p-5 bg-[#020d1c] border border-[#15233c] rounded-2xl flex flex-col md:flex-row gap-5 items-start justify-between">
                        <div className="flex-1 space-y-3">
                          <div className="flex items-center gap-3">
                            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-500/10 text-rose-400 border border-rose-500/20 font-black">
                              {inc.id}
                            </span>
                            <h4 className="font-bold text-white text-sm">Denúncia contra {inc.targetName}</h4>
                          </div>

                          <p className="text-xs text-slate-400 leading-relaxed font-semibold">
                            Motivo do report: <span className="text-slate-200">{inc.reason}</span>
                          </p>

                          {/* Image box with Simulated Blur control */}
                          <div className="relative max-w-sm aspect-video bg-black rounded-xl border border-[#15233c] overflow-hidden flex items-center justify-center">
                            <img
                              src={inc.evidencePhoto}
                              alt="Insensitive evidence cover"
                              className={`w-full h-full object-cover transition-all duration-300 ${inc.blurActive ? "blur-2xl scale-125" : "blur-0"}`}
                            />
                            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 to-transparent p-3 flex justify-between items-center z-10 select-none">
                              <span className="text-[9px] font-mono font-black text-slate-300">{inc.safeScore}</span>
                              <button
                                onClick={() => toggleIncidentBlur(inc.id)}
                                className="px-2.5 py-1 bg-white/10 backdrop-blur-md rounded-lg text-[9px] text-white hover:bg-white/20 font-black cursor-pointer font-sans"
                              >
                                {inc.blurActive ? (
                                  <span className="flex items-center gap-1"><Eye className="w-3 h-3" /> Revelar</span>
                                ) : (
                                  <span className="flex items-center gap-1"><EyeOff className="w-3 h-3" /> Censurar</span>
                                )}
                              </button>
                            </div>
                          </div>
                        </div>

                        {/* Moderation Controls right-side */}
                        <div className="w-full md:w-56 space-y-4 md:border-l md:border-[#15233c] md:pl-5 flex flex-col">
                          <div>
                            <span className="text-[9px] uppercase tracking-wider font-extrabold text-slate-500 font-mono block">Status Recomendado:</span>
                            <span className="text-xs font-bold text-amber-400 block mt-0.5">{inc.actionRecommended}</span>
                          </div>

                          <div className="space-y-2 pt-2">
                            <button
                              onClick={() => handleModerationAction(inc.id, "keep", inc.targetName)}
                              className="w-full py-2 bg-emerald-500/10 hover:bg-emerald-500/22 text-emerald-400 border border-emerald-500/20 text-xs font-extrabold rounded-xl transition-all cursor-pointer"
                            >
                              Preservar Conta / Liberar
                            </button>
                            <button
                              onClick={() => handleModerationAction(inc.id, "ban", inc.targetName)}
                              className="w-full py-2 bg-rose-500/20 hover:bg-rose-500/35 text-rose-400 border border-rose-500/30 text-xs font-extrabold rounded-xl transition-all cursor-pointer"
                            >
                              Suspender Membro Definitivo
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* 7. CENTRAL DE SUPORTE */}
          {activeTab === "support" && (
            currentUser?.role === "admin" ? (
              // Admin view
              <motion.div
                key="support-admin"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch max-w-5xl mx-auto"
              >
                {/* Left tickets list */}
                <div className="lg:col-span-5 bg-[#061224] border border-[#15233c] rounded-3xl p-5 space-y-4 text-left">
                  <div>
                    <h3 className="font-display font-black text-md text-white">Tickets de Atendimento</h3>
                    <p className="text-xs text-slate-400 mt-1">Veja demandas financeiras e de segurança geral de Deitt.</p>
                  </div>

                  <div className="space-y-3">
                    {tickets.map(t => (
                      <button
                        key={t.id}
                        onClick={() => setSelectedTicketId(t.id)}
                        className={`w-full p-4 border rounded-2xl text-left transition-all relative ${
                          selectedTicketId === t.id
                            ? "bg-slate-900 border-[#fe3c72]/50 shadow-inner"
                            : "bg-slate-900/40 hover:bg-slate-900/80 border-[#15233c]"
                        }`}
                      >
                        <div className="flex justify-between items-center">
                          <span className="text-[10px] font-mono font-black text-slate-500">{t.id}</span>
                          <span className={`text-[8px] font-mono font-black uppercase px-1.5 py-0.5 rounded ${
                            t.status === "Aberto" ? "bg-amber-500/10 text-amber-400" : "bg-emerald-500/10 text-emerald-400"
                          }`}>
                            {t.status}
                          </span>
                        </div>

                        <h4 className="text-xs font-extrabold text-white truncate mt-2">{t.subject}</h4>
                        <p className="text-[10px] text-slate-400 mt-1">Por: {t.userName}</p>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Right Ticket Response Board */}
                <div className="lg:col-span-7 bg-[#061224] border border-[#15233c] rounded-3xl p-5 flex flex-col justify-between text-left">
                  {selectedTicketId && tickets.find(t => t.id === selectedTicketId) ? (
                    (() => {
                      const t = tickets.find(y => y.id === selectedTicketId)!;
                      return (
                        <div className="space-y-6 flex-1 flex flex-col justify-between">
                          <div className="space-y-4">
                            <div className="flex items-center gap-3 border-b border-[#15233c]/60 pb-3">
                              <img src={t.avatar} alt="User ticket avatar" className="w-10 h-10 rounded-full object-cover" />
                              <div>
                                <h4 className="text-xs font-black text-white">{t.userName}</h4>
                                <p className="text-[10px] text-[#ff7854] font-mono font-bold mt-0.5">{t.category} • {t.date}</p>
                              </div>
                            </div>

                            <div className="p-4 bg-[#020d1c] rounded-2xl border border-[#15233c]/55 space-y-2">
                              <span className="text-[9px] font-mono text-slate-500 uppercase tracking-widest block">Mensagem Original:</span>
                              <p className="text-xs text-slate-200 leading-relaxed italic">
                                &quot;{t.description}&quot;
                              </p>
                            </div>

                            {t.replies.length > 0 && (
                              <div className="space-y-2 mt-4">
                                <span className="text-[9px] font-mono text-slate-500 uppercase tracking-widest block">Histórico de Respostas:</span>
                                {t.replies.map((rep, idx) => (
                                  <div key={idx} className="p-3 bg-slate-900 border border-[#15233c]/50 rounded-xl text-xs leading-relaxed text-slate-300">
                                    {rep}
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>

                          {/* Reply Form */}
                          <form onSubmit={handleReplyTicket} className="space-y-3 pt-4 border-t border-[#15233c]/60">
                            <textarea
                              value={ticketReplyText}
                              onChange={(e) => setTicketReplyText(e.target.value)}
                              placeholder="Escreva resposta para enviar ao usuário..."
                              className="w-full bg-[#11213a] border border-[#1d2d46] rounded-2xl p-4 text-xs text-white focus:outline-none focus:border-[#fe3c72] placeholder-slate-500 h-24 resize-none"
                            />
                            <div className="flex justify-end">
                              <button
                                type="submit"
                                className="px-5 py-2.5 bg-gradient-to-r from-[#fe3c72] to-[#ff7854] text-white rounded-xl text-xs font-black shadow-md shadow-[#fe3c72]/15 hover:opacity-95 active:scale-95 transition-all text-center cursor-pointer"
                              >
                                Registrar Solução Interna de Atendimento
                              </button>
                            </div>
                          </form>
                        </div>
                      );
                    })()
                  ) : (
                    <div className="h-full flex items-center justify-center text-slate-500 text-xs">
                      Selecione um Ticket ao lado para inspecionar.
                    </div>
                  )}
                </div>
              </motion.div>
            ) : (
              // Regular user view: Submit a ticket and monitor own tickets
              <motion.div
                key="support-user"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch max-w-5xl mx-auto"
              >
                {/* Left side: Submit tickets form */}
                <div className="lg:col-span-6 bg-[#061224] border border-[#15233c] rounded-3xl p-6 text-left space-y-6">
                  <div>
                    <span className="text-[9px] uppercase tracking-wider font-extrabold text-[#ff7854] font-mono block">Canal de Contato</span>
                    <h3 className="font-display font-black text-lg text-white">Criar Novo Ticket de Suporte</h3>
                    <p className="text-xs text-slate-400 mt-1">Precisa de reembolso, alteração de dados de geolocalização ou denúncia privada? Preencha os campos abaixo e nosso time root analisará em tempo real.</p>
                  </div>

                  <form onSubmit={(e) => {
                    e.preventDefault();
                    if (!newTicketSubject.trim() || !newTicketDesc.trim()) {
                      triggerToast("Por favor, digite o assunto e conte-nos o problema.", "error");
                      return;
                    }
                    const userTicket = {
                      id: `TKT-${Math.floor(100 + Math.random() * 900)}`,
                      userName: currentUser?.name || "Membro Geral",
                      avatar: currentUser?.avatar || "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150",
                      subject: newTicketSubject,
                      category: newTicketCategory,
                      date: "Hoje mesmo",
                      description: newTicketDesc,
                      status: "Aberto",
                      replies: []
                    };
                    setTickets(prev => [userTicket, ...prev]);
                    triggerToast(`Ticket de Suporte aberto com sucesso! ID: ${userTicket.id}`, "success");
                    setNewTicketSubject("");
                    setNewTicketDesc("");
                  }} className="space-y-4">
                    <div>
                      <label className="text-[10px] uppercase font-bold tracking-widest text-slate-400 block mb-1.5">Assunto da Consulta</label>
                      <input
                        type="text"
                        value={newTicketSubject}
                        onChange={(e) => setNewTicketSubject(e.target.value)}
                        placeholder="Ex: Cobrança indevida no Deitt VIP"
                        className="w-full bg-[#11213a] border border-[#15233c] rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#fe3c72]"
                        required
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-[10px] uppercase font-bold tracking-widest text-slate-400 block mb-1.5">Categoria</label>
                        <select
                          value={newTicketCategory}
                          onChange={(e) => setNewTicketCategory(e.target.value)}
                          className="w-full bg-[#11213a] border border-[#15233c] rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#fe3c72] [&>option]:bg-[#061224]"
                        >
                          <option value="Financeiro">Financeiro / Pagamentos</option>
                          <option value="Suporte Tecnico">Suporte Técnico</option>
                          <option value="Denúncia Privada">Denúncia Privada</option>
                          <option value="Outros">Outras dúvidas</option>
                        </select>
                      </div>

                      <div>
                        <label className="text-[10px] uppercase font-bold tracking-widest text-slate-400 block mb-1.5">Prioridade Co-piloto</label>
                        <div className="w-full bg-[#11213a]/50 text-slate-400 text-xs px-4 py-2.5 rounded-xl border border-[#15233c] font-black uppercase font-mono">
                          ⚡ Alta Urgência
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="text-[10px] uppercase font-bold tracking-widest text-slate-400 block mb-1.5">Descrição nos mínimo detalhes</label>
                      <textarea
                        value={newTicketDesc}
                        onChange={(e) => setNewTicketDesc(e.target.value)}
                        placeholder="Descreva seu problema ou solicitação. Caso queira reembolso, por favor nos dê o código da operação."
                        className="w-full bg-[#11213a] border border-[#15233c] rounded-xl p-4 text-xs text-white focus:outline-none focus:border-[#fe3c72] h-28 resize-none"
                        required
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full py-3 bg-gradient-to-r from-[#fe3c72] to-[#ff7854] text-white rounded-xl text-xs font-black shadow-lg shadow-[#fe3c72]/15 hover:opacity-95 text-center cursor-pointer active:scale-[0.99] transition-all"
                    >
                      Enviar Solicitação de Suporte
                    </button>
                  </form>
                </div>

                {/* Right side: monitor own tickets */}
                <div className="lg:col-span-6 bg-[#061224] border border-[#15233c] rounded-3xl p-6 text-left flex flex-col justify-between">
                  <div className="space-y-4">
                    <div>
                      <span className="text-[9px] uppercase tracking-wider font-extrabold text-[#fe3c72] font-mono block">Histórico de Atendimento</span>
                      <h3 className="font-display font-black text-lg text-white">Meus Tickets Criados</h3>
                    </div>

                    <div className="space-y-4 max-h-[360px] overflow-y-auto pr-1">
                      {tickets.filter(t => t.userName === currentUser?.name).length === 0 ? (
                        <div className="p-8 text-center bg-[#020d1c] border border-dashed border-[#15233c] rounded-2xl text-slate-500 text-xs">
                          Nenhum ticket aberto por você até o momento.
                        </div>
                      ) : (
                        tickets.filter(t => t.userName === currentUser?.name).map(t => (
                          <div key={t.id} className="p-4 bg-[#020d1c] border border-[#15233c] rounded-2xl space-y-3">
                            <div className="flex justify-between items-center">
                              <span className="text-[9px] font-mono font-bold text-[#ff7854]">{t.id} • {t.category}</span>
                              <span className={`text-[8px] font-mono uppercase font-black px-1.5 py-0.5 rounded ${
                                t.status === "Aberto" ? "bg-amber-500/10 text-amber-400" : "bg-emerald-500/10 text-emerald-400"
                              }`}>
                                {t.status}
                              </span>
                            </div>
                            <h4 className="text-xs font-extrabold text-white">{t.subject}</h4>
                            <p className="text-[11px] text-slate-300 leading-relaxed italic">{t.description}</p>
                            {t.replies.length > 0 && (
                              <div className="mt-3 p-3 bg-[#11213a]/50 rounded-xl border border-[#15233c]/40 space-y-1">
                                <span className="text-[8px] font-mono uppercase text-[#fe3c72] font-black">Resposta do Cockpit:</span>
                                {t.replies.map((rep, rIndex) => (
                                  <p key={rIndex} className="text-[11px] text-slate-200 mt-1">{rep}</p>
                                ))}
                              </div>
                            )}
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                  <div className="border-t border-[#15233c]/60 pt-4 mt-6 flex justify-between items-center bg-[#11213a]/20 p-4 rounded-2xl text-xs text-slate-400">
                    <span>Atendimento Deitt 24/7 Ativo</span>
                    <span className="font-extrabold text-[#ff7854] flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      Sem Filas
                    </span>
                  </div>
                </div>
              </motion.div>
            )
          )}

          {/* 8. BANCO SUPABASE / SCHEMA */}
          {activeTab === "supabase_config" && (
            <motion.div
              key="supabase_config"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-6 max-w-4xl mx-auto pb-12 text-left"
            >
              {/* Connection Status Card */}
              <div className="bg-[#061224] border border-[#15233c] rounded-3xl p-6 shadow-xl">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className="p-3.5 bg-[#fe3c72]/10 rounded-2xl">
                      <Database className="w-8 h-8 text-[#fe3c72]" />
                    </div>
                    <div>
                      <h3 className="font-display font-black text-lg text-white">Configurações Supabase Postgres</h3>
                      <p className="text-xs text-slate-400 font-semibold mt-1">
                        Utilize variáveis de ambiente dinâmicas do AI Studio para sincronizar.
                      </p>
                    </div>
                  </div>

                  <div>
                    <button
                      onClick={handleSyncToSupabase}
                      disabled={isSyncingSubmitting}
                      className="px-5 py-2.5 rounded-xl text-xs font-extrabold flex items-center justify-center gap-2 transition-all bg-gradient-to-r from-[#fe3c72] to-[#ff7854] text-white shadow-lg lg:shadow-[#fe3c72]/15 cursor-pointer disabled:opacity-50"
                    >
                      {isSyncingSubmitting ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin" />
                          <span>Sincronizando...</span>
                        </>
                      ) : (
                        <>
                          <RefreshCw className="w-4 h-4" />
                          <span>Popular / Sincronizar Tabelas</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {!isSupabaseConfigured() && (
                  <div className="mt-6 border-t border-[#15233c]/60 pt-4 bg-amber-500/5 p-4 rounded-xl border border-amber-500/20 space-y-2">
                    <h4 className="text-xs font-black uppercase text-amber-400 tracking-wider flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4" /> Configuração Opcional
                    </h4>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      Adicione as seguintes variáveis de ambiente no painel de <strong>Segredos (Secrets)</strong> do AI Studio para ativar o banco de dados dinâmico de produção:
                    </p>
                    <div className="bg-slate-900 border border-[#15233c] p-3 rounded-lg font-mono text-xs text-white select-all space-y-1">
                      <div>NEXT_PUBLIC_SUPABASE_URL=&quot;https://inraepgpltfdprkozpha.supabase.co&quot;</div>
                      <div>NEXT_PUBLIC_SUPABASE_ANON_KEY=&quot;sb_publishable_PY7iQlZXZ0YILu9exvyPgg_7BugQQdx&quot;</div>
                    </div>
                    <p className="text-[10px] text-slate-500 font-medium">
                      Atualmente estamos rodando sobre memória de fallback cliente. Toda ação CRUD opera normalmente.
                    </p>
                  </div>
                )}
              </div>

              {/* Database Schema Map Card */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-[#061224] border border-[#15233c] rounded-3xl p-6 shadow-xl space-y-4">
                  <h3 className="font-display font-black text-md text-white flex items-center gap-2 border-b border-[#15233c]/60 pb-3">
                    <Database className="w-5 h-5 text-[#ff7854]" />
                    Tabelas Mapeadas na Migration
                  </h3>
                  <div className="space-y-3">
                    {[
                      { name: "deitt_users", desc: "Contas de usuários do portal com autenticação e cargos" },
                      { name: "active_profiles", desc: "Perfis e status dos membros ativos do Deitt" },
                      { name: "reels", desc: "Feed de vídeos curtos autorais com pontuação Pulse" },
                      { name: "reel_comments", desc: "Comentários associados ao feed de Reels" },
                      { name: "tickets", desc: "Fila de tickets de suporte e atendimento de faturamento" },
                      { name: "verification_queue", desc: "Análise de selfie física versus documentos governamentais" },
                      { name: "moderation_incidents", desc: "Incidentes 18+ com filtro censura e blur inteligente" },
                      { name: "reported_profiles", desc: "Perfis denunciados com pontuação de severidade e scam" }
                    ].map((tbl, idx) => (
                      <div key={idx} className="flex justify-between items-start p-2.5 bg-slate-900/60 border border-[#15233c] rounded-xl">
                        <div>
                          <p className="text-xs font-bold text-white font-mono">{tbl.name}</p>
                          <p className="text-[10px] text-slate-400 mt-0.5">{tbl.desc}</p>
                        </div>
                        <span className="text-[8px] uppercase tracking-wider font-mono px-1.5 py-0.5 bg-emerald-500/10 text-emerald-400 font-bold rounded">PostgreSQL</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-[#061224] border border-[#15233c] rounded-3xl p-6 shadow-xl space-y-4 flex flex-col justify-between">
                  <div className="space-y-3">
                    <h3 className="font-display font-black text-md text-white flex items-center gap-2 border-b border-[#15233c]/60 pb-3">
                      <Sparkles className="w-5 h-5 text-amber-400" />
                      Como aplicar as SQL Migrations?
                    </h3>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      Para evitar erros como o de tabelas ausentes, execute o script DDL no seu console SQL do Supabase:
                    </p>
                    <ol className="list-decimal list-inside text-xs text-slate-400 space-y-1.5 font-semibold">
                      <li>Entre no seu painel do Supabase.</li>
                      <li>Acesse o menu <strong className="text-white">SQL Editor</strong> à esquerda.</li>
                      <li>Copie o script DDL abaixo e clique em <strong className="text-emerald-400">Run</strong>.</li>
                    </ol>

                    <div className="space-y-2 mt-4 pt-2">
                      <span className="text-[10px] font-bold text-[#ff7854] uppercase tracking-wider block font-mono">Script SQL Completo (Telas, Perfis e RLS)</span>
                      <textarea
                        readOnly
                        value={`-- SQL COMPLETO PARA COCKPIT DEITT
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

CREATE TABLE IF NOT EXISTS public.reel_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reel_id TEXT NOT NULL REFERENCES public.reels(id) ON DELETE CASCADE,
  author_text TEXT NOT NULL,
  avatar TEXT,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

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

CREATE TABLE IF NOT EXISTS public.deitt_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  avatar TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.active_profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.reels DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.reel_comments DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.tickets DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.verification_queue DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.moderation_incidents DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.reported_profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.deitt_users DISABLE ROW LEVEL SECURITY;`}
                        className="w-full h-32 bg-slate-950 text-[10px] font-mono text-slate-300 p-3 rounded-xl border border-[#15233c] focus:outline-none focus:border-[#fe3c72] resize-none"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          navigator.clipboard.writeText(`CREATE TABLE IF NOT EXISTS public.active_profiles (
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

CREATE TABLE IF NOT EXISTS public.reel_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reel_id TEXT NOT NULL REFERENCES public.reels(id) ON DELETE CASCADE,
  author TEXT NOT NULL,
  avatar TEXT,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

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

CREATE TABLE IF NOT EXISTS public.deitt_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  avatar TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.active_profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.reels DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.reel_comments DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.tickets DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.verification_queue DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.moderation_incidents DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.reported_profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.deitt_users DISABLE ROW LEVEL SECURITY;`);
                          triggerToast("Script SQL de migração copiado para a área de transferência! 📋", "success");
                        }}
                        className="w-full py-2 bg-[#ff7854]/10 hover:bg-[#ff7854]/20 border border-[#ff7854]/30 text-[#ff7854] text-xs font-black rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer active:scale-[0.98]"
                      >
                        <Copy className="w-3.5 h-3.5" />
                        Copiar Script SQL (Pronto para Rodar)
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* 9. MODAL FORMS: CREATE OR EDIT PROFILE */}
      {isProfileModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-md bg-[#061224] border border-[#15233c] rounded-3xl p-6 shadow-2xl relative text-left"
          >
            <h3 className="font-display font-black text-lg text-white mb-4">
              {editingProfile ? "Editar Perfil do Membro" : "Criar Novo Perfil para Testes"}
            </h3>

            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block font-mono">Nome Completo</label>
                <input
                  type="text"
                  required
                  value={profileForm.name}
                  onChange={(e) => setProfileForm(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full bg-[#11213a] border border-[#1d2d46] rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-[#fe3c72]"
                  placeholder="Ex: Valentina Rosa"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block font-mono">Idade (Id)</label>
                  <input
                    type="number"
                    required
                    value={profileForm.age}
                    onChange={(e) => setProfileForm(prev => ({ ...prev, age: Number(e.target.value) }))}
                    className="w-full bg-[#11213a] border border-[#1d2d46] rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-[#fe3c72]"
                    min="18"
                    max="99"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block font-mono">Localização</label>
                  <input
                    type="text"
                    required
                    value={profileForm.location}
                    onChange={(e) => setProfileForm(prev => ({ ...prev, location: e.target.value }))}
                    className="w-full bg-[#11213a] border border-[#1d2d46] rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-[#fe3c72]"
                    placeholder="Ex: Florianópolis, SC"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block font-mono">Sua Bio de Concepção</label>
                <textarea
                  required
                  value={profileForm.bio}
                  onChange={(e) => setProfileForm(prev => ({ ...prev, bio: e.target.value }))}
                  className="w-full bg-[#11213a] border border-[#1d2d46] rounded-xl p-4 text-xs text-white focus:outline-none focus:border-[#fe3c72] h-20 resize-none"
                  placeholder="Escreva a biografia que será submetida ao robô..."
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block font-mono">Interesses (Separados por vírgula)</label>
                <input
                  type="text"
                  required
                  value={profileForm.interests}
                  onChange={(e) => setProfileForm(prev => ({ ...prev, interests: e.target.value }))}
                  className="w-full bg-[#11213a] border border-[#1d2d46] rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-[#fe3c72]"
                  placeholder="Ex: Programação, Viagem, Café"
                />
              </div>

              <div className="pt-4 flex gap-2 justify-end">
                <button
                  type="button"
                  onClick={() => setIsProfileModalOpen(false)}
                  className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-bold leading-none cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2.5 bg-[#fe3c72] hover:bg-opacity-95 text-white rounded-xl text-xs font-black leading-none cursor-pointer"
                >
                  Confirmar Ajustes
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* 10. MODAL FORMS: CREATE OR EDIT REEL */}
      {isReelModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-md bg-[#061224] border border-[#15233c] rounded-3xl p-6 shadow-2xl relative text-left"
          >
            <h3 className="font-display font-black text-lg text-white mb-4">Adicionar Vídeo Reel</h3>

            <form onSubmit={handleSaveReel} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block font-mono">Autor</label>
                <input
                  type="text"
                  required
                  value={reelForm.authorName}
                  onChange={(e) => setReelForm(prev => ({ ...prev, authorName: e.target.value }))}
                  className="w-full bg-[#11213a] border border-[#1d2d46] rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-[#fe3c72]"
                  placeholder="Ex: Valentina Rosa"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block font-mono">Legenda / Caption</label>
                <input
                  type="text"
                  required
                  value={reelForm.caption}
                  onChange={(e) => setReelForm(prev => ({ ...prev, caption: e.target.value }))}
                  className="w-full bg-[#11213a] border border-[#1d2d46] rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-[#fe3c72]"
                  placeholder="Legenda para engajamento..."
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block font-mono">URL do Vídeo (recomenda-se .mp4 publico do Mixkit)</label>
                <input
                  type="text"
                  required
                  value={reelForm.videoUrl}
                  onChange={(e) => setReelForm(prev => ({ ...prev, videoUrl: e.target.value }))}
                  className="w-full bg-[#11213a] border border-[#1d2d46] rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-[#fe3c72]/50 font-mono text-[10px]"
                />
              </div>

              <div className="pt-4 flex gap-2 justify-end">
                <button
                  type="button"
                  onClick={() => setIsReelModalOpen(false)}
                  className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-400 rounded-xl text-xs font-bold leading-none cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2.5 bg-[#fe3c72] hover:bg-opacity-95 text-white rounded-xl text-xs font-black leading-none cursor-pointer"
                >
                  Postar Mídia de Vídeo ao Vivo
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* 9.5. MODAL: DETAILED PROFILE VIEWER */}
      {selectedViewProfile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl overflow-y-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="w-full max-w-lg bg-[#061224] border border-[#15233c] rounded-[32px] overflow-hidden shadow-2xl relative text-left"
          >
            {/* Top Interactive Banner Header */}
            <div className="relative w-full aspect-[4/3] bg-slate-900 border-b border-[#15233c]/60">
              <img
                src={selectedViewProfile.avatar}
                alt={selectedViewProfile.name}
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#061224] via-[#061224]/40 to-transparent" />
              
              {/* Badges Overlay */}
              <div className="absolute top-4 left-4 flex gap-2">
                {selectedViewProfile.verified && (
                  <span className="bg-gradient-to-r from-blue-600 to-blue-500 text-white font-mono uppercase text-[9px] font-black px-2.5 py-1 rounded-full flex items-center gap-1 shadow-lg shadow-blue-500/20">
                    <Check className="w-3.5 h-3.5 shrink-0" /> Verificado
                  </span>
                )}
                <span className="bg-slate-900/90 backdrop-blur-md text-[#ff7854] font-mono text-[9px] font-black px-2.5 py-1 rounded-full border border-[#15233c]">
                  {selectedViewProfile.score || "98%"} Match Score
                </span>
              </div>
              
              <button
                onClick={() => setSelectedViewProfile(null)}
                className="absolute top-4 right-4 p-2 bg-slate-950/70 backdrop-blur-md text-slate-300 hover:text-white rounded-full transition-colors cursor-pointer border border-[#15233c]/60 hover:scale-105 active:scale-95"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Title overlay in the banner bottom */}
              <div className="absolute bottom-4 left-6 right-6">
                <h3 className="text-2xl font-black font-display tracking-tight text-white flex items-center gap-2">
                  {selectedViewProfile.name}, {selectedViewProfile.age}
                </h3>
                <p className="text-xs uppercase font-bold text-[#ff7854] mt-1 tracking-wider flex items-center gap-1 font-mono">
                  <MapPin className="w-3.5 h-3.5 text-[#fe3c72]" /> {selectedViewProfile.location}
                </p>
              </div>
            </div>

            {/* Content Details Area */}
            <div className="p-6 space-y-6">
              {/* Bio block */}
              <div className="space-y-2">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block font-mono">Biografia do Membro</span>
                <p className="text-xs text-slate-200 leading-relaxed bg-[#020d1c] p-4 rounded-2xl border border-[#15233c]/60 italic">
                  &quot;{selectedViewProfile.bio}&quot;
                </p>
              </div>

              {/* Interests Block */}
              <div className="space-y-2">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block font-mono">Interesses e Hobbies</span>
                <div className="flex gap-2 flex-wrap">
                  {selectedViewProfile.interests.map((it, idx) => (
                    <span key={idx} className="bg-[#11213a] text-slate-200 px-3 py-1.5 rounded-xl text-xs font-semibold border border-[#15233c]">
                      {it}
                    </span>
                  ))}
                </div>
              </div>

              {/* Simulated detailed facts */}
              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="bg-[#020d1c] p-4 rounded-2xl border border-[#15233c]/60">
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block font-mono">Situação Cadastral</span>
                  <span className="text-xs font-bold text-emerald-400 block mt-1">✓ Ativo na Produção</span>
                </div>
                <div className="bg-[#020d1c] p-4 rounded-2xl border border-[#15233c]/60">
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block font-mono">Canal Integrado</span>
                  <span className="text-xs font-bold text-[#ff7854] block mt-1">Supabase Postgres</span>
                </div>
              </div>

              {/* Footer controls inside modal */}
              <div className="border-t border-[#15233c]/60 pt-4 flex gap-2 justify-end">
                <button
                  type="button"
                  onClick={() => setSelectedViewProfile(null)}
                  className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-bold leading-none cursor-pointer"
                >
                  Fechar
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setActiveChatUser(selectedViewProfile.id);
                    setActiveTab("private_chat");
                    setSelectedViewProfile(null);
                  }}
                  className="px-4 py-2.5 bg-gradient-to-r from-[#fe3c72] to-[#ff7854] text-white rounded-xl text-xs font-black leading-none cursor-pointer flex items-center gap-1.5 shadow-md hover:opacity-95"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  Iniciar Chat Simulado
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
