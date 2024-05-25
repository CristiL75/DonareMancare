const request = require('supertest');
const express = require('express');
const path = require('path');

const app = express();

// Configurare pentru a folosi EJS
app.set('view engine', 'ejs');
const viewsPath = path.join(__dirname, '..', 'views');
app.set('views', viewsPath);
console.log('Views directory:', viewsPath); // Debugging

// Ruta pentru pagina acasaDonator
app.get('/acasaDonator', (req, res) => {
  const userType = req.query.userType || 'donator'; // Preia userType din query string
  res.render('acasaDonator', { userType, token: 'someToken' });
});

// Middleware de gestionare a erorilor
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

describe('GET /acasaDonator', () => {
  it('should render acasaDonator.ejs and return status 200 for donator', (done) => {
    request(app)
      .get('/acasaDonator?userType=donator')
      .expect('Content-Type', /html/)
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.text).toContain('Bun venit, donator!');
        done();
      });
  });

  it('should restrict access if userType is not donator', (done) => {
    request(app)
      .get('/acasaDonator?userType=beneficiar') // Setează userType la 'beneficiar'
      .expect('Content-Type', /html/)
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.text).toContain('Acces restricționat. Trebuie să fii donator pentru a accesa această pagină.');
        done();
      });
  });
});
