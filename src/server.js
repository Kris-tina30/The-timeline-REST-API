const express = require('express');
const pino = require('pino-http');
const cors = require('cors');
const browserRoutes = require('./routes/postBrowserRoutes');
const apiRoutes = require('./routes/postAPIRoutes');
const path = require('path');
const getEnvVar = require('./utils/getEnvVar');
const PORT = Number(getEnvVar('PORT', '2000'));

const startServer = () => {
  const app = express();
  //static files
  app.use(express.static(path.join(__dirname, '../public')));

  //ejs
  app.set('view engine', 'ejs');
  app.set('views', path.join(__dirname, '../src/views'));

  //to submit form
  app.use(express.urlencoded({ extended: true }));
  //json
  app.use(express.json());

  //cors
  app.use(cors());

  //pino
  app.use(
    pino({
      transport: {
        target: 'pino-pretty',
      },
    }),
  );
  //router
  app.use('/', browserRoutes);
  app.use('/api', apiRoutes);

  //errors
  app.use('/api/*', (req, res, next) => {
    res.status(404).json({
      message: 'Not found',
    });
  });

  app.use((err, req, res, next) => {
    res.status(500).json({
      message: 'Something went wrong',
      error: err.message,
    });
  });

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};

module.exports = startServer;
