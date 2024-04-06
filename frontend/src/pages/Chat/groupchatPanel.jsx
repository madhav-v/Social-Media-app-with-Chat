import { useEffect, useRef, useState } from "react";
import groupSvc from "../../services/groupChat.service";
import { useParams } from "react-router-dom";
import { RiSendPlaneFill } from "react-icons/ri";
import { FaCross, FaEdit, FaPlus, FaRegImage, FaTrash } from "react-icons/fa";
import authSvc from "../../services/auth.service";
import chatService from "../../services/chat.service";
import { formatDistanceToNow } from "date-fns";
import { MdCancel, MdDone } from "react-icons/md";
import ToastAlert from "../../components/Toast";
import { FaCircleInfo } from "react-icons/fa6";
import friendRequestService from "../../services/friendRequest.service";
import { Image } from "antd";

const GroupPanel = () => {
  const params = useParams();
  let id = params.id;
  const chatBoxRef = useRef(null);
  const fileInputRef = useRef(null);
  const [groups, setGroups] = useState([]);
  const [newMessageContent, setNewMessageContent] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [userId, setUserId] = useState();
  const [messages, setMessages] = useState([]);
  const [editingName, setEditingName] = useState(false);
  const [editedName, setEditedName] = useState("");
  const [showMemberModal, setShowMemberModal] = useState(false);
  const [groupMembers, setGroupMembers] = useState([]);
  const [groupAdmin, setGroupAdmin] = useState();
  const [addModal, setAddModal] = useState(false);
  const [friends, setFriends] = useState([]);
  const [selectedFriends, setSelectedFriends] = useState([]);
  useEffect(() => {
    const getLoggedInUser = async () => {
      try {
        const response = await authSvc.getLoggedInUser();
        setUserId(response.data.id);
      } catch (error) {
        console.error("Error fetching logged-in user:", error);
      }
    };

    getLoggedInUser();
  }, [id]);

  const handleEditName = () => {
    setEditingName(true);
    setEditedName(groups.chatName);
  };

  const handleEditClose = () => {
    setEditingName(false);
  };

  const handleSubmitName = async () => {
    try {
      let data = {
        chatId: id,
        chatName: editedName,
      };
      let response = await chatService.renameGroup(data);
      if (response) {
        ToastAlert("success", "Renamed Group Successfully");
      }
      setEditingName(false);
    } catch (error) {
      console.error("Error updating group name:", error);
    }
  };

  const scrollToBottom = () => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  };
  const getMessages = async () => {
    try {
      if (id) {
        const response = await chatService.getMessages(id);
        setMessages(response);
        scrollToBottom();
      }
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };
  useEffect(() => {
    const getGroupById = async () => {
      try {
        const response = await groupSvc.getGroupById(id);

        setGroupAdmin(response.groupAdmin);
        setGroups(response);
        setGroupMembers(response.users);
      } catch (error) {
        console.error("Error fetching group by id:", error);
      }
    };
    getGroupById();
  }, [id]);

  const sendMessage = async () => {
    try {
      let content = newMessageContent.trim();
      let data = {
        chatId: id,
        content,
        images: [],
      };
      if (selectedImage) {
        let formData = new FormData();
        formData.append("images", selectedImage);
        data.images = formData;
      }

      let response = await chatService.sendMessage(data);
      setNewMessageContent("");
      setSelectedImage(null);
      getMessages();
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  useEffect(() => {
    getMessages();
  }, [id]);
  const handleRemoveMember = async (memberId) => {
    try {
      let chatId = id;
      let userId = memberId;
      const response = await chatService.removeFromGroup({ chatId, userId });
      setGroupMembers(response.users);
      ToastAlert("success", "Member removed successfully");
    } catch (error) {
      console.error("Error removing member:", error);
      ToastAlert("error", "Failed to remove member");
    }
  };

  const handleToggleFriendSelection = (friendId) => {
    if (selectedFriends.includes(friendId)) {
      setSelectedFriends(selectedFriends.filter((id) => id !== friendId));
    } else {
      setSelectedFriends([...selectedFriends, friendId]);
    }
  };

  const handleAddMembersToGroup = async () => {
    try {
      const chatId = id;
      const userIds = selectedFriends;
      const response = await chatService.addToGroup({ chatId, userIds });
      setGroupMembers(response.users);
      setAddModal(false);
      setSelectedFriends([]);
      ToastAlert("success", "Members added successfully");
    } catch (error) {
      console.error("Error adding members:", error);
      ToastAlert("error", "Failed to add members");
    }
  };

  useEffect(() => {
    const fetchFriends = async () => {
      try {
        const response = await friendRequestService.getFriends();
        setFriends(response.friends);
      } catch (error) {
        console.error("Error fetching friends:", error);
      }
    };

    fetchFriends();
  }, []);

  return (
    <div className="w-[70%] ml-[30%] min-h-[90vh] md:h-full rounded-xl overflow-hidden relative md:rounded-tl-none md:rounded-bl-none">
      <div className="w-full h-full">
        <div className="flex justify-between items-center border-b-[1px] border-[rgba(0, 0, 0, 0.7)]">
          <div className="px-2 flex items-center justify-center basis-1/3">
            <div className="relative w-[50px] h-[50px] md:w-[70px] md:h-[70px]  rounded-[50%] ml-[-30%]"></div>
            <div className="flex items-center ml-2">
              {editingName ? (
                <>
                  <input
                    type="text"
                    value={editedName}
                    onChange={(e) => setEditedName(e.target.value)}
                  />
                  <button onClick={handleSubmitName}>
                    <MdDone
                      className="bg-red-500 rounded-full"
                      color="green"
                      size={25}
                    />
                  </button>
                  <button onClick={handleEditClose}>
                    <MdCancel color="red" size={25} />
                  </button>
                </>
              ) : (
                <>
                  <p className="ml-2 text-lg">{groups.chatName}</p>
                  <button onClick={handleEditName} className="ml-4">
                    <FaEdit size={25} color="red" />
                  </button>
                </>
              )}
            </div>
          </div>
          {showMemberModal ? (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
              <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md overflow-y-auto">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold">Group Members</h2>
                  <button
                    onClick={() => setShowMemberModal(false)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <MdCancel size={25} color="red" />
                  </button>
                </div>
                <ul>
                  {groupMembers.map((member) => (
                    <li
                      key={member.id}
                      className="flex items-center justify-between py-2"
                    >
                      <div className="flex items-center">
                        <div className="h-8 w-8 rounded-full bg-red-500 text-white flex items-center justify-center mr-3">
                          {member.firstName[0]}
                        </div>
                        <span>
                          {member.firstName} {member.lastName}
                        </span>
                      </div>
                      <button
                        onClick={() => handleRemoveMember(member.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        Remove
                      </button>
                    </li>
                  ))}
                </ul>
                <div className="mt-4">
                  <h3 className="text-lg font-semibold">Admin:</h3>
                  <p>
                    {groupAdmin.firstName} {groupAdmin.lastName}
                  </p>
                </div>
                <button
                  onClick={() => setAddModal(true)}
                  className="mt-4 bg-red-500 text-white py-2 px-4 rounded hover:bg-red-700"
                >
                  Add Members
                </button>
                {addModal && (
                  <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-50">
                    <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md overflow-y-auto">
                      <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-semibold">Add Members</h2>
                        <button
                          onClick={() => setAddModal(false)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <MdCancel size={25} color="red" />
                        </button>
                      </div>
                      <ul>
                        {friends.map((friend) => (
                          <li
                            key={friend.id}
                            className="flex items-center justify-between py-2"
                          >
                            <div className="flex items-center">
                              <input
                                type="checkbox"
                                className="mr-2 form-checkbox text-red-500 border-red-500"
                                checked={selectedFriends.includes(friend.id)}
                                onChange={() =>
                                  handleToggleFriendSelection(friend.id)
                                }
                              />
                              <span>
                                {friend.firstName} {friend.lastName}
                              </span>
                            </div>
                          </li>
                        ))}
                      </ul>
                      <div className="mt-4">
                        <button
                          onClick={handleAddMembersToGroup}
                          className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-700"
                        >
                          Add
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <FaCircleInfo
              size={25}
              color="red"
              className="mr-2 cursor-pointer"
              onClick={() => setShowMemberModal(true)}
            />
          )}
        </div>

        <div className="w-full h-[72vh]">
          <div className="chat-box w-full h-full flex flex-col-reverse overflow-y-auto">
            {messages
              .slice(0)
              .reverse()
              .map((message) => (
                <div
                  key={message.id}
                  className={`flex ${
                    message.sender.id === userId
                      ? "justify-end"
                      : "justify-start"
                  }`}
                >
                  <div
                    className={`p-2 mb-2 rounded-lg max-w-[70%] ${
                      message.sender.id === userId
                        ? "bg-red-500 text-white"
                        : "bg-red-500 ml-3 text-white"
                    }`}
                  >
                    {message.images.length > 0 ? (
                      <div className="max-w-[70%] h-[50%] mx-auto">
                        <Image
                          src={`${
                            import.meta.env.VITE_IMAGE_URL
                          }/${message.images[0].replace(/\\/g, "/")}`}
                          alt="Sent Image"
                          className="rounded-lg w-[50%]"
                        />
                      </div>
                    ) : (
                      <div
                        className={`mb-2 rounded-lg max-w-[70%] ${
                          message.sender.id === userId
                            ? "bg-red-500 text-white"
                            : "bg-red-500 ml-3 text-white"
                        }`}
                      >
                        <p className="text-black text-sm">
                          {message.sender.firstName}
                        </p>
                        <p>{message.content}</p>
                      </div>
                    )}

                    <div className="flex justify-between items-center mt-1">
                      <p className="text-xs text-black">
                        {formatDistanceToNow(new Date(message.createdAt), {
                          addSuffix: true,
                        })}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>

        <div className="chat-write absolute bg-screen bottom-2 left-0 mb-3 w-full flex items-center ml-1">
          <input
            type="text"
            placeholder="Send a message"
            value={newMessageContent}
            onChange={(e) => setNewMessageContent(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === "Enter") {
                sendMessage();
              }
            }}
            className="w-full border p-2 pt-2 bg-white text-lg rounded-3xl align-middle bg-screen"
          />
          <span
            onClick={sendMessage}
            className="ml-2 p-2 bg-red-500 text-white rounded-full cursor-pointer mr-4 hover:bg-red-700"
          >
            <RiSendPlaneFill className="text-xl" />
          </span>
        </div>
      </div>
    </div>
  );
};

export default GroupPanel;
