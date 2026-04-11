import { MessageCircle } from 'lucide-react';
import { useEffect, useState } from 'react';

// Número oficial de WhatsApp
const WHATSAPP_NUMBER = "51950332872"; 

export function FloatingWhatsApp() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsVisible(window.scrollY > 300);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleClick = () => {
    const message = encodeURIComponent("¡Hola! Vengo desde su sitio web. Me gustaría conversar sobre sus servicios de desarrollo web y sistemas.");
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${message}`, "_blank");
  };

  return (
    <div className={`fixed bottom-6 right-6 z-50 transition-all duration-700 ease-in-out ${isVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-12 scale-50 pointer-events-none'}`}>
      <div className="absolute inset-0 rounded-full bg-[#25D366]/30 animate-ping" />
      <button
        onClick={handleClick}
        className="relative flex items-center justify-center w-16 h-16 bg-[#25D366] hover:bg-[#20bd5a] text-white rounded-full shadow-[0_8px_30px_rgb(37,211,102,0.4)] transition-all duration-300 hover:scale-110 group"
        aria-label="Contactar por WhatsApp"
      >
        <MessageCircle className="w-8 h-8 group-hover:rotate-12 transition-transform duration-300" />
      </button>
    </div>
  );
}
