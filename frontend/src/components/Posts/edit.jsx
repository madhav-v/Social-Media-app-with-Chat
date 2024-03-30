import React, { useState, useEffect } from "react";
import postSvc from "../../services/post.service";
import ToastAlert from "../Toast";

const EditPost = ({ postId, onClose }) => {
  const [content, setContent] = useState("");
  const [mediaFiles, setMediaFiles] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Fetch the post content and media files based on the postId
    const fetchPostData = async () => {
      try {
        const response = await postSvc.getPostById(postId);
        setContent(response.content);
        setMediaFiles(response.media.map((media) => ({ path: media })));
      } catch (error) {
        console.log(error);
      }
    };

    fetchPostData();
  }, [postId]);

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
      const response = await postSvc.updatePost(postId, formData);
      onClose(); // Close the edit popup after successful update
      ToastAlert("success", "Post Updated");
    } catch (error) {
      ToastAlert("error", "Cannot update post");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-4">
      <h2 className="text-xl font-bold mb-4">Edit Post</h2>
      <form onSubmit={handleSubmit}>
        <textarea
          value={content}
          onChange={handleContentChange}
          placeholder="Edit your post here..."
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
          {isLoading ? "Updating..." : "Update Post"}
        </button>
        <button
          onClick={onClose}
          className="bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600 ml-2"
        >
          Cancel
        </button>
      </form>
    </div>
  );
};

export default EditPost;
