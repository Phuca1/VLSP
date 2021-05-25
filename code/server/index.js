const express = require('express');
const path = require('path');
const fs = require('fs');
// const compression = require('compression');
const bodyParser = require('body-parser');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');

require('dotenv').config();
require('./models');

const { PORT } = require('./config');
const errorHandler = require('./middlewares/errorHandler');

const app = express();

app.use(cors());
app.use(helmet());
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const staticFolder = fs.readdirSync('./uploads');

staticFolder.map((folderName) => {
  app.use(
    `/uploads/${folderName}`,
    express.static(path.join('uploads', folderName)),
  );
});

// app.use(
//   '/uploads/extracted',
//   express.static(path.join('uploads', 'extracted')),
// );
// app.use('/uploads/zipfile', express.static(path.join('uploads', 'zipfile')));
// app.use('/uploads/pdffile', express.static(path.join('uploads', 'pdffile')));

require('./routes')(app);

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
