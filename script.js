const websocket = new WebSocket('ws://localhost:8080'); // Update with your WebSocket server URL
const messageInput = document.getElementById('message-input');
const attachmentInput = document.getElementById('attachment-input');
const sendButton = document.getElementById('send-button');
const chatBox = document.getElementById('chat-box');
const messageSound = document.getElementById('message-sound');

let username = prompt("Enter your name:");
let profilePicture = prompt("Enter your profile picture URL:");

function addMessageToChat(message, isSent) {
    const messageBubble = document.createElement('div');
    messageBubble.classList.add('message-bubble', isSent ? 'sent' : 'received');
    
    const profilePic = document.createElement('img');
    profilePic.src = message.profilePicture;
    profilePic.classList.add('profile-pic');
    
    const messageContent = document.createElement('span');
    messageContent.textContent = `${message.username}: ${message.text}`;
    
    if (message.attachment) {
        const attachmentLink = document.createElement('a');
        attachmentLink.href = message.attachment;
        attachmentLink.textContent = ' (Attachment)';
        attachmentLink.target = '_blank'; // Open in a new tab
        messageContent.appendChild(attachmentLink);
    }

    messageBubble.appendChild(profilePic);
    messageBubble.appendChild(messageContent);
    chatBox.appendChild(messageBubble);
    chatBox.scrollTop = chatBox.scrollHeight; // Scroll to the bottom
}

function sendMessage() {
    const messageText = messageInput.value.trim();
    if (!messageText || !websocket || websocket.readyState !== WebSocket.OPEN) return;

    const attachmentFile = attachmentInput.files[0];
    const attachment = attachmentFile ? attachmentFile.name : null; // Send only the file name

    const message = {
        username: username,
        text: messageText,
        profilePicture: profilePicture,
        attachment: attachment
    };

    // Clear input fields after sending the message
    messageInput.value = ''; // Clear input field
    attachmentInput.value = ''; // Clear attachment input

    websocket.send(JSON.stringify(message)); // Send message as a JSON string
    addMessageToChat(message, true); // Add the message to chat bubbles
    messageSound.play(); // Play message sound when a message is sent
}

sendButton.addEventListener('click', sendMessage);
messageInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        sendMessage();
    }
});

websocket.onmessage = (event) => {
    const message = JSON.parse(event.data);
    addMessageToChat(message, false); // Add received message to chat
};

websocket.onerror = (error) => {
    console.error('WebSocket error:', error);
};
