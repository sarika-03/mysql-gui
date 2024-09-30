const express = require('express');
const cors = require('cors');
const argv = require('minimist')(process.argv.slice(2));
const DBConnector = require('./config/dbConnector');
const authMiddleware = require('./middleware/authentication');
const dbRouter = require('./routes/dbRoutes');

const app = express();

app.use(authMiddleware.authentication)

app.use (cors());

app.use('/api/mysql/',dbRouter);

//connect to database
DBConnector.InitDB(app);

app.once('connectedToDB', () => {
    const port = argv.p || process.env.PORT || 5000;
    app.listen(port, () => {
      console.log(`> Access MySQL GUI at http://localhost:${port}`);
    });
  });
  
  // error handler
  app.use((err, req, res, next) => {
    console.log(err);
    const error = {
      errmsg: err.errmsg,
      name: err.name,
    };
    return res.status(500).send(error);
  });
  