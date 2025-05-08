import React from "react"
import Post from "./Post";
import PostSkeleton from "../skeletons/PostSkeleton";
import { POSTS } from "../../utils/db/dummy";
import {useMutation, useQuery} from "@tanstack/react-query"

const Posts = ({feedType, userId, username}) => {
	
	const getPost_Endpoint = () => {
	  console.log(username)
	  switch (feedType) {
	      case "ForYou":
	      return "http://localhost:8000/api/post/"
	      case "following":
	      return "http://localhost:8000/api/post/following"
	      case "posts":
	      return `http://localhost:8000/api/post/user/${username}`
	      case "likes":
	      return `http://localhost:8000/api/post/liked/${userId}`
	      default:
	      return "http://localhost:8000/api/post/"
	  }
	}
	
	const Post_EndPoint = getPost_Endpoint()

const {data:posts, isLoading, refetch, isRefetching} = useQuery({
  queryKey: ["posts"],
  queryFn: async () => {
    try {
      const res = await fetch(Post_EndPoint, {
        credentials: "include",
      });
      
    if (!res.ok) throw new Error("somethig went wrong");
    
    const data = await res.json();
    return data
    } catch (e) {
      console.log(e.message)
    }
  }
})

React.useEffect(() => {
  refetch();
}, [feedType, refetch])

	return (
		<>
			{(isLoading && isRefetching) && (
				<div className='flex flex-col justify-center'>
					<PostSkeleton />
					<PostSkeleton />
					<PostSkeleton />
				</div>
			)}
			{(!isLoading && !isRefetching) && posts?.length === 0 && <p className='text-center my-4'>No posts in this tab. Switch 👻</p>}
			{!isLoading && posts && (
				<div>
					{posts.map((post) => (
						<Post key={post._id} post={post} />
					))}
				</div>
			)}
		</>
	);
};
export default Posts;