import { toast } from "react-hot-toast";

const ToastAlert = (variant, message) => {
  if (variant === "success") {
    return toast.success(message);
  } else if (variant === "error") {
    return toast.error(message);
  } else {
    return null;
  }
};
export default ToastAlert;
