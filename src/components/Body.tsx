import NavBar from './NavBar';
import { Outlet, useNavigate } from 'react-router-dom';
import Footer from './Footer';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { BASE_URL } from '../utils/constants';
import { addUser } from '../utils/userSlice';
import { useEffect } from 'react';

const Body = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((store:any) =>store?.user)

  const fetchUser = async () => {
    try {
      const response:any = await axios.get(BASE_URL + 'profile/view', {
        withCredentials: true,
      });
      dispatch(addUser(response?.data));

    } catch (error:any) {
      if (error?.status === 401) {
        navigate('/login');
      }
      console.error(error.message);
      // navigate('/Not-found')
    }
    
  };

  useEffect(() => {
    if (!user) {
      fetchUser();
    }
  }, []);
  return (
    <>
      <NavBar />
      <Outlet />
      {/* <Footer /> */}
    </>
  );
};

export default Body;

// Body
//     NavBar
//     Route=/  => Feed
//     Route=/login  => Login
//     Route=/connetions => Connections
//     Router=/profile => Profile
