const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890";
const colors = ["darkviolet", "tomato", "seagreen", "royalblue", "darkgoldenrod", "saddlebrown"];
const fonts = ["shadows", "creepster", "silkscreen", "rubik", "bangers", "elite"];

window.onload = function(){
    let captcha = generateCaptcha();
    document.getElementById("tts").addEventListener('click', function(){
        console.log(specifyCaseTTS(captcha));
        const tts = new SpeechSynthesisUtterance(specifyCaseTTS(captcha));
        window.speechSynthesis.speak(tts);
    });
}

function generateCaptcha(){
    let captcha = "";
    let generated = document.getElementById("generated");
    let randomColors = randomizeSet(colors);
    let randomFonts = randomizeSet(fonts);
    
    for(let i = 0; i<6; i++){
        let random = Math.floor(Math.random() * charset.length);
        captcha += (charset[random]);
        let span = document.createElement("span");
        span.innerHTML = charset[random];
        span.style.color = randomColors[i];
        span.classList.add(randomFonts[i]);
        generated.appendChild(span);
    }

    return captcha;
}

function specifyCaseTTS(captcha){
    let detailCaptcha = "";
    for(let i = 0; i<captcha.length; i++){
        let char = captcha.charAt(i);
        if (/[A-Z]/.test(char)){
            detailCaptcha += ", capital " + char;
        }
        else if (/[a-z]/.test(char)){
            detailCaptcha += ", lowercase " + char;
        }
        else{
            detailCaptcha += ", " + char;
        }
    }
    return detailCaptcha.substring(2);
}

function randomizeSet(set){
    let current = set.length;
    
    while (current != 0){
        let random = Math.floor(Math.random() * current);
        current--;
        let temp = set[current];
        set[current] = set[random];
        set[random] = temp;
    }

    return set;
}