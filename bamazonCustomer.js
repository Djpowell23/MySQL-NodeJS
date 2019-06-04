// Requirements
var mysql = require('mysql');
var inquirer = require('inquirer');

// Variables
var customerItem = '';
var customerQuantity = 0;

// Create Object for product table
var productList = {
    id: 'item_id',
    name: 'product_name',
    department: 'department_name',
    price: 'price',
    stock: 'stock_quantity'
};

// Connect to mysql
var connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'Goober23.',
    database: 'bamazon'
});

// Once Server is connected, Main Code Goes Here
connection.connect(function (err) {
    if (err) throw err;
    console.log('Connected to mysql database');
    
    purchase();
});




function purchase() {
    connection.query('SELECT * FROM products', function(err, res) {
        if (err) throw err;

        // Inquirer
        inquirer.prompt([
            {
                message: 'What item would you like to purchase?',
                name: 'whatItem',
                type: 'list',
                choices: function() {
                    var forSale = [];
                    for (var i = 0; i < res.length; i++) {
                        if (res[i].stock_quantity > 0) {
                            forSale.push(res[i].product_name);
                        };
                    };
                    return forSale;
                },
            },
            {
                message: 'How many units would you like to buy?',
                name: 'howMany',
                type: 'input'
            }
        ]).then(function(answer) {
            // Save product as a variable
            var customerItem;
            console.log('inquirer prompt finished correctly');
            for (var i = 0; i < res.length; i++) {
                if (res[i].product_name === answer.whatItem) {
                    customerItem = res[i];
                };
            };
            // console.log(customerItem);
        });
    });
}           