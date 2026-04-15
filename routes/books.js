const express = require('express');
const router = express.Router();
const db = require('../db');

// 1 List all books
router.get('/', async (req, res) => {
  try {
    const connection = await db.getConnection();
    const result = await connection.execute(`SELECT * FROM books ORDER BY id`);
    await connection.close();

    const books = result.rows.map(row => ({
      id: row[0],
      title: row[1],
      author: row[2],
      price: row[3],
      genre: row[4],
      image_url: row[5],
      description: row[6]
    }));

    res.render('books/index', { books });
  } catch (err) {
    console.error(err);
    res.status(500).send('DB Error');
  }
});

// 2 Show new book form
router.get('/new', (req, res) => {
  res.render('books/new');
});

// 3Show specific book (Detail page)
router.get('/:id', async (req, res) => {
  const bookId = req.params.id;

  try {
    const connection = await db.getConnection();
    const result = await connection.execute(
      `SELECT * FROM books WHERE id = :id`,
      [bookId]
    );
    await connection.close();

    if (result.rows.length === 0) return res.status(404).send('Book not found');

    const row = result.rows[0];
    const book = {
      id: row[0],
      title: row[1],
      author: row[2],
      price: row[3],
      genre: row[4],
      image_url: row[5],
      description: row[6]
    };

    res.render('books/show', { book });
  } catch (err) {
    console.error(err);
    res.status(500).send('DB Error');
  }
});

// 4Show edit form
router.get('/:id/edit', async (req, res) => {
  const bookId = req.params.id;
  try {
    const connection = await db.getConnection();
    const result = await connection.execute(
      `SELECT * FROM books WHERE id = :id`,
      [bookId]
    );
    await connection.close();

    if (result.rows.length === 0) return res.status(404).send('Book not found');

    const row = result.rows[0];
    const book = {
      id: row[0],
      title: row[1],
      author: row[2],
      price: row[3],
      genre: row[4],
      image_url: row[5],
      description: row[6]
    };

    res.render('books/edit', { book });
  } catch (err) {
    console.error(err);
    res.status(500).send('DB Error');
  }
});
// 5 Create new book
router.post('/', async (req, res) => {
  const { title, author, price, genre, image_url, description } = req.body;
  try {
    const connection = await db.getConnection();
    await connection.execute(
      `INSERT INTO books (title, author, price, genre, image_url, description) 
       VALUES (:title, :author, :price, :genre, :image_url, :description)`,
      { title, author, price, genre, image_url, description },
      { autoCommit: true }
    );
    await connection.close();
    res.redirect('/books');
  } catch (err) {
    console.error(err);
    res.status(500).send('DB Error');
  }
});

// 6 Update book
router.put('/:id', async (req, res) => {
  const { title, author, price, genre, image_url, description } = req.body;
  const bookId = req.params.id;

  try {
    const connection = await db.getConnection();
    await connection.execute(
      `UPDATE books 
       SET title = :title, 
           author = :author, 
           price = :price, 
           genre = :genre, 
           image_url = :image_url, 
           description = :description
       WHERE id = :id`,
      { title, author, price, genre, image_url, description, id: bookId },
      { autoCommit: true }
    );
    await connection.close();
    res.redirect(`/books/${bookId}`);
  } catch (err) {
    console.error(err);
    res.status(500).send('DB Error');
  }
});


// 7 Delete book
router.delete('/:id', async (req, res) => {
  const bookId = req.params.id;

  try {
    const connection = await db.getConnection();
    await connection.execute(
      `DELETE FROM books WHERE id = :id`,
      [bookId],
      { autoCommit: true }
    );
    await connection.close();
    res.redirect('/books');
  } catch (err) {
    console.error(err);
    res.status(500).send('DB Error');
  }
});

module.exports = router;
