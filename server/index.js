
var mysql      = require('mysql');
var connection = mysql.createConnection({
  host     : 'mysql.mywikis.com',
  username : 'elephantweb',
  password : '1999twothousand',
  database : 'elephant_testing',
});



connection.connect(function(err){
if(!err)
    console.log("Database is connected ... nn");
 else
    console.log("Error connecting database ... nn");
});


  connection.query('SELECT * FROM users', function(err, rows, fields) {
  if (!err)
    console.log('The solution is: ', rows);
  //  console.log('Error while performing Query.',err);
  });

connection.end();
