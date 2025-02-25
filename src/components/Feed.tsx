import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import UserCard from './UserCard';
import { BASE_URL } from '../utils/constants';
import { useDispatch, useSelector } from 'react-redux';
import { addFeed } from '../utils/feedSlice';
import { RootState } from '../utils/appStore';

interface user {
  firstName: string;
  lastName: string;
  emailId: string;
  age: number;
  gender: string;
  photoUrl: string;
  DOB: Date;
  about: string;
  skills: string[];
}

const Feed = () => {
  const dispatch = useDispatch();
  const feedData = useSelector((state: RootState) => state.feed);

  const getFeed = async (): Promise<user[]> => {
    const response = await axios.get(BASE_URL + 'feed', {
      withCredentials: true,
    });
    // console.log(response?.data?.data)
    dispatch(addFeed(response?.data?.data));
    return response?.data?.data;
  };

  const {
    isLoading,
    error,
    data: feedQueryData,
  } = useQuery<user[]>({
    queryKey: ['feed'],
    queryFn: getFeed,
  });

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  if (!feedData || feedData.length <= 0) {
    return (
      <h1 className="flex justify-center items-center font-bold text-2xl">
        No new Users Found
      </h1>
    );
  }

  if (!feedQueryData || feedQueryData.length <= 0) {
    return (
      <h1 className="flex justify-center items-center font-bold text-2xl">
        No new Users Found
      </h1>
    );
  }

  return (
    <div className="flex flex-1 justify-center items-center my-8">
      {feedQueryData?.[0] && <UserCard user={feedQueryData[0]} />}
    </div>
  );
};

export default Feed;
