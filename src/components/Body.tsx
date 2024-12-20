
import NavBar from './NavBar'
import { Outlet } from 'react-router-dom'
import Footer from './Footer'

const Body = () => {
    return (
      <>
        <NavBar />
        <Outlet />
        {/* <Footer /> */}
      </>
    );
}

export default Body


// Body 
//     NavBar
//     Route=/  => Feed
//     Route=/login  => Login
//     Route=/connetions => Connections
//     Router=/profile => Profile