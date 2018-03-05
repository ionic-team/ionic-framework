import * as bodyParser from 'body-parser';
import * as express from 'express';

const app = express();

app.set('port', process.env.PORT || 5000);

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  next();
});

app.post('/test', (req, res) => {
  res.send(req.body);
});

app.listen(app.get('port'), () => {
  console.log('Node app is running on port', app.get('port'));
});
