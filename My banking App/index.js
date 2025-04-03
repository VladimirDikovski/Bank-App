"use strict";

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: "Jonas Schmedtmann",
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    "2019-11-18T21:31:17.178Z",
    "2019-12-23T07:42:02.383Z",
    "2020-01-28T09:15:04.904Z",
    "2020-04-01T10:17:24.185Z",
    "2020-05-08T14:11:59.604Z",
    "2020-05-27T17:01:17.194Z",
    "2020-07-11T23:36:17.929Z",
    "2025-04-01T10:51:36.790Z",
  ],
  currency: "EUR",
  locale: "pt-PT", // de-DE
};

const account2 = {
  owner: "Jessica Davis",
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    "2019-11-01T13:15:33.035Z",
    "2019-11-30T09:48:16.867Z",
    "2019-12-25T06:04:23.907Z",
    "2020-01-25T14:18:46.235Z",
    "2020-02-05T16:33:06.386Z",
    "2020-04-10T14:43:26.374Z",
    "2020-06-25T18:49:59.371Z",
    "2025-03-03T12:01:20.894Z",
  ],
  currency: "USD",
  locale: "en-US",
};

const accounts = [account1, account2];

let date = new Date();
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
const closeAccountPin = document.querySelector(".close-account-pin");
const btnCloseAccount = document.querySelector(".close-account-btn");
const currentBalanceDateEl = document.querySelector(".curent-balance-date");

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

    currentBalanceDateEl.textContent = String(date).slice(0, 21);
    changeOpacity(mainEl, "1");
    changeName(account);
    updateUI(account);
    calculateRate(account);
    return account;
  } else {
    alert("Invalid username or PIN.");
    return null;
  }
}

function updateUI(account) {
  calculateTotalBalance(account.movements);
  totalDeposit(account.movements);
  totalWithDraw(account.movements);
  calculateRate(account);
  displayMovments(account);
}

const dateCalculate = (date1, date2) => {
  return Math.round(Math.abs((date2 - date1) / (1000 * 60 * 60 * 24)));
};

function changeOpacity(main, value) {
  mainEl.style.opacity = value;
}

function changeName(account) {
  welcomeEl.innerHTML = `Welcome, ${account.owner.split(" ")[0]} !`;
}

function displayTotalBalance(sumTotal) {
  totalBalanceEl.innerHTML = `${sumTotal} €`;
}

function withdrawOrDeposit(movements) {
  if (movements > 0) {
    return "Deposit";
  } else {
    return "wildraw";
  }
}

function formatDate(date) {
  let year = date.getFullYear();
  let month = `${date.getMonth() + 1}`.padStart(2, 0);
  let day = `${date.getDate()}`.padStart(2, 0);
  return `${day}/${month}/${year}`;
}

function displayMovments(acc, sort = false) {
  currentTransactionEl.innerHTML = " ";

  const combineDateAndMovments = acc.movements.map((mov, i) => ({
    movements: mov,
    movementsDate: acc.movementsDates[i],
  }));

  if (sort) {
    combineDateAndMovments.sort((a, b) => a.movements - b.movements);
  }

  combineDateAndMovments.forEach(function (obj, i) {
    const { movements, movementsDate } = obj;

    let dateMov = " ";

    let dateMovements = formatDate(new Date(movementsDate));

    let distanceBetweenTrasactionsDate = dateCalculate(
      new Date(),
      new Date(movementsDate)
    );
    if (distanceBetweenTrasactionsDate === 0) dateMov = "Today";
    else if (distanceBetweenTrasactionsDate === 1) dateMov = "Yesterday";
    else if (distanceBetweenTrasactionsDate <= 7)
      dateMov = `${distanceBetweenTrasactionsDate} days ago`;
    else {
      dateMov = dateMovements;
    }

    let type = withdrawOrDeposit(movements);

    let html = ` <div class="rows">
              <div class="row">
              <div class="deposit">
                <label for="text" class="label label-1 label-${type}"
                  >${i + 1} ${type}</label
                >
                <p class="date">${dateMov}</p>
              </div>
              <p class="deposit-price">${movements.toFixed(2)} €</p>
            </div>
          </div>`;

    currentTransactionEl.insertAdjacentHTML("afterbegin", html);
  });
}

function calculateTotalBalance(movements) {
  let balance = movements.reduce((acc, mov) => acc + mov);
  totalBalanceEl.innerHTML = `${balance.toFixed(2)} €`;
}

function totalDeposit(movements) {
  let ispositive = movements.filter((mov) => mov > 0);
  if (ispositive.length != 0) {
    let totalDeposit = movements
      .filter((mov) => mov > 0)
      .reduce((acc, mov) => acc + mov);
    moneyIn.innerHTML = `${totalDeposit.toFixed(2)} €`;
  }
}

function totalWithDraw(movements) {
  let isNegativ = movements.filter((mov) => mov < 0);
  if (isNegativ.length != 0) {
    let totalWithDraw = movements
      .filter((mov) => mov < 0)
      .reduce((acc, mov) => acc + mov);
    moneyOut.innerHTML = `${Math.abs(totalWithDraw.toFixed(2))} €`;
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
    account.movementsDates.push(new Date());
  }
}
let account = {};

setupLogin(accounts);

btnLoginEl.addEventListener("click", function () {
  const username = loginInputUserEl.value.toLowerCase();
  const pin = +pinEl.value;
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
  let price = Math.floor(inputTransferEl.value);
  loon(account, price);

  updateUI(account);

  inputTransferEl.value = "";
});

buttonTransferto.addEventListener("click", function () {
  let price = +inputFieldTransfertoAmount.value;
  if (price != "" && (price < 0 || price > 0)) {
    let userToTransfer = findUser(inputFieldTransferToUser.value);
    if (checkBalance(account, price)) {
      userToTransfer.movements.push(price);
      account.movements.push(price * -1);

      updateUI(account);
    } else {
      alert(`You don't have enough money `);
      deleteFields(inputFieldTransfertoAmount, inputFieldTransferToUser);
      return;
    }

    deleteFields(inputFieldTransfertoAmount, inputFieldTransferToUser);
  }
});

let sorted = false;
sortArayBtn.addEventListener("click", function () {
  displayMovments(account, !sorted);
  sorted = !sorted;
});

function checkBalance(account, price) {
  let totalBalanceAcc = account.movements.reduce((acc, mov) => acc + mov);
  if ((price > 0) & (price <= totalBalanceAcc)) {
    return true;
  } else {
    return false;
  }
}

btnCloseAccount.addEventListener("click", function () {
  let userName = closeAccountUserFieldEl.value.toLocaleLowerCase();
  let pin = +closeAccountPin.value;

  let deleteOrNot = prompt(
    `Are you sure to delete user ${account.owner}\n Yes Or No`
  );

  if (deleteOrNot.toLocaleLowerCase() === "yes") {
    if (account.pin === pin && account && account.userName === userName) {
      let indexOFaCC = accounts.indexOf(account);
      accounts.splice(indexOFaCC, 1);
      alert(`You deleted user ${account.owner}`);
      changeOpacity(mainEl, "0");
      welcomeEl.textContent = "Log in to get started";
    } else {
      alert(`You don't have this user `);
    }
  } else if (deleteOrNot.toLocaleLowerCase() === "no") {
  } else {
    alert("Your Input is invalid!");
  }

  deleteFields(closeAccountUserFieldEl, closeAccountPin);
});

