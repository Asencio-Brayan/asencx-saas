import { useEffect, useState } from 'react';
import { Search, ChevronLeft, ChevronRight, MoreHorizontal, Edit, AlertCircle, CheckCircle, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { StatusBadge } from './Dashboard';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Toaster, toast } from 'sonner';

interface Lead {
    id: string;
    name: string;
    companyName: string;
    email: string;
    phoneWhatsapp: string;
    systemType: string;
    plan: string;
    billing: string;
    status: string;
    createdAt: string;
    updatedAt: string;
    notes?: string;
}

export function Leads() {
    const [leads, setLeads] = useState<Lead[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const [pagination, setPagination] = useState({ total: 0, totalPages: 1, page: 1, pageSize: 10 });

    // Edit Modal State
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [currentLead, setCurrentLead] = useState<Lead | null>(null);
    const [editForm, setEditForm] = useState<Partial<Lead>>({});
    const [saving, setSaving] = useState(false);

    // Delete Modal State
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [leadToDelete, setLeadToDelete] = useState<Lead | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const fetchLeads = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const params = new URLSearchParams({
                page: page.toString(),
                pageSize: '10',
                search
            });

            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/leads?${params}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (response.ok) {
                const data = await response.json();
                setLeads(data.data);
                setPagination(data.pagination);
            }
        } catch (error) {
            console.error('Error fetching leads:', error);
            toast.error('Error al cargar leads');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLeads();
    }, [page, search]);

    const handleEditClick = (lead: Lead) => {
        setCurrentLead(lead);
        setEditForm({ ...lead });
        setIsEditOpen(true);
    };

    const handleDeleteClick = (lead: Lead) => {
        setLeadToDelete(lead);
        setIsDeleteOpen(true);
    };

    const confirmDelete = async () => {
        if (!leadToDelete) return;
        setIsDeleting(true);

        // Optimistic update
        const previousLeads = [...leads];
        setLeads(prev => prev.filter(l => l.id !== leadToDelete.id));
        setIsDeleteOpen(false); // Close immediately

        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/leads/${leadToDelete.id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (response.ok) {
                toast.success('Lead eliminado correctamente');
                setLeadToDelete(null);
            } else {
                // Revert on failure
                setLeads(previousLeads);
                const err = await response.json().catch(() => ({ message: 'Error desconocido' }));
                toast.error(`Error: ${err.message || 'No se pudo eliminar el lead'}`);
            }
        } catch (error) {
            console.error('Error deleting lead:', error);
            setLeads(previousLeads);
            toast.error('Error de conexión al eliminar');
        } finally {
            setIsDeleting(false);
        }
    };

    // Conversion State
    const [conversionData, setConversionData] = useState<{ email: string; password: string; tenant: any; trialEndsAt?: string } | null>(null);

    const handleSave = async () => {
        if (!currentLead) return;
        setSaving(true);
        try {
            const token = localStorage.getItem('token');
            // Check if we are converting (Trial or Active) from a non-converted state
            const isToTrial = editForm.status === 'TRIAL';
            const isToActive = editForm.status === 'CONVERTED'; // UI says "Convertido" for Active

            const isConverting = (isToTrial || isToActive) && currentLead.status !== 'CONVERTED';

            const url = isConverting
                ? `${import.meta.env.VITE_API_URL}/api/admin/leads/${currentLead.id}/convert`
                : `${import.meta.env.VITE_API_URL}/api/admin/leads/${currentLead.id}`;

            const method = isConverting ? 'POST' : 'PATCH';
            const body = isConverting
                ? JSON.stringify({
                    plan: editForm.plan || 'BASIC',
                    billing: editForm.billing || 'MONTHLY',
                    status: isToTrial ? 'TRIAL' : 'ACTIVE' // Send explicit status to backend
                })
                : JSON.stringify(editForm);

            const res = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body
            });

            if (res.ok) {
                const data = await res.json();
                if (isConverting) {
                    setConversionData(data.data); // Store credentials to show
                    setIsEditOpen(false);
                    toast.success(`Lead convertido a ${isToTrial ? 'Trial' : 'Cliente'} exitosamente`);
                } else {
                    setIsEditOpen(false);
                    toast.success('Cambios guardados exitosamente');
                }
                fetchLeads(); // Refresh table
            } else {
                const text = await res.text();
                let message = 'Error al guardar cambios';
                try {
                    const json = JSON.parse(text);
                    message = json.message || message;
                } catch (e) { }
                toast.error(message);
            }
        } catch (error) {
            console.error(error);
            toast.error('Error de conexión');
        } finally {
            setSaving(false);
        }
    };

    const handleStatusChange = (status: string) => setEditForm(prev => ({ ...prev, status }));

    return (
        <div className="space-y-6">
            <Toaster richColors theme="dark" position="top-right" />
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <h1 className="text-2xl font-bold text-white">Gestión de Leads (CRM)</h1>
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-500" />
                        <input
                            type="text"
                            placeholder="Buscar..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="bg-[#111111] border border-white/10 rounded-lg pl-9 pr-4 py-2 text-sm text-white focus:outline-none focus:border-[#00D9FF]"
                        />
                    </div>
                </div>
            </div>

            <div className="bg-[#111111] border border-white/10 rounded-xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-white/5 text-gray-400 text-sm border-b border-white/10">
                                <th className="px-6 py-4 font-medium">Lead / Empresa</th>
                                <th className="px-6 py-4 font-medium">Estado</th>
                                <th className="px-6 py-4 font-medium text-right">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {loading ? (
                                <tr><td colSpan={3} className="px-6 py-8 text-center text-gray-500">Cargando...</td></tr>
                            ) : leads.length === 0 ? (
                                <tr><td colSpan={3} className="px-6 py-8 text-center text-gray-500">No hay leads.</td></tr>
                            ) : (
                                leads.map((lead) => (
                                    <tr key={lead.id} className="text-sm text-gray-300 hover:bg-white/5 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="font-medium text-white">{lead.name}</div>
                                            <div className="text-xs text-gray-500">{lead.companyName}</div>
                                            <div className="text-xs text-gray-600 email">{lead.email}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <StatusBadge status={lead.status} />
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" className="h-8 w-8 p-0 text-gray-400 hover:text-white">
                                                        <MoreHorizontal className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end" className="bg-[#1A1A1A] border-white/10 text-gray-300">
                                                    <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                                                    <DropdownMenuItem onClick={() => handleEditClick(lead)} className="cursor-pointer hover:bg-white/10">
                                                        <Edit className="mr-2 h-4 w-4" /> Editar Lead
                                                    </DropdownMenuItem>
                                                    <DropdownMenuSeparator className="bg-white/10" />
                                                    <DropdownMenuItem onClick={() => handleDeleteClick(lead)} className="cursor-pointer hover:bg-white/10 text-red-500">
                                                        <Trash2 className="mr-2 h-4 w-4" /> Eliminar
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="px-6 py-4 border-t border-white/10 flex items-center justify-between">
                    <span className="text-sm text-gray-500">
                        {pagination.page} de {pagination.totalPages}
                    </span>
                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            size="icon"
                            disabled={page === 1}
                            onClick={() => setPage(p => p - 1)}
                            className="border-white/10 text-white disabled:opacity-50"
                        >
                            <ChevronLeft className="w-4 h-4" />
                        </Button>
                        <Button
                            variant="outline"
                            size="icon"
                            disabled={page === pagination.totalPages}
                            onClick={() => setPage(p => p + 1)}
                            className="border-white/10 text-white disabled:opacity-50"
                        >
                            <ChevronRight className="w-4 h-4" />
                        </Button>
                    </div>
                </div>
            </div>

            {/* Edit Modal */}
            <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                <DialogContent className="sm:max-w-[425px] bg-[#111111] border-white/10 text-white">
                    <DialogHeader>
                        <DialogTitle>Editar Lead</DialogTitle>
                        <DialogDescription className="text-gray-400">
                            Modifica los detalles del lead.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="name" className="text-right text-gray-400">Nombre</Label>
                            <Input id="name" value={editForm.name || ''} onChange={e => setEditForm({ ...editForm, name: e.target.value })} className="col-span-3 bg-[#1A1A1A] border-white/10 text-white" />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="company" className="text-right text-gray-400">Empresa</Label>
                            <Input id="company" value={editForm.companyName || ''} onChange={e => setEditForm({ ...editForm, companyName: e.target.value })} className="col-span-3 bg-[#1A1A1A] border-white/10 text-white" />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="status" className="text-right text-gray-400">Estado</Label>
                            <select
                                id="status"
                                value={editForm.status || 'PENDING'}
                                onChange={e => handleStatusChange(e.target.value)}
                                className="col-span-3 bg-[#1A1A1A] border border-white/10 rounded-md p-2 text-white text-sm"
                            >
                                <option value="PENDING">Pendiente</option>
                                <option value="TRIAL">Prueba (Trial)</option>
                                <option value="CONVERTED">Convertido (Cliente)</option>
                                <option value="LOST">Perdido</option>
                            </select>
                        </div>

                        {/* Conversion Logic Display */}
                        {(editForm.status === 'CONVERTED' || editForm.status === 'TRIAL') && currentLead?.status !== 'CONVERTED' && (
                            <>
                                {editForm.status === 'CONVERTED' && (
                                    <>
                                        <div className="grid grid-cols-4 items-center gap-4">
                                            <Label htmlFor="plan" className="text-right text-gray-400">Plan</Label>
                                            <select
                                                id="plan"
                                                value={editForm.plan || 'BASIC'}
                                                onChange={e => setEditForm(prev => ({ ...prev, plan: e.target.value }))}
                                                className="col-span-3 bg-[#1A1A1A] border border-white/10 rounded-md p-2 text-white text-sm"
                                            >
                                                <option value="FREE">Gratis (Free)</option>
                                                <option value="BASIC">Básico (Basic)</option>
                                                <option value="PREMIUM">Premium</option>
                                                <option value="VIP">VIP</option>
                                            </select>
                                        </div>
                                        <div className="grid grid-cols-4 items-center gap-4">
                                            <Label htmlFor="billing" className="text-right text-gray-400">Facturación</Label>
                                            <select
                                                id="billing"
                                                value={editForm.billing || 'MONTHLY'}
                                                onChange={e => setEditForm(prev => ({ ...prev, billing: e.target.value }))}
                                                className="col-span-3 bg-[#1A1A1A] border border-white/10 rounded-md p-2 text-white text-sm"
                                            >
                                                <option value="MONTHLY">Mensual</option>
                                                <option value="ANNUAL">Anual</option>
                                            </select>
                                        </div>
                                    </>
                                )}
                                <div className="col-span-4 p-3 bg-blue-500/10 border border-blue-500/30 rounded text-xs text-blue-200">
                                    <AlertCircle className="w-4 h-4 inline mr-2" />
                                    {editForm.status === 'TRIAL'
                                        ? 'Se creará un acceso Temporal (14 días). Se generará contraseña.'
                                        : 'Se creará un Cliente Activo y se generará contraseña.'}
                                </div>
                            </>
                        )}

                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="notes" className="text-right text-gray-400">Notas</Label>
                            <Input id="notes" value={editForm.notes || ''} onChange={e => setEditForm({ ...editForm, notes: e.target.value })} className="col-span-3 bg-[#1A1A1A] border-white/10 text-white" />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsEditOpen(false)} className="border-white/10 text-white hover:bg-white/10">Cancelar</Button>
                        <Button onClick={handleSave} className="bg-[#00D9FF] text-black hover:bg-[#00b8d9]" disabled={saving}>
                            {saving ? 'Procesando...' : (
                                (editForm.status === 'CONVERTED' || editForm.status === 'TRIAL') && currentLead?.status !== 'CONVERTED'
                                    ? (editForm.status === 'TRIAL' ? 'Iniciar Trial' : 'Convertir a Cliente')
                                    : 'Guardar Cambios'
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Credenciales Modal */}
            <Dialog open={!!conversionData} onOpenChange={() => setConversionData(null)}>
                <DialogContent className="sm:max-w-[425px] bg-[#111111] border-white/10 text-white">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2 text-green-400">
                            <CheckCircle className="w-5 h-5" />
                            {conversionData?.tenant?.status === 'TRIAL' ? 'Trial Iniciado' : 'Cliente Creado'}
                        </DialogTitle>
                        <DialogDescription className="text-gray-400">
                            Se han generado las credenciales de acceso.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="p-4 bg-[#1A1A1A] rounded-lg border border-white/10 space-y-3">
                        <div>
                            <span className="text-xs text-gray-500 uppercase tracking-wider">Email</span>
                            <div className="font-mono text-white select-all">{conversionData?.email}</div>
                        </div>
                        <div>
                            <span className="text-xs text-gray-500 uppercase tracking-wider">Contraseña</span>
                            <div className="flex items-center justify-between gap-2">
                                <div className="font-mono text-[#00D9FF] text-lg font-bold select-all">{conversionData?.password}</div>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => {
                                        navigator.clipboard.writeText(conversionData?.password || '');
                                        toast.success('Copiado al portapapeles');
                                    }}
                                    className="h-6 text-xs text-gray-400 hover:text-white"
                                >
                                    Copiar
                                </Button>
                            </div>
                        </div>
                        {conversionData?.trialEndsAt && (
                            <div>
                                <span className="text-xs text-gray-500 uppercase tracking-wider">Fin del Trial</span>
                                <div className="font-mono text-yellow-400 text-sm">
                                    {new Date(conversionData.trialEndsAt).toLocaleDateString()}
                                </div>
                            </div>
                        )}
                        <div className="pt-2 text-xs text-gray-500 border-t border-white/5">
                            * Guarda estos datos, no se mostrarán nuevamente.
                        </div>
                    </div>
                    <DialogFooter>
                        <Button onClick={() => setConversionData(null)} className="bg-[#00D9FF] text-black hover:bg-[#00b8d9]">
                            Cerrar
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation Modal */}
            <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
                <DialogContent className="sm:max-w-[425px] bg-[#111111] border-white/10 text-white">
                    <DialogHeader>
                        <DialogTitle className="text-red-500 flex items-center gap-2">
                            <AlertCircle className="w-5 h-5" /> Confirmar Eliminación
                        </DialogTitle>
                        <DialogDescription className="text-gray-400">
                            {leadToDelete?.status === 'CONVERTED' ? (
                                <span className="text-red-400 block mt-2">
                                    ⚠️ <strong>ADVERTENCIA:</strong> Este lead ya es un cliente activo.
                                    Al eliminarlo, <strong>se borrará también la cuenta del cliente y sus usuarios</strong>.
                                </span>
                            ) : (
                                <span>¿Estás seguro de que quieres eliminar a <strong>{leadToDelete?.name}</strong>? Esta acción no se puede deshacer.</span>
                            )}
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsDeleteOpen(false)} className="border-white/10 text-white hover:bg-white/10">Cancelar</Button>
                        <Button onClick={confirmDelete} className="bg-red-500 text-white hover:bg-red-600" disabled={isDeleting}>
                            {isDeleting ? 'Eliminando...' : 'Eliminar Lead'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
