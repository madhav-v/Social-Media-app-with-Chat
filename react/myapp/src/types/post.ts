export type Post = {
  id: number;
  content: string;
  media: string[];
  user: number;
};

export type GetAllPostsResponse = {
  posts: Post[];
};
