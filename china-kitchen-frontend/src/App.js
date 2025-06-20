import './App.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import MyHome from './components/MyHome';
import Header from './components/Header';
import Footer from './components/Footer';
import CommentList from './components/CommentList'
import PostComment from './components/PostComment';
import SignUp from './components/SignUp';
import SignIn from './components/SignIn';
import EmailVerification from './components/EmailVerification';
import Cookies from 'universal-cookie'
import NavigationBar from './components/NavigationBar';
import Takeaway from './components/Takeaway';
import TakeawayChinese from './components/TakeawayChinese';
import ShoppingCart from './components/ShoppingCart';

function App() {
  const [logInState, setLogInState] = useState(false);
  const cookies = new Cookies()

  const handleLogout = () => {
    setLogInState(false);
    cookies.remove('Token');
    localStorage.clear();
    // localStorage.removeItem('Token');
    // localStorage.removeItem('TokenExpiration');
    // localStorage.removeItem('LoggedIn');
    // localStorage.removeItem('Username');
  }

  const checkTokenExpiration = () => {
    const cookiesToken = cookies.get('Token')
    const localStorageToken = localStorage.getItem('Token');
    const expirationTime = localStorage.getItem('TokenExpiration');

    if (cookiesToken && localStorageToken && expirationTime) {
      const currentTime = new Date().getTime();

      if (currentTime > Number(expirationTime)) { handleLogout(); }
      else { setLogInState(true); }
    }
  };

  useEffect(() => {
    checkTokenExpiration();

    // Set up interval to periodically check the token's expiration status
    const interval = setInterval(checkTokenExpiration, 1000); // Check every second

    // Clean up the interval when the component is unmounted
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="App">
      <NavigationBar logInState={logInState} handleLogout={handleLogout} />
      <Header />

      <Routes>
        <Route path='/' element={<MyHome />} />
        <Route path="/commentlist" element={<CommentList logInState={logInState} />} />

        <Route
          path="/postcomment"
          element={
            logInState ? (
              <PostComment />
            ) : (
              <Navigate to="/signin" />
              // <SignIn />
            )
          }
        />

        <Route
          path="/signup"
          element={
            logInState ? (
              <Navigate to="/" />
            ) : (
              <SignUp />
            )
          }
        />

        <Route
          path="/signin"
          element={
            logInState ? (
              <Navigate to="/" />
            ) : (
              <SignIn setLogInState={setLogInState} />
            )
          }
        />

        <Route path="/emailverification/:token" element={<EmailVerification />} />
        <Route path='/takeaway' element={<Takeaway />} />
        <Route path='/takeawaychinese' element={<TakeawayChinese />} />

        {/* <Route path='shoppingcart' element={<ShoppingCart />} /> */}
        {/* <Route
          path="/shoppingcart"
          element={
            logInState ? (
              <Navigate to="/" />
            ) : (
              <SignIn setLogInState={setLogInState} />
            )
          }
        /> */}
      </Routes>

      <Footer />
    </div >
  );
}

export default App;