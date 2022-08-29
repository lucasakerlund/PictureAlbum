const express = require('express');
const albumRoutes = require('./routes/albumRoutes');

const app = express();

app.set('view engine', 'ejs');

app.listen(5500);

app.use(express.static('public'));
app.use(express.static('data/pictures'));
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.redirect('/albums');
});

app.use('/albums', albumRoutes);

app.use((req, res) => {
    res.status(404).render('404', { title: '404', message: 'Could not find the page.' });
});

