'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Chart = new Schema({
    id:String,
   fsym:String,
   tsym:String

},{ versionKey: false });

module.exports = mongoose.model('Chart', Chart);