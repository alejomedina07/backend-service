var mongoose = require('mongoose');

var Schema = mongoose.Schema;


var hospitalSchema = new Schema({
    name: { type: String, required: [true, 'El nombre es necesario'] },
    img: { type: String, require: false },
    usuairoId: { type: Schema.Types.ObjectId }

},{collection:'hospitales'});

module.exports = mongoose.model('Hospital', hospitalSchema);
