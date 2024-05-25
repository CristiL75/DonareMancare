const request = require('supertest');
const express = require('express');
const path = require('path');

const app = express();

// Configurare pentru a folosi EJS
app.set('view engine', 'ejs');
const viewsPath = path.join(__dirname, '..', 'views');
app.set('views', viewsPath);
console.log('Views directory:', viewsPath); // Debugging

// Ruta pentru pagina autentificare
app.get('/autentificare', (req, res) => {
  res.render('autentificare', { token: 'someToken' });
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
  }, 10000); // A crescut timpul de timeout pentru acest test
});
