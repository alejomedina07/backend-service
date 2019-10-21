var express = require('express');
var app = express();
var bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
var user = require('../models/Usuario');
var SEED = require('../config/config').SEED;

app.post('/',  ( req, res ) => {
  // console.log('\x1b[42m%s\x1b[0m', 'login');
  user.findOne( { email:req.body.email } )
  .then( (usuario) => {
    if (!usuario) {
      res.status(400).json( { error:false, mensaje: 'Credenciales incorrectas -- email'});
    };
    if ( !bcrypt.compareSync(req.body.password, usuario.password) ) {
      res.status(400).json( { error:false, mensaje: 'Credenciales incorrectas -- ps'});
    }

    usuario.password = '';
    var token = jwt.sign( { usuario: usuario }, SEED, { expiresIn:14400 } ) // 4horas

    return res.status(400).json( { error:false, usuario, token });
  })
  .catch( (error) => {
    console.log(error);
    res.status(500).json( { error:false, mensaje: 'Error al buscar usuarios', error });
  });
});


module.exports = app;
