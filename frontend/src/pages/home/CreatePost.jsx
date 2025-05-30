import { CiImageOn } from "react-icons/ci";
import { BsEmojiSmileFill } from "react-icons/bs";
import { useRef, useState } from "react";
import { IoCloseSharp } from "react-icons/io5";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

const CreatePost = () => {
	const [text, setText] = useState("");
	const [img, setImg] = useState(null);

  const {data:authUser} = useQuery({queryKey: ["authUser"]})
  
  const queryClient = useQueryClient();
  
  const {mutate:createPost, isPending, isError, error} = useMutation({
    mutationFn: async ({text, img}) => {
      try {
        const res = await fetch("https://twitterbackend-205b.onrender.com/api/post/create", {
          method: "POST",
          headers: {
          "Content-Type": "application/json"
          },
          body: JSON.stringify({text, img}),
          credentials: "include"
          })
      
      const data = await res.json();
      if(!res.ok) {
        throw new Error(data.message)
      }
      return data
      } catch (e) {
        console.log(e.message)
        if (e) throw new Error(e.message)
      }
    },
  onSuccess: () => {
    queryClient.invalidateQueries({queryKey: ["posts"]})
    setImg("")
    setText("")
  }
  })

	const imgRef = useRef(null);

	const data = {
		profileImg: "/avatars/boy1.png",
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		createPost({text, img})
	};

	const handleImgChange = (e) => {
		const file = e.target.files[0];
		if (file) {
			const reader = new FileReader();
			reader.onload = () => {
				setImg(reader.result);
			};
			reader.readAsDataURL(file);
		}
	};

	return (
		<div className='flex p-4 items-start gap-4 border-b overflow-hidden border-gray-700'>
			<div className='avatar'>
				<div className='w-8 rounded-full'>
					<img src={authUser.profilePic || "/avatar-placeholder.png"} />
				</div>
			</div>
			<form className='flex flex-col gap-2 w-full' onSubmit={handleSubmit}>
				<textarea
					className='textarea w-full p-0 text-lg resize-none border-none focus:outline-none  border-gray-800'
					placeholder='What is happening?!'
					value={text}
					onChange={(e) => setText(e.target.value)}
				/>
				{img && (
					<div className='relative w-72 mx-auto flex justify-center items-center '>
						<IoCloseSharp
							className='fixed top-[76vh] right-[45px] z-50 text-white bg-gray-800 rounded-full w-5 h-5 cursor-pointer'
							onClick={() => {
								setImg(null);
								imgRef.current.value = null;
							}}
						/>
						<img src={img} className='w-full fixed top-[75vh] left-32 right-64 mx-auto h-36 object-contain rounded-full ' />
					</div>
				)}

				<div className='flex justify-between border-t py-2 border-t-gray-700'>
					<div className='flex gap-1 items-center'>
						<CiImageOn
							className='fill-primary w-6 h-6 cursor-pointer'
							onClick={() => imgRef.current.click()}
						/>
						<BsEmojiSmileFill className='fill-primary w-5 h-5 cursor-pointer' />
					</div>
					<input type='file' hidden ref={imgRef} onChange={handleImgChange} />
					<button className='btn btn-primary rounded-full btn-sm text-white px-4'>
						{isPending ? "Posting..." : "Post"}
					</button>
				</div>
				{isError && <div className='text-red-500'>{error ? error.message : "Something went wrong"}</div>}
			</form>
		</div>
	);
};
export default CreatePost;