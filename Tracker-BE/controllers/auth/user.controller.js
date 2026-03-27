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

export const signUp = async (req, res) => {
    try {
        const { body } = req;

        if (isEmpty(body) || isEmpty(body.email)) {
            return res.status(400).json({ status: "false", message: "Email is required" });
        }

        const userExist = await User.findOne({ email: body.email.toLowerCase() });

        if (userExist) {
            return res.status(400).json({ status: "false", message: "User already exist" });
        }

        const otp = generateOtp();

        const otpExpiry = new Date(Date.now() + ms("10m"));
        const otpSecret = uuid();

        const emailContext = {
            identifier: "EMAIL_VERIFY_OTP",
            to: body.email.toLowerCase(),
            content: {
                otp: otp,
                email: body.email.toLowerCase(),
            }
        };

        const emailSent = await sendEmailWithTemplate(emailContext);

        if (isEmpty(emailSent)) {
            console.log("Email Failure: Stopping signup process");
            return res.status(500).json({ status: false, message: "Failed to send OTP email" });
        }

        const otpHashPromise = hashingOTP(otpSecret);
        // if (isEmpty(otpHash)) {
        //     console.log("Hashing Failure: Stopping signup process");
        //     return res.status(500).json({ status: false, message: "Failed to hash OTP" });
        // }

        const organisation = await Organisation.create({
            organisationName: body.orgName
        });

        if (!organisation) {
            return res.status(500).json({ status: false, message: "Failed to create organisation" });
        }

        const [newUser, otpHashResult] = await Promise.all([
            User.create({
                name: body.name,
                email: body.email.toLowerCase(),
                organisationId: organisation._id,
            }),
            otpHashPromise
        ])

        if (!newUser) {
            return res.status(500).json({ status: "false", message: "Failed to create user" });
        }

        const securityData = {
            userId: newUser._id,
            clientType: "admin",
            type: "emailVerification",
            mode: "email",
            value: otp,
            secret: otpSecret,
            expiresAt: otpExpiry
        };

        const securityRecord = await Security.create(securityData);

        if (!securityRecord) {
            return res.status(500).json({ status: false, message: "Failed to create security record" });
        }

        const cookieConfig = {
            httpOnly: true,
            secure: true,
            sameSite: "none",
            partitioned: true,
            expires: new Date(Date.now() + ms(config.COOKIE_EXPIRY || "7d"))
        };

        res.header("Access-Control-Allow-Origin", config.FRONTEND_URL);
        res.header("Access-Control-Allow-Credentials", "true");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        res.cookie("emailVerification", otpHashResult.hash, cookieConfig);


        const token = Buffer.from(newUser._id.toString()).toString("hex");

        return res.status(201).json({ status: "true", message: "User created successfully", token });

    }
    catch (error) {

        return res.status(500).json({ status: "false", message: "Internal server error", error: error.message });
    }
};

export const verifyOtp = async (req, res) => {
    try {
        const { body, cookies } = req;

        if (isEmpty(cookies.emailVerification)) {
            return res.status(400).json({ status: "false", message: "OTP cookie is missing" });
        }

        const tokenId = Buffer.from(body.token, "hex").toString("utf-8");

        const user = await User.findById(tokenId);

        const securityRecord = await Security.findOne({ userId: tokenId, type: "emailVerification" }).sort({ createdAt: -1 }).limit(1);

        if (!securityRecord) {
            return res.status(400).json({ status: "false", message: "Invalid token or OTP" });
        }

        if (!(await compareOTP(securityRecord.secret, cookies.emailVerification))) {
            return res.status(400).json({ status: "false", message: "Invalid OTP" });
        }

        if (body.otp !== securityRecord.value) {
            return res.status(400).json({ status: "false", message: "Invalid OTP" });
        }

        if (securityRecord.expiresAt < new Date()) {
            return res.status(400).json({ status: "false", message: "OTP has expired" });
        }

        const token = Buffer.from(user._id.toString()).toString("hex");

        const verify = await User.updateOne({ _id: tokenId }, { isVerified: true });

        if (!verify) {
            return res.status(500).json({ status: "false", message: "Failed to verify user" });
        }

        const updateSecurity = await Security.findByIdAndDelete({ _id: securityRecord._id, type: "emailVerification" });

        if (!updateSecurity) {
            return res.status(500).json({ status: "false", message: "Failed to update security record" });
        }

        const createPasswordSecret = uuid();
        const createExpirery = new Date(Date.now() + ms("10m"));

        const [createPasswordhash, createPasswordSecurity] = await Promise.all([
            hashingOTP(createPasswordSecret),
            Security.create({
                userId: tokenId,
                clientType: "admin",
                type: "createPassword",
                mode: "email",
                value: "createPassword",
                secret: createPasswordSecret,
                expiresAt: createExpirery
            })
        ]);

        if (!createPasswordSecurity) {
            return res.status(500).json({ status: "false", message: "Failed to create security record for password creation" });
        }

        if (isEmpty(createPasswordhash)) {
            return res.status(500).json({ status: "false", message: "Failed to hash secret for password creation" });
        }

        res.clearCookie("emailVerification", {
            httpOnly: true,
            secure: true,
            sameSite: "none",
            partitioned: true,
        });

        res.header("Access-Control-Allow-Origin", config.FRONTEND_URL);
        res.header("Access-Control-Allow-Credentials", "true");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        res.cookie("createPassword", createPasswordhash.hash, {
            httpOnly: true,
            secure: true,
            sameSite: "none",
            partitioned: true,
            expires: createExpirery
        });

        return res.status(200).json({ status: "true", message: "OTP verified successfully", token });

    }
    catch (error) {
        return res.status(500).json({ status: "false", message: "Internal server error", error: error.message });
    }
};

export const createPassword = async (req, res) => {
    try {
        const { body, cookies } = req;

        if (isEmpty(cookies.createPassword)) {
            return res.status(400).json({ status: "false", message: "Password creation cookie is missing" });
        }

        if (isEmpty(body.token)) {
            return res.status(400).json({ status: "false", message: "Token is required" });
        }

        if (isEmpty(body.password) || body.password.length < 8) {
            return res.status(400).json({ status: "false", message: "Password must be at least 8 characters" });
        }

        if (body.password !== body.confirmPassword) {
            return res.status(400).json({ status: "false", message: "Passwords do not match" });
        }

        const tokenId = Buffer.from(body.token, "hex").toString("utf-8");

        const [findUser, securityRecord] = await Promise.all([
            User.findById(tokenId),
            Security.findOne({ userId: tokenId, type: "createPassword" }).sort({ createdAt: -1 })
        ]);

        if (!findUser) {
            return res.status(400).json({ status: "false", message: "Invalid token" });
        }

        if (!securityRecord) {
            return res.status(400).json({ status: "false", message: "Invalid or expired session" });
        }

        if (securityRecord.expiresAt < new Date()) {
            return res.status(400).json({ status: "false", message: "Session has expired, please verify email again" });
        }

        const cookieCheck = await compareOTP(securityRecord.secret, cookies.createPassword);
        if (!cookieCheck.status) {
            return res.status(400).json({ status: "false", message: "Invalid session" });
        }

        const passwordHash = await hashingOTP(body.password);
        if (!passwordHash || !passwordHash.hash) {
            return res.status(500).json({ status: "false", message: "Failed to hash password" });
        }

        const sessionId = uuid();
        const accessToken = `Bearer ${generateAccessToken({ sessionId, id: findUser._id, organisation: findUser.organisationId, role: findUser.role })}`;
        const refreshToken = generateRefreshToken({ sessionId, id: findUser._id, organisation: findUser.organisationId, role: findUser.role });

        await Promise.all([
            User.updateOne({ _id: tokenId }, { password: passwordHash.hash, passwordUpdatedAt: new Date() }),
            Security.findByIdAndDelete(securityRecord._id),
            Tokens.create({
                clientId: findUser._id,
                sessionId,
                accessToken,
                refreshToken,
                expiration: new Date(Date.now() + ms(config.REFRESH_TOKEN_EXPIRY || "7d"))
            })
        ]);

        const cookieConfig = { httpOnly: true, secure: true, sameSite: "none", partitioned: true };

        res.clearCookie("createPassword", cookieConfig);
        res.cookie("refreshToken", refreshToken, {
            ...cookieConfig,
            expires: new Date(Date.now() + ms(config.REFRESH_TOKEN_EXPIRY || "7d"))
        });

        return res.status(200).json({ status: "true", message: "Password created successfully", accessToken });
    }
    catch (error) {
        return res.status(500).json({ status: "false", message: "Internal server error", error: error.message });
    }
}

export const signin = async (req, res) => {
    try {
        const { body } = req;

        if (isEmpty(body) || isEmpty(body.email) || isEmpty(body.password)) {
            return res.status(400).json({ status: "false", message: "Email and password are required" });
        }

        const user = await User.findOne({ email: body.email.toLowerCase() });

        if (!user) {
            return res.status(400).json({ status: "false", message: "Invalid email or password" });
        }

        if (!user.isVerified) {
            return res.status(400).json({ status: "false", message: "Email not verified, please verify your email before signing in" });
        }

        const passwordMatch = await compareOTP(body.password, user.password);

        if (!passwordMatch) {
            return res.status(400).json({ status: "false", message: "Invalid email or password" });
        }

        const sessionId = uuid();
        const accessToken = `Bearer ${generateAccessToken({ sessionId, id: user._id, organisation: user.organisationId, role: user.role })}`;
        const refreshToken = `Bearer ${generateRefreshToken({ sessionId, id: user._id, organisation: user.organisationId, role: user.role })}`;

        await Tokens.create({
            clientId: user._id,
            sessionId: sessionId,
            accessToken,
            refreshToken,
            expiration: new Date(Date.now() + ms(config.REFRESH_TOKEN_EXPIRY || "7d"))
        });

        const cookieConfig = body.rememberMe ? { httpOnly: true, secure: true, sameSite: "none", partitioned: true, expires: new Date(Date.now() + ms(config.REFRESH_TOKEN_EXPIRY || "7d")) } : { httpOnly: true, secure: true, sameSite: "none", partitioned: true };

        res.header("Access-Control-Allow-Origin", config.FRONTEND_URL);
        res.header("Access-Control-Allow-Credentials", "true");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        res.cookie("refreshToken", refreshToken, cookieConfig);

        return res.status(200).json({ status: "true", message: "Signed in successfully", accessToken });



    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ status: "false", message: "Internal server error", error: error.message });
    }
}

export const refreshToken = async (req, res) => {
    try {
        const { cookies } = req;
        if (isEmpty(cookies.refreshToken)) {
            return res.status(400).json({ status: "false", message: "Refresh token is missing" });
        }

        const decoded = decodeToken(cookies.refreshToken);

        if (!decoded || !decoded.sessionId || !decoded.id) {
            return res.status(400).json({ status: "false", message: "Invalid refresh token" });
        }

        const tokenRecord = await Tokens.findOne({ clientId: decoded.id, sessionId: decoded.sessionId, refreshToken: cookies.refreshToken });

        if (!tokenRecord) {
            return res.status(400).json({ status: "false", message: "Invalid refresh token" });
        }

        let user;

        const findUser = await User.findById(tokenRecord.clientId);

        if (!findUser) {
            return res.status(400).json({ status: "false", message: "Invalid refresh token" });
        }
        const accessToken = `Bearer ${generateAccessToken({ sessionId: decoded.sessionId, id: findUser._id, organisation: findUser.organisationId, role: findUser.role })}`;
        await Tokens.updateOne({ sessionId: tokenRecord.sessionId }, { $set: { accessToken } });

        return res.status(200).json({ status: "true", message: "Access token refreshed successfully", accessToken });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: "false", message: "Internal server error", error: error.message });
    }}
    
    export const signout = async (req, res) => {
        try {
            const { user, token } = req;

            await Tokens.findOneAndDelete({ clientId: user._id, accessToken: token });

            res.header("Access-Control-Allow-Origin", config.FRONTEND_URL);
            res.header("Access-Control-Allow-Credentials", "true");
            res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
            res.clearCookie("refreshToken", {
                httpOnly: true,
                secure: true,
                sameSite: "none",
                partitioned: true,
            });

            return res.status(200).json({ status: "true", message: "Signed out successfully" });
        }
        catch (error) {

            return res.status(500).json({ status: "false", message: "Internal server error", error: error.message });
        }
    }