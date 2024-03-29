import { useEffect, useState } from "react";
import postSvc from "../../services/post.service";

interface Post {
  id: number;
  content: string;
  media: string[];
  user: {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    profilePic: string;
    coverPic: string;
    bio: string;
  };
}
const Posts = () => {
  const [posts, setPosts] = useState<Post[] | null>(null);

  const allPosts = async () => {
    try {
      const postResponse = await postSvc.getAllPosts();
      console.log(postResponse);
      setPosts(postResponse.data);
    } catch (exception: any) {
      console.log(exception);
    }
  };

  useEffect(() => {
    allPosts();
  }, []);
  console.log(posts);

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
            <span className="font-bold">
              {post.user?.firstName} {post.user?.lastName}
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
    </>
  );
};

export default Posts;
