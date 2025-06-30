// Select elements
const slider = document.querySelector('[data-lengthslider]');
const lengthDisplay = document.querySelector('[length_display]');
const passwordDisplay = document.querySelector('[password_display]');
const copyBtn = document.querySelector('[copy_button]');
const copyMsg = document.querySelector('[copy_msg]');
const uppercaseCheck = document.querySelector('#uppercase');
const lowercaseCheck = document.querySelector('#lowercase');
const numbersCheck = document.querySelector('#numbers');
const symbolsCheck = document.querySelector('#symbols');
const indicatorBar = document.querySelector('.strength-bar-fill');
const generateBtn = document.querySelector('.generateBtn');
const clearBtn = document.querySelector('.clearBtn');

const symbols = '~!@#$%^&*()_+=-`{}[]:";<>?,./';
let passwordLength = 10;

// Set slider default
slider.value = passwordLength;
lengthDisplay.innerText = passwordLength;

// Update slider fill and displayed length
function handleSlider() {
  const min = +slider.min;
  const max = +slider.max;
  const val = +slider.value;
  passwordLength = val;
  lengthDisplay.innerText = val;

  const percentage = ((val - min) / (max - min)) * 100;
  slider.style.background = `linear-gradient(to right, var(--accent-light) 0%, var(--accent-light) ${percentage}%, var(--neutral-border) ${percentage}%, var(--neutral-border) 100%)`;
}

slider.addEventListener('input', handleSlider);

function generateRandomNumber(min = 0, max = 9) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateLowerCase() {
  return String.fromCharCode(generateRandomNumber(97, 122));
}

function generateUpperCase() {
  return String.fromCharCode(generateRandomNumber(65, 90));
}

function generateNumber() {
  return generateRandomNumber().toString();
}

function generateSymbol() {
  const rand = generateRandomNumber(0, symbols.length - 1);
  return symbols.charAt(rand);
}

function calculateStrength(password) {
  let hasUpper = uppercaseCheck.checked;
  let hasLower = lowercaseCheck.checked;
  let hasNum = numbersCheck.checked;
  let hasSym = symbolsCheck.checked;

  if (password.length >= 12 && hasUpper && hasLower && (hasNum || hasSym)) {
    setStrength('strong');
  } else if (password.length >= 8 && (hasUpper || hasLower) && (hasNum || hasSym)) {
    setStrength('medium');
  } else {
    setStrength('weak');
  }
}

function setStrength(level) {
  indicatorBar.classList.remove('strength-weak', 'strength-medium', 'strength-strong');
  
  const label = document.getElementById('strengthLabel');

  if (level === 'strong') {
    indicatorBar.classList.add('strength-strong');
    indicatorBar.style.width = '100%';
    label.innerText = 'Strong';
  } else if (level === 'medium') {
    indicatorBar.classList.add('strength-medium');
    indicatorBar.style.width = '66%';
    label.innerText = 'Medium';
  } else {
    indicatorBar.classList.add('strength-weak');
    indicatorBar.style.width = '33%';
    label.innerText = 'Weak';
  }
}


async function copyToClipboard() {
  try {
    await navigator.clipboard.writeText(passwordDisplay.value);
    copyMsg.innerText = 'Copied';
  } catch (err) {
    copyMsg.innerText = 'Failed';
  }

  if (!passwordDisplay.value) {
  document.getElementById('strengthLabel').innerText = 'Strength';
  }

  copyMsg.style.opacity = 1;
  copyMsg.style.transform = 'translateY(0)';
  setTimeout(() => {
    copyMsg.style.opacity = 0;
    copyMsg.style.transform = 'translateY(-4px)';
  }, 1500);
}

copyBtn.addEventListener('click', () => {
  if (passwordDisplay.value) copyToClipboard();
});

clearBtn.addEventListener('click', () => {
  passwordDisplay.value = '';
  indicatorBar.classList.remove('strength-weak', 'strength-medium', 'strength-strong');
  indicatorBar.style.width = '0%';
  document.querySelector('.strength_txt').innerText = 'Strength';
});

function shufflePassword(passwordArray) {
  for (let i = passwordArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [passwordArray[i], passwordArray[j]] = [passwordArray[j], passwordArray[i]];
  }
  return passwordArray.join('');
}

// Optional: show temporary message if validation fails
function showValidationMessage(message) {
  let msgEl = document.getElementById('validation-msg');
  if (!msgEl) {
    msgEl = document.createElement('p');
    msgEl.id = 'validation-msg';
    msgEl.style.color = '#ef4444';
    msgEl.style.fontSize = '14px';
    msgEl.style.marginTop = '10px';
    msgEl.style.textAlign = 'center';
    generateBtn.parentElement.appendChild(msgEl);
  }
  msgEl.innerText = message;
  msgEl.style.opacity = 1;

  setTimeout(() => {
    msgEl.style.opacity = 0;
  }, 1800);
}

generateBtn.addEventListener('click', () => {
  let password = '';
  let generators = [];

  if (uppercaseCheck.checked) generators.push(generateUpperCase);
  if (lowercaseCheck.checked) generators.push(generateLowerCase);
  if (numbersCheck.checked) generators.push(generateNumber);
  if (symbolsCheck.checked) generators.push(generateSymbol);

  if (generators.length === 0) {
    showValidationMessage('Please select at least one option');
    return;
  }

  for (let i = 0; i < generators.length && password.length < passwordLength; i++) {
    password += generators[i]();
  }

  while (password.length < passwordLength) {
    const randomFunc = generators[Math.floor(Math.random() * generators.length)];
    password += randomFunc();
  }

  password = shufflePassword(password.split(''));
  passwordDisplay.value = password;
  calculateStrength(password);
});

// Initial call to render slider fill
handleSlider();
