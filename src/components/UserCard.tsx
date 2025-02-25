import React from 'react';
import clsx from 'clsx';
import { user } from '../types';
import axios from 'axios';
import { BASE_URL } from '../utils/constants';
import { useDispatch } from 'react-redux';
import { removeUserFromFeed } from '../utils/feedSlice';
import { useMutation, useQueryClient } from '@tanstack/react-query';

interface UserCardProps {
  user: user;
  className?: string;
}

const UserCard: React.FC<UserCardProps> = ({ user, className }) => {
  const {
    firstName,
    lastName,
    age,
    gender,
    photoUrl,
    DOB,
    about,
    skills,
    emailId,
    _id,
  } = user;

  const dispatch = useDispatch();
    const queryClient = useQueryClient();

  // const handleSendRequest = async (
  //   status: 'interested' | 'ignored',
  //   userId: string,
  // ) => {
  //   try {
  //     const res = await axios.post(
  //       BASE_URL + 'send/request/' + status + '/' + userId,
  //       {},
  //       {
  //         withCredentials: true,
  //       },
  //     );

  //     dispatch(removeUserFromFeed(userId));
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };
 const sendRequestMutation = useMutation({
   mutationFn: async ({
     status,
     userId,
   }: {
     status: 'interested' | 'ignored';
     userId: string;
   }) => {
     return axios.post(
       `${BASE_URL}send/request/${status}/${userId}`,
       {},
       { withCredentials: true },
     );
   },
   onSuccess: (_, { userId }) => {
     dispatch(removeUserFromFeed(userId)); // Update Redux store
     queryClient.invalidateQueries({ queryKey: ['feed'] }); // Refresh feed data
   },
   onError: (error) => {
     console.error('Error sending request:', error);
   },
 });
  return (
    <div
      className={clsx(
        'card bg-base-300 w-1/2 shadow-xl rounded-xl m-4 items-center',
        className,
      )}
    >
      <figure className="px-10 pt-10 w-3/4 ">
        <img src={photoUrl} alt={emailId} className="rounded-xl" />
      </figure>
      <div className="card-body items-center text-center">
        <h2 className="card-title">{firstName + ' ' + lastName}</h2>
        {age && gender && (
          <p>
            {age}, {gender}
          </p>
        )}
        <p>{about}</p>
        <div className="card-actions">
          <button
            className="btn btn-success"
            // onClick={() => handleSendRequest('interested', _id!)}
            onClick={() =>
              sendRequestMutation.mutate({ status: 'interested', userId: _id! })
            }
            disabled={sendRequestMutation.isPending}
          >
            {sendRequestMutation.isPending ? 'Sending...' : 'Interested'}
          </button>
          <button
            className="btn btn-error"
            // onClick={() => handleSendRequest('ignored', _id!)}
            onClick={() =>
              sendRequestMutation.mutate({ status: 'ignored', userId: _id! })
            }
            disabled={sendRequestMutation.isPending}
          >
            {sendRequestMutation.isPending ? 'Sending...' : 'Ignored'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserCard;
