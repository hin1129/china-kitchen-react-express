import User from '../models/user.model.js';

const ADMIN_MAX_SESSION_AGE_MS =
    30 * 60 * 1000;

const clearAuthCookie = (response) => {
    response.clearCookie('token', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/'
    });
};

export const requireAdmin = async (
    request,
    response,
    next
) => {
    try {
        if (
            !request.user ||
            !request.user.userId
        ) {
            return response.status(401).json({
                message: 'Authentication required',
                code: 'NOT_AUTHENTICATED'
            });
        }

        if (!request.user.iat) {
            clearAuthCookie(response);

            return response.status(401).json({
                message:
                    'Admin session expired. Please sign in again.',
                code:
                    'ADMIN_SESSION_EXPIRED'
            });
        }

        const issuedAtMs =
            request.user.iat * 1000;

        const adminSessionAgeMs =
            Date.now() - issuedAtMs;

        if (
            adminSessionAgeMs < 0 ||
            adminSessionAgeMs >
                ADMIN_MAX_SESSION_AGE_MS
        ) {
            clearAuthCookie(response);

            return response.status(401).json({
                message:
                    'Admin session expired. Please sign in again.',
                code:
                    'ADMIN_SESSION_EXPIRED'
            });
        }

        const user = await User.findById(
            request.user.userId
        );

        if (!user) {
            clearAuthCookie(response);

            return response.status(401).json({
                message: 'User not found',
                code: 'INVALID_SESSION'
            });
        }

        if (user.role !== 'admin') {
            return response.status(403).json({
                message: 'Admin access required',
                code: 'ADMIN_REQUIRED'
            });
        }

        // Admin accounts must have 2FA configured,
        // and the current login session must have
        // completed the 2FA challenge.
        if (
            !user.twoFactorEnabled ||
            request.user.twoFactorVerified !== true
        ) {
            clearAuthCookie(response);

            return response.status(401).json({
                message:
                    'Two-factor authentication required',
                code:
                    'ADMIN_2FA_REQUIRED'
            });
        }

        request.currentUser = user;
        return next();
    }
    catch (error) {
        console.error(
            'Admin check failed:',
            error
        );

        return response.status(500).json({
            message:
                'Failed to check admin permission'
        });
    }
};

export default requireAdmin;
