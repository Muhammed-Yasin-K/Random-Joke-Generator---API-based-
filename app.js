const elements = {
    jokeText: null,
    jokeSetup: null,
    fetchJokeBtn: null,
    categorySelect: null,
    errorDisplay: null
};

document.addEventListener('DOMContentLoaded', initializeApp);

function initializeApp() {
    bindElements();
    setupEventListeners();
    loadNewJoke();
}

function bindElements() {
    elements.jokeText = document.getElementById('jokeText');
    elements.jokeSetup = document.getElementById('jokeSetup');
    elements.fetchJokeBtn = document.getElementById('fetchJokeBtn');
    elements.categorySelect = document.getElementById('categorySelect');
    elements.errorDisplay = document.getElementById('errorDisplay');
}

function setupEventListeners() {
    elements.fetchJokeBtn.addEventListener('click', loadNewJoke);
    elements.categorySelect.addEventListener('change', loadNewJoke);
}

async function loadNewJoke() {
    try {
        setLoadingState();
        hideError();
        const joke = await fetchJoke();
        await displayJoke(joke);
    } catch (error) {
        showError('Failed to fetch joke. Please try again later.');
    } finally {
        elements.fetchJokeBtn.disabled = false;
    }
}

async function fetchJoke() {
    const category = elements.categorySelect.value;
    const url = `https://v2.jokeapi.dev/joke/${category === 'Any' ? 'Any' : category}`;
    const response = await fetch(url);
    
    if (!response.ok) throw new Error('API request failed');
    return await response.json();
}

async function displayJoke(jokeData) {
    removeAnimations();
    await delay(50);
    updateJokeText(jokeData);
    addAnimations();
}

function updateJokeText(jokeData) {
    if (jokeData.type === 'single') {
        elements.jokeText.textContent = jokeData.joke;
        elements.jokeSetup.textContent = '';
    } else {
        elements.jokeText.textContent = jokeData.setup;
        elements.jokeSetup.textContent = jokeData.delivery;
    }
}

function setLoadingState() {
    elements.jokeText.textContent = 'Loading...';
    elements.jokeSetup.textContent = '';
    elements.fetchJokeBtn.disabled = true;
}

function showError(message) {
    elements.errorDisplay.textContent = message;
    elements.errorDisplay.classList.remove('d-none');
    elements.jokeText.textContent = 'Click the button to get a joke!';
    elements.jokeSetup.textContent = '';
}

function hideError() {
    elements.errorDisplay.classList.add('d-none');
}

function removeAnimations() {
    elements.jokeText.classList.remove('fade-in');
    elements.jokeSetup.classList.remove('fade-in');
}

function addAnimations() {
    elements.jokeText.classList.add('fade-in');
    elements.jokeSetup.classList.add('fade-in');
}

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}