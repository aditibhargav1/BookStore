const db = require('../db');
const oracledb = require('oracledb');

// Get all books
async function getAll() {
  const conn = await db.getConnection();
  try {
    const result = await conn.execute(`SELECT * FROM books`, [], {
      outFormat: oracledb.OUT_FORMAT_OBJECT
    });
    return result.rows.map(row => ({
      id: row.ID,
      title: row.TITLE,
      author: row.AUTHOR,
      price: row.PRICE,
      description: row.DESCRIPTION ? String(row.DESCRIPTION) : '',
      image_url: row.IMAGE_URL ? String(row.IMAGE_URL) : '',
      genre: row.GENRE ? String(row.GENRE) : ''
    }));
  } finally {
    await conn.close();
  }
}

// Get book by ID
async function getById(id) {
  const conn = await db.getConnection();
  try {
    const result = await conn.execute(
      `SELECT * FROM books WHERE id = :id`,
      [id],
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );

    if (result.rows.length === 0) return null;
    const book = result.rows[0];

    return {
      id: book.ID,
      title: book.TITLE,
      author: book.AUTHOR,
      price: book.PRICE,
      description: book.DESCRIPTION ? String(book.DESCRIPTION) : '',
      image_url: book.IMAGE_URL ? String(book.IMAGE_URL) : '',
      genre: book.GENRE ? String(book.GENRE) : ''
    };
  } finally {
    await conn.close();
  }
}

// Create new book
async function create(book) {
  const conn = await db.getConnection();
  try {
    await conn.execute(
      `INSERT INTO books (title, author, price, description, image_url, genre)
       VALUES (:title, :author, :price, :description, :image_url, :genre)`,
      book
    );
    await conn.commit();
  } finally {
    await conn.close();
  }
}

// Update existing book
async function update(id, book) {
  const conn = await db.getConnection();
  try {
    await conn.execute(
      `UPDATE books
       SET title=:title, author=:author, price=:price,
           description=:description, image_url=:image_url, genre=:genre
       WHERE id=:id`,
      { ...book, id }
    );
    await conn.commit();
  } finally {
    await conn.close();
  }
}

// Delete book
async function remove(id) {
  const conn = await db.getConnection();
  try {
    await conn.execute(`DELETE FROM books WHERE id=:id`, [id]);
    await conn.commit();
  } finally {
    await conn.close();
  }
}

module.exports = { getAll, getById, create, update, remove };
