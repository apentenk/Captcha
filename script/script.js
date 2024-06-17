const uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const lowercase = uppercase.toLowerCase();
const numeric = "23456789";
var responses;

window.onload = function () {
    generateResponses();
    generateCaptcha();

    //Event Listeners

    //TTS
    document.getElementById("tts").addEventListener('click', function () {
        const tts = new SpeechSynthesisUtterance(getCaptchaTTS());
        window.speechSynthesis.speak(tts);
    });

    //New Captcha
    document.getElementById("reset").addEventListener('click', function () {
        generateCaptcha();
    });

    //Submit
    document.getElementById("confirm").addEventListener('click', function () {
        submitCaptcha();
    });

    //Start over
    document.getElementById("restart").addEventListener('click', function () {
        this.style.display = "none";
        newCaptcha();
    });

    //Toggle Light and Dark Mode
    document.getElementById("view-mode").addEventListener('click', function () {
        toggleViewMode(this.classList.contains("dark"));
    });

    //End verification animation
    document.getElementById("display-img").addEventListener('animationend', function () {
        this.classList.remove("loading");
        verifyCaptcha();
    });
}

/**
 * Gets the responses to the completed captcha from a separate file "messages.json"
 */
function generateResponses() {
    let xhr = new XMLHttpRequest();
    xhr.overrideMimeType("application/json");
    xhr.open("GET", "messages.json", true);
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            responses = JSON.parse(xhr.responseText);
        }
    }
    xhr.send();
}

/**
 * Creates a captcha of 6 random alphanumeric characters
 * Does not include 0 or 1 as they look too similar to 1 and O
 */
function generateCaptcha() {
    for (let i = 0; i < 6; i++) {
        let container = document.getElementById("character"+i);
        let charset = randomExclusive(3);
        switch (charset) {
            case 0:
                createCaptchaCharacter(container, uppercase, "uppercase");
                break;
            case 1:
                createCaptchaCharacter(container, lowercase, "lowercase");
                break;
            default:
                createCaptchaCharacter(container, numeric, "numeric");
                break;
        }
    }
}

/**
 * Changes the text content of an HTML element to be a random character from a charset. Also sets the tts description in a data attribute
 * @param {HTMLElement} container The html element to hold the character
 * @param {string} charset A string of possible values for the character. The more a character appears the higher chance of being selected
 * @param {string} description A string describing whether the character will be uppercase, lowercase, or numeric
 */
function createCaptchaCharacter(container, charset, description) {
    let character = randomExclusive(charset.length);
    container.textContent = charset[character];
    container.dataset.tts = description;
}

/**
 * Gets the string value of the currently displayed captcha
 * @returns {string} The string value of the captcha
 */
function getCaptcha() {
    let captcha = "";
    for (let i = 0; i < 6; i++) {
        let span = document.getElementById("character"+i);
        captcha += span.textContent;
    }
    return captcha;
}

/**
 * Gets the string value of the currently displayed captcha with addtional descriptors of the characters indicating whether they are upper or lowercase
 * @returns {string} The string value of the captcha
 */
function getCaptchaTTS() {
    let captcha = "";
    for (let i = 0; i < 6; i++) {
        let span = document.getElementById("character"+i);
        if (span.dataset.tts !== "numeric") {
            captcha += span.dataset.tts + " "
        }
        captcha += span.textContent + ", ";
    }
    return captcha;
}

/**
 * Visually removes the captcha from the DOM and then displays a short loading animation
 */
function submitCaptcha() {
    let captcha = document.getElementById("captcha-box");
    captcha.style.display = "none";
    let imgBox = document.getElementById("img-box");
    imgBox.style.display = "block";
    let displayImg = document.getElementById("display-img");
    displayImg.src = "/img/loading.png";
    displayImg.classList.add("loading");
    let displayText = document.getElementById("display-text");
    displayText.textContent = "Verifying..."
}

/**
 * Display whether or not the user input matched the generated captcha as well as a random message from generated responses
 */
function verifyCaptcha() {
    let input = document.getElementById("captcha").value.replace(/\s/g, '');
    let captcha = getCaptcha();
    let displayImg = document.getElementById("display-img");
    let displayText = document.getElementById("display-text");
    let captchaMessage = document.getElementById("captcha-message");
    let restartButton = document.getElementById("restart");
    document.getElementById("default-message").style.display = "none";
    captchaMessage.style.display = "block";
    if (input === captcha) {
        displayImg.src = "/img/correct.png";
        displayText.innerText = "Correct!"
        captchaMessage.textContent = responses.correct[randomExclusive(6)]
        restartButton.textContent = "Verify Again"
    }
    else {
        displayImg.src = "/img/incorrect.png";
        displayText.innerText = "Incorrect!"
        captchaMessage.textContent = responses.incorrect[randomExclusive(6)]
        restartButton.textContent = "Try Again"
    }
    restartButton.style.display = "inline-block";
}

/**
 * Visually removes the submitted captcha response from the DOM and then displays a new captcha
 */
function newCaptcha() {
    let captcha = document.getElementById("captcha-box");
    captcha.style.display = "block";
    let imgBox = document.getElementById("img-box");
    imgBox.style.display = "none";
    document.getElementById("default-message").style.display = "block";
    document.getElementById("captcha-message").style.display = "none";
    document.getElementById("restart").style.display = "none";
    document.getElementById('captcha').value = '';
    generateCaptcha();
}

/**
 * Switches DOM between light and dark mode
 */
function toggleViewMode(dark) {
    let currentView = dark ? "dark" : "light";
    let newView = dark ? "light" : "dark";
    let newfill = dark ? "#202020" : "#D9D9D9";

    $("img." + currentView).each(function () {
        this.src = this.src.replace(currentView, newView);
    });

    $("text").attr("fill", newfill);
    $("." + currentView).addClass(newView);
    $("." + currentView).removeClass(currentView);
}

function randomExclusive(upperBound) {
    return Math.floor(Math.random() * upperBound);
}