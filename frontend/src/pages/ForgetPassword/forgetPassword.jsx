import { useForm } from "react-hook-form";
import TextField from "../../components/TextField";
import Button from "../../components/Button";
import authSvc from "../../services/auth.service";

import Loading from "../../components/Loading";
import { useState } from "react";

const ResetPassword = () => {

  const [isLoading, setIsLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    // resolver: yupResolver(validationSchema),
  });

  const onSubmit = async (data) => {
    try {
      setIsLoading(true);
      const response = await authSvc.forgetPassword(data.email);
      localStorage.setItem("email", data.email);
      if (response.status) {
        ToastAlert("success", "Email sent");
      } else {
        ToastAlert("error", "Error sending mail");
      }
    } catch (exception) {
      ToastAlert("error", "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-screen justify-center items-center mx-5">
      {isLoading && <Loading />}
      <div className="bg-white p-8 rounded-lg flex flex-col items-center w-full md:w-3/5 lg:w-1/2 xl:w-1/3">
        <h1 className="text-3xl font-semibold mb-6">Enter your email</h1>
        <form className="w-full max-w-sm" onSubmit={handleSubmit(onSubmit)}>
          <TextField
            label="Email Address"
            id="email"
            name="email"
            type="text"
            {...register("email")}
            error={errors.email?.message}
          />
          <Button text="Send Email" />
        </form>
      </div>
      <div className="hidden md:block">
        {/* <img src={login} alt="Login" className="w-[40rem]" /> */}
      </div>
    </div>
  );
};

export default ResetPassword;
