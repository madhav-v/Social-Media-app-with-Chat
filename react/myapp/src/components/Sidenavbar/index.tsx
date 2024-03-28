import { Link } from "react-router-dom";

const SideNavBar = () => {
  return (
    <>
      <div className="mt-2 flex flex-col h-full bg-white shadow-lg p-4 rounded-lg">
        <div className="mt-4">
          <img
            src="https://www.caltrain.com/files/images/2021-09/default.jpg"
            alt="Profile Image"
            className="rounded-3xl p-2 w-[300px] h-[300px] object-cover"
          />
        </div>
        <div className="mt-2 capitalize text-center">
          <p className="text-black text-xl font-semibold">Madhav Dhungana</p>
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
