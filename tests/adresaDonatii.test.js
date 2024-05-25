const request = require('supertest');
const express = require('express');
const path = require('path');

const app = express();

// Configurare pentru a folosi EJS
app.set('view engine', 'ejs');
const viewsPath = path.join(__dirname, '..', 'views');
app.set('views', viewsPath);
console.log('Views directory:', viewsPath); // Debugging

// Ruta pentru pagina adresaDonatii
app.get('/adresaDonatii', (req, res) => {
  res.render('adresaDonatii', { token: 'someToken' });
});

// Middleware de gestionare a erorilor
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

describe('GET /adresaDonatii', () => {
  it('should render adresaDonatii.ejs and return status 200', (done) => {
    request(app)
      .get('/adresaDonatii')
      .expect('Content-Type', /html/)
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.text).toContain('Adresa de Primire a Donațiilor');
        done();
      });
  });

  it('should display the map', (done) => {
    request(app)
      .get('/adresaDonatii')
      .expect('Content-Type', /html/)
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.text).toContain('<div id="map"></div>');
        done();
      });
  });

  it('should display the address input field', (done) => {
    request(app)
      .get('/adresaDonatii')
      .expect('Content-Type', /html/)
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.text).toContain('<input type="text" id="addressInput" placeholder="Introduceți adresa de primire a donațiilor">');
        done();
      });
  });

  it('should display the food input field', (done) => {
    request(app)
      .get('/adresaDonatii')
      .expect('Content-Type', /html/)
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.text).toContain('<input type = "text" id = "foodInput" placeholder = "Introduceti alimentelul de care aveti nevoie">');
        done();
      });
  }, 10000); // A crescut timpul de timeout pentru acest test
});
