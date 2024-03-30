import React, { useEffect, useState, useRef } from "react";
import { MdSend } from "react-icons/md";
import { useParams } from "react-router-dom";
import chatService from "../../services/chat.service";

const ChatPanel = () => {
  const params = useParams();
  let id = params.id;
  const chatBoxRef = useRef(null);
  const [newMessageContent, setNewMessageContent] = useState("");
  const [conversationMessages, setConversationMessages] = useState([]);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await chatService.accessChat({ userId: id });
        console.log(response);
        setConversationMessages(response);
        scrollToBottom();
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };

    fetchMessages();
  }, [id]);

  const scrollToBottom = () => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  };

  // const sendMessage = async () => {
  //   if (newMessageContent.trim() !== "") {
  //     try {
  //       await chatService.accessChat({
  //         userId: id,
  //         content: newMessageContent,
  //       });
  //       const newMessage = {
  //         id: conversationMessages.length + 1,
  //         content: newMessageContent,
  //         sender: "You",
  //         timestamp: new Date().toLocaleTimeString(),
  //       };
  //       setConversationMessages([...conversationMessages, newMessage]);
  //       scrollToBottom();
  //       setNewMessageContent("");
  //     } catch (error) {
  //       console.error("Error sending message:", error);
  //     }
  //   }
  // };

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await chatService.getMessages(id); // Fetch messages for the selected chat id
        setMessages(response);
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };

    fetchMessages();
  }, [id]); // Fetch messages when chat id changes
  console.log("messages", messages);
  const sendMessage = async () => {
    try {
      await chatService.sendMessage(id, newMessage); // Send message to the selected chat id
      setNewMessage(""); // Clear the input field after sending message
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  return (
    <div className="w-[70%] ml-[30%] min-h-[90vh] md:h-full rounded-xl overflow-hidden relative md:rounded-tl-none md:rounded-bl-none">
      <div className="w-full h-full">
        {/* Chat content */}
        <div ref={chatBoxRef} className="w-full h-[72vh] overflow-y-auto p-4">
          {/* {conversationMessages.map((message) => (
            <div key={message.id} className="mb-4">
              <div className="font-semibold">{message.sender}</div>
              <div>{message.content}</div>
              <div className="text-sm text-gray-500">{message.timestamp}</div>
            </div>
          ))} */}
          {messages &&
            messages.map((message, index) => (
              <div key={index} className="message">
                <p>{message.content}</p>
                {/* Add more details like sender, timestamp, etc. if needed */}
              </div>
            ))}
        </div>
        {/* Input field to send messages */}
        <div className="chat-write absolute bg-screen bottom-2 left-0 mb-3 w-full flex items-center ml-1">
          <input
            type="text"
            placeholder="Send a message"
            value={newMessageContent}
            onChange={(e) => setNewMessageContent(e.target.value)}
            className="w-full border p-2 pt-2 bg-white text-lg rounded-3xl align-middle bg-screen"
          />
          {/* Send button */}
          <button
            onClick={sendMessage}
            className="ml-2 p-2 bg-red-500 text-white rounded-full cursor-pointer mr-4 hover:bg-red-700"
          >
            <MdSend className="text-xl" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatPanel;
