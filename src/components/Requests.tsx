import axios from 'axios';
import { BASE_URL } from '../utils/constants';
import { useDispatch, useSelector } from 'react-redux';
import { addRequests, removeRequest } from '../utils/requestSlice';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAppSelector } from '../hooks/storeHook';
import { connection } from '../types';

const Requests = () => {
  const queryClient = useQueryClient();
  const dispatch = useDispatch();
  const requestStore = useAppSelector((store) => store.requests);

  const fetchRequests = async () => {
    try {
      const res = await axios.get(BASE_URL + 'user/requests/received', {
        withCredentials: true,
      });

      dispatch(addRequests(res.data.data));
      return res.data.data;
    } catch (error) {
      console.log(error);
    }
  };

  const reviewRequestMutation = useMutation({
    mutationFn: async ({ status, id }: { status: string; id: string }) => {
      const res = await axios.post(
        BASE_URL + `receive/request/${status}/${id}`,
        {},
        {
          withCredentials: true,
        },
      );
      // console.log(res.data);
      dispatch(removeRequest(id));
      return res.data;
    },
    onSuccess: () => {
      // Invalidate and refetch the requests query to update the UI
      queryClient.invalidateQueries({ queryKey: ['requests'] });
    },
    onError: (error) => {
      console.error('Error reviewing request:', error);
    },
  });

  // const reviewRequest = async (status: string, id: string) => {
  //   try {
  //     const res = await axios.post(
  //       BASE_URL + `receive/request/${status}/${id}`,
  //       {
  //         withCredentials: true,
  //       },
  //     );
  //     console.log(res.data);
  //     return res.data;
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  const {
    isLoading,
    data: requests,
    error,
  } = useQuery({
    queryKey: ['requests'],
    queryFn: fetchRequests,
  });

  //   console.log(isLoading, requests, error);

  if (isLoading) {
    return <div>Loading....</div>;
  }
  if (error) {
    console.log(error);
    return <div>Something went wrong</div>;
  }
  if (!requests) {
    return <div className="font-bold text-4xl">No Request Found</div>;
  }
  return (
    <div className="flex flex-col items-center justify-center my-10">
      <h1 className="text-4xl font-bold">My Requests</h1>
      {requests.map((request: connection) => {
        const { firstName, lastName, photoUrl, age, gender, about } =
          request.fromUserId;
        return (
          <div
            key={request._id}
            className="flex justify-start w-7/12 p-4 bg-slate-300/20 my-3 rounded-xl"
          >
            <img
              alt="photo"
              src={photoUrl || '/images/avatar-placeholder.png'}
              className="w-14 h-14 rounded-full"
            />
            <div className="flex flex-col justify-start ml-4">
              <h2 className="font-bold text-xl">
                {firstName + ' ' + lastName}{' '}
              </h2>
              <div className="flex gap-2 items-center">
                {age && <span>age:{age}</span>}
                {gender && <span>gender:{gender}</span>}
              </div>
              {about && <span>about:{about}</span>}
            </div>
            <div className="ml-auto flex gap-2">
              <button
                className="btn btn-success rounded-xl"
                // onClick={() => reviewRequest('accepted', request._id)}
                onClick={() =>
                  reviewRequestMutation.mutate({
                    status: 'accepted',
                    id: request._id,
                  })
                }
              >
                Accept
              </button>
              <button
                className="btn btn-error rounded-xl"
                // onClick={() => reviewRequest('rejected', request._id)}
                onClick={() =>
                  reviewRequestMutation.mutate({
                    status: 'rejected',
                    id: request._id,
                  })
                }
              >
                Reject
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Requests;
