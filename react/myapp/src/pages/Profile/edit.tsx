// import React, { Ref, useEffect, useState } from "react";
// import authSvc from "../../services/auth.service";
// import userSvc from "../../services/user.service";
// import { ToastAlert } from "../../components/Toast";
// import { VscDeviceCamera } from "react-icons/vsc";
// import { RegisterOptions, useForm } from "react-hook-form";

// interface User {
//   id: number;
//   firstName: string;
//   lastName: string;
//   email: string;
//   bio: string;
//   profilePic: string;
//   coverPic: string;
// }
// type Register = (name: string, options?: RegisterOptions) => void;
// const EditProfile = () => {
//   const { register, handleSubmit } = useForm();
//   const [user, setUser] = useState<User | null>(null);
//   const [bio, setBio] = useState("");
//   const [isLoading, setIsLoading] = useState(false);
//   const [selectedImage, setSelectedImage] = useState("");

//   useEffect(() => {
//     const fetchUserData = async () => {
//       try {
//         const response = await authSvc.getLoggedInUser();
//         setUser(response.data);
//         setBio(response.data.bio);
//       } catch (error) {
//         console.log(error);
//       }
//     };

//     fetchUserData();
//   }, []);

//   const handleBioChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
//     setBio(e.target.value);
//   };

//   const handleSave = async () => {
//     try {
//       const response = await userSvc.addBio(bio);
//       console.log(response);
//       ToastAlert("success", "Bio added successfully");
//       setBio(response.data.bio);
//     } catch (exception: any) {
//       console.log(exception);
//     }
//   };

//   const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (file) {
//       const ext = file.name.split(".").pop()?.toLowerCase(); // Add null check with `?.`
//       const supportedFormats = [
//         "jpg",
//         "jpeg",
//         "png",
//         "gif",
//         "bmp",
//         "webp",
//         "svg",
//       ];

//       if (ext && supportedFormats.includes(ext)) {
//         // Add null check for `ext`
//         const imageUrl = URL.createObjectURL(file) as string; // Type assertion
//         setSelectedImage(imageUrl);
//       } else {
//         console.error("Unsupported file format");
//       }
//     }
//   };

//   const onSubmit = async (data: Record<string, any>) => {
//     try {
//       setIsLoading(true);
//       const formData = new FormData();
//       formData.append("profilePic", data.profilePic[0]); // Assuming profilePic is the name of the field
//       const file = data.profilePic[0] as File; // Extract the file from the FormData
//       const response = await userSvc.addProfilePic(file); // Pass the file directly
//       if (response) {
//         ToastAlert("success", "Image uploaded successfully");
//       } else {
//         ToastAlert("error", "Something went wrong");
//       }
//     } catch (exception) {
//       console.log(exception);
//     } finally {
//       setIsLoading(false);
//     }
//   };
//   return (
//     <>
//       <div className="mt-[100px] capitalize border p-4 mb-5 max-w-2xl mx-auto flex justify-between rounded-md shadow-md">
//         <div className="capitalize border p-4 rounded-md shadow-md mb-5 max-w-2xl mx-auto">
//           <div className="w-full">
//             <textarea
//               className="w-full h-40 p-2 border border-gray-300 rounded-md"
//               placeholder="Write your bio here..."
//               value={bio}
//               onChange={handleBioChange}
//             />
//             <div className="flex flex-col items-start ml-4">
//               <div className="flex ">
//                 <button
//                   className="bg-yellow-500 text-white px-4 py-2 rounded mr-2"
//                   onClick={handleSave}
//                 >
//                   Save
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>

//         <div className="w-[35%] mb-5 mt-[6rem] border p-4 mx-auto flex justify-between shadow-md items-center rounded-3xl overflow-hidden">
//           <form className="mx-auto" onSubmit={handleSubmit(onSubmit)}>
//             <div className="w-full min-h-[50vh] h-full flex flex-col justify-center items-center bg-white">
//               <h3 className="text-center font-semibold text-2xl mb-3">
//                 Profile photo.
//               </h3>
//               <input
//                 name="profilePic"
//                 type="file"
//                 accept="image/*"
//                 onChange={handleImageChange}
//                 style={{ display: "none" }}
//                 id="imageInput"
//                 ref={register as Ref<HTMLInputElement>}
//               />
//               <label
//                 htmlFor="imageInput"
//                 className="relative w-[200px] h-[200px] rounded-[50%]"
//               >
//                 <img
//                   className="rounded-full object-cover w-full h-full object-center"
//                   src={
//                     `${
//                       import.meta.env.VITE_IMAGE_URL
//                     }/${user?.profilePic.replace(/\\/g, "/")}` ||
//                     "https://www.caltrain.com/files/images/2021-09/default.jpg"
//                   }
//                   alt=""
//                 />
//                 <span className="absolute right-0 bottom-0">
//                   <VscDeviceCamera size={30} />
//                 </span>
//               </label>
//               <button
//                 type="submit"
//                 className={`px-4 py-2 bg-red-500 rounded-xl text-white text-xl my-3 ${
//                   isLoading ? "opacity-50 cursor-not-allowed" : ""
//                 }`}
//                 disabled={isLoading}
//               >
//                 {isLoading ? "Uploading..." : "Upload Photo"}
//               </button>
//             </div>
//           </form>
//         </div>
//       </div>
//     </>
//   );
// };

// export default EditProfile;
