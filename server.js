const express = require('express')
const path = require('path')
const exphbs = require('express-handlebars')
const fs = require("fs")

const budgetData = require('./budgetData.json')
console.log("==== DATA:", budgetData)
const app = express()
const port = process.env.PORT || 3000

app.engine('handlebars', exphbs.engine({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')
app.use(express.static('static'))
app.use(express.json())

function reassignExpenseKeys() {
    let newExpenses = {}
    let i = 1
    for (let key in budgetData.expenses) {
        newExpenses[i] = budgetData.expenses[key]
        i++
    }
    budgetData.expenses = newExpenses
}

// Generate new key for the new expense
function generateNewKey() {
    let i = 1;
    while (budgetData.expenses.hasOwnProperty(i)) {
        i++;
    }
    return i;
}



app.get('/', function (req, res, next) {
    console.log('GET request received at /');
    if (budgetData) {
        res.status(200).render('budgetPage', budgetData)
    }
    else {
        next()
    }
})

app.post('/budgetPage/totalBudget', function (req, res, next) {
    // get total budget and add to database
    console.log('POST request received at /totalBudget');
    console.log("== req.body: ", req.body)
    // Validate req.body
    if (req.body && req.body.totalBudget) {
        // Add new total budget to database
        budgetData.totalBudget = req.body.totalBudget
        // Update total remaining
        budgetData.totalRemaining = budgetData.totalBudget - budgetData.totalSpent
        // Write new database to file
        fs.writeFile("./budgetData.json", JSON.stringify(budgetData, null, 2), function (err) {
            if (err) {
                res.status(500).send("Error writing new total budget to database")
            } else {
                res.status(200).send("Success")
            }
        })
    }
    else {
        res.status(400).send("Request body needs totalBudget")
    }
})


// Use POST to add expense to database
app.post('/budgetPage/expense', function (req, res, next) {
    console.log('POST request received at /newExpense');
    console.log("== req.body: ", req.body)
    // Validate req.body
    if (req.body && req.body.expenseCategory && req.body.expenseAmount) {
        // Generate new key for the new expense
        const newKey = generateNewKey()
        budgetData.expenses[newKey] = {
            _id: newKey,
            expenseCategory: req.body.expenseCategory,
            expenseAmount: parseFloat(req.body.expenseAmount),
        }
        // Update total expenses
        budgetData.totalSpent += parseFloat(req.body.expenseAmount)
        // Update remaining budget
        budgetData.totalRemaining = budgetData.totalBudget - budgetData.totalSpent
        budgetData.totalRemaining = parseFloat(budgetData.totalRemaining.toFixed(2))
        console.log(budgetData)
        // Write new database to file
        fs.writeFile("./budgetData.json", JSON.stringify(budgetData, null, 2), function (err) {
            if (err) {
                res.status(500).send("Error writing new expense to database")
            } else {
                res.status(200).send("Success")
            }
        })
    }
    else {
        res.status(400).send("Request body needs expenseCategory and expenseAmount")
    }
})


app.delete('/budgetPage/expense/:id', function (req, res, next) {
    let expenseId = req.params.id;
    let expense = budgetData.expenses[expenseId];

    if (expense) {
        // Update totalSpent and totalRemaining
        budgetData.totalSpent -= expense.expenseAmount;
        budgetData.totalRemaining += expense.expenseAmount;

        // Delete the expense
        delete budgetData.expenses[expenseId];

        // Write the updated budgetData back to the file
        fs.writeFile("./budgetData.json", JSON.stringify(budgetData, null, 2), function (err) {
            if (err) {
                res.status(500).send("Error deleting expense from database")
            } else {
                res.status(200).send("Success")
            }
        })
    } else {
        res.status(400).send("Expense not found")
    }
})


app.get('/allExpenses', function (req, res, next) {
    console.log('GET request received at /allExpenses');
    if (budgetData) {
        console.log("==DATA:", budgetData)
        res.status(200).render("allExpenses", {
            budgetData: Object.keys(budgetData.expenses).map(key => ({
                _id: key,
                ...budgetData.expenses[key]
            })),
        })
    }
    else {
        next()
    }
})

app.get('/expenseData', function(req, res, next){
    if(budgetData){
        res.status(200).json(budgetData)
    }
    else {
        next()
    }
})

app.get("*", function (req, res, next) {
    console.log('GET request received at *');
    res.status(404).render('404')
})

app.listen(port, function () {
    console.log(`Server is listening on port ${port}`)
})
