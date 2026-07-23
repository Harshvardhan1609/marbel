"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";


export default function WhatsAppButton() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 400) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility);
    // Initial check in case they reload scrolled down
    toggleVisibility();

    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const whatsappUrl = `https://wa.me/919876543210?text=${encodeURIComponent(
    "Hello Sudhir Marbels, I am browsing your luxury stone collections and would like to request a consultation."
  )}`;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          initial={{ opacity: 0, scale: 0.5, y: 50 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.5, y: 50 }}
          transition={{ type: "spring", stiffness: 260, damping: 20 }}
          className="fixed bottom-6 right-6 z-50 flex items-center justify-center w-14 h-14 bg-[#25D366] text-white hover:bg-white hover:text-[#25D366] rounded-full shadow-2xl transition-colors duration-300 border border-transparent hover:border-[#25D366]"
          aria-label="Contact on WhatsApp"
        >
          {/* Custom SVG logo of WhatsApp for precision, fallback to MessageSquare if needed */}
          <svg
            className="w-7 h-7 fill-current"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.455L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.37 9.864-9.799.002-2.63-1.023-5.101-2.885-6.968C16.58 2.012 14.11 1.008 11.48 1.007c-5.44 0-9.866 4.372-9.87 9.802 0 1.714.47 3.393 1.36 4.869l-.982 3.582 3.658-.956zm11.603-5.26c-.326-.162-1.924-.938-2.222-1.045-.297-.108-.513-.162-.73.162-.216.324-.838 1.046-1.027 1.262-.19.217-.378.244-.704.082-.326-.162-1.375-.502-2.62-1.603-.968-.853-1.623-1.905-1.813-2.23-.19-.325-.02-.501.143-.662.146-.145.325-.378.488-.567.162-.19.216-.324.324-.54.109-.217.054-.406-.027-.568-.08-.162-.73-1.727-.999-2.376-.262-.63-.53-.54-.73-.55-.189-.01-.405-.01-.621-.01-.216 0-.568.08-.865.405-.297.324-1.135 1.08-1.135 2.632 0 1.552 1.154 3.051 1.316 3.267.162.216 2.272 3.428 5.505 4.802.768.327 1.368.521 1.833.667.772.242 1.474.208 2.028.126.619-.092 1.925-.776 2.196-1.486.27-.71.27-1.317.189-1.446-.08-.129-.297-.21-.622-.372z" />
          </svg>
        </motion.a>
      )}
    </AnimatePresence>
  );
}
