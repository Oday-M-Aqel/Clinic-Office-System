/* eslint-disable no-unused-vars */
import {mongoose} from 'mongoose';
import {isEmail, isString, isNumeric, isStrongPassword} from 'validator';
import bcrypt from "bcrypt";

const patient_schema = new mongoose.Schema ({
    patient_id: {
        type: Number,
        required: true,
        minlength: [9,"your Id must contain 9 digits"],
        validate: [isNumeric, "your Id must have just numbers"],
    }, 
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
    avatar:{
        type: String,
    },
    gender: {
        type: String,
        enum:["Male","Female","Other"],
        required: true,
    },
    birthDate: {
        type: Date,
        required: true,
    },
    insurance: {
        type: String,
        enum:["No Insurance", "Pal Health", "Almashreq"],
        required: true,
        default:"No Insurance",
    },
    email: {
        type: String,
        required: true,
        validate:[isEmail, "Enter valid email"],
    },
    phone: {
        type: Number,
        required: true,
        validate:[isNumeric, "your phone number must contain just numbers"],
        match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Please enter a valid email address"],
    },
    password: {
        type: String,
        required: true,
        // validate: [isStrongPassword, "password is too weak"],
    },
    chronic_diseases: {
        type: String,
        required: true,
        enum: ["heart disease","stroke","diabetes","arthritis","osteoporosis",
            "asthma","chronic kidney disease","chronic obstructive pulmonary disease"],
        default:"No diseases",
    },
    note:{
        type: String,
        required: false,
        default: "No note",
    },
    createdAt: {
        type: Date,
        default: Date.now,
    }

});

patient_schema.pre("save", async function (next) {
    const added = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, added);
    const now = new Date();
    const gmtPlus3 = new Date(now.getTime() + (3 * 60 * 60 * 1000));
    this.createdAt = gmtPlus3;
    next();
});

export default patient_schema;