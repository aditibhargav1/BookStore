const express = require('express');
const path = require('path');
require('dotenv').config();
const methodOverride = require('method-override');

const booksRoutes = require('./routes/books'); // ensure this file exists and uses getConnection()

const app = express();
app.use(methodOverride('_method'));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use(express.static(path.join(__dirname,'public')));

app.use('/books', booksRoutes);

app.get('/', (req,res) => res.redirect('/books'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on http://localhost:${PORT}`));
