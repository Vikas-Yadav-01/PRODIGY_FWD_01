import { User } from "../models/user.model.js";

const signup = async (req, res) => {
    try {
        const { userName, phoneNumber, password } = req.body
        if (!userName || !phoneNumber || !password) {
            return res.status(400).json({ message: "All fields are required" })
        }

        const existedUser = await User.findOne({ phoneNumber })
        if (existedUser) {
            return res.status(400).json({ message: "User already exist" })
        }

        const user = await User.create({
            userName,
            phoneNumber,
            password,
        })

        const token = await user.generateToken(user._id)
        const options = {
            httpOnly: true,
            secure: true
        }

        return res
            .status(201)
            .cookie("token", token, options)
            .json({ message: "User created sucessfully", success: true, user, token })
    } catch (error) {
        return res.status(500).json({ message: "Something went wrong", error: error.message })
    }
}

const login = async (req, res) => {
    try {
        const { phoneNumber, password } = req.body
        if (!phoneNumber || !password) {
            return res.status(400).json({ message: "Both fields are required" })
        }

        const user = await User.findOne({ phoneNumber })
        if (!user) {
            return res.status(401).json({ message: "User does not exist" })
        }

        const checkPassword = await user.isPasswordCorrect(password)
        if (!checkPassword) {
            return res.status(400).json({ message: "Password incorrect" })
        }

        const token = await user.generateToken(user._id)
        const options = {
            httpOnly: true,
            secure: true
        }

        return res
            .status(200)
            .cookie("token", token, options)
            .json({ message: "User logged In", success: true, user, token })
    } catch (error) {
        return res.status(500).json({ message: "Something went wrong", error: error.message })
    }
}

const fetchUser = async (req, res) => {
    try {
        const user = req.user
        if (!user) {
            return res.status(404).json({ message: "User not found" })
        }

        return res.status(200).json({ message: "User found", success: true, user })
    } catch (error) {
        return res.status(500).json({ message: "Something went wrong", error: error.message })
    }
}

export {
    signup,
    login,
    fetchUser
}