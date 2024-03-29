import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";

const PasswordField = ({
  id,
  name,
  value,
  onChange,
  showPassword,
  onTogglePassword,
  error,
  label = "Password",
}) => {
  return (
    <div className="mb-1 relative">
      <label htmlFor={id} className="block text-base mb-2">
        {label}
      </label>
      <input
        id={id}
        name={name}
        type={showPassword ? "text" : "password"}
        className="w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring focus:border-blue-300"
        value={value}
        onChange={onChange}
      />
      <button
        type="button"
        className="absolute top-[3.3rem] right-3 transform -translate-y-1/2 text-grey-500 font-semibold"
        onClick={onTogglePassword}
      >
        {showPassword ? (
          <AiFillEyeInvisible color="grey" />
        ) : (
          <AiFillEye color="grey" />
        )}
      </button>
      {error && (
        <span className="text-red-500  bottom-[-1.5rem] left-0">{error}</span>
      )}
    </div>
  );
};

export default PasswordField;
