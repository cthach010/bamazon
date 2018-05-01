var mysql = require('mysql');
var inquirer = require('inquirer');

var connection = mysql.createConnection({
    host: "localhost",
    port: 8889,
    user: "root",
    password: "root",
    database: "bamazon"
})

connection.connect(function(err) {
    if (err) throw err;
    displayProducts();
})

var displayProducts = function() {
  var run = 'SELECT * FROM Products'
  connection.query(run, function(err, res) {
      for (var i = 0; i < res.length; i++) {
          console.log("Item ID: " + res[i].item_id + " || Product Name: " + res[i].product_name + " || Department: " + res[i].department_name + " || Price: " + res[i].price + " || Stock Available: " + res[i].stock_quantity);
      }
      shoppingCart();
    })
};
var shoppingCart = function() {
    inquirer.prompt([{
        name: "ID",
        type: "input",
        message: "Enter the Product ID",
        validate: function(value) {
            if (isNaN(value) == false) {
                return true;
            } else {
                return false;
            }
        }
    }, {
        name: "COUNT",
        type: "input",
        message: "Enter Quantity",
        validate: function(value) {
            if (isNaN(value) == false) {
                return true;
            } else {
                return false;
            }
        }
    }]).then(function(answer) {

        var run = 'SELECT * FROM products WHERE item_id=' + answer.ID;
        connection.query(run, function(err, res) {
          if (answer.COUNT <= res) {
            for (var i = 0; i < res.length; i++) {
                console.log("We currently have " + res[i].stock_quantity + " " + res[i].product_name + ".");
                quantity = "" + res[i].stock_quantity + ""
                console.log("Success! Your order of "+ answer.COUNT + " " + res[i].product_name + " is now being processed.");
              }
              
            //  var run = 'UPDATE products SET stock_quantity = ' + answer.count + ' - ' + quantity + ' WHERE item_id = ' + res[i].product_name;
            //  connection.query(run, function(err, result) {
            //    if (err) throw err;
            //      if (err) throw err;
            //      console.log("DEBUG:" + result.affectedRows + " record(s) updated: " + answer.ID + "" + answer.count + " - " + quantity + "");
            //   });
            } else {
              console.log("Requested Quantity Unavailble.");
            }
            displayProducts();
        })
    })
};