import React, { useState } from "react";

const CookieConsent: React.FC = () => {
  const [visible, setVisible] = useState(true);

  if (!visible) return null;

  return (
    <div
      className="fixed top-0 md:top-auto md:bottom-2 left-1/2 -translate-x-1/2 w-[95vw] max-w-xs md:max-w-sm bg-black bg-opacity-80 text-white p-3 md:p-4 z-[9999] flex flex-col md:flex-row items-center justify-between gap-2 md:gap-3 rounded-md shadow-md text-xs md:text-sm"
      style={{ minWidth: 0 }}
    >
      <span className="truncate text-xs md:text-sm">
        Este site utiliza cookies para melhorar sua experiência.
      </span>
      <button
        className="bg-aes-cyan text-white font-bold px-3 py-1 md:px-4 md:py-1.5 rounded hover:bg-white hover:text-aes-cyan transition text-xs md:text-sm"
        onClick={() => setVisible(false)}
      >
        Aceitar
      </button>
    </div>
  );
};

export default CookieConsent;
