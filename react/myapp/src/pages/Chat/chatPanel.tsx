import React, { useState } from "react";

function ChatPanel() {
  const [newMessageContent, setNewMessageContent] = useState("");

  return (
    <div className="max-w-md mx-auto bg-white rounded-lg overflow-hidden shadow-md">
      <div className="bg-gray-200 px-4 py-2 flex justify-between items-center">
        <div className="flex items-center">
          <img
            src={"profileAvatar"}
            alt="Profile"
            className="h-8 w-8 rounded-full mr-2"
          />
          <p className="font-semibold">John Doe</p>
        </div>
      </div>

      <div className="bg-gray-100 px-4 py-2 flex items-center">
        <input
          type="text"
          placeholder="Send a message"
          value={newMessageContent}
          onChange={(e) => setNewMessageContent(e.target.value)}
          className="flex-1 mr-2 py-2 px-4 rounded-full border border-gray-300 focus:outline-none focus:border-blue-500"
        />
        <button className="bg-blue-500 text-white px-4 py-2 rounded-full">
          Send
        </button>
      </div>
    </div>
  );
}

export default ChatPanel;
