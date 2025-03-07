import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import React from 'react';
import { BASE_URL } from '../utils/constants';
import { useDispatch, useSelector } from 'react-redux';
import { addConnections } from '../utils/conecctionSlice';
import { user } from '../types';
import { RootState } from '../utils/appStore';
import { Link } from 'react-router-dom';

const Connections = () => {
  const dispatch = useDispatch();
  const connectionStore = useSelector((store: RootState) => store.connections);

  const fetchConnections = async () => {
    try {
      const res = await axios.get(BASE_URL + 'user/connections', {
        withCredentials: true,
      });
      // console.log(res)
      dispatch(addConnections(res.data.data));
      return res.data.data;
    } catch (error) {
      // handle error
      console.log(error);
    }
  };

  const {
    isLoading,
    data: connections,
    error,
  } = useQuery({
    queryKey: ['connections'],
    queryFn: fetchConnections,
  });
  // console.log(connections);

  if (isLoading) {
    return <div>Loading....</div>;
  }
  if (error) {
    // console.log(error);
    return <div>Something went wrong</div>;
  }
  return (
    <div className="flex flex-col items-center justify-center my-10">
      <h1 className="text-4xl font-bold">Connections</h1>
      {connections.map((connection: user) => {
        const { firstName, lastName, photoUrl, age, gender, about, _id } =
          connection;
        return (
          <div
            key={_id}
            className="flex justify-start w-7/12 p-4 bg-slate-300/20 my-3 rounded-xl"
          >
            <img
              alt="photo"
              src={photoUrl}
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
            <div className="ml-auto">
              <Link to={'/chat/' + _id}>
                <button className="btn btn-primary rounded-xl hover:bg-violet-400">
                  Chat
                </button>
              </Link>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Connections;
