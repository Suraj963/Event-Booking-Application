import React from "react";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";

const ConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  title = "Confirm Action",
  message = "Are you sure you want to proceed?",
  confirmText = "Yes, Confirm",
  cancelText = "No, Go Back",
}) => {
  if (!isOpen) return null;

  return (
    // Backdrop
    <div
      onClick={onClose}
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 transition-opacity duration-300"
    >
      {/* Modal Panel */}
      <div
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside the modal
        className="bg-card rounded-2xl shadow-xl border border-border/20 max-w-md w-full m-4 p-6 text-center transform transition-all duration-300 scale-95 opacity-0 animate-fade-in-scale"
      >
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10 mb-4">
          <ExclamationTriangleIcon
            className="h-7 w-7 text-destructive"
            aria-hidden="true"
          />
        </div>

        <h3 className="text-xl font-bold text-foreground">{title}</h3>
        <p className="mt-2 text-sm text-muted-foreground">{message}</p>

        {/* Action Buttons */}
        <div className="mt-6 flex justify-center gap-4">
          <button
            type="button"
            onClick={onClose}
            className="w-full bg-muted text-foreground font-semibold py-2.5 px-4 rounded-lg hover:bg-muted/80 transition-colors"
          >
            {cancelText}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="w-full bg-destructive text-destructive-foreground font-semibold py-2.5 px-4 rounded-lg hover:bg-destructive/90 transition-colors"
          >
            {confirmText}
          </button>
        </div>
      </div>

      {/* Add keyframes for animation in your global CSS if they don't exist */}
      <style>{`
        @keyframes fade-in-scale {
          0% { opacity: 0; transform: scale(0.95); }
          100% { opacity: 1; transform: scale(1); }
        }
        .animate-fade-in-scale {
          animation: fade-in-scale 0.3s forwards cubic-bezier(0.16, 1, 0.3, 1);
        }
      `}</style>
    </div>
  );
};

export default ConfirmationModal;
