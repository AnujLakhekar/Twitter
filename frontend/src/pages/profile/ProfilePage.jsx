import { useRef, useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom"
import {toast} from "react-hot-toast"

import Posts from "../../components/common/Posts";
import ProfileHeaderSkeleton from "../../components/skeletons/ProfileHeaderSkeleton";
import EditProfileModal from "./EditProfileModal";

import { POSTS } from "../../utils/db/dummy";

import { FaArrowLeft } from "react-icons/fa6";
import { IoCalendarOutline } from "react-icons/io5";
import { FaLink } from "react-icons/fa";
import { MdEdit } from "react-icons/md";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { formatMemberSinceDate } from "../../utils/Date/index.js";

const ProfilePage = () => {
  const [coverImg, setCoverImg] = useState(null);
  const [profileImg, setProfileImg] = useState(null);
  const [coverImgPreview, setCoverImgPreview] = useState(null);
  const [profileImgPreview, setProfileImgPreview] = useState(null);
  const [feedType, setFeedType] = useState("posts");

  const { username } = useParams();

  const coverImgRef = useRef(null);
  const profileImgRef = useRef(null);

  const queryClient = useQueryClient();

  const { data: authUser } = useQuery({
    queryKey: ["authUser"],
  });

  const { data: user, isPending: isLoading, refetch } = useQuery({
    queryKey: ["userProfile"],
    queryFn: async () => {
      const res = await fetch(`https://twitterbackend-205b.onrender.com/api/user/profile/${username}`, {
        credentials: "include"
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      return data;
    },
  });

  const { mutate: follow, isPending, error:followError } = useMutation({
    mutationFn: async (userId) => {
      try {
        const res = await fetch(`https://twitterbackend-205b.onrender.com/follow/${userId}`, {
        method: "POST",
        headers: {
	          "Content-Type": "application/json",
	        },
        credentials: "include"
      });
      const data = await res.json();
      console.log(data)
      if (!res.ok) throw new Error(data.message);
      
      return data;
      } catch (e) {
        toast.error(e.message)
        throw new Error(e.message)
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
      queryClient.invalidateQueries({ queryKey: ["getSuggestions"] });
    },
  });

  const { mutate: updateProfile, isPending: isUpdating, error: updateError } = useMutation({
    mutationFn: async () => {

     let payload;
      if (coverImg) {
       payload = {
        coverImg,
        };
      } else if (profileImg) {
        payload = {
        profileImg,
        };
      }
    
      const res = await fetch(`https://twitterbackend-205b.onrender.com/updateProfile`, {
        method: "POST",
        headers: {
  "Content-Type": "application/json",
},
        body: JSON.stringify(payload),
        credentials: "include",
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      return data;
    },
    onSuccess: () => {
      alert("Profile updated");
      queryClient.invalidateQueries({ queryKey: ["userProfile"] });
    },
  });

  const isMyProfile = authUser?._id === user?._id;
  const memberSinceDate = formatMemberSinceDate(user?.createdAt);
  const amIFollowing = user?.followers.includes(authUser?._id);

  useEffect(() => {
    refetch();
  }, [username, refetch]);

  const handleImgChange = (e, type) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      if (type === "coverImg") {
        setCoverImgPreview(reader.result);
        setCoverImg(reader.result);
      } else {
        setProfileImgPreview(reader.result);
        setProfileImg(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleFollow = () => {
    follow(user?._id);
  };

  return (
    <div className='flex-[4_4_0] border-r border-gray-700 min-h-screen'>
      {isLoading && <ProfileHeaderSkeleton />}
      {!isLoading && !user && <p className='text-center text-lg mt-4'>User not found</p>}

      {!isLoading && user && (
        <>
          <div className='flex gap-10 px-4 py-2 items-center'>
            <Link to='/'>
              <FaArrowLeft className='w-4 h-4' />
            </Link>
            <div className='flex flex-col'>
              <p className='font-bold text-lg'>{user.fullName}</p>
              <span className='text-sm text-slate-500'>{POSTS?.length} posts</span>
            </div>
          </div>

          {/* COVER IMAGE */}
          <div className='relative group/cover'>
            <img
              src={coverImgPreview || user.coverImg || "/cover.png"}
              className='h-52 w-full object-cover'
              alt='cover image'
            />
            {isMyProfile && (
              <div
                className='absolute top-2 right-2 rounded-full p-2 bg-gray-800 bg-opacity-75 cursor-pointer opacity-0 group-hover/cover:opacity-100 transition duration-200'
                onClick={() => coverImgRef.current.click()}
              >
                <MdEdit className='w-5 h-5 text-white' />
              </div>
            )}
            <input
              type='file'
              hidden
              ref={coverImgRef}
              accept='image/*'
              onChange={(e) => handleImgChange(e, "coverImg")}
            />
            <input
              type='file'
              hidden
              ref={profileImgRef}
              accept='image/*'
              onChange={(e) => handleImgChange(e, "profileImg")}
            />

            {/* PROFILE IMAGE */}
            <div className='avatar absolute -bottom-16 left-4'>
              <div className='w-32 rounded-full relative group/avatar'>
                <img
                  src={profileImgPreview || user.profilePic || "/avatar-placeholder.png"}
                  alt='avatar'
                />
                {isMyProfile && (
                  <div className='absolute top-5 right-3 p-1 bg-primary rounded-full group-hover/avatar:opacity-100 opacity-0 cursor-pointer'>
                    <MdEdit
                      className='w-4 h-4 text-white'
                      onClick={() => profileImgRef.current.click()}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className='flex justify-end px-4 mt-5'>
            {isMyProfile && <EditProfileModal />}
            {!isMyProfile && (
              <button className='btn btn-outline rounded-full btn-sm' onClick={handleFollow}>
                {isPending ? "Following..." : amIFollowing ? "Unfollow" : "Follow"}
              </button>
            )}
            {(coverImg || profileImg) && (
              <button
                className='btn btn-primary rounded-full btn-sm text-white px-4 ml-2'
                onClick={updateProfile}
              >
                {isUpdating ? "Updating..." : "Update"}
              </button>
            )}
          </div>

          <div className='flex flex-col gap-4 mt-14 px-4'>
            <div className='flex flex-col'>
              <span className='font-bold text-lg'>{user.fullName}</span>
              <span className='text-sm text-slate-500'>@{user.username}</span>
              <span className='text-sm my-1'>{user.bio}</span>
            </div>

            <div className='flex gap-2 flex-wrap'>
              {user.link && (
                <div className='flex gap-1 items-center'>
                  <FaLink className='w-3 h-3 text-slate-500' />
                  <a
                    href={user.link}
                    target='_blank'
                    rel='noreferrer'
                    className='text-sm text-blue-500 hover:underline'
                  >
                    {user.link}
                  </a>
                </div>
              )}
              <div className='flex gap-2 items-center'>
                <IoCalendarOutline className='w-4 h-4 text-slate-500' />
                <span className='text-sm text-slate-500'>{memberSinceDate}</span>
              </div>
            </div>

            <div className='flex gap-2'>
              <div className='flex gap-1 items-center'>
                <span className='font-bold text-xs'>{user.following.length}</span>
                <span className='text-slate-500 text-xs'>Following</span>
              </div>
              <div className='flex gap-1 items-center'>
                <span className='font-bold text-xs'>{user.followers.length}</span>
                <span className='text-slate-500 text-xs'>Followers</span>
              </div>
            </div>
          </div>

          <div className='flex w-full border-b border-gray-700 mt-4'>
            <div
              className={`flex justify-center flex-1 p-3 hover:bg-secondary transition duration-300 relative cursor-pointer ${
                feedType === "posts" ? "text-white" : "text-slate-500"
              }`}
              onClick={() => setFeedType("posts")}
            >
              Posts
              {feedType === "posts" && (
                <div className='absolute bottom-0 w-10 h-1 rounded-full bg-primary' />
              )}
            </div>
            <div
              className={`flex justify-center flex-1 p-3 hover:bg-secondary transition duration-300 relative cursor-pointer ${
                feedType === "likes" ? "text-white" : "text-slate-500"
              }`}
              onClick={() => setFeedType("likes")}
            >
              Likes
              {feedType === "likes" && (
                <div className='absolute bottom-0 w-10 h-1 rounded-full bg-primary' />
              )}
            </div>
          </div>
        </>
      )}

      <Posts feedType={feedType} username={username} userId={user?._id} />
    </div>
  );
};

export default ProfilePage;
