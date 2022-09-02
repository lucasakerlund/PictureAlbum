const express = require('express');
const albumRoutes = require('./routes/albumRoutes');
const apiRoutes = require('./routes/apiRoutes'); 
const database = require('./models/dataHandler');
const multer = require('multer');
const upload = multer({ dest: 'data/pictures' });

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
app.use('/api', apiRoutes);

app.post('/picture/upload', upload.fields([{ name : "image-low", maxCount: 1 }, { name : "image-high", maxCount: 1 }]), async (req, res) => {
    database.uploadPicture(req.body.title, req.body.description, req.files['image-low'][0].filename, req.files['image-high'][0].filename, req.body.rating, req.body.albums);
    res.redirect('/');
});

app.use((req, res) => {
    res.status(404).render('404', { title: '404', message: 'Could not find the page.' });
});


