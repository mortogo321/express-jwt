require('dotenv').config();

const express = require('express');
const passport = require('passport');

const environment = process.env.NODE_ENV || 'development';

const authGuard = require('./middleware/authGuard');

const indexRouter = require('./routes/index');
const authRouter = require('./routes/auth');
const adminRouter = require('./routes/admin');
const userRouter = require('./routes/user');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// cors
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Autorization');
  res.header('Access-Control-Allow-Credentials', true);
  res.header('Access-Control-Allow-Methods', '*');

  return next();
});

app.use(passport.initialize());

app.use('/', indexRouter);
app.use('/auth', authRouter);
app.use('/admin', authGuard.jwt('admin'), adminRouter);
app.use('/user', authGuard.jwt('user'), userRouter);

// swagger
if (environment === 'development') {
  const swagger = require('express-swagger-generator')(app);

  let options = {
    swaggerDefinition: {
      info: {
        description: 'Olufy Jeweal - Staff API',
        title: 'Olufy Jeweal - Staff API',
        version: '1.0.0',
      },
      host: 'localhost:3000',
      basePath: '/',
      produces: [
        "application/json",
        "application/xml"
      ],
      schemes: ['http', 'https'],
      securityDefinitions: {
        JWT: {
          type: 'apiKey',
          in: 'header',
          name: 'Authorization',
          description: "<b>Format</b><br/>Authorization: Bearer &lt;token&gt;<br/>",
        }
      }
    },
    basedir: __dirname,
    files: [
      '../models/**/*.js',
      './routes/**/*.js'
    ]
  };

  swagger(options);
}

// error 404
app.use((req, res) => {
  res
    .status(404)
    .send({
      error: 'Not found',
      path: req.url
    });
});

app.listen(process.env.PORT || '3000', () => {
  console.log(`Server is running on port: ${process.env.PORT || '3000'}`);

  if (environment === 'development') {
    console.log(`Swagger UI: http://localhost:${process.env.PORT || '3000'}/api-docs`);
  }
});
