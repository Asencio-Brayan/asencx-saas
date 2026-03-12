import { useState, useEffect } from 'react';
import {
    BarChart3, TrendingUp, Users, DollarSign,
    Calendar, Loader2, AlertTriangle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
    AreaChart, Area
} from 'recharts';

interface ReportData {
    range: string;
    totals: any;
    series: any[];
}

export function Reports() {
    const [activeTab, setActiveTab] = useState('conversion');
    const [range, setRange] = useState('30d');
    const [data, setData] = useState<ReportData | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchData = async () => {
        setLoading(true);
        setError(null);
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/reports/${activeTab}?range=${range}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (res.ok) {
                const json = await res.json();
                setData(json);
            } else {
                throw new Error('Error fetching report data');
            }
        } catch (e: any) {
            console.error(e);
            setError(e.message || 'Error de conexión');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [activeTab, range]);

    const formatCurrency = (val: number) => {
        return new Intl.NumberFormat('es-PE', { style: 'currency', currency: 'PEN' }).format(val);
    };

    const formatDate = (dateStr: string) => {
        // Adjust date parsing if needed based on API format (YYYY-MM-DD)
        if (!dateStr) return '';
        const [year, month, day] = dateStr.split('-');
        const date = new Date(Number(year), Number(month) - 1, Number(day));
        return date.toLocaleDateString('es-ES', { month: 'short', day: 'numeric' });
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                        <BarChart3 className="w-6 h-6 text-[#00D9FF]" />
                        Reportes y Métricas
                    </h1>
                    <p className="text-gray-400 text-sm">Visualiza el rendimiento de tu negocio en tiempo real.</p>
                </div>

                <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-500" />
                    <Select value={range} onValueChange={setRange}>
                        <SelectTrigger className="w-[180px] bg-[#111111] border-white/10 text-white">
                            <SelectValue placeholder="Periodo" />
                        </SelectTrigger>
                        <SelectContent className="bg-[#1A1A1A] border-white/10 text-white">
                            <SelectItem value="30d">Últimos 30 días</SelectItem>
                            <SelectItem value="90d">Últimos 3 meses</SelectItem>
                            <SelectItem value="365d">Último año</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="bg-[#111111] border border-white/10 w-full md:w-auto overflow-x-auto justify-start">
                    <TabsTrigger value="conversion">Conversión</TabsTrigger>
                    <TabsTrigger value="subscriptions">Suscripciones</TabsTrigger>
                    <TabsTrigger value="revenue">Ingresos (MRR)</TabsTrigger>
                </TabsList>

                <div className="mt-6">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center h-64 text-gray-500">
                            <Loader2 className="w-8 h-8 animate-spin mb-4 text-[#00D9FF]" />
                            <p>Cargando reporte...</p>
                        </div>
                    ) : error ? (
                        <div className="flex flex-col items-center justify-center h-64 text-red-400 border border-white/10 bg-[#111111] rounded-xl">
                            <AlertTriangle className="w-8 h-8 mb-4" />
                            <p>{error}</p>
                            <Button variant="outline" onClick={fetchData} className="mt-4 border-white/10">Reintentar</Button>
                        </div>
                    ) : data && (
                        <div className="space-y-6 animate-in fade-in duration-500">

                            {/* KPI CARDS */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                {activeTab === 'conversion' && (
                                    <>
                                        <KPICard title="Total Leads" value={data.totals.totalLeads} icon={Users} color="text-blue-400" />
                                        <KPICard title="Convertidos" value={data.totals.convertedLeads} icon={TrendingUp} color="text-green-400" />
                                        <KPICard title="Tasa Conversión" value={`${data.totals.conversionRatePercent}%`} icon={BarChart3} color="text-[#00D9FF]" />
                                    </>
                                )}
                                {activeTab === 'subscriptions' && (
                                    <>
                                        <KPICard title="Activos" value={data.totals.active} icon={Users} color="text-green-400" />
                                        <KPICard title="Pruebas Activas" value={data.totals.trialsActive} icon={Loader2} color="text-blue-400" />
                                        <KPICard title="Pruebas Vencidas" value={data.totals.trialsExpired} icon={AlertTriangle} color="text-yellow-400" />
                                        <KPICard title="Cancelados" value={data.totals.canceled} icon={Users} color="text-red-400" />
                                    </>
                                )}
                                {activeTab === 'revenue' && (
                                    <>
                                        <KPICard title="MRR Estimado" value={formatCurrency(data.totals.mrr)} icon={DollarSign} color="text-green-400" />
                                        <KPICard title="ARR Proyectado" value={formatCurrency(data.totals.arr)} icon={TrendingUp} color="text-[#00D9FF]" />
                                    </>
                                )}
                            </div>

                            {/* CHARTS */}
                            <Card className="bg-[#111111] border-white/10">
                                <CardHeader>
                                    <CardTitle className="text-white">
                                        {activeTab === 'conversion' && "Leads vs Conversiones"}
                                        {activeTab === 'subscriptions' && "Crecimiento de Suscripciones"}
                                        {activeTab === 'revenue' && "Evolución de Ingresos (Nuevo MRR)"}
                                    </CardTitle>
                                    <CardDescription className="text-gray-400">
                                        Tendencia en el periodo seleccionado
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="h-[400px]">
                                    <ResponsiveContainer width="100%" height="100%">
                                        {activeTab === 'conversion' ? (
                                            <LineChart data={data.series}>
                                                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                                                <XAxis dataKey="date" stroke="#666" tickFormatter={(label) => formatDate(label as string)} />
                                                <YAxis stroke="#666" />
                                                <Tooltip
                                                    contentStyle={{ backgroundColor: '#1A1A1A', borderColor: '#333', color: '#fff' }}
                                                    labelFormatter={(label) => formatDate(label as string)}
                                                />
                                                <Legend />
                                                <Line type="monotone" dataKey="leads" stroke="#8884d8" name="Total Leads" />
                                                <Line type="monotone" dataKey="converted" stroke="#82ca9d" name="Convertidos" strokeWidth={2} />
                                            </LineChart>
                                        ) : activeTab === 'subscriptions' ? (
                                            <LineChart data={data.series}>
                                                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                                                <XAxis dataKey="date" stroke="#666" tickFormatter={(label) => formatDate(label as string)} />
                                                <YAxis stroke="#666" />
                                                <Tooltip
                                                    contentStyle={{ backgroundColor: '#1A1A1A', borderColor: '#333', color: '#fff' }}
                                                    labelFormatter={(label) => formatDate(label as string)}
                                                />
                                                <Legend />
                                                <Line type="monotone" dataKey="active" stroke="#82ca9d" name="Activos" strokeWidth={2} />
                                                <Line type="monotone" dataKey="trials" stroke="#8884d8" name="Pruebas" />
                                                <Line type="monotone" dataKey="canceled" stroke="#ff8042" name="Cancelados" />
                                            </LineChart>
                                        ) : (
                                            <AreaChart data={data.series}>
                                                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                                                <XAxis dataKey="date" stroke="#666" tickFormatter={(label) => formatDate(label as string)} />
                                                <YAxis stroke="#666" />
                                                <Tooltip
                                                    contentStyle={{ backgroundColor: '#1A1A1A', borderColor: '#333', color: '#fff' }}
                                                    labelFormatter={(label) => formatDate(label as string)}
                                                    formatter={(val: any) => formatCurrency(Number(val))}
                                                />
                                                <Legend />
                                                <Area type="monotone" dataKey="mrr" stroke="#00D9FF" fill="#00D9FF" fillOpacity={0.2} name="Nuevo MRR" />
                                            </AreaChart>
                                        )}
                                    </ResponsiveContainer>
                                </CardContent>
                            </Card>

                        </div>
                    )}
                </div>
            </Tabs>
        </div>
    );
}

function KPICard({ title, value, icon: Icon, color }: { title: string, value: string | number, icon: any, color: string }) {
    return (
        <Card className="bg-[#111111] border-white/10 hover:border-white/20 transition-all">
            <CardContent className="p-6">
                <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-400">{title}</span>
                    <div className={`p-2 rounded-lg bg-white/5 ${color}`}>
                        <Icon className="w-4 h-4" />
                    </div>
                </div>
                <div className="text-2xl font-bold text-white">{value}</div>
            </CardContent>
        </Card>
    );
}

// Fixed build errors from previous attempts
