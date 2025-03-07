import NavBar from './NavBar';
import { Outlet, useNavigate } from 'react-router-dom';
import Footer from './Footer';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { BASE_URL } from '../utils/constants';
import { addUser } from '../utils/userSlice';
import { useEffect } from 'react';
import { RootState } from '../utils/appStore';

const Body = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((store: RootState) => store?.user);

  const fetchUser = async () => {
    if (user) return;
    try {
      const response: any = await axios.get(BASE_URL + 'profile/view', {
        withCredentials: true,
      });
      dispatch(addUser(response?.data));
    } catch (error: any) {
      if (error?.status === 401) {
        navigate('/login');
        // console.log('hello');
      }
      console.error(error);
      // navigate('/Not-found')
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <NavBar />
      <div className="flex-1">
        <Outlet />
      </div>
      <Footer />
    </div>
  );
};

export default Body;

// Body
//     NavBar
//     Route=/  => Feed
//     Route=/login  => Login
//     Route=/connetions => Connections
//     Router=/profile => Profile
