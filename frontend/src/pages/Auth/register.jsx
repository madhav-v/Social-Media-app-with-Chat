import { useForm, Controller } from "react-hook-form";
// import login from "/login.png";
import { NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";
import TextField from "../../components/TextField";
import PasswordField from "../../components/PasswordField";
import Button from "../../components/Button";
import authSvc from "../../services/auth.service";
import ToastAlert from "../../components/Toast";
import Loading from "../../components/Loading";

const RegisterPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const {
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      let response = await authSvc.register(data);
      if (response) {
        ToastAlert("success", "Registration Successful. Login to continue");
        navigate("/");
      }
    } catch (exception) {
      setIsLoading(false);
      ToastAlert("error", "Something Went Wrong");
      throw exception;
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <>
      <div className="flex h-screen justify-center items-center mx-5">
        {isLoading && <Loading />}
        <div className="bg-white p-8 rounded-lg flex flex-col items-center w-full md:w-3/5 lg:w-1/2 xl:w-1/3">
          <h1 className="text-4xl font-semibold mb-6">Create an Account</h1>
          <form className="w-full max-w-sm" onSubmit={handleSubmit(onSubmit)}>
            <Controller
              name="firstName"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <TextField
                  label="First Name"
                  id="firstName"
                  name="firstName"
                  placeholder=""
                  type="text"
                  value={field.value}
                  onChange={(e) => {
                    setValue("firstName", e.target.value);
                    field.onChange(e);
                  }}
                  error={errors.firstName?.message}
                />
              )}
              rules={{ required: "Required" }}
            />
            <Controller
              name="lastName"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <TextField
                  label="Last Name"
                  id="lastName"
                  name="lastName"
                  placeholder=""
                  type="text"
                  value={field.value}
                  onChange={(e) => {
                    setValue("lastName", e.target.value);
                    field.onChange(e);
                  }}
                  error={errors.lastName?.message}
                />
              )}
              rules={{ required: "Required" }}
            />
            <Controller
              name="email"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <TextField
                  label="Email Address"
                  id="email"
                  name="email"
                  placeholder="Enter your email"
                  type="text"
                  value={field.value}
                  onChange={(e) => {
                    setValue("email", e.target.value);
                    field.onChange(e);
                  }}
                  error={errors.email?.message}
                />
              )}
              rules={{
                required: "Required",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
                  message: "Invalid email address",
                },
              }}
            />
            <Controller
              name="password"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <PasswordField
                  id="password"
                  name="password"
                  value={field.value}
                  onChange={(e) => {
                    setValue("password", e.target.value);
                    field.onChange(e);
                  }}
                  showPassword={showPassword}
                  onTogglePassword={togglePasswordVisibility}
                  error={errors.password?.message}
                />
              )}
              rules={{
                required: "Required",
                minLength: {
                  value: 6,
                  message: "Password must be at least 6 characters",
                },
              }}
            />

            <Button text="Register" />
          </form>
          <div>
            Already have an account?{" "}
            <NavLink to={"/"} className="text-blue-500 hover:underline">
              Login
            </NavLink>
          </div>
        </div>
        <div className="hidden md:block ">
          {/* <img src={login} alt="Login" className="w-[40rem]" /> */}
        </div>
      </div>
    </>
  );
};

export default RegisterPage;
