import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import chatService from "../../services/chat.service"; // Import the chat service
import authSvc from "../../services/auth.service";
import userSvc from "../../services/user.service"; // Import the user service

const Chat = () => {
  const navigate = useNavigate();
  const [conversations, setConversations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [searchResults, setSearchResults] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

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
    const fetchConversations = async () => {
      try {
        const response = await chatService.fetchChats();
        setConversations(response.result);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching conversations:", error);
      }
    };

    fetchConversations();
  }, []);

  const handleConversationClick = (chatId, userId) => {
    navigate(`/home/chat/${chatId}`);
  };

  const handleSearchChange = async (event) => {
    setSearchQuery(event.target.value);
    try {
      const results = await userSvc.searchUsers(searchQuery);
      setSearchResults(results);
    } catch (error) {
      console.error("Error searching users:", error);
    }
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
                  <span className={"font-bold xl:text-xl"}>Chat</span>
                </div>
              </div>
            </div>

            <div className="chat-sidebar w-full px-2">
              <input
                type="text"
                placeholder="Search users..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="p-2 rounded-md border border-gray-300"
              />
              {searchResults.length > 0 && (
                <ul className="absolute bg-white border border-gray-300 rounded-md mt-1 w-[50%]">
                  {searchResults.map((user) => (
                    <li
                      key={user.id}
                      className="py-2 px-4 hover:bg-gray-100 flex items-center justify-between cursor-pointer"
                      onClick={() => handleConversationClick(user.id)}
                    >
                      <span className="text-lg font-bold">
                        {user.firstName} {user.lastName}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
              {conversations.map((conversation, index) => (
                <div
                  key={index}
                  onClick={() =>
                    handleConversationClick(
                      conversation.id,
                      conversation.users[0].id
                    )
                  }
                  className="cursor-pointer"
                >
                  <div className="chat-person w-full p-2 md:hover:bg-gray-200 md:rounded-xl overflow-hidden cursor-pointer">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 rounded-full overflow-hidden">
                        <img
                          src={
                            conversation.users[0]?.profilePic
                              ? `${
                                  import.meta.env.VITE_IMAGE_URL
                                }/${conversation.users[0]?.profilePic.replace(
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
                          {conversation.isGroupChat && conversation.chatName
                            ? conversation.chatName
                            : `${conversation.users[0]?.firstName} ${conversation.users[0]?.lastName}`}
                        </h6>
                        <p className="text-sm">{conversation.latestMessage}</p>
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
