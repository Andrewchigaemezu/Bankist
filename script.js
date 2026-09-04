/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: "Jonas Schmedtmann",
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
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

// Elements
const labelWelcome = document.querySelector(".welcome");
const labelDate = document.querySelector(".date");
const labelBalance = document.querySelector(".balance__value");
const labelSumIn = document.querySelector(".summary__value--in");
const labelSumOut = document.querySelector(".summary__value--out");
const labelSumInterest = document.querySelector(".summary__value--interest");
const labelTimer = document.querySelector(".timer");

const containerApp = document.querySelector(".app");
const containerMovements = document.querySelector(".movements");

const btnLogin = document.querySelector(".login__btn");
const btnTransfer = document.querySelector(".form__btn--transfer");
const btnLoan = document.querySelector(".form__btn--loan");
const btnClose = document.querySelector(".form__btn--close");
const btnSort = document.querySelector(".btn--sort");

const inputLoginUsername = document.querySelector(".login__input--user");
const inputLoginPin = document.querySelector(".login__input--pin");
const inputTransferTo = document.querySelector(".form__input--to");
const inputTransferAmount = document.querySelector(".form__input--amount");
const inputLoanAmount = document.querySelector(".form__input--loan-amount");
const inputCloseUsername = document.querySelector(".form__input--user");
const inputClosePin = document.querySelector(".form__input--pin");

/////////////////////////////////////////////////
//////////FUNCTIONS///////////////////
const calcDisplayBalance = function (currentAccount) {
  const balance = currentAccount.movements.reduce((accumulator, mov) => {
    return accumulator + mov;
  }, 0);

  labelBalance.textContent = `${balance}€`;
};

const calcDisplayMovements = function (currentAccount) {
  currentAccount.movements.forEach((mov, index) => {
    const movementNature = mov > 0 ? "deposit" : "withdrawal";
    const html = `
    <div class="movements__row">
          <div class="movements__type movements__type--${movementNature}">${index + 1} ${movementNature}</div>
          <div class="movements__date">3 days ago</div>
          <div class="movements__value">${mov}€</div>
    </div>`;

    containerMovements.insertAdjacentHTML("afterbegin", html);
  });
};

const calcDisplaySummary = function (currentAccount) {
  const deposit = currentAccount.movements.reduce((accumulator, mov) => {
    if (mov > 0) {
      return accumulator + mov;
    }
    return accumulator;
  }, 0);

  labelSumIn.textContent = `${deposit}€`;

  const withdrawal = currentAccount.movements.reduce((accumulator, mov) => {
    if (mov < 0) {
      return accumulator + Math.abs(mov);
    }
    return accumulator;
  }, 0);

  labelSumOut.textContent = `${withdrawal}€`;

  const interest = currentAccount.movements
    .filter((mov) => mov > 0)
    .map((mov) => (mov * currentAccount.interestRate) / 100)
    .filter((mov) => mov >= 1)
    .reduce((accumulator, mov) => {
      return accumulator + mov;
    }, 0);

  labelSumInterest.textContent = `${interest}€`;

  // return interest;
};

// console.log(calcDisplaySummary(account1));

// EVENT LISTENERS

let currentAccount;

btnLogin.addEventListener("click", (event) => {
  event.preventDefault();
  /////// Find the use account using the provided username
  currentAccount = accounts.find((acc) => {
    return (
      acc.owner
        .split(" ")
        .map((name) => name[0])
        .join("")
        .toLowerCase() === inputLoginUsername.value.toLowerCase()
    );
  });

  /////// Compare found user account pin with provided pin
  if (currentAccount.pin === Number(inputLoginPin.value)) {
    // console.log("Pin is correct");
    containerApp.style.opacity = 1;
    labelWelcome.textContent = `Welcome ${currentAccount.owner.split(" ")[0]}`;
    inputLoginUsername.value = inputLoginPin.value = "";
    // inputLoginPin.style.display = "none";
    inputLoginPin.blur();
  }

  //////// Calculating and displaying balance
  calcDisplayBalance(currentAccount);

  calcDisplayMovements(currentAccount);

  calcDisplaySummary(currentAccount);
});

btnTransfer.addEventListener("click", function (e) {
  e.preventDefault();
  const transferAmount = Number(inputTransferAmount.value);
  const recieverUserName = inputTransferTo.value.toLowerCase();
  const senderBalance = currentAccount.movements.reduce((accumulator, mov) => {
    return accumulator + mov;
  }, 0);

  const recieverAccount = accounts.find(
    (acc) =>
      acc.owner
        .split(" ")
        .map((name) => name[0])
        .join("")
        .toLocaleLowerCase() === recieverUserName,
  );
  if (
    transferAmount > 0 &&
    recieverAccount &&
    senderBalance > transferAmount &&
    recieverAccount !== currentAccount
  ) {
    currentAccount.movements.push(-transferAmount);
    recieverAccount.movements.push(transferAmount);

    ////////////////UPDATE THE USER INTERFACE////////////////
    calcDisplayBalance(currentAccount);
    calcDisplayMovements(currentAccount);
    calcDisplaySummary(currentAccount);

    inputTransferAmount.value = inputTransferTo.value = "";
    inputTransferAmount.blur();
  }
});

btnLoan.addEventListener("click", function (e) {
  e.preventDefault();
  const loanAmount = Number(inputLoanAmount.value);

  if (
    loanAmount > 0 &&
    currentAccount.movements.some((mov) => mov >= loanAmount * 0.1)
  ) {
    console.log("Processing loan");

    currentAccount.movements.push(loanAmount);

    //////////// UPDATE USER INTERFACE///////////
    calcDisplayBalance(currentAccount);
    calcDisplayMovements(currentAccount);
    calcDisplaySummary(currentAccount);
    inputLoanAmount.value = "";
    inputLoanAmount.blur();
  }
});

btnClose.addEventListener("click", function (e) {
  e.preventDefault();
  const userName = inputCloseUsername.value.toLowerCase();
  const userPin = Number(inputClosePin.value);
  if (
    currentAccount.owner
      .split(" ")
      .map((name) => name[0])
      .join("")
      .toLowerCase() === userName &&
    userPin === currentAccount.pin
  ) {
    console.log("Closing account");
    const accountToDelete = accounts.findIndex((acc) => acc === currentAccount);

    console.log(accountToDelete);

    accounts.splice(accountToDelete, 1);

    containerApp.style.opacity = 0;
    labelWelcome.textContent = "Log in to get started";
  }
});

// const index = accounts.findIndex((acc) => acc === account4);
// console.log(index);

// Experiment
const firstTry = account1.owner;
console.log(firstTry);
const secondTry = firstTry.split(" ");
console.log(secondTry);
const thirdTry = secondTry.map((name) => {
  return name[0];
});
console.log(thirdTry);
const fourthTry = thirdTry.join("");
console.log(fourthTry);
const fifthTry = fourthTry.toLowerCase();
console.log(fifthTry);

// console.log(
//   account1.owner
//     .split(" ")
//     .map((name) => name[0])
//     .join("")
//     .toLowerCase(),
// );
