const request = require('supertest');
const express = require('express');
const path = require('path');

const app = express();

// Configurare pentru a folosi EJS
app.set('view engine', 'ejs');
const viewsPath = path.join(__dirname, '..', 'views');
app.set('views', viewsPath);
console.log('Views directory:', viewsPath); // Debugging

// Middleware pentru a parsa corpul cererilor JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // Pentru a parsa datele URL-encoded

// Ruta pentru pagina autentificare
app.get('/autentificare', (req, res) => {
  res.render('autentificare', { token: 'someToken' });
});

// Ruta pentru procesarea autentificării
app.post('/autentificare', (req, res) => {
  const { email, password } = req.body;

  if (!email) {
    return res.status(400).send('Email is required');
  }

  if (!password) {
    return res.status(400).send('Password is required');
  }

  if (email === 'test@example.com' && password === 'password123') {
    return res.status(200).send('Login successful');
  } else {
    return res.status(401).send('Invalid credentials');
  }
});

// Middleware de gestionare a erorilor
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

describe('GET /autentificare', () => {
  it('should render autentificare.ejs and return status 200', (done) => {
    request(app)
      .get('/autentificare')
      .expect('Content-Type', /html/)
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.text).toContain('Autentificare');
        done();
      });
  });

  it('should display the email input field', (done) => {
    request(app)
      .get('/autentificare')
      .expect('Content-Type', /html/)
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.text).toContain('<input type="email" id="email" name="email" required>');
        done();
      });
  });

  it('should display the password input field', (done) => {
    request(app)
      .get('/autentificare')
      .expect('Content-Type', /html/)
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.text).toContain('<input type="password" id="password" name="password" required>');
        done();
      });
  });

  it('should display the submit button', (done) => {
    request(app)
      .get('/autentificare')
      .expect('Content-Type', /html/)
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.text).toContain('<button type="submit">Login</button>');
        done();
      });
  });

  it('should display the create account link', (done) => {
    request(app)
      .get('/autentificare')
      .expect('Content-Type', /html/)
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.text).toContain('<a href="./inregistrare">Create a new account</a>');
        done();
      });
  });
});

describe('POST /autentificare', () => {
  it('should login successfully with valid credentials', (done) => {
    request(app)
      .post('/autentificare')
      .send({ email: 'test@example.com', password: 'password123' })
      .expect(200)
      .expect('Login successful', done);
  });

  it('should return an error with invalid credentials', (done) => {
    request(app)
      .post('/autentificare')
      .send({ email: 'invalid@example.com', password: 'wrongpassword' })
      .expect(401)
      .expect('Invalid credentials', done);
  });

  it('should return an error when email is missing', (done) => {
    request(app)
      .post('/autentificare')
      .send({ password: 'password123' })
      .expect(400)
      .expect('Email is required', done);
  });

  it('should return an error when password is missing', (done) => {
    request(app)
      .post('/autentificare')
      .send({ email: 'test@example.com' })
      .expect(400)
      .expect('Password is required', done);
  });
});
