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

connection.connect(function (err) {
    if (err) throw err;

    manage();
});

function manage() {
    inquirer.prompt([
        {
            type: 'list',
            name: 'managerChoice',
            choices: ['View Products for Sale', 'View Low Inventory', 'Add New Inventory', 'Add New Product', 'Leave Shop']
        }
    ]).then(function (answer) {
        switch (answer.managerChoice) {
            case ('View Products for Sale'):
                viewProduct();
                break;
            case ('View Low Inventory'):
                viewLowInv();
                break;

            case ('Add New Inventory'):
                addInventory();
                break;
            case ('Add New Product'):
                addProduct();
                break;
            case ('Leave Shop'):
                console.log('Have a nice day, sir!');
                connection.end();
                break;


        }
    });
}

// Display all information about current products
function viewProduct() {
    connection.query('SELECT * FROM products', function (err, res) {
        if (err) throw err;
        console.table(res, ['item_id', 'product_name', 'department_name', 'price', 'stock_quantity']);
        manage();
    });
}

// Display Contents that are running low on inventory
function viewLowInv() {
    connection.query('SELECT * FROM products WHERE stock_quantity < 25', function (err, res) {
        console.table(res, ['item_id', 'product_name', 'department_name', 'price', 'stock_quantity']);

        // If no items are populated:
        if (res[0].item_id === undefined) {
            console.log('No products are low inventory status.');
        }

        // Back to Menu after displaying low-quantity items
        manage();
    });

}

function addInventory() {
    connection.query('SELECT * FROM products', function (err, res) {
        if (err) throw err;
        // console.log(res);
        inquirer.prompt([
            {
                name: 'chosenItem',
                type: 'list',
                choices: function () {
                    var productList = [];
                    for (var i = 0; i < res.length; i++) {
                        productList.push(res[i].product_name);
                    }
                    return productList;
                }
            }, {
                name: 'addAmount',
                type: 'input',
                message: 'How many are you adding to inventory?'
            }
        ]).then(function (answer) {
            var chosenItem;
            var currentStock;
            for (var i = 0; i < res.length; i++) {
                if (answer.chosenItem === res[i].product_name) {
                    chosenItem = res[i];
                    currentStock = parseInt(res[i].stock_quantity);
                }
            }
            // console.log('chosenItem:', chosenItem);
            
            connection.query('UPDATE products SET ? WHERE ?', [{stock_quantity: parseInt(currentStock) + parseInt(answer.addAmount)}, {product_name: chosenItem.product_name}], function(err, result) {
                if (err) throw err;
                console.log('--------------------------------------------------------');
                console.log(`Added ${answer.addAmount} units of ${answer.chosenItem}`);
                console.log(`${answer.chosenItem} Inventory: ${parseInt(currentStock) + parseInt(answer.addAmount)}`);
                console.log('--------------------------------------------------------');
                manage();
            });
        });
    });
}

function addProduct() {
    inquirer.prompt([
        {
            name: 'productName',
            type: 'input',
            message: 'What is the product_name?'
        },
        {
            name: 'departmentName',
            type: 'input',
            message: 'What department does it belong to?'
        },
        {
            name: 'price',
            type: 'input',
            message: 'How much for the price of one unit?'
        },
        {
            name: 'stockQuantity',
            type: 'input',
            message: 'How many units are you adding to inventory?'
        }
    ]).then(function (answer) {
        connection.query(`INSERT INTO products (product_name, department_name, price, stock_quantity) VALUES ('${answer.productName}', '${answer.departmentName}', '${answer.price}', '${answer.stockQuantity}')`,
            function (err) {
                if (err) throw err;

                console.log('===============================');
                console.log(`Added ${answer.productName} to inventory!`);
                console.log('===============================');
                viewProduct();
                manage();
            });
    });

}

// [{ stock_quantity: currentStock + parseInt(answer.addQuantity) }, 