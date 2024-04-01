import { useEffect, useState } from "react";
import postSvc from "../../services/post.service";
import { Link } from "react-router-dom";
import { FaCommentDots, FaHeart } from "react-icons/fa";
import ToastAlert from "../Toast";
import { IoIosShareAlt } from "react-icons/io";

const Posts = () => {
  const [posts, setPosts] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);
  const [commentText, setCommentText] = useState("");

  const allPosts = async () => {
    try {
      const postResponse = await postSvc.getAllPosts();
      setPosts(postResponse.data);
    } catch (exception) {
      console.log(exception);
    }
  };

  const handleLike = async (postId) => {
    try {
      console.log(postId);
      const likesResponse = await postSvc.likePost(postId);
      if (!likesResponse) {
        ToastAlert("error", "You already liked post");
      } else {
        ToastAlert("success", "You liked post");
      }
    } catch (exception) {
      console.log(exception);
    }
  };

  const handleCommentClick = (post) => {
    setSelectedPost(post);
  };

  const handleCommentSubmit = async () => {
    try {
      let id = selectedPost.id;
      let data = { content: commentText };

      const commentResponse = await postSvc.commentPost(id, data);
      if (commentResponse) {
        ToastAlert("success", "Comment added successfully");
      }
      setCommentText("");
      setSelectedPost(null);
    } catch (exception) {
      console.log(exception);
    }
  };

  useEffect(() => {
    allPosts();
  }, [posts]);

  return (
    <>
      {posts.map((post) => (
        <div
          key={post.id}
          className="bg-white rounded-lg shadow-lg w-[50%] p-4 mb-4 mx-auto"
        >
          <div className="flex items-center mb-2">
            <img
              className="w-8 h-8 rounded-full mr-2"
              src={
                post?.user.profilePic
                  ? `${
                      import.meta.env.VITE_IMAGE_URL
                    }/${post.user.profilePic.replace(/\\/g, "/")}`
                  : "https://www.caltrain.com/files/images/2021-09/default.jpg"
              }
              alt="Profile picture"
            />
            <Link to={`/home/friends/${post.user.id}`}>
              <span className="font-bold">
                {post.user?.firstName} {post.user?.lastName}
              </span>
            </Link>
          </div>
          <p className="text-base leading-loose mb-2">{post.content}</p>
          {post.media.map((media, index) => {
            if (media.endsWith(".mp4")) {
              return (
                <video
                  key={index}
                  controls
                  className="w-32 h-32 object-fill mr-2 mb-2"
                >
                  <source
                    src={`${import.meta.env.VITE_IMAGE_URL}/${media.replace(
                      /\\/g,
                      "/"
                    )}`}
                    type="video/mp4"
                  />
                  Your browser does not support the video tag.
                </video>
              );
            } else {
              return (
                <img
                  key={index}
                  className="w-32 h-32 object-fill mr-2 mb-2"
                  src={`${import.meta.env.VITE_IMAGE_URL}/${media.replace(
                    /\\/g,
                    "/"
                  )}`}
                  alt={`Post ${post.id} Image ${index}`}
                />
              );
            }
          })}
          <div className="flex justify-between items-center mt-4">
            <button
              onClick={() => handleLike(post.id)}
              className="text-gray-500 hover:underline flex items-center"
            >
              <FaHeart className="mr-1 text-red-500" />
              Like ({post.likes.length})
            </button>
            <button
              onClick={() => handleCommentClick(post)}
              className="text-gray-500 hover:underline flex items-center"
            >
              <FaCommentDots className="mr-1 text-red-500" />
              Comment ({post.comments.length})
            </button>
            <button className="text-gray-500 hover:underline flex items-center">
              <IoIosShareAlt className="mr-1 text-red-500" />
              Share
            </button>
          </div>
        </div>
      ))}

      {selectedPost && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
          <div className="bg-white rounded-lg w-96 p-6">
            <h2 className="text-xl font-bold mb-4">
              Comments for {selectedPost.user.firstName}'s post
            </h2>
            <ul className="overflow-y-auto max-h-60">
              {selectedPost.comments.map((comment) => (
                <li key={comment.id} className="mb-2">
                  <div className="flex items-center mb-1">
                    <img
                      src={`${
                        import.meta.env.VITE_IMAGE_URL
                      }/${comment.user.profilePic.replace(/\\/g, "/")}`}
                      alt="Profile picture"
                      className="w-6 h-6 rounded-full mr-2"
                    />
                    <strong>{comment.user.firstName}: </strong>
                  </div>
                  <p>{comment.content}</p>
                </li>
              ))}
            </ul>
            <input
              type="text"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Add a comment..."
              className="border border-gray-300 rounded-md p-2 mt-4 w-full"
            />
            <div className="flex justify-end mt-4">
              <button
                onClick={handleCommentSubmit}
                className="bg-blue-500 text-white px-4 py-2 rounded-md mr-2"
              >
                Add Comment
              </button>
              <button
                onClick={() => setSelectedPost(null)}
                className="text-gray-500 hover:underline"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Posts;
