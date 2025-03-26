"use strict";

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: "Jonas Schmedtmann",
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300, 500],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: "Jessica Davis",
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: "Steven Thomas Williams",
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: "Sarah Smith",
  movements: [-430, -100],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

let copyAccData = [...accounts];

const welcomeEl = document.querySelector(".welcome");
const loginInputUserEl = document.querySelector(".login__input--user");
const pinEl = document.querySelector(".login__input--pin");
const mainEl = document.querySelector("main");
const btnLoginEl = document.querySelector(".login__btn");
const currentTransactionEl = document.querySelector(".current-transactions");
const totalBalanceEl = document.querySelector(".t-balance");
const moneyIn = document.querySelector(".p-money-in");
const moneyOut = document.querySelector(".p-money-out");
const interestRate = document.querySelector(".p-money-Interest");
const transferBtnEl = document.querySelector(".transfer-loon-btn");
const inputTransferEl = document.querySelector(".loon-field");
const inputFieldTransferToUser = document.querySelector(
  ".field-transfer-to-user"
);
const inputFieldTransfertoAmount = document.querySelector(
  ".field-transfer-to-amount"
);
const buttonTransferto = document.querySelector(".btn-transfer-to");
const sortArayBtn = document.querySelector(".sort-btn");
const sortArrow = document.querySelector(".sort-p");

const closeAccountUserFieldEl = document.querySelector(".close-account-user");
const closeAccountAmountField = document.querySelector(".close-account-amount");
const btnCloseAccount = document.querySelector(".close-account-btn");

function setupLogin(accounts) {
  accounts.forEach(function (acc) {
    acc.userName = acc.owner
      .toLowerCase()
      .split(" ")
      .map((name) => name[0])
      .join("");
  });
}

function loginCheck(username, pin) {
  account = findUser(username);

  if (account && account.pin === pin) {
    alert("Welcome");
    changeOpacity(mainEl, "1");
    displayMovments(account.movements);
    changeName(account);
    calculateTotalBalance(account.movements);
    totalDeposit(account.movements);
    totalWithDraw(account.movements);
    calculateRate(account);
    return account;
  } else {
    alert("Invalid username or PIN.");
    return null;
  }
}

function changeOpacity(main, value) {
  mainEl.style.opacity = "1";
}

function changeName(account) {
  welcomeEl.innerHTML = `Welcome, ${account.owner.split(" ")[0]} !`;
}

function displayTotalBalance(sumTotal) {
  totalBalanceEl.innerHTML = `${sumTotal} €`;
}

function displayMovments(movements) {
  currentTransactionEl.innerHTML = " ";
  movements.forEach(function (mov, i) {
    let type = " ";
    if (mov > 0) {
      type = "deposit";
    } else {
      type = "wildraw";
    }

    let html = ` <div class="rows">
              <div class="row">
              <div class="deposit">
                <label for="text" class="label label-1 label-${type}"
                  >${i + 1} ${type}</label
                >
                <p class="date">12/03/2020</p>
              </div>
              <p class="deposit-price">${mov} €</p>
            </div>
          </div>`;

    currentTransactionEl.insertAdjacentHTML("afterbegin", html);
  });
}

function calculateTotalBalance(movements) {
  let balance = movements.reduce((acc, mov) => acc + mov);
  totalBalanceEl.innerHTML = `${balance} €`;
}

function totalDeposit(movements) {
  let ispositive = movements.filter((mov) => mov > 0);
  if (ispositive.length != 0) {
    let totalDeposit = movements
      .filter((mov) => mov > 0)
      .reduce((acc, mov) => acc + mov);
    moneyIn.innerHTML = `${totalDeposit} €`;
  }
}

function totalWithDraw(movements) {
  let isNegativ = movements.filter((mov) => mov < 0);
  if (isNegativ.length != 0) {
    let totalWithDraw = movements
      .filter((mov) => mov < 0)
      .reduce((acc, mov) => acc + mov);
    moneyOut.innerHTML = `${Math.abs(totalWithDraw)} €`;
  }
}

function calculateRate(account) {
  let istherePositive = account.movements.filter((acc) => acc > 0);
  if (istherePositive.length != 0) {
    let sumRate = account.movements
      .filter((mov) => mov > 0)
      .map((mov) => (mov * account.interestRate) / 100)
      .reduce((acc, mov) => acc + mov);
    interestRate.innerHTML = `${Math.round(sumRate * 100) / 100} €`;
  }
}

function loon(account, price) {
  if (typeof price === "number" && (price > 0 || price < 0)) {
    account.movements.push(price);
  }
}
let account = {};

setupLogin(accounts);

btnLoginEl.addEventListener("click", function () {
  const username = loginInputUserEl.value.toLowerCase();
  const pin = Number(pinEl.value);
  account = loginCheck(username, pin);

  loginInputUserEl.value = "";
  pinEl.value = "";
});

function findUser(userName) {
  let account = accounts.find((acc) => acc.userName === userName);
  if (account) {
    return account;
  } else {
    return null;
  }
}

function deleteFields(field1, field2) {
  field1.value = "";
  field2.value = "";
}

transferBtnEl.addEventListener("click", function () {
  let price = Number(inputTransferEl.value);
  loon(account, price);
  displayMovments(account.movements);
  calculateTotalBalance(account.movements);
  totalDeposit(account.movements);
  totalWithDraw(account.movements);
  calculateRate(account);
  inputTransferEl.value = "";
});

buttonTransferto.addEventListener("click", function () {
  let price = Number(inputFieldTransfertoAmount.value);
  if (price != "" && (price < 0 || price > 0)) {
    let userToTransfer = findUser(inputFieldTransferToUser.value);

    userToTransfer.movements.push(price);
    account.movements.push(price * -1);

    calculateTotalBalance(userToTransfer.movements);
    totalDeposit(userToTransfer.movements);
    totalWithDraw(userToTransfer.movements);
    calculateRate(userToTransfer);

    calculateTotalBalance(account.movements);
    totalDeposit(account.movements);
    totalWithDraw(account.movements);
    calculateRate(account);
    displayMovments(account.movements);

    deleteFields(inputFieldTransfertoAmount, inputFieldTransferToUser);
  }
});

sortArayBtn.addEventListener("click", function () {
  if (sortArayBtn.textContent === "↑") {
    sortArayBtn.textContent = "↓";
    account.movements = account.movements.slice().reverse();
  } else {
    sortArayBtn.textContent = "↑";
    account.movements = account.movements.slice().sort((a, b) => a - b);
  }

  displayMovments(account.movements);
});

btnCloseAccount.addEventListener("click", function () {
  let price = Number(closeAccountAmountField.value);
  let userName = closeAccountUserFieldEl.value;
  let accountToAmount = findUser(userName);

  let deleteOrNot = prompt(
    `Are you sure to delete user ${account.owner} and trasfer money to user ${accountToAmount.owner} \n Yes or No`
  );

  if (deleteOrNot.toLocaleLowerCase() === "yes") {
    accountToAmount.movements.push(price);
    account.movements.push(price * -1);
    account = accountToAmount;
    let indexOFaCC = accounts.indexOf(account);
    accounts.splice(indexOFaCC, 1);
    calculateTotalBalance(accountToAmount.movements);
    totalDeposit(accountToAmount.movements);
    totalWithDraw(accountToAmount.movements);
    calculateRate(accountToAmount);
    alert(`You deleted user ${account.owner}`);
    changeName(accountToAmount);
    displayMovments(accountToAmount.movements);
  } else if (deleteOrNot.toLocaleLowerCase() === "no") {
  } else {
    alert("Your Input is invalid!");
  }

  deleteFields(closeAccountUserFieldEl, closeAccountAmountField);
});

