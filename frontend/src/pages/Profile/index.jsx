import authSvc from "../../services/auth.service";
import { useState, useEffect } from "react";
import postSvc from "../../services/post.service";
import { FaEdit, FaTrash } from "react-icons/fa"; // Import FontAwesome icons
import ToastAlert from "../../components/Toast";
import EditPost from "../../components/Posts/edit";
import { Image } from "antd";
const Profile = () => {
  const [user, setUser] = useState();
  const [posts, setPosts] = useState();
  const [editPostId, setEditPostId] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await authSvc.getLoggedInUser();
        setUser(response.data);
      } catch (error) {
        console.log(error);
      }
    };

    const fetchUserPosts = async () => {
      try {
        const response = await postSvc.getMyPosts();
        setPosts(response.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchUserData();
    fetchUserPosts();
  }, [posts]);

  const handleEditPostClick = (postId) => {
    setEditPostId(postId); // Set the ID of the post being edited
  };

  const handleCloseEditPopup = () => {
    setEditPostId(null); // Reset the edit post ID to close the popup
  };

  const handleDeletePost = async (postId) => {
    const response = await postSvc.deletePost(postId);
    if (response) {
      ToastAlert("success", "Post Deleted");
    }
  };

  return (
    <>
      <div className="h-full w-full mt-3 md:bg-screen md:pb-4 md:pt-[10vh]">
        <div className="h-full flex flex-col mx-auto bg-white px-2 py-2 md:px-4 md:pt-8 rounded-xl relative">
          <div className="relative h-[300px] rounded-xl overflow-hidden">
            {user?.coverPic !== null ? (
              <img
                src={`${
                  import.meta.env.VITE_IMAGE_URL
                }/${user?.coverPic.replace(/\\/g, "/")}`}
                alt="Cover Image"
                className="w-[50%] h-full mx-auto object-cover object-center"
              />
            ) : (
              <img
                src="https://www.caltrain.com/files/images/2021-09/default.jpg"
                alt="Default Profile Image"
                className="w-[50%] h-full mx-auto object-cover object-center"
              />
            )}
          </div>

          <div className="absolute mt-52 left-1/2 transform -translate-x-1/2 w-36 h-36 rounded-full overflow-hidden bg-white border border-gray-300 shadow-md">
            {user?.profilePic !== null ? (
              <img
                src={`${
                  import.meta.env.VITE_IMAGE_URL
                }/${user?.profilePic.replace(/\\/g, "/")}`}
                alt="Profile Image"
                className="rounded-3xl p-2 w-[300px] h-[300px] object-cover"
              />
            ) : (
              <img
                src="https://www.caltrain.com/files/images/2021-09/default.jpg"
                alt="Default Profile Image"
                className="rounded-3xl p-2 w-[300px] h-[300px] object-cover"
              />
            )}
          </div>

          <div className="w-[80%] mx-auto flex flex-col mt-2 capitalize">
            <div className="w-[80%] mx-auto flex flex-col mt-2">
              <div className="border p-4 rounded-md shadow-md mb-4">
                <h2 className="text-xl font-bold mb-2">
                  Bio:{" "}
                  <span className="text-base font-normal">{user?.bio}</span>
                </h2>
              </div>
            </div>
          </div>
        </div>

        <h2 className="text-2xl font-bold ml-[350px] mt-3 mb-4 mx-auto">
          My Posts
        </h2>

        {posts &&
          posts.map((post) => (
            <div
              key={post.id}
              className="bg-white rounded-lg shadow-lg w-[50%] p-4 mb-4 mx-auto relative"
            >
              <div className="absolute top-2 right-2 flex gap-2">
                <button
                  onClick={() => handleEditPostClick(post.id)}
                  className="text-red-500 hover:text-red-500"
                >
                  <FaEdit />
                </button>

                <button
                  onClick={() => handleDeletePost(post.id)}
                  className="text-red-500 hover:text-red-500"
                >
                  <FaTrash />
                </button>
              </div>

              <div className="flex items-center mb-2">
                {user?.profilePic !== null ? (
                  <img
                    src={`${
                      import.meta.env.VITE_IMAGE_URL
                    }/${user?.profilePic.replace(/\\/g, "/")}`}
                    alt="Profile Image"
                    className="w-8 h-8 rounded-full mr-2"
                  />
                ) : (
                  <img
                    src="https://www.caltrain.com/files/images/2021-09/default.jpg"
                    alt="Default Profile Image"
                    className="w-8 h-8 rounded-full mr-2"
                  />
                )}
                <span className="font-bold">
                  {user?.firstName} {user?.lastName}
                </span>
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
                    <Image
                      width={250}
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

              <div className="flex justify-between mt-4">
                <button className="text-gray-500 hover:underline">Like</button>
                <button className="text-gray-500 hover:underline">
                  Comment
                </button>
                <button className="text-gray-500 hover:underline">Share</button>
              </div>
            </div>
          ))}
        {editPostId && (
          <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-white rounded-lg shadow-lg p-4">
              {/* Render EditPost component with post ID */}
              <EditPost
                postId={editPostId}
                mediaFiles={posts.media}
                onClose={handleCloseEditPopup}
              />
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Profile;
