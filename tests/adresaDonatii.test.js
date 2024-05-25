const request = require('supertest');
const express = require('express');
const path = require('path');

const app = express();

// Configurare pentru a folosi EJS
app.set('view engine', 'ejs');
const viewsPath = path.join(__dirname, '..', 'views');
app.set('views', viewsPath);
console.log('Views directory:', viewsPath); // Debugging

// Middleware pentru a parsa JSON
app.use(express.json());

let mockAddressList = ['Strada Test 1', 'Strada Test 2'];
let mockFoodList = ['Apă', 'Pâine'];

app.post('/salvareAdrese', (req, res) => {
  mockAddressList = req.body.addresses;
  res.status(200).json({ message: 'Adresele au fost trimise cu succes!' });
});

app.post('/salvareAlimente', (req, res) => {
  mockFoodList = req.body.foods;
  res.status(200).json({ message: 'Alimentele au fost trimise cu succes!' });
});

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

describe('POST /salvareAdrese', () => {
  it('should save address list', (done) => {
    const addresses = ['Strada Noua 1', 'Strada Noua 2'];
    request(app)
      .post('/salvareAdrese')
      .send({ addresses })
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body).toHaveProperty('message', 'Adresele au fost trimise cu succes!');
        expect(mockAddressList).toEqual(addresses);
        done();
      });
  });
});

describe('POST /salvareAlimente', () => {
  it('should save food list', (done) => {
    const foods = ['Mere', 'Pere'];
    request(app)
      .post('/salvareAlimente')
      .send({ foods })
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body).toHaveProperty('message', 'Alimentele au fost trimise cu succes!');
        expect(mockFoodList).toEqual(foods);
        done();
      });
  });
});
