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
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];
const userNameAccounts = [
  account1.userName,
  account2.userName,
  account3.userName,
  account4.userName,
];
const pinUser = [account1.pin, account2.pin, account3.pin, account4.pin];

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

function setupLogin(accounts) {
  accounts.forEach(function (acc) {
    acc.userName = acc.owner
      .toLowerCase()
      .split(" ")
      .map((name) => name[0])
      .join("");
  });
}

function loginCheck(loginInputUserEl, pinEl) {
  let acc = userNameAccounts.includes(loginInputUserEl.value);
  let pin = pinUser.filter((pin) => pin === pinEl);

  if (loginInputUserEl === "js" && pinEl === "1111") {
    changeOpacity(mainEl, "1");
    displayMovments(account1.movements);
    changeName(account1);
    let balance = calculateTotalBalance(account1.movements);
    displayTotalBalance(balance);
    let totaldeposit = totalDeposit(account1.movements);
    moneyIn.innerHTML = `${totaldeposit} €`;
    let totalWithdraw = totalWithDraw(account1.movements);
    moneyOut.innerHTML = `${Math.abs(totalWithdraw)} €`;
    balance = calculateRate(account1);
    interestRate.innerHTML = `${Math.round(balance * 100) / 100} €`;
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
  return balance;
}

function totalDeposit(movements) {
  let totalDeposit = movements
    .filter((mov) => mov > 0)
    .reduce((acc, mov) => acc + mov);
  return totalDeposit;
}

function totalWithDraw(movements) {
  let totalWithDraw = movements
    .filter((mov) => mov < 0)
    .reduce((acc, mov) => acc + mov);
  return totalWithDraw;
}

function calculateRate(account) {
  let sumRate = account.movements
    .filter((mov) => mov > 0)
    .map((mov) => (mov * account.interestRate) / 100)
    .reduce((acc, mov) => acc + mov);
  return sumRate;
}

setupLogin(accounts);

btnLoginEl.addEventListener("click", function () {
  const loginInputUserEl = document.querySelector(".login__input--user");
  const pinEl = document.querySelector(".login__input--pin");
  loginCheck(loginInputUserEl.value, pinEl.value);

  loginInputUserEl.value = "";
  pinEl.value = "";
});
