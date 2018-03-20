const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const AWS = require('aws-sdk');
const fs = require('fs'); //file processing


// load config before setting up AWS services
AWS.config.loadFromPath('config.json');
const recog = new AWS.Rekognition();
const s3 = new AWS.S3(); //amazon cloud storage service


const sqlite3 = require('sqlite3');
const db = new sqlite3.Database('stats.db');



// export modules we need
module.exports.AWS = AWS;
module.exports.recog = recog;
module.exports.fs = fs;
module.exports.db = db;

const recognitionController = require('./controllers/image-recognition-controller.js');

const port = 3000;

app.use(express.json()); //to support JSON-encoded bodies
app.use(express.static('./public')); // this sends clientside files


// starting server
app.listen(port, function() {
    console.log("Server listening on port " + port);
});


app.get('/test', function(request, response) {
    console.log("test executing");
    //recognitionController.test;
    recognitionController.test().then((category) => {
        response.send(category); //res holds garbage_type info
    })
    //response.end();
});


app.get('/testdb', function(request, response){
  console.log("database test executing");
  //recognitionController.test;
  var results = databaseController.updateDatabase(1, 20, 30, 40);
  response.json({"results": results});
});


// TODO what format will json be
// TODO error handling
app.post('/recognition', function(request, response) {

    var enc = new Buffer(request.body.base64, 'base64');
	//var enc = request.query.base64;
    recognitionController.recognition(enc).then((category) => {
        response.json({
            "category": category
        })
    })
});


//// Call S3 to list current buckets
//s3.listBuckets(function(err, data) {
//   if (err) {
//      console.log("Error", err);
//   } else {

//      console.log("Bucket List", data.Buckets);
//   }
//});
