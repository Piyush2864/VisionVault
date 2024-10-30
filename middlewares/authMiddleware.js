import jwt from 'jsonwebtoken';
import User from '../models/user.js';
import cookieParser from 'cookie-parser'



export const authMiddlewares = (requiredRole = null) => {

    return async (req, res, next) => {
        try {
            console.log("Cookies:", req.cookies); 
            const token = req.cookies.token || req.headers.authorization?.split(' ')[1];
            console.log(token, "token")
            if(!token) {
                return res.status(401).json({
                    success: false,
                    message: 'Access denied. No token provided'
                });
            }

            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = { id: decoded.id };
            console.log("decoded token:", decoded)
            

            const user = await User.findById(req.user.id);
            console.log("user:". user)
            if(!user) {
                return res.status(400).json({
                    success: false,
                    message: 'User not found'
                });
            }
            console.log("user:". user)


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




   // const authHeader = req.headers.authorization;
            // if (!authHeader || !authHeader.startsWith('Bearer ')) {
            //     return res.status(401).json({
            //         success: false,
            //         message: 'Authorization token missing or malformed.'
            //     });
            // }