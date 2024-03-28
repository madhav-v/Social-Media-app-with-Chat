import { useEffect, useState } from "react";
import postSvc from "../../services/post.service";
import { GetAllPostsResponse, Post } from "../../types/post";

const Posts = () => {
  const [posts, setPosts] = useState<Post[] | null>(null);

  const allPosts = async () => {
    try {
      const postResponse: GetAllPostsResponse = await postSvc.getAllPosts();
      console.log(postResponse);
      setPosts(postResponse);
    } catch (exception: any) {
      console.log(exception);
    }
  };

  useEffect(() => {
    allPosts();
  }, []);

  return (
    <div>
      <h1>Posts:</h1>
      {posts ? (
        <ul>
          {posts.map((post) => (
            <li key={post.id}>
              <h2>{post.content}</h2>
              {post.media.length > 0 && (
                <div>
                  {post?.media.map((image, index) => (
                    <img
                      key={index}
                      src={`${import.meta.env.VITE_IMAGE_URL}/${image.replace(
                        /\\/g,
                        "/"
                      )}`}
                      alt={`Post ${post.id} Image ${image}`}
                    />
                  ))}
                </div>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default Posts;
