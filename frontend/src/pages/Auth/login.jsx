import { useForm, Controller } from "react-hook-form";
import { NavLink, useNavigate } from "react-router-dom";
// import login from "/login.png";
import { useEffect, useState } from "react";
import TextField from "../../components/TextField";
import PasswordField from "../../components/PasswordField";
import Button from "../../components/Button";
import authSvc from "../../services/auth.service";
import ToastAlert from "../../components/Toast";
import Loading from "../../components/Loading";
import React from "react";
import { requestPermissionAndRetrieveToken } from "../../components/firebase";

const LoginPage = () => {
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
      const fcmToken = await requestPermissionAndRetrieveToken();
      console.log("token", fcmToken);
      let credentials = { ...data, fcm_token: fcmToken };
      let response = await authSvc.login(credentials);
      if (response.status) {
        let formattedData = {
          id: response.user.id,
          email: response.user.email,
        };
        localStorage.setItem("token", response.accessToken);
        localStorage.setItem("user", JSON.stringify(formattedData));
        ToastAlert("succeess", "Login Successful");
        navigate("/home");
      } else {
        ToastAlert("error", "Something went wrong");
      }
    } catch (exception) {
      setIsLoading(false);
      ToastAlert("error", "Something went wrong");
      console.log(exception);
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
          <h1 className="text-4xl font-semibold mb-6">Welcome Back</h1>
          <form className="w-full max-w-sm" onSubmit={handleSubmit(onSubmit)}>
            <Controller
              name="email"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <TextField
                  label="Email Address"
                  id="email"
                  name="email"
                  type="text"
                  placeholder="Enter your email"
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
            <div className="mt-2">
              <NavLink
                to="/forgetPassword"
                className="text-blue-500 hover:underline"
              >
                Forget Password
              </NavLink>
            </div>
            <Button text="Login" />
          </form>

          <div>
            Dont have an account?{" "}
            <NavLink to={"/register"} className="text-blue-500 hover:underline">
              Register
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

export default LoginPage;
