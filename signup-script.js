const signupForm = document.getElementById('signup');

signupForm.addEventListener('submit', function(event) {
    event.preventDefault();
    
    const email = signupForm.email.value;
    const username = signupForm.username.value;
    const password = signupForm.password.value;
    const occupation = signupForm.occupation.value;

    registerUser(email, username, password, occupation);
});

async function registerUser(email, username, password, occupation) {
    const userData = {
        email: email,
        username: username,
        password: password,
        occupation: occupation
    };

    try {
        const response = await fetch('/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userData)
        });

        if (!response.ok) {
            throw new Error('Eroare la înregistrare: ' + response.statusText);
        }

        console.log('Utilizator înregistrat cu succes!');
    } catch (error) {
        console.error('Eroare la înregistrare:', error);
    }
}
