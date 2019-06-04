// Requirements
var mysql = require('mysql');
var inquirer = require('inquirer');

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
    displayTable();
});

// Functions

// Display All Items that are for sale
function displayTable() {

    connection.query('SELECT * FROM products', function (err, res) {
        if (err) throw err;

        // // Naming each item
        // for (var k = 0; k < item.length; k++) {
        //     console.log(item[i]);
        // }

        // Define variables
        var tvData = res[0];
        var vacuumData = res[1];
        var chairData = res[2];
        var legoData = res[3];
        var blouseData = res[4];
        var trampData = res[5];
        var razorData = res[6];
        var bedData = res[7];
        var oilData = res[8];
        var printerData = res[9];

        // Push item list into array
        var forSale = [];

        // Take In-Stock Items and push them to the forSale array
        for (var j = 0; j < res.length; j++) {
            if (res[j].stock_quantity > 0) {
                forSale.push(res[j]);
            }
        }

        // Display every item that is still in stock
        for (var i = 0; i < res.length; i++) {
            console.log(res[i].item_id, res[i].product_name, res[i].department_name, res[i].price, res[i].stock_quantity);
        }
    });
}

// function inquirerPrompt() {
//     // Inquirer
//     inquirer.prompt(
//         {
//             name: 'whatItem',
//             type: 'list',
//             message: 'What Item would you like to buy?'
//         }
//     ).then(response, function (err) {
//         if (err) throw err;
//     });
// }