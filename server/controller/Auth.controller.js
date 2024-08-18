import User, { findOne } from '../models/user.model'
require('dotenv').config()
import { compare } from 'bcrypt'
import { sign, verify } from 'jsonwebtoken'
import { uploadUserAvatar } from '../middleware/multerConfig'

const signUp = async (req, res) => {
    uploadUserAvatar(req, res, async (err) => {
        if (err) {
            return res.status(400).json({ message: err.message });
        }
        try {
            let {fName, lName,P_Id, email, password,
                 phone, Ch_Ds, note, gender, birthDate, Insure_Com, } = req.body;
            const parsedBirthDate = JSON.parse(birthDate);

            const existingUser = await findOne({ email });
            if (existingUser) {
                return res.status(400).json({ message: 'Email already exists' });
            }
            console.log('Request body:', req.body);
            console.log('Request file:', req.file);

            const newUser = new User({
                firstName: fName,
                lastName: lName,
                patient_id: P_Id,
                email: email,
                password: password,
                gender: gender,
                insurance: Insure_Com,
                chronic_diseases: Ch_Ds,
                phone: phone,
                birthDate: birthDate,
                note: note,
                avatar: req.file ? req.file.filename : null
            });
            await newUser.save();
            res.status(201).json({ message: 'User created successfully' });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    });
};

const logIn = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }

        const foundUser = await findOne({ email });
        if (!foundUser) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        const isPasswordValid = await compare(password, foundUser.password);
        if (!isPasswordValid) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        const accessToken = sign(
            { id: foundUser._id, email: foundUser.email },
            process.env.JWT_ACCESS_SECRET,
            { expiresIn: '1h' }
        );

        const refreshToken = sign(
            { id: foundUser._id, email: foundUser.email, roles: foundUser.roles[0] },
            process.env.JWT_REFRESH_SECRET,
            { expiresIn: '1d' }
        );

        res.cookie('pscdToken', refreshToken, {
            httpOnly: true,
            secure: true,
            maxAge: 24 * 60 * 60 * 1000,
        });

        res.status(200).json({
            message: 'Login successful',
            accessToken,
            userData: foundUser._id,
            userRole: foundUser.roles[0]
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const refresh = async (req, res) => {
    try {
        const refreshToken = req.cookies.pscdToken;
        if (refreshToken) {
            verify(refreshToken, process.env.JWT_REFRESH_SECRET, (err, decoded) => {
                if (err) {
                    return res.status(406).json({ message: 'Unauthorized' });
                } else {
                    const accessToken = sign(
                        { id: decoded.id, email: decoded.email, roles: decoded.roles },
                        process.env.JWT_ACCESS_SECRET,
                        { expiresIn: '1h' }
                    );
                    return res.status(200).json({
                        message: 'Token refreshed successfully',
                        accessToken,
                        userData: decoded.id,
                        userRole: decoded.roles,
                    });
                }
            });
        } else {
            return res.status(406).json({ message: 'Unauthorized' });
        }
    } catch (error) {
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};

const logOut = (req, res) => {
    res.cookie('pscdToken', null, {
        httpOnly: true,
        secure: true,
        maxAge: 1,
    })
    res.status(200).json({ message: 'Logged out successfully' })
}

export default {
    signUp,
    logIn,
    refresh,
    logOut
}
