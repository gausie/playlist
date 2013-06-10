/*
 * API.
 */
  
var Song = require('../models/song.js')
  , Playlist = require('../models/playlist.js')
	, _ = require('underscore')
	, ytid = require('get-youtube-id')
	, youtube = require('youtube-feeds')
	, sid = require('short-mongo-id');

exports.generate = function(req, res){
  var playlist = new Playlist();
  playlist.playlist = sid(playlist._id);
  playlist.save();
  res.send(playlist.playlist);
};

exports.list = function(req, res){
  Song.find({ playlist: req.params.playlist }).sort('-total createdAt').exec(function(err, data) {
		var songs = {
			'songs': []
		}
		var i = 0;
		_.each(data, function(d){
			d._doc.order = i++;
			songs.songs.push(d);
		});
		res.send(songs);
  });
};

exports.add = function(req, res){
	if(req.body.url===undefined){
		//todo Validate req.body.url as a URL
		res.send("No URL received.");
	}
  var videoid = ytid(req.body.url);
	youtube.video(videoid, function (err,data) {
		var song = new Song({
			playlist: req.params.playlist,
			url: videoid,
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
