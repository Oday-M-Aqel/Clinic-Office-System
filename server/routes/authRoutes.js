import express from "express";
const router = express.Router();
import {signUp,logIn,logOut,refresh} from "../controller/Auth.controller";

router.post('/signup', signUp);
router.post('/login', logIn);
router.post('/refresh', refresh);
router.post('/logout', logOut);

export default router;