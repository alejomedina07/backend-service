var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');

var app = express();


// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

// mongoose.connection.openUri('mongodb://localhost/27017/hospitalDB', ( err, res ) => {
//   if ( err ) throw err;
//   console.log('bd online');
// });

mongoose.connect('mongodb://localhost/hospitalDB', {useNewUrlParser: true}, { useCreateIndex: true });


app.use('/usuario', require('./controllers/usuario'));
app.use('/hospital', require('./controllers/hospital'));
app.use('/medico', require('./controllers/medico'));
app.use('/login', require('./controllers/login'));
app.use('/', require('./controllers/index'));

app.listen(3000, () => {
  console.log('corriendo por el puerto 3000: \x1b[42m%s\x1b[0m', ' online');
})
