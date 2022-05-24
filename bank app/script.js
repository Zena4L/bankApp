'use strict';

// DIFFERENT DATA! Contains movement dates, currency and locale

const account1 = {
  owner: 'Clement Owireku Bogyah',
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2020-05-08T14:11:59.604Z',
    '2022-02-16T10:51:36.790Z',
    '2022-02-21T17:01:17.194Z',
    '2022-02-22T23:36:17.929Z',
  ],
  currency: 'EUR',
  locale: 'pt-PT', // de-DE
};

const account2 = {
  owner: 'Raymond Owireku Bogyah',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2020-07-26T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const accounts = [account1, account2];

/////////////////////////////////////////////////
// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

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

/////////////////////////////////////////////////

//functions
//creating a login

const createUserName = function (accs) {
  accs.forEach(function (acc) {
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map(mov => mov[0])
      .join('');
  });
};
createUserName(accounts);

const formattedDate = function (date, locale) {
  const calcDayPassed = function (day1, day2) {
    return Math.trunc(Math.abs(day2 - day1) / (1000 * 60 * 60 * 24));
  };

  const dayPassed = calcDayPassed(new Date(), date);
  if (dayPassed === 0) return 'Today';
  if (dayPassed === 1) return 'Yesterday';
  if (dayPassed <= 7) return `${dayPassed} days ago`;

  const options = {
    day: 'numeric',
    month: 'long',
    year: '2-digit',
    weekday: 'long',
    hour: 'numeric',
    minute: 'numeric',
  };

  return new Intl.DateTimeFormat(locale, options).format(dayPassed);
};

//displaying movements
const displayMovement = function (accs, date) {
  containerMovements.innerHTML = '';

  accs.movements.forEach(function (mov, i) {
    const date = new Date(accs.movementsDates[i]);

    const displayDate = formattedDate(date, accs.locale);
    const formattedNum = new Intl.NumberFormat(accs.locale, {
      style: 'currency',
      currency: accs.currency,
    }).format(mov);

    const type = mov > 0 ? 'deposit' : 'withdrawal';
    const html = `
      <div class="movements__row">
        <div class="movements__type movements__type--${type}"> ${
      i + 1
    } ${type}</div>
        <div class="movements__date">${displayDate}</div> 
        <div class="movements__value">${formattedNum}</div>
      </div>`;

    // console.log(mov);

    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

const displaySummary = function (accs) {
  const sumIn = accs.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = `${sumIn.toFixed(2)}`;

  const sumOut = accs.movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = new Intl.NumberFormat(accs.locale, {
    style: 'currency',
    currency: accs.currency,
  }).format(sumOut);

  const sumInt = accs.movements
    .map(mov => mov * accs.interestRate)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumInterest.textContent = new Intl.NumberFormat(accs.locale, {
    style: 'currency',
    currency: accs.currency,
  }).format(sumInt);
};

const displayBalance = function (accs) {
  accs.balance = accs.movements.reduce((acc, mov) => acc + mov, 0);

  labelBalance.textContent = new Intl.NumberFormat(accs.locale, {
    style: 'currency',
    currency: accs.currency,
  }).format(accs.balance);
};

//////////////////////////////////////////////////////////////////////////////////////
//utility functions

const updateUI = function (accs) {
  labelWelcome.textContent = `Welcome 👋${accs.owner.split(' ')[0]}`;
  containerApp.style.opacity = 100;
  displayMovement(accs, accs.movementsDates);
  displaySummary(accs);
  displayBalance(accs);
};

const startLogOutTimer = function () {
  //set time to 5mins
  let time = 50;
  //call timer every second
  const tick = () => {
    const min = String(Math.trunc(time / 60)).padStart(2, 0);
    const sec = String(Math.trunc(time % 60)).padStart(2, 0);

    labelTimer.textContent = `${min}:${sec}`;

    if (time === 0) {
      clearInterval(timer);

      labelWelcome.textContent = `Log in to get Started`;
      containerApp.style.opacity = 0;
    }
    time--;
  };
  tick();
  const timer = setInterval(tick, 1000);
  //print the remaining time to the UI

  //when timer is 0,stop timer and log out
  return timer;
};
////////////////////////////////////////////////////////////////////////////////////
//event handlers

//login event handler
let currentAccount, timer;

btnLogin.addEventListener('click', function (e) {
  e.preventDefault();
  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value
  );
  if (currentAccount?.pin === +inputLoginPin.value) {
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();
    //current date
    const date = new Date();

    const options = {
      day: 'numeric',
      month: 'long',
      year: '2-digit',
      weekday: 'long',
      hour: 'numeric',
      minute: 'numeric',
    };

    labelDate.textContent = new Intl.DateTimeFormat(
      currentAccount.locale,
      options
    ).format(date);
    if (timer) clearInterval(timer);
    timer = startLogOutTimer();
    updateUI(currentAccount);
  }
});

btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  const recieverAcc = accounts.find(
    accs => accs.username === inputTransferTo.value
  );
  const amount = +inputTransferAmount.value;

  if (
    amount > 0 &&
    recieverAcc &&
    currentAccount.balance >= amount &&
    recieverAcc !== currentAccount.username
  ) {
    currentAccount.movements.push(-amount);
    recieverAcc.movements.push(amount);
    currentAccount.movementsDates.push(new Date());
    recieverAcc.movementsDates.push(new Date());

    inputTransferTo.value = inputTransferAmount.value = '';
    inputTransferAmount.blur();

    updateUI(currentAccount);

    clearInterval(timer);
    timer = startLogOutTimer();
  }
});

btnLoan.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = +inputLoanAmount.value;
  if (currentAccount.movements.some(amt => amt > amount / 10)) {
    setTimeout(() => {
      currentAccount.movements.push(amount);
      currentAccount.movementsDates.push(new Date());
      updateUI(currentAccount);
      inputLoanAmount.value = '';
      inputLoanAmount.blur();
    }, 4000);

    clearInterval(timer);
    timer = startLogOutTimer();
  }
});

btnClose.addEventListener('click', function (e) {
  e.preventDefault();

  if (
    currentAccount.username === inputCloseUsername.value &&
    currentAccount.pin === +inputClosePin.value
  ) {
    const index = accounts.findIndex(
      acc => acc.username === currentAccount.username
    );

    accounts.splice(index, 1);
    containerApp.style.opacity = 0;
    labelWelcome.textContent = `Log in`;
  }
});
