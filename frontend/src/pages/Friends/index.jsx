import React, { useEffect, useState } from "react";
import ToastAlert from "../../components/Toast";
import { Link, useNavigate } from "react-router-dom";
import friendRequestService from "../../services/friendRequest.service";

function Friends() {
  const [friends, setFriends] = useState([]);

  const getFriends = async () => {
    try {
      const response = await friendRequestService.getFriends();
      setFriends(response.friends);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getFriends();
  }, []);

  return (
    <div className="w-full min-h-screen bg-screen pt-[10vh] mt-2">
      <div className="flex w-[80%] mx-auto flex-col my-3 rounded-xl">
        <div className="px-2 border-b-2 border-[rgba(0, 0, 0, 0.6)] flex justify-between py-1">
          <h2 className="text-lg font-bold text-[rgba(0, 0, 0, 0.6)] xl:text-xl mx-2">
            My Friends
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          {friends.length > 0 &&
            friends.map((friend) => (
              <Link
                key={friend.id}
                to={`/home/friends/${friend.id}`} // Navigate to friend profile page with friend's ID
                className="max-w-sm mx-auto bg-white shadow-lg rounded-lg overflow-hidden"
              >
                <div
                  key={friend.id}
                  className="max-w-sm mx-auto bg-white shadow-lg rounded-lg overflow-hidden"
                >
                  <div className="flex justify-center">
                    <img
                      className="w-32 h-32 object-cover object-center rounded-full mt-5"
                      src={
                        `${
                          import.meta.env.VITE_IMAGE_URL
                        }/${friend?.profilePic.replace(/\\/g, "/")}` ||
                        "https://www.caltrain.com/files/images/2021-09/default.jpg"
                      }
                      alt="Profile"
                    />
                  </div>
                  <div className="py-5 px-6">
                    <h1 className="text-center font-bold text-xl mb-2">
                      {friend.firstName} {friend.lastName}
                    </h1>
                    <p className="text-center text-gray-600 text-sm">
                      {friend?.bio}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
        </div>
      </div>
    </div>
  );
}

export default Friends;
