const request = require('supertest');
const express = require('express');
const path = require('path');

const app = express();

// Configurare pentru a folosi EJS
app.set('view engine', 'ejs');
const viewsPath = path.join(__dirname, '..', 'views');
app.set('views', viewsPath);
console.log('Views directory:', viewsPath); // Debugging

// Ruta pentru pagina inregistrare
app.get('/inregistrare', (req, res) => {
  res.render('inregistrare', { token: 'someToken' });
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
  }, 10000); // A crescut timpul de timeout pentru acest test
});
