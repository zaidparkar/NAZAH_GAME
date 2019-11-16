var mysql = require('mysql');
const express = require('express');
const bodyParser = require('body-parser');

var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: '',
  database: 'players'
});

const app = express();
app.use(bodyParser.urlencoded({extended:false}));

con.connect(function(err) {
 if (err) throw err;
 console.log("Connected!");
});

app.get('/', function(req,res) {
 res.sendFile('form.html',{root: __dirname })
});

app.post('/submit',function(req,res){
 var sql = "insert into users values('" + req.body.id + "','" + req.body.Username + "','" + req.body.Password +"')";
 con.query(sql,function(err){
   if (err) throw err;
   console.log(req.body);

 })
});

//This is the query for the ScoreBoard:
//var sql = "insert into ScoreBoard values('" + req.body.id + "','" + req.body.Kills + "','" + req.body.Deaths +"','" + req.body.Points +"')";

app.listen('3000',()=>{
 console.log("runnin on port 3000..")
});

  