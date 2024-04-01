import React, { useState, useEffect } from "react";
import friendRequestService from "../../services/friendRequest.service";
import groupSvc from "../../services/groupChat.service";
import { useNavigate } from "react-router-dom";
import chatService from "../../services/chat.service";

const GroupChat = () => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [groupName, setGroupName] = useState("");
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [friends, setFriends] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [groupChats, setGroupChats] = useState([]);

  useEffect(() => {
    const fetchFriends = async () => {
      try {
        const response = await friendRequestService.getFriends();
        setFriends(response.friends);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching friends:", error);
      }
    };

    fetchFriends();
  }, []);

  const handleCreateGroup = async () => {
    if (!groupName.trim()) {
      console.error("Group name cannot be empty");
      return;
    }
    if (selectedMembers.length === 0) {
      console.error("Please select at least one member for the group");
      return;
    }
    let data = {
      name: groupName,
      users: selectedMembers,
    };
    const response = await chatService.createGroupChat(data);
    console.log(response);
    setGroupName("");
    setSelectedMembers([]);
    setIsModalOpen(false);
  };

  useEffect(() => {
    const getGroupChats = async () => {
      const response = await groupSvc.getGroupChats();
      setGroupChats(response);
      console.log(response);
    };

    getGroupChats();
  }, []);

  const handleCheckboxChange = (event) => {
    const { value, checked } = event.target;
    if (checked) {
      setSelectedMembers((prevSelectedMembers) => [
        ...prevSelectedMembers,
        value,
      ]);
    } else {
      setSelectedMembers((prevSelectedMembers) =>
        prevSelectedMembers.filter((memberId) => memberId !== value)
      );
    }
  };
  const handleGroupChatClick = (groupId) => {
    navigate(`/home/groupchat/${groupId}`);
  };

  return (
    <>
      <div className="w-full md:basis-1/3 rounded-xl md:rounded-tr-none md:rounded-br-none bg-white py-2 border-r-2 border-[rgba(0 , 0, 0, 0.8)] lg:fixed lg:h-[90vh] lg:w-[30vw] lg:bottom-0 lg:left-0">
        <div className="chat-friend-list h-full overflow-hidden ">
          <div className="w-full flex  flex-col justify-around relative">
            <div className="w-full flex justify-around ">
              <div className="flex items-center justify-center hover:bg-screen px-3 py-2 rounded-xl">
                <span
                  onClick={() => navigate("/home/chat")}
                  className={"font-bold xl:text-xl mr-10 cursor-pointer"}
                >
                  Chat
                </span>
                <span
                  onClick={() => navigate("/home/groupchat")}
                  className={"font-bold xl:text-xl cursor-pointer"}
                >
                  Group Chat
                </span>
              </div>
            </div>
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-red-500 m-2 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
            >
              Create Group
            </button>
            {isModalOpen && (
              <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center">
                <div className="bg-white p-4 rounded-lg">
                  <h2 className="text-xl font-bold mb-4">Create Group Chat</h2>
                  <div className="mb-4">
                    <label htmlFor="groupName" className="block mb-1">
                      Group Name:
                    </label>
                    <input
                      type="text"
                      id="groupName"
                      value={groupName}
                      onChange={(e) => setGroupName(e.target.value)}
                      className="border rounded-md p-2 w-full"
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block mb-1">Add Members:</label>
                    {friends.map((friend) => (
                      <div key={friend.id} className="flex items-center">
                        <input
                          type="checkbox"
                          id={`friend-${friend.id}`}
                          value={friend.id}
                          checked={selectedMembers.includes(friend.id)}
                          onChange={handleCheckboxChange}
                          className="mr-2"
                        />
                        <label htmlFor={`friend-${friend.id}`}>
                          {friend.firstName} {friend.lastName}
                        </label>
                      </div>
                    ))}
                  </div>
                  <div className="text-center">
                    <button
                      onClick={handleCreateGroup}
                      className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mr-2"
                    >
                      Create
                    </button>
                    <button
                      onClick={() => setIsModalOpen(false)}
                      className="bg-gray-400 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="chat-sidebar w-full px-2">
            {groupChats.map((groupChat) => (
              <div
                key={groupChat.id}
                className="p-2 cursor-pointer"
                onClick={() => handleGroupChatClick(groupChat.id)}
              >
                <div className="bg-white p-4 rounded-lg shadow-md">
                  <h2 className="text-xl font-bold">{groupChat.name}</h2>
                  <div className="flex flex-wrap">
                    <img
                      src=""
                      alt={groupChat.chatName}
                      className="w-10 h-10 rounded-full"
                    />
                    <p>{groupChat.chatName}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default GroupChat;
