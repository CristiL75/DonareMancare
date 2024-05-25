const request = require('supertest');
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const { LocalStorage } = require('node-localstorage');

// Configurare pentru a folosi EJS
const app = express();
app.use(bodyParser.json()); // Middleware pentru a parsa JSON în request body
app.set('view engine', 'ejs');
const viewsPath = path.join(__dirname, '..', 'views');
app.set('views', viewsPath);
console.log('Views directory:', viewsPath); // Debugging

// Configurare localStorage
global.localStorage = new LocalStorage('./scratch');

// Rute pentru pagini
app.get('/acasaBeneficiar', (req, res) => {
  const userType = req.query.userType || 'beneficiar'; // Preia userType din query string
  if (userType !== 'beneficiar') {
    return res.send('Acces restricționat. Trebuie să fii beneficiar pentru a accesa această pagină.');
  }
  res.render('acasaBeneficiar', { userType, token: 'someToken' });
});

// Endpoint-uri pentru testare
app.post('/addAddress', (req, res) => {
  if (!req.body.address) {
    return res.status(400).json({ error: 'Address is required' });
  }

  let addressList = JSON.parse(localStorage.getItem('addressList')) || [];
  addressList.push(req.body);
  localStorage.setItem('addressList', JSON.stringify(addressList));
  res.status(200).json({ address: req.body.address });
});

app.post('/addFood', (req, res) => {
  if (!req.body.food) {
    return res.status(400).json({ error: 'Food is required' });
  }

  let foodList = JSON.parse(localStorage.getItem('foodList')) || [];
  foodList.push(req.body.food);
  localStorage.setItem('foodList', JSON.stringify(foodList));
  res.status(200).json({ food: req.body.food });
});

app.delete('/removeAddress', (req, res) => {
  if (!req.body.address) {
    return res.status(400).json({ error: 'Address is required' });
  }

  let addressList = JSON.parse(localStorage.getItem('addressList')) || [];
  addressList = addressList.filter(addr => addr.address !== req.body.address);
  localStorage.setItem('addressList', JSON.stringify(addressList));
  res.status(200).json({ message: 'Address removed successfully' });
});

app.delete('/removeFood', (req, res) => {
  if (!req.body.food) {
    return res.status(400).json({ error: 'Food is required' });
  }

  let foodList = JSON.parse(localStorage.getItem('foodList')) || [];
  foodList = foodList.filter(food => food !== req.body.food);
  localStorage.setItem('foodList', JSON.stringify(foodList));
  res.status(200).json({ message: 'Food item removed successfully' });
});

// Middleware de gestionare a erorilor
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

describe('GET /acasaBeneficiar', () => {
  beforeAll(() => {
    // Configurare inițială pentru localStorage
    localStorage.setItem('addressList', JSON.stringify([{ address: 'Test Address', latlng: { lat: 45.7489, lng: 21.2087 }, username: 'beneficiar' }]));
    localStorage.setItem('foodList', JSON.stringify(['Test Food']));
  });

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
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.text).toContain('Acces restricționat. Trebuie să fii beneficiar pentru a accesa această pagină.');
        done();
      });
  });

  it('should display the address input field', (done) => {
    request(app)
      .get('/acasaBeneficiar')
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.text).toContain('<input type="text" id="addressInput" placeholder="Introduceți adresa de primire a donațiilor">');
        done();
      });
  });

  it('should display the food input field', (done) => {
    request(app)
      .get('/acasaBeneficiar')
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.text).toContain('<input type="text" id="foodInput" placeholder="Introduceți alimentul de care aveți nevoie">');
        done();
      });
  });

  it('should add address correctly', (done) => {
    request(app)
      .post('/addAddress')
      .send({ address: 'Test Address' })
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body).toHaveProperty('address', 'Test Address');
        done();
      });
  });

  it('should add food item correctly', (done) => {
    request(app)
      .post('/addFood')
      .send({ food: 'Test Food' })
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body).toHaveProperty('food', 'Test Food');
        done();
      });
  });

  it('should remove address correctly', (done) => {
    request(app)
      .delete('/removeAddress')
      .send({ address: 'Test Address' })
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body).toHaveProperty('message', 'Address removed successfully');
        done();
      });
  });

  it('should remove food item correctly', (done) => {
    request(app)
      .delete('/removeFood')
      .send({ food: 'Test Food' })
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body).toHaveProperty('message', 'Food item removed successfully');
        done();
      });
  });
});
