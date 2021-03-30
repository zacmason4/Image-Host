/**exhibits.js
@author: Zac Mason
Last modified: 5/10/20
Implements an API for creating an exhibit, inviting
users, and adding images to the exhibit.
Adapted from code provided by Dr. Sigman and zybooks
*/

const router = require("express").Router();
const jwt = require("jwt-simple");
const config = require("../configuration/config");
const bodyParser = require("body-parser");
const mysql = require("../db");

// For encoding/decoding JWT
var secret = config.secret;


// Create a new exhibit
router.post("/exhibits", function(req, res) {
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
        
        // save exhibit data as a json
        var ex = {
            curator: rows[0].userId,
            description: req.body.desc,
            start_date: req.body.start,
            end_date: req.body.end
        };
        
        // store exhibit info in the database
        mysql.query("INSERT INTO exhibit SET ?",
                   ex, function(err, result) {
            if (err) {
                res.status(400).send(err);
            } else {
                console.log("New exhibit added to database.");
                
                var exInfo = {
                    exhibit_exhibitId: result.insertId,
                    User_userId: rows[0].userId
                };
                
                // store data in linked table
                mysql.query("INSERT INTO exhibit_has_artists SET ?", exInfo, function(err, result) {
                    if (err) {
                        res.status(400).send(err);
                    } else {
                        console.log("Exhibit info added to database.");
                        res.status(201).json(ex);
                    }
                });
            }
        });
    });
});

// Get all exhibits for a user in database
router.get("/exhibits", function(req, res) {
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
    
    // verify user is in database
    mysql.query("SELECT uid, userId FROM user WHERE " +
               "uid = ?",
               [usr], function(err, rows) {
        if (err) {
            return res.status(500).json({error: "Server error."});
        }
        if (rows.length > 0) {
            // Determine if user belongs to any exhbits
            mysql.query("SELECT * FROM exhibit_has_artists WHERE " +
               "User_userId = ?",
               [rows[0].userId], function(err, usrRows) {
                if (err) {
                    res.status(500).json({error: "Server error."});
                }
                // Find exhibits where user is an artist
                if (usrRows.length > 0) {
                    
                    // list to store all exhibits
                    var final = []
                    
                    // check each exhibit
                    usrRows.forEach(function(row) {

                        // get all exhibits user belongs to
                        mysql.query("SELECT * FROM exhibit WHERE " +
                                   "exhibitId = ?",
                                   [row.exhibit_exhibitId], function (err, exRows) {
                            if (err) {
                                res.status(500).json({error: "Server error."});
                            }
                            // store row to be returned
                            if (exRows.length > 0) {           
                                final.push(exRows);
                            }
                            // return after getting all exhibits
                            if (final.length == usrRows.length) {
                                res.status(201).json(final);
                            }
                        });
                    });
                }
                else{
                    res.status(404).json({error: "Exhibit not found."});
                }
            });
        }
        else{
            res.status(404).json({error: "User not found."});
        }
    });
});

// Add an artist to an exhibit
router.post("/artists", function(req, res) {
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
    
    // Check if the X-Id header is set
    if (!req.headers["x-id"]) {
        return res.status(401).json({error: "Missing X-Id header"});
    }
    
    //X-Id should contain the exhibitId
    let exId = req.headers["x-id"];
    
    // verify user is in database
    let usr = decoded.uid;
    mysql.query("SELECT uid, userId FROM user WHERE " +
               "uid = ?",
               [usr], function(err, rows) {
        if (err) {
            return res.status(400).json({error: "Invalid JWT"});
        } if (rows.length > 0) {
            // verify artist is in database
            mysql.query("SELECT userId FROM user WHERE " +
                       "uid = ?",
                       [req.body.artist], function(err, artRows) {
                if (err) {
                    return res.status(404).json({error: "User not found."})
                } if (artRows.length > 0) {
                    // verify exhibit is in database
                    mysql.query("SELECT exhibitId FROM exhibit WHERE " +
                                "exhibitId = ?",
                                [exId], function(err, exRows) {
                        if (err) {
                            return res.status(404).json({error: "Exhibit not found."})
                        } if (exRows.length > 0) {
                            // verify artist is not in exhibit
                            mysql.query("SELECT User_userId FROM exhibit_has_artists WHERE " +
                                       "exhibit_exhibitId = ?" +
                                        "AND User_userId = ?",
                                       [exId, artRows[0].userId], function(err, idRows) {
                                if(err) throw err;
                                
                                // artist already in exhibit
                                if (idRows.length > 0) {
                                    res.status(401).json({ error: "Artist already in exhibit." });
                                }
                                else {
                                    // save artist info as json
                                    var artEx = {
                                        exhibit_exhibitId: exId,
                                        User_userId: artRows[0].userId
                                    };

                                    // store artist info in the database
                                    mysql.query("INSERT INTO exhibit_has_artists SET ?",
                                                artEx, function(err, result) {
                                        if (err) {
                                            res.status(400).send(err);
                                        } else {
                                            console.log("New artist added to exhibit.");
                                            res.status(201).json(artEx)
                                        }
                                    });
                                }
                            });
                        }
                    });
                }
                else{
                    res.status(404).json({error: "Exhibit not found."});
                }
            });
        }
        else{
            res.status(404).json({error: "User not found."});
        }
    });
});

// Add an image to an exhibit
router.post("/eximages", function(req, res) {
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
    
    // Check if the X-Id header is set
    if (!req.headers["x-id"]) {
        return res.status(401).json({error: "Missing X-Id header"});
    }
    
    //X-Id should contain the exhibitId
    let exId = req.headers["x-id"];
    
    // verify user is in database
    let usr = decoded.uid;
    mysql.query("SELECT uid, userId FROM user WHERE " +
               "uid = ?",
               [usr], function(err, rows) {
        if (err) {
            return res.status(400).json({error: "Invalid JWT"});
        } if (rows.length > 0) {
            // verify image is in database
            mysql.query("SELECT idImage FROM image WHERE " +
                       "photo_name = ? AND owner = ?",
                       [req.body.imgname, rows[0].userId], function(err, imgRows) {
                if (err) {
                    return res.status(404).json({error: "Image not found."})
                } if (imgRows.length > 0) {
                    // verify exhibit is in database
                    mysql.query("SELECT exhibitId FROM exhibit WHERE " +
                                "exhibitId = ?",
                                [exId], function(err, exRows) {
                        if (err) {
                            return res.status(404).json({error: "Exhibit not found."})
                        } if (exRows.length > 0) {
                            // save image info as json
                            var imgEx = {
                                exhibit_exhibitId: exId,
                                image_idImage: imgRows[0].idImage
                            };

                            // store image info in the database
                            mysql.query("INSERT INTO exhibit_has_image SET ?",
                                        imgEx, function(err, result) {
                                if (err) {
                                    res.status(400).send(err);
                                } else {
                                    console.log("New image added to exhibit.");
                                    res.status(201).json(imgEx)
                                }
                            });
                        }
                    });
                }
                else{
                    res.status(404).json({error: "Exhibit not found."});
                }
            });
        }
        else{
            res.status(404).json({error: "User not found."});
        }
    });
});

router.get("/eximages", function(req, res) {
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
    
    // get exhibitId from query string
    let exId = req.query.id;
    
    // verify user is in database
    mysql.query("SELECT uid, userId FROM user WHERE " +
               "uid = ?",
               [usr], function(err, rows) {
        if (err) {
            return res.status(500).json({error: "Server error."});
        }
        if (rows.length > 0) {
            // find exhibit's images
            mysql.query("SELECT image_idImage FROM exhibit_has_image WHERE " +
                       "exhibit_exhibitId = ?",
                       [exId], function(err, exRows) {
                if (err) {
                    res.status(500).json({error: "Server error."});
                }
                if (exRows.length > 0) {
                    
                    // list to store all images
                    var final = []
                    
                    // check each image
                    exRows.forEach(function(row) {

                        // get all images in exhibit
                        mysql.query("SELECT * FROM image WHERE " +
                               "idImage = ?",
                                   [row.image_idImage], function (err, imgRows) {
                            if (err) {
                                res.status(500).json({error: "Server error."});
                            }
                            // store row to be returned
                            if (imgRows.length > 0) {           
                                final.push(imgRows);
                            }
                            // return after getting all exhibits
                            if (final.length == exRows.length) {
                                res.status(201).json(final);
                            }
                        });
                    });
                }
                else {
                    res.status(404).json({error: "Image not found."});
                }
            });
        }
        else{
            res.status(404).json({error: "User not found."});
        }
    });
});

module.exports = router;