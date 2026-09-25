// ---- Grab elements from the DOM ----
const display = document.getElementById('display');
const buttons = document.querySelectorAll('.btn');

// ---- Calculator state ----
let currentNumber = '0';       // What's on screen right now
let previousNumber = null;     // The stored number waiting for an operator
let operator = null;           // The pending operator (+, -, *, /, %)
let shouldResetDisplay = false; // After clicking an operator, next digit resets

// ---- Display helper ----
function updateDisplay() {
  display.textContent = currentNumber;
}

// ---- Handle number clicks (0-9) ----
function handleNumber(num) {
  if (shouldResetDisplay) {
    currentNumber = num;
    shouldResetDisplay = false;
  } else {
    // Avoid leading zeros like "05"
    if (currentNumber === '0') {
      currentNumber = num;
    } else {
      currentNumber += num;
    }
  }
  updateDisplay();
}

// ---- Handle decimal point ----
function handleDecimal() {
  if (shouldResetDisplay) {
    currentNumber = '0.';
    shouldResetDisplay = false;
  } else if (!currentNumber.includes('.')) {
    currentNumber += '.';
  }
  updateDisplay();
}

// ---- Handle operators (+, -, *, /, %) ----
function handleOperator(op) {
  // If an operator is already pending and the user clicks another one,
  // just replace the operator
  if (operator !== null && !shouldResetDisplay) {
    calculate();
  }

  previousNumber = parseFloat(currentNumber);
  operator = op;
  shouldResetDisplay = true;
}

// ---- Perform the actual calculation ----
function calculate() {
  if (operator === null || previousNumber === null) return;

  const current = parseFloat(currentNumber);
  let result;

  switch (operator) {
    case '+': result = previousNumber + current; break;
    case '-': result = previousNumber - current; break;
    case '*': result = previousNumber * current; break;
    case '/':
      if (current === 0) {
        result = 'Error';
        break;
      }
      result = previousNumber / current;
      break;
    case '%': result = previousNumber % current; break;
    default: return;
  }

  // Round long decimals (floating-point precision issue)
  if (typeof result === 'number') {
    result = Math.round(result * 1e10) / 1e10;
  }

  currentNumber = String(result);
  previousNumber = null;
  operator = null;
  updateDisplay();
}

// ---- Handle equals ----
function handleEquals() {
  calculate();
  shouldResetDisplay = true;
}

// ---- Handle clear (C) ----
function handleClear() {
  currentNumber = '0';
  previousNumber = null;
  operator = null;
  shouldResetDisplay = false;
  updateDisplay();
}

// ---- Handle delete (⌫) ----
function handleDelete() {
  if (currentNumber.length === 1) {
    currentNumber = '0';
  } else {
    currentNumber = currentNumber.slice(0, -1);
  }
  updateDisplay();
}

// ---- Attach click handlers to every button ----
buttons.forEach(button => {
  button.addEventListener('click', () => {
    const num = button.dataset.number;
    const op = button.dataset.operator;
    const action = button.dataset.action;

    if (num !== undefined) handleNumber(num);
    else if (op !== undefined) handleOperator(op);
    else if (action === 'decimal') handleDecimal();
    else if (action === 'equals') handleEquals();
    else if (action === 'clear') handleClear();
    else if (action === 'delete') handleDelete();
  });
});

// ---- Initialize ----
updateDisplay();