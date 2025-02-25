import axios from 'axios';
import React from 'react';
import { BASE_URL } from '../utils/constants';
import { useDispatch } from 'react-redux';
import { addRequests } from '../utils/requestSlice';
import { useQuery } from '@tanstack/react-query';
import { user } from '../types';

const Requests = () => {
  const dispatch = useDispatch();

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
      <h1 className="text-4xl font-bold">Connections</h1>
      {requests.map((request: any) => {
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
            <div className='ml-auto flex gap-2'>
              <button className="btn btn-success rounded-xl">Accept</button>
              <button className="btn btn-error rounded-xl">Reject</button>
            </div>
          </div>
        );
      })}
      
    </div>
  );
};

export default Requests;
