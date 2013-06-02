function getTopSong(playlist, $player, callback){
	$.get('/api/'+playlist, function(data){
		(callback)(data[0]);
	});
}

function playTopSong(playlist, $player){
	getTopSong(playlist, $player, function(data){
    if(data===undefined){
      $player.tubeplayer("stop");
      $player.append("<div id='end'>No more videos in playlist</div>")
    }else{
      $('#end').remove();
      $player.tubeplayer("play", data.url);
      $player.attr('data-songid', data._id);
    }
	});
}

function playNextSong(playlist, $player){
	songid = $player.attr('data-songid');
	console.log($player);
	$.get('/api/'+songid+'/remove', function(){
		playTopSong(playlist, $player);
	})	
}

$(document).ready(function(){
	
	var $player = $('#player');
	var playlist = $('#playlist').val();
	
	$player.tubeplayer({
    initialVideo: '8tPnX7OPo0Q',
		onPlayerEnded: function(){
			console.log("playing next song");
			playNextSong(playlist, $player);
		},
		loadSWFObject: true,
		iframed: false
	});
	
	$.tubeplayer.defaults.afterReady = function($player){
		playTopSong(playlist, $player);
	};
	
});
