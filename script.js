// Need to set up a basic HTTP server using Python for this to work
//     python3 -m http.server
// Then type "http:localhost:8000" into browser

import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js"
import { getDatabase, ref, push, onValue, remove } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js"

const appSettings = {
    databaseURL: "https://playground-a97de-default-rtdb.firebaseio.com/"
}

const app = initializeApp(appSettings)
const database = getDatabase(app)
const shoppingListInDB = ref(database, "shoppingList")

let addButtonEl = document.getElementById("add-button")
let inputFieldEl = document.getElementById("input-field")
let shoppingListEl = document.getElementById("shopping-list")

onValue(shoppingListInDB, function(snapshot) {
    if (snapshot.exists()) {

        let itemsArray = Object.entries(snapshot.val())

        clearShoppingListEl()
        
        for (let i = 0; i < itemsArray.length; i++) {
            let currentItem = itemsArray[i]
            let currentItemID = currentItem[0]
            let currentItemValue = currentItem[1]
            appendItemToShoppingListEl(currentItem)
        }
    } else {
        shoppingListEl.innerHTML = "No items here... yet"
    }
})

addButtonEl.addEventListener("click", function() {
    let inputValue = inputFieldEl.value
    if (inputValue !== "") {
        push(shoppingListInDB, inputValue)
        clearInputField()
    }
})

function clearShoppingListEl() {
    shoppingListEl.innerHTML = ""
}

function clearInputField() {
    inputFieldEl.value = ""
}

function appendItemToShoppingListEl(item) {
    // This was the original way, but we need to create new <li>s to be able to make them clickable to delete
    // shoppingListEl.innerHTML += `
    //     <li>${itemValue}</li>
    // `

    let itemID = item[0]
    let itemValue = item[1]
    let newEl = document.createElement("li")
    newEl.tabIndex = 0
    newEl.textContent = itemValue

    newEl.addEventListener("click", function() {
        let exactLocationOfItemInDB = ref(database, `shoppingList/${itemID}`)
        remove(exactLocationOfItemInDB)
    })
    shoppingListEl.append(newEl)
}