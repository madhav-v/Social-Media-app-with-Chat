import authSvc from "../../services/auth.service";
import userSvc from "../../services/user.service";
import ToastAlert from "../../components/Toast";
import { VscDeviceCamera } from "react-icons/vsc";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

const EditProfile = () => {
  const { register, handleSubmit } = useForm();
  const [user, setUser] = useState();
  const [bio, setBio] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState("");
  const [selectedCoverImage, setSelectedCoverImage] = useState("");

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await authSvc.getLoggedInUser();
        setUser(response.data);
        setBio(response.data.bio);
      } catch (error) {
        console.log(error);
      }
    };

    fetchUserData();
  }, []);

  const handleBioChange = (e) => {
    setBio(e.target.value);
  };

  const handleSave = async () => {
    try {
      const response = await userSvc.addBio(bio);
      console.log(response);
      ToastAlert("success", "Bio added successfully");
      setBio(response.data.bio);
    } catch (exception) {
      console.log(exception);
    }
  };

  const onSubmit = async (data) => {
    try {
      setIsLoading(true);
      const response = await userSvc.addProfilePic(data);
      if (response) {
        console.log(response);
        ToastAlert("success", "Image uploaded successfully");
      } else {
        ToastAlert("error", "Something went wrong");
      }
    } catch (exception) {
      console.log(exception);
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmitCover = async (data) => {
    try {
      setIsLoading(true);
      const response = await userSvc.updateCoverPic(data);
      if (response) {
        console.log(response);
        ToastAlert("success", "Image uploaded successfully");
      } else {
        ToastAlert("error", "Something went wrong");
      }
    } catch (exception) {
      console.log(exception);
    }
  };
  useEffect(() => {
    if (user?.profilePic) {
      setSelectedImage(
        `${import.meta.env.VITE_IMAGE_URL}/${user?.profilePic.replace(
          /\\/g,
          "/"
        )}`
      );
    }
    if (user?.coverPic) {
      setSelectedCoverImage(
        `${import.meta.env.VITE_IMAGE_URL}/${user?.coverPic.replace(
          /\\/g,
          "/"
        )}`
      );
    }
  }, [user]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    const ext = file?.name.split(".").pop().toLowerCase();
    const supportedFormats = [
      "jpg",
      "jpeg",
      "png",
      "gif",
      "bmp",
      "webp",
      "svg",
    ];

    if (supportedFormats.includes(ext)) {
      const imageUrl = URL.createObjectURL(file);
      setSelectedImage(imageUrl);
      register("image", { value: file });
    } else {
      console.error("Unsupported file format");
    }
  };

  const handleCoverImageChange = (e) => {
    const file = e.target.files[0];
    const ext = file?.name.split(".").pop().toLowerCase();
    const supportedFormats = [
      "jpg",
      "jpeg",
      "png",
      "gif",
      "bmp",
      "webp",
      "svg",
    ];

    if (supportedFormats.includes(ext)) {
      const imageUrl = URL.createObjectURL(file);
      setSelectedCoverImage(imageUrl);
      register("coverPic", { value: file });
    } else {
      console.error("Unsupported file format");
    }
  };
  return (
    <>
      <div className="mt-[100px] capitalize border p-4 mb-5 max-w-2xl mx-auto flex justify-between rounded-md shadow-md">
        <div className="capitalize border p-4 rounded-md shadow-md mb-5 max-w-2xl mx-auto">
          <div className="w-full">
            <textarea
              className="w-full h-40 p-2 border border-gray-300 rounded-md"
              placeholder="Write your bio here..."
              value={bio}
              onChange={handleBioChange}
            />
            <div className="flex flex-col items-start ml-4">
              <div className="flex ">
                <button
                  className="bg-yellow-500 text-white px-4 py-2 rounded mr-2"
                  onClick={handleSave}
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="w-[35%] mb-5 mt-[6rem] border p-4 mx-auto flex justify-between shadow-md items-center rounded-3xl overflow-hidden">
        <form className="mx-auto" onSubmit={handleSubmit(onSubmit)}>
          <div className="w-full min-h-[50vh] h-full flex flex-col justify-center items-center bg-white">
            <h3 className="text-center font-semibold text-2xl mb-3">
              Profile photo.
            </h3>
            <input
              name="profilePic"
              type="file"
              accept="image/*"
              onChange={(e) => {
                handleImageChange(e);
                register("profilePic");
              }}
              style={{ display: "none" }}
              id="imageInput"
              ref={register()}
            />
            <label
              htmlFor="imageInput"
              className="relative w-[200px] h-[200px] rounded-[50%]"
            >
              <img
                className="rounded-full object-cover w-full h-full object-center"
                src={
                  selectedImage ||
                  "https://www.caltrain.com/files/images/2021-09/default.jpg"
                }
                alt=""
              />
              <span className="absolute right-0 bottom-0">
                <VscDeviceCamera size={30} />
              </span>
            </label>
            <button
              type="submit"
              className={`px-4 py-2 bg-red-500 rounded-xl text-white text-xl my-3 ${
                isLoading ? "opacity-50 cursor-not-allowed" : ""
              }`}
              disabled={isLoading}
            >
              {isLoading ? "Uploading..." : "Upload Photo"}
            </button>
          </div>
        </form>
      </div>
      <div className="w-[35%] mb-5 mt-[6rem] border p-4 mx-auto flex justify-between shadow-md items-center rounded-3xl overflow-hidden">
        <form className="mx-auto" onSubmit={handleSubmit(onSubmitCover)}>
          <div className="w-full min-h-[50vh] h-full flex flex-col justify-center items-center bg-white">
            <h3 className="text-center font-semibold text-2xl mb-3">
              Cover photo.
            </h3>
            <input
              name="coverPic"
              type="file"
              accept="image/*"
              onChange={(e) => {
                handleCoverImageChange(e);
                register("image");
              }}
              style={{ display: "none" }}
              id="coverImageInput"
              ref={register()}
            />
            <label
              htmlFor="coverImageInput"
              className="relative w-[200px] h-[200px] rounded-[50%]"
            >
              <img
                className="rounded-full object-cover w-full h-full object-center"
                src={
                  selectedCoverImage ||
                  "https://www.caltrain.com/files/images/2021-09/default.jpg"
                }
                alt=""
              />
              <span className="absolute right-0 bottom-0">
                <VscDeviceCamera size={30} />
              </span>
            </label>
            <button
              type="submit"
              className={`px-4 py-2 bg-red-500 rounded-xl text-white text-xl my-3 ${
                isLoading ? "opacity-50 cursor-not-allowed" : ""
              }`}
              disabled={isLoading}
            >
              {isLoading ? "Uploading..." : "Upload Photo"}
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default EditProfile;
