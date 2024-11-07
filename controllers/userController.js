import User from "../models/user.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';


export const registerUserController = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;
        if (!name || !email || !password || !role) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        }

        const userExists = await User.find({ email });
        if (!userExists) {
            return res.status(400).json({
                success: false,
                message: "User already exists"
            });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            name,
            email,
            password: hashedPassword,
            role,
        });

        await newUser.save()
        res.status(200).json({
            success: true,
            message: "User created successfully",
            user: {
                id: newUser._id,
                name: newUser.name,
                email: newUser.email,
                password: newUser.password,
                role: newUser.role
            }
        })
    } catch (error) {
        console.error(error);
        res.status(500).json({
            seccess: false,
            message: "Server error"
        });
    }
};

export const loginUserController = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email, !password) {
            return res.status(400).json({
                success: false,
                message: 'Email and password are required'
            });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({
                success: false,
                message: 'Invalid email and password'
            });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({
                success: false,
                message: 'Invalid credentials'
            });
        };


        const token = jwt.sign(
            {
                id: user._id, role: user.role
            },
            process.env.JWT_SECRET,
            { expiresIn: "6h" }
        );

        res.cookie('token', token, {
            httpOnly: true,
            maxAge: 3600000,
            sameSite: 'strict'
        });

        return res.status(200).json({
            success: true,
            message: "Login Successfully",
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                roel: user.role,
            }
            
        })
    } catch (error) {
        console.error("Loginb error:", error)
        return res.status(500).json({
            success: false,
            message: "server error"
        });
    }
};

export const logoutUserController = async(req, res) => {
    try {
        res.clearCookie('token');

        return res.status(200).json({
            success:true,
            message: "Logged out successfully"
        });
    } catch (error) {
        console.error("Logout error:", error)
        return res.status(500).json({
            success:false,
            message:'Server error'
        });
    }
};