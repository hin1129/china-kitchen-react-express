// class AuthService {
//     getCurrentUser() {
//         return JSON.parse(localStorage.getItem("user")); // assumes user stored in localStorage
//     }

//     logout() {
//         localStorage.removeItem("user");
//     }

//     login(userData) {
//         localStorage.setItem("user", JSON.stringify(userData));
//     }
// }

// export default new AuthService();

import axios from 'axios';

class AuthService {
    async getCurrentUser() {
        const response = await axios.get('http://localhost:8000/me', {
            withCredentials: true,
        });

        return response.data.userData || response.data.user || response.data;
    }

    async login(userData) {
        const response = await axios.post(
            'http://localhost:8000/signin',
            userData,
            { withCredentials: true }
        );

        return response.data;
    }

    async logout() {
        await axios.post(
            'http://localhost:8000/logout',
            {},
            { withCredentials: true }
        );
    }
}

export default new AuthService();