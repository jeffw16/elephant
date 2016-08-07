
var mysql      = require('mysql');
var connection = mysql.createConnection({
  host :     'w.chompfish.xyz',
  user :     'myuser',
  password : 'mypass',
  database : 'elephant_testing',
});



connection.connect(function(err){
if(!err)
    console.log("Database is connected ... nn");
 else
    console.log("Error connecting database ... nn");
});


  connection.query('SELECT * FROM Users', function(err, rows, fields) {
  if (!err){
    console.log('The solution is: ', rows);
  }
  else {
    console.log('ERROR');
  }
  });

connection.end();
