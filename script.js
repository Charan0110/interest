const alertElement = document.querySelector(".alert");
const passwordElement = document.querySelector(".password");
const copyBtnElement = document.querySelector(".copy-btn");
const charLengthElement = document.querySelector(".char-length");
const charInputElement = document.querySelector(".slider-range");
const numbersSwitchElement = document.querySelector(
  'input[name="numbers-switch"]'
);
const symbolsSwitchElement = document.querySelector(
  'input[name="symbols-switch"]'
);
const uppercaseSwitchElement = document.querySelector(
  'input[name="uppercase-switch"]'
);
const submitBtnElement = document.querySelector(".submit-btn");

copyBtnElement.addEventListener("click", async function (e) {
  try {
    await copyToClipboard(passwordElement.textContent);
    alertElement.style.visibility = "visible";
    setTimeout(function () {
      alertElement.style.visibility = "hidden";
    }, 3000);
  } catch (err) {
    console.error("Failed to copy: ", err);
  }
});

charInputElement.addEventListener("input", function (e) {
  charLengthElement.textContent = e.target.value;
});

submitBtnElement.addEventListener("click", function (e) {
  e.preventDefault();
  const charLength = parseInt(charInputElement.value);
  const includeNumbers = numbersSwitchElement.checked;
  const includeSymbols = symbolsSwitchElement.checked;
  const includeUppercase = uppercaseSwitchElement.checked;

  const password = generateRandomPassword(
    charLength,
    includeNumbers,
    includeSymbols,
    includeUppercase
  );
  setFontSize(password);
  passwordElement.textContent = password;
});

async function copyToClipboard(str) {
  if (navigator.clipboard && navigator.clipboard.writeText) {
    await navigator.clipboard.writeText(str);
  } else {
    throw new Error("Clipboard not supported");
  }
}

function replaceRandomChar(password, replacementChar) {
  const randomIndex = Math.floor(Math.random() * password.length);
  const passwordArray = password.split("");
  passwordArray[randomIndex] = replacementChar;
  return passwordArray.join("");
}

function generateRandomPassword(
  length,
  includeNumbers,
  includeSymbols,
  includeUppercase
) {
  const lowercaseChars = "abcdefghijklmnopqrstuvwxyz";
  const uppercaseChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const numberChars = "0123456789";
  const symbolChars = "!?@#$%^&*()_";

  let charset = lowercaseChars;
  if (includeUppercase) charset += uppercaseChars;
  if (includeNumbers) charset += numberChars;
  if (includeSymbols) charset += symbolChars;

  let password = "";

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length);
    password += charset[randomIndex];
  }

  if (includeNumbers && !/\d/.test(password)) {
    const randomNumIndex = Math.floor(Math.random() * numberChars.length);
    password = replaceRandomChar(password, numberChars[randomNumIndex]);
  }

  if (includeSymbols && !/[!?@#$%^&*()_]/.test(password)) {
    const randomSymbolIndex = Math.floor(Math.random() * symbolChars.length);
    password = replaceRandomChar(password, symbolChars[randomSymbolIndex]);
  }

  if (includeUppercase && !/[A-Z]/.test(password)) {
    const randomUpperIndex = Math.floor(Math.random() * uppercaseChars.length);
    password = replaceRandomChar(password, uppercaseChars[randomUpperIndex]);
  }

  return password;
}

function setFontSize(password) {
  const passwordLength = password.length;
  if (passwordLength <= 10) {
    passwordElement.style.fontSize = "2rem";
  } else if (passwordLength <= 15) {
    passwordElement.style.fontSize = "1.5rem";
  } else {
    passwordElement.style.fontSize = "1.25rem";
  }
}
