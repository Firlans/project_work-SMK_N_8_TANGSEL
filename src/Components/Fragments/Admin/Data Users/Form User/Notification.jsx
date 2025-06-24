const Notification = ({ notification }) => {
  if (!notification.show) return null;

  return (
    <div
      className={`fixed top-4 right-4 z-50 px-6 py-3 rounded-lg shadow-lg transform transition-all duration-500 ease-in-out
        ${notification.type === "success" ? "bg-green-500" : "bg-red-500"}
        text-white text-sm font-medium`}
    >
      {notification.message}
    </div>
  );
};

export default Notification;
