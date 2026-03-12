
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { industriesData } from '@/data/industries';
import type { IndustryData } from '@/data/industries';
import { SimpleNavbar } from '@/components/SimpleNavbar';
import { Button } from '@/components/ui/button';
import { ArrowLeft, CheckCircle, Rocket, Eye, Play, BarChart3 } from 'lucide-react';
import { LeadModal } from '@/components/LeadModal';
import { Badge } from '@/components/ui/badge';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"

export function IndustryDetailsPage() {
    const { slug } = useParams<{ slug: string }>();
    const navigate = useNavigate();
    const [data, setData] = useState<IndustryData | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        // Find data based on slug
        const found = industriesData.find(i => i.id === slug);
        if (found) {
            setData(found);
            window.scrollTo(0, 0); // Scroll to top on load
        } else {
            // Handle 404 - could redirect or show error.
            // For now, redirect to home if not found
            navigate('/');
        }
    }, [slug, navigate]);

    if (!data) return <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center text-white">Cargando...</div>;

    const HeroIcon = data.icon;

    return (
        <div className="min-h-screen bg-[#0A0A0A] font-sans text-white">
            <SimpleNavbar />
            <LeadModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />

            {/* Hero Section */}
            <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-[#111] to-[#0A0A0A] z-0" />
                {/* Gradient Blob */}
                <div className={`absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-br ${data.gradient} opacity-20 blur-[100px] rounded-full pointer-events-none`} />

                <div className="relative z-10 max-w-7xl mx-auto">
                    <Button variant="ghost" onClick={() => navigate('/')} className="mb-8 text-gray-400 hover:text-white pl-0 hover:bg-transparent">
                        <ArrowLeft className="mr-2 w-4 h-4" /> Volver a Inicio
                    </Button>

                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <div>
                            <div className={`inline-flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-full mb-6`}>
                                <HeroIcon className="w-5 h-5 text-white" />
                                <span className="text-gray-200 font-medium">Software para {data.title}</span>
                            </div>

                            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                                Gestión inteligente para tu <span className={`text-transparent bg-clip-text bg-gradient-to-r ${data.gradient}`}>{data.title.slice(0, -1)}</span>
                            </h1> {/* removing last 's' for singular-ish feel or just full title if preferred. Let's keep full title actually or generic */}

                            <p className="text-xl text-gray-400 mb-8 max-w-lg">
                                {data.subtitle}
                            </p>

                            <div className="flex flex-col sm:flex-row gap-4">
                                <Button
                                    size="lg"
                                    onClick={() => setIsModalOpen(true)}
                                    className="bg-white text-black hover:bg-gray-200 font-bold px-8"
                                >
                                    Prueba Gratis
                                    <Rocket className="ml-2 w-4 h-4" />
                                </Button>
                                <Button
                                    size="lg"
                                    variant="outline"
                                    onClick={() => {
                                        const demoSection = document.getElementById('demo');
                                        if (demoSection) demoSection.scrollIntoView({ behavior: 'smooth' });
                                        else navigate('/#demo');
                                    }}
                                    className="border-white/20 text-white hover:bg-white/10"
                                >
                                    <Eye className="mr-2 w-4 h-4" />
                                    Ver Demo
                                </Button>
                            </div>
                        </div>

                        <div className="relative">
                            <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-white/10 group">
                                <div className={`absolute inset-0 bg-gradient-to-br ${data.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />
                                <img
                                    src={data.heroImage}
                                    alt={data.title}
                                    className="w-full h-auto object-cover transform transition-transform duration-700 hover:scale-105"
                                    onError={(e) => {
                                        e.currentTarget.style.display = 'none';
                                        e.currentTarget.parentElement?.classList.add('h-64', 'bg-[#1a1a1a]', 'flex', 'items-center', 'justify-center');
                                    }}
                                />
                                {/* Fallback content if image fails (handled by class addition above, but adding icon here just in case) */}
                                <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Play className="w-16 h-16 text-white bg-black/50 rounded-full p-4 backdrop-blur-sm" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Benefits Grid */}
            <section className="py-20 bg-[#111111]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="p-8 bg-[#0A0A0A] rounded-2xl border border-white/10">
                            <Rocket className="w-10 h-10 text-emerald-400 mb-4" />
                            <h3 className="text-xl font-bold mb-2">Más Rapidez</h3>
                            <p className="text-gray-400">Automatiza tareas manuales y reduce tiempos de operación en un 40%.</p>
                        </div>
                        <div className="p-8 bg-[#0A0A0A] rounded-2xl border border-white/10">
                            <ToggleIcon className="w-10 h-10 text-blue-400 mb-4" />
                            {/* Note: Icon is generic, fixing import below */}
                            <h3 className="text-xl font-bold mb-2">Control Total</h3>
                            <p className="text-gray-400">Monitorea cada aspecto de tu negocio desde cualquier lugar.</p>
                        </div>
                        <div className="p-8 bg-[#0A0A0A] rounded-2xl border border-white/10">
                            <BarChart3 className="w-10 h-10 text-purple-400 mb-4" />
                            <h3 className="text-xl font-bold mb-2">Mejores Visiones</h3>
                            <p className="text-gray-400">Reportes detallados para tomar decisiones basadas en datos reales.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Modules Section */}
            <section className="py-24 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <Badge className={`bg-gradient-to-r ${data.gradient} text-white border-0 mb-4`}>Módulos Incluidos</Badge>
                        <h2 className="text-3xl sm:text-4xl font-bold">Todo lo que necesitas</h2>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {data.modules.map((mod, idx) => (
                            <div key={idx} className="bg-[#111] border border-white/10 p-6 rounded-2xl hover:border-white/30 transition-colors group">
                                <div className={`w-12 h-12 rounded-lg bg-white/5 flex items-center justify-center mb-4 group-hover:bg-white/10 transition-colors`}>
                                    <mod.icon className="w-6 h-6 text-white" />
                                </div>
                                <h3 className="text-lg font-bold mb-2">{mod.title}</h3>
                                <p className="text-gray-400 text-sm">{mod.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Features Checklist */}
            <section className="py-20 bg-[#111111]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <div>
                            <h2 className="text-3xl font-bold mb-6">Funcionalidades Clave</h2>
                            <div className="grid sm:grid-cols-2 gap-4">
                                {data.features.map((feat, idx) => (
                                    <div key={idx} className="flex items-center gap-3">
                                        <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                                        <span className="text-gray-300">{feat}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                        {/* Mockup or Visual */}
                        <div className="bg-[#0A0A0A] p-8 rounded-3xl border border-white/10 flex items-center justify-center min-h-[300px]">
                            <div className="text-center">
                                <HeroIcon className="w-24 h-24 text-white/10 mx-auto mb-4" />
                                <p className="text-gray-500">Interfaz Intuitiva y Moderna</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* FAQ */}
            <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
                <h2 className="text-3xl font-bold text-center mb-12">Preguntas Frecuentes</h2>
                <Accordion type="single" collapsible className="w-full">
                    {data.faqs.map((faq, idx) => (
                        <AccordionItem key={idx} value={`item-${idx}`} className="border-white/10">
                            <AccordionTrigger className="text-lg hover:text-[#00D9FF]">{faq.question}</AccordionTrigger>
                            <AccordionContent className="text-gray-400 text-base">
                                {faq.answer}
                            </AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>
            </section>

            {/* Bottom CTA */}
            <section className="py-24 bg-gradient-to-b from-[#111] to-[#000] border-t border-white/10 text-center px-4">
                <div className="max-w-3xl mx-auto">
                    <h2 className="text-4xl font-bold mb-6">¿Listo para transformar tu {data.title}?</h2>
                    <p className="text-xl text-gray-400 mb-10">
                        Únete a cientos de negocios que ya usan AsencX para crecer.
                    </p>
                    <div className="flex flex-col sm:flex-row justify-center gap-4">
                        <Button
                            size="lg"
                            onClick={() => setIsModalOpen(true)}
                            className="bg-white text-black hover:bg-gray-200 font-bold px-10 h-14 text-lg"
                        >
                            Comenzar Prueba Gratis
                        </Button>
                    </div>
                </div>
            </section>
        </div>
    );
}

// Helper for detail icon
function ToggleIcon(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <rect width="20" height="12" x="2" y="6" rx="2" />
            <path d="M12 12h.01" />
        </svg>
    )
}
