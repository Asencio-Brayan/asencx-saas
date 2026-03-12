import { useEffect, useState } from 'react';
import { Settings as SettingsIcon, Save, Info, Bell, Shield, Palette } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';

export function Settings() {
    const [config, setConfig] = useState<any>({});
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        fetchConfig();
    }, []);

    const fetchConfig = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/config`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setConfig(data);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async (key: string, value: any) => {
        setSaving(true);
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/config`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ key, value })
            });

            if (res.ok) {
                setConfig((prev: any) => ({ ...prev, [key]: value }));
                // alert('Configuración guardada'); 
            }
        } catch (error) {
            console.error(error);
        } finally {
            setSaving(false);
        }
    };

    const handleChange = (key: string, value: any) => {
        setConfig((prev: any) => ({ ...prev, [key]: value }));
    };

    if (loading) return <div className="text-gray-400">Cargando configuración...</div>;

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-white">Configuración del Sistema</h1>

            <Tabs defaultValue="general" className="w-full">
                <TabsList className="bg-[#111111] border border-white/10">
                    <TabsTrigger value="general">General</TabsTrigger>
                    <TabsTrigger value="branding">Personalización</TabsTrigger>
                    <TabsTrigger value="notifications">Notificaciones</TabsTrigger>
                    <TabsTrigger value="security">Cuenta Admin</TabsTrigger>
                </TabsList>

                {/* GENERAL */}
                <TabsContent value="general" className="space-y-4 mt-4">
                    <div className="bg-[#111111] border border-white/10 rounded-xl p-6">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="p-3 bg-blue-500/10 rounded-lg">
                                <SettingsIcon className="w-6 h-6 text-blue-500" />
                            </div>
                            <div>
                                <h2 className="text-lg font-bold text-white">Información Básica</h2>
                                <p className="text-gray-400 text-sm">Identidad de la plataforma.</p>
                            </div>
                        </div>
                        <div className="space-y-4 max-w-xl">
                            <div className="space-y-2">
                                <Label>Nombre de la Plataforma</Label>
                                <div className="flex gap-2">
                                    <Input
                                        value={config.systemName || ''}
                                        onChange={(e) => handleChange('systemName', e.target.value)}
                                        placeholder="AsencX Web Interactiva"
                                        className="bg-[#1A1A1A] border-white/10 text-white"
                                    />
                                    <Button onClick={() => handleSave('systemName', config.systemName)} disabled={saving}>
                                        <Save className="w-4 h-4" />
                                    </Button>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label>Correo de Soporte</Label>
                                <div className="flex gap-2">
                                    <Input
                                        value={config.supportEmail || ''}
                                        onChange={(e) => handleChange('supportEmail', e.target.value)}
                                        placeholder="soporte@asencx.com"
                                        className="bg-[#1A1A1A] border-white/10 text-white"
                                    />
                                    <Button onClick={() => handleSave('supportEmail', config.supportEmail)} disabled={saving}>
                                        <Save className="w-4 h-4" />
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </TabsContent>

                {/* BRANDING */}
                <TabsContent value="branding" className="space-y-4 mt-4">
                    <div className="bg-[#111111] border border-white/10 rounded-xl p-6">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="p-3 bg-purple-500/10 rounded-lg">
                                <Palette className="w-6 h-6 text-purple-500" />
                            </div>
                            <div>
                                <h2 className="text-lg font-bold text-white">Apariencia</h2>
                                <p className="text-gray-400 text-sm">Colores y logotipos del panel administrativo.</p>
                            </div>
                        </div>
                        <div className="space-y-4 max-w-xl">
                            <div className="space-y-2">
                                <Label>Color Primario (Hex)</Label>
                                <div className="flex gap-2">
                                    <Input
                                        value={config.primaryColor || '#00D9FF'}
                                        onChange={(e) => handleChange('primaryColor', e.target.value)}
                                        className="bg-[#1A1A1A] border-white/10 text-white"
                                    />
                                    <div className="w-10 h-10 rounded border border-white/10" style={{ backgroundColor: config.primaryColor || '#00D9FF' }}></div>
                                    <Button onClick={() => handleSave('primaryColor', config.primaryColor)} disabled={saving}>
                                        <Save className="w-4 h-4" />
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </TabsContent>

                {/* NOTIFICATIONS */}
                <TabsContent value="notifications" className="space-y-4 mt-4">
                    <div className="bg-[#111111] border border-white/10 rounded-xl p-6">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="p-3 bg-yellow-500/10 rounded-lg">
                                <Bell className="w-6 h-6 text-yellow-500" />
                            </div>
                            <div>
                                <h2 className="text-lg font-bold text-white">Alertas y Correos</h2>
                                <p className="text-gray-400 text-sm">Configuración de SMTP y avisos.</p>
                            </div>
                        </div>
                        <div className="space-y-4 max-w-xl">
                            <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10">
                                <div>
                                    <p className="font-medium text-white">Notificaciones por Email</p>
                                    <p className="text-xs text-gray-500">Enviar correos al registrar leads nuevos.</p>
                                </div>
                                <Switch
                                    checked={config.emailNotifications === true}
                                    onCheckedChange={(checked) => {
                                        handleChange('emailNotifications', checked);
                                        handleSave('emailNotifications', checked);
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                </TabsContent>

                {/* SECURITY */}
                <TabsContent value="security" className="space-y-4 mt-4">
                    <div className="bg-[#111111] border border-white/10 rounded-xl p-6">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="p-3 bg-red-500/10 rounded-lg">
                                <Shield className="w-6 h-6 text-red-500" />
                            </div>
                            <div>
                                <h2 className="text-lg font-bold text-white">Seguridad de la Cuenta</h2>
                                <p className="text-gray-400 text-sm">Cambiar contraseña de administrador.</p>
                            </div>
                        </div>

                        <div className="p-4 bg-yellow-900/20 border border-yellow-500/20 rounded-lg text-yellow-500 text-sm max-w-xl">
                            <Info className="w-4 h-4 inline-block mr-2" />
                            Para cambiar la contraseña de super administrador, por favor contacta directamente
                            a soporte técnico o usa la consola del servidor por seguridad.
                        </div>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
}
