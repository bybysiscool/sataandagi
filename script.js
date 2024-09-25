const usernameInput = document.getElementById('username');
const profilePicInput = document.getElementById('profile-pic');
const setProfileButton = document.getElementById('set-profile');
const messageInput = document.getElementById('message-input');
const attachmentInput = document.getElementById('attachment-input');
const sendButton = document.getElementById('send-button');
const messagesDiv = document.getElementById('messages');
const messageSound = document.getElementById('message-sound');

let username = '';
let profilePicture = '';
let websocket;
const userColors = {}; // To store user colors
let uniqueColorIndex = 0;

// Load user data from local storage
window.onload = () => {
    username = localStorage.getItem('username') || '';
    profilePicture = localStorage.getItem('profilePicture') || '';
    usernameInput.value = username;
    if (profilePicture) {
        const img = document.createElement('img');
        img.src = profilePicture;
        img.className = 'profile-pic'; // Set circular class
        document.getElementById('profile-display').appendChild(img);
    }
};

// Function to establish WebSocket connection
function connectWebSocket() {
    websocket = new WebSocket('wss://retrotube.info/ws'); // Use your Cloudflare Tunnel URL

    websocket.onopen = () => {
        console.log('Connected to WebSocket server');
    };

    websocket.onmessage = (event) => {
        try {
            const message = JSON.parse(event.data);
            addMessageToChat(message, false);
            messageSound.play(); // Play message sound when a message is received
        } catch (error) {
            console.error('Error parsing message:', error);
        }
    };

    websocket.onerror = (error) => {
        console.error('WebSocket error:', error);
    };

    websocket.onclose = () => {
        console.log('WebSocket connection closed');
    };
}

// Connect to WebSocket on page load
connectWebSocket();

setProfileButton.addEventListener('click', () => {
    username = usernameInput.value.trim();
    const file = profilePicInput.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
            profilePicture = reader.result;
            localStorage.setItem('profilePicture', profilePicture);
            const img = document.createElement('img');
            img.src = profilePicture;
            img.className = 'profile-pic'; // Set circular class
            document.getElementById('profile-display').innerHTML = ''; // Clear previous image
            document.getElementById('profile-display').appendChild(img);
        };
        reader.readAsDataURL(file);
    }
    localStorage.setItem('username', username);

    // Assign a unique color to the user
    if (!userColors[username]) {
        uniqueColorIndex++;
        userColors[username] = `hsl(${uniqueColorIndex * 30}, 70%, 80%)`; // Generate a unique color
    }
});

sendButton.addEventListener('click', sendMessage);
messageInput.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
        sendMessage();
    }
});

function sendMessage() {
    const messageText = messageInput.value.trim();
    if (!messageText || !websocket || websocket.readyState !== WebSocket.OPEN) return;

    const message = {
        username: username,
        text: messageText,
        profilePicture: profilePicture,
        attachment: attachmentInput.files[0] ? attachmentInput.files[0].name : null // Keep only the file name
    };

    // Clear input fields after sending the message
    messageInput.value = ''; // Clear input field
    attachmentInput.value = ''; // Clear attachment input

    websocket.send(JSON.stringify(message));
    addMessageToChat(message, true); // Add the message to chat bubbles
    messageSound.play(); // Play message sound when a message is sent
}

function addMessageToChat(message, isSender) {
    const messageElement = document.createElement('div');
    messageElement.className = 'bubble ' + (isSender ? 'me' : 'other');
    messageElement.style.backgroundColor = userColors[message.username]; // Assign color based on username
    messageElement.innerHTML = `<strong>${message.username}</strong>: ${message.text}`;
    if (message.profilePicture) {
        const img = document.createElement('img');
        img.src = message.profilePicture;
        img.className = 'profile-pic'; // Set circular class
        messageElement.prepend(img);
    }
    messagesDiv.appendChild(messageElement);
    messagesDiv.scrollTop = messagesDiv.scrollHeight; // Scroll to the bottom
}
