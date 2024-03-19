const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage: storage });

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.get('/', (req, res) => {
  res.render('index');
});

app.post('/upload', upload.single('file'), (req, res) => {
  res.send('File uploaded successfully.');
});

app.get('/uploads', (req, res) => {
  fs.readdir('uploads/', (err, files) => {
    if (err) {
      console.error('Error reading uploads directory:', err);
      res.status(500).send('Internal Server Error');
      return;
    }
    res.render('uploadsIndex', { files });
  });
});

app.get('/uploads/:file', (req, res) => {
  const { file } = req.params;
  const filePath = path.join(__dirname, 'uploads', file);
  if (fs.existsSync(filePath)) {
    res.render('file', { file, path });
  } else {
    res.status(404).render('404'); // Render 404 page
  }
});

// Handle 404 errors
app.use((req, res, next) => {
  res.status(404).render('404');
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
