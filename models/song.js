var mongoose = require('mongoose')
	, Schema = mongoose.Schema;
 
var songSchema = new Schema({
		playlist: {type: String },
    createdAt: {type: Date, default: Date.now},
    title: {type: String },
    url: {type: String },
    upvotes: {type: Number, default: 1},
    downvotes: {type: Number, default: 0},
    //todo Make this less bad. Mongo, ey? Guys?
    total: {type: Number, default: 1}
});

module.exports = mongoose.model('Song', songSchema);
