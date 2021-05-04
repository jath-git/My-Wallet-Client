// store important IDs from myWallet html into manageable variables 
const signInOut = document.getElementById('sign-in-out');
const uName = document.getElementById('name');
const balance = document.getElementById('balance');
const accountCount = document.getElementById('account-count');
const lastSignin = document.getElementById('last-sign-in');
const lastLog = document.getElementById('last-log');
const walletConsole = document.getElementById('wallet-icon');
// get allUsers from localStore
let readAllUsers = JSON.parse(localStorage.getItem('allUsers'));
let readCurrUser = JSON.parse(localStorage.getItem('currUser'));
// constant used to translate the month as natural number to month as string
const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
// import general functions to show/hide error message
import { showError } from './helper JS files/cautionTable.js';

/* if localStorage is empty (which occurs when there are no accounts 
created from the browser), then declare necessary variables */
if (localStorage.getItem('allUsers') === null) {
    localStorage.setItem('isSigned', false);
    localStorage.setItem('currUser', JSON.stringify({
        'default': {
            name: 'N/A',
            balance: 'N/A',
            accountCount: 'N/A',
            lastDate: 'N/A',
            lastLog: 'N/A'
        }
    }));
    localStorage.setItem('allUsers', localStorage.getItem('currUser'));
    localStorage.setItem('addAccount', true);
    localStorage.setItem('whichAccount', 2);
    localStorage.setItem('minusRep', false);
}

signInOut.addEventListener('click', () => {
    // switch to sign in page
    if (localStorage.getItem('isSigned') === 'false') {
        window.open("signIn.html");
        window.close();
    }
    // sign out user and switch back to default page
    else if (localStorage.getItem('isSigned') === 'true') {
        readCurrUser.lastDate = convertDate(new Date());
        readAllUsers[readCurrUser.username] = readCurrUser;        
        localStorage.setItem('allUsers', JSON.stringify(readAllUsers));
        localStorage.setItem('currUser', JSON.stringify(readAllUsers.default));
        changeUserInfo(readAllUsers.default); 
        localStorage.setItem('isSigned', false);
        signInOut.textContent = 'Sign In';
    }
})

// produce user-readable version of date object
function convertDate(date) {
    return months[date.getMonth()] + ' ' + date.getDate() + ', ' + date.getFullYear() ;
}

// show that user is signed in and show specific user information
if (localStorage.getItem('isSigned') === 'true') {
    signInOut.textContent = 'Sign Out';
    changeUserInfo(JSON.parse(localStorage.getItem('currUser')));
}

// change details (second column of user interface) in html page
function changeUserInfo(userInformation) {
    uName.textContent = userInformation.name;
    if (userInformation.balance === 'N/A') {
        balance.textContent = 'N/A';
        lastLog.textContent = 'N/A';
        accountCount.textContent = 'N/A';
        lastSignin.textContent = 'N/A';
    }
    else {
        balance.textContent = '$ ' + userInformation.balance.toFixed(2);
        lastSignin.textContent = userInformation.lastDate;
        lastLog.textContent = userInformation.lastLog;
        if (userInformation.accountCount === 8)
            accountCount.textContent = 'MAX';
        else
            accountCount.textContent = userInformation.accountCount;
    }
}

// click to switch to wallet console page
walletConsole.addEventListener('click', () => {
    // switch html pages only if user is signed in
    if (localStorage.getItem('isSigned') === 'true') {
        window.open('walletConsole.html');
        window.close();
    }
    else
        showError('Please sign in to access your wallet');
})