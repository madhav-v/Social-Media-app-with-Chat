import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import authSvc from "../../services/auth.service";
import postSvc from "../../services/post.service";

const FriendProfile = () => {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await authSvc.getUserById(id);
        console.log(response);
        setUser(response.user);
      } catch (error) {
        console.log(error);
      }
    };

    const fetchUserPosts = async () => {
      try {
        const response = await postSvc.getPostByUser(id);
        setPosts(response.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchUserData();
    fetchUserPosts();
  }, [id]);

  return (
    <div className="h-full w-full mt-3 md:bg-screen md:pb-4 md:pt-[10vh]">
      {user && (
        <div className="h-full flex flex-col mx-auto bg-white px-2 py-2 md:px-4 md:pt-8 rounded-xl relative">
          <div className="relative h-[300px] rounded-xl overflow-hidden">
            {user && user.coverPic ? (
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
            {user && user.profilePic ? (
              <img
                src={`${
                  import.meta.env.VITE_IMAGE_URL
                }/${user?.profilePic.replace(/\\/g, "/")}`}
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

          <div className="w-[80%] mx-auto flex flex-col mt-2 capitalize">
            <div className="w-[80%] mx-auto flex flex-col mt-2">
              <div className="border p-4 rounded-md shadow-md mb-4">
                <h2 className="text-xl font-bold mb-2">
                  Bio: <span className="text-base font-normal">{user.bio}</span>
                </h2>
              </div>
            </div>
          </div>
        </div>
      )}

      <h2 className="text-2xl font-bold ml-[350px] mt-3 mb-4 mx-auto">
        {user && `${user.firstName}'s Posts`}
      </h2>

      {posts.map((post) => (
        <div
          key={post.id}
          className="bg-white rounded-lg shadow-lg w-[50%] p-4 mb-4 mx-auto"
        >
          <div className="flex items-center mb-2">
            {user && user.profilePic ? (
              <img
                src={`${
                  import.meta.env.VITE_IMAGE_URL
                }/${user.profilePic.replace(/\\/g, "/")}`}
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
              {user && `${user.firstName} ${user.lastName}`}
            </span>
          </div>
          <p className="text-base leading-loose mb-2">{post.content}</p>
          {post.media.map((image, index) => (
            <img
              key={index}
              className="w-32 h-32 object-fill mr-2 mb-2"
              src={`${import.meta.env.VITE_IMAGE_URL}/${image.replace(
                /\\/g,
                "/"
              )}`}
              alt={`Post ${post.id} Image ${index}`}
            />
          ))}
          <div className="flex justify-between mt-4">
            <button className="text-gray-500 hover:underline">Like</button>
            <button className="text-gray-500 hover:underline">Comment</button>
            <button className="text-gray-500 hover:underline">Share</button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default FriendProfile;
