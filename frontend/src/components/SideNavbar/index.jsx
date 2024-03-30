import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import authSvc from "../../services/auth.service";

const SideNavBar = () => {
  const [user, setUser] = useState();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await authSvc.getLoggedInUser();
        console.log("response", response);

        setUser(response.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchUserData();
  }, []);

  console.log(user);

  return (
    <>
      <div className="mt-2 flex flex-col h-full bg-white shadow-lg p-4 rounded-lg">
        <div className="mt-4">
          {user && user.profilePic ? (
            <img
              src={`${import.meta.env.VITE_IMAGE_URL}/${user.profilePic.replace(
                /\\/g,
                "/"
              )}`}
              alt="Profile Image"
              className="rounded-3xl p-2 w-[300px] h-[300px] object-cover"
            />
          ) : (
            <img
              src="https://www.caltrain.com/files/images/2021-09/default.jpg"
              alt="Default Profile Image"
              className="rounded-3xl p-2 w-[300px] h-[300px] object-cover"
            />
          )}
        </div>
        <div className="mt-2 capitalize text-center">
          <p className="text-black text-xl font-semibold">
            {user?.firstName} {user?.lastName}
          </p>
        </div>
        <div className="flex flex-col p-2 mt-1 text-center">
          <Link
            to="/home/friends"
            className="text-blue-500 text-lg hover:underline"
          >
            View Friends
          </Link>
          <Link
            to="/home/profile"
            className="text-blue-500 text-lg hover:underline"
          >
            View Your Profile
          </Link>
          <Link
            to="/home/editProfile"
            className="text-blue-500 text-lg mb-2 hover:underline"
          >
            Edit Your Profile
          </Link>
        </div>
      </div>
    </>
  );
};

export default SideNavBar;
