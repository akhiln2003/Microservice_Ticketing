import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import Jwt from 'jsonwebtoken';
import { User } from '../models/user';
import { BadRequestError , validateRequest } from '@4ktickets/common';
const router = express.Router();

router.post('/api/users/signup', [
    body('email')
        .isEmail()
        .withMessage("Email must be valid"),
    body('password')
        .trim()
        .isLength({ min: 4, max: 20 })
        .withMessage("Password must be between 4 and 20 characters")
], validateRequest, async (req: Request, res: Response) => {

    const { email, password } = req.body;
    const existingUser = await User.findOne({ email: email });
    if (existingUser) {
        throw new BadRequestError("Email is alredy user");
    }

    const user = User.build({ email, password });
    await user.save();

    // Generate JWT 
    const userJwt = Jwt.sign({
        id: user.id,
        email: user.email
    }, process.env.JWT_KEY!);


    // Store it on session Object 
    req.session = {
        jwt: userJwt
    }

    res.status(201).send(user)

});


export { router as signupRouter }

