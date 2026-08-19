'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Navbar } from '@/components/navbar';
import { useTheme } from '@/components/theme-provider';
import { 
    Users, BarChart3, Edit2, Trash2, CheckCircle2, 
    X, Save, User as UserIcon, ShieldCheck, Mail, MapPin, Hash, Briefcase, FileText
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';

// --- AI Background (From other pages) ---
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
                <div className="relative w-full h-full">
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
        </div>
    );
};

export default function AdminPage() {
    const { isDarkMode } = useTheme();
    const [activeTab, setActiveTab] = useState<'users' | 'charts'>('users');
    const [mounted, setMounted] = useState(false);
    const [users, setUsers] = useState<any[]>([]);
    const [logs, setLogs] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    
    // Auth state (reuse metricas logic)
    const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);

    // Profile Modal
    const [selectedUser, setSelectedUser] = useState<any | null>(null);
    const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

    // Inline Editing
    const [editingUserId, setEditingUserId] = useState<number | null>(null);
    const [editForm, setEditForm] = useState<any>({});

    const API_URL = typeof window !== 'undefined'
        ? `${window.location.protocol}//${window.location.hostname}:8001`
        : '';

    useEffect(() => {
        setMounted(true);
        const storedUser = localStorage.getItem('user_srmt');
        if (storedUser) {
            try {
                const user = JSON.parse(storedUser);
                const name = (user.name || '').toLowerCase();
                const allowedNames = ['edgard', 'gilmar', 'wallid', 'ivan'];
                setIsAuthorized(allowedNames.some(allowed => name.includes(allowed)));
            } catch (e) {
                setIsAuthorized(false);
            }
        } else {
            setIsAuthorized(false);
        }
    }, []);

    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const [usersRes, logsRes] = await Promise.all([
                fetch(`${API_URL}/users`),
                fetch('/api/access-logs')
            ]);
            
            if (usersRes.ok) {
                const fetchedUsers = await usersRes.json();
                // GET /users returns 'area' instead of 'team', so we map it
                const mappedUsers = fetchedUsers.map((u: any) => ({
                    ...u,
                    team: u.team || u.area || '',
                }));
                setUsers(mappedUsers);
            }
            if (logsRes.ok) {
                setLogs(await logsRes.json());
            }
        } catch (error) {
            console.error("Erro ao carregar dados admin:", error);
        } finally {
            setLoading(false);
        }
    }, [API_URL]);

    useEffect(() => {
        if (isAuthorized) {
            fetchData();
        }
    }, [isAuthorized, fetchData]);

    // Fetch full user data from /users/{id} (includes sidia_id, is_specialist, etc.)
    const fetchFullUserData = async (userId: number | string) => {
        try {
            const res = await fetch(`${API_URL}/users/${userId}`);
            if (res.ok) {
                const fullData = await res.json();
                // Update the user in the users list with the full data
                setUsers(prev => prev.map(u => String(u.id) === String(userId) ? { ...u, ...fullData } : u));
                return fullData;
            }
        } catch (e) {
            console.error('Erro ao buscar dados completos do usuário:', e);
        }
        return null;
    };

    // Open profile modal with full data
    const handleOpenProfile = async (user: any) => {
        // Immediately show modal with what we have
        setSelectedUser(user);
        setIsProfileModalOpen(true);
        // Then fetch full data (which includes sidia_id, is_specialist, etc.)
        const fullData = await fetchFullUserData(user.id);
        if (fullData) {
            setSelectedUser({ ...user, ...fullData });
        }
    };

    // Handle Inline Edit Start
    const handleEditStart = (user: any) => {
        setEditingUserId(user.id);
        setEditForm({ ...user });
    };

    // Handle Inline Edit Save
    const handleEditSave = async () => {
        if (!editingUserId) return;
        try {
            const res = await fetch(`${API_URL}/users/${editingUserId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(editForm)
            });
            if (res.ok) {
                setUsers(prev => prev.map(u => u.id === editingUserId ? { ...u, ...editForm } : u));
                setEditingUserId(null);
                // Also update selectedUser if it's open
                if (selectedUser && selectedUser.id === editingUserId) {
                    setSelectedUser({ ...selectedUser, ...editForm });
                }
            } else {
                alert("Erro ao salvar.");
            }
        } catch (e) {
            alert("Erro de rede.");
        }
    };

    const handleProfileUpdate = async (field: string, value: any) => {
        if (!selectedUser) return;
        try {
            const res = await fetch(`${API_URL}/users/${selectedUser.id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ [field]: value })
            });
            if (res.ok) {
                const updatedUser = { ...selectedUser, [field]: value };
                setSelectedUser(updatedUser);
                setUsers(prev => prev.map(u => u.id === updatedUser.id ? updatedUser : u));
            }
        } catch (e) {
            console.error(e);
        }
    };

    // --- RENDER TAB 1: USERS TABLE ---
    const renderUsersTable = () => {
        return (
            <Card className={`p-6 rounded-[2rem] border shadow-2xl backdrop-blur-xl animate-in slide-in-from-bottom-4 duration-500 ${isDarkMode ? 'bg-[#111]/80 border-white/10 shadow-black/50' : 'bg-white/90 border-gray-200 shadow-gray-200/50'}`}>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className={`text-xs uppercase font-bold tracking-wider ${isDarkMode ? 'bg-white/5 text-gray-400' : 'bg-gray-100 text-gray-600'}`}>
                            <tr>
                                <th className="px-4 py-3 rounded-tl-lg">ID</th>
                                <th className="px-4 py-3">Nome</th>
                                <th className="px-4 py-3">E-mail</th>
                                <th className="px-4 py-3">Cargo</th>
                                <th className="px-4 py-3">Equipe</th>
                                <th className="px-4 py-3">Célula</th>
                                <th className="px-4 py-3">Matrícula SIDIA</th>
                                <th className="px-4 py-3 rounded-tr-lg text-right">Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map(u => {
                                const isEditing = editingUserId === u.id;
                                return (
                                    <tr key={u.id} className={`border-b last:border-0 ${isDarkMode ? 'border-white/5 hover:bg-white/5' : 'border-gray-100 hover:bg-gray-50'}`}>
                                        <td className="px-4 py-3 font-medium">#{u.id}</td>
                                        
                                        {/* Name - Click to view profile */}
                                        <td className="px-4 py-3">
                                            {isEditing ? (
                                                <Input value={editForm.name || ''} onChange={e => setEditForm({...editForm, name: e.target.value})} className="h-8 text-xs" />
                                            ) : (
                                                <span 
                                                    onClick={() => handleOpenProfile(u)}
                                                    className="font-bold text-blue-500 cursor-pointer hover:underline flex items-center gap-2"
                                                >
                                                    {u.avatar ? <img src={u.avatar} className="w-6 h-6 rounded-full" /> : <div className="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-500">{u.name?.charAt(0)}</div>}
                                                    {u.name}
                                                </span>
                                            )}
                                        </td>

                                        <td className="px-4 py-3">
                                            {isEditing ? (
                                                <Input value={editForm.email || ''} onChange={e => setEditForm({...editForm, email: e.target.value})} className="h-8 text-xs" />
                                            ) : u.email}
                                        </td>
                                        <td className="px-4 py-3">
                                            {isEditing ? (
                                                <Input value={editForm.role || ''} onChange={e => setEditForm({...editForm, role: e.target.value})} className="h-8 text-xs" />
                                            ) : u.role}
                                        </td>
                                        <td className="px-4 py-3">
                                            {isEditing ? (
                                                <Input value={editForm.team || ''} onChange={e => setEditForm({...editForm, team: e.target.value})} className="h-8 text-xs" />
                                            ) : u.team}
                                        </td>
                                        <td className="px-4 py-3">
                                            {isEditing ? (
                                                <Input value={editForm.cell || ''} onChange={e => setEditForm({...editForm, cell: e.target.value})} className="h-8 text-xs" />
                                            ) : u.cell}
                                        </td>
                                        <td className="px-4 py-3">
                                            {isEditing ? (
                                                <Input value={editForm.sidia_id || ''} onChange={e => setEditForm({...editForm, sidia_id: e.target.value})} className="h-8 text-xs" />
                                            ) : u.sidia_id}
                                        </td>

                                        <td className="px-4 py-3 text-right whitespace-nowrap">
                                            {isEditing ? (
                                                <div className="flex items-center justify-end gap-2">
                                                    <button onClick={handleEditSave} className="p-1.5 text-green-500 hover:bg-green-500/10 rounded-lg"><Save className="w-4 h-4" /></button>
                                                    <button onClick={() => setEditingUserId(null)} className="p-1.5 text-red-500 hover:bg-red-500/10 rounded-lg"><X className="w-4 h-4" /></button>
                                                </div>
                                            ) : (
                                                <button onClick={() => handleEditStart(u)} className="p-1.5 text-blue-500 hover:bg-blue-500/10 rounded-lg">
                                                    <Edit2 className="w-4 h-4" />
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </Card>
        );
    };

    // --- RENDER TAB 2: CHARTS ---
    const renderCharts = () => {
        // Prepare mock logic if no logs
        const mockLogs = [
            { date: '2023-10-01', logins: 12, pages: 150 },
            { date: '2023-10-02', logins: 15, pages: 200 },
            { date: '2023-10-03', logins: 8, pages: 110 },
            { date: '2023-10-04', logins: 22, pages: 300 },
            { date: '2023-10-05', logins: 30, pages: 450 },
        ];

        // Se houver dados da API access-logs, nós os processaremos
        // Por simplificação (pois ainda não enchemos o banco), usamos mocks
        const dataToRender = logs.length > 0 ? logs : mockLogs; // Substitua por agrupamento real de datas depois
        
        return (
            <div className="space-y-6">
                <Card className={`p-8 rounded-[2rem] border backdrop-blur-xl shadow-xl ${isDarkMode ? 'bg-[#111]/80 border-white/10' : 'bg-white/90 border-gray-200'}`}>
                    <h3 className="text-xl font-bold mb-6">Gráfico de Acessos (Logins)</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={mockLogs}>
                            <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'} />
                            <XAxis dataKey="date" stroke={isDarkMode ? '#888' : '#666'} />
                            <YAxis stroke={isDarkMode ? '#888' : '#666'} />
                            <Tooltip contentStyle={{ backgroundColor: isDarkMode ? '#222' : '#fff', border: 'none', borderRadius: '8px' }} />
                            <Legend />
                            <Line type="monotone" dataKey="logins" stroke="#3b82f6" strokeWidth={3} dot={{ r: 5 }} />
                        </LineChart>
                    </ResponsiveContainer>
                </Card>

                <Card className={`p-8 rounded-[2rem] border backdrop-blur-xl shadow-xl ${isDarkMode ? 'bg-[#111]/80 border-white/10' : 'bg-white/90 border-gray-200'}`}>
                    <h3 className="text-xl font-bold mb-6">Páginas Mais Acessadas</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={mockLogs}>
                            <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'} />
                            <XAxis dataKey="date" stroke={isDarkMode ? '#888' : '#666'} />
                            <YAxis stroke={isDarkMode ? '#888' : '#666'} />
                            <Tooltip contentStyle={{ backgroundColor: isDarkMode ? '#222' : '#fff', border: 'none', borderRadius: '8px' }} />
                            <Legend />
                            <Bar dataKey="pages" fill="#a855f7" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </Card>
            </div>
        );
    };

    if (!mounted) return null;

    if (isAuthorized === null || loading) {
        return (
            <div className={`min-h-screen flex items-center justify-center ${isDarkMode ? "bg-[#050505]" : "bg-[#f5f5f7]"}`}>
                <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    if (!isAuthorized) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#020204] text-white">
                <AIBackground isDarkMode={true} />
                <div className="relative z-10 text-center p-8 bg-black/40 backdrop-blur-2xl rounded-[2rem] border border-red-500/20 shadow-2xl shadow-red-500/20 max-w-md">
                    <ShieldCheck className="w-16 h-16 text-red-500 mx-auto mb-4" />
                    <h1 className="text-3xl font-black mb-2">Acesso Negado</h1>
                    <p className="text-gray-400 mb-6">Apenas administradores podem acessar esta página.</p>
                    <Button variant="outline" onClick={() => window.location.href = '/perfil'} className="w-full bg-white/5 border-white/10 hover:bg-white/10 text-white">Voltar ao Perfil</Button>
                </div>
            </div>
        );
    }

    return (
        <div className={`min-h-screen transition-colors duration-1000 ${isDarkMode ? "bg-[#050505] text-gray-200" : "bg-[#f5f5f7] text-gray-800"}`}>
            <AIBackground isDarkMode={isDarkMode} />
            <Navbar />

            <div className="relative z-10 max-w-7xl mx-auto px-4 pt-32 pb-12">
                <div className="text-center mb-12 animate-in slide-in-from-bottom-4 duration-700">
                    <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-lg border mb-4 shadow-lg ${isDarkMode ? 'bg-white/5 border-white/10 text-purple-400' : 'bg-purple-50 border-purple-100 text-purple-600'}`}>
                        <ShieldCheck className="w-4 h-4 animate-pulse" />
                        <span className="text-[10px] font-bold uppercase tracking-widest">Painel Administrativo</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-4">
                        Centro de <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-blue-500">Comando</span>
                    </h1>
                </div>

                <div className="flex justify-center mb-8">
                    <div className={`inline-flex rounded-2xl p-1.5 border shadow-lg ${isDarkMode ? 'bg-white/5 border-white/10' : 'bg-white border-gray-200'}`}>
                        <button
                            onClick={() => setActiveTab('users')}
                            className={`flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold transition-all duration-300 ${activeTab === 'users'
                                ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg shadow-purple-500/25'
                                : isDarkMode ? 'text-gray-400 hover:text-white hover:bg-white/5' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
                            }`}
                        >
                            <Users className="w-4 h-4" /> Gerenciar Usuários
                        </button>
                        <button
                            onClick={() => setActiveTab('charts')}
                            className={`flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold transition-all duration-300 ${activeTab === 'charts'
                                ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg shadow-purple-500/25'
                                : isDarkMode ? 'text-gray-400 hover:text-white hover:bg-white/5' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
                            }`}
                        >
                            <BarChart3 className="w-4 h-4" /> Métricas de Acesso
                        </button>
                    </div>
                </div>

                {activeTab === 'users' ? renderUsersTable() : renderCharts()}
            </div>

            {/* PROFILE MODAL (Admin Edit) - Exact same fields as PerfilPage */}
            {isProfileModalOpen && selectedUser && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in">
                    <Card className={`w-full max-w-4xl max-h-[90vh] overflow-y-auto p-8 rounded-[2rem] border shadow-2xl ${isDarkMode ? 'bg-[#111] border-white/10' : 'bg-white border-gray-200'}`}>
                        <div className="flex justify-between items-center mb-8 border-b pb-4 border-white/10">
                            <h2 className="text-2xl font-black flex items-center gap-3">
                                <UserIcon className="w-6 h-6 text-blue-500" /> Perfil: {selectedUser.name}
                            </h2>
                            <button onClick={() => setIsProfileModalOpen(false)} className={`p-2 rounded-xl transition-colors ${isDarkMode ? 'hover:bg-white/10 text-gray-400' : 'hover:bg-gray-100 text-gray-500'}`}>
                                <X className="w-6 h-6" />
                            </button>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Column 1: Informações do Sistema */}
                            <div className="space-y-4">
                                <div>
                                    <Label className="text-xs uppercase font-bold opacity-60 mb-1 block">Nome</Label>
                                    <Input value={selectedUser.name || ''} onChange={e => handleProfileUpdate('name', e.target.value)} className={isDarkMode ? "bg-black/50 border-white/10" : ""} />
                                </div>
                                <div>
                                    <Label className="text-xs uppercase font-bold opacity-60 mb-1 block">Cargo</Label>
                                    <select 
                                        value={selectedUser.role || ''} 
                                        onChange={e => handleProfileUpdate('role', e.target.value)}
                                        className={`w-full h-10 px-3 rounded-md border text-sm ${isDarkMode ? 'bg-black/50 border-white/10 text-white' : 'bg-white border-gray-300'}`}
                                    >
                                        <option value="">Selecionar...</option>
                                        <option value="Tester I">Tester I</option>
                                        <option value="Tester II">Tester II</option>
                                        <option value="Tester III">Tester III</option>
                                        <option value="Tester IV">Tester IV</option>
                                        <option value="Especialista I">Especialista I</option>
                                        <option value="Especialista II">Especialista II</option>
                                        <option value="Especialista III">Especialista III</option>
                                        <option value="Coordenador">Coordenador</option>
                                        <option value="Gerente Tec.">Gerente Tec.</option>
                                        <option value="Gerente Tec. Sr.">Gerente Tec. Sr.</option>
                                        <option value="LDAP">LDAP</option>
                                    </select>
                                </div>
                                <div>
                                    <Label className="text-xs uppercase font-bold opacity-60 mb-1 block">ID do Sistema</Label>
                                    <Input value={`#${selectedUser.id}`} disabled className={`opacity-60 ${isDarkMode ? "bg-black/50 border-white/10" : ""}`} />
                                </div>
                                <div>
                                    <Label className="text-xs uppercase font-bold opacity-60 mb-1 block">E-mail</Label>
                                    <Input value={selectedUser.email || ''} onChange={e => handleProfileUpdate('email', e.target.value)} className={isDarkMode ? "bg-black/50 border-white/10" : ""} />
                                </div>
                                <div>
                                    <Label className="text-xs uppercase font-bold opacity-60 mb-1 block">Matrícula SIDIA</Label>
                                    <Input value={selectedUser.sidia_id || ''} onChange={e => handleProfileUpdate('sidia_id', e.target.value)} className={isDarkMode ? "bg-black/50 border-white/10" : ""} />
                                </div>
                                <div>
                                    <Label className="text-xs uppercase font-bold opacity-60 mb-1 block">Célula</Label>
                                    <Input value={selectedUser.cell || ''} onChange={e => handleProfileUpdate('cell', e.target.value)} className={isDarkMode ? "bg-black/50 border-white/10" : ""} />
                                </div>
                            </div>
                            
                            {/* Column 2: Dados Complementares */}
                            <div className="space-y-4">
                                <div>
                                    <Label className="text-xs uppercase font-bold opacity-60 mb-1 block">Equipe</Label>
                                    <Input value={selectedUser.team || ''} onChange={e => handleProfileUpdate('team', e.target.value)} className={isDarkMode ? "bg-black/50 border-white/10" : ""} />
                                </div>
                                <div>
                                    <Label className="text-xs uppercase font-bold opacity-60 mb-1 block">KP</Label>
                                    <Input value={selectedUser.kp || ''} onChange={e => handleProfileUpdate('kp', e.target.value)} className={isDarkMode ? "bg-black/50 border-white/10" : ""} />
                                </div>
                                <div>
                                    <Label className="text-xs uppercase font-bold opacity-60 mb-1 block">KP Type</Label>
                                    <select 
                                        value={selectedUser.kp_type || ''} 
                                        onChange={e => handleProfileUpdate('kp_type', e.target.value)}
                                        className={`w-full h-10 px-3 rounded-md border text-sm ${isDarkMode ? 'bg-black/50 border-white/10 text-white' : 'bg-white border-gray-300'}`}
                                    >
                                        <option value="">Selecionar...</option>
                                        <option value="projeto">Projeto</option>
                                        <option value="especialista">Especialista</option>
                                    </select>
                                </div>
                                <div>
                                    <Label className="text-xs uppercase font-bold opacity-60 mb-1 block">É Backup?</Label>
                                    <select 
                                        value={selectedUser.is_backup ? "true" : "false"} 
                                        onChange={e => handleProfileUpdate('is_backup', e.target.value === 'true')}
                                        className={`w-full h-10 px-3 rounded-md border text-sm ${isDarkMode ? 'bg-black/50 border-white/10 text-white' : 'bg-white border-gray-300'}`}
                                    >
                                        <option value="true">Sim</option>
                                        <option value="false">Não</option>
                                    </select>
                                </div>
                                <div>
                                    <Label className="text-xs uppercase font-bold opacity-60 mb-1 block">É Especialista?</Label>
                                    <select 
                                        value={selectedUser.is_specialist ? "true" : "false"} 
                                        onChange={e => handleProfileUpdate('is_specialist', e.target.value === 'true')}
                                        className={`w-full h-10 px-3 rounded-md border text-sm ${isDarkMode ? 'bg-black/50 border-white/10 text-white' : 'bg-white border-gray-300'}`}
                                    >
                                        <option value="true">Sim</option>
                                        <option value="false">Não</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div className="mt-8 space-y-4">
                            <div>
                                <Label className="text-xs uppercase font-bold opacity-60 mb-1 block">Bio / Mini Currículo</Label>
                                <textarea 
                                    className={`w-full p-3 rounded-xl border text-sm min-h-[100px] ${isDarkMode ? 'bg-black/50 border-white/10' : 'bg-white border-gray-300'}`}
                                    value={selectedUser.bio || ''} 
                                    onChange={e => handleProfileUpdate('bio', e.target.value)}
                                />
                            </div>
                            <div>
                                <Label className="text-xs uppercase font-bold opacity-60 mb-1 block">Habilidades</Label>
                                <Input value={selectedUser.skills || ''} onChange={e => handleProfileUpdate('skills', e.target.value)} className={isDarkMode ? "bg-black/50 border-white/10" : ""} placeholder="Separadas por vírgula" />
                            </div>
                        </div>
                    </Card>
                </div>
            )}
        </div>
    );
}
