const ImagePreview = ({ isOpen, onClose, imageUrl }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center">
      <div className="bg-white p-4 rounded-lg relative max-w-lg w-full">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-600 hover:text-black text-xl font-bold"
        >
          ×
        </button>
        <img
          src={imageUrl}
          alt="Preview Bukti"
          className="w-full h-auto rounded"
        />
      </div>
    </div>
  );
};

export default ImagePreview;
