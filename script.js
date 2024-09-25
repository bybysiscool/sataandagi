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

// Load user data from local storage
window.onload = () => {
    username = localStorage.getItem('username') || '';
    profilePicture = localStorage.getItem('profilePicture') || '';
    usernameInput.value = username;
    if (profilePicture) {
        const img = document.createElement('img');
        img.src = profilePicture;
        img.style.width = '50px';
        document.getElementById('profile-display').appendChild(img);
    }
};

// Function to establish WebSocket connection
function connectWebSocket() {
    websocket = new WebSocket('wss://yourdomain.com'); // Use your Cloudflare Tunnel URL

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
            img.style.width = '50px';
            document.getElementById('profile-display').innerHTML = ''; // Clear previous image
            document.getElementById('profile-display').appendChild(img);
        };
        reader.readAsDataURL(file);
    }
    localStorage.setItem('username', username);
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

    websocket.send(JSON.stringify(message));
    addMessageToChat(message, true); // Add the message to chat bubbles
    messageSound.play(); // Play message sound when a message is sent
    messageInput.value = '';
    attachmentInput.value = '';
}

function addMessageToChat(message, isSender) {
    const messageElement = document.createElement('div');
    messageElement.className = 'bubble ' + (isSender ? 'me' : 'other');
    messageElement.innerHTML = `<strong>${message.username}</strong>: ${message.text}`;
    if (message.profilePicture) {
        const img = document.createElement('img');
        img.src = message.profilePicture;
        img.style.width = '30px';
        messageElement.prepend(img);
    }
    messagesDiv.appendChild(messageElement);
    messagesDiv.scrollTop = messagesDiv.scrollHeight; // Scroll to the bottom
}
