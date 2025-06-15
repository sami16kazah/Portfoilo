import ReactDOM from "react-dom";
import { ReactNode, useEffect } from "react";
import { Button } from "./ui/button";
import React from "react";

// Define the prop types for the Modal component
interface ModalProps {
  onClose: () => void; // Corrected the typo from `onCLose` to `onClose`
  title?: string;
  description?: string;
  buttonDescription?: string;
  children?: ReactNode;
}

const Modal: React.FC<ModalProps> = ({
  onClose,
  title,
  description,
  buttonDescription,
  children,
}) => {
  useEffect(() => {
    // Add overflow-hidden class to the body when modal is open
    document.body.classList.add("overflow-hidden");

    // Clean up by removing the overflow-hidden class when modal is closed
    return () => {
      document.body.classList.remove("overflow-hidden");
    };
  }, []);

  // Ensure that the modal-container element exists in the DOM
  const modalRoot = document.querySelector(".modal-container");
  if (!modalRoot) return null;

  return ReactDOM.createPortal(
    <div className="fixed inset-0 z-50 flex justify-center items-center">
      {/* Overlay with opacity */}
      <div className="absolute inset-0 bg-black opacity-75" />
      {/* Modal content */}
      <div className="fixed p-10 bg-white rounded-3xl h-1/2 w-1/2">
        <div className="flex flex-col justify-center align-middle w-full h-full">
          <div className="flex flex-col justify-center align-middle w-full h-full">
            <div className="text-xl text-center font-sans font-bold">
              {title}
            </div>
            <div className="text-lg text-center font-sans mt-2">
              {description}
            </div>
          </div>
          <div className="flex justify-center">
            {children}
            <Button
              onClick={onClose}
              className="w-full bg-gray-600 hover:bg-black"
            >
              {buttonDescription}
            </Button>
          </div>
        </div>
      </div>
    </div>,
    modalRoot
  );
};

export default Modal;
