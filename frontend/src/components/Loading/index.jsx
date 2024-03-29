const Loading = () => {
  return (
    <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-white z-50">
      <div className="animate-spin rounded-full h-20 w-20 border-t-2 border-b-2 border-red-500"></div>
    </div>
  );
};

export default Loading;
