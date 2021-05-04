// store important IDs in manageable variables
const back = document.getElementById('back');
const header = document.getElementById('accountHeader');
const tableInstruction = document.getElementById('table-instruction');
const readCurrUser = JSON.parse(localStorage.getItem('currUser'));
const currSlot = localStorage.getItem('whichAccount');
const readAccNames = readCurrUser.accountInformation[0];
const readAccCodes = readCurrUser.accountInformation[1];
let readAccImage = readCurrUser.accountInformation[3][currSlot];
const accountName = document.getElementById('account-name');
const accountCode = document.getElementById('account-code');
const accountImage = document.getElementById('import');
const confirmAcc = document.getElementById('confirm-account');
const inputs = document.querySelectorAll('input');

const changeAcc = document.getElementById('change');
const deleteAcc = document.getElementById('delete');
const cancel = document.getElementById('cancel');
// switch to accounts page to change the selected account
changeAcc.addEventListener('click', () => {
    showAccountTable();
})

// delete all information about the selected account and reset display of the slot
deleteAcc.addEventListener('click', () => {
    readCurrUser.accountCount--;
    readCurrUser.accountInformation[2][currSlot] = 0;
    readCurrUser.accountBalance -= readCurrUser.accountInformation[2][currSlot];

    updateUser(null, null, 'images/add.png');
    
    goWalletConsole();
})

cancel.addEventListener('click', () => {
    goWalletConsole();
})

// import showError function which is used in other js files as well
import { showError } from './helper JS files/cautionTable.js';

const actionTable = document.getElementById('action-table');
const accountTable = document.getElementById('account-table');

// change display of page depending on whether the user is adding or changing the account
if (localStorage.getItem('addAccount') === 'true') {
    header.textContent = 'Add Account';
    tableInstruction.textContent = 'Please enter information about the new account below';
    showAccountTable();
}
else {
    header.textContent = 'Change Account'
    tableInstruction.textContent = 'Please replace the information about the account below';
}

// display table that determines what action to do execute on account
function showAccountTable() {
    actionTable.style.display = 'none';
    accountTable.style.display = 'table';
    back.style.display = 'inline-block';
}

// switch to walletConsole page when back icon is clicked
back.addEventListener('click', () => goWalletConsole())

// store user inputted image if the file is an image
accountImage.addEventListener('change', function () {
    const reader = new FileReader();
    const file = this.files[0];

    reader.addEventListener('load', () => {
        if (file['type'].split('/')[0] === 'image')
            readAccImage = reader.result;
    })
    reader.readAsDataURL(file);
})

// check if inputs for account is valid and if so, store information about the account in localStorage
confirmAcc.addEventListener('click', () => accountChange(accountName.value, accountCode.value))
inputs.forEach(input => {
    input.addEventListener('keypress', e => {
        if (e.keyCode === 13)
            accountChange(accountName.value, accountCode.value);
    })
})

function accountChange(accountName, accountCode) {
    // if account name or code already exists in another slot, then corresponding error message
    if (readAccNames.includes(accountName) && readAccNames[currSlot] !== accountName)
        showError('Account name already exists');
    else if (readAccCodes.includes(accountCode) && readAccCodes[currSlot] !== accountCode)
        showError('Account code already exists');
    // if inputs are empty, then tell user to fill both fields
    else if (accountName === '' || accountCode === '')
        showError('Please fill in both fields');
    // user is not allowed to make account code 'abs' since it is already a predetermined code
    else if (accountCode === 'abs')
        showError('abs is already an existing code');
    // store new account information in localStorage and return to walletConsole page
    else {
        if (readAccImage === 'images/add.png')
            readAccImage = 'images/check.png';
        updateUser(accountName, accountCode, readAccImage);
    }  
}

// store all updated values to the currUser in localStorage
function updateUser(name, code, image) {
    readCurrUser.accountInformation[0][currSlot] = name;
    readCurrUser.accountInformation[1][currSlot] = code;
    readCurrUser.accountInformation[3][currSlot] = image;

    if (localStorage.getItem('addAccount') === 'true')
        ++readCurrUser.accountCount;
    else 
        localStorage.setItem('addAccount', true);

    localStorage.setItem('currUser', JSON.stringify(readCurrUser));
    goWalletConsole();
}

// switch to walletConsole page
function goWalletConsole() {
    window.open('walletConsole.html');
    window.close();
}