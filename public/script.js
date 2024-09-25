document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    const response = await fetch('wss://retrotube.info/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
    });

    const data = await response.json();
    if (response.ok) {
        alert('Login successful!'); // Redirect to dashboard
        window.location.href = 'dashboard.html'; 
    } else {
        alert(data.error);
    }
});

document.getElementById('registerForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const email = document.getElementById('email').value;

    const response = await fetch('wss://retrotube.info/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password, email })
    });

    const data = await response.json();
    if (response.ok) {
        alert('Registration successful!'); // Redirect to login
        window.location.href = 'login.html'; 
    } else {
        alert(data.error);
    }
});
