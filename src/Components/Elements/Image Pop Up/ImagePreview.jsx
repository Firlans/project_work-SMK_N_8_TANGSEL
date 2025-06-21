import { useEffect, useRef, useState } from "react";

const ImagePreview = ({ isOpen, onClose, imageUrl, caption }) => {
  const [isZoomed, setIsZoomed] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const startRef = useRef(null);
  const imageRef = useRef(null);

  useEffect(() => {
    const handleEsc = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  const handleZoomToggle = () => {
    if (isZoomed) {
      setPosition({ x: 0, y: 0 });
    }
    setIsZoomed(!isZoomed);
  };

  const handleMouseDown = (e) => {
    if (!isZoomed) return;
    setDragging(true);
    startRef.current = {
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    };
  };

  const handleMouseMove = (e) => {
    if (!dragging) return;
    setPosition({
      x: e.clientX - startRef.current.x,
      y: e.clientY - startRef.current.y,
    });
  };

  const handleMouseUp = () => {
    setDragging(false);
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn"
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onMouseMove={handleMouseMove}
    >
      {/* Background Close */}
      <div
        className="absolute inset-0"
        onClick={() => {
          setIsZoomed(false);
          onClose();
        }}
        aria-hidden="true"
      />

      {/* Image Container */}
      <div className="relative bg-white rounded-lg shadow-lg max-w-3xl w-full z-10 overflow-hidden group transition-all duration-300">
        {/* Close Button */}
        <button
          onClick={() => {
            setIsZoomed(false);
            onClose();
          }}
          className="absolute top-3 right-3 text-white bg-black/50 hover:bg-black/80 rounded-full p-1.5 z-20 transition"
          aria-label="Close"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        {/* Image */}
        <div
          className="cursor-zoom-in active:cursor-grabbing"
          onClick={handleZoomToggle}
          onMouseDown={handleMouseDown}
        >
          <img
            ref={imageRef}
            src={imageUrl}
            alt="Preview"
            className={`w-full max-h-[80vh] object-contain select-none transition-transform duration-300 ease-in-out
              ${isZoomed ? "cursor-grab scale-150" : "scale-100"}`}
            style={{
              transform: isZoomed
                ? `scale(1.5) translate(${position.x}px, ${position.y}px)`
                : "scale(1)",
              transition: dragging ? "none" : "transform 0.3s ease-in-out",
            }}
            draggable={false}
          />
        </div>

        {/* Optional Caption */}
        {caption && (
          <div className="p-3 border-t text-sm text-gray-600 text-center">
            {caption}
          </div>
        )}
      </div>
    </div>
  );
};

export default ImagePreview;
