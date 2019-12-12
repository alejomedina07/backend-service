var express = require('express');
var app = express();
var bcrypt = require('bcrypt');
var Hospital = require('../models/Hospital');

var mdAutenticacion = require('../middlewares/autenticacion');


app.get('/', ( req, res ) => {
  var pipes = [];
  pipes.push({ $lookup: { from: 'usuarios', localField: 'usuairoId', foreignField: '_id', as: 'medico' } });
  pipes.push({ $unwind : "$medico" });
  Hospital.aggregate(pipes)
  .then(function(hospitales) {
    res.status(200).json({ error:false, hospitales});
  })
  .catch(function(error) {
    res.status(500).json({error: true, mensaje:'Peticion de hospital get'});
  });
});


app.post('/', mdAutenticacion.verificatoken,  ( req, res ) => {
  var nuevo = new Hospital(req.body);
  nuevo.save()
  .then(function(hospital) {
    res.status(201).json({ error:false, hospital});
  })
  .catch(function(error) {
    res.status(400).json({error: true, mensaje:'Error Peticion de hospital post', error : error.errors || error});
  });
});



app.put('/:id', mdAutenticacion.verificatoken, ( req, res ) => {
  Hospital.findById(  req.params.id )
  .then(function(hospital) {
    console.log(hospital);
    if (!hospital) { throw 'Error al buscar hospital' };
    hospital.name = req.body.name;
    hospital.img = req.body.img;
    hospital.usuarioId = req.body.usuarioId;
    return hospital.save();
  })
  .then(function(hospitalGuardado) {
    hospitalGuardado.password = " ";
    res.status(200).json({ error:false, hospitalGuardado});
  })
  .catch(function(error) {
    res.status(500).json({error: true, mensaje:'Peticion de hospital post', error : error.errors || error});
  });
});

app.delete('/:id', mdAutenticacion.verificatoken, ( req, res ) => {
  Hospital.findByIdAndRemove(  req.params.id )
  .then(function(hospitalBorrado) {
    res.status(200).json({ error:false, hospitalBorrado});
  })
  .catch(function(error) {
    res.status(400).json({error: true, mensaje:'Error al borrar hospital', error : error.errors || error});
  });
});


module.exports = app;
