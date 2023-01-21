import express from 'express';
import asyncHandler from 'express-async-handler';
import multer from 'multer';
import path from 'path';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import User from '../Models/UserModel.js';

const createUserRouter = express.Router();
const JWT_SECRET_VERIFIED = 'baloshop';

// nhập thông tin để đăng kí tài khoản
createUserRouter.post(
    '/verified',
    asyncHandler(async (req, res) => {
        const { name, email, phone, password } = req.body;

        const userExists = await User.findOne({ email });
        if (userExists) {
            res.status(400);
            throw new Error('Tài khoản đã tồn tại');
        }
        const token = jwt.sign({ name, email, phone, password }, JWT_SECRET_VERIFIED, {
            expiresIn: '2m',
        });
        if (token) {
            const link = `http://localhost:5000/api/verifiedEmail/verified/${token}`;
            var transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: 'balostore.owner@gmail.com',
                    pass: 'amnbhcaioprqittf',
                },
            });

            var mailOptions = {
                from: 'balostore.owner@gmail.com',
                to: email,
                subject: 'BaloStore kính chào quý khách, quý khách hãy nhấp vào đường link xác minh đăng kí tài khoản',
                text: link,
            };

            transporter.sendMail(mailOptions, function (error, info) {
                if (error) {
                    console.log(error);
                } else {
                    console.log('Email sent: ' + info.response);
                }
            });
            res.json({ status: 'Link xác minh đã gửi qua email, vui lòng kiểm tra hòm thư của bạn' });
        }
    }),
);

//xác minh tài khoản qua email
createUserRouter.get('/verified/:token', async (req, res) => {
    const { token } = req.params;
    const verify = jwt.verify(token, JWT_SECRET_VERIFIED);
    const { name, email, phone, password } = verify;

    const userExists = await User.findOne({ email });

    if (userExists) {
        res.send('Thời gian đã hết hạn hoặc đã xác minh');
    }
    if (verify) {
        await User.create({
            name,
            email,
            phone,
            password,
        });
        res.render('verifyUser');
    }
});

export default createUserRouter;
