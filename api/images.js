/**images.js
@author: Zac Mason
Last modified: 5/7/20
Implements an API for uploading and displaying images
Adapted from code provided by Dr. Sigman and zybooks
*/

const router = require("express").Router();
const multer = require('multer');
const path = require('path');
const jwt = require("jwt-simple");
const config = require("../configuration/config");
const fs = require("fs");
const crypto = require("crypto");
const mthumb = require("media-thumbnail");
const mysql = require("../db");

// For encoding/decoding JWT
var secret = config.secret;

// SET STORAGE
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'upload')
  },
  filename: function (req, file, cb) {
    cb(null,  file.fieldname + '-' + Date.now() + path.extname(file.originalname))
  }
})

// set upload object to store pictures to correct location
var upload = multer({ storage: storage })

// get images in database
router.get('/images', (req,res) =>{
    
    // get user token from query string
    let token = req.query.u;
    
    // validate user
    let decoded;
    try {
        decoded = jwt.decode(token, secret);
    }
    catch (ex) {
        return res.status(401).json({ error: "Invalid JWT"});
    }
    
    let usr = decoded.uid;
    
    mysql.query("SELECT uid, userId FROM user WHERE " +
               "uid = ?",
               [usr], function(err, rows) {
        if (err) {
            return res.status(500).json({error: "Server error."});
        }
        if (rows.length > 0) {
            // Find user's images
            mysql.query("SELECT * FROM image WHERE " +
                       "owner = ?",
                       [rows[0].userId], function(err, imgRows) {
                if (err) {
                    res.status(500).json({error: "Server error."});
                }
                else {
                    res.status(201).json(imgRows);
                }
            });
        }
        else{
            res.status(404).json({error: "User not found."});
        }
    });
});

// add image to database
router.post('/images', upload.single('photo'), (req, res) => {
    // log the file upload to console
    if(req.file) {
        //res.json(req.file);
        console.log("File: " + req.body.photoName + " saved.");
    }
    else {
        return res.status(507).json({error: "Could not save image."});
    }
    
    // Check if the X-Auth header is set
    if (!req.headers["x-auth"]) {
      return res.status(401).json({error: "Missing X-Auth header"});
    }
    
    // X-Auth should contain the token 
    let token = req.headers["x-auth"];

    // decode token and get uid
    let decoded;
    
    try {
        decoded = jwt.decode(token, secret);
    }
    catch (ex) {
        res.status(401).json({ error: "Invalid JWT" });
    }
    
    // verify user is in database
    let usr = decoded.uid;
    mysql.query("SELECT uid, userId FROM user WHERE " +
               "uid = ?",
               [usr], function(err, rows) {
        if (err) {
            return res.status(400).json({error: "Invalid JWT"});
        }
        
        // generate user subdirectory location
        let userSubdir = crypto.createHash("sha256").update(rows[0].uid).digest("hex");
        
        // copy file from uploads to user path
        let from = "upload/" + req.file.filename;
        let to = "images/" + userSubdir + "/" + req.file.filename;
        fs.copyFile(from, to, (err) => {
            if (err) {
                return res.status(507).json({error: "Image upload failed", errMsg: err});
            }
        });
        
        // make a thumbnail of the image
        let thumb = "images/" + userSubdir + "/thumbs/" + req.file.filename;

        mthumb.forImage(
            to,
            thumb,
            {
                width: 125
            })
            .then(() => console.log("Thumbnail made"), err => console.error(err));
        
        // delete file from upload folder
        fs.unlink(from, (err) => {
            if (err) {
                console.log("File " + from + " was not deleted.");
            }
            console.log("File " + from + " was deleted.");
        });
    
        // save image data as a json
        var img = {
            filename: req.file.filename,
            photo_name: req.body.photoName,
            path: userSubdir,
            owner: rows[0].userId,
            album: req.body.album,
            description: req.body.desc,
            upload_date: new Date(),
            f_stop: req.body.fstop,
            s_speed: req.body.sspeed,
            iso: req.body.iso,
            focal_length: req.body.flength,
            camera_type: req.body.camera
        };

        // save the image to the database
        mysql.query("INSERT INTO image SET ?",
                   img, function(err, img) {
            if (err) {
                console.log("error");
                res.status(400).send(err);
            } else {
                console.log("New image added to database.");
                res.status(201).json(img);
            }
        });
    });
});

module.exports = router;