const request = require('supertest');
const express = require('express');
const path = require('path');

const app = express();

// Configurare pentru a folosi EJS
app.set('view engine', 'ejs');
const viewsPath = path.join(__dirname, '..', 'views');
app.set('views', viewsPath);
console.log('Views directory:', viewsPath); // Debugging

app.use(express.json());

// Mock data for testing
const mockCollectionPoints = [
  { address: 'Strada A, Nr. 1', lat: 45.755, lng: 21.23 },
  { address: 'Strada B, Nr. 2', lat: 45.756, lng: 21.24 },
];

const mockNeededFoods = [
  { food: 'Apă' },
  { food: 'Pâine' },
];

// Routes for mock data
app.get('/getCollectionPoints', (req, res) => {
  res.json(mockCollectionPoints);
});

app.get('/getNeededFoods', (req, res) => {
  res.json(mockNeededFoods);
});

app.post('/sendSuggestion', (req, res) => {
  if (!req.body.suggestion) {
    return res.status(400).json({ error: 'Suggestion is required' });
  }
  res.status(200).json({ message: 'Suggestion sent successfully' });
});

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

  it('should display map container for collection points', (done) => {
    request(app)
      .get('/acasaDonator?userType=donator')
      .expect('Content-Type', /html/)
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.text).toContain('<div id="map"></div>');
        done();
      });
  });

  it('should display needed foods list container', (done) => {
    request(app)
      .get('/acasaDonator?userType=donator')
      .expect('Content-Type', /html/)
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.text).toContain('<ul id="neededFoods" class="food-list"></ul>');
        done();
      });
  });
});

describe('POST /sendSuggestion', () => {
  it('should send suggestion successfully', async () => {
    const response = await request(app)
      .post('/sendSuggestion')
      .send({ suggestion: 'Orez' })
      .expect(200);
    expect(response.body).toHaveProperty('message', 'Suggestion sent successfully');
  });

  it('should return error if suggestion is missing', async () => {
    const response = await request(app)
      .post('/sendSuggestion')
      .send({})
      .expect(400);
    expect(response.body).toHaveProperty('error', 'Suggestion is required');
  });
});
