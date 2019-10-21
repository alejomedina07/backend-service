var express = require('express');
var mongoose = require('mongoose');


var app = express();

// mongoose.connection.openUri('mongodb://localhost/27017/hospitalDB', ( err, res ) => {
//   if ( err ) throw err;
//   console.log('bd online');
// });

mongoose.connect('mongodb://localhost/hospitalDB', {useNewUrlParser: true});

app.get('/', ( req, res ) => {
  res.status(200).json({ok: true, mensaje:'hola mundo'});
});

app.listen(3000, () => {
  console.log('corriendo por el puerto 3000: \x1b[42m%s\x1b[0m', ' online');
})
