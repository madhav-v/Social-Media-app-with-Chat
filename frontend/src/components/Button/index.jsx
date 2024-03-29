const Button = ({ text }) => {
  return (
    <button
      type="submit"
      className="w-full mb-4 mt-2 bg-red-500 hover:bg-red-600 text-white font-semibold py-2 rounded-lg focus:outline-none focus:ring focus:border-blue-300"
    >
      {text}
    </button>
  );
};

export default Button;
