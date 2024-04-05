const loginForm = document.getElementById('login-form');

loginForm.addEventListener('submit', function(event) {
    event.preventDefault(); // Aici este corectat event.preventDefault(), nu event.prevendDefault()

    const email = loginForm.email.value;
    const password = loginForm.password.value;

    console.log('Email:', email); // Aici este corectat console.log('Email', email), cu virgulă și nu cu punct și virgulă
    console.log('Parola:', password); // Aici este corectat console.log('Parola', password), cu virgulă și nu cu punct și virgulă
});
