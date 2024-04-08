import React, { useState } from "react";
import axios from "axios";
import postSvc from "../../services/post.service";
import ToastAlert from "../Toast";

const CreatePost = () => {
  const [content, setContent] = useState("");
  const [mediaFiles, setMediaFiles] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const handleContentChange = (e) => {
    setContent(e.target.value);
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setMediaFiles(files);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData();
    formData.append("content", content);
    mediaFiles.forEach((file) => formData.append("media", file));

    try {
      const response = await postSvc.createPost(formData);
      setShowForm(false);
      ToastAlert("success", "Post Created");
    } catch (error) {
      ToastAlert("error", "Cannot create post");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreatePostClick = () => {
    setShowForm(true);
  };

  const handleCancel = () => {
    setShowForm(false);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg w-[50%] p-4 mb-4 mx-auto">
      {!showForm && (
        <button
          onClick={handleCreatePostClick}
          className="bg-red-500 mx-a text-white py-2 px-4 rounded hover:bg-red-600"
        >
          Create Post
        </button>
      )}
      {showForm && (
        <>
          <h2 className="text-xl font-bold mb-4">Create Post</h2>
          <form onSubmit={handleSubmit}>
            <textarea
              value={content}
              onChange={handleContentChange}
              placeholder="Write your post here..."
              className="w-full p-2 mb-4 border rounded-lg"
              rows={4}
            />
            <input
              type="file"
              onChange={handleFileChange}
              accept="image/*, video/*"
              multiple
              className="mb-4"
            />
            <button
              type="submit"
              className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600"
              disabled={!content || isLoading}
            >
              {isLoading ? "Creating..." : "Create Post"}
            </button>
            <button
              type="button"
              onClick={handleCancel}
              className="bg-gray-300 text-gray-800 py-2 px-4 rounded hover:bg-gray-400 ml-2"
            >
              Cancel
            </button>
          </form>
        </>
      )}
    </div>
  );
};

export default CreatePost;
