let categoryDropdown = document.getElementById('category-dropdown');
let modalBackDrop = document.getElementById("modal-backdrop")
let addExp = document.getElementById("add-expense-modal")
let setBug = document.getElementById("setting-budget")
let addButton = document.getElementById("add-expense-button")
let setBudgetButton = document.getElementById("set-budget")
let totalBudgetButton = document.getElementById('modal-accept-budget')
let modalAddExpenseButton = document.getElementById("modal-accept")
let xButton = document.getElementById("modal-close")
// let modalCancel = document.getElementById("modal-cancel")
let priceInput = document.getElementById("post-price-input")
let budgetInput = document.getElementById("post-budget-input")
let xButtonb = document.getElementById("modal-closeb")
let legendContainer = document.querySelector('.legend')
const categories = ['Food', 'Clothing', 'Entertainment', 'Bills', 'Other', 'Remaining']
let pieChart = document.querySelector('.piechart')
let expenseLinkClick = document.getElementsByClassName("color")
let expenseCard = document.getElementById("expense-card")
let deleteExpenseInList = document.getElementsByClassName("delete-expense")
let totalRemainingElement = document.querySelector('.total-remaining');


function getCategory() {
    let selectedOption = categoryDropdown.selectedOptions[0]
    let selectedText = selectedOption.text
    return selectedText
}


async function handleAddExpenseModalClick() {
    let expenseAmount = parseFloat(document.getElementById('post-price-input').value);
    let expenseCategory = categoryDropdown.selectedOptions[0].text;

    if (expenseCategory === "Select A Category" || isNaN(expenseAmount)) {
        alert('Please fill in all fields');
    } else {
        let jsonData = await getJSONData();
        let totalSpent = parseFloat(jsonData.totalSpent)
        let totalRemaining = parseFloat(jsonData.totalRemaining);

        if (expenseAmount > totalRemaining) {
            alert('You cannot spend over your budget');
            return;
        }

        // Fix the expenseAmount and totalRemaining to 2 decimal places as they represent money
        expenseAmount = parseFloat(expenseAmount.toFixed(2));
        totalSpent += expenseAmount;
        totalRemaining -= expenseAmount;
        totalRemaining = parseFloat(totalRemaining.toFixed(2));

        fetch('/budgetPage/expense', {
            method: 'POST',
            body: JSON.stringify({
                expenseCategory: expenseCategory,
                expenseAmount: expenseAmount
            }),
            headers: {
                "Content-Type": "application/json"
            }
        }).then(async function (res) {
            if (res.status === 200) {
                // Update the total budget and total spent after the expense is added
                jsonData = await getJSONData();
                totalSpent = jsonData.totalSpent;
                totalRemaining = jsonData.totalRemaining;
                // Round totalRemaining to 2 decimal places after it's updated
                totalRemaining = parseFloat(totalRemaining.toFixed(2));
                totalRemainingElement.textContent = 'Total Remaining: $' + totalRemaining;

                // Update the pie chart when the expense is added successfully
                await updatePieChart();
                cancelPost(); // Move the cancelPost() function call here
            } else {
                alert('Error saving expense data');
            }
        }).catch(function (err) {
            alert('Error adding expense: ' + err)
        })
    }
}


async function handleNewTotalBudget() {
    let totalBudgetInput = document.getElementById('post-budget-input').value;
    let totalBudgetNumber = Number(totalBudgetInput);
    let jsonData = await getJSONData()
    fetch('/budgetPage/totalBudget', {
        method: 'POST',
        body: JSON.stringify({
            totalBudget: totalBudgetNumber
        }),
        headers: {
            "Content-Type": "application/json"
        }
    }).then(async function (res) {
        if (res.status === 200) {
            let totalBudgetElement = document.querySelector('.total-budget');
            totalBudgetElement.textContent = 'Total Budget: $' + totalBudgetNumber;
            totalRemainingElement.textContent = 'Total Remaining: $' + (totalBudgetNumber - jsonData.totalSpent);
            modalBackDrop.classList.add("hidden")
            setBug.classList.add("hidden")
            await updatePieChart()
            cancelBudget()
        } else {
            alert('Error saving total budget data')
        }
    }).catch(function (err) {
        alert('Error adding total budget: ' + err)
    })
}

function cancelPost(event) {
    modalBackDrop.classList.add("hidden")
    addExp.classList.add("hidden")

    priceInput.value = '';
    categoryDropdown.value = 0
}

function cancelBudget() {
    modalBackDrop.classList.add("hidden")
    setBug.classList.add("hidden")
    budgetInput.value = '';
}


async function getJSONData() {
    let response = await fetch('/expenseData')
    if (!response.ok) {
        throw new Error('Network response was not ok')
    }
    return await response.json()
}

async function totalEachCategory(data) {
    let foodExpenses = {}
    let clothingExpenses = {}
    let entertainmentExpenses = {}
    let billsExpenses = {}
    let otherExpenses = {}
    let remainingExpenses = {}
    let categoryObjects = [foodExpenses, clothingExpenses, entertainmentExpenses, billsExpenses, otherExpenses, remainingExpenses]

    for (let key in data.expenses) {
        let expense = data.expenses[key]
        if (expense.expenseCategory === 'Food') {
            foodExpenses[key] = expense
        } else if (expense.expenseCategory === 'Clothing') {
            clothingExpenses[key] = expense
        } else if (expense.expenseCategory === 'Entertainment') {
            entertainmentExpenses[key] = expense
        } else if (expense.expenseCategory === 'Bills') {
            billsExpenses[key] = expense
        } else if (expense.expenseCategory === 'Other') {
            otherExpenses[key] = expense
        } else {
            console.log('Error: expense category not found')
        }
    }

    for (let i in categoryObjects) {
        let sum = 0
        for (let key in categoryObjects[i]) {
            sum += Number(categoryObjects[i][key].expenseAmount)
        }
        categoryObjects[i].total = sum
    }

    // Calculate the total for the 'Remaining' category
    let totalSpent = data.totalSpent
    let totalBudget = data.totalBudget
    remainingExpenses.total = totalBudget - totalSpent

    return categoryObjects
}


function getTotalSpent(categoryObjects) {
    let totalSpent = 0
    for (let i in categoryObjects) {
        totalSpent += categoryObjects[i].total
    }
    return totalSpent
}


function getCategoryDegs(categoryObjects, totalBudget) {
    let categoryDegs = {}
    let chartTotal = 360
    for (let i in categoryObjects) {
        let percent = categoryObjects[i].total / totalBudget
        categoryDegs[categories[i]] = percent * chartTotal
    }

    return categoryDegs
}

function getCategoryPercents(categoryObjects, totalBudget) {
    let categoryPercents = {}
    let totalPercent = 0
    let remainingPercent = 100
    let decimalParts = {}

    // First pass: calculate raw percentages
    for (let i in categoryObjects) {
        let percent = categoryObjects[i].total / totalBudget * 100
        let integerPart = Math.floor(percent)
        let decimalPart = percent - integerPart
        categoryPercents[categories[i]] = integerPart
        decimalParts[categories[i]] = decimalPart
        totalPercent += integerPart
        remainingPercent -= integerPart
    }

    // Second pass: distribute remaining percentage points
    while (remainingPercent > 0) {
        // Find the category with the highest decimal part
        let maxCategory = Object.keys(decimalParts).reduce((a, b) => decimalParts[a] > decimalParts[b] ? a : b);
        // Increment the percentage of the max category
        categoryPercents[maxCategory]++;
        // Set the decimal part of the max category to 0
        decimalParts[maxCategory] = 0;
        // Decrement the remaining percent
        remainingPercent--;
    }
    return categoryPercents
}


function getCategoryColor(category) {
    const categoryColors = {
        'Food': '#41afaa',
        'Clothing': '#466eb4',
        'Entertainment': '#00a0e1',
        'Bills': '#e6a532',
        'Other': '#d7642c',
        'Remaining': '#af4b91',
    };

    return categoryColors[category] || 'black';
}

if(xButton){
    xButton.addEventListener("click", cancelPost);
}

if(xButtonb){
    xButtonb.addEventListener("click", cancelBudget);
}

if(pieChart){
    pieChart.addEventListener('mouseover', function () {
        legendContainer.style.display = 'flex';
    })

    pieChart.addEventListener('mouseout', function () {
        legendContainer.style.display = 'none';
    })
}


async function updatePieChart() {
    let jsonData = await getJSONData();
    let categoryObjects = await totalEachCategory(jsonData);
    let totalSpent = getTotalSpent(categoryObjects);
    let totalBudget = jsonData.totalBudget;
    let categoryDegs = getCategoryDegs(categoryObjects, totalBudget);

    // Calculate remaining percentage
    let remainingPercent = totalSpent >= totalBudget ? 0 : 100 - (totalSpent / totalBudget) * 100;
    categoryDegs['Remaining'] = remainingPercent;

    let chartFood = categoryDegs['Food'];
    let chartClothing = categoryDegs['Clothing'];
    let chartEntertainment = categoryDegs['Entertainment'];
    let chartBills = categoryDegs['Bills'];
    let chartOther = categoryDegs['Other'];

    document.querySelector('.piechart').style.backgroundImage =
        `conic-gradient(
            #41afaa ${chartFood}deg,
            #466eb4 ${chartFood}deg ${chartFood + chartClothing}deg,
            #00a0e1 ${chartFood + chartClothing}deg ${chartFood + chartClothing + chartEntertainment}deg,
            #e6a532 ${chartFood + chartClothing + chartEntertainment}deg ${chartFood + chartClothing + chartEntertainment + chartBills}deg,
            #b9dBe4 ${chartFood + chartClothing + chartEntertainment + chartBills}deg ${chartFood + chartClothing + chartEntertainment + chartBills + chartOther}deg,
            #af4b91 ${chartFood + chartClothing + chartEntertainment + chartBills + chartOther}deg,
            #af4b91 ${chartFood + chartClothing + chartEntertainment + chartBills + chartOther}deg ${chartFood + chartClothing + chartEntertainment + chartBills + chartOther + remainingPercent}deg
        )`;

    // Clear the previous legend items
    while (legendContainer.firstChild) {
        legendContainer.removeChild(legendContainer.firstChild)
    }
    let categoryPercents = getCategoryPercents(categoryObjects, totalBudget)

    for (let category in categoryDegs) {
        let legendItem = document.createElement('div')
        legendItem.className = 'legend-item'

        // Round the percentage to the nearest whole number
        let percent = Math.round(categoryPercents[category]);
        legendItem.textContent = `${category}  [${percent}%]`;
        legendItem.style.color = getCategoryColor(category)

        legendContainer.appendChild(legendItem)
    }
}


window.addEventListener('DOMContentLoaded', async function() {
    let path = window.location.pathname;
    if (path ==='/') {
        modalAddExpenseButton.addEventListener('click', handleAddExpenseModalClick);
        totalBudgetButton.addEventListener('click', handleNewTotalBudget);

        setBudgetButton.addEventListener('click', function () {
            modalBackDrop.classList.remove("hidden");
            setBug.classList.remove("hidden");
        });

        addButton.addEventListener('click', function () {
            modalBackDrop.classList.remove("hidden");
            addExp.classList.remove("hidden");
        });

        xButton.addEventListener("click", cancelPost);

        xButtonb.addEventListener("click", cancelBudget);

        categoryDropdown.addEventListener('change', getCategory);

        // Update the pie chart when the page loads
        await updatePieChart();

        legendContainer.style.display = 'none';
    }
})

window.addEventListener('DOMContentLoaded', function() {
    let path = window.location.pathname;
    if (path ==='/allExpenses') {
        var expCardEle = document.querySelectorAll(".color")

        expCardEle.forEach(function(element) {
            var categoryGrab = element.getAttribute('data-category');
            var deleteButton = element.querySelector('.delete-expense');

            switch (categoryGrab) {
                case "Food":
                    element.classList.remove("color");
                    element.classList.add("food-color");
                    deleteButton.classList.add("food-color");
                    break;
                case "Entertainment":
                    element.classList.remove("color");
                    element.classList.add("ent-color");
                    deleteButton.classList.add("ent-color");
                    break;
                case "Bills":
                    element.classList.remove("color");
                    element.classList.add("bill-color");
                    deleteButton.classList.add("bill-color");
                    break;
                case "Clothing":
                    element.classList.remove("color");
                    element.classList.add("clothing-color");
                    deleteButton.classList.add("clothing-color");
                    break;
                case "Other":
                    element.classList.remove("color");
                    element.classList.add("other-color");
                    deleteButton.classList.add("other-color");
                    break;
            }
        })
        let deleteButtons = document.querySelectorAll('.delete-expense');

        deleteButtons.forEach(function(button) {
            button.addEventListener('click', function() {
                let expenseId = button.getAttribute('data-id');
                fetch('/budgetPage/expense/' + expenseId, {
                    method: 'DELETE'
                }).then(function(res) {
                    if (res.status === 200) {
                        // Remove the expense from the DOM
                        button.parentElement.remove();
                    } else {
                        alert('Error deleting expense');
                    }
                }).catch(function(err) {
                    alert('Error deleting expense: ' + err);
                });
            });
        });
    }
})
