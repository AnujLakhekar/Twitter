import { Link } from "react-router-dom";
import RightPanelSkeleton from "../skeletons/RightPanelSkeleton";

import { useQuery, useMutation } from "@tanstack/react-query";
import useFollow from "../../hooks/FollowUnfollw.jsx"

const RightPanel = () => {
	const isLoading = false;
	
	const {data:getSuggestions, isPending, isError, error} = useQuery({
	  queryKey: ["getSuggestions"],
	  queryFn: async () => {
	   try {
	     const res = await fetch("https://twitterbackend-205b.onrender.com/api/user/getSuggested", {
	       method: "POST",
	       credentials: "include"
	       });
	     const data = await res.json()
	     
	     if (!res.ok) throw new Error(data.message)
	     
	     return data
	   } catch (e) {
	     throw new Error(e.message)
	   }
	  }
	})
	
	


	return (
		<div className={`${getSuggestions ? "block" : "hidden"}  _suggestedMedia my-4 mx-2`}>
			<div className='bg-[#16181C] p-4 rounded-md sticky top-2'>
				<p className='font-bold'>Who to follow</p>
				<div className='flex flex-col gap-4'>
					{/* item */}
					{isLoading && (
						<>
							<RightPanelSkeleton />
							<RightPanelSkeleton />
							<RightPanelSkeleton />
							<RightPanelSkeleton />
						</>
					)}
					{!isLoading &&
						getSuggestions?.map((user) => (
							<Link
								to={`/profile/${user.username}`}
								className='flex items-center justify-between gap-4'
								key={user._id}
							>
								<div className='flex gap-2 items-center'>
									<div className='avatar'>
										<div className='w-8 rounded-full'>
											<img src={user.profileImg || "/avatar-placeholder.png"} />
										</div>
									</div>
									<div className='flex flex-col'>
										<span className='font-semibold tracking-tight truncate w-28'>
											{user.fullName}
										</span>
										<span className='text-sm text-slate-500'>@{user.username}</span>
									</div>
								</div>
								<div>
									<button
										className='btn bg-white text-black hover:bg-white hover:opacity-90 rounded-full btn-sm'
										onClick={(e) => {
										  e.preventDefault()
										  useFollow(user._id);
										}}
									>
										{isPending? "following" : "follow" }
									</button>
								</div>
							</Link>
						))}
				</div>
			</div>
		</div>
	);
};
export default RightPanel;