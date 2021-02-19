const express = require('express');
const path = require('path');
const {
  syncAndSeed,
  models: { User, Car, Sale },
  db,
} = require('./db');

const app = express();
app.use(express.json());

app.use('/api', require('./api'));

app.use('/dist', express.static(path.join(__dirname, 'dist')));

app.get('/', (req, res, next) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

const init = async () => {
  try {
    await syncAndSeed();
    console.log('db synced and seeded');
    const port = process.env.PORT || 3000;
    app.listen(port, () => console.log(`listening on port: ${port}`));
  } catch (error) {
    console.log(error);
  }
};

init();
