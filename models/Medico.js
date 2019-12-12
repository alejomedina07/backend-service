var mongoose = require('mongoose');

var Schema = mongoose.Schema;


var medicoSchema = new Schema({
    name: { type: String, required: [true, 'El nombre es necesario'] },
    img: { type: String, required: false },
    usuairoId: { type: Schema.Types.ObjectId, ref:'Usuario' },
    hospitalId: { type: Schema.Types.ObjectId, ref:'Hospital', required:[true, 'EL hospital es un campo requerido'] }

});

module.exports = mongoose.model('Medico', medicoSchema);
