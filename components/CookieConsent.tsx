import React, { useState } from "react";

const CookieConsent: React.FC = () => {
  const [visible, setVisible] = useState(true);

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 w-full bg-black bg-opacity-80 text-white p-4 z-50 flex flex-col md:flex-row items-center justify-between gap-4">
      <span>
        Este site utiliza cookies de terceiros para melhorar sua experiência. Ao continuar navegando, você concorda com o uso de cookies.
      </span>
      <button
        className="bg-aes-cyan text-white font-bold px-6 py-2 rounded hover:bg-white hover:text-aes-cyan transition"
        onClick={() => setVisible(false)}
      >
        Aceitar
      </button>
    </div>
  );
};

export default CookieConsent;
