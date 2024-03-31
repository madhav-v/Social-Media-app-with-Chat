import { useEffect, useState } from "react";
import postSvc from "../../services/post.service";
import { Link } from "react-router-dom";

const Posts = () => {
  const [posts, setPosts] = useState();

  const allPosts = async () => {
    try {
      const postResponse = await postSvc.getAllPosts();
      setPosts(postResponse.data);
    } catch (exception) {
      console.log(exception);
    }
  };

  useEffect(() => {
    allPosts();
  }, []);

  return (
    <>
      {posts?.map((post) => (
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
          <div className="flex justify-between mt-4">
            <button className="text-gray-500 hover:underline">Like</button>
            <button className="text-gray-500 hover:underline">Comment</button>
            <button className="text-gray-500 hover:underline">Share</button>
          </div>
        </div>
      ))}
    </>
  );
};

export default Posts;
