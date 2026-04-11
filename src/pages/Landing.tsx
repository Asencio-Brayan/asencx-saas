import { useEffect, useState, useRef } from 'react';
<<<<<<< HEAD
import { useNavigate, Link } from 'react-router-dom';
import {
    Menu, X, Star, CheckCircle,
    Users, TrendingUp,
    Phone, Mail,
    ArrowRight, BarChart3, CreditCard, Clock,
    Award, Lock, Headphones, Rocket, Eye,
    Facebook, Instagram
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { DemoSystem } from '@/components/DemoSystem';
import { LeadModal } from '@/components/LeadModal';
import { IndustrySolutions } from '@/components/IndustrySolutions';
import { ContactChooserDialog } from '@/components/ContactChooserDialog';

// Animated Counter Component
function AnimatedCounter({ end, duration = 2000, suffix = '' }: { end: number; duration?: number; suffix?: string }) {
    const [count, setCount] = useState(0);
    const [isVisible, setIsVisible] = useState(false);
    const ref = useRef<HTMLSpanElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting && !isVisible) {
                    setIsVisible(true);
                }
            },
            { threshold: 0.5 }
        );

        if (ref.current) {
            observer.observe(ref.current);
        }

        return () => observer.disconnect();
    }, [isVisible]);

    useEffect(() => {
        if (!isVisible) return;

        let startTime: number;
        const animate = (currentTime: number) => {
            if (!startTime) startTime = currentTime;
            const progress = Math.min((currentTime - startTime) / duration, 1);

            const easeOutQuart = 1 - Math.pow(1 - progress, 4);
            setCount(Math.floor(easeOutQuart * end));

            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };

        requestAnimationFrame(animate);
    }, [isVisible, end, duration]);

    return <span ref={ref}>{count.toLocaleString()}{suffix}</span>;
}

// Particle Background Component
=======
import { Menu, X, ArrowRight, TrendingUp, MonitorSmartphone, Rocket, Star, Code, Zap, CheckCircle, MessagesSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FloatingWhatsApp } from '@/components/FloatingWhatsApp';
import { Link } from 'react-router-dom';

// Número oficial de WhatsApp
const WHATSAPP_NUMBER = "51950332872";

// Componentes de Animación Básicos
function ScrollReveal({ children, delay = 0, direction = 'up' }: { children: React.ReactNode; delay?: number; direction?: 'up'|'down'|'left'|'right' }) {
    const [isVisible, setIsVisible] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => { if (entry.isIntersecting) { setIsVisible(true); } },
            { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
        );
        if (ref.current) { observer.observe(ref.current); }
        return () => observer.disconnect();
    }, []);

    const getTransform = () => {
        switch (direction) {
            case 'up': return 'translateY(40px)';
            case 'down': return 'translateY(-40px)';
            case 'left': return 'translateX(40px)';
            case 'right': return 'translateX(-40px)';
            default: return 'translateY(40px)';
        }
    };

    return (
        <div
            ref={ref}
            className="transition-all duration-700 ease-in-out"
            style={{
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? 'translate(0)' : getTransform(),
                transitionDelay: `${delay}ms`
            }}
        >
            {children}
        </div>
    );
}

>>>>>>> 952feead (Landing optimizada sin login, enfocada en conversion)
function ParticleBackground() {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let animationId: number;
<<<<<<< HEAD
        let particles: Array<{
            x: number;
            y: number;
            vx: number;
            vy: number;
            radius: number;
            opacity: number;
        }> = [];
=======
        let particles: Array<{ x: number, y: number, vx: number, vy: number, radius: number, opacity: number }> = [];
>>>>>>> 952feead (Landing optimizada sin login, enfocada en conversion)

        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };

        const createParticles = () => {
            particles = [];
            const particleCount = Math.min(50, Math.floor(window.innerWidth / 30));
            for (let i = 0; i < particleCount; i++) {
                particles.push({
                    x: Math.random() * canvas.width,
                    y: Math.random() * canvas.height,
                    vx: (Math.random() - 0.5) * 0.5,
                    vy: (Math.random() - 0.5) * 0.5,
                    radius: Math.random() * 2 + 1,
                    opacity: Math.random() * 0.5 + 0.2
                });
            }
        };

        const drawParticles = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
<<<<<<< HEAD

=======
>>>>>>> 952feead (Landing optimizada sin login, enfocada en conversion)
            particles.forEach((particle, i) => {
                particle.x += particle.vx;
                particle.y += particle.vy;

                if (particle.x < 0) particle.x = canvas.width;
                if (particle.x > canvas.width) particle.x = 0;
                if (particle.y < 0) particle.y = canvas.height;
                if (particle.y > canvas.height) particle.y = 0;

                ctx.beginPath();
                ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(0, 217, 255, ${particle.opacity})`;
                ctx.fill();

                particles.slice(i + 1).forEach((other) => {
                    const dx = particle.x - other.x;
                    const dy = particle.y - other.y;
                    const distance = Math.sqrt(dx * dx + dy * dy);

<<<<<<< HEAD
                    if (distance < 150) {
                        ctx.beginPath();
                        ctx.moveTo(particle.x, particle.y);
                        ctx.lineTo(other.x, other.y);
                        ctx.strokeStyle = `rgba(0, 217, 255, ${0.1 * (1 - distance / 150)})`;
=======
                    if (distance < 180) {
                        ctx.beginPath();
                        ctx.moveTo(particle.x, particle.y);
                        ctx.lineTo(other.x, other.y);
                        ctx.strokeStyle = `rgba(0, 217, 255, ${0.12 * (1 - distance / 180)})`;
>>>>>>> 952feead (Landing optimizada sin login, enfocada en conversion)
                        ctx.lineWidth = 1;
                        ctx.stroke();
                    }
                });
            });

            animationId = requestAnimationFrame(drawParticles);
        };

        resize();
        createParticles();
        drawParticles();

        window.addEventListener('resize', () => {
            resize();
            createParticles();
        });

<<<<<<< HEAD
        return () => {
            cancelAnimationFrame(animationId);
        };
=======
        return () => { cancelAnimationFrame(animationId); window.removeEventListener('resize', resize); };
>>>>>>> 952feead (Landing optimizada sin login, enfocada en conversion)
    }, []);

    return (
        <canvas
            ref={canvasRef}
<<<<<<< HEAD
            className="absolute inset-0 pointer-events-none"
=======
            className="absolute inset-0 pointer-events-none opacity-60"
>>>>>>> 952feead (Landing optimizada sin login, enfocada en conversion)
            style={{ zIndex: 1 }}
        />
    );
}

<<<<<<< HEAD
// Scroll Reveal Component
function ScrollReveal({
    children,
    delay = 0,
    direction = 'up'
}: {
    children: React.ReactNode;
    delay?: number;
    direction?: 'up' | 'down' | 'left' | 'right';
}) {
    const [isVisible, setIsVisible] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                }
            },
            { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
        );

        if (ref.current) {
            observer.observe(ref.current);
        }

        return () => observer.disconnect();
    }, []);

    const getTransform = () => {
        switch (direction) {
            case 'up': return 'translateY(40px)';
            case 'down': return 'translateY(-40px)';
            case 'left': return 'translateX(40px)';
            case 'right': return 'translateX(-40px)';
        }
    };

    return (
        <div
            ref={ref}
            className="transition-all duration-700 ease-out"
            style={{
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? 'translate(0)' : getTransform(),
                transitionDelay: `${delay}ms`
            }}
        >
            {children}
        </div>
    );
}

export function Landing() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [pricingMode, setPricingMode] = useState<'monthly' | 'annual'>('monthly');
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const navigate = useNavigate();
=======
export function Landing() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
>>>>>>> 952feead (Landing optimizada sin login, enfocada en conversion)

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

<<<<<<< HEAD
    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            setMousePosition({ x: e.clientX, y: e.clientY });
        };
        window.addEventListener('mousemove', handleMouseMove, { passive: true });
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

=======
>>>>>>> 952feead (Landing optimizada sin login, enfocada en conversion)
    const scrollToSection = (id: string) => {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
            setMobileMenuOpen(false);
        }
    };

<<<<<<< HEAD
    const features = [
        {
            icon: BarChart3,
            title: 'Dashboard en Tiempo Real',
            description: 'Visualiza tus ventas, inventario y métricas clave al instante. Toma decisiones informadas.'
        },
        {
            icon: CreditCard,
            title: 'Pagos Integrados',
            description: 'Acepta tarjetas, transferencias y efectivo. Todo sincronizado con tu contabilidad.'
        },
        {
            icon: Users,
            title: 'Gestión de Clientes',
            description: 'CRM integrado para conocer a tus clientes, su historial y fidelizarlos.'
        },
        {
            icon: TrendingUp,
            title: 'Reportes Avanzados',
            description: 'Análisis detallado de ventas, productos estrella y tendencias de tu negocio.'
        },
        {
            icon: Lock,
            title: 'Seguridad Empresarial',
            description: 'Tus datos protegidos con encriptación SSL y respaldos automáticos diarios.'
        },
        {
            icon: Headphones,
            title: 'Soporte 24/7',
            description: 'Equipo de soporte en español listo para ayudarte cuando lo necesites.'
        }
    ];

    const testimonials = [
        {
            name: 'María González',
            role: 'Dueña, Restaurante El Sabor',
            content: 'AsencX transformó nuestro restaurante. El sistema web es súper intuitivo y ahora atendemos el doble de clientes.',
            rating: 5,
            location: 'Ciudad de México'
        },
        {
            name: 'Luis Ramírez',
            role: 'Administrador, Restaurante Sabor Criollo',
            content: 'Las reservas online aumentaron 150%. El sistema es rápido, fácil de usar y el soporte responde al instante. Ahora gestionamos todo desde un solo panel.',
            rating: 5,
            location: 'Lima, Perú'
        },
        {
            name: 'Ana Lucía Torres',
            role: 'Directora, Academia de Idiomas',
            content: 'Finalmente tenemos control total. La automatización de pagos nos ahorra horas de trabajo cada semana.',
            rating: 5,
            location: 'Bogotá, Colombia'
        },
    ];

    const [pricingPlans] = useState([
        {
            name: 'Starter',
            slug: 'starter',
            monthlyPrice: 19,
            annualPrice: 190,
            description: 'Ideal para empezar',
            features: [
                'Hasta 1,500 transacciones/mes',
                '2 usuarios',
                'Punto de Venta + Inventario básico',
                'Reportes básicos (ventas diarias)',
                'Soporte por email (48h)',
                'App web responsive'
            ],
            highlighted: false
        },
        {
            name: 'Professional',
            slug: 'professional',
            monthlyPrice: 45,
            annualPrice: 450,
            description: 'Plan más popular',
            features: [
                'Transacciones ilimitadas',
                '6 usuarios',
                'POS + Inventario avanzado + Caja',
                'Reportes avanzados (por producto, categorías, fechas)',
                'Roles y permisos',
                'Soporte prioritario (24h)',
                'Integración básica (exportación/CSV)'
            ],
            highlighted: true
        },
        {
            name: 'Enterprise',
            slug: 'enterprise',
            monthlyPrice: 89,
            annualPrice: 890,
            description: 'Para grandes negocios',
            features: [
                'Transacciones ilimitadas',
                'Usuarios ilimitados',
                'Multi-sucursal',
                'Reportes premium (comparativas, productividad)',
                'Auditoría/bitácora',
                'Soporte dedicado (WhatsApp + email)',
                'Personalización ligera de marca (logo + colores)'
            ],
            highlighted: false
        }
    ]);

    // Removed the dynamic DB plan fetch temporarily per user specs 
    // It's commented out/deleted here so the hardcoded plans directly satisfy the UX rules.

    const stats = [
        { value: 2500, suffix: '+', label: 'Negocios Activos' },
        { value: 15, suffix: 'M+', label: 'Transacciones Procesadas' },
        { value: 98, suffix: '%', label: 'Clientes Satisfechos' },
        { value: 12, suffix: '', label: 'Países LATAM' }
    ];

    return (
        <div className="min-h-screen bg-[#0A0A0A] font-sans overflow-x-hidden">
            <LeadModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
            {/* Navigation */}
            <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${isScrolled ? 'bg-[#0A0A0A]/95 backdrop-blur-lg border-b border-white/10' : 'bg-transparent'
                }`}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16 lg:h-20">
                        {/* Logo */}
                        <div className="flex items-center gap-2 group cursor-pointer">
                            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center transform group-hover:rotate-12 transition-transform duration-300">
                                <span className="text-black font-bold text-xl">A</span>
                            </div>
                            <span className="text-2xl font-bold text-white">
=======
    const handleWhatsAppClick = () => {
        const message = encodeURIComponent("¡Hola AsencX! Estoy interesado en potenciar mi negocio mediante un desarrollo digital y me gustaría recibir asesoría.");
        window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${message}`, "_blank");
    };

    const services = [
        {
            icon: Code,
            title: 'Desarrollo Web Premium',
            description: 'Sitios web institucionales y landing pages con diseño inmersivo y velocidad de carga excepcional.'
        },
        {
            icon: Zap,
            title: 'Sistemas de Automatización',
            description: 'Herramientas digitales que reducen tareas manuales y procesan tus ventas de forma constante.'
        },
        {
            icon: MonitorSmartphone,
            title: 'Digitalización Empresarial',
            description: 'Plataformas estructuradas a medida para la gestión operativa en hotelería, gastronomía y comercio.'
        }
    ];

    const benefits = [
        { icon: TrendingUp, title: 'Conversión Acelerada', description: 'Atrae clientes potenciales y guía su interés mediante una arquitectura persuasiva y de fácil navegación.' },
        { icon: Rocket, title: 'Operación Autómata', description: 'Delega el trabajo repetitivo al ecosistema digital, liberando valioso tiempo operativo para tu equipo.' },
        { icon: CheckCircle, title: 'Presencia Imparable', description: 'Transmite máxima autoridad y confianza en tu rubro gracias a un diseño de vanguardia y rendimiento técnico.' },
        { icon: Star, title: 'Crecimiento Escalable', description: 'Plataformas sólidas creadas para soportar el aumento de tu tráfico y demanda sin limitaciones ocultas.' }
    ];

    const testimonials = [
        {
            content: "Nuestra imagen dio un giro total. Gracias a la reestructuración digital, nuestra captación de reservas aumentó exponencialmente en el primer mes.",
            name: "Diego Sánchez",
            role: "Gerente Operativo"
        },
        {
            content: "AsencX comprende a la perfección lo que necesita tu empresa: velocidad, estética impecable y un flujo que de verdad convierta visitas en ventas reales.",
            name: "Laura Gómez",
            role: "Directora Comercial"
        },
        {
            content: "Definitivamente un antes y un después para nuestra marca. El sistema corre sin interrupciones y su impacto fue inmediato.",
            name: "Carlos Mendoza",
            role: "CEO y Emprendedor"
        }
    ];

    return (
        <div className="min-h-screen bg-[#0A0A0A] font-sans overflow-x-hidden selection:bg-[#00D9FF] selection:text-black snap-y snap-proximity">
            <FloatingWhatsApp />

            {/* Navbar */}
            <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-in-out ${isScrolled ? 'bg-[#0A0A0A]/90 backdrop-blur-xl border-b border-white/5 py-4 shadow-lg' : 'bg-transparent py-6'}`}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between">
                        {/* Logo */}
                        <div className="flex items-center gap-3 group cursor-pointer" onClick={() => window.scrollTo(0, 0)}>
                            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center transform group-hover:rotate-[15deg] group-hover:scale-105 transition-all duration-300 shadow-[0_0_15px_rgba(255,255,255,0.2)]">
                                <span className="text-black font-black text-xl">A</span>
                            </div>
                            <span className="text-2xl font-bold text-white tracking-tight">
>>>>>>> 952feead (Landing optimizada sin login, enfocada en conversion)
                                Asenc<span className="text-[#00D9FF]">X</span>
                            </span>
                        </div>

                        {/* Desktop Navigation */}
<<<<<<< HEAD
                        <div className="hidden lg:flex items-center gap-8">
                            {['Soluciones', 'Demo', 'Características', 'Precios', 'Testimonios'].map((item) => (
                                <button
                                    key={item}
                                    onClick={() => scrollToSection(item.toLowerCase())}
                                    className="relative text-sm font-medium transition-all duration-300 hover:text-[#00D9FF] group text-gray-300"
                                >
                                    {item}
                                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#00D9FF] transition-all duration-300 group-hover:w-full" />
=======
                        <div className="hidden lg:flex items-center gap-10">
                            {['Servicios', 'Impacto', 'Portafolio', 'Resultados'].map((item) => (
                                <button
                                    key={item}
                                    onClick={() => scrollToSection(item.toLowerCase() === 'impacto' ? 'beneficios' : item.toLowerCase() === 'resultados' ? 'testimonios' : item.toLowerCase())}
                                    className="relative text-sm font-semibold tracking-wide transition-all duration-300 hover:text-[#00D9FF] group text-gray-300 uppercase"
                                >
                                    {item}
                                    <span className="absolute -bottom-2 left-0 w-0 h-[2px] bg-[#00D9FF] transition-all duration-300 ease-out group-hover:w-full" />
>>>>>>> 952feead (Landing optimizada sin login, enfocada en conversion)
                                </button>
                            ))}
                        </div>

                        {/* CTA Buttons */}
                        <div className="hidden lg:flex items-center gap-4">
                            <Button
<<<<<<< HEAD
                                variant="ghost"
                                onClick={() => navigate('/login')}
                                className="text-gray-300 hover:text-white hover:bg-white/10"
                            >
                                Iniciar Sesión
                            </Button>
                            <Button
                                onClick={() => setIsModalOpen(true)}
                                className="bg-white text-black hover:bg-gray-200 font-semibold transition-all duration-300 hover:-translate-y-0.5">
                                Prueba Gratis
=======
                                onClick={handleWhatsAppClick}
                                className="bg-[#00D9FF] text-black hover:bg-white hover:text-black font-bold transition-all duration-500 hover:-translate-y-1 rounded-full px-8 py-5 h-auto text-sm tracking-wide shadow-[0_0_20px_rgba(0,217,255,0.2)] hover:shadow-[0_0_25px_rgba(255,255,255,0.4)]">
                                <MessagesSquare className="w-5 h-5 mr-2" />
                                Iniciar Proyecto
>>>>>>> 952feead (Landing optimizada sin login, enfocada en conversion)
                            </Button>
                        </div>

                        {/* Mobile Menu Button */}
                        <button
                            className="lg:hidden p-2 rounded-lg hover:bg-white/10 transition-colors"
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
<<<<<<< HEAD
                        >
                            {mobileMenuOpen ? <X className="text-white" /> : <Menu className="text-white" />}
=======
                            aria-label="Abrir menú"
                        >
                            {mobileMenuOpen ? <X className="text-white w-6 h-6" /> : <Menu className="text-white w-6 h-6" />}
>>>>>>> 952feead (Landing optimizada sin login, enfocada en conversion)
                        </button>
                    </div>
                </div>

                {/* Mobile Menu Overlay */}
<<<<<<< HEAD
                <div
                    className={`lg:hidden fixed inset-0 top-[64px] bg-[#0A0A0A] z-40 transition-all duration-300 flex flex-col ${mobileMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'
                        }`}
                >
                    <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4">
                        {['Soluciones', 'Demo', 'Características', 'Precios', 'Testimonios'].map((item) => (
                            <button
                                key={item}
                                onClick={() => scrollToSection(item.toLowerCase())}
                                className="block w-full text-left py-4 text-xl text-gray-300 font-medium hover:text-[#00D9FF] border-b border-white/5 last:border-0"
=======
                <div className={`lg:hidden absolute top-full left-0 right-0 bg-[#0A0A0A]/95 backdrop-blur-2xl border-b border-white/10 overflow-hidden transition-all duration-500 ease-in-out ${mobileMenuOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}>
                    <div className="px-6 py-8 space-y-2">
                        {['Servicios', 'Impacto', 'Portafolio', 'Resultados'].map((item) => (
                            <button
                                key={item}
                                onClick={() => scrollToSection(item.toLowerCase() === 'impacto' ? 'beneficios' : item.toLowerCase() === 'resultados' ? 'testimonios' : item.toLowerCase())}
                                className="block w-full text-left py-4 text-xl text-gray-200 font-semibold hover:text-[#00D9FF] border-b border-white/5 uppercase tracking-wide"
>>>>>>> 952feead (Landing optimizada sin login, enfocada en conversion)
                            >
                                {item}
                            </button>
                        ))}
<<<<<<< HEAD
                    </div>

                    <div className="bg-[#111111] border-t border-white/10 p-4 space-y-3 pb-[calc(1rem+env(safe-area-inset-bottom))]">
                        <Button
                            variant="outline"
                            className="w-full border-white/20 text-white h-12 text-base"
                            onClick={() => navigate('/login')}
                        >
                            Iniciar Sesión
                        </Button>
                        <Button
                            onClick={() => setIsModalOpen(true)}
                            className="w-full bg-white text-black font-bold h-12 text-base hover:bg-gray-200">
                            Prueba Gratis
=======
                        <Button
                            onClick={handleWhatsAppClick}
                            className="w-full bg-[#00D9FF] text-black font-bold h-14 text-lg hover:bg-white rounded-xl mt-6 shadow-[0_0_20px_rgba(0,217,255,0.3)]">
                            <MessagesSquare className="w-5 h-5 mr-3" />
                            Hablemos Ahora
>>>>>>> 952feead (Landing optimizada sin login, enfocada en conversion)
                        </Button>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
<<<<<<< HEAD
            <section className="relative min-h-screen flex items-center overflow-hidden bg-[#0A0A0A]">
                <div className="absolute inset-0">
                    <div className="absolute inset-0 bg-gradient-to-br from-[#0A0A0A] via-[#111111] to-[#0A0A0A]" />
                </div>

                <ParticleBackground />

                <div
                    className="absolute w-96 h-96 rounded-full pointer-events-none transition-opacity duration-300"
                    style={{
                        background: 'radial-gradient(circle, rgba(0, 217, 255, 0.1) 0%, transparent 70%)',
                        left: mousePosition.x - 192,
                        top: mousePosition.y - 192,
                        zIndex: 2
                    }}
                />

                <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <div className="space-y-8">
                            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-full">
                                <Rocket className="w-4 h-4 text-[#00D9FF]" />
                                <span className="text-gray-300 text-sm font-medium">Soluciones Web para LATAM</span>
                            </div>

                            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight">
                                Resolvemos tus{' '}
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-[#00D9FF] to-[#8B5CF6]">
                                    Problemas de Ventas
                                </span>
                            </h1>

                            <p className="text-lg sm:text-xl text-gray-400 max-w-xl">
                                No vendemos apps. Creamos <strong className="text-white">sistemas web y software</strong> a medida
                                para restaurantes, hoteles, academias y almacenes en Latinoamérica.
                            </p>

                            <div className="flex flex-col sm:flex-row gap-4">
                                <Button
                                    size="lg"
                                    onClick={() => setIsModalOpen(true)}
                                    className="bg-white text-black hover:bg-gray-200 px-8 font-semibold transition-all duration-300 hover:-translate-y-1 group"
                                >
                                    Comenzar Prueba Gratis
                                    <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </Button>
                                <Button
                                    size="lg"
                                    variant="outline"
                                    className="border-white/30 text-white hover:bg-white/10 group"
                                    onClick={() => scrollToSection('demo')}
                                >
                                    <Eye className="mr-2 w-5 h-5" />
                                    Ver Demo en Vivo
                                </Button>
                            </div>

                            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                                {['Sin tarjeta de crédito', '14 días gratis', 'Cancela cuando quieras'].map((item, i) => (
                                    <div key={i} className="flex items-center gap-2">
                                        <CheckCircle className="w-5 h-5 text-[#00D9FF]" />
                                        <span>{item}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="hidden lg:block relative">
                            <div className="relative transform hover:scale-105 transition-transform duration-500">
                                <img
                                    src="/dashboard-3d.jpg"
                                    alt="Dashboard"
                                    className="rounded-2xl shadow-2xl shadow-[#00D9FF]/10"
                                />
                                <div className="absolute -top-4 -right-4 bg-[#00D9FF] text-black px-4 py-2 rounded-full text-sm font-bold shadow-lg animate-bounce">
                                    +150% Ventas
                                </div>
                                <div className="absolute -bottom-4 -left-4 bg-white text-black px-4 py-2 rounded-full text-sm font-bold shadow-lg animate-pulse">
                                    En Tiempo Real
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10">
                    <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
                        <div className="w-1.5 h-3 bg-white/60 rounded-full mt-2 animate-bounce" />
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="py-20 bg-[#0A0A0A] border-y border-white/5">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                        {stats.map((stat, index) => (
                            <ScrollReveal key={index} delay={index * 100}>
                                <div className="text-center group hover:transform hover:scale-105 transition-transform duration-300">
                                    <div className="text-4xl lg:text-5xl font-bold text-white mb-2">
                                        <AnimatedCounter end={stat.value} suffix={stat.suffix} />
                                    </div>
                                    <div className="text-gray-500">{stat.label}</div>
                                </div>
                            </ScrollReveal>
                        ))}
                    </div>
                </div>
            </section>

            {/* Demo Section */}
            <section id="demo" className="py-24 bg-[#0A0A0A]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <ScrollReveal>
                        <div className="text-center max-w-3xl mx-auto mb-12">
                            <Badge className="bg-[#00D9FF]/10 text-[#00D9FF] border-[#00D9FF]/30 mb-4">Demo Interactivo</Badge>
                            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                                Prueba el sistema ahora mismo
                            </h2>
                            <p className="text-lg text-gray-400">
                                Explora nuestra interfaz sin necesidad de registro.
                                Haz clic en los productos, navega entre pestañas y experimenta la facilidad de uso.
                            </p>
=======
            <section className="relative min-h-screen flex items-center justify-center pt-24 pb-12 overflow-hidden bg-[#0A0A0A] snap-start">
                <div className="absolute inset-0">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-[#00D9FF]/15 via-[#0A0A0A] to-[#0A0A0A]" />
                </div>
                <ParticleBackground />

                <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mt-10 lg:mt-0">
                    <ScrollReveal delay={100}>
                        <div className="inline-flex items-center gap-3 px-5 py-2.5 bg-white/5 border border-white/10 rounded-full mb-10 backdrop-blur-md shadow-xl hover:bg-white/10 transition-colors">
                            <span className="w-2.5 h-2.5 rounded-full bg-[#00D9FF] shadow-[0_0_8px_#00D9FF] animate-pulse" />
                            <span className="text-gray-200 text-xs sm:text-sm font-bold tracking-widest uppercase">Evolución Digital para tu Empresa</span>
>>>>>>> 952feead (Landing optimizada sin login, enfocada en conversion)
                        </div>
                    </ScrollReveal>

                    <ScrollReveal delay={200}>
<<<<<<< HEAD
                        <DemoSystem />
=======
                        <h1 className="text-5xl sm:text-7xl lg:text-[5.5rem] font-black text-white leading-[1.1] mb-8 tracking-tight">
                            Diseñamos ecosistemas<br className="hidden lg:block"/>
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00D9FF] via-[#5DE0E6] to-[#8B5CF6] drop-shadow-[0_0_40px_rgba(0,217,255,0.15)] relative">
                                para multiplicar ventas
                                <svg className="absolute w-full h-4 -bottom-2 left-0 text-[#00D9FF]/50" viewBox="0 0 100 20" preserveAspectRatio="none">
                                    <path d="M0,10 Q50,20 100,10" fill="transparent" stroke="currentColor" strokeWidth="4" />
                                </svg>
                            </span>
                        </h1>
                    </ScrollReveal>

                    <ScrollReveal delay={300}>
                        <p className="text-lg sm:text-2xl text-gray-400 max-w-3xl mx-auto mb-14 font-medium leading-relaxed">
                            Vamos más allá de una página web tradicional. Construimos herramientas y experiencias digitales pulidas que capturan, retienen y convierten visitantes en clientes de alto valor.
                        </p>
                    </ScrollReveal>

                    <ScrollReveal delay={400}>
                        <div className="flex flex-col sm:flex-row gap-5 justify-center items-center">
                            <Button
                                size="lg"
                                onClick={handleWhatsAppClick}
                                className="bg-[#00D9FF] text-black hover:bg-white px-10 py-7 h-auto text-lg font-black rounded-full transition-all duration-500 hover:scale-105 shadow-[0_0_30px_rgba(0,217,255,0.3)] group w-full sm:w-auto"
                            >
                                <MessagesSquare className="mr-3 w-6 h-6 group-hover:scale-110 transition-transform" />
                                Iniciar Asesoría Gratis
                            </Button>
                            <Button
                                size="lg"
                                variant="outline"
                                className="border-white/20 text-white bg-black/40 backdrop-blur-sm hover:bg-white/10 px-10 py-7 h-auto text-lg font-bold rounded-full group w-full sm:w-auto transition-all"
                                onClick={() => scrollToSection('portafolio')}
                            >
                                Ver Proyectos Reales
                                <ArrowRight className="ml-3 w-5 h-5 group-hover:translate-x-1.5 transition-transform" />
                            </Button>
                        </div>
>>>>>>> 952feead (Landing optimizada sin login, enfocada en conversion)
                    </ScrollReveal>
                </div>
            </section>

<<<<<<< HEAD
            {/* Solutions Section */}
            <IndustrySolutions />

            {/* Features Section */}
            <section id="características" className="py-24 bg-[#0A0A0A] relative overflow-hidden">
                <div className="absolute top-0 right-0 w-96 h-96 bg-[#00D9FF]/5 rounded-full blur-3xl" />
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#8B5CF6]/5 rounded-full blur-3xl" />

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
                    <ScrollReveal>
                        <div className="text-center max-w-3xl mx-auto mb-16">
                            <Badge className="bg-[#8B5CF6]/10 text-[#8B5CF6] border-[#8B5CF6]/30 mb-4">Características</Badge>
                            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                                Todo lo que necesitas para vender más
                            </h2>
                            <p className="text-lg text-gray-400">
                                Herramientas potentes diseñadas para simplificar tus operaciones y maximizar tus resultados.
                            </p>
                        </div>
                    </ScrollReveal>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {features.map((feature, index) => (
                            <ScrollReveal key={index} delay={index * 100}>
                                <div className="group p-8 rounded-2xl bg-[#111111] border border-white/10 hover:border-[#00D9FF]/50 transition-all duration-500 hover:shadow-xl hover:-translate-y-2">
                                    <div className="w-14 h-14 bg-white rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300">
                                        <feature.icon className="w-7 h-7 text-black" />
                                    </div>
                                    <h3 className="text-xl font-bold text-white mb-3 group-hover:text-[#00D9FF] transition-colors">
                                        {feature.title}
                                    </h3>
                                    <p className="text-gray-400">{feature.description}</p>
=======
            {/* Services Section */}
            <section id="servicios" className="py-32 relative bg-[#0A0A0A] border-t border-white/5 snap-start">
                <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-[#00D9FF]/5 rounded-full blur-[100px] pointer-events-none" />
                
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <ScrollReveal>
                        <div className="text-center max-w-4xl mx-auto mb-24">
                            <Badge className="bg-[#00D9FF]/10 text-[#00D9FF] border-[#00D9FF]/20 mb-6 text-sm px-5 py-1.5 font-bold tracking-widest uppercase">Expertise Técnico</Badge>
                            <h2 className="text-4xl sm:text-6xl font-black text-white mb-8 tracking-tight">Servicios de Categoría Premium</h2>
                            <p className="text-xl sm:text-2xl text-gray-400 font-medium">Arquitectura digital avanzada diseñada para posicionar tu marca en la cima de tu sector.</p>
                        </div>
                    </ScrollReveal>

                    <div className="grid md:grid-cols-3 gap-8 sm:gap-10">
                        {services.map((service, index) => (
                            <ScrollReveal key={index} delay={index * 150}>
                                <div className="group p-10 rounded-[2rem] bg-[#111111]/80 backdrop-blur-xl border border-white/5 hover:border-[#00D9FF]/40 transition-all duration-500 hover:shadow-[0_20px_50px_rgba(0,217,255,0.07)] hover:-translate-y-3 h-full relative overflow-hidden">
                                    <div className="absolute inset-0 bg-gradient-to-br from-[#00D9FF]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                    <div className="w-20 h-20 bg-black border border-white/10 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-[#00D9FF] transition-colors duration-500 relative z-10 group-hover:shadow-[0_0_20px_rgba(0,217,255,0.4)]">
                                        <service.icon className="w-10 h-10 text-white group-hover:text-black transition-colors" />
                                    </div>
                                    <h3 className="text-2xl sm:text-3xl font-bold text-white mb-5 relative z-10">{service.title}</h3>
                                    <p className="text-gray-400 text-lg leading-relaxed relative z-10">{service.description}</p>
>>>>>>> 952feead (Landing optimizada sin login, enfocada en conversion)
                                </div>
                            </ScrollReveal>
                        ))}
                    </div>
                </div>
            </section>

<<<<<<< HEAD
            {/* Pricing Section */}
            <section id="precios" className="py-24 bg-[#111111] relative overflow-hidden">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#00D9FF]/5 rounded-full blur-3xl" />

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
                    <ScrollReveal>
                        <div className="text-center max-w-3xl mx-auto mb-12">
                            <Badge className="bg-white/10 text-white border-white/20 mb-4">Precios Flexibles</Badge>
                            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                                Elige tu modelo de pago
                            </h2>
                            <p className="text-lg text-gray-400 mb-8">
                                Suscripción mensual o anual. Ahorra 2 meses al pagar anualmente.
                            </p>

                            <div className="inline-flex items-center gap-4 bg-[#0A0A0A] rounded-full p-2 border border-white/10">
                                <button
                                    onClick={() => setPricingMode('monthly')}
                                    className={`px-6 py-2 rounded-full font-medium transition-all duration-300 ${pricingMode === 'monthly' ? 'bg-white text-black' : 'text-gray-400 hover:text-white'
                                        }`}
                                >
                                    <div className="flex items-center gap-2">
                                        <Clock className="w-4 h-4" />
                                        Mensual
                                    </div>
                                </button>
                                <button
                                    onClick={() => setPricingMode('annual')}
                                    className={`px-6 py-2 rounded-full font-medium transition-all duration-300 ${pricingMode === 'annual' ? 'bg-white text-black' : 'text-gray-400 hover:text-white'
                                        }`}
                                >
                                    <div className="flex items-center gap-2">
                                        <Award className="w-4 h-4" />
                                        Anual
                                    </div>
                                </button>
                            </div>
                        </div>
                    </ScrollReveal>

                    <div className="grid md:grid-cols-3 gap-8">
                        {pricingPlans.map((plan, index) => (
                            <ScrollReveal key={index} delay={index * 150}>
                                <Card
                                    className={`relative h-full transition-all duration-500 hover:scale-105 bg-[#0A0A0A] border-white/10 ${plan.highlighted ? 'border-[#00D9FF]/50 shadow-lg shadow-[#00D9FF]/10' : ''
                                        }`}
                                >
                                    {plan.highlighted && (
                                        <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                                            <Badge className="bg-[#00D9FF] text-black font-bold px-4 py-1">
                                                Más Popular
                                            </Badge>
                                        </div>
                                    )}
                                    <CardContent className="p-8">
                                        <h3 className="text-xl font-bold mb-2 text-white">{plan.name}</h3>
                                        <p className="text-sm mb-6 text-gray-400">{plan.description}</p>
                                        <div className="mb-6">
                                            <span className="text-4xl font-bold text-white">
                                                ${pricingMode === 'monthly' ? plan.monthlyPrice : plan.annualPrice}
                                            </span>
                                            <span className="text-gray-500">
                                                {pricingMode === 'monthly' ? '/mes' : '/año'}
                                            </span>
                                        </div>
                                        <ul className="space-y-3 mb-8">
                                            {plan.features.map((feature, i) => (
                                                <li key={i} className="flex items-center gap-3">
                                                    <CheckCircle className="w-5 h-5 flex-shrink-0 text-[#00D9FF]" />
                                                    <span className="text-gray-300 text-sm">{feature}</span>
                                                </li>
                                            ))}
                                        </ul>
                                        <Button
                                            onClick={() => navigate(`/checkout?plan=${plan.slug}&cycle=${pricingMode}`)}
                                            className={`w-full transition-all duration-300 ${plan.highlighted
                                                ? 'bg-white text-black hover:bg-gray-200 font-semibold'
                                                : 'bg-white/10 text-white hover:bg-white/20'
                                                }`}
                                        >
                                            Comenzar ahora
                                        </Button>
                                    </CardContent>
                                </Card>
                            </ScrollReveal>
                        ))}
                    </div>

                    <ScrollReveal delay={500}>
                        <div className="mt-12 text-center">
                            <p className="text-gray-500 text-sm">
                                ¿Necesitas un plan personalizado?{' '}
                                <ContactChooserDialog>
                                    <button className="text-[#00D9FF] hover:underline">Contáctanos</button>
                                </ContactChooserDialog>
                            </p>
                        </div>
                    </ScrollReveal>
=======
            {/* Benefits Section */}
            <section id="beneficios" className="py-32 relative bg-[#111111] overflow-hidden border-t border-white/5 snap-start">
                <div className="absolute inset-0 bg-gradient-to-br from-[#111111] to-[#0A0A0A] z-0" />
                <div className="absolute top-1/2 right-0 w-[500px] h-[500px] bg-[#8B5CF6]/5 rounded-full blur-[100px] translate-x-1/2 -translate-y-1/2 z-0" />
                
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
                        <ScrollReveal direction="right">
                            <div className="pr-0 lg:pr-8">
                                <Badge className="bg-[#8B5CF6]/10 text-[#8B5CF6] border-[#8B5CF6]/30 mb-8 text-sm px-5 py-1.5 font-bold tracking-widest uppercase">Ventaja Competitiva</Badge>
                                <h2 className="text-4xl sm:text-6xl font-black text-white mb-8 leading-[1.1] tracking-tight">
                                    Impacto real,<br className="hidden sm:block"/>
                                    resultados medibles.
                                </h2>
                                <p className="text-xl text-gray-400 mb-12 max-w-xl leading-relaxed">
                                    Nos enfocamos en el retorno de tu inversión. Cada píxel, cada botón y cada línea de código está estratégicamente ubicada para optimizar el viaje de tu cliente.
                                </p>
                                
                                <div className="space-y-8">
                                    {benefits.map((benefit, idx) => (
                                        <div key={idx} className="flex gap-6 group cursor-default">
                                            <div className="flex-shrink-0 w-14 h-14 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center group-hover:bg-[#8B5CF6]/20 group-hover:border-[#8B5CF6]/50 transition-all duration-300">
                                                <benefit.icon className="w-7 h-7 text-[#8B5CF6]" />
                                            </div>
                                            <div>
                                                <h4 className="text-2xl font-bold text-white mb-2">{benefit.title}</h4>
                                                <p className="text-gray-400 text-lg leading-relaxed">{benefit.description}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </ScrollReveal>

                        <ScrollReveal direction="left" delay={200}>
                            <div className="relative rounded-[2rem] overflow-hidden border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] group">
                                <div className="absolute inset-0 bg-gradient-to-tr from-[#8B5CF6]/30 to-transparent mix-blend-overlay z-10 opacity-60 group-hover:opacity-40 transition-opacity duration-500"></div>
                                <img src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=2000" alt="Dashboard Analysis" className="w-full h-[650px] object-cover filter brightness-[0.85] contrast-125 group-hover:scale-105 transition-transform duration-1000 ease-out" />
                                
                                {/* Overlay stat box */}
                                <div className="absolute bottom-8 right-8 bg-black/60 backdrop-blur-xl border border-white/10 rounded-2xl p-6 z-20 shadow-2xl">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-full bg-[#00D9FF]/20 flex items-center justify-center">
                                            <TrendingUp className="w-6 h-6 text-[#00D9FF]" />
                                        </div>
                                        <div>
                                            <div className="text-sm font-medium text-gray-300 uppercase tracking-wide">Conversión Promedio</div>
                                            <div className="text-3xl font-black text-white">+145%</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </ScrollReveal>
                    </div>
                </div>
            </section>

            {/* Portfolio Section */}
            <section id="portafolio" className="py-32 bg-[#0A0A0A] border-t border-white/5 snap-start">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <ScrollReveal>
                        <div className="text-center max-w-4xl mx-auto mb-24">
                            <Badge className="bg-white/10 text-white border-white/20 mb-6 text-sm px-5 py-1.5 font-bold tracking-widest uppercase">Galería de Proyectos</Badge>
                            <h2 className="text-4xl sm:text-6xl font-black text-white mb-8 tracking-tight">Trabajos Destacados</h2>
                            <p className="text-xl sm:text-2xl text-gray-400 font-medium">Transformaciones digitales estéticas y funcionales.</p>
                        </div>
                    </ScrollReveal>

                    <div className="grid lg:grid-cols-2 gap-12 sm:gap-16">
                        {/* Project 1 */}
                        <ScrollReveal delay={100}>
                            <div className="group rounded-[2rem] bg-[#111111] overflow-hidden border border-white/5 hover:border-[#00D9FF]/30 transition-all duration-500 shadow-xl hover:shadow-[0_20px_50px_rgba(0,217,255,0.08)] block cursor-pointer" onClick={handleWhatsAppClick}>
                                <div className="h-72 sm:h-96 overflow-hidden relative">
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10" />
                                    <img src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=1200" alt="E-Commerce Moderno" className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-1000 ease-out brightness-90 group-hover:brightness-100" />
                                </div>
                                <div className="p-10 relative">
                                    <div className="absolute -top-12 right-10 w-16 h-16 bg-[#00D9FF] rounded-full flex items-center justify-center shadow-lg group-hover:translate-x-2 transition-transform z-20">
                                        <ArrowRight className="w-8 h-8 text-black" />
                                    </div>
                                    <h3 className="text-3xl font-bold text-white mb-3">Plataforma E-Commerce</h3>
                                    <p className="text-gray-400 text-lg">Optimización de experiencia de usuario y proceso de compra sin fricciones.</p>
                                </div>
                            </div>
                        </ScrollReveal>
                        
                        {/* Project 2 */}
                        <ScrollReveal delay={200}>
                            <div className="group rounded-[2rem] bg-[#111111] overflow-hidden border border-white/5 hover:border-[#8B5CF6]/30 transition-all duration-500 shadow-xl hover:shadow-[0_20px_50px_rgba(139,92,246,0.08)] block cursor-pointer" onClick={handleWhatsAppClick}>
                                <div className="h-72 sm:h-96 overflow-hidden relative">
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10" />
                                    <img src="https://images.unsplash.com/photo-1555529771-835f59fc5efe?auto=format&fit=crop&q=80&w=1200" alt="Portal Corporativo" className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-1000 ease-out brightness-90 group-hover:brightness-100" />
                                </div>
                                <div className="p-10 relative">
                                    <div className="absolute -top-12 right-10 w-16 h-16 bg-[#8B5CF6] rounded-full flex items-center justify-center shadow-lg group-hover:translate-x-2 transition-transform z-20">
                                        <ArrowRight className="w-8 h-8 text-white" />
                                    </div>
                                    <h3 className="text-3xl font-bold text-white mb-3">Portal Administrativo</h3>
                                    <p className="text-gray-400 text-lg">Flujo interno digitalizado y un diseño limpio para operaciones complejas.</p>
                                </div>
                            </div>
                        </ScrollReveal>
                    </div>
>>>>>>> 952feead (Landing optimizada sin login, enfocada en conversion)
                </div>
            </section>

            {/* Testimonials Section */}
<<<<<<< HEAD
            <section id="testimonios" className="py-24 bg-[#0A0A0A]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <ScrollReveal>
                        <div className="text-center max-w-3xl mx-auto mb-16">
                            <Badge className="bg-[#00D9FF]/10 text-[#00D9FF] border-[#00D9FF]/30 mb-4">Testimonios</Badge>
                            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                                Lo que dicen nuestros clientes
                            </h2>
                            <p className="text-lg text-gray-400">
                                Empresas en toda Latinoamérica confían en AsencX para hacer crecer su negocio.
                            </p>
=======
            <section id="testimonios" className="py-32 bg-[#111111] snap-start border-y border-white/5 relative">
                 <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom,_var(--tw-gradient-stops))] from-white/[0.03] to-transparent" />
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <ScrollReveal>
                        <div className="text-center max-w-4xl mx-auto mb-20">
                            <Badge className="bg-[#00D9FF]/10 text-[#00D9FF] border-[#00D9FF]/20 mb-6 text-sm px-5 py-1.5 font-bold tracking-widest uppercase">Autoridad Confirmada</Badge>
                            <h2 className="text-4xl sm:text-6xl font-black text-white mb-8 tracking-tight">
                                Marcas que han evolucionado
                            </h2>
>>>>>>> 952feead (Landing optimizada sin login, enfocada en conversion)
                        </div>
                    </ScrollReveal>

                    <div className="grid md:grid-cols-3 gap-8">
<<<<<<< HEAD
                        {testimonials.map((testimonial, index) => (
                            <ScrollReveal key={index} delay={index * 150}>
                                <Card className="h-full bg-[#111111] border-white/10 hover:border-white/20 transition-all duration-300 group">
                                    <CardContent className="p-8">
                                        <div className="flex gap-1 mb-4">
                                            {[...Array(testimonial.rating)].map((_, i) => (
                                                <Star key={i} className="w-5 h-5 fill-[#00D9FF] text-[#00D9FF] group-hover:scale-110 transition-transform" style={{ transitionDelay: `${i * 50}ms` }} />
                                            ))}
                                        </div>
                                        <p className="text-gray-300 mb-6 italic">&ldquo;{testimonial.content}&rdquo;</p>
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-black font-bold text-lg">
                                                {testimonial.name.charAt(0)}
                                            </div>
                                            <div>
                                                <div className="font-semibold text-white">{testimonial.name}</div>
                                                <div className="text-sm text-gray-500">{testimonial.role}</div>
                                                <div className="text-xs text-gray-600">{testimonial.location}</div>
=======
                        {testimonials.map((testi, i) => (
                            <ScrollReveal key={i} delay={i * 150}>
                                <Card className="bg-[#0A0A0A]/80 backdrop-blur-md border-white/5 hover:border-white/20 transition-colors h-full rounded-[2rem]">
                                    <CardContent className="p-10 flex flex-col h-full">
                                        <div className="flex gap-1 mb-6">
                                            {[...Array(5)].map((_, j) => (
                                                <Star key={j} className="w-5 h-5 fill-[#00D9FF] text-[#00D9FF]" />
                                            ))}
                                        </div>
                                        <p className="text-gray-300 text-xl font-medium mb-10 leading-relaxed italic flex-grow">"{testi.content}"</p>
                                        <div className="flex items-center gap-5 mt-auto">
                                            <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-[#00D9FF] to-[#8B5CF6] flex items-center justify-center text-white font-black text-2xl shadow-lg">
                                                {testi.name[0]}
                                            </div>
                                            <div>
                                                <div className="font-bold text-white text-lg">{testi.name}</div>
                                                <div className="text-sm font-semibold text-gray-500 uppercase tracking-wide">{testi.role}</div>
>>>>>>> 952feead (Landing optimizada sin login, enfocada en conversion)
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </ScrollReveal>
                        ))}
                    </div>
                </div>
            </section>

<<<<<<< HEAD
            {/* CTA Section */}
            <section className="py-24 bg-white relative overflow-hidden">
                <div className="absolute inset-0 overflow-hidden">
                    {[...Array(5)].map((_, i) => (
                        <div
                            key={i}
                            className="absolute w-64 h-64 bg-black/5 rounded-full"
                            style={{
                                left: `${Math.random() * 100}%`,
                                top: `${Math.random() * 100}%`,
                                animation: `float ${5 + i}s ease-in-out infinite`,
                                animationDelay: `${i * 0.5}s`
                            }}
                        />
                    ))}
                </div>

                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
                    <ScrollReveal>
                        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-black mb-6">
                            ¿Listo para resolver tus problemas de ventas?
                        </h2>
                        <p className="text-xl text-gray-600 mb-8">
                            Únete a miles de empresas que ya usan nuestros sistemas web.
                            Prueba gratis por 14 días, sin compromiso.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Button
                                size="lg"
                                onClick={() => setIsModalOpen(true)}
                                className="bg-black text-white hover:bg-gray-800 px-8 font-semibold transition-all duration-300 hover:-translate-y-1 group"
                            >
                                Comenzar Prueba Gratis
                                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </Button>
                            <Button
                                size="lg"
                                variant="outline"
                                onClick={() => {
                                    const COMPANY_WA = "51912345678";
                                    const msg = "Hola AsencX 👋 Quisiera hablar con ventas. ¿Me pueden asesorar para elegir un plan?";
                                    window.open(`https://wa.me/${COMPANY_WA}?text=${encodeURIComponent(msg)}`, '_blank');
                                }}
                                className="border-black text-black hover:bg-black hover:text-white"
                            >
                                <Phone className="mr-2 w-5 h-5" />
                                Hablar con Ventas
                            </Button>
                        </div>
=======
            {/* CTA Final */}
            <section className="py-40 relative overflow-hidden bg-[#0A0A0A] snap-start">
                <div className="absolute inset-0 bg-gradient-to-b from-[#111111]/50 to-[#00D9FF]/5" />
                <div className="absolute -top-40 -left-40 w-96 h-96 bg-[#00D9FF]/10 rounded-full blur-[100px]" />
                <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-[#8B5CF6]/10 rounded-full blur-[100px]" />
                
                <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <ScrollReveal>
                        <Badge className="bg-white/10 text-white border-white/20 mb-8 text-sm px-5 py-2 font-bold tracking-widest uppercase">Da el Primer Paso</Badge>
                        <h2 className="text-5xl sm:text-7xl lg:text-[5.5rem] font-black text-white mb-10 leading-[1.1] tracking-tight">
                            Hablemos sobre <br className="hidden md:block"/> <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00D9FF] to-[#8B5CF6]">el futuro de tu negocio</span>
                        </h2>
                        <p className="text-xl sm:text-2xl text-gray-400 mb-14 max-w-3xl mx-auto font-medium">
                            Olvídate de procesos estancados. Estás a un clic de agendar una asesoría gratuita para construir tu próximo gran activo digital.
                        </p>
                        <Button
                            size="lg"
                            onClick={handleWhatsAppClick}
                            className="bg-[#00D9FF] text-black hover:bg-white hover:text-black hover:scale-105 px-12 py-8 text-xl sm:text-2xl font-black rounded-full transition-all duration-500 shadow-[0_0_40px_rgba(0,217,255,0.4)] group w-full sm:w-auto"
                        >
                            <MessagesSquare className="mr-4 w-8 h-8 group-hover:scale-110 transition-transform" />
                            Empezar mi Proyecto
                            <ArrowRight className="ml-4 w-7 h-7 opacity-0 group-hover:opacity-100 group-hover:translate-x-3 transition-all duration-300 -mr-7 group-hover:mr-0 absolute right-8 group-hover:static" />
                        </Button>
>>>>>>> 952feead (Landing optimizada sin login, enfocada en conversion)
                    </ScrollReveal>
                </div>
            </section>

            {/* Footer */}
<<<<<<< HEAD
            <footer className="bg-[#0A0A0A] text-gray-400 py-16 border-t border-white/10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
                        <div>
                            <div className="flex items-center gap-2 mb-6">
                                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center">
                                    <span className="text-black font-bold text-xl">A</span>
                                </div>
                                <span className="text-xl font-bold text-white">
                                    Asenc<span className="text-[#00D9FF]">X</span>
                                </span>
                            </div>
                            <p className="mb-6 text-gray-500">
                                Soluciones web y software para resolver los problemas de ventas
                                de empresas latinoamericanas.
                            </p>

                            {/* How to change links: edit the urls below to point to the desired social profiles/numbers/emails */}
                            {(() => {
                                const socialLinks = [
                                    { name: 'Facebook', url: 'https://facebook.com/yourpage', icon: <Facebook className="w-5 h-5" /> },
                                    { name: 'WhatsApp', url: 'https://wa.me/1234567890', icon: <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg> },
                                    { name: 'Instagram', url: 'https://instagram.com/yourprofile', icon: <Instagram className="w-5 h-5" /> },
                                    { name: 'Gmail', url: 'mailto:hola@asencx.com', icon: <Mail className="w-5 h-5" /> }
                                ];

                                return (
                                    <div className="flex gap-3">
                                        {socialLinks.map((social) => (
                                            <a
                                                key={social.name}
                                                href={social.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                aria-label={`Visitar ${social.name}`}
                                                className="w-10 h-10 border border-white/10 bg-[#111111] rounded-lg flex items-center justify-center text-gray-400 hover:text-black hover:bg-[#00D9FF] hover:border-[#00D9FF] hover:shadow-[0_0_15px_rgba(0,217,255,0.4)] transition-all duration-300"
                                            >
                                                {social.icon}
                                            </a>
                                        ))}
                                    </div>
                                );
                            })()}
                        </div>

                        <div>
                            <h4 className="text-white font-semibold mb-6">Producto</h4>
                            <ul className="space-y-3">
                                {[
                                    { label: 'Características', id: 'características' },
                                    { label: 'Integraciones', id: 'integraciones' },
                                    { label: 'Precios', id: 'precios' },
                                    { label: 'Actualizaciones', id: 'actualizaciones' },
                                    { label: 'API', id: 'api' }
                                ].map((item) => (
                                    <li key={item.label}>
                                        <button
                                            onClick={() => scrollToSection(item.id)}
                                            className="text-gray-400 hover:text-[#00D9FF] transition-colors"
                                        >
                                            {item.label}
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div>
                            <h4 className="text-white font-semibold mb-6">Soluciones</h4>
                            <ul className="space-y-3">
                                {[
                                    { label: 'Restaurantes', path: '/soluciones/restaurantes' },
                                    { label: 'Hoteles', path: '/soluciones/hoteles' },
                                    { label: 'Academias', path: '/soluciones/academias' },
                                    { label: 'Almacenes', path: '/soluciones/almacenes' },
                                    { label: 'Retail', path: '/soluciones/retail' }
                                ].map((item) => (
                                    <li key={item.label}>
                                        <Link
                                            to={item.path}
                                            className="text-gray-400 hover:text-[#00D9FF] transition-colors block"
                                        >
                                            {item.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div>
                            <h4 className="text-white font-semibold mb-6">Contacto</h4>
                            <ul className="space-y-4">
                                <li className="flex items-center gap-3">
                                    <Phone className="w-5 h-5 text-[#00D9FF]" />
                                    <a href="tel:+525512345678" className="hover:text-[#00D9FF] transition-colors">+52 55 1234 5678</a>
                                </li>
                                <li className="flex items-center gap-3">
                                    <Mail className="w-5 h-5 text-[#00D9FF]" />
                                    <a href="mailto:asencx.dev@gmail.com" className="hover:text-[#00D9FF] transition-colors">asencx.dev@gmail.com</a>
                                </li>
                            </ul>
                        </div>
                    </div>

                    <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                        <p className="text-gray-600">© 2025 AsencX. Todos los derechos reservados.</p>
                        <div className="flex gap-6">
                            {[
                                { label: 'Privacidad', path: '/privacidad' },
                                { label: 'Términos', path: '/terminos' },
                                { label: 'Cookies', path: '/cookies' }
                            ].map((item) => (
                                <Link key={item.label} to={item.path} className="hover:text-white transition-colors">
                                    {item.label}
                                </Link>
                            ))}
=======
            <footer className="bg-[#050505] border-t border-white/10 pt-20 pb-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col md:flex-row justify-between items-center mb-16 pb-12 border-b border-white/5 gap-10">
                        <div className="flex items-center gap-3" onClick={() => window.scrollTo(0, 0)}>
                            <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                                <span className="text-black font-black text-xl">A</span>
                            </div>
                            <span className="text-2xl font-bold text-white tracking-tight">
                                Asenc<span className="text-[#00D9FF]">X</span>
                            </span>
                        </div>
                        
                        <div className="flex flex-wrap justify-center gap-10">
                            {['Servicios', 'Impacto', 'Portafolio', 'Resultados'].map((item) => (
                                <button
                                    key={item}
                                    onClick={() => scrollToSection(item.toLowerCase() === 'impacto' ? 'beneficios' : item.toLowerCase() === 'resultados' ? 'testimonios' : item.toLowerCase())}
                                    className="text-gray-400 hover:text-white transition-colors font-medium uppercase tracking-wider text-sm"
                                >
                                    {item}
                                </button>
                            ))}
                        </div>

                        <div className="flex flex-col sm:flex-row gap-6 mt-4 md:mt-0 text-center sm:text-left">
                            <a href="mailto:asencx.dev@gmail.com" className="text-gray-500 hover:text-white transition-colors text-sm uppercase tracking-wide">
                                <span className="flex items-center justify-center sm:justify-start gap-2">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                                    asencx.dev@gmail.com
                                </span>
                            </a>
                            <a href="https://instagram.com/asencx_oficial" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-white transition-colors text-sm uppercase tracking-wide">
                                <span className="flex items-center justify-center sm:justify-start gap-2">
                                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
                                    @asencx_oficial
                                </span>
                            </a>
                        </div>
                    </div>
                    
                    <div className="flex flex-wrap justify-between items-center text-gray-600 font-medium tracking-wide gap-4">
                        <p>&copy; {new Date().getFullYear()} AsencX Studio. Creadores de Ecosistemas de Ventas.</p>
                        <div className="flex gap-6">
                            <Link to="/privacidad" className="hover:text-white transition-colors text-sm uppercase tracking-wide">Privacidad</Link>
                            <Link to="/terminos" className="hover:text-white transition-colors text-sm uppercase tracking-wide">Términos</Link>
>>>>>>> 952feead (Landing optimizada sin login, enfocada en conversion)
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}
<<<<<<< HEAD
=======

export default Landing;
>>>>>>> 952feead (Landing optimizada sin login, enfocada en conversion)
