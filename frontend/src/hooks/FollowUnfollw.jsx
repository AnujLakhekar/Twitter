import {toast} from "react-hot-toast"
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";

const useFollow = async () => {
  const queryClient = useQueryClient();
  
  const {mutate:follow, isPending, isError, error} = useMutation({
    mutationFn: async (userId) => {
      try {
        const res = await fetch(`http://localhost:8000/api/follow/${userId}`, {
          method: "POST",
          headers: {
	          "Content-Type": "application/json",
	        },
          credentials: "include"
        });
        const data = await res.json();
        if(!res.ok) throw new Error(data.message);
      } catch (e) {
        console.log(e.message)
        throw new Error(e.message)
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ["authUser"]});
      queryClient.invalidateQueries({queryKey: ["getSuggestions"]});
    }
  })
  
  return {follow, isPending}
}


export default useFollow