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

app.post('/update',function(req,res){
  var kill = "UPDATE ScoreBoard SET req.body.Kills=Kills + 1 where req.body.id = id";
  con.query(kill,function(err){
    if (err) throw err;
    console.log(req.body);
  })
})


const UpdateKill=(id)=>{
con.query('UPDATE ScoreBoard SET Kills=Kills+1 where id = '+'"'+id+'"',function(err){
  if (err) throw err;
  });
}

const getKills = (id)=>{
  return new Promise((resolve, reject) => { 
    con.query('SELECT Kills from ScoreBoard where id='+'"'+id+'"',(err,res)=>{
    if (err)
      reject(err);

    resolve(res[0].Kills);  
    
  });
});
};

const UpdateDeaths = (id) =>{
  con.query('UPDATE ScoreBoard SET Deaths=Deaths + 1 where id = '+'"'+id+'"',function(err){
    if (err) throw err;
    });
}


 const getDeaths = (id)=>{
   con.query('SELECT Deaths from ScoreBoard where id='+'"'+id+'"',function(err,res){
    if (err) throw err;
    return res;
  });
  return new Promise((resolve, reject) => { 
    con.query('SELECT Deaths from ScoreBoard where id='+'"'+id+'"',(err,res)=>{
    if (err)
      reject(err);

    resolve(res[0].Deaths);  
    
  });
});
};

const UpdateScore = (Score,id) =>{
  con.query('UPDATE ScoreBoard SET Points = '+Score+' where id='+'"'+id+'"' ,function(err){
    if (err) throw err;
    });
  }


 const getScore = (id)=>{
    return new Promise((resolve, reject) => { con.query('SELECT Points from ScoreBoard where id="'+id +'"',(err,res)=>{
      if (err)
        reject(err);

      resolve(res[0].Points);  
      
    });
  });
};

const getUsername = (id)=>{
  return new Promise((resolve, reject) => { con.query('SELECT "'+id+ '" from users',(err,res)=>{
    if (err)
      reject(err);

    resolve(res);  
    
  });
});
};

  getScore("aditya").then((res) => {
    console.log(res);
  });

  getDeaths("aditya").then((res) =>{
    console.log(res);
  });

  getKills("aditya").then((res) =>{
    console.log(res);
  });
 
  getUsername("adt6").then((res) =>{
    console.log(res);
  });


app.listen('3000',()=>{
 console.log("runnin on port 3000..")
});



  