const defaultServings = 4; 
const ingredientItems = document.querySelectorAll('.ingredient-item');

// Timer
let totalTime = 1200; 
let timer = totalTime;
let intervalId;
let isRunning = false;

// Progress bar
const progressBar = document.querySelector('.progress-bar');
const instructionsList = document.querySelector('#instructions ol');
const instructions = instructionsList.querySelectorAll('li');
const totalSteps = instructions.length;
let currentStep = 0;

document.addEventListener('DOMContentLoaded', init);

function init() {
    const servingsInput = document.getElementById('servings');
    servingsInput.addEventListener('change', updateServings);

    document.getElementById('print-recipe').addEventListener('click', printRecipe);
    document.getElementById('start-cooking').addEventListener('click', startCooking);
    document.getElementById('pause-cooking').addEventListener('click', pauseCooking);
    document.getElementById('resume-cooking').addEventListener('click', resumeCooking);
    document.getElementById('toggle-instructions').addEventListener('click', toggleInstructions);
    document.getElementById('reset-timer').addEventListener('click', resetTimer);

    ingredientItems.forEach((item) => {
        item.addEventListener('click', toggleHighlight);
    });
}

function toggleInstructions() {
    const instructions = document.getElementById('instructions');
    if (instructions.classList.contains('hidden')) {
        instructions.classList.remove('hidden');
        this.textContent = 'Hide Instructions';
    } else {
        instructions.classList.add('hidden');
        this.textContent = 'Show Instructions';
    }
}

function toggleHighlight() {
    this.classList.toggle('highlight');
}

function updateServings() {
    const newServings = parseInt(this.value);
    ingredientItems.forEach((item) => {
        const quantitySpan = item.querySelector('.quantity');
        const originalQuantity = parseFloat(item.dataset.quantity);
        const unit = item.dataset.unit;

        if (quantitySpan && !isNaN(originalQuantity)) {
            let newQuantity = (originalQuantity * newServings) / defaultServings;

            newQuantity = Math.round(newQuantity * 100) / 100;

            if (unit === '' || unit === 'clove' || unit === 'cloves') {
                newQuantity = Math.round(newQuantity);
            }

            quantitySpan.textContent = newQuantity;
        }
    });
}

function printRecipe() {
    window.print();
}

function startCooking() {
    if (!isRunning) {
        intervalId = setInterval(updateTimer, 1000);
        isRunning = true;
        this.classList.add('hidden');
        document.getElementById('pause-cooking').classList.remove('hidden');
        document.getElementById('resume-cooking').classList.add('hidden');
        document.getElementById('reset-timer').classList.remove('hidden');
    }
}

function resetTimer() {
    clearInterval(intervalId);
    timer = totalTime;
    document.getElementById('timer').textContent = formatTime(timer);
    progressBar.style.width = '0%';
    currentStep = 0;
    instructions.forEach(instruction => instruction.classList.remove('completed'));
    isRunning = false;
    document.getElementById('start-cooking').classList.remove('hidden');
    document.getElementById('pause-cooking').classList.add('hidden');
    document.getElementById('resume-cooking').classList.add('hidden');
    document.getElementById('reset-timer').classList.add('hidden');
}

function pauseCooking() {
    clearInterval(intervalId);
    isRunning = false;
    this.classList.add('hidden');
    document.getElementById('resume-cooking').classList.remove('hidden');
}

function resumeCooking() {
    intervalId = setInterval(updateTimer, 1000);
    isRunning = true;
    this.classList.add('hidden');
    document.getElementById('pause-cooking').classList.remove('hidden');
}

function updateTimer() {
    if (timer > 0) {
        timer--;
        document.getElementById('timer').textContent = formatTime(timer);
        updateProgressBar();
    } else {
        clearInterval(intervalId);
        alert('Cooking time is up!');
        isRunning = false;
        document.getElementById('start-cooking').classList.remove('hidden');
        document.getElementById('pause-cooking').classList.add('hidden');
        document.getElementById('resume-cooking').classList.add('hidden');
    }
} function updateProgressBar() {
    const progress = (totalTime - timer) / totalTime;
    progressBar.style.width = `${progress * 100}%`;
    if (progress >= (currentStep + 1) / totalSteps) {
        instructions[currentStep].classList.add('completed');
        currentStep++;
    }
}

function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const secondsRemaining = seconds % 60;
    return `${minutes} minutes ${secondsRemaining} seconds`;
}