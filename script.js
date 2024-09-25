const usernameInput = document.getElementById('username');
const profilePicInput = document.getElementById('profile-pic');
const setProfileButton = document.getElementById('set-profile');
const messageInput = document.getElementById('message-input');
const attachmentInput = document.getElementById('attachment-input');
const sendButton = document.getElementById('send-button');
const messagesDiv = document.getElementById('messages');
const sendSound = document.getElementById('send-sound');
const receiveSound = document.getElementById('receive-sound');

let username = '';
let profilePicture = '';

// Load user data from local storage
window.onload = () => {
    username = localStorage.getItem('username') || '';
    profilePicture = localStorage.getItem('profilePicture') || '';
    usernameInput.value = username;
    // Display profile picture if exists
    if (profilePicture) {
        const img = document.createElement('img');
        img.src = profilePicture;
        img.style.width = '50px';
        document.querySelector('.header').appendChild(img);
    }
};

setProfileButton.addEventListener('click', () => {
    username = usernameInput.value;
    const file = profilePicInput.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
            profilePicture = reader.result;
            localStorage.setItem('profilePicture', profilePicture);
            const img = document.createElement('img');
            img.src = profilePicture;
            img.style.width = '50px';
            document.querySelector('.header').appendChild(img);
        };
        reader.readAsDataURL(file);
    }
    localStorage.setItem('username', username);
});

sendButton.addEventListener('click', () => {
    const messageText = messageInput.value;
    if (!messageText) return;
    
    const message = {
        username: username,
        text: messageText,
        profilePicture: profilePicture,
        attachment: attachmentInput.files[0]
    };

    sendSound.play();
    // Here you would send the message to the server via WebSocket
    // Example: websocket.send(JSON.stringify(message));

    // Add message to the message div
    addMessageToChat(message);
    messageInput.value = '';
    attachmentInput.value = '';
});

// Add a function to display received messages
function addMessageToChat(message) {
    const messageElement = document.createElement('div');
    messageElement.innerHTML = `<strong>${message.username}</strong>: ${message.text}`;
    if (message.profilePicture) {
        const img = document.createElement('img');
        img.src = message.profilePicture;
        img.style.width = '30px';
        messageElement.prepend(img);
    }
    messagesDiv.appendChild(messageElement);
    receiveSound.play();
}
