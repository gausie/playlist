var mongoose = require('mongoose')
	, Schema = mongoose.Schema;
 
var playlistSchema = new Schema({
		playlist: {type: String },
    createdAt: {type: Date, default: Date.now}
});
 
module.exports = mongoose.model('Playlist', playlistSchema);
