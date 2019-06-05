// Requirements
var mysql = require('mysql');
var inquirer = require('inquirer');

// Variables
var customerItem = '';
var customerQuantity = 0;

// Create Object for product table
// Might not need this code
// var productList = {
//     id: 'item_id',
//     name: 'product_name',
//     department: 'department_name',
//     price: 'price',
//     stock: 'stock_quantity'
// };

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
    shop();
    // purchase();
});


function shop() {
    inquirer.prompt([
        {
            name: 'userType',
            message: 'What would you like to do today?',
            type: 'list',
            choices: ['Go Shopping','Leave Shop']
        }
    ]).then(function(shopping) {
        if (shopping.userType === 'Go Shopping') {
            // // Display all products to the console
            connection.query('SELECT * FROM products', function(err, res) {
                if (err) throw err;

                for (var i = 0; i < res.length; i++) {
                    if (res[i].stock_quantity > 0) {
                        // console.log(`${res[i].item_id} | ${res[i].product_name} | ${res[i].department_name} | ${res[i].price} | ${res[i].stock_quantity}`);       // Add all columns
                        console.log(res[i].item_id + '. ' + res[i].product_name, res[i].department_name, '$' + res[i].price, res[i].stock_quantity);
                    }
                }
            });
            purchase();
        } else {
            console.log('Have a nice day!');
            connection.end();
        }
    });
}


function purchase() {
    connection.query('SELECT * FROM products', function (err, res) {
        if (err) throw err;

        // Inquirer
        inquirer.prompt([
            {
                message: 'Enter Item ID of item you would like to purchase:',
                name: 'whatItem',
                type: 'input'
            },
            {
                message: 'How many units would you like to buy?',
                name: 'howMany',
                type: 'input'
            }
        ]).then(function (answer) {
            // Save product as a variable
            var customerItem;
            // console.log(res);
            // console.log(parseInt(answer.whatItem));
            for (var i = 0; i < res.length; i++) {
                if (res[i].item_id === parseInt(answer.whatItem)) {
                    customerItem = res[i];
                };
            };

            // Most code goes here
            // Logic to determine if there are enough items in stock
            if (customerItem.stock_quantity >= parseInt(answer.howMany)) {
                // Determine new quantity of items in stock
                var newQuantity = customerItem.stock_quantity -= parseInt(answer.howMany);

                // Calculate Order Total
                var orderTotal = customerItem.price * parseInt(answer.howMany);

                // Update Databases with new inventory
                connection.query('UPDATE products SET ? WHERE ?', [{ stock_quantity: newQuantity }, { item_id: customerItem.item_id }], function (err) {
                    if (err) throw err;

                    // Order Success/Display Total
                    console.log('--------------------------');
                    console.log('Order successfully placed!');
                    console.log(`Total: $${orderTotal.toFixed(2)}`);
                    console.log('--------------------------');
                    shop();
                });
            } else {
                console.log('--------------------------');
                console.log(`Sorry, we don't have enough of that to fill your order.`);
                console.log('--------------------------');
                shop();
            }
        });
    });
}           