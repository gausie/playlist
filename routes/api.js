/*
 * API.
 */
  
var Song = require('../models/song.js')
  , Playlist = require('../models/playlist.js')
	, ytid = require('get-youtube-id')
	, vi = require('videoinfo')
	, sid = require('short-mongo-id');

exports.generate = function(req, res){
  var playlist = new Playlist();
  playlist.playlist = sid(playlist._id);
  playlist.save();
  res.send(playlist.playlist);
};

exports.list = function(req, res){
  Song.find({ playlist: req.params.playlist }).sort('-total createdAt').exec(function(err, songs) {
    res.send(songs);
  });
};

exports.add = function(req, res){
	if(req.body.url===undefined){
		//todo Validate req.body.url as a URL
		res.send("No URL received.");
	}
	vi.fetch(req.body.url, function (err,data) {
		var song = new Song({
			playlist: req.params.playlist,
			url: ytid(req.body.url),
			title: data.title
		});
		song.save();
		res.send(song.toJSON());
	});
};

exports.remove = function(req, res){
	Song.remove({ _id: req.params.songid },function(){
		res.send('OK');
	});
}

exports.vote = function(req, res){
	var update;
	if(req.params.direction=="upvote"){
		update = { $inc: { upvotes: 1, total: 1 } };
	}else if(req.params.direction=="downvote"){
		update = { $inc: { downvotes: 1, total: -1 } };
	}
	Song.update({
		_id: req.params.songid
	},update,function(){
		res.send('OK');	
	});
};
