import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import chatService from "../../services/chat.service"; // Import the chat service
import authSvc from "../../services/auth.service";
import userSvc from "../../services/user.service"; // Import the user service
import friendRequestService from "../../services/friendRequest.service";
const Chat = () => {
  const navigate = useNavigate();
  const [conversations, setConversations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchLoggedInUser = async () => {
      try {
        const response = await authSvc.getLoggedInUser();
        setUser(response.data.id);
      } catch (error) {
        console.error("Error fetching logged-in user:", error);
      }
    };

    fetchLoggedInUser();
  }, []);

  useEffect(() => {
    const fetchFriends = async () => {
      try {
        const response = await friendRequestService.getFriends();
        setConversations(response.friends);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching conversations:", error);
      }
    };

    fetchFriends();
  }, []);

  const handleConversationClick = (chatId, userId) => {
    navigate(`/home/chat/${chatId}`);
  };

  return (
    <>
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <div className="w-full md:basis-1/3 rounded-xl md:rounded-tr-none md:rounded-br-none bg-white py-2 border-r-2 border-[rgba(0 , 0, 0, 0.8)] lg:fixed lg:h-[90vh] lg:w-[30vw] lg:bottom-0 lg:left-0">
          <div className="chat-friend-list h-full overflow-hidden">
            <div className="w-full flex  flex-col justify-around relative">
              <div className="w-full flex justify-around ">
                <div className="flex items-center justify-center hover:bg-screen px-3 py-2 rounded-xl">
                  <span
                    onClick={() => navigate("/home/chat")}
                    className="font-bold xl:text-xl mr-10 cursor-pointer transition duration-300 hover:shadow-md hover:text-gray-800"
                  >
                    Chat
                  </span>
                  <span
                    onClick={() => navigate("/home/groupchat")}
                    className="font-bold xl:text-xl cursor-pointer transition duration-300 hover:shadow-md hover:text-gray-800"
                  >
                    Group Chat
                  </span>
                </div>
              </div>
            </div>

            <div className="chat-sidebar w-full px-2">
              {conversations.map((conversation, index) => (
                <div
                  key={index}
                  onClick={() =>
                    handleConversationClick(conversation.id, conversation.id)
                  }
                  className="cursor-pointer"
                >
                  <div className="chat-person w-full p-2 md:hover:bg-gray-200 md:rounded-xl overflow-hidden cursor-pointer">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 rounded-full overflow-hidden">
                        <img
                          src={
                            conversation.profilePic
                              ? `${
                                  import.meta.env.VITE_IMAGE_URL
                                }/${conversation.profilePic.replace(
                                  /\\/g,
                                  "/"
                                )}`
                              : "https://via.placeholder.com/150"
                          }
                          alt="chat-friend-img"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <h6 className="font-semibold text-lg">
                          {conversation.firstName} {conversation.lastName}
                        </h6>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Chat;
