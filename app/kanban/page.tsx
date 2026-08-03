'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Navbar } from '@/components/navbar';
import { useTheme } from '@/components/theme-provider';
import { 
  Plus, 
  Edit2, 
  Trash2, 
  Users, 
  User, 
  Sparkles, 
  CalendarDays, 
  CheckCircle2, 
  Info,
  X,
  FileText,
  AlignLeft,
  UserPlus,
  Inbox,
  Clock,
  Activity
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

// --- COMPONENTE DE FUNDO ANIMADO (glassmorphism) ---
const AIBackground = ({ isDarkMode }: { isDarkMode: boolean }) => {
  const [stars, setStars] = useState<{ top: string; left: string; delay: string; duration: string; opacity: number; scale: number }[]>([]);

  useEffect(() => {
    const newStars = Array.from({ length: 50 }).map(() => ({
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
      delay: `${Math.random() * 5}s`,
      duration: `${3 + Math.random() * 7}s`,
      opacity: 0.1 + Math.random() * 0.5,
      scale: 0.5 + Math.random()
    }));
    setStars(newStars);
  }, []);

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      <div className={`absolute top-[-10%] left-[-10%] w-[60%] h-[60%] rounded-full blur-[120px] opacity-20 animate-pulse transition-colors duration-500
        ${isDarkMode ? 'bg-blue-600' : 'bg-blue-400'}`} 
        style={{ animationDuration: '8s' }} 
      />
      <div className={`absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] rounded-full blur-[120px] opacity-20 animate-pulse transition-colors duration-500
        ${isDarkMode ? 'bg-indigo-600' : 'bg-indigo-400'}`} 
        style={{ animationDuration: '12s', animationDelay: '2s' }} 
      />
      <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at center, transparent 0%, rgba(0,0,0,0.1) 100%)' }}>
        <div className="stars-container relative w-full h-full">
          {stars.map((star, i) => (
            <div 
              key={i} 
              className={`absolute w-0.5 h-0.5 rounded-full ${isDarkMode ? 'bg-white' : 'bg-blue-500'}`}
              style={{
                top: star.top,
                left: star.left,
                animation: `float ${star.duration} linear infinite ${star.delay}`,
                opacity: star.opacity,
                transform: `scale(${star.scale})`
              }}
            />
          ))}
        </div>
      </div>
      <style jsx>{`
        @keyframes float {
          0% { transform: translateY(0) translateX(0); opacity: 0; }
          20% { opacity: 1; }
          80% { opacity: 1; }
          100% { transform: translateY(-100px) translateX(20px); opacity: 0; }
        }
      `}</style>
    </div>
  );
};


// --- DATA TYPES ---
interface KanbanCardType {
  id: number;
  title: string;
  description?: string;
  status: string; // 'Backlog' | 'To Do' | 'On Going' | 'Done'
  type: string;   // 'pessoal' | 'time'
  user_id?: number;
  project_id?: number;
  assigned_member_id?: number;
  priority?: string;
  position?: number;
  deadline?: string | null;
  created_at: string;
}

interface TeamMember {
  id: number;
  name: string;
  role?: string;
  user_id?: number;
  avatar?: string;
}

interface SquadInfo {
  id: number;
  name: string;
  members: TeamMember[];
}

const STATUSES = ['Backlog', 'To Do', 'On Going', 'Done'];

export default function KanbanPage() {
  const { isDarkMode } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState<'pessoal' | 'time'>('pessoal');
  const [currentUser, setCurrentUser] = useState<any>(null);
  
  // Data States
  const [cards, setCards] = useState<KanbanCardType[]>([]);
  const [squad, setSquad] = useState<SquadInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [squadError, setSquadError] = useState<string | null>(null);

  // Drag and Drop States
  const [draggedCardId, setDraggedCardId] = useState<number | null>(null);
  const [dragOverStatus, setDragOverStatus] = useState<string | null>(null);
  const [draggedOverCardId, setDraggedOverCardId] = useState<number | null>(null);

  // Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCard, setEditingCard] = useState<Partial<KanbanCardType> | null>(null);
  const [modalTitle, setModalTitle] = useState('');
  const [modalDesc, setModalDesc] = useState('');
  const [modalStatus, setModalStatus] = useState('Backlog');
  const [modalPriority, setModalPriority] = useState('Média');
  const [modalAssignedId, setModalAssignedId] = useState<number>(0);
  const [modalDeadline, setModalDeadline] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');

  const API_URL = typeof window !== 'undefined'
    ? `${window.location.protocol}//${window.location.hostname}:8001`
    : '';

  // Get current logged in user from localStorage
  useEffect(() => {
    setMounted(true);
    const storedUser = localStorage.getItem('user_srmt');
    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser);
        setCurrentUser(parsed);
        fetchFullUserData(parsed.id);
      } catch (error) {
        console.error("Erro ao ler usuário:", error);
      }
    } else {
      setLoading(false);
    }
  }, []);

  // Fetch full user data to ensure we have the latest KP configuration
  const fetchFullUserData = async (userId: number) => {
    try {
      const res = await fetch(`${API_URL}/users/${userId}`);
      if (res.ok) {
        const data = await res.json();
        setCurrentUser((prev: any) => ({ ...prev, ...data }));
      }
    } catch (e) {
      console.error("Erro ao buscar perfil atualizado:", e);
    }
  };

  // Fetch Squad Details (for Team mode)
  const fetchSquadDetails = useCallback(async (userId: number) => {
    setSquadError(null);
    try {
      const res = await fetch(`${API_URL}/kanban/squad?user_id=${userId}`);
      if (res.ok) {
        const data = await res.json();
        setSquad(data);
      } else {
        const errorData = await res.json();
        setSquadError(errorData.detail || "Não foi possível carregar a equipe.");
        setSquad(null);
      }
    } catch (e) {
      setSquadError("Erro de conexão ao buscar o Squad de time.");
      setSquad(null);
    }
  }, [API_URL]);

  // Fetch Kanban Cards
  const fetchCards = useCallback(async (tab: 'pessoal' | 'time', userId: number, projectId?: number) => {
    setLoading(true);
    try {
      let url = `${API_URL}/kanban/cards?type=${tab}&user_id=${userId}`;
      if (tab === 'time' && projectId) {
        url += `&project_id=${projectId}`;
      }
      
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        setCards(data);
      }
    } catch (e) {
      console.error("Erro ao carregar cards:", e);
    } finally {
      setLoading(false);
    }
  }, [API_URL]);

  // Handle switching tabs
  useEffect(() => {
    if (currentUser) {
      if (activeTab === 'pessoal') {
        fetchCards('pessoal', currentUser.id);
      } else {
        // Mode: Team
        fetchSquadDetails(currentUser.id);
      }
    }
  }, [activeTab, currentUser, fetchSquadDetails, fetchCards]);

  // Automatically fetch team cards once squad details are loaded
  useEffect(() => {
    if (activeTab === 'time' && currentUser && squad) {
      fetchCards('time', currentUser.id, squad.id);
    }
  }, [squad, activeTab, currentUser, fetchCards]);

  // Drag and Drop implementation
  const handleDragStart = (e: React.DragEvent, cardId: number) => {
    setDraggedCardId(cardId);
    e.dataTransfer.setData('text/plain', cardId.toString());
  };

  const handleDragOver = (e: React.DragEvent, status: string) => {
    e.preventDefault();
    setDragOverStatus(status);
  };

  const handleDragLeave = () => {
    setDragOverStatus(null);
    setDraggedOverCardId(null);
  };

  // Reusable function to perform bulk updates for card positions and statuses
  // Only sends cards that were actually affected by the drag operation
  const savePositions = async (affectedCards: KanbanCardType[]) => {
    try {
      const payload = affectedCards
        .filter(card => card.id != null && card.id > 0)
        .map((card) => ({
          id: card.id,
          position: card.position ?? 0,
          status: card.status,
        }));

      if (payload.length === 0) return;

      const res = await fetch(`${API_URL}/kanban/cards/bulk-position`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cards: payload })
      });
      if (!res.ok) {
        const errBody = await res.text();
        console.error("Erro ao salvar posições de cards no servidor:", errBody);
        // Refresh cards from server to restore consistent state
        if (currentUser) {
          fetchCards(activeTab, currentUser.id, activeTab === 'time' ? squad?.id : undefined);
        }
      }
    } catch (e) {
      console.error("Erro de rede ao salvar posições no servidor:", e);
      if (currentUser) {
        fetchCards(activeTab, currentUser.id, activeTab === 'time' ? squad?.id : undefined);
      }
    }
  };

  const handleDropOnCard = async (e: React.DragEvent, targetCardId: number, targetStatus: string) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOverStatus(null);
    setDraggedOverCardId(null);

    const cardIdStr = e.dataTransfer.getData('text/plain') || draggedCardId?.toString();
    if (!cardIdStr) return;

    const cardId = parseInt(cardIdStr);
    if (isNaN(cardId)) return;
    if (cardId === targetCardId) return;

    const draggedCard = cards.find(c => c.id === cardId);
    if (!draggedCard) return;

    // Use immutable copies to avoid React state mutation
    const targetStatusCards = cards
      .filter(c => c.status === targetStatus && c.id !== cardId)
      .map(c => ({ ...c }))
      .sort((a, b) => (a.position ?? 0) - (b.position ?? 0));

    const targetIdx = targetStatusCards.findIndex(c => c.id === targetCardId);
    if (targetIdx === -1) return;

    const newDraggedCard = { ...draggedCard, status: targetStatus };
    targetStatusCards.splice(targetIdx, 0, newDraggedCard);

    // Recompute positions immutably
    const reindexedTarget = targetStatusCards.map((c, idx) => ({ ...c, position: idx }));

    // Collect affected cards for server save
    let affectedCards = [...reindexedTarget];

    // Build new cards list
    let newCards = cards
      .filter(c => c.id !== cardId && c.status !== targetStatus)
      .map(c => ({ ...c }));
    
    if (draggedCard.status !== targetStatus) {
      const sourceStatusCards = cards
        .filter(c => c.status === draggedCard.status && c.id !== cardId)
        .map(c => ({ ...c }))
        .sort((a, b) => (a.position ?? 0) - (b.position ?? 0));
      
      const reindexedSource = sourceStatusCards.map((c, idx) => ({ ...c, position: idx }));
      affectedCards = [...affectedCards, ...reindexedSource];

      newCards = newCards.filter(c => c.status !== draggedCard.status);
      newCards = [...newCards, ...reindexedSource];
    }

    newCards = [...newCards, ...reindexedTarget];
    setCards(newCards);
    setDraggedCardId(null);

    // Persist only affected cards to server
    await savePositions(affectedCards);
  };

  const handleDropOnColumn = async (e: React.DragEvent, targetStatus: string) => {
    e.preventDefault();
    setDragOverStatus(null);
    setDraggedOverCardId(null);

    const cardIdStr = e.dataTransfer.getData('text/plain') || draggedCardId?.toString();
    if (!cardIdStr) return;

    const cardId = parseInt(cardIdStr);
    if (isNaN(cardId)) return;

    const draggedCard = cards.find(c => c.id === cardId);
    if (!draggedCard) return;

    // If dropping on the same column and already at the end, skip
    if (draggedCard.status === targetStatus) {
      const sameColCards = cards.filter(c => c.status === targetStatus).sort((a, b) => (a.position ?? 0) - (b.position ?? 0));
      if (sameColCards[sameColCards.length - 1]?.id === cardId) return;
    }

    // Immutable copies
    const targetStatusCards = cards
      .filter(c => c.status === targetStatus && c.id !== cardId)
      .map(c => ({ ...c }))
      .sort((a, b) => (a.position ?? 0) - (b.position ?? 0));

    const newDraggedCard = { ...draggedCard, status: targetStatus };
    targetStatusCards.push(newDraggedCard);

    const reindexedTarget = targetStatusCards.map((c, idx) => ({ ...c, position: idx }));
    let affectedCards = [...reindexedTarget];

    let newCards = cards
      .filter(c => c.id !== cardId && c.status !== targetStatus)
      .map(c => ({ ...c }));

    if (draggedCard.status !== targetStatus) {
      const sourceStatusCards = cards
        .filter(c => c.status === draggedCard.status && c.id !== cardId)
        .map(c => ({ ...c }))
        .sort((a, b) => (a.position ?? 0) - (b.position ?? 0));

      const reindexedSource = sourceStatusCards.map((c, idx) => ({ ...c, position: idx }));
      affectedCards = [...affectedCards, ...reindexedSource];

      newCards = newCards.filter(c => c.status !== draggedCard.status);
      newCards = [...newCards, ...reindexedSource];
    }

    newCards = [...newCards, ...reindexedTarget];
    setCards(newCards);
    setDraggedCardId(null);

    // Persist only affected cards to server
    await savePositions(affectedCards);
  };

  // CRUD handlers
  const openCreateModal = (status: string) => {
    setEditingCard(null);
    setModalTitle('');
    setModalDesc('');
    setModalStatus(status);
    setModalPriority('Média');
    setModalAssignedId(0);
    setModalDeadline('');
    setIsModalOpen(true);
  };

  const openEditModal = (card: KanbanCardType) => {
    setEditingCard(card);
    setModalTitle(card.title);
    setModalDesc(card.description || '');
    setModalStatus(card.status);
    setModalPriority(card.priority || 'Média');
    setModalAssignedId(card.assigned_member_id || 0);
    setModalDeadline(card.deadline || '');
    setIsModalOpen(true);
  };

  const handleSaveCard = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!modalTitle.trim()) {
      alert("O título do card é obrigatório.");
      return;
    }

    const newPosition = cards.filter(c => c.status === modalStatus).length;

    const payload: any = {
      title: modalTitle.trim(),
      description: modalDesc.trim() || null,
      status: modalStatus,
      priority: modalPriority,
      position: newPosition,
      deadline: modalDeadline || null,
      type: activeTab,
      user_id: currentUser?.id || null,
      project_id: null,
      assigned_member_id: null
    };

    if (activeTab === 'time') {
      payload.project_id = squad?.id || null;
      payload.assigned_member_id = modalAssignedId > 0 ? modalAssignedId : null;
    }

    try {
      if (editingCard) {
        // EDIT MODE
        const statusChanged = editingCard.status !== modalStatus;
        const editPosition = statusChanged 
          ? cards.filter(c => c.status === modalStatus).length 
          : (editingCard.position ?? 0);

        const updatePayload: any = {
          title: modalTitle.trim(),
          description: modalDesc.trim() || null,
          status: modalStatus,
          priority: modalPriority,
          position: editPosition,
          deadline: modalDeadline || null,
          assigned_member_id: modalAssignedId > 0 ? modalAssignedId : 0
        };

        const res = await fetch(`${API_URL}/kanban/cards/${editingCard.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updatePayload)
        });

        if (res.ok) {
          const updated = await res.json();
          setCards(prev => prev.map(c => c.id === editingCard.id ? updated : c));
          setIsModalOpen(false);
        } else {
          const errText = await res.text();
          console.error("Erro ao editar card:", errText);
          alert("Erro ao editar o card.");
        }
      } else {
        // CREATE MODE
        const res = await fetch(`${API_URL}/kanban/cards`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });

        if (res.ok) {
          const newCard = await res.json();
          setCards(prev => [...prev, newCard]);
          setIsModalOpen(false);
        } else {
          const errText = await res.text();
          console.error("Erro ao criar card:", errText);
          alert("Erro ao criar o card. Verifique o console para mais detalhes.");
        }
      }
    } catch (e) {
      console.error("Falha ao salvar card:", e);
      alert("Falha ao salvar o card. Verifique sua rede.");
    }
  };

  const handleDeleteCard = async (cardId: number) => {
    if (!confirm("Deseja realmente remover este card?")) return;
    try {
      const res = await fetch(`${API_URL}/kanban/cards/${cardId}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        setCards(prev => prev.filter(c => c.id !== cardId));
      } else {
        alert("Erro ao excluir card.");
      }
    } catch (e) {
      alert("Erro na conexão ao tentar excluir card.");
    }
  };

  if (!mounted) return null;

  return (
    <div className={`min-h-screen transition-colors duration-500 ${isDarkMode ? 'bg-[#050505] text-white' : 'bg-[#f8fafc] text-slate-900'} overflow-x-hidden pb-16`}>
      <AIBackground isDarkMode={isDarkMode} />
      <Navbar />

      <main className="relative z-10 max-w-[1600px] mx-auto px-6 py-12 pt-24 space-y-10">
        
        {/* Header */}
        <div className="text-center space-y-4">
          <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-lg border mb-2 shadow-lg ${isDarkMode ? 'bg-white/5 border-white/10 text-blue-400' : 'bg-blue-50 border-blue-100 text-blue-600'}`}>
            <Sparkles className="w-4 h-4 animate-pulse" />
            <span className="text-[10px] font-bold uppercase tracking-widest">Kanban Colaborativo</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tighter leading-none">
            Quadro de <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Atividades</span>
          </h1>
          <p className="text-sm max-w-xl mx-auto opacity-60 font-medium">
            Gerencie e organize suas tarefas diárias de maneira ágil, tanto no âmbito pessoal quanto em colaboração com seu time semanal.
          </p>
        </div>

        {/* Navigation Selector & Info Panel */}
        <div className="flex flex-col items-center gap-6">
          <div 
            style={{
              position: 'relative',
              display: 'flex',
              padding: '6px',
              width: '320px',
              maxWidth: '100%',
              borderRadius: '16px',
              transition: 'all 0.5s ease',
              backgroundColor: isDarkMode ? '#16161a' : '#f1f3f6',
              border: isDarkMode ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid rgba(0, 0, 0, 0.08)',
              boxShadow: isDarkMode 
                ? 'inset 0 1px 1px rgba(255,255,255,0.05), 0 10px 30px rgba(0,0,0,0.5)' 
                : 'inset 0 1px 1px rgba(0,0,0,0.02), 0 10px 20px rgba(0,0,0,0.05)',
            }}
          >
            {/* Spring-Bouncing & Color-Morphing Sliding Pill */}
            <div 
              style={{
                position: 'absolute',
                top: '6px',
                bottom: '6px',
                left: activeTab === 'pessoal' ? '6px' : 'calc(50% + 2px)',
                width: 'calc(50% - 8px)',
                transition: 'all 500ms cubic-bezier(0.34, 1.56, 0.64, 1)',
                borderRadius: '12px',
                background: activeTab === 'pessoal'
                  ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)' 
                  : 'linear-gradient(135deg, #6366f1 0%, #4338ca 100%)',
                boxShadow: activeTab === 'pessoal'
                  ? '0 4px 14px rgba(16, 185, 129, 0.4)'
                  : '0 4px 14px rgba(99, 102, 241, 0.4)',
              }}
            />
            
            <button 
              onClick={() => setActiveTab('pessoal')} 
              style={{
                position: 'relative',
                zIndex: 10,
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                paddingTop: '8px',
                paddingBottom: '8px',
                borderRadius: '12px',
                fontSize: '12px',
                fontWeight: '900',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                transition: 'all 0.3s ease',
                color: activeTab === 'pessoal' ? '#ffffff' : (isDarkMode ? '#a1a1aa' : '#71717a'),
                opacity: activeTab === 'pessoal' ? 1 : 0.7,
              }}
              className="hover:opacity-100 hover:scale-[1.02]"
            >
              <User 
                style={{
                  width: '14px',
                  height: '14px',
                  transition: 'all 0.5s ease',
                  transform: activeTab === 'pessoal' ? 'rotate(360deg) scale(1.1)' : 'none',
                  color: activeTab === 'pessoal' ? '#ffffff' : (isDarkMode ? '#71717a' : '#9ca3af'),
                }}
              />
              <span>Pessoal</span>
            </button>
            <button 
              onClick={() => setActiveTab('time')} 
              style={{
                position: 'relative',
                zIndex: 10,
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                paddingTop: '8px',
                paddingBottom: '8px',
                borderRadius: '12px',
                fontSize: '12px',
                fontWeight: '900',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                transition: 'all 0.3s ease',
                color: activeTab === 'time' ? '#ffffff' : (isDarkMode ? '#a1a1aa' : '#71717a'),
                opacity: activeTab === 'time' ? 1 : 0.7,
              }}
              className="hover:opacity-100 hover:scale-[1.02]"
            >
              <Users 
                style={{
                  width: '14px',
                  height: '14px',
                  transition: 'all 0.5s ease',
                  transform: activeTab === 'time' ? 'rotate(360deg) scale(1.1)' : 'none',
                  color: activeTab === 'time' ? '#ffffff' : (isDarkMode ? '#71717a' : '#9ca3af'),
                }}
              />
              <span>Meu Time</span>
            </button>
          </div>

          {/* Squad Details in Team view */}
          {activeTab === 'time' && squad && (
            <div className={`px-6 py-3 rounded-[1.5rem] border backdrop-blur-xl flex flex-wrap items-center justify-center gap-4 text-xs font-bold transition-all animate-in fade-in duration-500
              ${isDarkMode ? 'bg-white/5 border-white/10 text-indigo-300' : 'bg-indigo-50 border-indigo-100 text-indigo-800'}`}>
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-indigo-500 animate-pulse" />
                <span>Célula: <span className="underline font-black">{squad.name}</span></span>
              </div>
              <div className="w-px h-4 bg-indigo-500/20 hidden sm:block" />
              <div className="flex -space-x-2 overflow-hidden">
                {squad.members.map((member) => (
                  <div 
                    key={member.id}
                    title={`${member.name} (${member.role || 'Membro'})`}
                    className={`w-7 h-7 rounded-full flex items-center justify-center font-black border text-[9px] uppercase shadow-md bg-gradient-to-br from-indigo-500 to-purple-600 text-white border-white dark:border-[#050505] transform hover:scale-110 hover:z-10 transition-all`}
                  >
                    {member.avatar ? (
                      <img src={member.avatar} alt="Avatar" className="w-full h-full object-cover rounded-full" />
                    ) : (
                      member.name.charAt(0)
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Search Bar */}
          <div className="w-full max-w-md mx-auto mt-4">
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Pesquisar nas atividades (título ou descrição)..."
              className={`h-12 rounded-[1.5rem] px-6 text-xs font-bold transition-all duration-300 shadow-sm backdrop-blur-md
                ${isDarkMode ? 'bg-black/40 border-white/10 text-white focus:bg-white/5 focus:border-white/20' : 'bg-white/60 border-black/5 text-slate-900 focus:bg-white focus:border-blue-200'}`}
            />
          </div>
        </div>

        {/* Kanban Board Area */}
        {loading ? (
          <div className="flex justify-center items-center py-32">
            <div className="w-10 h-10 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin" />
          </div>
        ) : activeTab === 'time' && squadError ? (
          /* Error State if User doesn't have a team allocated or KP configured */
          <Card key={`error-${activeTab}`} className={`p-10 rounded-[2.5rem] border max-w-2xl mx-auto backdrop-blur-2xl transition-all duration-500 text-center space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-500
            ${isDarkMode ? 'bg-[#111]/40 border-red-500/10 shadow-2xl hover:border-red-500/20' : 'bg-red-50/60 border-red-200 shadow-xl'}`}>
            <div className="w-20 h-20 rounded-3xl bg-red-500/10 text-red-500 flex items-center justify-center mx-auto border border-red-500/20">
              <Info className="w-10 h-10" />
            </div>
            <div className="space-y-4">
              <h3 className="text-2xl font-black tracking-tight text-red-500">Célula do Time Não Localizado</h3>
              <p className={`text-sm leading-relaxed opacity-75 ${isDarkMode ? 'text-gray-400' : 'text-slate-600'}`}>
                Não conseguimos identificar o seu squad para carregar o Kanban do Time. Para resolver isso, certifique-se de que:
              </p>
              
              <div className={`p-6 rounded-2xl border text-xs text-left space-y-3 mx-auto max-w-md ${isDarkMode ? 'bg-black/30 border-white/5' : 'bg-white/50 border-slate-200'}`}>
                <div className="flex gap-2">
                  <span className="text-emerald-500 font-bold">1.</span>
                  <span>Você possui uma <strong>Célula</strong> ou <strong>KP</strong> associado no seu <a href="/perfil" className="text-blue-500 hover:text-blue-400 font-bold underline">Meu Perfil</a>.</span>
                </div>
                <div className="flex gap-2">
                  <span className="text-emerald-500 font-bold">2.</span>
                  <span>O seu nome de usuário foi alocado em uma célula ativa na tela <a href="/time-semanal" className="text-blue-500 hover:text-blue-400 font-bold underline">Time Semanal</a>.</span>
                </div>
                <div className="flex gap-2">
                  <span className="text-emerald-500 font-bold">3.</span>
                  <span>A célula ou o líder do seu KP no perfil correspondem exatamente ao nome do projeto ativo.</span>
                </div>
              </div>
            </div>
            
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Button size="sm" asChild className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-lg transition-all px-6 py-5">
                <a href="/perfil">Ir para Meu Perfil</a>
              </Button>
              <Button size="sm" asChild variant="outline" className={`rounded-xl px-6 py-5 ${isDarkMode ? 'border-white/10 hover:bg-white/5' : 'border-slate-200 hover:bg-slate-50'}`}>
                <a href="/time-semanal">Acessar Time Semanal</a>
              </Button>
            </div>
          </Card>
        ) : (
          /* Actual Kanban Columns */
          <div key={activeTab} className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 items-start animate-in fade-in slide-in-from-bottom-8 duration-500">
            {STATUSES.map((status) => {
              const statusCards = cards
                .filter(c => c.status === status)
                .filter(c => 
                  searchQuery === '' || 
                  (c.title || '').toLowerCase().includes(searchQuery.toLowerCase()) || 
                  (c.description || '').toLowerCase().includes(searchQuery.toLowerCase())
                )
                .sort((a, b) => {
                  if ((a.position ?? 0) !== (b.position ?? 0)) {
                    return (a.position ?? 0) - (b.position ?? 0);
                  }
                  return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
                });
              const isOver = dragOverStatus === status;
              
              // Map colors for headers
              let headerColorClass = 'text-gray-500 border-gray-500/20 bg-gray-500/5';
              let StatusIcon = Inbox;
              
              if (status === 'To Do') {
                headerColorClass = 'text-blue-500 border-blue-500/20 bg-blue-500/5';
                StatusIcon = Clock;
              }
              if (status === 'On Going') {
                headerColorClass = 'text-amber-500 border-amber-500/20 bg-amber-500/5';
                StatusIcon = Activity;
              }
              if (status === 'Done') {
                headerColorClass = 'text-emerald-500 border-emerald-500/20 bg-emerald-500/5';
                StatusIcon = CheckCircle2;
              }

              return (
                <div 
                  key={status}
                  onDragOver={(e) => handleDragOver(e, status)}
                  onDragLeave={handleDragLeave}
                  onDrop={(e) => handleDropOnColumn(e, status)}
                  className={`flex flex-col rounded-xl border p-5 transition-all duration-300 min-h-[500px] backdrop-blur-3xl
                    ${isOver 
                      ? (isDarkMode ? 'border-blue-500/50 bg-blue-500/10 shadow-[0_0_30px_rgba(59,130,246,0.15)] scale-[1.01]' : 'border-blue-400 bg-blue-50/60 shadow-xl scale-[1.01]')
                      : (isDarkMode ? 'bg-black/40 border-white/10 shadow-2xl' : 'bg-white/40 border-white/60 shadow-xl')}`}
                >
                  {/* Column Header */}
                  <div className="flex items-center justify-between mb-5">
                    <div className="flex items-center gap-3">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] border ${headerColorClass}`}>
                        <StatusIcon className="w-3.5 h-3.5" />
                        {status}
                      </span>
                      <span className={`text-[10px] font-black tracking-widest opacity-40`}>
                        ({statusCards.length})
                      </span>
                    </div>
                    <button 
                      onClick={() => openCreateModal(status)}
                      className={`p-2 rounded-xl border text-xs font-black transition-all hover:scale-110 active:scale-95
                        ${isDarkMode 
                          ? 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10 hover:text-white' 
                          : 'bg-black/5 border-black/5 text-slate-500 hover:bg-blue-500/10 hover:text-blue-600 hover:border-blue-500/20'}`}
                      title="Adicionar Atividade"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Cards Container */}
                  <div className="flex-1 flex flex-col gap-4 overflow-y-auto max-h-[600px] custom-scrollbar pr-1 pb-10">
                    {statusCards.length === 0 ? (
                      <div className={`flex-1 flex flex-col items-center justify-center p-8 text-center rounded-xl border-2 border-dashed transition-all duration-300
                        ${isDarkMode ? 'border-white/10 bg-white/[0.02] hover:bg-white/[0.05]' : 'border-black/10 bg-black/[0.02] hover:bg-black/[0.05]'}`}>
                        <div className={`w-12 h-12 rounded-full mb-3 flex items-center justify-center ${isDarkMode ? 'bg-white/5' : 'bg-black/5'}`}>
                          <Inbox className={`w-5 h-5 opacity-40 ${isDarkMode ? 'text-white' : 'text-slate-900'}`} />
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40 mb-1">Nenhuma Atividade</span>
                        <span className="text-[8px] font-bold uppercase tracking-widest opacity-20">Solte cards aqui</span>
                      </div>
                    ) : (
                      statusCards.map((card) => {
                        // Find assigned member details if any
                        const assignedMember = activeTab === 'time' && squad
                          ? squad.members.find(m => m.id === card.assigned_member_id)
                          : null;

                        const isDraggedOver = draggedOverCardId === card.id && card.id !== draggedCardId;

                        const isPastDue = card.deadline && card.status !== 'Done' && new Date(`${card.deadline}T23:59:59`) < new Date();

                        return (
                          <div
                            key={card.id}
                            draggable
                            onDragStart={(e) => handleDragStart(e, card.id)}
                            onDragOver={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              setDraggedOverCardId(card.id);
                            }}
                            onDragLeave={() => setDraggedOverCardId(null)}
                            onDrop={(e) => handleDropOnCard(e, card.id, status)}
                            onDoubleClick={() => openEditModal(card)}
                            className={`group relative cursor-grab active:cursor-grabbing hover:scale-[1.02] transition-all duration-300 overflow-hidden rounded-xl border backdrop-blur-md
                              ${isDraggedOver ? 'scale-[1.02] shadow-[0_10px_30px_rgba(59,130,246,0.2)]' : 'hover:shadow-2xl'}
                              ${isPastDue 
                                ? (isDarkMode ? 'bg-red-950/80 border-red-500/50 shadow-[0_0_20px_rgba(239,68,68,0.3)]' : 'bg-red-100/90 border-red-500 shadow-[0_0_20px_rgba(239,68,68,0.4)]') 
                                : (isDarkMode ? 'bg-black/40 border-white/10' : 'bg-white/60 border-white/60 shadow-lg')}`}
                          >
                            {/* Criticality Top Accent Bar */}
                            <div 
                              className={`h-[3px] w-full ${
                                isPastDue ? 'bg-red-500' :
                                card.priority === 'Alta'
                                  ? 'bg-gradient-to-r from-rose-500 to-rose-600'
                                  : card.priority === 'Baixa'
                                    ? 'bg-gradient-to-r from-emerald-500 to-emerald-600'
                                    : 'bg-gradient-to-r from-amber-500 to-amber-600'
                              }`}
                            />
                            {/* Card Body */}
                            <div className="p-5">
                            {/* Card Content */}
                            <div className="space-y-3 pl-1">
                              <div className="flex items-start justify-between gap-3 pr-14">
                                <h4 className={`text-[11px] font-black uppercase tracking-[0.05em] leading-snug flex-1 ${isDarkMode ? 'text-white' : 'text-zinc-900'}`}>
                                  {card.title}
                                </h4>
                                {card.priority && (
                                  <span className={`inline-flex px-2 py-0.5 rounded-lg text-[8px] font-black uppercase tracking-[0.2em] border shrink-0
                                    ${card.priority === 'Alta' 
                                      ? 'bg-rose-500/10 text-rose-500 border-rose-500/20 shadow-sm' 
                                      : card.priority === 'Baixa' 
                                        ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20 shadow-sm' 
                                        : 'bg-amber-500/10 text-amber-500 border-amber-500/20 shadow-sm'
                                    }`}
                                  >
                                    {card.priority}
                                  </span>
                                )}
                              </div>
                              
                              {card.description && (
                                <p className={`text-[10px] leading-relaxed line-clamp-3 font-medium whitespace-pre-wrap ${isDarkMode ? 'text-white/40' : 'text-zinc-600'}`}>
                                  {card.description}
                                </p>
                              )}

                              {/* Footer (Metadata + Assigne) */}
                              <div className={`flex items-center justify-between border-t pt-3 mt-1 flex-wrap gap-2 ${isDarkMode ? 'border-white/10' : 'border-black/5'}`}>
                                <div className="flex items-center gap-2">
                                  <div className={`flex items-center gap-1.5 opacity-60 text-[9px] font-black tracking-widest uppercase ${isPastDue ? 'text-red-500' : ''}`}>
                                    <CalendarDays className="w-3 h-3" />
                                    <span>
                                      {new Date(card.created_at).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })}
                                    </span>
                                  </div>
                                  {card.deadline && (
                                    <div className={`flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[8px] font-black tracking-widest uppercase
                                      ${isPastDue ? 'bg-red-500 text-white' : isDarkMode ? 'bg-white/10 text-white/60' : 'bg-black/5 text-black/60'}`}>
                                      <Clock className="w-2.5 h-2.5" />
                                      <span>
                                        {new Date(`${card.deadline}T12:00:00`).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })}
                                      </span>
                                    </div>
                                  )}
                                </div>

                                {activeTab === 'time' && (
                                  <div className="flex items-center gap-1.5 max-w-full">
                                    {assignedMember ? (
                                      <div 
                                        title={`Responsável: ${assignedMember.name}`}
                                        className={`flex items-center gap-1.5 px-2 py-0.5 rounded-lg border text-[8px] font-black uppercase tracking-[0.2em]
                                          ${isDarkMode ? 'bg-indigo-500/10 border-indigo-500/20 text-indigo-400' : 'bg-indigo-50 border-indigo-100 text-indigo-700'}`}
                                      >
                                        <div className="w-4 h-4 rounded-md overflow-hidden shrink-0 flex items-center justify-center bg-gradient-to-br from-indigo-500 to-purple-600 text-white font-bold text-[7px]">
                                          {assignedMember.avatar ? (
                                            <img src={assignedMember.avatar} alt="Avatar" className="w-full h-full object-cover" />
                                          ) : (
                                            assignedMember.name.charAt(0)
                                          )}
                                        </div>
                                        <span className="truncate max-w-[80px]">{assignedMember.name.split(' ')[0]}</span>
                                      </div>
                                    ) : (
                                      <div 
                                        className={`flex items-center gap-1 px-2 py-0.5 rounded-lg border text-[8px] font-black tracking-[0.2em] uppercase opacity-30
                                          ${isDarkMode ? 'border-white/10' : 'border-black/10'}`}
                                      >
                                        <UserPlus className="w-3 h-3" />
                                        <span>N/A</span>
                                      </div>
                                    )}
                                  </div>
                                )}
                              </div>
                            </div>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* Create/Edit Dialog Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[250] flex items-center justify-center p-4 backdrop-blur-2xl animate-in fade-in" onClick={() => setIsModalOpen(false)}>
          <div className="absolute inset-0 bg-black/60" />
          <div 
            onClick={(e) => e.stopPropagation()}
            className={`relative w-full max-w-lg rounded-xl overflow-hidden border-none shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] animate-in zoom-in-95 duration-300 flex flex-col
              ${isDarkMode ? 'bg-[#0a0a0a]/90 ring-1 ring-white/10' : 'bg-white/90 ring-1 ring-black/5'}`}
          >
            {/* Modal Header */}
            <div className={`p-8 border-b flex justify-between items-center ${isDarkMode ? 'border-white/5 bg-white/5' : 'border-black/5 bg-black/[0.02]'}`}>
              <div className="space-y-1">
                <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-500 text-[8px] font-black uppercase tracking-widest mb-1">
                  <FileText className="w-3 h-3" />
                  Kanban
                </div>
                <h3 className={`text-2xl font-black tracking-tighter ${isDarkMode ? 'text-white' : 'text-zinc-900'}`}>
                  {editingCard ? 'Editar Atividade' : 'Nova Atividade'}
                </h3>
              </div>
              <button 
                onClick={() => setIsModalOpen(false)}
                className={`p-2.5 rounded-xl hover:bg-red-500/10 hover:text-red-500 opacity-60 hover:opacity-100 transition-colors`}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body Form */}
            <form onSubmit={handleSaveCard} className="p-8 space-y-6 max-h-[60vh] overflow-y-auto custom-scrollbar">
              {/* Title */}
              <div className="space-y-2">
                <label className="text-[8px] font-black uppercase tracking-[0.2em] opacity-40 flex items-center gap-1.5">
                  Título da Atividade <span className="text-red-500">*</span>
                </label>
                <Input 
                  value={modalTitle}
                  onChange={(e) => setModalTitle(e.target.value)}
                  placeholder="Ex: Refatorar tela de login"
                  className={`h-11 rounded-xl text-xs font-bold transition-all duration-300 ${isDarkMode ? 'bg-black/40 border-white/10 text-white' : 'bg-white border-black/10'}`}
                  maxLength={80}
                  required
                />
              </div>

              {/* Description */}
              <div className="space-y-2">
                <label className="text-[8px] font-black uppercase tracking-[0.2em] opacity-40 flex items-center gap-1.5">
                  Descrição detalhada
                </label>
                <textarea 
                  value={modalDesc}
                  onChange={(e) => setModalDesc(e.target.value)}
                  placeholder="Escreva detalhes sobre o que precisa ser feito..."
                  rows={3}
                  className={`w-full p-4 rounded-xl text-xs font-bold resize-none border focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all duration-300
                    ${isDarkMode ? 'bg-black/40 border-white/10 text-white' : 'bg-white border-black/10 text-zinc-900'}`}
                />
              </div>

              {/* Status & Priority & Assignee Selectors */}
              <div className={activeTab === 'time' && squad ? "grid grid-cols-1 sm:grid-cols-3 gap-4" : "grid grid-cols-2 gap-4"}>
                <div className="space-y-2">
                  <label className="text-[8px] font-black uppercase tracking-[0.2em] opacity-40">
                    Status
                  </label>
                  <select 
                    value={modalStatus}
                    onChange={(e) => setModalStatus(e.target.value)}
                    className={`w-full h-11 px-4 rounded-xl text-xs font-bold border focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all duration-300
                      ${isDarkMode ? 'bg-black/40 border-white/10 text-white' : 'bg-white border-black/10 text-zinc-900'}`}
                  >
                    {STATUSES.map(s => (
                      <option key={s} value={s} className={isDarkMode ? 'bg-[#0a0a0a] text-white' : 'bg-white text-zinc-900'}>{s}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-[8px] font-black uppercase tracking-[0.2em] opacity-40">
                    Prioridade
                  </label>
                  <select 
                    value={modalPriority}
                    onChange={(e) => setModalPriority(e.target.value)}
                    className={`w-full h-11 px-4 rounded-xl text-xs font-bold border focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all duration-300
                      ${isDarkMode ? 'bg-black/40 border-white/10 text-white' : 'bg-white border-black/10 text-zinc-900'}`}
                  >
                    <option value="Baixa" className={isDarkMode ? 'bg-[#0a0a0a] text-white' : 'bg-white text-zinc-900'}>Baixa</option>
                    <option value="Média" className={isDarkMode ? 'bg-[#0a0a0a] text-white' : 'bg-white text-zinc-900'}>Média</option>
                    <option value="Alta" className={isDarkMode ? 'bg-[#0a0a0a] text-white' : 'bg-white text-zinc-900'}>Alta</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-[8px] font-black uppercase tracking-[0.2em] opacity-40 flex items-center gap-1.5">
                    Prazo (Deadline)
                  </label>
                  <Input 
                    type="date"
                    value={modalDeadline}
                    onChange={(e) => setModalDeadline(e.target.value)}
                    className={`h-11 rounded-xl text-xs font-bold transition-all duration-300 
                      ${isDarkMode ? 'bg-black/40 border-white/10 text-white [color-scheme:dark]' : 'bg-white border-black/10 text-zinc-900'}`}
                  />
                </div>

                {/* Assigned Team Member (Only visible in Team Kanban mode) */}
                {activeTab === 'time' && squad && (
                  <div className="space-y-2">
                    <label className="text-[8px] font-black uppercase tracking-[0.2em] opacity-40 flex items-center gap-1.5">
                      Responsável
                    </label>
                    <select 
                      value={modalAssignedId}
                      onChange={(e) => setModalAssignedId(parseInt(e.target.value))}
                      className={`w-full h-11 px-4 rounded-xl text-xs font-bold border focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all duration-300
                        ${isDarkMode ? 'bg-black/40 border-white/10 text-white' : 'bg-white border-black/10 text-zinc-900'}`}
                    >
                      <option value={0} className={isDarkMode ? 'bg-[#0a0a0a] text-white' : 'bg-white text-zinc-900'}>Sem alocação</option>
                      {squad.members.map(member => (
                        <option key={member.id} value={member.id} className={isDarkMode ? 'bg-[#0a0a0a] text-white' : 'bg-white text-zinc-900'}>
                          {member.name}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>

              {/* Modal Footer Buttons */}
              <div className="flex items-center justify-between gap-3 pt-6 mt-4 border-t border-black/5 dark:border-white/5">
                {editingCard && editingCard.id ? (
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => {
                      if(editingCard.id) {
                        handleDeleteCard(editingCard.id);
                        setIsModalOpen(false);
                      }
                    }}
                    className="px-4 h-12 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] text-red-500 hover:bg-red-500/10 transition-colors"
                  >
                    <Trash2 className="w-4 h-4 mr-2" /> Excluir
                  </Button>
                ) : <div />}
                
                <div className="flex items-center gap-3">
                  <Button 
                    type="button" 
                    variant="ghost" 
                    onClick={() => setIsModalOpen(false)}
                    className="px-6 h-12 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-slate-500/10 hover:text-slate-500 transition-colors"
                  >
                    Cancelar
                  </Button>
                  <Button 
                    type="submit" 
                    className="px-8 h-12 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-600/20 transition-all hover:scale-105 active:scale-95"
                  >
                    Salvar Atividade
                  </Button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}