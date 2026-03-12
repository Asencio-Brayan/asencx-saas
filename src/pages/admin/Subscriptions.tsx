import { useEffect, useState } from 'react';
import { Search, MoreHorizontal, Edit, Layers, Users as UsersIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    // DropdownMenuLabel,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Dialog,
    DialogContent,
    // DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';

// --- TYPES ---
interface Tenant {
    id: string;
    name: string;
    companyName: string;
    email: string;
    phone: string;
    status: string;
    plan: string;
    modalidad: string;
    fechaInicio: string;
    fechaFin: string;
}

interface Plan {
    id: string;
    tier: string;
    displayName: string;
    priceMonthly: number;
    priceAnnual: number;
    currency: string;
    features: any; // JSON
    limits: any; // JSON
    isActive: boolean;
}

// --- COMPONENTS ---

const StatusBadge = ({ status }: { status: string }) => {
    const styles: Record<string, string> = {
        ACTIVE: 'bg-green-500/20 text-green-500 border-green-500/20',
        PENDING: 'bg-yellow-500/20 text-yellow-500 border-yellow-500/20',
        CANCELLED: 'bg-red-500/20 text-red-500 border-red-500/20',
        VENCIDO: 'bg-orange-500/20 text-orange-500 border-orange-500/20',
        SUSPENDED: 'bg-gray-500/20 text-gray-400 border-gray-500/20',
        TRIAL: 'bg-blue-500/20 text-blue-400 border-blue-500/20',
        TRIAL_EXPIRED: 'bg-red-500/10 text-red-400 border-red-500/20',
    };
    const label: Record<string, string> = {
        ACTIVE: 'Activo',
        PENDING: 'Pendiente',
        CANCELLED: 'Cancelado',
        VENCIDO: 'Vencido',
        SUSPENDED: 'Pausado',
        TRIAL: 'Prueba',
        TRIAL_EXPIRED: 'Prueba Vencida',
    };
    const s = status?.toUpperCase() || 'PENDING';
    return (
        <span className={`px-2 py-1 rounded-full text-xs font-medium border ${styles[s] || styles.PENDING}`}>
            {label[s] || s}
        </span>
    );
};

export function Subscriptions() {
    const [activeTab, setActiveTab] = useState('clients');

    // --- CLIENTS STATE ---
    const [tenants, setTenants] = useState<Tenant[]>([]);
    const [clientsLoading, setClientsLoading] = useState(true);
    const [clientSearch, setClientSearch] = useState('');
    // const [clientPage, setClientPage] = useState(1);
    // const [clientPagination, setClientPagination] = useState({ total: 0, totalPages: 1, page: 1, pageSize: 10 });

    // Client Edit
    const [isClientEditOpen, setIsClientEditOpen] = useState(false);
    const [currentTenant, setCurrentTenant] = useState<Tenant | null>(null);
    const [clientEditForm, setClientEditForm] = useState<Partial<Tenant>>({});

    // --- PLANS STATE ---
    const [plans, setPlans] = useState<Plan[]>([]);
    const [plansLoading, setPlansLoading] = useState(true);

    // Plan Edit
    const [isPlanEditOpen, setIsPlanEditOpen] = useState(false);
    const [currentPlan, setCurrentPlan] = useState<Plan | null>(null);
    const [planEditForm, setPlanEditForm] = useState<Partial<Plan>>({});
    const [featuresText, setFeaturesText] = useState(''); // Handle JSON as text for simplicity
    const [limitsText, setLimitsText] = useState('');

    const [saving, setSaving] = useState(false);

    // --- FETCH DATA ---
    const fetchTenants = async () => {
        setClientsLoading(true);
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/subscriptions/clients`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setTenants(data); // New endpoint returns array directly
                // setClientPagination(data.pagination); // Pagination momentarily disabled in new endpoint
            }
        } catch (e) {
            console.error(e);
        } finally {
            setClientsLoading(false);
        }
    };

    const fetchPlans = async () => {
        setPlansLoading(true);
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/plans`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setPlans(data);
            }
        } catch (e) {
            console.error(e);
        } finally {
            setPlansLoading(false);
        }
    };

    useEffect(() => {
        if (activeTab === 'clients') fetchTenants();
        if (activeTab === 'plans') fetchPlans();
    }, [activeTab, clientSearch]);

    // --- HANDLERS CLIENTS ---
    const handleClientEdit = (tenant: Tenant) => {
        setCurrentTenant(tenant);
        setClientEditForm({
            ...tenant,
            fechaInicio: tenant.fechaInicio ? new Date(tenant.fechaInicio).toISOString().split('T')[0] : '',
            fechaFin: tenant.fechaFin ? new Date(tenant.fechaFin).toISOString().split('T')[0] : '',
        });
        setIsClientEditOpen(true);
    };

    const saveClient = async () => {
        if (!currentTenant) return;
        setSaving(true);
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/tenants/${currentTenant.id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({
                    status: clientEditForm.status,
                    plan: clientEditForm.plan,
                    modalidad: clientEditForm.modalidad,
                    fechaInicio: clientEditForm.fechaInicio,
                    fechaFin: clientEditForm.fechaFin
                })
            });
            if (res.ok) {
                setIsClientEditOpen(false);
                fetchTenants();
            } else {
                alert('Eror al guardar cliente');
            }
        } catch (e) { console.error(e); alert('Error de conexión'); }
        finally { setSaving(false); }
    };

    // --- HANDLERS PLANS ---
    const handlePlanEdit = (plan: Plan) => {
        setCurrentPlan(plan);
        setPlanEditForm(plan);
        setFeaturesText(JSON.stringify(plan.features, null, 2));
        setLimitsText(JSON.stringify(plan.limits, null, 2));
        setIsPlanEditOpen(true);
    };

    const savePlan = async () => {
        if (!currentPlan) return;
        setSaving(true);
        try {
            let featuresJson, limitsJson;
            try {
                featuresJson = JSON.parse(featuresText);
                limitsJson = JSON.parse(limitsText);
            } catch (e) {
                alert('JSON inválido en Features o Límites');
                setSaving(false);
                return;
            }

            const token = localStorage.getItem('token');
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/plans/${currentPlan.tier}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({
                    displayName: planEditForm.displayName,
                    priceMonthly: planEditForm.priceMonthly,
                    priceAnnual: planEditForm.priceAnnual,
                    isActive: planEditForm.isActive,
                    features: featuresJson,
                    limits: limitsJson
                })
            });
            if (res.ok) {
                setIsPlanEditOpen(false);
                fetchPlans();
            } else {
                alert('Error al guardar plan');
            }
        } catch (e) { console.error(e); alert('Error de conexión'); }
        finally { setSaving(false); }
    };


    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-white">Gestión de Suscripciones</h1>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="bg-[#111111] border border-white/10">
                    <TabsTrigger value="clients" className="flex items-center gap-2">
                        <UsersIcon className="w-4 h-4" /> Clientes
                    </TabsTrigger>
                    <TabsTrigger value="plans" className="flex items-center gap-2">
                        <Layers className="w-4 h-4" /> Planes y Precios
                    </TabsTrigger>
                </TabsList>

                {/* TAB CLIENTS */}
                <TabsContent value="clients" className="mt-6 space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="relative w-72">
                            <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-500" />
                            <input
                                type="text"
                                placeholder="Buscar cliente..."
                                value={clientSearch}
                                onChange={(e) => setClientSearch(e.target.value)}
                                className="w-full bg-[#111111] border border-white/10 rounded-lg pl-9 pr-4 py-2 text-sm text-white focus:outline-none focus:border-[#00D9FF]"
                            />
                        </div>
                    </div>

                    <div className="bg-[#111111] border border-white/10 rounded-xl overflow-hidden">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-white/5 text-gray-400 text-sm border-b border-white/10">
                                    <th className="px-6 py-4 font-medium">Cliente</th>
                                    <th className="px-6 py-4 font-medium">Plan</th>
                                    <th className="px-6 py-4 font-medium">Vigencia</th>
                                    <th className="px-6 py-4 font-medium">Estado</th>
                                    <th className="px-6 py-4 text-right">Acciones</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {clientsLoading ? (
                                    <tr><td colSpan={5} className="p-8 text-center text-gray-500">Cargando...</td></tr>
                                ) : tenants.length === 0 ? (
                                    <tr><td colSpan={5} className="p-8 text-center text-gray-500">No hay clientes encontrados</td></tr>
                                ) : (
                                    tenants.map(t => (
                                        <tr key={t.id} className="text-sm text-gray-300 hover:bg-white/5">
                                            <td className="px-6 py-4">
                                                <div className="text-white font-medium">{t.companyName}</div>
                                                <div className="text-xs text-gray-500">{t.email}</div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-white font-medium">{t.plan}</div>
                                                <div className="text-xs text-gray-500">{t.modalidad}</div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-xs text-gray-400">{new Date(t.fechaFin).toLocaleDateString()}</div>
                                            </td>
                                            <td className="px-6 py-4"><StatusBadge status={t.status} /></td>
                                            <td className="px-6 py-4 text-right">
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" className="h-8 w-8 p-0 text-gray-500 hover:text-white"><MoreHorizontal className="h-4 w-4" /></Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end" className="bg-[#1A1A1A] border-white/10 text-gray-300">
                                                        <DropdownMenuItem onClick={() => handleClientEdit(t)} className="cursor-pointer">
                                                            <Edit className="mr-2 h-4 w-4" /> Editar Suscripción
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                        {/* Pagination Simple */}
                        {/* Pagination Simple - Hidden for now as API returns full list 
                        <div className="px-6 py-4 border-t border-white/10 flex items-center justify-between">
                            <span className="text-sm text-gray-500">{clientPage} de {clientPagination.totalPages}</span>
                            <div className="flex gap-2">
                                <Button variant="outline" size="icon" disabled={clientPage === 1} onClick={() => setClientPage(p => p - 1)} className="border-white/10"><ChevronLeft className="h-4 w-4" /></Button>
                                <Button variant="outline" size="icon" disabled={clientPage === clientPagination.totalPages} onClick={() => setClientPage(p => p + 1)} className="border-white/10"><ChevronRight className="h-4 w-4" /></Button>
                            </div>
                        </div>
                        */}
                    </div>
                </TabsContent>

                {/* TAB PLANS */}
                <TabsContent value="plans" className="mt-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {plansLoading ? <div className="text-gray-500 col-span-3 text-center">Cargando planes...</div> :
                            plans.map(plan => (
                                <div key={plan.id} className={`bg-[#111111] border ${plan.isActive ? 'border-[#00D9FF]/30' : 'border-white/10'} rounded-xl p-6 flex flex-col`}>
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <h3 className="text-xl font-bold text-white">{plan.displayName}</h3>
                                            <span className="text-xs text-gray-500 uppercase tracking-wider">{plan.tier}</span>
                                        </div>
                                        {plan.isActive ?
                                            <span className="bg-green-500/10 text-green-500 text-xs px-2 py-1 rounded">Activo</span> :
                                            <span className="bg-gray-500/10 text-gray-500 text-xs px-2 py-1 rounded">Inactivo</span>
                                        }
                                    </div>

                                    <div className="space-y-2 mb-6 flex-1">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-400">Mensual:</span>
                                            <span className="text-white font-medium">{plan.currency} {plan.priceMonthly.toFixed(2)}</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-400">Anual:</span>
                                            <span className="text-white font-medium">{plan.currency} {plan.priceAnnual.toFixed(2)}</span>
                                        </div>
                                    </div>

                                    <Button onClick={() => handlePlanEdit(plan)} className="w-full border border-white/10 bg-white/5 hover:bg-white/10 text-white">
                                        <Edit className="w-4 h-4 mr-2" /> Editar Plan
                                    </Button>
                                </div>
                            ))
                        }
                    </div>
                </TabsContent>
            </Tabs>

            {/* MODAL EDIT CLIENT */}
            <Dialog open={isClientEditOpen} onOpenChange={setIsClientEditOpen}>
                <DialogContent className="bg-[#111111] border-white/10 text-white">
                    <DialogHeader><DialogTitle>Editar Suscripción Cliente</DialogTitle></DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label className="text-right">Estado</Label>
                            <select value={clientEditForm.status} onChange={e => setClientEditForm({ ...clientEditForm, status: e.target.value })} className="col-span-3 bg-[#1A1A1A] border border-white/10 p-2 rounded text-white">
                                <option value="ACTIVE">Activo</option>
                                <option value="SUSPENDED">Suspendido</option>
                                <option value="CANCELLED">Cancelado</option>
                                <option value="VENCIDO">Vencido</option>
                            </select>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label className="text-right">Plan</Label>
                            <select value={clientEditForm.plan} onChange={e => setClientEditForm({ ...clientEditForm, plan: e.target.value })} className="col-span-3 bg-[#1A1A1A] border border-white/10 p-2 rounded text-white">
                                <option value="BASIC">Básico</option>
                                <option value="PREMIUM">Premium</option>
                                <option value="VIP">VIP</option>
                                <option value="FREE">Gratis</option>
                            </select>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label className="text-right">Ciclo</Label>
                            <select value={clientEditForm.modalidad} onChange={e => setClientEditForm({ ...clientEditForm, modalidad: e.target.value })} className="col-span-3 bg-[#1A1A1A] border border-white/10 p-2 rounded text-white">
                                <option value="MONTHLY">Mensual</option>
                                <option value="ANNUAL">Anual</option>
                            </select>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label className="text-right">Fin</Label>
                            <Input type="date" value={clientEditForm.fechaFin || ''} onChange={e => setClientEditForm({ ...clientEditForm, fechaFin: e.target.value })} className="col-span-3 bg-[#1A1A1A] border-white/10 text-white" />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsClientEditOpen(false)} className="border-white/10 text-white hover:bg-white/10">Cancelar</Button>
                        <Button onClick={saveClient} className="bg-[#00D9FF] text-black hover:bg-[#00b8d9]" disabled={saving}>{saving ? 'Guardando...' : 'Guardar'}</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* MODAL EDIT PLAN */}
            <Dialog open={isPlanEditOpen} onOpenChange={setIsPlanEditOpen}>
                <DialogContent className="max-w-[700px] bg-[#111111] border-white/10 text-white max-h-[90vh] overflow-y-auto">
                    <DialogHeader><DialogTitle>Editar Plan: {currentPlan?.displayName}</DialogTitle></DialogHeader>
                    <div className="grid gap-6 py-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Nombre Visible</Label>
                                <Input value={planEditForm.displayName || ''} onChange={e => setPlanEditForm({ ...planEditForm, displayName: e.target.value })} className="bg-[#1A1A1A] border-white/10 text-white" />
                            </div>
                            <div className="space-y-2 flex items-center justify-between pt-6 px-4 border border-white/10 rounded-lg bg-white/5">
                                <Label>Plan Activo</Label>
                                <Switch checked={planEditForm.isActive} onCheckedChange={c => setPlanEditForm({ ...planEditForm, isActive: c })} />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Precio Mensual (PEN)</Label>
                                <Input type="number" value={planEditForm.priceMonthly} onChange={e => setPlanEditForm({ ...planEditForm, priceMonthly: Number(e.target.value) })} className="bg-[#1A1A1A] border-white/10 text-white" />
                            </div>
                            <div className="space-y-2">
                                <Label>Precio Anual (PEN)</Label>
                                <Input type="number" value={planEditForm.priceAnnual} onChange={e => setPlanEditForm({ ...planEditForm, priceAnnual: Number(e.target.value) })} className="bg-[#1A1A1A] border-white/10 text-white" />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label>Features (JSON Array)</Label>
                            <Textarea value={featuresText} onChange={e => setFeaturesText(e.target.value)} rows={5} className="bg-[#1A1A1A] border-white/10 text-white font-mono text-xs" />
                            <p className="text-xs text-gray-500">Ej: ["Acceso a CRM", "Soporte 24/7"]</p>
                        </div>

                        <div className="space-y-2">
                            <Label>Límites (JSON Object)</Label>
                            <Textarea value={limitsText} onChange={e => setLimitsText(e.target.value)} rows={5} className="bg-[#1A1A1A] border-white/10 text-white font-mono text-xs" />
                            <p className="text-xs text-gray-500">Ej: {'{"users": 5, "storage": "10GB"}'}</p>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsPlanEditOpen(false)} className="border-white/10 text-white hover:bg-white/10">Cancelar</Button>
                        <Button onClick={savePlan} className="bg-[#00D9FF] text-black hover:bg-[#00b8d9]" disabled={saving}>{saving ? 'Guardando...' : 'Guardar Cambios'}</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

        </div>
    );
}
