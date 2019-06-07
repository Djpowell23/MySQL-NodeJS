// List a set of menu options:
// View Products for Sale               // done

// View Low Inventory                   // done

// Add to Inventory                    

// Add New Product

// If a manager selects View Products for Sale, the app should list every available item: the item IDs, names, prices, and quantities.
// If a manager selects View Low Inventory, then it should list all items with an inventory count lower than five.
// If a manager selects Add to Inventory, your app should display a prompt that will let the manager "add more" of any item currently 
//     in the store.
// If a manager selects Add New Product, it should allow the manager to add a completely new product to the store.

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