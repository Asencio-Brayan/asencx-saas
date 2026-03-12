import { Link } from 'react-router-dom';
import { ArrowLeft, Shield } from 'lucide-react';

export function PrivacyPage() {
    return (
        <div className="min-h-screen bg-[#0A0A0A] font-sans text-gray-300">
            {/* Simple Header */}
            <header className="border-b border-white/10 bg-[#0A0A0A]/95 backdrop-blur-lg sticky top-0 z-50">
                <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                    <Link to="/" className="flex items-center gap-2 group hover:text-white transition-colors">
                        <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                        <span>Volver al inicio</span>
                    </Link>
                    <div className="flex items-center gap-2">
                        <Shield className="w-5 h-5 text-[#00D9FF]" />
                        <span className="font-bold text-white">Privacidad</span>
                    </div>
                </div>
            </header>

            <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
                <div className="mb-12">
                    <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">Política de Privacidad</h1>
                    <p className="text-gray-500">Última actualización: 20 de Febrero de 2026</p>
                </div>

                <div className="space-y-8 prose prose-invert prose-p:text-gray-400 prose-headings:text-white prose-a:text-[#00D9FF]">
                    <section>
                        <h2 className="text-2xl font-semibold mb-4 text-white">1. Información que recopilamos</h2>
                        <p className="mb-4">
                            En AsencX, recopilamos diferentes tipos de información con el objetivo de proporcionar y mejorar nuestros servicios web y de software. Esto incluye:
                        </p>
                        <ul className="list-disc pl-6 space-y-2 text-gray-400">
                            <li><strong>Información personal:</strong> Nombre, dirección de correo electrónico, número de teléfono y detalles de la empresa al registrarte.</li>
                            <li><strong>Datos de uso:</strong> Información sobre cómo interactúas con nuestra plataforma, incluyendo métricas del dashboard y logs de navegación.</li>
                            <li><strong>Datos de pago:</strong> Procesados de forma segura a través de nuestros proveedores de pago de confianza. No almacenamos los datos completos de tus tarjetas.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold mb-4 text-white">2. Uso de la información</h2>
                        <p className="mb-4">Utilizamos los datos recopilados para diversos fines:</p>
                        <ul className="list-disc pl-6 space-y-2 text-gray-400">
                            <li>Proveer, mantener y mejorar nuestros servicios.</li>
                            <li>Notificarte sobre cambios en la plataforma o interrupciones en el servicio.</li>
                            <li>Proporcionar soporte al cliente.</li>
                            <li>Detectar, prevenir y abordar problemas técnicos.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold mb-4 text-white">3. Cookies y Tecnologías de Seguimiento</h2>
                        <p>
                            Utilizamos cookies y tecnologías de seguimiento similares para rastrear la actividad en nuestro servicio y mantener cierta información. Consulta nuestra página de <Link to="/cookies" className="text-[#00D9FF] hover:underline">Política de Cookies</Link> para obtener más detalles sobre el manejo que les damos y cómo ajustarlas.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold mb-4 text-white">4. Terceros y Servicios Adicionales</h2>
                        <p>
                            Podemos emplear empresas e individuos de terceros para facilitar nuestro servicio, para proveer el servicio en nuestro nombre, para realizar servicios relacionados, o para ayudarnos a analizar cómo se utiliza. Estos terceros tienen acceso a tus Datos Personales solo para realizar estas tareas en nuestro nombre y están obligados a no divulgarlos ni utilizarlos para ningún otro propósito.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold mb-4 text-white">5. Seguridad de los Datos</h2>
                        <p>
                            La seguridad de tus datos es importante para nosotros. Utilizamos fuertes medidas de encriptación SSL y hacemos respaldos automáticos diarios. Sin embargo, recuerda que ningún método de transmisión por Internet o método de almacenamiento electrónico es 100% seguro.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold mb-4 text-white">6. Derechos de los Usuarios</h2>
                        <p className="mb-4">Como usuario, tienes derecho a:</p>
                        <ul className="list-disc pl-6 space-y-2 text-gray-400">
                            <li>Acceder, actualizar o eliminar la información que tenemos sobre ti.</li>
                            <li>Oponerte al procesamiento de tus datos.</li>
                            <li>Solicitar que se restrinja o transfiera el procesamiento de tu información (Portabilidad de datos).</li>
                            <li>Retirar tu consentimiento en cualquier momento, sujeto a las restricciones legales u obligaciones de retención de datos.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold mb-4 text-white">7. Contáctanos</h2>
                        <p>
                            Si tienes alguna pregunta o preocupación sobre esta Política de Privacidad, por favor, contáctanos:
                        </p>
                        <p className="mt-2 font-medium">Email: <a href="mailto:asencx.dev@gmail.com" className="text-[#00D9FF] hover:underline">asencx.dev@gmail.com</a></p>
                    </section>
                </div>
            </main>
        </div>
    );
}
