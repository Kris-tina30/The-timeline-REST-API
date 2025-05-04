const express = require('express');
const pino = require('pino-http');
const cors = require('cors');
const apiRoutes = require('./routes/postRoutes');
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
  app.use('/', apiRoutes);

  //errors
  app.use('*', (req, res) => {
    res.status(404).json({
      message: 'Not found',
    });
  });

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};

module.exports = startServer;
