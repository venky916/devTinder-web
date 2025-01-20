import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import UserCard from './UserCard';
import { BASE_URL } from '../utils/constants';
import { useDispatch, useSelector } from 'react-redux';
import { addFeed } from '../utils/feedSlice';

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
  const feedData = useSelector((state: any) => state.feed);

  const getFeed = async (): Promise<user[]> => {
    const response = await axios.get(BASE_URL + 'feed', {
      withCredentials: true,
    });
    dispatch(addFeed(response?.data?.data));
    return response?.data?.data;
  };

  const { isLoading, error, data } = useQuery<user[]>({
    queryKey: ['feed'],
    queryFn: getFeed,
  });

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div className="flex flex-1 justify-center items-center my-8">
      {data?.[0] && <UserCard user={data[0]} />}
    </div>
  );
};

export default Feed;
