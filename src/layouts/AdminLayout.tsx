import { NavLink, useLocation, useNavigate, Routes, Route, Navigate } from 'react-router-dom';
import {
    LayoutDashboard, Users, ShoppingCart,
    Settings, LogOut, Menu, X, FileText, Bell, Check
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { Dashboard } from '../pages/admin/Dashboard';
import { Leads } from '../pages/admin/Leads';
import { Subscriptions } from '../pages/admin/Subscriptions';
import { Reports } from '../pages/admin/Reports';
import type { Settings as SettingsType } from 'lucide-react';
import { Settings as SettingsPage } from '../pages/admin/Settings';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";

interface Notification {
    id: string;
    title: string;
    message: string;
    readAt: string | null;
    createdAt: string;
    type: string;
}

export function AdminLayout() {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const location = useLocation();
    const navigate = useNavigate();

    // Notifications State
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [openNotifications, setOpenNotifications] = useState(false);

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    const fetchNotifications = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) return;

            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/notifications`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setNotifications(data.data);
                setUnreadCount(data.unreadCount);
            }
        } catch (error) {
            console.error("Failed to fetch notifications", error);
        }
    };

    const markAsRead = async (id: string) => {
        try {
            const token = localStorage.getItem('token');
            await fetch(`${import.meta.env.VITE_API_URL}/api/admin/notifications/${id}/read`, {
                method: 'PATCH',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            // Update local state
            setNotifications(prev => prev.map(n => n.id === id ? { ...n, readAt: new Date().toISOString() } : n));
            setUnreadCount(prev => Math.max(0, prev - 1));
        } catch (error) {
            console.error("Failed to mark as read", error);
        }
    };

    const markAllRead = async () => {
        try {
            const token = localStorage.getItem('token');
            await fetch(`${import.meta.env.VITE_API_URL}/api/admin/notifications/read-all`, {
                method: 'PATCH',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            setNotifications(prev => prev.map(n => ({ ...n, readAt: new Date().toISOString() })));
            setUnreadCount(0);
        } catch (error) {
            console.error("Failed to mark all as read", error);
        }
    };

    useEffect(() => {
        fetchNotifications();
        const interval = setInterval(fetchNotifications, 30000); // Poll every 30s
        return () => clearInterval(interval);
    }, []);

    const navItems = [
        { icon: LayoutDashboard, label: 'Dashboard', path: '/admin' },
        { icon: Users, label: 'Leads (CRM)', path: '/admin/leads' },
        { icon: ShoppingCart, label: 'Suscripciones', path: '/admin/subscriptions' },
        { icon: FileText, label: 'Reportes', path: '/admin/reports' },
        { icon: Settings, label: 'Configuración', path: '/admin/settings' },
    ];

    return (
        <div className="min-h-screen bg-[#0A0A0A] text-white flex">
            {/* Sidebar */}
            <aside
                className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-[#111111] border-r border-white/10 transition-all duration-300 flex flex-col fixed h-full z-20`}
            >
                <div className="p-4 border-b border-white/10 flex items-center justify-between">
                    <div className={`flex items-center gap-2 ${!sidebarOpen && 'justify-center w-full'}`}>
                        <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center text-black font-bold">A</div>
                        {sidebarOpen && <span className="font-bold text-lg">Asenc<span className="text-[#00D9FF]">X</span></span>}
                    </div>
                    {sidebarOpen && (
                        <button onClick={() => setSidebarOpen(false)} className="lg:hidden">
                            <X className="w-5 h-5" />
                        </button>
                    )}
                </div>

                <nav className="flex-1 p-4 space-y-2">
                    {navItems.map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            end={item.path === '/admin'}
                            className={({ isActive }) => `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${isActive
                                ? 'bg-[#00D9FF]/10 text-[#00D9FF]'
                                : 'text-gray-400 hover:bg-white/5 hover:text-white'
                                }`}
                        >
                            <item.icon className="w-5 h-5 flex-shrink-0" />
                            {sidebarOpen && <span>{item.label}</span>}
                        </NavLink>
                    ))}
                </nav>

                <div className="p-4 border-t border-white/10">
                    <button
                        onClick={handleLogout}
                        className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-red-400 hover:bg-red-500/10 w-full transition-colors ${!sidebarOpen && 'justify-center'}`}
                    >
                        <LogOut className="w-5 h-5 flex-shrink-0" />
                        {sidebarOpen && <span>Cerrar Sesión</span>}
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <div className={`flex-1 flex flex-col min-h-screen transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-20'}`}>
                {/* Topbar */}
                <header className="h-16 bg-[#111111]/80 backdrop-blur-md border-b border-white/10 sticky top-0 z-10 px-6 flex items-center justify-between">
                    <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 hover:bg-white/5 rounded-lg">
                        <Menu className="w-5 h-5" />
                    </button>

                    <div className="flex items-center gap-4">
                        <Popover open={openNotifications} onOpenChange={setOpenNotifications}>
                            <PopoverTrigger asChild>
                                <button className="relative p-2 hover:bg-white/5 rounded-lg">
                                    <Bell className="w-5 h-5 text-gray-400" />
                                    {unreadCount > 0 && (
                                        <span className="absolute top-2 right-2 w-2 h-2 bg-[#00D9FF] rounded-full" />
                                    )}
                                </button>
                            </PopoverTrigger>
                            <PopoverContent className="w-80 p-0 bg-[#1A1A1A] border-white/10 text-white" align="end">
                                <div className="p-4 border-b border-white/10 flex justify-between items-center">
                                    <h4 className="font-semibold text-sm">Notificaciones</h4>
                                    {unreadCount > 0 && (
                                        <Button variant="ghost" className="text-xs h-auto p-0 text-[#00D9FF] hover:text-[#00D9FF]/80" onClick={markAllRead}>
                                            Marcar todas leídas
                                        </Button>
                                    )}
                                </div>
                                <ScrollArea className="h-[300px]">
                                    {notifications.length === 0 ? (
                                        <div className="p-4 text-center text-sm text-gray-500">No hay notificaciones</div>
                                    ) : (
                                        <div className="flex flex-col">
                                            {notifications.map((notif) => (
                                                <button
                                                    key={notif.id}
                                                    onClick={() => !notif.readAt && markAsRead(notif.id)}
                                                    className={`p-4 text-left border-b border-white/5 hover:bg-white/5 transition-colors ${notif.readAt ? 'opacity-50' : 'bg-white/5'}`}
                                                >
                                                    <div className="flex justify-between items-start mb-1">
                                                        <span className="font-medium text-sm text-white">{notif.title}</span>
                                                        <span className="text-[10px] text-gray-400">{new Date(notif.createdAt).toLocaleDateString()}</span>
                                                    </div>
                                                    <p className="text-xs text-gray-400 line-clamp-2">{notif.message}</p>
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </ScrollArea>
                            </PopoverContent>
                        </Popover>

                        <div className="flex items-center gap-3 px-3 py-1.5 bg-white/5 rounded-full border border-white/10">
                            <div className="w-8 h-8 bg-gradient-to-br from-[#00D9FF] to-blue-600 rounded-full flex items-center justify-center text-sm font-bold">
                                AD
                            </div>
                            <span className="text-sm font-medium pr-2">Administrador</span>
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 p-6">
                    <Routes>
                        <Route index element={<Dashboard />} />
                        <Route path="leads" element={<Leads />} />
                        <Route path="subscriptions" element={<Subscriptions />} />
                        <Route path="reports" element={<Reports />} />
                        <Route path="settings" element={<SettingsPage />} />
                        <Route path="*" element={<Navigate to="/admin" replace />} />
                    </Routes>
                </main>
            </div>
        </div>
    );
}
