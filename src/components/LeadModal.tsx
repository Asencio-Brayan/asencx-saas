import React, { useState } from 'react';

type SystemType = 'ACADEMY' | 'STORE' | 'RESTAURANT' | 'RESERVATIONS' | 'HOTEL' | 'OTHER';

interface LeadModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const LeadModal: React.FC<LeadModalProps> = ({ isOpen, onClose }) => {
    const [formData, setFormData] = useState({
        name: '',
        companyName: '',
        email: '',
        phoneWhatsapp: '',
        rubro: '',
    });
    const [status, setStatus] = useState<'IDLE' | 'LOADING' | 'SUCCESS' | 'ERROR'>('IDLE');
    const [errorMessage, setErrorMessage] = useState('');

    if (!isOpen) return null;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('LOADING');
        setErrorMessage('');

        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/leads`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || data.errors?.[0]?.message || 'Something went wrong');
            }

            setStatus('SUCCESS');
        } catch (error: any) {
            setStatus('ERROR');
            setErrorMessage(error.message);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm transition-all duration-300">
            <div className="bg-[#111111] rounded-xl shadow-2xl w-full max-w-full sm:max-w-md md:max-w-2xl relative flex flex-col max-h-[90vh] border border-white/10">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-1 rounded-full z-10 text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
                    aria-label="Close"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>

                <div className="p-6 sm:p-8 overflow-y-auto custom-scrollbar">
                    {status === 'SUCCESS' ? (
                        <div className="text-center py-8">
                            <div className="w-16 h-16 bg-[#00D9FF]/10 text-[#00D9FF] rounded-full flex items-center justify-center mx-auto mb-4 border border-[#00D9FF]/20">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <h2 className="text-2xl font-bold mb-2 text-white">¡Registro Exitoso!</h2>
                            <p className="text-gray-400 mb-8">
                                Gracias por registrarte. Te contactaremos vía WhatsApp o correo electrónico muy pronto para activar tu prueba gratuita.
                            </p>
                            <button
                                onClick={onClose}
                                className="w-full bg-[#00D9FF] text-white font-medium py-2.5 rounded-lg hover:bg-[#00D9FF]/80 transition duration-200 shadow-[0_0_20px_rgba(0,217,255,0.3)]"
                            >
                                Cerrar
                            </button>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="text-center mb-6">
                                <h2 className="text-2xl font-bold text-white">Prueba Gratis</h2>
                                <p className="text-sm text-gray-400 mt-1">Comienza tu transformación digital hoy</p>
                            </div>

                            {status === 'ERROR' && (
                                <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-lg text-sm flex items-start gap-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 shrink-0 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                    </svg>
                                    <span>{errorMessage}</span>
                                </div>
                            )}

                            <div className="grid grid-cols-1 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-1">Nombre Completo</label>
                                    <input
                                        type="text"
                                        name="name"
                                        required
                                        placeholder="Ej. Juan Pérez"
                                        value={formData.name}
                                        onChange={handleChange}
                                        className="w-full bg-[#1A1A1A] border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-[#00D9FF]/50 outline-none transition-all placeholder-gray-600"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-1">Nombre de la Empresa</label>
                                    <input
                                        type="text"
                                        name="companyName"
                                        required
                                        placeholder="Ej. Mi Negocio S.A."
                                        value={formData.companyName}
                                        onChange={handleChange}
                                        className="w-full bg-[#1A1A1A] border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-[#00D9FF]/50 outline-none transition-all placeholder-gray-600"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-1">Correo Electrónico</label>
                                    <input
                                        type="email"
                                        name="email"
                                        required
                                        placeholder="ejemplo@correo.com"
                                        value={formData.email}
                                        onChange={handleChange}
                                        className="w-full bg-[#1A1A1A] border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-[#00D9FF]/50 outline-none transition-all placeholder-gray-600"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-1">WhatsApp</label>
                                    <input
                                        type="tel"
                                        name="phoneWhatsapp"
                                        required
                                        placeholder="+52 123 456 7890"
                                        value={formData.phoneWhatsapp}
                                        onChange={handleChange}
                                        className="w-full bg-[#1A1A1A] border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-[#00D9FF]/50 outline-none transition-all placeholder-gray-600"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-1">Rubro / Giro</label>
                                    <input
                                        type="text"
                                        name="rubro"
                                        placeholder="Ej. Restaurante, Gimnasio..."
                                        value={formData.rubro}
                                        onChange={handleChange}
                                        className="w-full bg-[#1A1A1A] border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-[#00D9FF]/50 outline-none transition-all placeholder-gray-600"
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={status === 'LOADING'}
                                className={`w-full mt-6 text-white font-bold py-3 rounded-lg shadow-lg hover:shadow-[0_0_20px_rgba(0,217,255,0.4)] transition-all duration-200 transform hover:-translate-y-0.5 ${status === 'LOADING' ? 'bg-gray-600 cursor-not-allowed' : 'bg-[#00D9FF] hover:bg-[#00D9FF]/90'
                                    }`}
                            >
                                {status === 'LOADING' ? (
                                    <span className="flex items-center justify-center gap-2">
                                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Procesando...
                                    </span>
                                ) : 'Comenzar Prueba Gratis'}
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};
