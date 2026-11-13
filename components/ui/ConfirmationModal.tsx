"use client";

import { useEffect } from "react";
import ReactDOM from "react-dom";
import { Button } from "./button";

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  isDestructive?: boolean;
}

export function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = "Confirm",
  cancelText = "Cancel",
  isDestructive = false,
}: ConfirmationModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }
    return () => document.body.classList.remove("overflow-hidden");
  }, [isOpen]);

  if (!isOpen) return null;

  const modalRoot = document.querySelector(".modal-container") || document.body;

  return ReactDOM.createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
      <div className="bg-[#0D1322] border border-slate-700/80 rounded-2xl shadow-2xl max-w-md w-full p-6 text-slate-100">
        <h3 className="text-xl font-bold mb-2 text-white">{title}</h3>
        <p className="text-slate-300 text-sm leading-relaxed mb-6">{description}</p>

        <div className="flex gap-3 justify-end">
          <Button
            onClick={onClose}
            className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700"
          >
            {cancelText}
          </Button>
          <Button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className={`flex-1 text-white ${
              isDestructive
                ? "bg-rose-600 hover:bg-rose-500"
                : "bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-semibold"
            }`}
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </div>,
    modalRoot
  );
}
