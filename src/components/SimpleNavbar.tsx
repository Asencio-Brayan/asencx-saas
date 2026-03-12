
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { LeadModal } from '@/components/LeadModal'; // Assuming we reuse this for "Prueba Gratis"
import { useState } from 'react';

export function SimpleNavbar() {
    const navigate = useNavigate();
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <>
            <LeadModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
            <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0A0A0A]/95 backdrop-blur-lg border-b border-white/10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16 lg:h-20">
                        {/* Logo */}
                        <div
                            className="flex items-center gap-2 group cursor-pointer"
                            onClick={() => navigate('/')}
                        >
                            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center transform group-hover:rotate-12 transition-transform duration-300">
                                <span className="text-black font-bold text-xl">A</span>
                            </div>
                            <span className="text-2xl font-bold text-white">
                                Asenc<span className="text-[#00D9FF]">X</span>
                            </span>
                        </div>

                        {/* CTA Buttons */}
                        <div className="flex items-center gap-4">
                            <Button
                                variant="ghost"
                                onClick={() => navigate('/')}
                                className="text-gray-300 hover:text-white hover:bg-white/10 hidden sm:flex"
                            >
                                Volver al Inicio
                            </Button>
                            <Button
                                onClick={() => setIsModalOpen(true)}
                                className="bg-white text-black hover:bg-gray-200 font-semibold transition-all duration-300 hover:-translate-y-0.5">
                                Prueba Gratis
                            </Button>
                        </div>
                    </div>
                </div>
            </nav>
        </>
    );
}
