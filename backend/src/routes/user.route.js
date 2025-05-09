import {Router} from 'express'
import { register, login, getUser } from '../controllers/user.controller.js'
import nodemailer from 'nodemailer'
import dotenv from 'dotenv'
dotenv.config()

const userRouter =Router()

userRouter.post("/register",register)
userRouter.post("/login",login)
userRouter.get("/get-user",getUser)



const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.USER_EMAIL,
      pass: process.env.USER_PASS
    },
  });
  
  userRouter.post("/invite-user", (req, res) => {
    const { email, url } = req.body;
  
    if (!email || !url) {
      return res.status(400).json({ message: "Email and URL are required" });
    }
  
    const mailOptions = {
      from: process.env.USER_EMAIL,
      to: email,
      subject: "🌍 You're Invited to Join a Trip!",
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f4f4f4;">
          <div style="background-color: white; padding: 20px; border-radius: 10px; text-align: center; box-shadow: 0 0 10px rgba(0,0,0,0.1);">
            <h2 style="color: #2E86C1;">✈️ You're Invited!</h2>
            <p style="font-size: 16px; color: #555;">You've been invited to join a trip. Click the button below to view and accept the invitation.</p>
            <img src="https://media.giphy.com/media/l0Exk8EUzSLsrErEQ/giphy.gif" alt="Trip Invitation" style="width: 100%; max-width: 400px; margin: 20px 0;" />
            <a href="${url}" style="display: inline-block; background-color: #28a745; color: white; padding: 12px 24px; border-radius: 5px; text-decoration: none; font-weight: bold;">Join Trip</a>
          </div>
          <p style="text-align:center; color: #999; font-size: 12px; margin-top: 20px;">If you did not expect this email, you can ignore it.</p>
        </div>
      `
    };
  
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Error sending email:", error);
        return res.status(500).json({ message: "Failed to send invitation email" });
      } else {
        console.log("Email sent:", info.response);
        return res.status(200).json({ message: "Invitation email sent successfully" });
      }
    });
  });


export default userRouter