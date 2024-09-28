'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

//Accounts
const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

const closeAccountPopUp = document.querySelector('.close--popup');
const closeAccountInvalid = document.querySelector(
  '.close--popup--invalidAccount'
);
const btnAccountCloseYes = document.querySelector('.close__button--yes');
const btnAccountCloseNo = document.querySelector('.close__button--no');

console.log(accounts);
//Behavior
//CREATE USERNAME
const createUserName = function (account) {
  const namesplitArr = account.owner
    .toLowerCase()
    .split(' ')
    .map(e => e[0])
    .join('');
  account.user = namesplitArr;
};
accounts.forEach(acc => createUserName(acc));
// UPDATE UI
const updateUI = function (acc) {
  displayMovements(acc.movements);
  calcAndDisplayIncomeOutCome(acc);
  displayTotal(acc);
  calcAndDisPlayInterest(acc);
};
//Display movement
const displayMovements = function (movements, sorted = false) {
  containerMovements.innerHTML = '';

  const sortedMov = sorted
    ? movements.slice().sort((a, b) => a - b)
    : movements;
  sortedMov.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';
    const html = `
    <div class="movements__row">
    <div class="movements__type movements__type--${type}">${i + 1} ${type}</div>
    <div class="movements__value">${mov}€</div>
  </div>
  `;
    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
  //   <div class="movements__row">
  //   <div class="movements__type movements__type--deposit">2 deposit</div>
  //   <div class="movements__date">3 days ago</div>
  //   <div class="movements__value">4 000€</div>
  // </div>
};
//Calculate and display interest. Interest = 10% of balance
const calcAndDisPlayInterest = function (acc) {
  const sum = acc.movements.reduce((acc, cur) => acc + cur, 0);
  const interest = sum * acc.interestRate;
  labelSumInterest.textContent = interest;
};
//Calculate and display income outcome
const calcAndDisplayIncomeOutCome = function (acc) {
  const income = acc.movements
    .filter(mov => mov > 0)
    .reduce((acc, cur) => acc + cur, 0);
  const outcome = acc.movements
    .filter(mov => mov < 0)
    .reduce((acc, cur) => acc + cur, 0);

  labelSumIn.textContent = income;
  labelSumOut.textContent = Math.abs(outcome);
};

const displayTotal = function (acc) {
  labelBalance.textContent = acc.movements.reduce((acc, cur) => acc + cur, 0);
};

//BUTTON FUNCTION
//LOGIN
let currentAccount;
btnLogin.addEventListener('click', function (e) {
  e.preventDefault();
  containerMovements.innerHTML = '';
  currentAccount = accounts.find(
    acc =>
      acc.user === inputLoginUsername.value && acc.pin == inputLoginPin.value
  );
  console.log(currentAccount);
  //Welcome message
  labelWelcome.textContent = `Welcome Mr.${currentAccount.owner.split(' ')[0]}`;
  inputLoginUsername.value = inputLoginPin.value = '';
  inputLoginPin.blur();
  updateUI(currentAccount);
});

//TRANSFER MONEY
btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  const recieverAccount = accounts.find(
    acc => acc.user == inputTransferTo.value
  );
  if (
    inputTransferAmount.value > 0 &&
    recieverAccount &&
    recieverAccount?.user != currentAccount.user
  ) {
    currentAccount.movements.push(-Number(inputTransferAmount.value));
    recieverAccount.movements.push(Number(inputTransferAmount.value));
    alert('Transaction success!');
  } else {
    alert('invalid account!');
  }
  updateUI(currentAccount);
  inputTransferAmount.value = inputTransferTo.value = '';
  inputTransferAmount.blur();
});

//REQUEST LOAN
//Condition: can only request loan that < 10% of the highest deposit
btnLoan.addEventListener('click', function (e) {
  e.preventDefault();
  if (
    currentAccount.movements.some(
      mov => mov > +inputLoanAmount.value * 0.1 && +inputLoanAmount.value > 0
    )
  ) {
    currentAccount.movements.push(+inputLoanAmount.value);
    inputLoanAmount.value = '';
    inputLoanAmount.blur();
  } else alert('Requested Loan is to high, only can request loan that < 10% of highest deposit');
  updateUI(currentAccount);
});

//CLOSE ACCOUNT
btnClose.addEventListener('click', function (e) {
  e.preventDefault();
  if (
    inputCloseUsername.value === currentAccount.user &&
    +inputClosePin.value === currentAccount.pin
  ) {
    closeAccountPopUp.style.visibility = 'visible';
  } else {
    closeAccountInvalid.style.visibility = 'visibility';
  }
  console.log(accounts);
});

btnAccountCloseYes.addEventListener('click', function (e) {
  e.preventDefault();
  closeAccountPopUp.style.visibility = 'visible';
  accounts.splice(
    accounts.findIndex(acc => acc.user === inputCloseUsername.value),
    1
  );
  inputCloseUsername.value = inputClosePin.value = '';
  currentAccount = '';
  closeAccountPopUp.style.visibility = 'hidden';
  console.log(accounts);
});

btnAccountCloseNo.addEventListener('click', function (e) {
  e.preventDefault();
  closeAccountPopUp.style.visibility = 'hidden';
  console.log(accounts);
});
//SORT BUTTON
let isSorted = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  displayMovements(currentAccount.movements, isSorted);
  isSorted = !isSorted;
});
