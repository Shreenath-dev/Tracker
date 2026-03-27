import isEmpty from "is-empty";
import ms from "ms";
import { v4 as uuid } from "uuid"
import {
    Tokens,
    User,
    Organisation,
    Security,
    Permission
} from "@/models";
import generateOtp from "@/utils/generateOtp";
import { sendEmailWithTemplate } from "@/controllers/utility/mail.controller";
import { content } from "googleapis/build/src/apis/content";
import config from "@/config";
import { compareOTP, hashingOTP } from "@/security/password";
import { token } from "morgan";
import { decodeToken, generateAccessToken, generateRefreshToken } from "@/security/jwt";
import { decode } from "jsonwebtoken";

export const getAdminProfile = async (req, res) => {
    try {
        const { user } = req

        if (!user) { return res.status(400).json({ status: false, message: "Bad request" }) }

        const userData = await User.findById(user.id)

        if (!userData) { return res.status(400).json({ status: false, message: "User not found" }) }

        const data = {
            fullname: userData.name,
            email: userData.email,
            role: userData.role,
            isverified: userData.isVerified
        }

        return res.status(200).json({ status: true, message: "Data fetched successfully", data })


    }
    catch (error) {
        return res.status(500).json({ status: false, message: "Internal server error", error: error.message })
    }
}

export const updateAdminProfile = async (req, res) => {
    try{
        const { user,body } = req
        if (!user) {
             return res.status(400).json({ status: false, message: "Bad request" }) 
            }
        const userData = await User.findByIdAndUpdate(user.id,body)
        if (!userData) { 
            return res.status(400).json({ status: false, message: "User not found" }) 
        }
        return res.status(200).json({ status: true, message: "Data updated successfully", userData })
    }
    catch(error){
        return res.status(500).json({ status: false, message: "Internal server error", error: error.message })
    }
}

