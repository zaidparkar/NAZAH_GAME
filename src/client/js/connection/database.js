var express = require ('express');
var mysql = require('mysql');
var app = express();


var connection = mysql.createConnection({

     host: 'localhost' ,
     user: 'root' ,
     password: '',
     database: 'Db'

});

connection.connect(function(err){
    if (!!err) 
    {
        console.log('Error');
    }
      else 
      {
          console.log('Connected');
      }
});

app.get('/', function(req , resp){
    connection.query("SELECT * FROM nazah", function(error , rows, fields){
            if (!!error){
                console.log('Error in the query');
            }
              else 
               {
                   console.log('Success!');
               }
    });
})


app.listen(8080);
