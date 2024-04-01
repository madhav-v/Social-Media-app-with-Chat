import { useForm } from "react-hook-form";
import TextField from "../../components/TextField";
import Button from "../../components/Button";
import authSvc from "../../services/auth.service";
import ToastAlert from "../../components/Toast";
import Loading from "../../components/Loading";
import { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";

const ResetPassword = () => {
  const [isLoading, setIsLoading] = useState(false);
  const formik = useFormik({
    initialValues: {
      email: "",
    },
    validationSchema: Yup.object({
      email: Yup.string().email("Invalid email address").required("Required"),
    }),
    onSubmit: async (values) => {
      try {
        setIsLoading(true);
        console.log(values);
        const response = await authSvc.forgetPassword(values);

        if (response) {
          ToastAlert("success", "Please check your mail");
        }
      } catch (exception) {
        ToastAlert("error", "Something Went Wrong");
        setIsLoading(false);
      } finally {
        setIsLoading(false);
      }
    },
  });

  return (
    <div className="flex h-screen justify-center items-center mx-5">
      {isLoading && <Loading />}
      <div className="bg-white p-8 rounded-lg flex flex-col items-center w-full md:w-3/5 lg:w-1/2 xl:w-1/3">
        <h1 className="text-3xl font-semibold mb-6">Enter your email</h1>
        <form className="w-full max-w-sm" onSubmit={formik.handleSubmit}>
          <TextField
            label="Email Address"
            id="email"
            name="email"
            type="text"
            value={formik.values.email}
            onChange={formik.handleChange}
            error={formik.errors.email}
          />
          <Button text="Send Email" />
        </form>
      </div>
      <div className="hidden md:block ">
        {/* <img src={login} alt="Login" className="w-[40rem]" /> */}
      </div>
    </div>
  );
};

export default ResetPassword;
