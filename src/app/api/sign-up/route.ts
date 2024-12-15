import dbConnect from '@/lib/dbConnect';
import UserModel from '@/model/User';
import bcrypt from 'bcrypt';
import { sendVerificationEmail } from '@/helper/sendVerificationEmail';

export async function POST(request: Request) {
    await dbConnect();

    try {
        const { username, email, password } = await request.json();

        const existingVerifiedUserByUsername = await UserModel.findOne({
            username,
            isVerified: true,
        });

        if (existingVerifiedUserByUsername) {
            return Response.json(
                {
                    success: false,
                    message: 'Username is already taken',
                },
                { status: 400 },
            );
        }

        const existingUserByEmail = await UserModel.findOne({ email });

        // OTP generation
        let verificationCode = Math.floor(
            100000 + Math.random() * 900000,
        ).toString();

        if (existingUserByEmail) {
            //user exist but can be verified or unverified
            if (existingUserByEmail.isVerified) {
                return Response.json(
                    {
                        success: false,
                        message: 'User already exists',
                    },
                    { status: 400 },
                );
            } else {
                // unverified user, info update and saving to db
                const hashedPassword = await bcrypt.hash(password, 10);
                existingUserByEmail.password = hashedPassword;
                existingUserByEmail.verifyCode = verificationCode;
                existingUserByEmail.verifyCodeExpiry = new Date(
                    Date.now() + 360000,
                );

                await existingUserByEmail.save();
            }
        } else {
            //user does not exist, new user to be created
            const hashedPassword = await bcrypt.hash(password, 10);
            const expiryDate = new Date();
            expiryDate.setHours(expiryDate.getHours() + 1);

            const newUser = new UserModel({
                username,
                email,
                password: hashedPassword,
                verifyCode: verificationCode,
                verifyCodeExpiry: expiryDate,
                isVerified: false,
                isAcceptingMessages: true,
                messages: [],
            });

            await newUser.save();
        }

        // Send verification email
        const emailResponse = await sendVerificationEmail(
            email,
            username,
            verificationCode,
        );

        if (!emailResponse.success) {
            return Response.json(
                {
                    success: false,
                    message: emailResponse.message,
                },
                { status: 500 },
            );
        }

        return Response.json(
            {
                success: true,
                message:
                    'User registered successfully. Please verify your account.',
            },
            { status: 201 },
        );
    } catch (error) {
        console.error('Error registering user:', error);
        return Response.json(
            {
                success: false,
                message: 'Error registering user',
            },
            { status: 500 },
        );
    }
}
