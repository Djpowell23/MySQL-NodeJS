// Requirements
var mysql = require('mysql');
var inquirer = require('inquirer');

// Connect to mysql
var connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'Goober23.',
    database: 'bamazon'
});

// Once Server is connected, Main Code Goes Here
connection.connect(function(err){
    if (err) throw err;
    console.log('Connected to mysql database');
})

// Functions