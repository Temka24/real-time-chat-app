import { Request, Response, NextFunction } from "express";
import dotenv from "dotenv";
import jwt from "jsonwebtoken"
import bcrypt from "bcryptjs"
import User from "../model/UserModel";
import { IUser } from "../model/UserModel";

export const register = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { username, email, password, avatarImage } = req.body;

        if (!username || !email || !password || !avatarImage) {
            res.json({ msg: "Sorry all fiend required", status: false })
            return;
        }

        const exist = await User.findOne({ email })
        if (exist) {
            res.json({ msg: "Already registered pls to login page", status: false, exist })
            return;
        }

        dotenv.config()
        const SecretKey = process.env.JWT_SECRET
        const hashedPassword = await bcrypt.hash(password, 10)

        if (!SecretKey || !hashedPassword) {
            res.json({ msg: "Secretkey or hash not find", status: false })
            return;
        }

        const newUser: IUser = new User({
            username,
            email,
            password: hashedPassword,
            avatarImage
        })
        await newUser.save()

        const token = jwt.sign({ id: newUser._id }, SecretKey as string, { expiresIn: '1d' })

        res.json({ msg: "Success to register", status: true, userData: { id: newUser._id, username, email, avatarImage }, token })

    } catch (err) {
        next(err)
    }
}


export const login = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            res.json({ msg: "All field required", status: false })
            return;
        }

        const currentUser: IUser | null = await User.findOne({ email })
        if (!currentUser) {
            res.json({ msg: "User is not registered", status: false })
            return;
        }

        if (!currentUser.password || !currentUser.username) {
            res.json({ msg: 'Password not found for this user', status: false });
            return;
        }

        const isCorrect = await bcrypt.compare(password, currentUser.password)

        dotenv.config()
        const SecretKey = process.env.JWT_SECRET
        if (!SecretKey) {
            res.json({ msg: "Secretkey or hash not find", status: false })
            return;
        }


        if (isCorrect) {
            const token = jwt.sign({ id: currentUser._id }, SecretKey as string, { expiresIn: '1d' })
            res.json({ msg: "Success to register", status: true, userData: { id: currentUser._id, username: currentUser.username, email, avatarImage: currentUser.avatarImage }, token })
            return;
        }
        else if (!isCorrect) {
            res.json({ msg: "Password incorrect bro ", status: false })
        }

    } catch (err) {
        next(err)
    }
}

export const getAllUsers = async (req: Request, res: Response, next: NextFunction) => {

    try {
        if (!req.params.id) {
            res.json({ msg: "User id is required", status: false });
            return;
        }
        const users = await User.find({ _id: { $ne: req.params.id as string } }).select([
            "username",
            "avatarImage",
            "_id"
        ])

        if (!users) {
            res.json({ msg: "Users not find", status: false })
            return;
        }

        res.json({ users, status: true })

    } catch (err) {
        next(err)
    }
}