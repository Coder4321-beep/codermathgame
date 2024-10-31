let correctAnswer;
let infinityMode = false;
let timerInterval;
let timeRemaining = 100; // 100%
const point = document.getElementById("point");
const bestPoint = document.getElementById("bestPoint");
let pointJs = 0;
let bestPointJs = 0;
if (localStorage.getItem("bestPointJs") != null && localStorage.getItem("bestPointJs") > 0) {
  bestPointJs = localStorage.getItem("bestPointJs");
  bestPoint.innerText = "Melhor: " + bestPointJs;
}

function startGame(timer) {
  clearInterval(timerInterval);
  if (infinityMode == true) {
    timeRemaining += 9999999999999;
  } else if (timer) {
    timeRemaining += timer;
    if (timeRemaining > 100) {
      timeRemaining = 100;
    }
  } else {
    timeRemaining = 100;
  }

  updateTimer();
  generateQuestion();
  timerInterval = setInterval(() => {
    timeRemaining -= 0.1;
    updateTimer();
    if (timeRemaining <= 0) {
      clearInterval(timerInterval);
      window.location.href = "gamerOver.html";
    }
  }, 10);
}

function updateTimer() {
  const timerElement = document.getElementById("timer");
  timerElement.style.width = timeRemaining + "%";
}

function generateQuestion() {
  let num1 = Math.floor(Math.random() * 100) + 1;
  let num2 = Math.floor(Math.random() * 50) + 1;
  const operators = ["+", "-", "*", "/"];
  let operator = operators[Math.floor(Math.random() * operators.length)];

  // Garante que o operador "/" só seja usado se o resultado for inteiro
  if (operator === "/") {
    if (num1 > 10) {
      num1 = Math.floor(num1 / 10);
    } else if(num2 > 10){
      num2 = Math.floor(num2 / 10);
    }
    while (num1 % num2 !== 0) {
      num1 = Math.floor(Math.random() * 10) + 1;
      num2 = Math.floor(Math.random() * 10) + 1;
    }
  }
  if (operator == "*") {
    // Redefine valores de num1 e num2 para serem pequenos, evitando multiplicações altas
    num1 = Math.floor(Math.random() * 10) + 1;
    num2 = Math.floor(Math.random() * 10) + 1;
  }

  // Calcula a resposta correta
  correctAnswer = eval(`${num1} ${operator} ${num2}`);

  document.getElementById("question").innerText = `${num1} ${checkOperator(operator)} ${num2} = ?`;

  const options = generateOptions(correctAnswer);
  displayOptions(options);
}

function generateOptions(correctAnswer) {
  let options = new Set();
  options.add(correctAnswer);
  while (options.size < 4) {
    options.add(correctAnswer + Math.floor(Math.random() * 10) - 5);
  }
  return Array.from(options).sort(() => Math.random() - 0.5);
}

function displayOptions(options) {
  const optionsContainer = document.getElementById("options");
  optionsContainer.innerHTML = "";
  options.forEach(option => {
    const button = document.createElement("div");
    button.classList.add("option");
    button.innerText = option;
    button.onclick = () => checkAnswer(option);
    optionsContainer.appendChild(button);
  });
}

function checkAnswer(selectedOption) {
  clearInterval(timerInterval);
  if (selectedOption === correctAnswer) {
    pointJs += 1;
    point.innerText = "Pontuação: " + pointJs;
    startGame(20);
  } else {
    if (pointJs > bestPointJs) {
      bestPointJs = pointJs;
      localStorage.setItem("bestPointJs", bestPointJs);
      bestPoint.innerText = "Melhor: " + bestPointJs;
    }
    pointJs = 0;
    point.innerText = "Pontuação: " + pointJs;
    window.location.href = "gamerOver.html";
  }
}

function checkOperator(operator) {
  if (operator === "*") return "×";
  if (operator === "/") return "÷";
  return operator;
}

startGame();
