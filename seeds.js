// seeds.js
const getConnection = require('./db');

const sampleBooks = [
  { title: 'The Alchemist', author: 'Paulo Coelho', price: 299, description: '...', image_url: '', genre: 'Fiction' },
  { title: 'Atomic Habits', author: 'James Clear', price: 499, description: '...', image_url: '', genre: 'Self-help' }
];

async function seed() {
  let conn;
  try {
    conn = await getConnection();
    for (const b of sampleBooks) {
      await conn.execute(
        `INSERT INTO books (title, author, price, description, image_url, genre)
         VALUES (:title, :author, :price, :description, :image_url, :genre)`,
         b
      );
    }
    await conn.commit();
    console.log('Seeded data.');
  } catch (err) {
    console.error(err);
  } finally {
    if (conn) await conn.close();
  }
}

seed();
