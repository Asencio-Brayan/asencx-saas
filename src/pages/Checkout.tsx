import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight, CheckCircle, CreditCard, User, Building, Phone, Mail, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export function Checkout() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    // Query params
    const initialPlan = searchParams.get('plan') || '';
    const initialCycle = searchParams.get('cycle') || 'monthly';

    // If no plan is selected, redirect back to pricing
    useEffect(() => {
        if (!initialPlan) {
            navigate('/#precios');
        }
    }, [initialPlan, navigate]);

    const [step, setStep] = useState<1 | 2 | 3>(1);
    const [isLoading, setIsLoading] = useState(false);
    const [checkoutRequestId, setCheckoutRequestId] = useState<string | null>(null);

    // Form state
    const [formData, setFormData] = useState({
        fullName: '',
        company: '',
        whatsapp: '',
        email: '',
        industry: '',
        notes: '',
        planName: initialPlan,
        billingCycle: initialCycle.toUpperCase()
    });

    // Pricing calculation (hardcoded for now to match Landing changes)
    const getPrice = () => {
        const isAnnual = formData.billingCycle === 'ANNUAL';
        switch (formData.planName.toLowerCase()) {
            case 'starter': return isAnnual ? 190 : 19;
            case 'professional': return isAnnual ? 450 : 45;
            case 'enterprise': return isAnnual ? 890 : 89;
            default: return 0;
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleStep1Submit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/public/whatsapp-checkout/create`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    amountUsd: getPrice()
                })
            });

            if (res.ok) {
                const data = await res.json();
                setCheckoutRequestId(data.checkoutRequestId);
                setStep(2);
            } else {
                alert('Hubo un error al guardar tu información. Por favor, intenta de nuevo.');
            }
        } catch (error) {
            console.error('Error starting checkout:', error);
            alert('Error de conexión.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleWhatsAppRedirect = () => {
        if (!checkoutRequestId) return;
        setIsLoading(true);

        const COMPANY_WA = "51912345678"; // Edit this with the actual number
        const price = getPrice();
        const cycleText = formData.billingCycle === 'ANNUAL' ? 'Anual' : 'Mensual';

        const message = `Hola AsencX 👋 Quiero activar el plan ${formData.planName.toUpperCase()} (${cycleText}) por ${price} USD.
Nombre: ${formData.fullName}
Empresa: ${formData.company}
Mi WhatsApp: ${formData.whatsapp}
Correo: ${formData.email}
Rubro: ${formData.industry}
Lo que necesito: ${formData.notes || 'Ninguno'}
Código: ${checkoutRequestId}

¿Me envían los datos para pagar por Yape/Plin/Transferencia, por favor?`;

        const waLink = `https://wa.me/${COMPANY_WA}?text=${encodeURIComponent(message)}`;

        // Open WhatsApp in new tab
        window.open(waLink, '_blank');

        // Proceed to success screen
        setStep(3);
        setIsLoading(false);
    };

    if (!initialPlan) return null;

    return (
        <div className="min-h-screen bg-[#0A0A0A] font-sans text-gray-300 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
                {/* Header */}
                <div className="mb-8 flex items-center justify-between">
                    <Link to="/#precios" className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
                        <ArrowLeft className="w-5 h-5" />
                        <span>Volver a Planes</span>
                    </Link>
                    <div className="text-xl font-bold text-white">
                        Asenc<span className="text-[#00D9FF]">X</span> Checkout
                    </div>
                </div>

                {/* Stepper Display */}
                {step < 3 && (
                    <div className="flex items-center justify-center mb-12">
                        <div className={`flex items-center ${step >= 1 ? 'text-[#00D9FF]' : 'text-gray-600'}`}>
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${step >= 1 ? 'border-[#00D9FF] bg-[#00D9FF]/10' : 'border-gray-600'}`}>
                                1
                            </div>
                            <span className="ml-3 font-medium">Tus Datos</span>
                        </div>
                        <div className={`w-16 h-0.5 mx-4 ${step >= 2 ? 'bg-[#00D9FF]' : 'bg-gray-800'}`} />
                        <div className={`flex items-center ${step >= 2 ? 'text-[#00D9FF]' : 'text-gray-600'}`}>
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${step >= 2 ? 'border-[#00D9FF] bg-[#00D9FF]/10' : 'border-gray-600'}`}>
                                2
                            </div>
                            <span className="ml-3 font-medium">Pago</span>
                        </div>
                    </div>
                )}

                {/* Step 1: Form */}
                {step === 1 && (
                    <Card className="bg-[#111111] border-white/10 shadow-xl">
                        <CardContent className="p-6 md:p-8">
                            <h2 className="text-2xl font-bold text-white mb-6">Completa tus datos</h2>
                            <form onSubmit={handleStep1Submit} className="space-y-6">
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-400 flex items-center gap-2">
                                            <User className="w-4 h-4" /> Nombre Completo
                                        </label>
                                        <input
                                            required
                                            type="text"
                                            name="fullName"
                                            value={formData.fullName}
                                            onChange={handleInputChange}
                                            className="w-full bg-[#0A0A0A] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#00D9FF] transition-colors"
                                            placeholder="Ej. Juan Pérez"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-400 flex items-center gap-2">
                                            <Building className="w-4 h-4" /> Empresa
                                        </label>
                                        <input
                                            required
                                            type="text"
                                            name="company"
                                            value={formData.company}
                                            onChange={handleInputChange}
                                            className="w-full bg-[#0A0A0A] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#00D9FF] transition-colors"
                                            placeholder="Ej. Restaurante El Sabor"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-400 flex items-center gap-2">
                                            <Mail className="w-4 h-4" /> Correo Electrónico
                                        </label>
                                        <input
                                            required
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleInputChange}
                                            className="w-full bg-[#0A0A0A] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#00D9FF] transition-colors"
                                            placeholder="juan@empresa.com"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-400 flex items-center gap-2">
                                            <Phone className="w-4 h-4" /> WhatsApp
                                        </label>
                                        <input
                                            required
                                            type="tel"
                                            name="whatsapp"
                                            pattern="[0-9+]*"
                                            value={formData.whatsapp}
                                            onChange={handleInputChange}
                                            className="w-full bg-[#0A0A0A] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#00D9FF] transition-colors"
                                            placeholder="+51 987654321"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-400 flex items-center gap-2">
                                        <FileText className="w-4 h-4" /> Rubro del Negocio
                                    </label>
                                    <select
                                        required
                                        name="industry"
                                        value={formData.industry}
                                        onChange={handleInputChange}
                                        className="w-full bg-[#0A0A0A] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#00D9FF] transition-colors appearance-none"
                                    >
                                        <option value="" disabled>Selecciona una industria...</option>
                                        <option value="Restaurantes">Restaurantes</option>
                                        <option value="Hoteles">Hoteles</option>
                                        <option value="Academias">Academias</option>
                                        <option value="Almacenes">Almacenes</option>
                                        <option value="Otro">Otro</option>
                                    </select>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-400">¿Deseas dejarnos algún mensaje o requerimiento especial?</label>
                                    <textarea
                                        name="notes"
                                        value={formData.notes}
                                        onChange={handleInputChange}
                                        rows={3}
                                        className="w-full bg-[#0A0A0A] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#00D9FF] transition-colors resize-none"
                                        placeholder="Opcional..."
                                    />
                                </div>


                                <div className="bg-[#0A0A0A] p-4 rounded-lg border border-white/10 flex justify-between items-center">
                                    <div>
                                        <div className="text-sm text-gray-400">Plan seleccionado</div>
                                        <div className="text-lg font-bold text-white capitalize">{formData.planName} - {formData.billingCycle === 'ANNUAL' ? 'Anual' : 'Mensual'}</div>
                                    </div>
                                    <div className="text-2xl font-bold text-[#00D9FF]">${getPrice()} USD</div>
                                </div>

                                <Button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full h-12 bg-[#00D9FF] hover:bg-[#00D9FF]/80 text-black font-bold text-lg rounded-lg transition-colors"
                                >
                                    {isLoading ? 'Guardando...' : 'Continuar al Pago'}
                                    {!isLoading && <ArrowRight className="ml-2 w-5 h-5" />}
                                </Button>
                            </form>
                        </CardContent>
                    </Card>
                )}

                {/* Step 2: Payment (Stub) */}
                {step === 2 && (
                    <Card className="bg-[#111111] border-white/10 shadow-xl text-center">
                        <CardContent className="p-8">
                            <h2 className="text-2xl font-bold text-white mb-2">Pagar por WhatsApp</h2>
                            <p className="text-gray-400 mb-8">Revisa tu información antes de continuar a WhatsApp.</p>

                            <div className="bg-[#0A0A0A] rounded-xl p-6 border border-white/10 inline-block text-left mb-8 min-w-[300px]">
                                <div className="flex justify-between items-end mb-4 border-b border-white/10 pb-4">
                                    <div>
                                        <div className="text-sm text-[#00D9FF] font-bold mb-1">PLAN {formData.planName.toUpperCase()}</div>
                                        <div className="text-white">Suscripción {formData.billingCycle === 'ANNUAL' ? 'Anual' : 'Mensual'}</div>
                                    </div>
                                    <div className="text-3xl font-bold text-white">${getPrice()}</div>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-400">Total a pagar ahora:</span>
                                    <span className="text-white font-bold">${getPrice()} USD</span>
                                </div>
                            </div>

                            {formData.notes && (
                                <div className="bg-[#0A0A0A] rounded-xl p-4 border border-white/10 text-left mb-8 max-w-md mx-auto">
                                    <div className="text-sm text-gray-400 mb-1">Tus notas:</div>
                                    <div className="text-gray-300 text-sm italic">"{formData.notes}"</div>
                                </div>
                            )}

                            <Button
                                onClick={handleWhatsAppRedirect}
                                disabled={isLoading}
                                className="w-full h-14 bg-white text-black hover:bg-gray-200 font-bold text-lg rounded-xl transition-all hover:scale-[1.02] flex items-center justify-center gap-2"
                            >
                                <CreditCard className="w-6 h-6" />
                                {isLoading ? 'Procesando...' : 'Continuar por WhatsApp'}
                            </Button>
                            <p className="mt-4 text-xs text-gray-500">
                                Serás redirigido a WhatsApp con un mensaje pre-llenado para finalizar tu compra.
                            </p>
                        </CardContent>
                    </Card>
                )}

                {/* Step 3: Success */}
                {step === 3 && (
                    <Card className="bg-[#111111] border-[#00D9FF]/30 shadow-[0_0_30px_rgba(0,217,255,0.1)] text-center">
                        <CardContent className="p-12">
                            <div className="w-20 h-20 bg-[#00D9FF]/20 rounded-full flex items-center justify-center mx-auto mb-6">
                                <CheckCircle className="w-10 h-10 text-[#00D9FF]" />
                            </div>
                            <h2 className="text-3xl font-bold text-white mb-4">Listo ✅ Te derivamos a WhatsApp.</h2>
                            <p className="text-lg text-gray-400 mb-8">
                                Cuando realices el pago y envíes el comprobante, activaremos tu cuenta a la brevedad.
                            </p>
                            <Button
                                onClick={() => navigate('/')}
                                className="bg-[#0A0A0A] border border-white/20 text-white hover:bg-white/10"
                            >
                                Volver al Inicio
                            </Button>
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    );
}
