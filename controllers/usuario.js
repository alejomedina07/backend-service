var express = require('express');
var app = express();
var bcrypt = require('bcrypt');
var user = require('../models/Usuario');

var mdAutenticacion = require('../middlewares/autenticacion');





app.get('/', ( req, res ) => {
  user.find({}, 'name email role img')
  .then(function(usuarios) {
    res.status(200).json({ error:false, usuarios});
  })
  .catch(function(error) {
    res.status(500).json({error: true, mensaje:'Peticion de usuario get'});
  });
});


app.post('/', mdAutenticacion.verificatoken,  ( req, res ) => {
  if (req.body.password) {req.body.password = bcrypt.hashSync(req.body.password, 10);}
  var nuevo = new user(req.body);
  nuevo.save()
  .then(function(usuario) {
    res.status(201).json({ error:false, usuario, usuarioToken: req.usuario});
  })
  .catch(function(error) {
    res.status(400).json({error: true, mensaje:'Peticion de usuario post', error : error.errors || error});
  });
});




app.put('/:id', mdAutenticacion.verificatoken, ( req, res ) => {
  user.findById(  req.params.id )
  .then(function(usuario) {
    console.log(usuario);
    if (!usuario) { throw 'Error al buscar usuario' };
    usuario.name = req.body.name;
    usuario.img = req.body.img;
    usuario.email = req.body.email;
    usuario.role = req.body.role;
    return usuario.save();
  })
  .then(function(usuarioGuardado) {
    usuarioGuardado.password = " ";
    res.status(200).json({ error:false, usuarioGuardado});
  })
  .catch(function(error) {
    res.status(500).json({error: true, mensaje:'Peticion de usuario post', error : error.errors || error});
  });
});

app.delete('/:id', mdAutenticacion.verificatoken, ( req, res ) => {
  user.findByIdAndRemove(  req.params.id )
  .then(function(usuarioBorrado) {
    res.status(200).json({ error:false, usuarioBorrado});
  })
  .catch(function(error) {
    res.status(400).json({error: true, mensaje:'Error al borrar usuario', error : error.errors || error});
  });
});


module.exports = app;
