import User from "../models/user.model.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { validateEmail } from "../helpers/validations.js";

export const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const isEmailValid = validateEmail(email);

        if(!isEmailValid){
            return res.status(400).json({ message: "Enter a valid email" });
        }
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }


        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        const token = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        return res.status(200).json({
            message: "Login successful",
            token,
            data: {
                name: user.name,
                username: user.username,
                email: user.email,
                dateOfBirth: user.dateOfBirth,
                country: user.country,
                gender: user.gender,
            },
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

export const signup = async (req, res) => {
    const { name, username, email, password, dob, country, gender } = req.body;

    try {
        const isEmailValid = validateEmail(email);

        if(!isEmailValid){
            return res.status(400).json({ message: "Enter a valid email" });
        }
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);


        const newUser = new User({
            name,
            username,
            email,
            password: hashedPassword,
            dateOfBirth: dob,
            country,
            gender,
        });

        await newUser.save();

        return res.status(201).json({
            message: "User created successfully",
            data: {
                name: newUser.name,
                username: newUser.username,
                email: newUser.email,
                dateOfBirth: newUser.dateOfBirth,
                country: newUser.country,
                gender: newUser.gender,
            },
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

export const searchUser = async (req, res) => {
    const { query } = req.params;

    try {
        const user = await User.findOne({ 
            $or: [{ username: query }, { email: query }]
        }).select("-password");

        if (!user) return res.status(404).json({ message: "User not found" });

        return res.status(200).json({ user });
    } catch (error) {
        return res.status(500).json({ message: "Internal server error" });
    }
};
