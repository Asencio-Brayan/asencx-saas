
import {
    Utensils, Hotel, GraduationCap, Warehouse,
    Store, ChefHat, Boxes,
    ConciergeBell, BedDouble, Tag,
    Users, BookOpen, CreditCard,
    ShoppingCart, BarChart3, Receipt, Calendar,
    ClipboardList, Truck, UserCheck
} from 'lucide-react';

export interface IndustryData {
    id: string; // slug
    title: string;
    subtitle: string;
    description: string; // Short description for cards/previews
    heroImage: string;
    modules: {
        icon: any;
        title: string;
        desc: string;
    }[];
    features: string[];
    faqs: {
        question: string;
        answer: string; // Placeholder answer or generic
    }[];
    gradient: string;
    icon: any;
}

export const industriesData: IndustryData[] = [
    {
        id: 'restaurantes',
        title: 'Restaurantes',
        subtitle: 'Pedidos, mesas, inventario y facturación desde un solo panel.',
        description: 'Sistema web completo para gestionar pedidos, reservas, inventario y facturación.',
        heroImage: '/solution-restaurant.jpg',
        icon: Utensils,
        gradient: 'from-orange-500 to-red-600',
        modules: [
            { icon: Store, title: 'Punto de Venta', desc: 'Ventas rápidas, mesas y delivery.' },
            { icon: ChefHat, title: 'Cocina / Comandas', desc: 'Pantallas KDS para agilizar la preparación.' },
            { icon: Users, title: 'Gestión de Mesas', desc: 'Control visual de ocupación y reservas.' },
            { icon: Truck, title: 'Delivery y Take Away', desc: 'Gestión de pedidos para llevar y domicilio.' },
            { icon: Boxes, title: 'Control de Inventario', desc: 'Recetas y descuentos automáticos.' },
            { icon: BarChart3, title: 'Reportes de Ventas', desc: 'Análisis detallado por producto y turno.' }
        ],
        features: [
            'Pedidos Online', 'Gestión de Mesas', 'Control de Inventario', 'Facturación Electrónica', 'Delivery/Take Away', 'Reportes por día/turno', 'Control de caja', 'Usuarios por roles'
        ],
        faqs: [
            { question: '¿Puedo usarlo desde el celular o tablet?', answer: 'Sí, el sistema es 100% web y responsive. Puedes usarlo en cualquier dispositivo con navegador.' },
            { question: '¿Funciona para delivery y salón?', answer: 'Perfectamente. Tienes módulos integrados para gestionar mesas en salón y pedidos de delivery simultáneamente.' },
            { question: '¿Puedo controlar stock por insumos?', answer: 'Sí, puedes crear recetas para que al vender un plato se descuenten los insumos automáticamente.' },
            { question: '¿Cómo activo mi prueba gratis?', answer: 'Simplemente haz clic en "Prueba Gratis", regístrate y tendrás 14 días con todas las funciones desbloqueadas.' }
        ]
    },
    {
        id: 'hoteles',
        title: 'Hoteles',
        subtitle: 'Reservas, habitaciones, check-in/out y reportes de ocupación.',
        description: 'Controla reservas, check-in/out, habitaciones, pagos y reportes.',
        heroImage: '/solution-hotel.jpg',
        icon: Hotel,
        gradient: 'from-blue-500 to-cyan-400',
        modules: [
            { icon: Calendar, title: 'Reservas y Calendario', desc: 'Vista visual de ocupación y reservas.' },
            { icon: ConciergeBell, title: 'Recepción', desc: 'Check-in y Check-out rápido para huéspedes.' },
            { icon: BedDouble, title: 'Habitaciones', desc: 'Gestión de estados (limpieza, ocupado).' },
            { icon: ClipboardList, title: 'Housekeeping', desc: 'Control de limpieza y mantenimiento.' },
            { icon: Tag, title: 'Tarifas y Temporadas', desc: 'Precios dinámicos según temporada.' },
            { icon: BarChart3, title: 'Reportes de Ocupación', desc: 'Métricas de ADR, RevPAR y ocupación.' }
        ],
        features: [
            'Reservas', 'Gestión de habitaciones', 'Check-in/out', 'Tarifas por temporada', 'Facturación', 'Reportes', 'Historial de huéspedes', 'Roles'
        ],
        faqs: [
            { question: '¿Puedo gestionar varios tipos de habitación?', answer: 'Sí, puedes configurar habitaciones simples, dobles, suites, etc., con sus propios precios.' },
            { question: '¿Puedo cambiar tarifas por temporada?', answer: 'Sí, el sistema permite definir tarifas especiales para temporada alta, baja o fechas específicas.' },
            { question: '¿Incluye reportes de ocupación?', answer: 'Totalmente. Podrás ver tasas de ocupación, ingresos por habitación y más.' },
            { question: '¿Cómo pruebo el sistema?', answer: 'Crea tu cuenta gratuita en 2 minutos y empieza a gestionar tu propiedad de inmediato.' }
        ]
    },
    {
        id: 'academias',
        title: 'Academias',
        subtitle: 'Matrículas, alumnos, asistencia, pagos y reportes académicos.',
        description: 'Administra matrículas, asistencia, pagos, alumnos y reportes.',
        heroImage: '/solution-academy.jpg',
        icon: GraduationCap,
        gradient: 'from-purple-500 to-indigo-600',
        modules: [
            { icon: Users, title: 'Alumnos', desc: 'Fichas completas y seguimiento personal.' },
            { icon: BookOpen, title: 'Cursos', desc: 'Planificación académica y horarios.' },
            { icon: ClipboardList, title: 'Matrículas', desc: 'Proceso de inscripción simplificado.' },
            { icon: UserCheck, title: 'Asistencia', desc: 'Registro de asistencia por clase o día.' },
            { icon: CreditCard, title: 'Pagos y Mensualidades', desc: 'Control de cobros y estados de cuenta.' },
            { icon: BarChart3, title: 'Reportes Académicos', desc: 'Rendimiento, asistencia e ingresos.' }
        ],
        features: [
            'Matrículas', 'Control de asistencia', 'Pagos', 'Cursos', 'Comunicados', 'Reportes', 'Roles', 'Historial'
        ],
        faqs: [
            { question: '¿Sirve para mensualidades y matrículas?', answer: 'Sí, gestiona cobros recurrentes, matrículas anuales y pagos únicos de materiales.' },
            { question: '¿Puedo registrar asistencia por clase?', answer: 'Sí, los profesores pueden marcar asistencia desde cualquier dispositivo.' },
            { question: '¿Puedo ver reportes por curso?', answer: 'Puedes filtrar alumnos, pagos y asistencia por curso, nivel o profesor.' },
            { question: '¿Cómo activo mi prueba gratis?', answer: 'Regístrate gratis y configura tus cursos y alumnos para probar el sistema.' }
        ]
    },
    {
        id: 'almacenes',
        title: 'Almacenes',
        subtitle: 'Stock, compras, ventas, kardex y alertas para operar con orden.',
        description: 'Organiza productos, stock, compras, ventas y alertas de inventario.',
        heroImage: '/solution-warehouse.jpg',
        icon: Warehouse,
        gradient: 'from-emerald-500 to-teal-400',
        modules: [
            { icon: Boxes, title: 'Inventario', desc: 'Control total de existencias en tiempo real.' },
            { icon: ClipboardList, title: 'Kardex', desc: 'Movimientos detallados por producto.' },
            { icon: ShoppingCart, title: 'Compras', desc: 'Gestión de proveedores y órdenes.' },
            { icon: Receipt, title: 'Ventas', desc: 'Salida de mercancía y facturación.' },
            { icon: Truck, title: 'Proveedores', desc: 'Directorio y gestión de cuentas por pagar.' },
            { icon: BarChart3, title: 'Reportes de Stock', desc: 'Valorización y rotación de inventario.' }
        ],
        features: [
            'Entradas/Salidas', 'Kardex', 'Alertas de stock', 'Proveedores', 'Márgenes', 'Reportes', 'Roles', 'Historial'
        ],
        faqs: [
            { question: '¿Puedo ver alertas de stock mínimo?', answer: 'Sí, el sistema te notifica cuando un producto está por debajo del stock mínimo definido.' },
            { question: '¿Incluye kardex?', answer: 'Sí, tienes un kardex valorizado para ver cada entrada y salida.' },
            { question: '¿Puedo gestionar proveedores y compras?', answer: 'Centraliza la información de tus proveedores y registra tus facturas de compra fácilmente.' },
            { question: '¿Cómo pruebo el sistema?', answer: 'Inicia tu prueba gratis de 14 días hoy mismo sin compromiso.' }
        ]
    }
];
