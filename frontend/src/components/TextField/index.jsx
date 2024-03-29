const TextField = ({
  id,
  name,
  type,
  label,
  placeholder,
  value,
  onChange,
  error,
}) => {
  return (
    <div className="mb-1">
      <label htmlFor={id} className="block text-base mb-2">
        {label}
      </label>
      <input
        id={id}
        name={name}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring focus:border-blue-300"
      />
      <span className="text-red-500">{error}</span>
    </div>
  );
};

export default TextField;
