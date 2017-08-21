// server.js
// where node app starts

// init project
var express = require('express');
var app = express();
var mongodb = require('mongodb');
var mongoClient = mongodb.MongoClient();
var ObjectId = mongodb.ObjectId;
var mongoURL = 'mongodb://maxi7587:urlshortenerdb@ds149433.mlab.com:49433/urlshortenerdb';
var http = require('http');
var url = require('url');

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function (request, response) {
  response.sendFile(__dirname + '/views/index.html');
});

app.get("/:data", function (request, response) {
  var data = request.params.data;
  var id = ObjectId(data);
  var db = mongoClient.connect(mongoURL, function (err, db) {
    var collection = db.collection('urls');
    var shortURL = 
    collection.findOne({_id: id}, {_id: 0, short_url: 0},function (err, document) {
      var URL = document.original_url;
      response.writeHead(301,{Location: URL});
      response.end();
      db.close();
    });
  });
});

app.get("/new/http(s)?://:data", function (request, response) {
  var data = url.parse(request.url).pathname.slice(5);
  mongoClient.connect(mongoURL, function(err, db) {
    var collection = db.collection('urls');
    var id = ObjectId();
    var insertData = {_id: id, original_url: data, short_url: 'https://url-shortener-app.glitch.me/' + id};
    collection.insert(insertData, function () {
      collection.findOne({_id: id}, {_id: 0}, function (err, document) {
        response.send(document);
        db.close();
      });
    });
  });
});

app.get("/new/:data", function (request, response) {
  response.send('Error: INVALID URL. Plase insert a valid URL. Use the right format and don´t forget to start with "http://" or "https://"')
});

// listen for requests :)
var listener = app.listen(process.env.PORT, function () {
  console.log('App is listening on port ' + listener.address().port);
});
  
