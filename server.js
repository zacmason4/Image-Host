/**server.js
@author: Zac Mason
Last modified: 5/7/20
Main server file for routing information
Adapted from code provided by Dr. Sigman and zybooks
*/

const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;

app.use(express.static('public'));
app.use(express.static('images'));
app.use(express.static('js'));
app.use(express.static('css'));

var router = express.Router();
router.use(bodyParser.urlencoded({ extended: true }));
router.use("/api", require("./api/images"), require("./api/users"), require("./api/pages"), require("./api/exhibits"));
app.use(router);

app.listen(PORT, () => {
    console.log('Listening at ' + PORT );
});