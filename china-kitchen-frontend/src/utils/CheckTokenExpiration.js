// import Cookies from 'universal-cookie'

// export const checkTokenExpiration = (handleLogout) => {
//     const cookies = new Cookies()

//     const localStorageToken = localStorage.getItem('Token');
//     const expirationTime = localStorage.getItem('TokenExpiration');
//     const cookiesToken = cookies.get('Token')

//     if (localStorageToken && expirationTime && cookiesToken) {
//         const currentTime = new Date().getTime();

//         if (currentTime > Number(expirationTime)) { handleLogout(); }
//         // else { setLogInState(true); }
//     }
// };

// The JWT is now inside an HttpOnly cookie, so frontend JavaScript cannot
// and should not read or decode it. App.js checks /me instead.
export const checkTokenExpiration = async () => {
    return;
};
