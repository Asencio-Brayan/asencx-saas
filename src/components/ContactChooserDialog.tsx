import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { MessageCircle, Mail } from 'lucide-react';
import { useState } from 'react';

const COMPANY_WA = "51912345678"; // E.164 format without +
const SUPPORT_EMAIL = "asencx.dev@gmail.com";

interface ContactChooserDialogProps {
    children: React.ReactNode;
}

export function ContactChooserDialog({ children }: ContactChooserDialogProps) {
    const [detail, setDetail] = useState('');
    const [isOpen, setIsOpen] = useState(false);

    const getMessageBody = () => {
        return `Hola AsencX 👋 Quiero un plan personalizado.
Nombre: 
Empresa: 
Necesidad: ${detail || 'Ninguna'}
Por favor envíen propuesta y precios.`;
    };

    const handleWhatsApp = () => {
        const message = getMessageBody();
        const waLink = `https://wa.me/${COMPANY_WA}?text=${encodeURIComponent(message)}`;
        window.open(waLink, '_blank');
        setIsOpen(false);
    };

    const handleGmail = () => {
        const subject = "Plan personalizado AsencX";
        const body = getMessageBody();
        // Since mailto doesn't accept full URL-encoded newlines perfectly in all clients, we use standard encoding
        const mailtoLink = `mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        window.open(mailtoLink, '_self');
        setIsOpen(false);
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                {children}
            </DialogTrigger>
            <DialogContent className="sm:max-w-md bg-[#111111] border-white/10 text-white">
                <DialogHeader>
                    <DialogTitle className="text-xl font-bold">¿Cómo deseas contactarnos?</DialogTitle>
                    <DialogDescription className="text-gray-400">
                        Cuéntanos qué plan personalizado necesitas y te responderemos rápido.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-300">Detalle (opcional)</label>
                        <textarea
                            value={detail}
                            onChange={(e) => setDetail(e.target.value)}
                            className="w-full bg-[#0A0A0A] border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-[#00D9FF] resize-none h-24"
                            placeholder="Ej: Necesitamos más de 10 usuarios y módulos específicos de facturación..."
                        />
                    </div>
                </div>

                <div className="flex flex-col gap-3">
                    <Button
                        onClick={handleWhatsApp}
                        className="w-full bg-[#25D366] hover:bg-[#1DA851] text-white font-semibold h-12 flex items-center justify-center gap-2"
                    >
                        <MessageCircle className="w-5 h-5" />
                        WhatsApp
                    </Button>
                    <Button
                        onClick={handleGmail}
                        variant="outline"
                        className="w-full border-white/20 text-white hover:bg-white/10 font-semibold h-12 flex items-center justify-center gap-2"
                    >
                        <Mail className="w-5 h-5" />
                        Gmail
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
