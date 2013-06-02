/*
 * Player
 */
 
var Playlist = require('../models/playlist.js');

exports.view = function(req, res){
  Playlist.count({ playlist: req.params.playlist }, function(err, count){
    if(count>0){
      res.render('playlist', { title: 'Playlist view', playlist: req.params.playlist});
    }else{
      console.log(req.params.playlist);
      console.log(count);
      res.status(404).send('Playlist not found');
    }
  });
};

exports.player = function(req, res){
	res.render('player', { title: 'Player', playlist: req.params.playlist });
};
