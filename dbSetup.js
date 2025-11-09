// dbSetup.js
const fs = require('fs');
const oracledb = require('oracledb');
require('dotenv').config();

async function runSQLFile() {
  const sql = fs.readFileSync('./schema.sql', 'utf8');
  let connection;
  try {
    connection = await oracledb.getConnection({
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      connectString: process.env.DB_CONNECT
    });
    console.log('Connected to Oracle, running schema...');
    const statements = sql.split(';').map(s => s.trim()).filter(s => s.length);
    for (const stmt of statements) {
      await connection.execute(stmt);
      console.log('Executed:', stmt.split('\n')[0].slice(0,80));
    }
    await connection.commit();
    console.log('Schema run completed.');
  } catch (err) {
    console.error('Error running schema:', err);
  } finally {
    if (connection) try { await connection.close(); } catch(e){console.error(e);}
  }
}

runSQLFile();
