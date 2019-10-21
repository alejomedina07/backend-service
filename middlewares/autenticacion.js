var jwt = require('jsonwebtoken');
var SEED = require('../config/config').SEED;

// verificar usuairios

exports.verificatoken = function(req, res, next) {
  var token = req.query.token;
  jwt.verify( token, SEED, ( err, decoded ) => {
    if (err) {
      res.status(401).json({error:true, mensaje:'token incorrecto', err});
    }

    req.usuario = decoded.usuario;
    next();

    // res.status(200).json({error:false, decoded});

  });
}
