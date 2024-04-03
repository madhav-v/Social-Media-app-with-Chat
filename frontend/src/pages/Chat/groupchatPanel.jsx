import { useEffect, useRef, useState } from "react";
import groupSvc from "../../services/groupChat.service";
import { useParams } from "react-router-dom";
import { RiSendPlaneFill } from "react-icons/ri";
import { FaEdit, FaPlus, FaRegImage, FaTrash } from "react-icons/fa";
import authSvc from "../../services/auth.service";
import chatService from "../../services/chat.service";
import { formatDistanceToNow } from "date-fns";
import { MdCancel, MdDone } from "react-icons/md";
import ToastAlert from "../../components/Toast";
import { FaCircleInfo } from "react-icons/fa6";

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
  }, []);

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
  }, []);
  console.log(groupMembers);
  const handleRemoveMember = async (memberId) => {
    try {
      console.log(memberId);
      // Implement remove member functionality
      // const response = await groupSvc.removeMember(id, memberId);
      // Update group members state
      // setGroupMembers(response.members);
      ToastAlert("success", "Member removed successfully");
    } catch (error) {
      console.error("Error removing member:", error);
      ToastAlert("error", "Failed to remove member");
    }
  };

  const handleAddMember = async () => {
    try {
      // Implement add member functionality
      // Show add member dialog or input field
    } catch (error) {
      console.error("Error adding member:", error);
      ToastAlert("error", "Failed to add member");
    }
  };

  return (
    <div className="w-[70%] ml-[30%] min-h-[90vh] md:h-full rounded-xl overflow-hidden relative md:rounded-tl-none md:rounded-bl-none">
      <div className="w-full h-full">
        <div className="flex justify-between items-center border-b-[1px] border-[rgba(0, 0, 0, 0.7)]">
          <div className="px-2 flex items-center justify-center basis-1/3">
            <div className="relative w-[50px] h-[50px] md:w-[70px] md:h-[70px]  rounded-[50%] ml-[-30%]"></div>
            <div className="flex items-center ml-2">
              {/* <p className="ml-2 text-lg">{groups.chatName}</p> */}
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
            <div className="modal-overlay mr-5 bg-[white] h-full w-[280px] rounded shadow-xl p-6 absolute z-10 top-0 -right-1">
              <div className="modal ">
                <span
                  className="close cursor-pointer absolute right-0 top-3"
                  onClick={() => setShowMemberModal(false)} // Close member modal
                >
                  <MdCancel size={26} color="red" className="m-1" />
                </span>
                <div className="mt-4 flex flex-col justify-between  ">
                  {" "}
                  <div>
                    {" "}
                    <h2 className="text-2xl font-semibold mb-3">
                      Group Members :
                    </h2>
                    <ul className="mt-8">
                      {groupMembers.map((member) => (
                        <li key={member.id} className="my-3 ">
                          <span className=" text-base font-medium flex items-center  gap-4">
                            <span className="w-10 h-10 bg-[red]  rounded-full text-[white] text-xl pl-3 pt-1">
                              {/* <img
                              src={`${
                                import.meta.env.VITE_IMAGE_URL
                              }/${member?.profilePic.replace(/\\/g, "/")}`}
                              alt="Image"
                              className="h-10"
                            /> */}
                              {member.firstName[0]}
                            </span>{" "}
                            <span className="whitespace-nowrap">
                              {member.firstName} {member.lastName}
                            </span>
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <h3 className="mt-4">
                    {" "}
                    <span className="text-xl italic font-semibold mr-1">
                      Admin:
                    </span>{" "}
                    <span className="text-gray-500 text-lg font-medium ">
                      {" "}
                      {groupAdmin.firstName} {groupAdmin.lastName}
                    </span>
                  </h3>
                </div>
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
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.sender.id === userId ? "justify-end" : "justify-start"
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
                      <img
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
