import { useEffect, useRef, useState } from "react";
import groupSvc from "../../services/groupChat.service";
import { useParams } from "react-router-dom";
import { RiSendPlaneFill } from "react-icons/ri";
import { FaEdit, FaRegImage } from "react-icons/fa";
import authSvc from "../../services/auth.service";
import chatService from "../../services/chat.service";
import { formatDistanceToNow } from "date-fns";
import { MdCancel, MdDone } from "react-icons/md";
import ToastAlert from "../../components/Toast";

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

        // console.log(response);
        setGroups(response);
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
