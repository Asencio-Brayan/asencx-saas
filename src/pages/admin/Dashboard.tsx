import { useEffect, useState } from 'react';
import { Users, TrendingUp, ShoppingBag, Activity } from 'lucide-react';

interface Stats {
    totalLeads: number;
    leadsLast7Days: number;
    conversionRate: string;
    trialsActive: number;
    plansActive: number;
}

interface LeadActivity {
    id: string;
    name: string;
    companyName: string;
    status: string;
    createdAt: string;
    systemType: string;
}

export function Dashboard() {
    const [stats, setStats] = useState<Stats | null>(null);
    const [activity, setActivity] = useState<LeadActivity[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem('token');
                const headers = { 'Authorization': `Bearer ${token}` };

                const [statsRes, activityRes] = await Promise.all([
                    fetch(`${import.meta.env.VITE_API_URL}/api/admin/dashboard/metrics`, { headers }),
                    fetch(`${import.meta.env.VITE_API_URL}/api/admin/activity`, { headers })
                ]);

                if (statsRes.ok && activityRes.ok) {
                    const statsData = await statsRes.json();
                    setStats({
                        totalLeads: statsData.totalLeads,
                        leadsLast7Days: 0, // Not provided by new API yet, can stay 0 or be removed
                        conversionRate: statsData.conversionRatePercent,
                        trialsActive: statsData.activeTrialsCount,
                        plansActive: statsData.activeSubscriptionsCount
                    });
                    setActivity(await activityRes.json());
                }
            } catch (error) {
                console.error('Error fetching dashboard data', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) return <div className="text-gray-400">Cargando dashboard...</div>;

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-white">Dashboard General</h1>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <KpiCard
                    title="Total Leads"
                    value={stats?.totalLeads || 0}
                    icon={Users}
                    trend={`+${stats?.leadsLast7Days || 0} esta semana`}
                    color="text-[#00D9FF]"
                />
                <KpiCard
                    title="Tasa de Conversión"
                    value={`${stats?.conversionRate || 0}%`}
                    icon={TrendingUp}
                    trend="Estable"
                    color="text-green-400"
                />
                <KpiCard
                    title="Pruebas Activas"
                    value={stats?.trialsActive || 0}
                    icon={Activity}
                    trend="En progreso"
                    color="text-purple-400"
                />
                <KpiCard
                    title="Suscripciones"
                    value={stats?.plansActive || 0}
                    icon={ShoppingBag}
                    trend="Recurrentes"
                    color="text-orange-400"
                />
            </div>

            {/* Recent Activity */}
            <div className="bg-[#111111] border border-white/10 rounded-xl p-6">
                <h2 className="text-lg font-bold text-white mb-4">Actividad Reciente (Últimos Leads)</h2>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-white/10 text-gray-500 text-sm">
                                <th className="pb-3 font-medium">Nombre</th>
                                <th className="pb-3 font-medium">Empresa</th>
                                <th className="pb-3 font-medium">Sistema</th>
                                <th className="pb-3 font-medium">Estado</th>
                                <th className="pb-3 font-medium">Fecha</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {activity.map((lead) => (
                                <tr key={lead.id} className="text-sm text-gray-300 hover:bg-white/5 transition-colors">
                                    <td className="py-3">{lead.name}</td>
                                    <td className="py-3">{lead.companyName}</td>
                                    <td className="py-3">
                                        <span className="px-2 py-1 bg-white/10 rounded text-xs">{lead.systemType}</span>
                                    </td>
                                    <td className="py-3">
                                        <StatusBadge status={lead.status} />
                                    </td>
                                    <td className="py-3 text-gray-500">
                                        {new Date(lead.createdAt).toLocaleDateString()}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {activity.length === 0 && <p className="text-gray-500 py-4 text-center">No hay actividad reciente.</p>}
                </div>
            </div>
        </div>
    );
}

function KpiCard({ title, value, icon: Icon, trend, color }: any) {
    return (
        <div className="bg-[#111111] border border-white/10 rounded-xl p-6 hover:border-white/20 transition-all">
            <div className="flex justify-between items-start mb-4">
                <div>
                    <p className="text-gray-400 text-sm font-medium">{title}</p>
                    <h3 className="text-3xl font-bold text-white mt-1">{value}</h3>
                </div>
                <div className={`p-3 bg-white/5 rounded-lg ${color}`}>
                    <Icon className="w-6 h-6" />
                </div>
            </div>
            <p className="text-xs text-gray-500">{trend}</p>
        </div>
    );
}

export function StatusBadge({ status }: { status: string }) {
    const colors: Record<string, string> = {
        NEW: 'bg-blue-500/20 text-blue-400',
        CONTACTED: 'bg-yellow-500/20 text-yellow-400',
        CONVERTED: 'bg-green-500/20 text-green-400',
        LOST: 'bg-red-500/20 text-red-400',
        IN_PROCESS: 'bg-purple-500/20 text-purple-400',
        PENDING_PAYMENT: 'bg-orange-500/20 text-orange-400'
    };

    return (
        <span className={`px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap ${colors[status] || 'bg-gray-500/20 text-gray-400'}`}>
            {status === 'PENDING_PAYMENT' ? 'PAGO PENDIENTE' : status}
        </span>
    );
}
