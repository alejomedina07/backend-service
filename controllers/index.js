var express = require('express'),
    fs = require('fs'),
    Hospital = require('../models/Hospital'),
    Medico = require('../models/Medico'),
    Usuario = require('../models/Usuario'),
    fileUpload = require('express-fileupload');
    app = express();

app.get('/', ( req, res ) => {
  res.status(200).json({ok: true, mensaje:'hola mundo'});
});

app.get('/busqueda/todo/:busqueda', ( req, res ) => {
    var tabla = 'alejito'
    Promise.all([
        Hospital.aggregate([ { $match: { name : { $regex: req.params.busqueda, $options: 'i' } } }]),
        Medico.find()
    ])
    .then(function(respuestas) {
        res.status(200).json({
            ok: true,
            hospitales:respuestas[0],
            medicos:respuestas[1],
            [tabla]: 'hola',
            tabla
        });
    })
    .catch(function(error) {
        console.log('error');
        console.log(error);
    });
});


app.use(fileUpload());

app.put('/upload/:tipo/:id', ( req, res ) => {
    if ( !req.files ) {
        return res.status(400).json({ok: false, mensaje:'No se selecciono nada'});
    }

    // NOMBRE DEL ARCHIVO
    var archivo = req.files.imagen,
        ext = archivo.name.split('.');
    ext = ext[ext.length-1];

    //validar extenciones
    var extPermitidas = ['png', 'jpg', 'gif', 'jpeg']
    if ( extPermitidas.indexOf( ext ) < 0 ) {
        return res.status(400).json({ok: false, mensaje:'Extension no valida, las validas son ' + extPermitidas.join(', ')});
    }
    var tiposPermitidos = ['medicos', 'hospitales', 'usuarios']
    if ( tiposPermitidos.indexOf(req.params.tipo) < 0 ) {
        return res.status(400).json({ok: false, mensaje:'Tipos no validos, las validos son ' + tiposPermitidos.join(', ')});
    }
    // nombre de archivo personalizado
    var nombreArchivo = `${ req.params.id }-${ new Date().getMilliseconds() }.${ext}`

    var patch = `./uploads/${req.params.tipo}/${nombreArchivo}`;

    archivo.mv(patch, function(err) {
        if (err)
          return res.status(500).json({ok: false, mensaje:'La imagen no se guardo correctamente'});
        subirArchivo(req.params.tipo, req.params.id, nombreArchivo, res)
        // return res.status(200).json({ok: true, mensaje:'La imagen se guardo correctamente', nombreArchivo});
      });

});


function subirArchivo(tipo, id, nombreArchivo, res) {
    console.log('tipo');
    console.log(tipo);
    if ( tipo === 'usuarios' ) {
        Usuario.findById(id)
        .then( respuesta => {
            console.log(respuesta);
            var patchAnterior = './uploads/usuarios/' + respuesta.img;
            if ( fs.existsSync(patchAnterior) ) {
                fs.unlinkSync( patchAnterior );
            }
            respuesta.img = nombreArchivo;
            return respuesta.save()
        })
        .then( respuesta => {
            return res.status(200).json({ok: true, mensaje:'La imagen se guardo correctamente', nombreArchivo, medico:respuesta});
        })
        .catch( error => {
            console.log('error usuario');
            console.log(error);
            fs.unlinkSync( './uploads/medicos/' + nombreArchivo );
            res.status(500).json({ok: false, mensaje:'La imagen no se guardo correctamente'});
        });
    }
    if ( tipo === 'hospitales' ) {
        Hospital.findById(id)
        .then(function(respuesta) {
            console.log(respuesta);
            var patchAnterior = './uploads/hospitales/' + respuesta.img;
            if ( fs.existsSync(patchAnterior) ) {
                fs.unlinkSync( patchAnterior );
            }
            respuesta.img = nombreArchivo;
            return respuesta.save()
        })
        .then( respuesta => {
            return res.status(200).json({ok: true, mensaje:'La imagen se guardo correctamente', nombreArchivo, hospital:respuesta});
        })
        .catch(function(error) {
            console.log(error);
            fs.unlinkSync( './uploads/hospitales/' + nombreArchivo );
            return res.status(500).json({ok: false, mensaje:'La imagen no se guardo correctamente'});
        });
    }
    if ( tipo === 'medicos' ) {
        Medico.findById(id)
        .then(function(respuesta) {
            var patchAnterior = './uploads/medicos/' + respuesta.img;
            console.log('fs.existsSync(patchAnterior) ');
            console.log(fs.existsSync(patchAnterior)    );
            if ( fs.existsSync(patchAnterior) ) {
                console.log(12345789);
                fs.unlinkSync( patchAnterior );
            }
            respuesta.img = nombreArchivo;
            return respuesta.save()
        })
        .then( respuesta => {
            return res.status(200).json({ok: true, mensaje:'La imagen se guardo correctamente', nombreArchivo, usuarios:respuesta});
        })
        .catch(function(error) {
            console.log('error medicos');
            console.log(error);
            fs.unlinkSync( './uploads/medicos/' + nombreArchivo );
            return res.status(500).json({ok: false, mensaje:'La imagen no se guardo correctamente'});
        });
    }
    // console.log('tipo');
    // console.log(tipo);
    // return res.status(500).json({ok: false});
}



module.exports = app;
