const express = require('express');
const app = express();
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const connectToDatabase = require('../models/db');
const router = express.Router();
const dotenv = require('dotenv');
const pino = require('pino');  // Import Pino logger
const { Collection } = require('mongoose');

const logger = pino();

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;

router.post('/register', async (req, res) => {
    try {
        // Task 1: Connect to `giftsdb` in MongoDB through `connectToDatabase` in `db.js`
        const db = await connectToDatabase();

        // Task 2: Access MongoDB collection
        const collection = db.collection("users");

        //Task 3: Check for existing email
        const existingEmail = await collection.findOne({email: req.body.email});
        if(existingEmail){
            logger.error("Email id already exists");
            return res.status(400).json({error: "Email id already exists"});
        }

        const salt = await bcryptjs.genSalt(10);
        const hash = await bcryptjs.hash(req.body.password, salt);
        const email = req.body.email;

        const newUser = await collection.insertOne({
            email: req.body.email,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            password: hash,
            createdAt: new Data(),
        });
        
         // {{insert code here}} //Task 5: Create JWT authentication with user._id as payload
        const payload = {
            user:  {
                id: newUser.insertId,
            },
        };
        const authToken = jwt.sign(Payload, JWT_SECRET);

        logger.info('User registered successfully');
        res.json({authtoken,email});
    } catch (e) {
         return res.status(500).send('Internal server error');
    }
});

module.exports = router;