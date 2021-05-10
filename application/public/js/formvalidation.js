const username = document.getElementById('username')
const password = document.getElementById('password')
const redo = document.getElementById('redo')
const register = document.getElementById('register')
const errorElement = document.getElementById('error')
const ages = document.querySelectorAll('input[name="age"]');
let value;
var req = /(?=.*\d)(?=.*[A-Z])(?=.*[a-z])(?=.*\W)/;
var check = /^[a-zA-Z]/;

register.addEventListener('submit', (e) => {
    let messages = []
    if (username.value == '' || username.value == null || username.value.length < 3) {
        messages.push('\nUsername must be 3+ alphanumeric characters long')
    }
    if(!check.test(username.value)) {
        messages.push('\nUsername must begin with a letter')
    }

    if (password.value.length < 8) {
        messages.push('\nPassword must be 8+ characters long')
    }

    if (!req.test(password.value)) {
        messages.push('\nPassword must have at least 2 letters of different cases, 1 number, and 1 special character')
    }

    if(password.value != redo.value) {
        messages.push('\nPasswords must match')
    }

    for (const age of ages) {
        if(age.checked) {
            value = age.value;
            break;
        }
    }
    var ageno = "no";
    if(value == ageno) {
        messages.push('\nYou must be 13 or older');
    }

    if (messages.length > 0) {
        e.preventDefault()
        errorElement.innerText = messages.join(', ')
        alert(messages.join(', '))
    }
})

