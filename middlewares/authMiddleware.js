import jwt from 'jsonwebtoken';
import User from '../models/user';



export const authMiddlewares = (requiredRole = null) => {
    return async (req, res, next) => {
        try {
            
            const token = req.headers.authorization && req.headers.authorization.split(' ')[1];
            if(!token) {
                return res.status(401).json({
                    success: false,
                    message: 'Access denied. No token provided'
                });
            }

            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = decoded;

            const user = await User.findById(req.user.id);
            if(!user) {
                return res.status(400).json({
                    success: false,
                    message: 'User not found'
                });
            }

            if(requiredRole && user.role !== requiredRole) {
                return res.status(403).json({
                    success: false,
                    message: `Access denied. Requires ${requiredRole} role`
                });
            }
            req.user = user;
            next();
        } catch (error) {
            console.error('Authorization error:', error);
            res.status(401).json({
                success:false,
                message: "Invalid token"
            });
        }
    };
};