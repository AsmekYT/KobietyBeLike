
const odpowiedzi = {
    przywitanie: ["No hej.", "Czego chcesz?", "Aż tak ci się nudzi?", "No nareszcie.", "Znowu ty?", "Hejka"],
    pytaniaZamkniete: ["A jak myślisz?", "Może.", "Sam sobie odpowiedz na to pytanie.", "To chyba oczywiste.", "trudno zauważyć?", "i tak nie zapamiętasz", "ile jeszcze razy mam ci to przypominać?", "spytaj swojej drugiej laski"],
    pytaniaOtwarte: ["Domyśl się.", "Szkoda, że sam na to nie wpadłeś.", "Ty mi powiedz.", "Naprawdę nie wiesz?", "spytaj lasek z ig"],
    komplementy: ["Aha.", "Tylko tyle?", "Mhm.", "Ok.", "innym też to mówisz?", "dzięki I guess"],
    krotkieWiadomosci: ["...", "Serio?", "Super odpowiedź.", "k", "ok."],
    domyslne: ["Nic się nie stało.", "Nie, no co ty. Wszystko w porządku.", "Pogadamy później.", "Jak uważasz.", "Nie ważne.", "nie chce gadać"]
};


const chatBox = document.getElementById('chatBox');
const userInput = document.getElementById('userInput');
const chatForm = document.getElementById('chatForm');
const typingIndicator = document.getElementById('typingIndicator');
const startPopup = document.getElementById('start-popup');
let isFirstMessage = true;


let messageCount = 0;


chatForm.addEventListener('submit', (e) => {
    e.preventDefault();
    if (isFirstMessage) {
        startPopup.classList.add('hidden');
        isFirstMessage = false;
    }
    sendMessage();
});


function sendMessage() {
    const userText = userInput.value.trim();
    if (userText === "") return;

    addMessage(userText, 'user-message');
    userInput.value = "";
    messageCount++;

    showTypingIndicator();
    setTimeout(getBotResponse, 1500 + Math.random() * 1000);
}

function getBotResponse() {
    const userMessages = chatBox.getElementsByClassName('user-message');
    const lastUserText = userMessages[userMessages.length - 1].textContent.toLowerCase();

    let responseArray;

    const isGreeting = lastUserText.includes('hej') || lastUserText.includes('cześć') || lastUserText.includes('siema') || lastUserText.includes('witaj') || lastUserText.includes('hejka');

    if (messageCount === 1 && isGreeting) {
        responseArray = odpowiedzi.przywitanie;
    } else if (lastUserText.startsWith("czy")) {
        responseArray = odpowiedzi.pytaniaZamkniete;
    } else if (lastUserText.includes("co") || lastUserText.includes("gdzie") || lastUserText.includes("kiedy") || lastUserText.includes("dlaczego") || lastUserText.includes("jak")) {
        responseArray = odpowiedzi.pytaniaOtwarte;
    } else if (lastUserText.includes("ładnie") || lastUserText.includes("kocham") || lastUserText.includes("super") || lastUserText.includes("świetnie")) {
        responseArray = odpowiedzi.komplementy;
    } else if (lastUserText.length < 5) {
        responseArray = odpowiedzi.krotkieWiadomosci;
    } else {
        responseArray = odpowiedzi.domyslne;
    }

    const botResponse = responseArray[Math.floor(Math.random() * responseArray.length)];

    hideTypingIndicator();
    addMessage(botResponse, 'bot-message');
}

function addMessage(text, type) {
    const messageWrapper = document.createElement('div');
    messageWrapper.className = 'message-wrapper';

    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}`;
    messageDiv.textContent = text;

    messageWrapper.appendChild(messageDiv);
    chatBox.appendChild(messageWrapper);


    chatBox.scrollTop = chatBox.scrollHeight;
}

function showTypingIndicator() {
    typingIndicator.style.display = 'flex';
    chatBox.scrollTop = chatBox.scrollHeight;
}

function hideTypingIndicator() {
    typingIndicator.style.display = 'none';
}

/*
window.onload = () => {
    addMessage('Czekam...', 'bot-message');
}
 */

function parseJwt(token) {
    try {
        return JSON.parse(atob(token.split('.')[1]));
    } catch (e) {
        return null;
    }
}

function checkLoginStatus() {
    const token = localStorage.getItem('authToken');
    const authButtons = document.querySelector('.auth-buttons');
    const userMenu = document.querySelector('.user-menu');

    if (token) {
        const userData = parseJwt(token);
        if (userData && userData.name) {
            authButtons.style.display = 'none';
            userMenu.style.display = 'flex';

            const userNameSpan = document.getElementById('userName');
            userNameSpan.textContent = userData.name;

            const dropdown = userMenu.querySelector('.dropdown-content');
            const logoutLink = document.createElement('a');
            logoutLink.href = '#';
            logoutLink.textContent = 'Wyloguj';
            //logoutLink.style.color = '#d93025';
            logoutLink.id = 'logout-btn';
            logoutLink.onclick = (e) => {
                e.preventDefault();
                localStorage.removeItem('authToken');
                window.location.reload();
            };
            dropdown.appendChild(logoutLink);
        }
    } else {
        authButtons.style.display = 'flex';
        userMenu.style.display = 'none';
    }
}

window.addEventListener('DOMContentLoaded', checkLoginStatus);