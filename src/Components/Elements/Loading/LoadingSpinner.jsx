const LoadingSpinner = ({text}) => {
  return (
    <div className="flex flex-col items-center justify-center
    fixed inset-0 bg-black/30 z-50 "
    >
      <div className="flex space-x-2">
        <span className="w-3 h-3 bg-indigo-700 dark:bg-amber-600 rounded-full animate-bounce [animation-delay:-0.15s]" />
        <span className="w-3 h-3 bg-indigo-700 dark:bg-amber-600 rounded-full animate-bounce" />
        <span className="w-3 h-3 bg-indigo-700 dark:bg-amber-600 rounded-full animate-bounce [animation-delay:-0.3s]" />
        <span className="w-3 h-3 bg-indigo-700 dark:bg-amber-600 rounded-full animate-bounce" />
        <span className="w-3 h-3 bg-indigo-700 dark:bg-amber-600 rounded-full animate-bounce [animation-delay:-0.45s]" />
      </div>
      <span className="mt-2 text-xs text-slate-900 dark:text-slate-100">{text}</span>
    </div>
  );
};

export default LoadingSpinner;
