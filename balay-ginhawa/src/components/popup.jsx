import { useEffect } from "react";
// Tailwind by KhyteGpt
// Reusable Popup/Modal Component -KhyteGpt
export default function Popup({ isOpen, onClose, children }) {
  // useEffect hook para i-setup yung listener sa keyboard
  // Idea: kapag pinindot ang Escape key, automatic magsasara si popup
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") onClose?.(); // Safe call, kung may onClose function
    };
    window.addEventListener("keydown", handleEsc);
    // Cleanup function para alisin yung event listener pag na-unmount
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  // Kung hindi open ang popup, wag na i-render (return null)
  if (!isOpen) return null;

  return (
    // Background overlay
    // Kapag pinindot ang area na ito (outside sa white box), magsasara ang popup
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
      onClick={onClose}
    >
      {/* Popup container
          - Gumamit ng e.stopPropagation() para hindi siya ma-trigger
            kapag ang mismong loob ng popup ang pinindot
      */}
      <div
        className="bg-white rounded-xl shadow-lg p-6 w-[400px] relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Children (dynamic content) 
            - Yung laman ng popup (form, text, buttons, etc.) ipapasa galing sa parent
            - Wala nang X button dito, kung gusto magsara, gagawa na lang ng "Cancel" button sa parent
        */}
        {children}
      </div>
    </div>
  );
}
