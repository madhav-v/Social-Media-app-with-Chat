import React, { useEffect, useState } from "react";
import ToastAlert from "../../components/Toast";
import { useNavigate } from "react-router-dom";
import friendRequestService from "../../services/friendRequest.service";

function Connection() {
  const [requests, setRequests] = useState([]);

  const getFriendRequest = async () => {
    try {
      const response = await friendRequestService.getFriendRequest();
      setRequests(response.friendRequests);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getFriendRequest();
  }, []);

  const handleAccept = async (id) => {
    const response = await friendRequestService.acceptFriendRequest(id);
    console.log(response);
    ToastAlert("success", "Friend Request Accepted");
  };

  const handleReject = async (id) => {
    const response = await friendRequestService.deleteFriendRequest(id);
    console.log(response);
    ToastAlert("success", "Friend Request Rejected");
  };
  return (
    <>
      <div className="w-full min-h-screen bg-screen pt-[10vh] mt-2">
        <div className="flex w-[80%] mx-auto flex-col my-3 rounded-xl">
          <div className="px-2 border-b-2 border-[rgba(0, 0, 0, 0.6)] flex justify-between py-1">
            <h2 className="text-lg font-bold text-[rgba(0, 0, 0, 0.6)] xl:text-xl mx-2 ">
              Friend Request
            </h2>
          </div>
          <div className="w-full">
            {requests.map((request) => (
              <div key={request.id}>
                {/* Notification Card */}
                <div className="flex items-center justify-between p-4 border-b border-[rgba(0,0,0,0.4)] my-4">
                  <div className="flex items-center">
                    <div className="w-16 h-16 px-2 py-2 rounded-full overflow-hidden">
                      <img
                        src={
                          request.sender.profilePic
                            ? `${
                                import.meta.env.VITE_IMAGE_URL
                              }/${request.sender.profilePic.replace(
                                /\\/g,
                                "/"
                              )}`
                            : "https://www.caltrain.com/files/images/2021-09/default.jpg"
                        }
                        alt="Profile"
                        className="w-full h-full object-cover object-center rounded-full"
                      />
                    </div>
                    <div className="ml-4 flex flex-col">
                      <h1 className="font-bold text-xl">{`${request.sender.firstName} ${request.sender.lastName}`}</h1>
                    </div>
                  </div>
                  <div className="flex flex-col ml-4">
                    <button
                      onClick={() => handleAccept(request.id)}
                      className="text-white border bg-green-500 px-3 py-1 rounded w-[10rem]"
                    >
                      Accept
                    </button>
                    <button
                      onClick={() => handleReject(request.id)}
                      className="text-white bg-red-500 px-3 py-1 rounded mt-2"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

export default Connection;
