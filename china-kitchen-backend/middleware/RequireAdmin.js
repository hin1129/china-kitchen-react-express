import User from '../models/user.model.js';

export const requireAdmin = async (request, response, next) => {
    try {
        if (!request.user || !request.user.userId) {
            return response.status(401).json({ message: 'Authentication required' });
        }
        const user = await User.findById(request.user.userId);
        if (!user) {
            return response.status(401).json({ message: 'User not found' });
        }
        if (user.role !== 'admin') {
            return response.status(403).json({ message: 'Admin access required' });
        }
        request.currentUser = user;
        next();
    }
    catch (error) {
        console.error('Admin check failed:', error);
        return response.status(500).json({ message: 'Failed to check admin permission' });
    }
};
export default requireAdmin;