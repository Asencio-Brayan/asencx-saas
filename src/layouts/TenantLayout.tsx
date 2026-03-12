
import { NavLink, useNavigate, Routes, Route, Navigate } from 'react-router-dom';
import { LayoutDashboard, LogOut, Menu, User } from 'lucide-react';
import { useState } from 'react';

export function TenantLayout() {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    const navItems = [
        { icon: LayoutDashboard, label: 'Dashboard', path: '/app' },
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
                </div>

                <nav className="flex-1 p-4 space-y-2">
                    {navItems.map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            end={item.path === '/app'}
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
                        <div className="flex items-center gap-3 px-3 py-1.5 bg-white/5 rounded-full border border-white/10">
                            <div className="w-8 h-8 bg-[#00D9FF]/20 rounded-full flex items-center justify-center text-sm font-bold text-[#00D9FF]">
                                <User className="w-4 h-4" />
                            </div>
                            <span className="text-sm font-medium pr-2">Cliente</span>
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 p-6">
                    <Routes>
                        <Route index element={<div className="text-gray-400">Bienvenido a tu Espacio de Cliente (En construcción)</div>} />
                        <Route path="*" element={<Navigate to="/app" replace />} />
                    </Routes>
                </main>
            </div>
        </div>
    );
}

