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

// Ruta pentru pagina inregistrare
app.get('/inregistrare', (req, res) => {
  res.render('inregistrare', { token: 'someToken' });
});

// Ruta pentru procesarea înregistrării
app.post('/inregistrare', (req, res) => {
  const { email, username, password, userType } = req.body;

  if (!email) {
    return res.status(400).send('Email is required');
  }

  if (!username) {
    return res.status(400).send('Username is required');
  }

  if (!password) {
    return res.status(400).send('Password is required');
  }

  if (!userType) {
    return res.status(400).send('User type is required');
  }

  return res.status(200).send('Registration successful');
});

// Middleware de gestionare a erorilor
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

describe('GET /inregistrare', () => {
  it('should render inregistrare.ejs and return status 200', (done) => {
    request(app)
      .get('/inregistrare')
      .expect('Content-Type', /html/)
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.text).toContain('Inregistrare');
        done();
      });
  });

  it('should display the email input field', (done) => {
    request(app)
      .get('/inregistrare')
      .expect('Content-Type', /html/)
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.text).toContain('<input type="email" id="email" name="email" required>');
        done();
      });
  });

  it('should display the username input field', (done) => {
    request(app)
      .get('/inregistrare')
      .expect('Content-Type', /html/)
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.text).toContain('<input type="text" id="username" name="username" required>');
        done();
      });
  });

  it('should display the password input field', (done) => {
    request(app)
      .get('/inregistrare')
      .expect('Content-Type', /html/)
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.text).toContain('<input type="password" id="password" name="password" required>');
        done();
      });
  });

  it('should display the user type select field', (done) => {
    request(app)
      .get('/inregistrare')
      .expect('Content-Type', /html/)
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.text).toContain('<select id="userType" name="userType" required>');
        expect(res.text).toContain('<option value="donator">Donator</option>');
        expect(res.text).toContain('<option value="beneficiar">Beneficiar</option>');
        done();
      });
  });

  it('should display the submit button', (done) => {
    request(app)
      .get('/inregistrare')
      .expect('Content-Type', /html/)
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.text).toContain('<button type="submit">Inregistrare</button>');
        done();
      });
  });

  it('should display the password strength indicator', (done) => {
    request(app)
      .get('/inregistrare')
      .expect('Content-Type', /html/)
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.text).toContain('<div id="password-strength" class="password-strength"></div>');
        done();
      });
  });
});

describe('POST /inregistrare', () => {
  it('should register successfully with valid data', (done) => {
    request(app)
      .post('/inregistrare')
      .send({ email: 'test@example.com', username: 'testuser', password: 'Password123!', userType: 'donator' })
      .expect(200)
      .expect('Registration successful', done);
  });

  it('should return an error when email is missing', (done) => {
    request(app)
      .post('/inregistrare')
      .send({ username: 'testuser', password: 'Password123!', userType: 'donator' })
      .expect(400)
      .expect('Email is required', done);
  });

  it('should return an error when username is missing', (done) => {
    request(app)
      .post('/inregistrare')
      .send({ email: 'test@example.com', password: 'Password123!', userType: 'donator' })
      .expect(400)
      .expect('Username is required', done);
  });

  it('should return an error when password is missing', (done) => {
    request(app)
      .post('/inregistrare')
      .send({ email: 'test@example.com', username: 'testuser', userType: 'donator' })
      .expect(400)
      .expect('Password is required', done);
  });

  it('should return an error when user type is missing', (done) => {
    request(app)
      .post('/inregistrare')
      .send({ email: 'test@example.com', username: 'testuser', password: 'Password123!' })
      .expect(400)
      .expect('User type is required', done);
  });
});
