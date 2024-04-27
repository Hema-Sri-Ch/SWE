import { pool } from "../config/database.js";
import { ValidationChain } from 'express-validator';
const express = require("express");
//const app = express();
const { body, validationResult } = require("express-validator");


export const loginValidation = async(req, res, next) => {
    try {
        body('id').notEmpty().escape();
        body('password').notEmpty().escape();

        // Check for validation errors after applying express-validator functions
        const validationErrors = validationResult(req);
        if (!validationErrors.isEmpty()) {
            return res.status(400).json({ errors: validationErrors.array() });
        }

        // If no validation errors and credentials are provided, proceed to the next middleware
        next();
    } catch (error) {
        console.log(err.message)
        res.status(401).json("Login Validation failed")  
    }
};

export const gradeValidation = async(req, res, next) =>{
    try {
        body('mygrades').isArray().notEmpty();
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const gradesArray = req.body.mygrades;
        const grades_list = await pool.query("SELECT * FROM grades");
        const isValidGrades = gradesArray.every(grade => grades_list.includes(grade));
        if (!isValidGrades) {
            return res.status(400).json({ error: "One or more grades are invalid" });
        }
        next();
    } catch (error) {
        console.log(err.message)
        res.status(401).json("Grade Validation failed") 
    }
}

export const feedbackResponseValidation = async(req, res, next) => {
    try {
        body('feedResponse').isArray().notEmpty();
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
    
        const feedRespArray = req.body.feedResponse;
        const numArray = [1,2,3,4,5];
        const isValidFeedback = feedRespArray.every(feedResp => numArray.includes(feedResp));
        if (!isValidFeedback) {
            return res.status(400).json({ error: "One or more feedback responses are invalid" });
        }
        next();
    } catch (error) {
        console.log(err.message)
        res.status(401).json("Feedback Response Validation failed")
    }
}

export const courseValidation = async(req, res, next) => {
    try {
        body('active').notEmpty();
        body('fid').notEmpty();
        body('cname').trim();
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    } catch (error) {
        console.log(err.message)
        res.status(401).json("Course Validation failed")
    
    }
}

export const messageTextValidation = async(req, res, next) => {
    try {
        body('text').escape();
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();

    } catch (error) {
        console.log(err.message)
        res.status(401).json("The text of the message may pose attacks")
    }
}

export const addUserValidation = async(req, res, next) => {
    try {
        body('bid').notEmpty();
        body('name').notEmpty().escape();
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    } catch (error) {
        console.log(err.message)
        res.status(401).json("Invalid User")
    }
}

export const addFormValidation = async(req, res, next) => {
    try {
        body('name').notEmpty().escape();
        body('q1').escape();
        body('q2').escape();
        body('q3').escape();
        body('q4').escape();
        body('q5').escape();
        body('q6').escape();
        body('q7').escape();
        body('q8').escape();
        body('q9').escape();
        body('q10').escape();
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    } catch (error) {
        
    }
}
