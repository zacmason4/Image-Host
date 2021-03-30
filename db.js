/**db.js
@author: Zac Mason
Last modified: 5/7/20
Set mysql connection
Adapted from code provided by Dr. Sigman and zybooks
*/

var mysql = require("mysql");

var conn = mysql.createConnection({
    host:     "ec2-18-217-134-54.us-east-2.compute.amazonaws.com",
    user:     "zac",
    password: "F?4QSY7nVZ__8ybt",
    database: "imageDB-zac"
});

conn.connect(function(err) {
    if (err) {
        console.log("Error connecting to MySQL:", err);
    }
    else {
        console.log("Connection established");
    }
});

module.exports = conn;