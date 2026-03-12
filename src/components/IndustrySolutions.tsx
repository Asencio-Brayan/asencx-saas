
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Utensils, Hotel, GraduationCap, Warehouse,
    CheckCircle, ArrowRight,
    Store, ChefHat, Boxes,
    ConciergeBell, BedDouble, Tag,
    Users, BookOpen, CreditCard,
    ShoppingCart, BarChart3
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface Industry {
    id: string;
    label: string;
    icon: any;
    image: string;
    description: string;
    features: string[];
    modules: { icon: any; title: string; desc: string }[];
    idealFor: string;
    gradient: string;
}

const industries: Industry[] = [
    {
        id: 'restaurantes',
        label: 'Restaurantes',
        icon: Utensils,
        image: '/solution-restaurant.jpg', // Using placeholder paths as per instructions
        description: 'Sistema web completo para gestionar pedidos, reservas, inventario y facturación. Todo desde tu navegador.',
        features: ['Pedidos Online', 'Gestión de Mesas', 'Control de Inventario', 'Facturación Electrónica', 'Delivery y Take Away', 'Reportes de Ventas'],
        modules: [
            { icon: Store, title: 'Punto de Venta', desc: 'Ventas rápidas y comandas a cocina.' },
            { icon: ChefHat, title: 'Cocina/Comandas', desc: 'Pantallas KDS para agilizar la preparación.' },
            { icon: Boxes, title: 'Control de Stock', desc: 'Recetas y descuentos automáticos de insumos.' }
        ],
        idealFor: 'Restaurantes, cafés, pollerías y dark kitchens',
        gradient: 'from-orange-500 to-red-600'
    },
    {
        id: 'hoteles',
        label: 'Hoteles',
        icon: Hotel,
        image: '/solution-hotel.jpg',
        description: 'Controla reservas, check-in/out, habitaciones, pagos y reportes desde un panel simple y rápido.',
        features: ['Reservas y Calendario', 'Gestión de Habitaciones', 'Check-in/Check-out', 'Tarifas por Temporada', 'Facturación y Boletas', 'Reportes de Ocupación'],
        modules: [
            { icon: ConciergeBell, title: 'Recepción', desc: 'Dashboard centralizado de operaciones.' },
            { icon: BedDouble, title: 'Housekeeping', desc: 'Estado de limpieza de habitaciones en tiempo real.' },
            { icon: Tag, title: 'Tarifas y Promos', desc: 'Gestión flexible de precios y temporadas.' }
        ],
        idealFor: 'Hoteles, hostales, alojamientos y departamentos',
        gradient: 'from-blue-500 to-cyan-400'
    },
    {
        id: 'academias',
        label: 'Academias',
        icon: GraduationCap,
        image: '/solution-academy.jpg',
        description: 'Administra matrículas, asistencia, pagos, alumnos y reportes en un solo lugar, sin complicaciones.',
        features: ['Matrículas', 'Control de Asistencia', 'Pagos y Mensualidades', 'Gestión de Cursos', 'Comunicaciones', 'Reportes Académicos'],
        modules: [
            { icon: Users, title: 'Alumnos', desc: 'Fichas completas y seguimiento personal.' },
            { icon: BookOpen, title: 'Cursos', desc: 'Planificación académica y horarios.' },
            { icon: CreditCard, title: 'Pagos', desc: 'Control de mensualidades y recordatorios.' }
        ],
        idealFor: 'Academias, institutos, talleres y centros de capacitación',
        gradient: 'from-purple-500 to-indigo-600'
    },
    {
        id: 'almacenes',
        label: 'Almacenes',
        icon: Warehouse,
        image: '/solution-warehouse.jpg',
        description: 'Organiza productos, stock, compras, ventas y alertas de inventario para operar con orden y rapidez.',
        features: ['Entradas/Salidas', 'Kardex', 'Alertas de Stock', 'Proveedores', 'Precios y Márgenes', 'Reportes de Inventario'],
        modules: [
            { icon: Boxes, title: 'Inventario', desc: 'Control total de existencias y movimientos.' },
            { icon: ShoppingCart, title: 'Compras', desc: 'Gestión de proveedores y órdenes de compra.' },
            { icon: BarChart3, title: 'Ventas', desc: 'Facturación y salida de mercancía.' }
        ],
        idealFor: 'Bodegas, almacenes, minimarkets y distribución',
        gradient: 'from-emerald-500 to-teal-400'
    }
];

export function IndustrySolutions() {
    const [activeTab, setActiveTab] = useState(0);
    const navigate = useNavigate();

    const activeIndustry = industries[activeTab];

    return (
        <section id="soluciones" className="py-24 bg-[#111111]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <Badge className="bg-white/10 text-white border-white/20 mb-4 hover:bg-white/20 transition-colors">Soluciones por Industria</Badge>
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
                        Software diseñado para <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00D9FF] to-[#8B5CF6]">tu negocio</span>
                    </h2>
                    <p className="text-lg text-gray-400">
                        Sistemas web especializados que se adaptan a las necesidades específicas de cada sector, potenciando tu crecimiento.
                    </p>
                </div>

                {/* Tabs */}
                <div className="flex overflow-x-auto pb-4 mb-12 gap-2 justify-start lg:justify-center no-scrollbar px-2">
                    {industries.map((ind, index) => (
                        <button
                            key={ind.id}
                            onClick={() => setActiveTab(index)}
                            className={`flex items-center gap-2 px-6 py-3 rounded-full font-medium transition-all duration-300 whitespace-nowrap border ${activeTab === index
                                ? 'bg-white text-black border-white shadow-[0_0_20px_rgba(255,255,255,0.3)] scale-105'
                                : 'bg-[#1A1A1A] text-gray-400 border-white/10 hover:border-white/30 hover:text-white'
                                }`}
                        >
                            <ind.icon className={`w-5 h-5 ${activeTab === index ? 'text-black' : ''}`} />
                            {ind.label}
                        </button>
                    ))}
                </div>

                {/* Main Content Area */}
                <div className="bg-[#0A0A0A] rounded-3xl border border-white/10 overflow-hidden shadow-2xl transition-all duration-500">
                    <div className="grid lg:grid-cols-2 gap-0">
                        {/* Image Side */}
                        <div className="relative h-64 lg:h-auto min-h-[400px] overflow-hidden group">
                            <div className={`absolute inset-0 bg-gradient-to-br ${activeIndustry.gradient} opacity-20 group-hover:opacity-30 transition-opacity duration-500`} />
                            {/* Placeholder for actual image - using a colored div with icon if image fails, or the image tag */}
                            <img
                                key={activeIndustry.image} // Force re-render for animation
                                src={activeIndustry.image}
                                alt={activeIndustry.label}
                                className="w-full h-full object-cover transition-transform duration-700 hover:scale-105 opacity-80 hover:opacity-100"
                                onError={(e) => {
                                    // Fallback if image missing
                                    e.currentTarget.style.display = 'none';
                                    e.currentTarget.parentElement?.classList.add('flex', 'items-center', 'justify-center', 'bg-[#111]');
                                }}
                            />
                            {/* Fallback Icon Overlay if Image fails or simply as decoration */}
                            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                <activeIndustry.icon className="w-32 h-32 text-white/5" />
                            </div>

                            <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-transparent to-transparent lg:bg-gradient-to-r" />
                        </div>

                        {/* Content Side */}
                        <div className="p-8 lg:p-12 flex flex-col justify-center">
                            <div className="flex items-center gap-3 mb-6">
                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center bg-gradient-to-br ${activeIndustry.gradient} bg-opacity-20`}>
                                    <activeIndustry.icon className="w-6 h-6 text-white" />
                                </div>
                                <h3 className="text-3xl font-bold text-white transition-all duration-300">
                                    {activeIndustry.label}
                                </h3>
                            </div>

                            <p className="text-xl text-gray-300 mb-8 leading-relaxed">
                                {activeIndustry.description}
                            </p>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-6 mb-10">
                                {activeIndustry.features.map((feature, i) => (
                                    <div key={i} className="flex items-start gap-3 group">
                                        <CheckCircle className={`w-5 h-5 mt-0.5 flex-shrink-0 text-gray-500 group-hover:text-white transition-colors duration-300`} />
                                        <span className="text-gray-400 group-hover:text-gray-200 transition-colors duration-300">{feature}</span>
                                    </div>
                                ))}
                            </div>

                            <Button
                                type="button"
                                onClick={() => navigate(`/soluciones/${activeIndustry.id}`)}
                                className="w-full sm:w-auto bg-white text-black hover:bg-gray-200 font-bold text-base py-6 px-8 rounded-xl transition-all duration-300 hover:translate-x-1"
                            >
                                Ver Más Detalles
                                <ArrowRight className="ml-2 w-5 h-5" />
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Details Section Removed - Now navigating to dedicated page */}
            </div>
        </section>
    );
}
