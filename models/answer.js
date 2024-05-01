const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const aiSchema = new Schema({
    answer: String,
    createdAt: { type: Date, default: Date.now },
});

const Answer = mongoose.model('Answer', aiSchema);

module.exports = Answer;