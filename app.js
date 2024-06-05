const express = require('express');
const mysql = require('mysql');
const ejs = require('ejs');
const path = require('path');
const app = express();
const port = 3000;

// MySQL connection configuration
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'root123',
  database: 'onlinebookstore',
});

// Array to store items in the cart
const cart = [];

// Connecting to MySQL
connection.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    return;
  }
  console.log('Connected to MySQL');
});

// Set up static files and view engine
app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));

// Root route to display books
app.get('/', (req, res) => {
  const query = 'SELECT * FROM bookdetails';

  connection.query(query, (err, results) => {
    if (err) {
      console.error('Error executing query:', err);
      res.status(500).send('Error retrieving data from the database');
      return;
    }

    results.sort((a, b) => a.id - b.id);

    res.render('index', { books: results });
  });
});

// Route to add a book to the cart
app.post('/addToCart/:bookId', (req, res) => {
  const bookId = req.params.bookId;

  const query = `SELECT * FROM bookdetails WHERE id = ${bookId}`;

  connection.query(query, (err, results) => {
    if (err) {
      console.error('Error executing query:', err);
      res.status(500).send('Error adding to cart');
      return;
    }

    if (results.length === 0) {
      res.status(404).send('Book not found');
      return;
    }

    cart.push(results[0]);
    res.redirect('/');
  });
});

// Route to remove a book from the cart
app.post('/removeFromCart/:index', (req, res) => {
  const index = req.params.index;

  if (index >= 0 && index < cart.length) {
    cart.splice(index, 1);
  }

  res.redirect('/cart');
});

// Route to display the cart
app.get('/cart', (req, res) => {
  res.render('cart', { cart: cart });
});

// Route to display login page
app.get('/login', (req, res) => {
  res.render('login', { error: null });
});

// Route to display register page
app.get('/register', (req, res) => {
  res.render('register', { error: null });
});

// Route to register a new user
app.post('/register', (req, res) => {
  const { name, email, username, address, phone_number, password } = req.body;

  const query = `INSERT INTO users (name, email, username, address, phone_number, password) VALUES (?, ?, ?, ?, ?, ?)`;
  connection.query(query, [name, email, username, address, phone_number, password], (err, results) => {
    if (err) {
      console.error('Error executing query:', err);
      res.status(500).send('Error registering user');
      return;
    }
    res.redirect('/login');
  });
});

// Route to handle user login
app.post('/login', (req, res) => {
  const { username, password } = req.body;

  const query = `SELECT * FROM users WHERE username = '${username}' AND password = '${password}'`;

  connection.query(query, (err, results) => {
    if (err) {
      console.error('Error executing query:', err);
      res.status(500).send('Error during login');
      return;
    }

    if (results.length === 1) {
      activeuserid = results[0].id;
      console.log('Active user ID:', activeuserid);
      res.redirect('/');
    } else {
      res.render('login', { error: 'Invalid username or password' });
    }
  });
});

// Route to handle book purchases
app.post('/purchase/:bookId', (req, res) => {
  const bookId = req.params.bookId;

  if (!activeuserid) {
    res.status(403).send('Unauthorized');
    return;
  }

  const query = `INSERT INTO purchases (user_id, book_id) VALUES (?, ?)`;
  connection.query(query, [activeuserid, bookId], (err, results) => {
    if (err) {
      console.error('Error executing query:', err);
      res.status(500).send('Error making purchase');
      return;
    }

    res.redirect('/');
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
