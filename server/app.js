const http = require('http');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const cors = require('cors');
const session = require('express-session');
const logger = require('morgan');
const { MongoClient } = require('mongodb');
require('dotenv').config();

const csrfProtection = require('csurf')({ cookie: true });

let dbname = process.env.DB_NAME;

const uri = process.env.DB_ENV === 'server' ? 
  `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@anispark-wbal3.mongodb.net/${dbname}?retryWrites=true&w=majority`: // CLOUD
  `mongodb://localhost:27017/${dbname}`; // LOCAL

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

let sessionMiddleware = session({
  key: 'some_key',
  secret: `Our-name-wasn't-anispark:(`,
  saveUninitialized: false,
  resave: false,
  cookie: {
    maxAge: 1000 * 60 * 60,
    httpOnly: false
  }
});

const app = express();
const server = http.createServer(app);
const io = require('socket.io')(server);
const HOST = process.env.HOST || 'localhost' // change this by network
const PORT = process.env.PORT || 8000;
const origins = process.env.APP_ENV === 'production' ?
  [''] :
  ['http://localhost:8080', 'http://127.0.0.1:8080'];
const corsOrigin = (origin, callback) => {
  if (!origin || origins.indexOf(origin) !== -1) {
    callback(null, true);
  } else {
    callback(new Error('Not allowed by CORS'));
  }
};

// view engine setup
app.use(logger(process.env.APP_ENV === 'production' ? 'combined' : 'dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors({ origin: corsOrigin, credentials: true }));
app.use(cookieParser('I_love_cookies'));
// make this safer
app.use(express.static(path.join(__dirname, 'public')));
app.use(sessionMiddleware);

app.use('/images', express.static('images'));

app.get('/api/getcsrftoken', csrfProtection, function(req, res) {
  return res.status(200).cookie('XSRF-TOKEN', req.csrfToken()).end();
});

io.on('connection', (socket) => {
  console.log('User Connected//' + socket.id);

  // create a connection with the db
  socket.on('disconnect', () => {
    console.log('User Disconnected//' + socket.id);
  });

  socket.on('save-message', data => {
    // console.log(data);
    io.emit('new-message', data);
  });

  socket.on('save-chat', data => {
    io.emit('new-chat', data);
  });
});

console.log('Connecting to db');

client.connect()
  .then(() => {
    console.log('db connected');
    const db = client.db(dbname);

    const routers = {
      userRouter: require('./routes/userRoute')(db),
      chatRouter: require('./routes/chatRoute')(db),
      matchRouter: require('./routes/matchRoute')(db),
      adminRouter: require('./routes/adminRoute')(db),
      reportRouter: require('./routes/reportRoute')(db),
    };

    // console.log(routers);
    app.use('/api/user', routers.userRouter);
    app.use('/api/chat', routers.chatRouter);
    app.use('/api/match', routers.matchRouter);
    app.use('/api/admin', routers.adminRouter);
    app.use('/api/report', routers.reportRouter);

    server.listen(PORT, HOST, () => {
      console.log(`Listening to port ${PORT}`);
    });
  }).catch(err => {
    console.log('Unable to connect to MongoDB');
    console.log(err);
    server.close();
  });

module.exports = app;
