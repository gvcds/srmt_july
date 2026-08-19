'use client';

import React, { useState, useEffect, useMemo, useCallback, Suspense } from 'react';
import { 
  Users, 
  Plus, 
  Edit2, 
  Trash2, 
  ChevronRight, 
  ChevronDown, 
  LayoutGrid, 
  Monitor, 
  Smartphone, 
  Headphones, 
  Briefcase,
  Sparkles,
  Zap,
  ShieldCheck,
  UserPlus,
  Settings,
  MoreVertical,
  X,
  PlusCircle,
  Hash,
  Mail,
  ArrowRightLeft,
  ChevronLeft,
  Cpu,
  Table as TableIcon,
  Search,
  RotateCcw,
  Database,
  Download
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Navbar } from "@/components/navbar";
import { useTheme } from '@/components/theme-provider';
import { CustomToast } from "@/components/ui/toast";
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';

// --- TYPES ---
interface TeamBoardArea {
  id: number;
  name: string;
  section: 'top' | 'middle' | 'bottom' | 'uit';
  position: number;
  tab: 'fixed' | 'current';
}

interface TeamBoardMember {
  id: number;
  area_id: number;
  user_id?: number;
  name: string;
  role?: string;
  identifier?: string;
  status: 'normal' | 'intern' | 'movement' | 'training';
  prefix?: string;
  parent_id?: number | null;
  is_highlighted?: number;
  date_range?: string;
  position?: number;
  avatar?: string;
}

interface TeamBoardProject {
  id: number;
  name: string; // This is now KP Name
  member_ids: number[];
  created_at: string;
}

// --- HELPERS ---
const getApiBaseUrl = () => {
  if (typeof window !== "undefined") return `${window.location.protocol}//${window.location.hostname}:8001`;
  return "http://localhost:8001";
};

// Re-using NeutronStar for consistency with the design model
const NeutronStar = ({ isDarkMode }: { isDarkMode: boolean }) => {
  // Mock component as it needs three.js setup from ia-svp
  return null; 
};

// 1. Animated Background (Unified Model)
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
      <div className={`absolute top-[-10%] left-[-10%] w-[60%] h-[60%] rounded-lg blur-[120px] opacity-20 animate-pulse 
        ${isDarkMode ? 'bg-blue-600' : 'bg-blue-400'}`} 
        style={{ animationDuration: '8s' }} 
      />
      <div className={`absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] rounded-lg blur-[120px] opacity-20 animate-pulse
        ${isDarkMode ? 'bg-blue-600' : 'bg-blue-400'}`} 
        style={{ animationDuration: '12s', animationDelay: '2s' }} 
      />
      <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at center, transparent 0%, rgba(0,0,0,0.1) 100%)' }}>
        <div className="stars-container">
          {stars.map((star, i) => (
            <div key={i} className={`star ${isDarkMode ? 'bg-white' : 'bg-blue-500'}`} style={{ top: star.top, left: star.left, animationDelay: star.delay, animationDuration: star.duration, opacity: star.opacity, transform: `scale(${star.scale})` }} />
          ))}
        </div>
      </div>
      <style jsx>{`
        .stars-container { position: relative; width: 100%; height: 100%; }
        .star { position: absolute; width: 2px; height: 2px; border-radius: 50%; animation: float linear infinite; }
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

export default function TimeSemanalPage() {
  const { isDarkMode } = useTheme();
  const [activeTab, setActiveTab] = useState<'fixed' | 'current' | 'project'>('fixed');
  
  const [areas, setAreas] = useState<TeamBoardArea[]>([]);
  const [members, setMembers] = useState<TeamBoardMember[]>([]);
  const [projects, setProjects] = useState<TeamBoardProject[]>([]);
  const [allUsers, setAllUsers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [toast, setToast] = useState({ message: '', type: 'info' as any, visible: false });
  const [activeAreasByProject, setActiveAreasByProject] = useState<Record<number, number[]>>({});

  // Modal states
  const [isAreaModalOpen, setIsAreaModalOpen] = useState(false);
  const [isMemberModalOpen, setIsMemberModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [selectedArea, setSelectedArea] = useState<TeamBoardArea | null>(null);
  const [editingArea, setEditingArea] = useState<Partial<TeamBoardArea> | null>(null);
  const [editingMember, setEditingMember] = useState<Partial<TeamBoardMember> | null>(null);
  const [editingProject, setEditingProject] = useState<Partial<TeamBoardProject> | null>(null);

  // User search states
  const [userSearchQuery, setUserSearchQuery] = useState('');
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);

  // Project allocation search state { projectId_areaId: query }
  const [projectAllocationSearch, setProjectAllocationSearch] = useState<{ [key: string]: string }>({});
  const [activeAllocationDropdown, setActiveAllocationDropdown] = useState<string | null>(null);

  // Drag and Drop state
  const [draggedMemberId, setDraggedMemberId] = useState<number | null>(null);
  const [draggedAreaId, setDraggedAreaId] = useState<number | null>(null);
  const [draggedProjectId, setDraggedProjectId] = useState<number | null>(null);
  const [quickProjectName, setQuickProjectName] = useState('');

  const formatName = (name: string) => {
    return name
      .toLowerCase()
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const checkIsIntern = (name: string) => {
    const parts = name.trim().split(/\s+/);
    return parts.some(part => part.toLowerCase().endsWith('-e'));
  };

  const showToast = (message: string, type: 'success' | 'error' | 'warning' | 'info' = 'info') => {
    setToast({ message, type, visible: true });
    setTimeout(() => setToast(prev => ({ ...prev, visible: false })), 3000);
  };

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      let currentMembers: TeamBoardMember[] = [];
      let currentAreas: TeamBoardArea[] = [];
      const res = await fetch(`${getApiBaseUrl()}/team-board/all?tab=${activeTab === 'project' ? 'fixed' : activeTab}`);
      if (res.ok) {
        const data = await res.json();
        setAreas(data.areas);
        setMembers(data.members);
        currentMembers = data.members;
        currentAreas = data.areas;
      }
      
      const usersRes = await fetch(`${getApiBaseUrl()}/users`);
      if (usersRes.ok) {
        setAllUsers(await usersRes.json());
      }
      
      const projRes = await fetch(`${getApiBaseUrl()}/team-board/kp-projects?tab=${activeTab === 'project' ? 'fixed' : activeTab}`);
      if (projRes.ok) {
        const projs = await projRes.json();
        setProjects(projs);

        setActiveAreasByProject(prev => {
          const newState = { ...prev };
          const uitAreaIds = currentAreas.filter(a => a.section === 'uit').map(a => a.id);
          
          projs.forEach((p: any) => {
            const memberAreas = p.member_ids
              .map((id: number) => currentMembers.find(m => m.id === id)?.area_id)
              .filter(Boolean) as number[];
            
            const existing = newState[p.id];
            if (!existing) {
              newState[p.id] = [...new Set([...uitAreaIds, ...memberAreas])];
            } else {
              newState[p.id] = [...new Set([...existing, ...memberAreas])];
            }
          });
          return newState;
        });
      }
    } catch (error) {
      showToast("Erro ao carregar dados.", "error");
    } finally {
      setIsLoading(false);
    }
  }, [activeTab]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleSaveProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProject?.name) return;
    
    const method = editingProject.id ? 'PUT' : 'POST';
    const url = editingProject.id 
      ? `${getApiBaseUrl()}/team-board/kp-projects/${editingProject.id}` 
      : `${getApiBaseUrl()}/team-board/kp-projects`;

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          name: editingProject.name,
          tab: activeTab === 'project' ? 'fixed' : activeTab
        })
      });
      if (res.ok) {
        const savedProject = await res.json();
        showToast(editingProject.id ? "Projeto atualizado!" : "Projeto criado!", "success");
        
        if (!editingProject.id) {
          const uitAreaIds = areas.filter(a => a.section === 'uit').map(a => a.id);
          setActiveAreasByProject(prev => ({
            ...prev,
            [savedProject.id]: uitAreaIds
          }));
        }

        setIsProjectModalOpen(false);
        setEditingProject(null);
        fetchData();
      }
    } catch (error) {
      showToast("Erro ao salvar projeto.", "error");
    }
  };

  const handleUpdateProjectMember = async (projectId: number, memberId: number | string, oldMemberId?: number) => {
    const project = projects.find(p => p.id === projectId);
    if (!project) return;

    let newMemberIds = [...project.member_ids];
    
    if (oldMemberId) {
      newMemberIds = newMemberIds.filter(id => id !== oldMemberId);
    }
    
    const mid = typeof memberId === 'string' ? parseInt(memberId) : memberId;
    if (!isNaN(mid) && mid > 0 && !newMemberIds.includes(mid)) {
      newMemberIds.push(mid);
    }

    try {
      const res = await fetch(`${getApiBaseUrl()}/team-board/kp-projects/${projectId}/members`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ member_ids: newMemberIds })
      });
      if (res.ok) {
        showToast("Squad atualizado!", "success");
        fetchData();
      }
    } catch (error) {
      showToast("Erro ao atualizar squad.", "error");
    }
  };

  const handleDeleteProject = async (id: number) => {
    if (!confirm("Excluir este time de projeto?")) return;
    try {
      const res = await fetch(`${getApiBaseUrl()}/team-board/kp-projects/${id}`, { method: 'DELETE' });
      if (res.ok) {
        showToast("Projeto removido.", "success");
        fetchData();
      }
    } catch (error) {
      showToast("Erro ao excluir projeto.", "error");
    }
  };

  const toggleAreaInProject = (projectId: number, areaId: number) => {
    setActiveAreasByProject(prev => {
      const currentAreas = prev[projectId] || [];
      if (currentAreas.includes(areaId)) {
        return { ...prev, [projectId]: currentAreas.filter(id => id !== areaId) };
      } else {
        return { ...prev, [projectId]: [...currentAreas, areaId] };
      }
    });
  };

  const handleReplicateFixed = async () => {
    if (!confirm("Isso apagará todo o Time Atual e replicará a estrutura do Time Fixo. Deseja continuar?")) return;
    setIsLoading(true);
    try {
      const res = await fetch(`${getApiBaseUrl()}/team-board/replicate-fixed`, { method: 'POST' });
      if (res.ok) {
        showToast("Time Fixo replicado com sucesso!", "success");
        fetchData();
      } else {
        showToast("Erro ao replicar time.", "error");
      }
    } catch (error) {
      showToast("Erro na conexão com o servidor.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  // --- DRAG AND DROP HANDLERS ---
  const handleDragStart = (e: React.DragEvent, id: number) => {
    setDraggedMemberId(id);
    e.dataTransfer.setData('memberId', id.toString());
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = async (e: React.DragEvent, targetId: number | string, isAreaTarget = false, isProjectTarget = false) => {
    e.preventDefault();
    const sourceMemberId = parseInt(e.dataTransfer.getData('memberId'));
    if (isNaN(sourceMemberId)) return;
    
    const sourceMember = members.find(m => m.id === sourceMemberId);
    if (!sourceMember) return;

    if (isProjectTarget) {
      const projectId = parseInt(targetId as string);
      const project = projects.find(p => p.id === projectId);
      if (!project) return;
      const sameProject = project.member_ids.includes(sourceMemberId);
      if (!sameProject) {
        const previousProject = projects.find(p => p.member_ids.includes(sourceMemberId));
        if (previousProject) {
          const updatedPrevIds = previousProject.member_ids.filter(id => id !== sourceMemberId);
          await fetch(`${getApiBaseUrl()}/team-board/kp-projects/${previousProject.id}/members`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ member_ids: updatedPrevIds })
          });
        }
        handleUpdateProjectMember(projectId, sourceMemberId);
      }
      return;
    }

    if (!isAreaTarget) {
      const targetMember = members.find(m => m.id === targetId);
      if (!targetMember) return;
      
      const sameArea = sourceMember.area_id === targetMember.area_id;
      if (sameArea) {
        const areaMembers = members.filter(m => m.area_id === sourceMember.area_id);
        const updatedAreaMembers = [...areaMembers];
        const sourceIndex = updatedAreaMembers.findIndex(m => m.id === sourceMemberId);
        const targetIndex = updatedAreaMembers.findIndex(m => m.id === targetMember.id);
        updatedAreaMembers.splice(sourceIndex, 1);
        updatedAreaMembers.splice(targetIndex, 0, sourceMember);
        const newMembers = members.map(m => {
          if (m.area_id === sourceMember.area_id) {
            const index = updatedAreaMembers.findIndex(um => um.id === m.id);
            return { ...m, position: index };
          }
          return m;
        }).sort((a, b) => (a.position || 0) - (b.position || 0));
        setMembers(newMembers);
        try {
          const positions = updatedAreaMembers.map((m, index) => ({ id: m.id, position: index }));
          await fetch(`${getApiBaseUrl()}/team-board-members/bulk-position`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ members: positions })
          });
        } catch (error) {
          showToast("Erro ao salvar nova ordem.", "error");
          fetchData();
        }
      } else {
        handleMoveToArea(sourceMember, targetMember.area_id);
      }
    } 
    else {
      const targetAreaId = parseInt(targetId as string);
      if (sourceMember.area_id === targetAreaId) return;
      handleMoveToArea(sourceMember, targetAreaId);
    }
    setDraggedMemberId(null);
  };

  const handleMoveToArea = async (member: TeamBoardMember, newAreaId: number) => {
    const updatedMember: TeamBoardMember = { ...member, area_id: newAreaId, position: 999, parent_id: null, status: 'movement' };
    setMembers(prev => prev.map(m => m.id === member.id ? updatedMember : m));
    try {
      const res = await fetch(`${getApiBaseUrl()}/team-board-members/${member.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedMember)
      });
      if (res.ok) {
        showToast(`Membro movido para nova área. Status alterado para Movimentação.`, "success");
        fetchData();
      }
    } catch (error) {
      showToast("Erro ao mover membro.", "error");
      fetchData();
    }
  };

  const handleDragStartArea = (e: React.DragEvent, id: number) => {
    setDraggedAreaId(id);
    e.dataTransfer.setData('areaId', id.toString());
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDropArea = async (e: React.DragEvent, targetId: number) => {
    e.preventDefault();
    const sourceId = parseInt(e.dataTransfer.getData('areaId'));
    if (isNaN(sourceId) || sourceId === targetId) return;
    const sourceArea = areas.find(a => a.id === sourceId);
    if (!sourceArea) return;
    const updatedAreas = [...areas];
    const sourceIndex = updatedAreas.findIndex(a => a.id === sourceId);
    const targetIndex = updatedAreas.findIndex(a => a.id === targetId);
    updatedAreas.splice(sourceIndex, 1);
    updatedAreas.splice(targetIndex, 0, sourceArea);
    const newAreas = updatedAreas.map((a, index) => ({ ...a, position: index }));
    setAreas(newAreas);
    try {
      const positions = newAreas.map((a, index) => ({ id: a.id, position: index }));
      await fetch(`${getApiBaseUrl()}/team-board-areas/bulk-position`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ areas: positions })
      });
    } catch (error) {
      showToast("Erro ao reordenar áreas.", "error");
      fetchData();
    }
    setDraggedAreaId(null);
  };

  const handleDragStartProject = (e: React.DragEvent, id: number) => {
    setDraggedProjectId(id);
    e.dataTransfer.setData('projectId', id.toString());
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDropProject = async (e: React.DragEvent, targetId: number) => {
    e.preventDefault();
    const sourceId = parseInt(e.dataTransfer.getData('projectId'));
    if (isNaN(sourceId) || sourceId === targetId) return;
    const sourceProject = projects.find(p => p.id === sourceId);
    if (!sourceProject) return;
    const updatedProjects = [...projects];
    const sourceIndex = updatedProjects.findIndex(p => p.id === sourceId);
    const targetIndex = updatedProjects.findIndex(p => p.id === targetId);
    updatedProjects.splice(sourceIndex, 1);
    updatedProjects.splice(targetIndex, 0, sourceProject);
    const newProjects = updatedProjects.map((p, index) => ({ ...p, position: index }));
    setProjects(newProjects as any);
    try {
      const positions = newProjects.map((p, index) => ({ id: p.id, position: index }));
      await fetch(`${getApiBaseUrl()}/team-board/kp-projects/bulk-position`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ projects: positions })
      });
    } catch (error) {
      showToast("Erro ao reordenar squads.", "error");
      fetchData();
    }
    setDraggedProjectId(null);
  };

  const handleSaveArea = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingArea?.name) return;
    const method = editingArea.id ? 'PUT' : 'POST';
    const url = editingArea.id ? `${getApiBaseUrl()}/team-board-areas/${editingArea.id}` : `${getApiBaseUrl()}/team-board-areas`;
    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...editingArea, tab: activeTab })
      });
      if (res.ok) {
        showToast(editingArea.id ? "Área atualizada!" : "Área criada!", "success");
        setIsAreaModalOpen(false);
        fetchData();
      }
    } catch (error) {
      showToast("Erro ao salvar área.", "error");
    }
  };

  const handleDeleteArea = async (id: number) => {
    if (!confirm("Deseja realmente excluir esta área e todos os seus membros?")) return;
    try {
      const res = await fetch(`${getApiBaseUrl()}/team-board-areas/${id}`, { method: 'DELETE' });
      if (res.ok) {
        showToast("Área removida.", "success");
        fetchData();
      }
    } catch (error) {
      showToast("Erro ao excluir área.", "error");
    }
  };

  const handleSaveMember = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingMember?.name || !editingMember?.area_id) return;
    const method = editingMember.id ? 'PUT' : 'POST';
    const url = editingMember.id ? `${getApiBaseUrl()}/team-board-members/${editingMember.id}` : `${getApiBaseUrl()}/team-board-members`;
    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingMember)
      });
      if (res.ok) {
        showToast(editingMember.id ? "Membro atualizado!" : "Membro adicionado!", "success");
        setIsMemberModalOpen(false);
        fetchData();
      }
    } catch (error) {
      showToast("Erro ao salvar membro.", "error");
    }
  };

  const handleDeleteMember = async (id: number) => {
    if (!confirm("Excluir membro?")) return;
    try {
      const res = await fetch(`${getApiBaseUrl()}/team-board-members/${id}`, { method: 'DELETE' });
      if (res.ok) {
        showToast("Membro removido.", "success");
        fetchData();
      }
    } catch (error) {
      showToast("Erro ao excluir membro.", "error");
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'intern': return 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20';
      case 'movement': return 'bg-amber-500/10 text-amber-600 border-amber-500/20';
      case 'training': return 'bg-purple-500/10 text-purple-600 border-purple-500/20';
      default: return 'bg-blue-500/5 text-blue-600 border-blue-500/10';
    }
  };

  const getStatusDot = (status: string) => {
    switch (status) {
      case 'intern': return 'bg-emerald-500';
      case 'movement': return 'bg-amber-500';
      case 'training': return 'bg-purple-500';
      default: return 'bg-blue-500';
    }
  };

  const renderMemberRow = (member: TeamBoardMember, level = 0) => {
    const isHighlighted = member.is_highlighted || member.prefix?.toUpperCase() === 'KP';
    const highlightClass = isHighlighted 
      ? 'bg-blue-900 border-blue-800 shadow-xl shadow-blue-900/20 text-white' 
      : `${getStatusColor(member.status)}`;
    const isDragged = draggedMemberId === member.id;

    // Use avatar provided by backend or fallback to old matching logic
    let avatarToUse = member.avatar;
    if (!avatarToUse) {
      const matchStr = (member.prefix || member.identifier || member.name).toLowerCase().trim();
      const matchedUser = allUsers.find(u => 
        u.email?.toLowerCase().includes(matchStr) || 
        u.name?.toLowerCase().includes(matchStr)
      );
      avatarToUse = matchedUser?.avatar;
    }

    return (
      <div key={member.id} className={`group relative ${isDragged ? 'opacity-20' : ''}`} draggable onDragStart={(e) => handleDragStart(e, member.id)} onDragOver={handleDragOver} onDrop={(e) => handleDrop(e, member.id)}>
        <div className={`flex items-center gap-3 p-2 rounded-xl border transition-all ${highlightClass} ${level > 0 ? 'ml-6 border-l-2' : ''}`}>
          <div className={`flex-shrink-0 w-8 h-8 rounded-lg ${isHighlighted ? 'bg-white/10' : 'bg-white/50 dark:bg-black/20'} flex items-center justify-center overflow-hidden`}>
            {avatarToUse ? (
              <img src={avatarToUse} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
              <div className={`w-2 h-2 rounded-full ${isHighlighted ? 'bg-blue-400' : getStatusDot(member.status)} shadow-[0_0_8px] shadow-current`} />
            )}
          </div>
          <div className="flex-grow min-w-0">
            <div className="flex items-center gap-2">
              {member.prefix && <span className={`text-[9px] font-black uppercase ${isHighlighted ? 'opacity-60' : 'opacity-40'}`}>{member.prefix}</span>}
              <span className={`text-xs font-bold truncate tracking-tight ${isHighlighted ? 'text-white' : ''}`}>{member.name}</span>
            </div>
            <div className="flex items-center justify-between gap-2">
              {member.role && <p className={`text-[9px] font-black uppercase ${isHighlighted ? 'text-blue-200 opacity-80' : 'opacity-40'} truncate`}>{member.role}</p>}
              {member.date_range && <p className={`text-[8px] font-bold ${isHighlighted ? 'text-blue-300' : 'text-blue-500'} whitespace-nowrap`}>{member.date_range}</p>}
            </div>
          </div>
          <div className={`opacity-0 group-hover:opacity-100 flex items-center gap-1 transition-opacity`}>
            <button onClick={(e) => { e.stopPropagation(); setEditingMember(member); setIsMemberModalOpen(true); }} className={`p-1.5 rounded-lg ${isHighlighted ? 'hover:bg-white/10 text-white' : 'hover:bg-black/5'}`}><Edit2 className="w-3 h-3" /></button>
            <button onClick={(e) => { e.stopPropagation(); handleDeleteMember(member.id); }} className={`p-1.5 rounded-lg ${isHighlighted ? 'hover:bg-red-500/20 text-red-300' : 'hover:bg-red-500/10 text-red-500'}`}><Trash2 className="w-3 h-3" /></button>
          </div>
        </div>
        {members.filter(m => m.parent_id === member.id).map(child => renderMemberRow(child, level + 1))}
      </div>
    );
  };

  const renderArea = (area: TeamBoardArea) => {
    const areaMembers = members.filter(m => m.area_id === area.id && !m.parent_id);
    const isDragged = draggedAreaId === area.id;
    return (
      <Card key={area.id} onClick={() => { setSelectedArea(area); setIsDetailModalOpen(true); }} onDragOver={handleDragOver} onDrop={(e) => { const areaId = e.dataTransfer.getData('areaId'); if (areaId) handleDropArea(e, area.id); else handleDrop(e, area.id, true); }} className={`flex flex-col rounded-xl border overflow-hidden transition-all duration-500 hover:shadow-2xl cursor-pointer group/card ${isDragged ? 'opacity-20 scale-95' : ''} ${isDarkMode ? 'bg-black/40 border-white/10' : 'bg-white border-black/5'}`}>
        <div draggable onDragStart={(e) => handleDragStartArea(e, area.id)} className={`p-4 border-b flex justify-between items-center transition-colors cursor-grab active:cursor-grabbing ${isDarkMode ? 'bg-white/5 border-white/5 group-hover/card:bg-white/10' : 'bg-gray-50 border-black/5 group-hover/card:bg-gray-100'}`}>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center border border-blue-500/20">
              <Users className="w-4 h-4" />
            </div>
            <h3 className="text-xs font-black uppercase tracking-widest opacity-60">{area.name}</h3>
          </div>
          <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
            <button onClick={(e) => { e.stopPropagation(); setEditingMember({ area_id: area.id, status: 'normal' }); setIsMemberModalOpen(true); }} className="p-2 rounded-lg hover:bg-blue-500/10 text-blue-500" title="Adicionar Membro"><UserPlus className="w-4 h-4" /></button>
            <button onClick={(e) => { e.stopPropagation(); setEditingArea(area); setIsAreaModalOpen(true); }} className="p-2 rounded-lg hover:bg-black/5 opacity-30 hover:opacity-100"><Edit2 className="w-3.5 h-3.5" /></button>
            <button onClick={(e) => { e.stopPropagation(); handleDeleteArea(area.id); }} className="p-2 rounded-lg hover:bg-red-500/10 text-red-500 opacity-30 hover:opacity-100"><Trash2 className="w-3.5 h-3.5" /></button>
          </div>
        </div>
        <div className="p-4 space-y-2 max-h-[400px] overflow-y-auto custom-scrollbar" onClick={(e) => e.stopPropagation()}>
          {areaMembers.length === 0 ? <div className="py-8 text-center opacity-20 text-[10px] font-black uppercase tracking-widest italic">Vazio</div> : areaMembers.map(m => renderMemberRow(m))}
        </div>
      </Card>
    );
  };

  const areasBySection = useMemo(() => ({
    top: areas.filter(a => a.section === 'top'),
    middle: areas.filter(a => a.section === 'middle'),
    bottom: areas.filter(a => a.section === 'bottom'),
    uit: areas.filter(a => a.section === 'uit')
  }), [areas]);

  const uitAnalytics = useMemo(() => {
    const uitAreaIds = areasBySection.uit.map(a => a.id);
    const totalMembers = members.filter(m => uitAreaIds.includes(m.area_id)).length;
    const squadSize = 5;
    return {
      totalMembers,
      potentialSquads: Math.floor(totalMembers / squadSize),
      isPerfectFit: totalMembers % squadSize === 0 && totalMembers > 0,
      remainder: totalMembers % squadSize
    };
  }, [areasBySection.uit, members]);

  return (
    <div className={`min-h-screen font-sans flex flex-col items-center p-4 md:p-10 transition-colors duration-1000 ${isDarkMode ? 'bg-[#050505] text-white' : 'bg-[#f5f5f7] text-zinc-900'} overflow-x-hidden pb-20`}>
      <AIBackground isDarkMode={isDarkMode} />
      <Navbar />
      <CustomToast message={toast.message} type={toast.type} isVisible={toast.visible} onClose={() => setToast(p => ({ ...p, visible: false }))} isDarkMode={isDarkMode} />

      <div className="w-full max-w-[1600px] relative z-10 space-y-12">
        <div className="text-center space-y-4">
          <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-lg border mb-4 shadow-lg ${isDarkMode ? 'bg-white/5 border-white/10 text-blue-400' : 'bg-blue-50 border-blue-100 text-blue-600'}`}>
            <Sparkles className="w-4 h-4 animate-pulse" />
            <span className="text-[10px] font-bold uppercase tracking-widest">Gestão de Equipe</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-black tracking-tighter leading-none">Time <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Semanal</span></h1>
          <p className="text-lg max-w-2xl mx-auto opacity-60 font-medium">Quadro dinâmico de alocação e estrutura do time.</p>
        </div>

        <div className={`fixed bottom-6 left-6 z-40 flex items-center gap-6 px-6 py-3 rounded-xl border shadow-2xl backdrop-blur-2xl transition-all duration-500 ${isDarkMode ? 'bg-[#111]/40 border-white/5 shadow-black/40 text-white' : 'bg-white/60 border-slate-200 shadow-slate-200/50 text-zinc-900'}`}>
          <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]" /><span className="text-[9px] font-black uppercase tracking-widest opacity-60">Estagiário</span></div>
          <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.4)]" /><span className="text-[9px] font-black uppercase tracking-widest opacity-60">Movimentação</span></div>
          <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-purple-500 shadow-[0_0_8px_rgba(168,85,247,0.4)]" /><span className="text-[9px] font-black uppercase tracking-widest opacity-60">Treinamento</span></div>
        </div>

        <div className="flex flex-col items-center gap-6">


          <div className="flex items-center gap-4">
            {activeTab === 'current' && (
              <button onClick={handleReplicateFixed} className="px-4 py-2 rounded-xl border border-blue-500/20 bg-blue-500/5 text-blue-500 text-[9px] font-black uppercase tracking-widest hover:bg-blue-500/10 transition-all flex items-center gap-2"><ArrowRightLeft className="w-3 h-3" /> Replicar Time Fixo</button>
            )}
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
                  left: activeTab === 'fixed' ? '6px' : 'calc(50% + 2px)',
                  width: 'calc(50% - 8px)',
                  transition: 'all 500ms cubic-bezier(0.34, 1.56, 0.64, 1)',
                  borderRadius: '12px',
                  background: activeTab === 'fixed'
                    ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)' 
                    : 'linear-gradient(135deg, #6366f1 0%, #4338ca 100%)',
                  boxShadow: activeTab === 'fixed'
                    ? '0 4px 14px rgba(16, 185, 129, 0.4)'
                    : '0 4px 14px rgba(99, 102, 241, 0.4)',
                }}
              />
              
              <button 
                onClick={() => setActiveTab('fixed')} 
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
                  color: activeTab === 'fixed' ? '#ffffff' : (isDarkMode ? '#a1a1aa' : '#71717a'),
                  opacity: activeTab === 'fixed' ? 1 : 0.7,
                }}
                className="hover:opacity-100 hover:scale-[1.02]"
              >
                <Briefcase 
                  style={{
                    width: '14px',
                    height: '14px',
                    transition: 'all 0.5s ease',
                    transform: activeTab === 'fixed' ? 'rotate(360deg) scale(1.1)' : 'none',
                    color: activeTab === 'fixed' ? '#ffffff' : (isDarkMode ? '#71717a' : '#9ca3af'),
                  }}
                />
                <span>Time Fixo</span>
              </button>
              <button 
                onClick={() => setActiveTab('current')} 
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
                  color: activeTab === 'current' ? '#ffffff' : (isDarkMode ? '#a1a1aa' : '#71717a'),
                  opacity: activeTab === 'current' ? 1 : 0.7,
                }}
                className="hover:opacity-100 hover:scale-[1.02]"
              >
                <Users 
                  style={{
                    width: '14px',
                    height: '14px',
                    transition: 'all 0.5s ease',
                    transform: activeTab === 'current' ? 'rotate(360deg) scale(1.1)' : 'none',
                    color: activeTab === 'current' ? '#ffffff' : (isDarkMode ? '#71717a' : '#9ca3af'),
                  }}
                />
                <span>Time Atual</span>
              </button>
            </div>
            <Button onClick={() => { if (activeTab === 'project') { setEditingProject({}); setIsProjectModalOpen(true); } else { setEditingArea({ section: 'middle' }); setIsAreaModalOpen(true); } }} className="h-12 w-12 rounded-xl p-0 bg-blue-600 hover:bg-blue-700 shadow-xl shadow-blue-600/20"><Plus className="w-6 h-6" /></Button>
          </div>
        </div>



        <div className="space-y-16 pb-20">
          {activeTab === 'project' ? (
            <div className="space-y-8">
              <div className="flex flex-col gap-6">
                {projects.map(project => (
                  <Card key={project.id} draggable onDragStart={(e) => handleDragStartProject(e, project.id)} onDragOver={handleDragOver} onDrop={(e) => handleDropProject(e, project.id)} className={`p-6 rounded-xl border shadow-xl cursor-grab active:cursor-grabbing transition-all ${isDarkMode ? 'bg-black/40 border-white/10' : 'bg-white border-black/5'} ${draggedProjectId === project.id ? 'opacity-20' : ''}`}>
                    <div className="flex flex-col lg:flex-row items-start lg:items-center gap-8">
                      <div className="w-full lg:w-64 flex-shrink-0 flex items-center justify-between lg:justify-start gap-4 border-b lg:border-b-0 lg:border-r border-black/5 dark:border-white/5 pb-4 lg:pb-0 lg:pr-8">
                        <div className="flex items-center gap-4"><div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center border border-emerald-500/20"><ShieldCheck className="w-6 h-6" /></div><div><h2 className="text-xl font-black tracking-tighter uppercase leading-none">KP: {project.name}</h2><p className="text-[8px] font-black uppercase tracking-widest opacity-30 mt-1">Squad • {project.member_ids.length} Membros</p></div></div>
                        <div className="flex items-center gap-2" onDragOver={(e) => e.stopPropagation()} onDrop={(e) => e.stopPropagation()}><button onClick={(e) => { e.stopPropagation(); setEditingProject(project); setIsProjectModalOpen(true); }} className="p-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 opacity-30 hover:opacity-100 transition-all"><Edit2 className="w-4 h-4" /></button><Button onClick={() => handleDeleteProject(project.id)} variant="ghost" className="text-red-500 hover:bg-red-500/10 rounded-xl p-2 h-auto opacity-30 hover:opacity-100"><Trash2 className="w-4 h-4" /></Button></div>
                      </div>
                      <div className="flex-grow overflow-x-auto custom-scrollbar pb-2" onDragOver={(e) => e.stopPropagation()} onDrop={(e) => e.stopPropagation()}>
                        <div className="flex gap-6 min-w-max px-2">
                          {areas.filter(a => (activeAreasByProject[project.id] || []).includes(a.id)).map(area => (
                            <div key={area.id} onDragOver={handleDragOver} onDrop={(e) => handleDrop(e, project.id, false, true)} className="space-y-3 w-64 flex-shrink-0">
                              <div className="flex items-center justify-between px-2"><h4 className="text-[10px] font-black uppercase tracking-widest opacity-30 truncate">{area.name}</h4><button onClick={(e) => { e.stopPropagation(); toggleAreaInProject(project.id, area.id); }} className="p-1 rounded-md hover:bg-red-500/10 text-red-500 opacity-20 hover:opacity-100 transition-all" title="Remover Coluna"><X className="w-3 h-3" /></button></div>
                              <div className="space-y-2">
                                {project.member_ids.filter(id => members.find(m => m.id === id)?.area_id === area.id).map(mid => { const m = members.find(mem => mem.id === mid); if (!m) return null; return (
                                  <div key={mid} draggable onDragStart={(e) => handleDragStart(e, mid)} onDragOver={handleDragOver} onDrop={async (e) => { e.stopPropagation(); fetchData(); }} className="p-6 rounded-xl border bg-emerald-500/5 border-emerald-500/20 shadow-lg shadow-emerald-500/5 flex flex-col gap-3 relative group/member transition-all hover:bg-emerald-500/10 cursor-grab active:cursor-grabbing min-w-[200px]">
                                    <div className="flex items-center gap-4"><div className={`w-3 h-3 rounded-lg ${getStatusDot(m.status)} shadow-[0_0_10px] shadow-current`} /><select value={mid} onChange={(e) => { const val = e.target.value; if (val === 'remove') handleUpdateProjectMember(project.id, 0, mid); else handleUpdateProjectMember(project.id, parseInt(val), mid); }} className="bg-transparent outline-none text-sm font-black cursor-pointer pr-4 appearance-none flex-grow"><option value={mid}>{m.name}</option>{members.filter(mem => { const area = areas.find(a => a.id === mem.area_id); return area?.section === 'uit' && mem.area_id === area.id && !project.member_ids.includes(mem.id); }).map(mem => <option key={mem.id} value={mem.id}>{mem.name}</option>)}<option value="remove" className="text-red-500 font-black">--- Remover ---</option></select></div>
                                    <p className="text-[11px] font-black uppercase opacity-40 truncate ml-7">{m.role || 'Especialista'}</p><div className="absolute right-4 top-5 w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-t-[5px] border-t-emerald-500 pointer-events-none opacity-40" />
                                  </div>
                                );})}
                                <div className="p-2 rounded-lg border border-dashed border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 flex flex-col justify-center min-h-[56px] transition-all hover:bg-black/10 dark:hover:bg-white/10 relative">
                                  <div className="relative">
                                    <Input
                                      value={projectAllocationSearch[`${project.id}_${area.id}`] || ''}
                                      onChange={e => setProjectAllocationSearch({ ...projectAllocationSearch, [`${project.id}_${area.id}`]: e.target.value })}
                                      onFocus={() => setActiveAllocationDropdown(`${project.id}_${area.id}`)}
                                      onBlur={() => setTimeout(() => setActiveAllocationDropdown(null), 200)}
                                      placeholder={`+ Alocar ${area.name}`}
                                      className={`h-8 text-[10px] font-black uppercase tracking-widest bg-transparent border-none text-center opacity-40 hover:opacity-100 transition-all focus-visible:ring-0 px-6`}
                                    />
                                    <Search className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 opacity-30" />
                                  </div>
                                  {activeAllocationDropdown === `${project.id}_${area.id}` && (
                                    <Card className={`absolute bottom-full mb-1 left-0 right-0 z-50 max-h-40 overflow-y-auto custom-scrollbar border shadow-2xl ${isDarkMode ? 'bg-[#0f0f0f] border-white/10' : 'bg-white border-black/10'}`}>
                                      {members
                                        .filter(m => { const memArea = areas.find(a => a.id === m.area_id); return memArea?.section === 'uit' && m.area_id === area.id && !project.member_ids.includes(m.id); })
                                        .filter(m => m.name.toLowerCase().includes((projectAllocationSearch[`${project.id}_${area.id}`] || '').toLowerCase()))
                                        .map(m => (
                                          <div 
                                            key={m.id} 
                                            onClick={() => {
                                              handleUpdateProjectMember(project.id, m.id);
                                              setProjectAllocationSearch({ ...projectAllocationSearch, [`${project.id}_${area.id}`]: '' });
                                            }}
                                            className={`p-2 text-[10px] font-bold cursor-pointer transition-colors text-left ${isDarkMode ? 'hover:bg-white/5' : 'hover:bg-black/5'}`}
                                          >
                                            {m.name}
                                          </div>
                                        ))}
                                      {members.filter(m => { const memArea = areas.find(a => a.id === m.area_id); return memArea?.section === 'uit' && m.area_id === area.id && !project.member_ids.includes(m.id); }).length === 0 && (
                                        <div className="p-2 text-[10px] opacity-40 italic text-center">Vazio</div>
                                      )}
                                    </Card>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))}
                          <div className="flex flex-col gap-3 w-48 flex-shrink-0 pt-10"><select value="" onChange={(e) => toggleAreaInProject(project.id, parseInt(e.target.value))} className={`w-full bg-emerald-500/5 hover:bg-emerald-500/10 text-emerald-600 outline-none px-6 py-6 text-[12px] font-black uppercase tracking-widest cursor-pointer border border-dashed border-emerald-500/20 rounded-xl transition-all shadow-sm`}><option value="">+ Área Técnica</option>{areas.filter(a => a.section === 'uit' && !(activeAreasByProject[project.id] || []).includes(a.id)).map(area => <option key={area.id} value={area.id}>{area.name}</option>)}</select></div>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
                {projects.length === 0 && <div className="flex flex-col items-center justify-center py-40 space-y-6 opacity-20"><Briefcase className="w-20 h-20" /><p className="text-xl font-black uppercase tracking-[0.3em]">Nenhum Projeto</p><Button onClick={() => { setEditingProject({}); setIsProjectModalOpen(true); }} variant="outline" className="rounded-lg border-current px-10">Criar Primeiro Projeto</Button></div>}
              </div>
            </div>
          ) : (
            <>
              <div className="space-y-8">
                <div className="flex flex-col md:flex-row items-center justify-center gap-10">
                  <div className="flex flex-col items-center gap-2"><h2 className="text-[10px] font-black uppercase tracking-[0.4em] opacity-30 text-center">UIT</h2><p className="text-[8px] font-black uppercase tracking-widest opacity-20">Pool de alocação para squads de projeto</p></div>
                  <Card className={`px-8 py-4 rounded-xl border shadow-xl flex items-center gap-6 ${isDarkMode ? 'bg-blue-500/5 border-blue-500/10' : 'bg-white border-black/5'}`}>
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center border transition-all ${uitAnalytics.isPerfectFit ? 'bg-blue-500/10 border-blue-500/20 text-blue-500' : 'bg-red-500/10 border-red-500/20 text-red-500 shadow-[0_0_15px_rgba(239,68,68,0.2)]'}`}><Users className="w-6 h-6" /></div>
                    <div><div className="flex items-center gap-2"><span className="text-2xl font-black tracking-tighter leading-none">{uitAnalytics.potentialSquads}</span><span className="text-[10px] font-black uppercase tracking-widest opacity-40">Squads Potenciais</span></div><div className="flex items-center gap-1.5 mt-1"><div className={`w-1.5 h-1.5 rounded-lg ${uitAnalytics.isPerfectFit ? 'bg-blue-500 animate-pulse' : 'bg-red-500'}`} /><span className={`text-[9px] font-black uppercase tracking-widest ${uitAnalytics.isPerfectFit ? 'text-blue-500' : 'text-red-500'}`}>{uitAnalytics.isPerfectFit ? 'Capacidade Balanceada' : `${uitAnalytics.totalMembers} Membros (${uitAnalytics.remainder} sobra)`}</span></div></div>
                    <div className="pl-6 border-l border-black/5 dark:border-white/5"><p className="text-[8px] font-black uppercase tracking-widest opacity-30 mb-0.5 text-center">Referência</p><p className="text-[10px] font-black opacity-50 text-center">5 Membros / Squad</p></div>
                  </Card>
                </div>
                {areasBySection.uit.length > 0 && <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6">{areasBySection.uit.map(renderArea)}</div>}
              </div>
              {areasBySection.top.length > 0 && <div className="space-y-6"><h2 className="text-[10px] font-black uppercase tracking-[0.4em] opacity-30 text-center">Especialidades</h2><div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">{areasBySection.top.map(renderArea)}</div></div>}
              <div className="space-y-6"><h2 className="text-[10px] font-black uppercase tracking-[0.4em] opacity-30 text-center">OUTROS</h2><div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6">{areasBySection.middle.map(renderArea)}</div></div>
              {areasBySection.bottom.length > 0 && <div className="space-y-6"><h2 className="text-[10px] font-black uppercase tracking-[0.4em] opacity-30 text-center">Suporte & Iniciativas Especiais</h2><div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">{areasBySection.bottom.map(renderArea)}</div></div>}
              {areas.length === 0 && !isLoading && <div className="flex flex-col items-center justify-center py-40 space-y-6 opacity-20"><LayoutGrid className="w-20 h-20" /><p className="text-xl font-black uppercase tracking-[0.3em]">Quadro Vazio</p><Button onClick={() => { setEditingArea({ section: 'middle' }); setIsAreaModalOpen(true); }} variant="outline" className="rounded-lg border-current px-10">Criar Primeira Área</Button></div>}
              {isLoading && <div className="flex flex-col items-center justify-center py-40 space-y-4"><Zap className="w-12 h-12 text-blue-500 animate-pulse" /><p className="text-xs font-black uppercase tracking-widest animate-pulse">Sincronizando Quadro...</p></div>}
            </>
          )}
        </div>
      </div>

      {isAreaModalOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={() => setIsAreaModalOpen(false)} />
          <Card className={`relative w-full max-w-md p-8 border-none shadow-2xl animate-in zoom-in-95 duration-200 ${isDarkMode ? 'bg-[#0a0a0a] text-white' : 'bg-white'}`}>
            <h2 className="text-2xl font-black tracking-tighter mb-6">{editingArea?.id ? 'Editar Área' : 'Nova Área'}</h2>
            <form onSubmit={handleSaveArea} className="space-y-6">
              <div className="space-y-2"><label className="text-[10px] font-black uppercase opacity-40">Nome da Área</label><Input value={editingArea?.name || ''} onChange={e => setEditingArea({ ...editingArea, name: e.target.value })} className={`h-12 font-bold ${isDarkMode ? 'bg-white/5 border-white/10' : ''}`} placeholder="Ex: Apps1, Multimedia..." /></div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2"><label className="text-[10px] font-black uppercase opacity-40">Seção</label><select value={editingArea?.section || 'middle'} onChange={e => setEditingArea({ ...editingArea, section: e.target.value as any })} className={`w-full h-12 rounded-xl border px-4 text-xs font-bold outline-none ${isDarkMode ? 'bg-white/5 border-white/10' : 'bg-white border-black/10'}`}><option value="uit">UIT (Alocação)</option><option value="top">Topo</option><option value="middle">Meio</option><option value="bottom">Inferior</option></select></div>
                <div className="space-y-2"><label className="text-[10px] font-black uppercase opacity-40">Posição</label><Input type="number" value={editingArea?.position || 0} onChange={e => setEditingArea({ ...editingArea, position: parseInt(e.target.value) })} className={`h-12 font-bold ${isDarkMode ? 'bg-white/5 border-white/10' : ''}`} /></div>
              </div>
              <div className="flex gap-3 pt-4"><Button type="button" variant="ghost" onClick={() => setIsAreaModalOpen(false)} className="flex-1 h-12 rounded-xl font-black text-[10px] uppercase">Cancelar</Button><Button type="submit" className="flex-[2] h-12 rounded-xl font-black text-[10px] uppercase bg-blue-600 hover:bg-blue-700 shadow-xl shadow-blue-600/20">Salvar Área</Button></div>
            </form>
          </Card>
        </div>
      )}

      {isMemberModalOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={() => setIsMemberModalOpen(false)} />
          <Card className={`relative w-full max-w-lg p-8 border-none shadow-2xl animate-in zoom-in-95 duration-200 ${isDarkMode ? 'bg-[#0a0a0a] text-white' : 'bg-white'}`}>
            <h2 className="text-2xl font-black tracking-tighter mb-6">{editingMember?.id ? 'Editar Membro' : 'Novo Membro'}</h2>
            <form onSubmit={handleSaveMember} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2 relative">
                  <label className="text-[10px] font-black uppercase opacity-40">Usuário ou Nome</label>
                  <div className="relative">
                    <Input 
                      value={editingMember?.name || ''} 
                      onChange={e => {
                        const val = e.target.value;
                        const formatted = formatName(val);
                        const isIntern = checkIsIntern(val);
                        setEditingMember({ 
                          ...editingMember, 
                          name: formatted,
                          status: isIntern ? 'intern' : (editingMember?.status === 'intern' ? 'normal' : editingMember?.status)
                        });
                        setUserSearchQuery(val);
                        setIsUserDropdownOpen(true);
                      }}
                      onFocus={() => setIsUserDropdownOpen(true)}
                      onBlur={() => setTimeout(() => setIsUserDropdownOpen(false), 200)}
                      className={`h-12 font-bold pr-10 ${isDarkMode ? 'bg-white/5 border-white/10' : ''}`} 
                      placeholder="Digite o nome..." 
                    />
                    <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 opacity-20" />
                  </div>
                  
                  {isUserDropdownOpen && userSearchQuery.length > 0 && (
                    <Card className={`absolute top-full left-0 right-0 z-[300] mt-1 max-h-48 overflow-y-auto custom-scrollbar border shadow-2xl ${isDarkMode ? 'bg-[#0f0f0f] border-white/10' : 'bg-white border-black/10'}`}>
                      {allUsers
                        .filter(u => u.name.toLowerCase().includes(userSearchQuery.toLowerCase()))
                        .map(user => (
                          <div 
                            key={user.id} 
                            onClick={() => {
                              const formatted = formatName(user.name);
                              const isIntern = checkIsIntern(user.name);
                              setEditingMember({ 
                                ...editingMember, 
                                user_id: parseInt(user.id), 
                                name: formatted, 
                                role: user.role,
                                status: isIntern ? 'intern' : (editingMember?.status === 'intern' ? 'normal' : editingMember?.status)
                              });
                              setIsUserDropdownOpen(false);
                              setUserSearchQuery('');
                            }}
                            className={`p-3 text-sm font-bold cursor-pointer transition-colors flex items-center gap-3 ${isDarkMode ? 'hover:bg-white/5' : 'hover:bg-black/5'}`}
                          >
                            <div className="w-6 h-6 rounded-full bg-blue-500/10 flex items-center justify-center text-[10px] text-blue-500">
                              {user.name.charAt(0)}
                            </div>
                            <div>
                              <p className="leading-none">{user.name}</p>
                              <p className="text-[9px] opacity-40 mt-1 uppercase font-black">{user.role || 'Membro'}</p>
                            </div>
                          </div>
                        ))}
                    </Card>
                  )}
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase opacity-40">Status</label>
                  <select 
                    value={editingMember?.status || 'normal'} 
                    disabled={checkIsIntern(editingMember?.name || '')}
                    onChange={e => setEditingMember({ ...editingMember, status: e.target.value as any })} 
                    className={`w-full h-12 rounded-xl border px-4 text-xs font-bold outline-none ${isDarkMode ? 'bg-white/5 border-white/10' : 'bg-white border-black/10'} ${checkIsIntern(editingMember?.name || '') ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    <option value="normal">Normal</option>
                    <option value="intern">Estagiário (Verde)</option>
                    <option value="movement">Movimentação (Amarelo)</option>
                    <option value="training">Treinamento (Roxo)</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2"><label className="text-[10px] font-black uppercase opacity-40">Área</label><select value={editingMember?.area_id || ''} onChange={e => setEditingMember({ ...editingMember, area_id: parseInt(e.target.value) })} className={`w-full h-12 rounded-xl border px-4 text-xs font-bold outline-none ${isDarkMode ? 'bg-white/5 border-white/10' : 'bg-white border-black/10'}`}><option value="">Selecionar Área...</option>{areas.map(a => <option key={a.id} value={a.id}>{a.name} ({a.section})</option>)}</select></div>
                <div className="space-y-2"><label className="text-[10px] font-black uppercase opacity-40">Destaque (Borda Verde)</label><select value={editingMember?.is_highlighted || 0} onChange={e => setEditingMember({ ...editingMember, is_highlighted: parseInt(e.target.value) })} className={`w-full h-12 rounded-xl border px-4 text-xs font-bold outline-none ${isDarkMode ? 'bg-white/5 border-white/10' : 'bg-white border-black/10'}`}><option value={0}>Não</option><option value={1}>Sim</option></select></div>
              </div>
              <div className="space-y-2"><label className="text-[10px] font-black uppercase opacity-40">Período / Datas (Ex: Férias)</label><Input value={editingMember?.date_range || ''} onChange={e => setEditingMember({ ...editingMember, date_range: e.target.value })} className={`h-12 font-bold ${isDarkMode ? 'bg-white/5 border-white/10' : ''}`} placeholder="Ex: 04/05 a 21/05" /></div>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2"><label className="text-[10px] font-black uppercase opacity-40">Prefixo</label><Input value={editingMember?.prefix || ''} onChange={e => { const prefix = e.target.value; const isKP = prefix.toUpperCase() === 'KP'; setEditingMember({ ...editingMember, prefix: prefix, is_highlighted: isKP ? 1 : editingMember?.is_highlighted }); }} className={`h-12 font-bold ${isDarkMode ? 'bg-white/5 border-white/10' : ''}`} placeholder="Ex: KP, MW" /></div>
                <div className="col-span-2 space-y-2"><label className="text-[10px] font-black uppercase opacity-40">Identificador / Email</label><Input value={editingMember?.identifier || ''} onChange={e => setEditingMember({ ...editingMember, identifier: e.target.value })} className={`h-12 font-bold ${isDarkMode ? 'bg-white/5 border-white/10' : ''}`} /></div>
              </div>
              <div className="space-y-2"><label className="text-[10px] font-black uppercase opacity-40">Superior (Hierarquia)</label><select value={editingMember?.parent_id || ''} onChange={e => setEditingMember({ ...editingMember, parent_id: e.target.value ? parseInt(e.target.value) : null })} className={`w-full h-12 rounded-xl border px-4 text-xs font-bold outline-none ${isDarkMode ? 'bg-white/5 border-white/10' : 'bg-white border-black/10'}`}><option value="">Nenhum (Raiz)</option>{members.filter(m => m.id !== editingMember?.id).map(m => <option key={m.id} value={m.id}>{m.name}</option>)}</select></div>
              <div className="flex gap-3 pt-4"><Button type="button" variant="ghost" onClick={() => setIsMemberModalOpen(false)} className="flex-1 h-12 rounded-xl font-black text-[10px] uppercase">Cancelar</Button><Button type="submit" className="flex-[2] h-12 rounded-xl font-black text-[10px] uppercase bg-blue-600 hover:bg-blue-700 shadow-xl shadow-blue-600/20">Salvar Membro</Button></div>
            </form>
          </Card>
        </div>
      )}

      {isDetailModalOpen && selectedArea && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-xl" onClick={() => setIsDetailModalOpen(false)} />
          <Card className={`relative w-full max-w-4xl h-[80vh] flex flex-col border-none shadow-2xl animate-in zoom-in-95 duration-200 overflow-hidden ${isDarkMode ? 'bg-[#0a0a0a] text-white' : 'bg-white'}`}>
            <div className="p-8 border-b flex justify-between items-center"><div className="flex items-center gap-4"><div className="w-12 h-12 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center border border-blue-500/20"><Users className="w-6 h-6" /></div><div><h2 className="text-3xl font-black tracking-tighter uppercase">{selectedArea.name}</h2><p className="text-[10px] font-black uppercase tracking-widest opacity-40">{selectedArea.section} • {members.filter(m => m.area_id === selectedArea.id).length} Membros</p></div></div><button onClick={() => setIsDetailModalOpen(false)} className="p-3 rounded-xl hover:bg-black/5 opacity-40 hover:opacity-100 transition-all"><X className="w-6 h-6" /></button></div>
            <div className="flex-grow p-8 overflow-y-auto custom-scrollbar"><div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">{members.filter(m => m.area_id === selectedArea.id && !m.parent_id).map(m => <div key={m.id} className="space-y-4">{renderMemberRow(m)}</div>)}</div>{members.filter(m => m.area_id === selectedArea.id).length === 0 && <div className="h-full flex flex-col items-center justify-center opacity-20 space-y-4"><Users className="w-20 h-20" /><p className="text-xl font-black uppercase tracking-[0.3em]">Nenhum Membro</p></div>}</div>
            <div className="p-6 border-t bg-black/5 dark:bg-white/5 flex justify-end gap-3"><Button onClick={() => { setEditingMember({ area_id: selectedArea.id, status: 'normal' }); setIsMemberModalOpen(true); }} className="rounded-xl font-black text-[10px] uppercase bg-blue-600 hover:bg-blue-700">Adicionar Membro</Button><Button variant="ghost" onClick={() => setIsDetailModalOpen(false)} className="rounded-xl font-black text-[10px] uppercase">Fechar</Button></div>
          </Card>
        </div>
      )}

      {isProjectModalOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={() => setIsProjectModalOpen(false)} />
          <Card className={`relative w-full max-w-md p-8 border-none shadow-2xl animate-in zoom-in-95 duration-200 ${isDarkMode ? 'bg-[#0a0a0a] text-white' : 'bg-white'}`}>
            <h2 className="text-2xl font-black tracking-tighter mb-6">Novo Squad (KP de Projeto)</h2>
            <form onSubmit={handleSaveProject} className="space-y-6">
              <div className="space-y-2"><label className="text-[10px] font-black uppercase opacity-40">Nome do KP Responsável</label><Input value={editingProject?.name || ''} onChange={e => setEditingProject({ ...editingProject, name: formatName(e.target.value) })} className={`h-12 font-bold ${isDarkMode ? 'bg-white/5 border-white/10' : ''}`} placeholder="Ex: Felipe, Afonso, Abdo..." /></div>
              <div className="flex gap-3 pt-4"><Button type="button" variant="ghost" onClick={() => setIsProjectModalOpen(false)} className="flex-1 h-12 rounded-xl font-black text-[10px] uppercase">Cancelar</Button><Button type="submit" className="flex-[2] h-12 rounded-xl font-black text-[10px] uppercase bg-emerald-600 hover:bg-emerald-700 shadow-xl shadow-emerald-600/20">Criar Squad</Button></div>
            </form>
          </Card>
        </div>
      )}

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(155, 155, 155, 0.2); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(155, 155, 155, 0.4); }
      `}</style>
    </div>
  );
}