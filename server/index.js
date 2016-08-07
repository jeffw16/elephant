var express   =    require("express");
var mysql     =    require('mysql');
var app       =    express();

var pool      =    mysql.createPool({
    connectionLimit : 100, //important
    host     : 'w.chompfish.xyz',
    user     : 'myuser',
    password : 'mypass',
    database : 'elephant_testing',
    debug    :  false
});

function sendQuery(data) {

    data = "SELECT Username FROM Users";

    pool.getConnection(function(err,connection){
        if (err) {
          console.log('Cannot connect');
          return;
        }

        console.log('connected as id ' + connection.threadId);

        connection.query(data, function(err,rows){
            connection.release();
            if(!err) {
              console.log(rows);
              return rows;
            }
        });
  });
}

sendQuery();


// DONT BOTHER WITH THIS YET
// connection.on('error', function(err) {
//       console.log("Error");
//       return;
// });
