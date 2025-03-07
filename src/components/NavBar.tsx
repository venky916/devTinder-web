import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { BASE_URL } from '../utils/constants';
import { removeUser } from '../utils/userSlice';


const NavBar = () => {
  const user = useSelector((store: any) => store?.user) || {};
  const dispatch = useDispatch();
  const navigate = useNavigate();
  // console.log(user);
  const handleLogout = async () => {
    try {
      await axios.post(BASE_URL + 'logout', {}, { withCredentials: true });
      dispatch(removeUser());
      navigate('/login');
    } catch (error) {
      // Error logic redirect to error page
    }
  };

  return (
    <div className="navbar bg-base-300">
      <div className="flex-1">
        <Link to={user ? '/' : '/login'} className="btn btn-ghost text-xl">
          🧑‍💻DevTinder
        </Link>
      </div>

      {user && (
        <>
          <div>
            <p>WELCOME, {user?.firstName }</p>
          </div>
          <div className="flex-none gap-2">
            <div className="dropdown dropdown-end mx-5">
              <div
                tabIndex={0}
                role="button"
                className="btn btn-ghost btn-circle avatar"
              >
                <div className="w-10 rounded-full">
                  <img alt="UI" src={user?.photoUrl} />
                </div>
              </div>
              <ul
                tabIndex={0}
                className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow"
              >
                <li>
                  <Link to="/profile" className="justify-between">
                    Profile
                  </Link>
                </li>
                <li>
                  <Link to="/connections" className="justify-between">
                    Connections
                  </Link>
                </li>
                <li>
                  <Link to="/requests" className="justify-between">
                    Requests
                  </Link>
                </li>
                <li>
                  <a onClick={handleLogout}>Logout</a>
                </li>
              </ul>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default NavBar;
