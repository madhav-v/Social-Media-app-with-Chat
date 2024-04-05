import React, { useEffect, useState, useRef } from "react";
import { MdSend } from "react-icons/md";
import { Link, useParams } from "react-router-dom";
import chatService from "../../services/chat.service";
import { RiSendPlaneFill } from "react-icons/ri";
import { Image } from "antd";
import userSvc from "../../services/user.service";
import authSvc from "../../services/auth.service";
import { formatDistanceToNow } from "date-fns";
import { FaRegImage } from "react-icons/fa";

const ChatPanel = () => {
  const params = useParams();
  let id = params.id;
  const chatBoxRef = useRef(null);
  const fileInputRef = useRef(null);
  const [conversationMessages, setConversationMessages] = useState([]);
  const [userId, setUserId] = useState();
  const [chatId, setChatId] = useState();
  const [messages, setMessages] = useState([]);
  const [newMessageContent, setNewMessageContent] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await chatService.accessChat({ userId: id });
        // console.log("response", response);
        // setConversationMessages(response);
        setChatId(response.id);
        scrollToBottom();
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };

    const getLoggedInUser = async () => {
      try {
        const response = await authSvc.getLoggedInUser();
        setUserId(response.data.id);
      } catch (error) {
        console.error("Error fetching logged-in user:", error);
      }
    };

    const getUserById = async () => {
      try {
        const response = await authSvc.getUserById(id);
        // console.log("response", response);
        setConversationMessages(response.user);
        scrollToBottom();
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };

    getLoggedInUser();
    fetchMessages();
    getUserById();
  }, [id]);
  const getMessages = async () => {
    try {
      if (chatId) {
        const response = await chatService.getMessages(chatId);
        setMessages(response);
        scrollToBottom();
      }
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  useEffect(() => {
    getMessages();
  }, [chatId, messages]);

  const scrollToBottom = () => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  };

  const sendMessage = async () => {
    try {
      let content = newMessageContent.trim();
      let data = {
        chatId,
        content,
        images: [],
      };
      if (selectedImage) {
        let formData = new FormData();
        formData.append("images", selectedImage);
        data.images = formData;
      }
      console.log("img", data.images);
      console.log("data", data);
      let response = await chatService.sendMessage(data);
      console.log("message response", response);
      setNewMessageContent("");
      setSelectedImage(null);
      getMessages();
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };
  // console.log(selectedImage);
  // console.log("chatid0", chatId);
  // console.log("messages", messages);
  return (
    <div className="w-[70%] ml-[30%] min-h-[90vh] md:h-full rounded-xl overflow-hidden relative md:rounded-tl-none md:rounded-bl-none">
      <div className="w-full h-full">
        <div className="flex justify-between items-center border-b-[1px] border-[rgba(0, 0, 0, 0.7)]">
          <div className="px-2 flex items-center justify-center basis-1/3">
            <div className="relative w-[50px] h-[50px] md:w-[70px] md:h-[70px]  rounded-[50%] ml-[-30%]">
              <img
                src={
                  conversationMessages && conversationMessages?.profilePic
                    ? `${
                        import.meta.env.VITE_IMAGE_URL
                      }/${conversationMessages?.profilePic.replace(/\\/g, "/")}`
                    : "https://via.placeholder.com/150"
                }
                className="w-full h-full object-cover object-center rounded-[50%]"
                alt="chat-profile"
              />
            </div>
            <div className="">
              <Link
                to={`/home/friends/${
                  conversationMessages && conversationMessages?.id
                }`}
              >
                <div className="flex items-center ml-2">
                  <p className="ml-2 text-lg">
                    {conversationMessages && conversationMessages?.firstName}{" "}
                    {conversationMessages && conversationMessages?.lastName}
                  </p>
                </div>
              </Link>
            </div>
          </div>
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
                        <p>{message.content}</p>
                      </div>
                    )}

                    <div className="flex justify-between items-center mt-1">
                      <p className="text-xs text-black">
                        {formatDistanceToNow(new Date(message.createdAt), {
                          addSuffix: true,
                        })}
                      </p>
                      {/* Add additional content here */}
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>

        <div className="chat-write absolute bg-screen bottom-2 left-0 mb-3 w-full flex items-center ml-1">
          <input
            ref={fileInputRef}
            id="fileInput"
            type="file"
            accept="image/*"
            style={{ display: "none" }}
            onChange={(e) => {
              if (e.target.files.length > 0) {
                setSelectedImage(e.target.files[0]);
                fileInputRef.current.value = "";
              }
            }}
          />

          {/* <span
            onClick={() => fileInputRef.current.click()}
            className="ml-2 p-2 bg-red-500 text-white rounded-full cursor-pointer hover:bg-red-700"
          > */}
          <label
            htmlFor="fileInput"
            className="ml-2 p-2 bg-red-500 text-white rounded-full cursor-pointer hover:bg-red-700"
          >
            <FaRegImage className="text-xl" />
          </label>
          {/* </span> */}
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

export default ChatPanel;
