/*
Makes backend API call to rasa chatbot and display output to chatbot frontend
*/

function init() {
    //---------------------------- Including Jquery ------------------------------
    var script = document.createElement('script');
    script.src = 'https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js';
    script.type = 'text/javascript';
    document.getElementsByTagName('head')[0].appendChild(script);

    //--------------------------- Important Variables----------------------------
    botLogoPath = "/static/Images/bot-logo.png";
    var inactiveMessage = "Server is down, Please contact the developer to activate it";
    var host = "http://127.0.0.1:5000";

    //--------------------------- Chatbot Frontend -------------------------------
    const chatContainer = document.getElementById("chat-container");

    const template = `
    <button class='chat-btn'>
        <img src="/static/Images/icons/comment.gif" class='icon' style='width: 90px; height: 80px; position: fixed; right:3rem; bottom:2rem;'>
    </button>

    <div class='chat-popup'>
        <div class='chat-header'>
            <div class='chatbot-img'>
                <img src='${botLogoPath}' alt='Chat Bot image' class='bot-img'>
            </div>
            <h3 class='bot-title'>Sample Bot</h3>

            <div class="dropdown">
                <select id="languageDropdown">
                    <!-- Language options will be populated by JavaScript -->
                </select>
            </div>
            <button class="expand-chat-window">
                <img src="/static/Images/icons/open_fullscreen.png" class="icon">
            </button>
        </div>

        <div class='chat-area'>
            <div class='bot-msg'>
                <img class='bot-img' src='${botLogoPath}' />
                <span class='msg'>Hi, How can I help you?</span>
            </div>
            <span class='time'>${getCurrentTime()}</span>
            <div id="chat-output"></div>
        </div>

        <div class='alert-message' style='color: red; font-size: small; margin-left: 20px; display: none;'>
            Please wait for stream to end before messaging.
        </div>
        <div class='chat-input-area'>
            <input type='text' autofocus class='chat-input' onkeypress='return givenUserInput(event)' placeholder='Type a message ...' autocomplete='off'>
            <button class='chat-submit'><i class='material-icons'>send</i></button>
        </div>
    </div>`;

    chatContainer.innerHTML = template;

    // Initialize chatbot elements
    chatPopup = document.querySelector(".chat-popup");
    chatBtn = document.querySelector(".chat-btn");
    chatSubmit = document.querySelector(".chat-submit");
    chatHeader = document.querySelector(".chat-header");
    chatArea = document.querySelector(".chat-area");
    chatInput = document.querySelector(".chat-input");
    expandWindow = document.querySelector(".expand-chat-window");
    alertMessageArea = document.querySelector('.alert-message');
    root = document.documentElement;
    chatPopup.style.display = "none";

    //------------------------ ChatBot Toggler -------------------------
    chatBtn.addEventListener("click", (e) => {
        const mobileDevice = !detectMob();
        if (chatPopup.style.display === "none" && mobileDevice) {
            chatPopup.style.display = "flex";
            chatInput.focus();
            chatBtn.innerHTML = `<img src="/static/Images/icons/close.gif" class="icon" style="width: 40px; height: 40px; position: fixed; right:5rem; bottom:3rem;">`;
        } else if (mobileDevice) {
            chatPopup.style.display = "none";
            chatBtn.innerHTML = `<img src="/static/Images/icons/comment.gif" class="icon" style="width: 90px; height: 80px; position: fixed; right:3rem; bottom:2rem;">`;
        } else {
            mobileView();
        }
        e.preventDefault();
    });

    chatSubmit.addEventListener("click", (e) => {
        handleUserInput();
        e.preventDefault();
    });

    expandWindow.addEventListener("click", (e) => {
        if (expandWindow.innerHTML.includes('open_fullscreen.png')) {
            expandWindow.innerHTML = `<img src="/static/Images/icons/close_fullscreen.png" class="icon">`;
            root.style.setProperty('--chat-window-height', '80%');
            root.style.setProperty('--chat-window-total-width', '85%');
        } else {
            expandWindow.innerHTML = `<img src="/static/Images/icons/open_fullscreen.png" class="icon">`;
            root.style.setProperty('--chat-window-height', '500px');
            root.style.setProperty('--chat-window-total-width', '380px');
        }
        e.preventDefault();
    });

    // Initialize language dropdown
    populateDropdown();
}

// Helper functions
function getCurrentTime() {
    const now = new Date();
    let hours = now.getHours();
    let ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12;
    const minutes = now.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes} ${ampm}`;
}

function detectMob() {
    return (window.innerHeight <= 800) && (window.innerWidth <= 600);
}

function mobileView() {
    document.querySelector('.chat-popup').style.width = `${window.innerWidth}px`;
    if (chatPopup.style.display === "none") {
        chatPopup.style.display = "flex";
        chatBtn.style.display = "none";
        chatPopup.style.bottom = "0";
        chatPopup.style.right = "0";
        expandWindow.innerHTML = `<img src="/static/Images/icons/close.png" class="icon">`;
    }
}

function scrollToBottomOfResults() {
    chatArea.scrollTop = chatArea.scrollHeight;
}

function setUserResponse() {
    const userInput = chatInput.value.trim();
    if (userInput) {
        const temp = `<div class="user-msg"><span class="msg">${userInput}</span></div>`;
        chatArea.innerHTML += temp;
        chatInput.value = "";
        scrollToBottomOfResults();
    }
}

function handleUserInput() {
    if (isStreamingOn) {
        alertMessageArea.style.display = 'block';
        return;
    }

    alertMessageArea.style.display = 'none';
    const userResponse = chatInput.value.trim();
    if (userResponse !== "") {
        setUserResponse();
        send(userResponse);
    }
}

function givenUserInput(e) {
    if (e.keyCode === 13) {
        e.preventDefault();
        handleUserInput();
    }
    return true;
}

// Language dropdown functions
const languages = [
    { code: "en", name: "English" },
    { code: "bn", name: "Bengali (বাংলা)" },
    { code: "gu", name: "Gujarati (ગુજરાતી)" },
    { code: "hi", name: "Hindi (हिन्दी)" },
    { code: "kn", name: "Kannada (ಕನ್ನಡ)" },
    { code: "ml", name: "Malayalam (മലയാളം)" },
    { code: "mr", name: "Marathi (मराठी)" },
    { code: "ne", name: "Nepali (नेपाली)" },
    { code: "or", name: "Odia (ଓଡ଼ିଆ)" },
    { code: "pa", name: "Punjabi (ਪੰਜਾਬੀ)" },
    { code: "si", name: "Sinhala (සිංහල)" },
    { code: "ta", name: "Tamil (தமிழ்)" },
    { code: "te", name: "Telugu (తెలుగు)" },
    { code: "ur", name: "Urdu (اردو)" },
    { code: "de", name: "German (Deutsch)" },
    { code: "fr", name: "French (Français)" }
];

function populateDropdown() {
    const dropdown = document.getElementById("languageDropdown");
    dropdown.innerHTML = languages.map(lang =>
        `<option value="${lang.code}">${lang.name}</option>`
    ).join('');
}

// Chat streaming functionality
let isStreamingOn = false;
let responseData = '';
async function getStream(query) {
    try {
        const response = await fetch(`${host}/chat?query=${encodeURIComponent(query)}`);

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const reader = response.body.getReader();
        isStreamingOn = true;
        let botresno = document.querySelectorAll('.bot-msg').length;
        let fullText = '';
        let wordBuffer = '';
        let lastYieldTime = Date.now();

        // Create new message container
        const botResponse = `
            <div class='bot-msg'>
                <img class='bot-img' src='${botLogoPath}' />
                <span class='msg' id='msg${botresno}'></span>
            </div>
            <span class='time'>${getCurrentTime()}</span>
        `;
        $(botResponse).appendTo('.chat-area').hide().fadeIn(1000);

        const chatOutput = document.getElementById(`msg${botresno}`);
        const wordDelay = 50; // milliseconds between words
        const chunkSize = 5; // words to buffer before displaying

        while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            const textChunk = new TextDecoder().decode(value);
            fullText += textChunk;

            // Process words one by one
            const words = fullText.split(/(\s+)/); // Split including whitespace
            fullText = words.pop(); // Keep remaining partial word

            for (const word of words) {
                wordBuffer += word;

                // Display in chunks for smoother performance
                if (word.trim().length > 0 ||
                    Date.now() - lastYieldTime > wordDelay * chunkSize) {

                    if (chatOutput) {
                        chatOutput.innerHTML += wordBuffer;
                        wordBuffer = '';
                        lastYieldTime = Date.now();
                        scrollToBottomOfResults();
                    }

                    await new Promise(resolve => setTimeout(resolve, wordDelay));
                }
            }
        }

        // Display remaining buffer
        if (wordBuffer && chatOutput) {
            chatOutput.innerHTML += wordBuffer;
            scrollToBottomOfResults();
        }

    } catch (error) {
        console.error('Error in getStream():', error);
        // Show error message to user
        if (chatOutput) {
            chatOutput.innerHTML += `<span class="error">Sorry, there was an error. Please try again.</span>`;
            scrollToBottomOfResults();
        }
    } finally {
        isStreamingOn = false;
        alertMessageArea.style.display = 'none';
    }
}
function send(message) {
    const selectedLanguage = document.getElementById("languageDropdown").value;
    const currentDateTime = new Date().toLocaleString();
    getStream(`${message} (Response in ${selectedLanguage} on ${currentDateTime})`);
}

function createChatBot(hostURL, botLogo, title, welcomeMessage, inactiveMsg, theme = "blue") {
    host = hostURL || "http://127.0.0.1:5000";
    botLogoPath = botLogo || "/static/Images/bot-logo.png";
    inactiveMessage = inactiveMsg || "Server is down, Please contact the developer to activate it";

    init();

    const msg = document.querySelector(".msg");
    if (msg) msg.innerText = welcomeMessage || "Hi, How can I help you?";

    const botTitle = document.querySelector(".bot-title");
    if (botTitle) botTitle.innerText = title || "Shivadya";
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    createChatBot();
});