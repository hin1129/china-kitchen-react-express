class AuthService {
    getCurrentUser() {
        return JSON.parse(localStorage.getItem("user")); // assumes user stored in localStorage
    }

    logout() {
        localStorage.removeItem("user");
    }

    login(userData) {
        localStorage.setItem("user", JSON.stringify(userData));
    }
}

export default new AuthService();