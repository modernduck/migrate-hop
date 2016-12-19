
var express = require('express');
var path = require('path');

var bodyParser = require('body-parser');
var mailer = require("./mailer.js")
var app = express();


// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.all('/', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With, Content-Type");
  
  //res.header("Access-Control-Allow-Headers",  "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers");
  next();
 });


app.get('/', function (req, res) {
  res.send('Hello World!')
})

app.post('/', function(req, res){
    mailer.sendMailByTemplate(req.body.data, "templates/" + req.body.template, (error, info)=> {
        console.log('response post')
        console.log(info)
        console.log("error")
        console.log(error)
        res.json(req.body);
    })
    
})

app.listen(7878, function () {
  console.log('Example app listening on port 7878!')
})