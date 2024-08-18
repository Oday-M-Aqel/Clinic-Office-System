/* eslint-disable no-unused-vars */
import {mongoose} from "mongoose";
import { isNumeric, isString, isStrongPassword } from "validator";
import isEmail from "validator/lib/isEmail";
const doctors_schema = new mongoose.Schema({
    first_name: {
        type:String,
        minlength:[3,"Name must have at least 3 letters"],
        validate:[isString, "first name must be a string"],
        required: true,
    },
    last_name: {
        type:String,
        minlength:[3,"Name must have at least 3 letters"],
        validate:[isString, "last name must be a string"],
        required: true,
    },
    email: {
        type: String,
        required: true,
        validate:[isEmail, "your email isn't correct"],
    },
    phone: {
        type: Number,
        required: true,
        validate:[isNumeric, "your phone number must contain just numbers"],
    },
    password: {
        type: String,
        required: true,
        // validate: [isStrongPassword, "password is too weak"],
    },
    country: {
        type: String,
        required: true,
    },
    city: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        required:true,
    },
    age: {
        type: Number,
        validate: isNumeric,
        required: true,
    },
    qualification: {
        type: String,
        validate: isString,
        required: true,
    },
    experience: {
        type: Number,
        required: true,
    },
    specialization: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        minlength: [40, "your description must contain at least 40 letters"],
        required: false,
    }

});

export default doctors_schema;