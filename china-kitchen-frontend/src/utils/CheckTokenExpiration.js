import Cookies from 'universal-cookie'

export const checkTokenExpiration = (handleLogout) => {
    const cookies = new Cookies()

    const localStorageToken = localStorage.getItem('Token');
    const expirationTime = localStorage.getItem('TokenExpiration');
    const cookiesToken = cookies.get('Token')

    if (localStorageToken && expirationTime && cookiesToken) {
        const currentTime = new Date().getTime();

        if (currentTime > Number(expirationTime)) { handleLogout(); }
        // else { setLogInState(true); }
    }
};