// import './App.css';
// import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
// import { useEffect, useState } from 'react';
// import MyHome from './components/MyHome';
// import Header from './components/Header';
// import Footer from './components/Footer';
// import CommentList from './components/CommentList'
// import PostComment from './components/PostComment';
// import SignUp from './components/SignUp';
// import SignIn from './components/SignIn';
// import EmailVerification from './components/EmailVerification';
// import Cookies from 'universal-cookie'
// import NavigationBar from './components/NavigationBar';
// import Takeaway from './components/Takeaway';
// import TakeawayChinese from './components/TakeawayChinese';
// import ShoppingCart from './components/ShoppingCart';
// import Profile from './components/Profile';
// // 
// import OrderConfirmation from './components/OrderConfirmation';
// import MyOrders from './components/MyOrders';
// import AdminOrders from './components/AdminOrders';
// import AdminMenu from './components/AdminMenu';
// import AdminRoute from './components/AdminRoute';
// import AboutUs from './components/AboutUs';


// function App() {
//   const [logInState, setLogInState] = useState(false);
//   const cookies = new Cookies()

//   const handleLogout = () => {
//     setLogInState(false);
//     cookies.remove('Token');
//     localStorage.clear();
//     // localStorage.removeItem('Token');
//     // localStorage.removeItem('TokenExpiration');
//     // localStorage.removeItem('LoggedIn');
//     // localStorage.removeItem('Username');
//   }

//   const checkTokenExpiration = () => {
//     const cookiesToken = cookies.get('Token')
//     const localStorageToken = localStorage.getItem('Token');
//     const expirationTime = localStorage.getItem('TokenExpiration');

//     if (cookiesToken && localStorageToken && expirationTime) {
//       const currentTime = new Date().getTime();

//       if (currentTime > Number(expirationTime)) { handleLogout(); }
//       else { setLogInState(true); }
//     }
//   };

//   useEffect(() => {
//     checkTokenExpiration();

//     // Set up interval to periodically check the token's expiration status
//     const interval = setInterval(checkTokenExpiration, 1000); // Check every second

//     // Clean up the interval when the component is unmounted
//     return () => clearInterval(interval);
//   }, []);

//   return (
//     <div className="App">
//       <NavigationBar logInState={logInState} handleLogout={handleLogout} />
//       <Header />

//       <Routes>
//         <Route path='/' element={<MyHome />} />
//         <Route path="/commentlist" element={<CommentList logInState={logInState} />} />

//         <Route
//           path="/profile"
//           element={
//             logInState ? (
//               <Profile />
//             ) : (
//               <Navigate to="/signin" />
//               // <SignIn />
//             )
//           }
//         />

//         <Route
//           path="/postcomment"
//           element={
//             logInState ? (
//               <PostComment />
//             ) : (
//               <Navigate to="/signin" />
//               // <SignIn />
//             )
//           }
//         />

//         <Route
//           path="/signup"
//           element={
//             logInState ? (
//               <Navigate to="/" />
//             ) : (
//               <SignUp />
//             )
//           }
//         />

//         <Route
//           path="/signin"
//           element={
//             logInState ? (
//               <Navigate to="/" />
//             ) : (
//               <SignIn setLogInState={setLogInState} />
//             )
//           }
//         />

//         <Route path="/emailverification/:token" element={<EmailVerification />} />
//         <Route path='/takeaway' element={<Takeaway />} />
//         <Route path='/takeawaychinese' element={<TakeawayChinese />} />

//         {/* <Route path='shoppingcart' element={<ShoppingCart />} /> */}
//         {/* <Route
//           path="/shoppingcart"
//           element={
//             logInState ? (
//               <Navigate to="/" />
//             ) : (
//               <SignIn setLogInState={setLogInState} />
//             )
//           }
//         /> */}


//         <Route
//           path="/order-confirmation/:id"
//           element={
//             logInState
//               ? <OrderConfirmation />
//               : <Navigate to="/signin" />
//           }
//         />


//         <Route
//           path="/my-orders"
//           element={
//             logInState
//               ? <MyOrders />
//               : <Navigate to="/signin" />
//           }
//         />


//         <Route
//           path="/aboutus"
//           element={
//             <AboutUs />
//           }
//         />


//         <Route
//           path="/admin/orders"
//           element={
//             <AdminRoute>

//               <AdminOrders />

//             </AdminRoute>
//           }
//         />


//         <Route
//           path="/admin/menu"
//           element={
//             <AdminRoute>

//               <AdminMenu />

//             </AdminRoute>
//           }
//         />
//       </Routes>

//       <Footer />
//     </div >
//   );
// }

// export default App;

import './App.css';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import MyHome from './components/MyHome';
import Header from './components/Header';
import Footer from './components/Footer';
import CommentList from './components/CommentList';
import PostComment from './components/PostComment';
import SignUp from './components/SignUp';
import SignIn from './components/SignIn';
import EmailVerification from './components/EmailVerification';
import NavigationBar from './components/NavigationBar';
import Takeaway from './components/Takeaway';
import TakeawayChinese from './components/TakeawayChinese';
import Profile from './components/Profile';
import OrderConfirmation from './components/OrderConfirmation';
import MyOrders from './components/MyOrders';
import AdminOrders from './components/AdminOrders';
import AdminMenu from './components/AdminMenu';
import AdminRoute from './components/AdminRoute';
import AboutUs from './components/AboutUs';

function App() {
  const [logInState, setLogInState] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    const checkLogin = async () => {
      try {
        const response = await axios.get('http://localhost:8000/me', {
          withCredentials: true,
        });

        const userData = response.data.userData || response.data.user || response.data;
        setCurrentUser(userData);
        setLogInState(true);
      } catch (error) {
        setCurrentUser(null);
        setLogInState(false);
      } finally {
        setAuthLoading(false);
      }
    };

    checkLogin();
  }, []);

  const handleLogout = async () => {
    try {
      await axios.post(
        'http://localhost:8000/logout',
        {},
        { withCredentials: true }
      );
    } catch (error) {
      console.error('Logout request failed:', error);
    } finally {
      setCurrentUser(null);
      setLogInState(false);

      // Remove only old auth values from the previous architecture.
      // Do NOT clear localStorage because TakeawayCart should remain.
      localStorage.removeItem('Token');
      localStorage.removeItem('TokenExpiration');
      localStorage.removeItem('LoggedIn');
      localStorage.removeItem('Username');
      localStorage.removeItem('user');
    }
  };

  if (authLoading) {
    return <p>Checking login...</p>;
  }

  return (
    <div className="App">
      <NavigationBar
        logInState={logInState}
        currentUser={currentUser}
        handleLogout={handleLogout}
      />

      <Header />

      <Routes>
        <Route path="/" element={<MyHome />} />

        <Route
          path="/commentlist"
          element={
            <CommentList
              logInState={logInState}
              currentUser={currentUser}
            />
          }
        />

        <Route
          path="/profile"
          element={logInState ? <Profile /> : <Navigate to="/signin" replace />}
        />

        <Route
          path="/postcomment"
          element={logInState ? <PostComment /> : <Navigate to="/signin" replace />}
        />

        <Route
          path="/signup"
          element={logInState ? <Navigate to="/" replace /> : <SignUp />}
        />

        <Route
          path="/signin"
          element={
            logInState ? (
              <Navigate to="/" replace />
            ) : (
              <SignIn
                setLogInState={setLogInState}
                setCurrentUser={setCurrentUser}
              />
            )
          }
        />

        <Route path="/emailverification/:token" element={<EmailVerification />} />

        <Route
          path="/takeaway"
          element={
            <Takeaway
              logInState={logInState}
              currentUser={currentUser}
            />
          }
        />

        <Route path="/takeawaychinese" element={<TakeawayChinese />} />

        {/* Guest orders must be able to reach confirmation too. */}
        <Route
          path="/order-confirmation/:id"
          element={<OrderConfirmation logInState={logInState} />}
        />

        <Route
          path="/my-orders"
          element={logInState ? <MyOrders /> : <Navigate to="/signin" replace />}
        />

        <Route path="/aboutus" element={<AboutUs />} />

        <Route
          path="/admin/orders"
          element={
            <AdminRoute>
              <AdminOrders />
            </AdminRoute>
          }
        />

        <Route
          path="/admin/menu"
          element={
            <AdminRoute>
              <AdminMenu />
            </AdminRoute>
          }
        />
      </Routes>



      <Footer />
    </div>
  );
}

export default App;