import { Link } from 'react-router-dom';
import { ArrowLeft, Settings } from 'lucide-react';

export function CookiesPage() {
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
                        <Settings className="w-5 h-5 text-[#00D9FF]" />
                        <span className="font-bold text-white">Cookies</span>
                    </div>
                </div>
            </header>

            <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
                <div className="mb-12">
                    <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">Política de Cookies</h1>
                    <p className="text-gray-500">Última actualización: 20 de Febrero de 2026</p>
                </div>

                <div className="space-y-8 prose prose-invert prose-p:text-gray-400 prose-headings:text-white prose-a:text-[#00D9FF]">
                    <section>
                        <h2 className="text-2xl font-semibold mb-4 text-white">1. ¿Qué es una cookie?</h2>
                        <p>
                            Las Cookies son archivos de texto reducidos que se almacenan en tu equipo, dispositivo móvil o navegador de ordenador cuando visitas una página web. Tienen el propósito general de mejorar la experiencia del usuario y en plataformas web progresivas, sirven para recordar tus ajustes al ingresar nuevamente al sistema.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold mb-4 text-white">2. ¿Qué tipos de cookies usamos?</h2>
                        <ul className="list-disc pl-6 space-y-4 text-gray-400">
                            <li>
                                <strong>Cookies Estrictamente Necesarias / Funcionales:</strong> Son imprescindibles para que el sitio funcione o para que puedas iniciar sesión e interactuar sin tener que re-autenticarte reiteradas veces. Si desactivas estas cookies mediante el navegador, partes críticas del Dashboard podrían no operar correctamente.
                            </li>
                            <li>
                                <strong>Cookies Analíticas / De Rendimiento:</strong> Nos permiten contabilizar las visitas y el tráfico del entorno web o saber cuáles páginas y herramientas de AsencX son las más utilizadas. Los datos obtenidos aquí son agregados y, por tanto, en su gran mayoría anónimos.
                            </li>
                            <li>
                                <strong>Cookies de Preferencias:</strong> Las usamos al recordar las decisiones o cambios en el aspecto que configuraste de nuestra web (por ejemplo: el lenguaje, la región de operación, el aspecto si corresponde, etc.).
                            </li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold mb-4 text-white">3. Cookies de terceros</h2>
                        <p>
                            Adicionalmente a nuestras propias cookies de la plataforma central, podemos utilizar cookies de terceros de confianza, principalmente ligadas a servicios de análisis modernos o por herramientas de seguridad proporcionadas por terceros (como Cloudflare o herramientas de monitorización de rendimiento como Vercel Analytics) para identificar e informar el uso global del Servicio.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold mb-4 text-white">4. Tus opciones de control y consentimiento</h2>
                        <p className="mb-2">
                            A la hora de usar estos servicios, accedes y consientes en un uso razonable de las mismas cookies tal como se especifica arriba. Si deseas deshabilitar esto por completo, puedes indicar en tu ordenador las condiciones personalizadas en las opciones de preferencias o ajustes del navegador (o en su debido lugar, instalar herramientas de bloqueo/incógnito).
                        </p>
                        <ul className="list-disc pl-6 text-gray-400 space-y-2">
                            <li>Usuarios de Chrome: ir a la opción "Ajustes de la configuración" -&gt; Privacidad.</li>
                            <li>Usuarios de Firefox: Opciones -&gt; Privacidad y Seguridad -&gt; Cookies.</li>
                            <li>Usuarios de Safari: Preferencias -&gt; Privacidad -&gt; Bloquear Todas las Cookies.</li>
                        </ul>
                        <p className="mt-4 text-sm bg-white/5 border border-white/10 p-4 rounded-lg">
                            Nota: Es importante resaltar que en aplicaciones de software (como este SaaS), deshabilitar ciertas cookies bloquea el acceso a sesiones interactivas, ya que se usan tokens de acceso para autentificarnos de forma segura.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold mb-4 text-white">5. Contáctanos</h2>
                        <p>
                            Si tienes más información que solicitar u observas comportamientos inusuales, siempre estamos a gusto en atenderte:
                        </p>
                        <p className="mt-2 font-medium">Email: <a href="mailto:asencx.dev@gmail.com" className="text-[#00D9FF] hover:underline">asencx.dev@gmail.com</a></p>
                    </section>
                </div>
            </main>
        </div>
    );
}
