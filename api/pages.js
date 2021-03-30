/**pages.js
@author: Zac Mason
Last modified: 5/7/20
Implements an API for protecting access to html
pages
Adapted from code provided by Dr. Sigman and zybooks
*/

const jwt = require("jwt-simple");
const router = require("express").Router();
const path = require("path");
const config = require("../configuration/config");
const fs = require("fs");
const crypto = require("crypto");
const mysql = require("../db");

// For encoding/decoding JWT
var secret = config.secret;

// Authenticate user and retrieve page
router.get("/page", function(req, res) {
    
    // Check if the X-Auth header is set
    if (!req.headers["x-auth"]) {
        return res.status(401).json({error: "Missing X-Auth header"});
    }

    // X-Auth should contain the token 
    var token = req.headers["x-auth"];
    
    // Check if token is valid
    let decoded;
    try {
        decoded = jwt.decode(token, secret);
    }
    catch (ex) {
        res.status(401).json({ error: "Invalid JWT" });
    }
    
    let usr = decoded.uid;
    
    // Check if user is authenticated
    mysql.query("SELECT uid FROM user WHERE " +
               "uid = ?",
                [usr], function(err, rows) {
        if (err) {
            return res.status(500).json({error: "Server error."});
        }
        if (rows.length > 0) {
            // Find page
            mysql.query("SELECT * FROM page WHERE " +
                       "pageId = ?",
                       [req.query.pageid], function(err, rows) {
                if (err) {
                    return res.status(500).json({error: "Server error"});
                }
                
                // Check if pageId is valid
                if (rows.length > 0) {
                    let pagePath = path.resolve("pages/" + rows[0].pageName);
                    return res.status(200).sendFile(pagePath);
                }
                else {
                    return res.status("404").json({error: "Page not found"});
                }
            });
        }
        // Error if not authenticated
        else {
            res.status(401).json({error: "Not authenticated"});
        }
    });
});

module.exports = router;