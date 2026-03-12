import { Link } from 'react-router-dom';
import { ArrowLeft, FileText } from 'lucide-react';

export function TermsPage() {
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
                        <FileText className="w-5 h-5 text-[#8B5CF6]" />
                        <span className="font-bold text-white">Términos</span>
                    </div>
                </div>
            </header>

            <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
                <div className="mb-12">
                    <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">Términos de Servicio</h1>
                    <p className="text-gray-500">Última actualización: 20 de Febrero de 2026</p>
                </div>

                <div className="space-y-8 prose prose-invert prose-p:text-gray-400 prose-headings:text-white prose-a:text-[#00D9FF]">
                    <section>
                        <h2 className="text-2xl font-semibold mb-4 text-white">1. Descripción del Servicio</h2>
                        <p>
                            AsencX es un ecosistema SaaS (Software as a Service) que provee interfaces web interactivas y soluciones de software para restaurantes, hoteles, academias y almacenes, con sede principal en Latinoamérica. Nos reservamos el derecho a modificar, añadir o retirar funciones del servicio sin previo aviso si el uso requiere mejoras críticas de rendimiento o seguridad.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold mb-4 text-white">2. Cuentas de Usuario</h2>
                        <ul className="list-disc pl-6 space-y-2 text-gray-400">
                            <li>Debes ser mayor de edad o contar con la capacidad legal de representar a tu empresa para crear y suscribirte a una cuenta.</li>
                            <li>Eres el único responsable de salvaguardar la contraseña utilizada para acceder al servicio y eres responsable de cualquier actividad bajo tu cuenta, independientemente de si la acción es consentida directamente o si es producto del uso negligente de tus credenciales.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold mb-4 text-white">3. Uso Aceptable</h2>
                        <p className="mb-2">Al utilizar nuestros servicios te comprometes a:</p>
                        <ul className="list-disc pl-6 space-y-2 text-gray-400">
                            <li>No usar los servicios para fines ilícitos o violando cualquier ley nacional o internacional.</li>
                            <li>No utilizar la plataforma para la ingeniería inversa o creación de software derivativo sin permiso explícito de AsencX.</li>
                            <li>No enviar spam, malware o cualquier código de naturaleza destructiva a la plataforma ni desde nuestra plataforma.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold mb-4 text-white">4. Pagos, Pruebas y Suscripciones</h2>
                        <p className="mb-4">
                            Ciertas partes del servicio (suscripciones de pago y licencias) son ofertadas mediante un periodo de prueba gratuita. Una vez finalizados estos periodos se requiere actualizar a un plan de pago para continuar usando todos los componentes de la plataforma.
                        </p>
                        <ul className="list-disc pl-6 space-y-2 text-gray-400">
                            <li>El procesamiento de pagos está sujeto a lo estipulado por nuestros proveedores de pagos externos.</li>
                            <li>Los pagos por suscripciones mensuales o licencias son facturados de forma mensual / de contado como es advertido al tomar la compra.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold mb-4 text-white">5. Cancelación e Inactividad</h2>
                        <p>
                            Puedes cancelar tu suscripción en cualquier momento. Al cancelar, perderás acceso premium al cierre de tu ciclo de facturación actual. Nos reservamos el derecho de eliminar cuentas con extrema inactividad prolongada según nuestras pautas operativas (por ejemplo: si eres un usuario sin pago activo que ha superado el tiempo prudente de retención de datos gratuito).
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold mb-4 text-white">6. Limitación de Responsabilidad</h2>
                        <p>
                            En ningún caso AsencX, sus directores, empleados, socios, o agentes, serán responsables por daños indirectos, incidentales, especiales, consecuentes o punitivos, incluyendo sin limitación, la pérdida de beneficios, datos, uso, u otras pérdidas intangibles, resultantes de (i) tu acceso o uso (o inhabilidad de ello) de parte del servicio; (ii) cualquier conducta o contenido de terceros en el servicio.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold mb-4 text-white">7. Cambios a los Términos</h2>
                        <p>
                            Nos reservamos el derecho, a nuestra entera discreción, de modificar o reemplazar estos Términos en cualquier momento. Trataremos de proporcionar un aviso de al menos 30 días antes de que cualquier término nuevo entre en vigor. Al continuar utilizando nuestro servicio, tú consientes en quedar vinculado por las condiciones revisadas.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold mb-4 text-white">8. Contáctanos</h2>
                        <p>
                            Si tienes alguna duda sobre estos términos, comunícate con nosotros escribiendo directamente a:
                        </p>
                        <p className="mt-2 font-medium">Email: <a href="mailto:asencx.dev@gmail.com" className="text-[#00D9FF] hover:underline">asencx.dev@gmail.com</a></p>
                    </section>
                </div>
            </main>
        </div>
    );
}
