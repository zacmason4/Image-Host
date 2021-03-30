/**users.js
@author: Zac Mason
Last modified: 5/7/20
Implements an API for creating a user and logging
into an account
Adapted from code provided by Dr. Sigman and zybooks
*/

const jwt = require("jwt-simple");
const router = require("express").Router();
const bcrypt = require("bcrypt-nodejs");
const config = require("../configuration/config");
const bodyParser = require("body-parser");
const fs = require("fs");
const crypto = require("crypto");
const mysql = require("../db");

router.use(bodyParser.urlencoded({ extended: true }));

// For encoding/decoding JWT
var secret = config.secret;

// Add a new user to the database
router.post("/user", function(req, res, next) {
    
    // Check for duplicate user
    mysql.query("SELECT uid FROM user WHERE " +
                "uid = ?",
                [req.body.uidCreate], function(err, rows) {
        if(err) throw err;
        
        // Username already in database
        if (rows.length > 0) {
            res.status(401).json({ error: "Username already in use."});
        }
        else {
           // Create a hash for the submitted password
            bcrypt.hash(req.body.passwordCreate, null, null, function(err, hash) {

                var newuser = {
                    "uid": req.body.uidCreate,
                    "password": hash,
                    "full_name": req.body.full_nameCreate,
                    "date_created": new Date().toISOString().split("T")[0],
                    "admin": false
                }
                // Create user directory
                let usrDir = crypto.createHash("sha256").update(newuser.uid).digest("hex");

                let newDir = "images/" + usrDir;

                fs.mkdir(newDir, (err) => {
                    if (err) {
                      return res.status(400).json({error: "Directory for " + newuser.uid + " not created"});
                    }

                    // Create thumbnail subdirectory
                    let subDir = newDir + "/thumbs";

                    fs.mkdir(subDir, (err) => {
                        if(err) {
                       return res.status(400).json({error: "thumbs subdirectory not created"});
                        }

                        // Save newuser
                        mysql.query("INSERT INTO user SET ?", newuser, function(err) {
                            if (err) return next(err);
                            // res.sendStatus(201);  // Created
                            console.log("New user saved.");
                            res.redirect("/index.html");
                        });
                    });
                });
            });
        };
    });
//    mysql.end();
});

// Sends a token when given valid username/password
router.post("/auth", function(req, res) {

    // Get user from the database
    mysql.query("SELECT uid, password FROM user WHERE " +
                "uid = ?",
                [req.body.uid], function(err, rows) {
        if (err) throw err;
        // Username not in in database
        if (rows.length == 0) {
            console.log("Invalid login");
            res.status(401).json({ error: "Invalid login."});
        }
        else {
            // Does given password hash match the database password hash?
            bcrypt.compare(req.body.password, rows[0].password, 
            function(err, valid) {
                if (err) {
                    console.log("Error");
                    res.status(400).json({ error: err});
                }
                else if (valid) {
                    // Send back a token that contains the user's username
                    var token = jwt.encode({ uid: rows[0].uid }, secret);
                    return res.json({ token: token });
                }
                else {
                    console.log("Invalid login.");
                    res.status(401).json({ error: "Invalid login."});
                }
            });
        };
    });
//    mysql.end();
});

module.exports = router;