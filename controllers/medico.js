var express = require('express');
var app = express();
var bcrypt = require('bcrypt');
var Medico = require('../models/Medico');

var mdAutenticacion = require('../middlewares/autenticacion');





app.get('/', ( req, res ) => {
  Medico.find()
  .then(function(medicos) {
    res.status(200).json({ error:false, medicos});
  })
  .catch(function(error) {
    res.status(500).json({error: true, mensaje:'Peticion de medico get'});
  });
});


app.post('/', mdAutenticacion.verificatoken,  ( req, res ) => {
  if (req.body.password) {req.body.password = bcrypt.hashSync(req.body.password, 10);}
  var nuevo = new Medico(req.body);
  nuevo.save()
  .then(function(medico) {
    res.status(201).json({ error:false, medico, medicoToken: req.medico});
  })
  .catch(function(error) {
    res.status(400).json({error: true, mensaje:'Peticion de medico post', error : error.errors || error});
  });
});




app.put('/:id', mdAutenticacion.verificatoken, ( req, res ) => {
  Medico.findById(  req.params.id )
  .then(function(medico) {
    console.log(medico);
    if (!medico) { throw 'Error al buscar medico' };
    medico.name = req.body.name;
    medico.img = req.body.img;
    medico.usuarioId = req.body.usuarioId;
    medico.hospitalId = req.body.hospitalId;
    return medico.save();
  })
  .then(function(medicoGuardado) {
    medicoGuardado.password = " ";
    res.status(200).json({ error:false, medicoGuardado});
  })
  .catch(function(error) {
    res.status(500).json({error: true, mensaje:'Peticion de medico post', error : error.errors || error});
  });
});

app.delete('/:id', mdAutenticacion.verificatoken, ( req, res ) => {
  Medico.findByIdAndRemove(  req.params.id )
  .then(function(medicoBorrado) {
    res.status(200).json({ error:false, medicoBorrado});
  })
  .catch(function(error) {
    res.status(400).json({error: true, mensaje:'Error al borrar medico', error : error.errors || error});
  });
});


module.exports = app;
