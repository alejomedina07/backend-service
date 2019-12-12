var express = require('express');
var app = express();
var bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
var user = require('../models/Usuario');
var SEED = require('../config/config').SEED;

//Autenticacion Google

var CLIENT_ID = require('../config/config').CLIENT_ID;
const {OAuth2Client} = require('google-auth-library');
const client = new OAuth2Client(CLIENT_ID);


async function verify( token ) {
  const ticket = await client.verifyIdToken({
      idToken: token,
      audience: CLIENT_ID,  // Specify the CLIENT_ID of the app that accesses the backend
      // Or, if multiple clients access the backend:
      //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
  });

  const payload = ticket.getPayload();
  // const userid = payload['sub'];
  // If request specified a G Suite domain:
  //const domain = payload['hd'];
  return {
      nombre: payload.name,
      email: payload.email,
      img: payload.picture,
      google:true
  }
}

app.post('/google',  async( req, res ) => {
    let token = req.body.token;
    console.log('token');
    console.log(CLIENT_ID);
    let googleUser = await verify(token)
        .catch( e => {
            console.log('error token');
            console.log(e);
            return res.status(403).json( { ok:false, mensaje:'Token no valido', e });
        });

    user.findOne({ email : googleUser.email })
    .then( respuesta => {
        console.log(respuesta);
        if ( respuesta ) {
            if ( respuesta.google === false ) {
                return res.status(400).json( { ok:false, mensaje:'Debe de usar su Autenticación normal' });
            }else {
                var token = jwt.sign( { usuario: respuesta }, SEED, { expiresIn:14400 } ); // 4horas
                return res.status(200).json( { error:false, usuario:respuesta, token });
            }
        }else {
            //Usuario no existe
            let usuario = new user();
            usuario.name  = googleUser.nombre;
            usuario.email = googleUser.email;
            usuario.img = googleUser.img;
            usuario.google = true;
            usuario.password = ':)';
            return usuario.save();
        }
    })
    .then( respuesta => {
        var token = jwt.sign( { usuario: respuesta }, SEED, { expiresIn:14400 } ); // 4horas
        return res.status(200).json( { ok:true, usuario:respuesta, token });
    })
    .catch(error => {
        console.log(error);
        return res.status(500).json( { ok:false, mensaje:'Error al buscar usuario', error });
    });

    // return res.status(200).json( { ok:true, mensaje:'OK!!', googleUser });
});


//Autenticacion normal
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

    return res.status(200).json( { error:false, usuario, token });
  })
  .catch( (error) => {
    console.log(error);
    res.status(500).json( { error:false, mensaje: 'Error al buscar usuarios', error });
  });
});


module.exports = app;
