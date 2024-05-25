const request = require('supertest');
const express = require('express');
const path = require('path');

const app = express();

// Configurare pentru a folosi EJS
app.set('view engine', 'ejs');
const viewsPath = path.join(__dirname, '..', 'views');
app.set('views', viewsPath);
console.log('Views directory:', viewsPath); // Debugging

// Ruta pentru pagina acasaBeneficiar
app.get('/acasaBeneficiar', (req, res) => {
  const userType = req.query.userType || 'beneficiar'; // Preia userType din query string
  res.render('acasaBeneficiar', { userType, token: 'someToken' });
});

// Middleware de gestionare a erorilor
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

describe('GET /acasaBeneficiar', () => {
  it('should render acasaBeneficiar.ejs and return status 200', (done) => {
    request(app)
      .get('/acasaBeneficiar')
      .expect('Content-Type', /html/)
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.text).toContain('Bun venit, beneficiar!');
        done();
      });
  });

  it('should restrict access if userType is not beneficiar', (done) => {
    request(app)
      .get('/acasaBeneficiar?userType=donator') // Setează userType la 'donator'
      .expect('Content-Type', /html/)
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.text).toContain('Acces restricționat. Trebuie să fii beneficiar pentru a accesa această pagină.');
        done();
      });
  });
});
