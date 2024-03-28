const ErrorPage = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md text-center">
        <h1 className="text-4xl text-red-600 font-bold mb-4">Oops!</h1>
        <p className="text-lg text-gray-800">Page Not Found</p>
      </div>
    </div>
  );
};

export default ErrorPage;
