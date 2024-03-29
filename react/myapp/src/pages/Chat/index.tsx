import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

interface Conversation {
  _id: number;
  otherUser: string;
  latestMessage: string;
}

const Chat: React.FC = () => {
  const navigate = useNavigate();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    // Simulating fetching conversations
    setTimeout(() => {
      const fetchedConversations: Conversation[] = [
        { _id: 1, otherUser: "John Doe", latestMessage: "Hello there!" },
        { _id: 2, otherUser: "Jane Smith", latestMessage: "How are you?" },
      ];
      setConversations(fetchedConversations);
      setIsLoading(false);
    }, 1000);
  }, []);

  const handleConversationClick = (id: number) => {
    // Simulating navigation to conversation
    console.log(`Navigating to conversation with ID: ${id}`);
  };

  return (
    <>
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <div className="w-full md:basis-1/3 rounded-xl md:rounded-tr-none md:rounded-br-none bg-white py-2 border-r-2 border-[rgba(0 , 0, 0, 0.8)] lg:fixed lg:h-[90vh] lg:w-[30vw] lg:bottom-0 lg:left-0">
          <div className="chat-friend-list h-full overflow-hidden ">
            <div className="w-full flex  flex-col justify-around relative">
              <div className="w-full flex justify-around ">
                <div className="flex items-center justify-center hover:bg-screen px-3 py-2 rounded-xl">
                  <span className={"font-bold xl:text-xl"}>Chat</span>
                </div>
              </div>
            </div>

            <div className="chat-sidebar w-full px-2">
              {conversations.map((conversation, index) => (
                <div
                  key={index}
                  onClick={() => handleConversationClick(conversation._id)}
                  className="cursor-pointer"
                >
                  <div className="chat-person w-full p-2 md:hover:bg-gray-200 md:rounded-xl overflow-hidden cursor-pointer">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 rounded-full overflow-hidden">
                        <img
                          src="https://via.placeholder.com/150"
                          alt="chat-friend-img"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <h6 className="font-semibold text-lg">
                          {conversation.otherUser}
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
