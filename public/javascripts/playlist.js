$.fn.asort = function (order, attrName) {
	for(var i = 0, len = order.length; i < len; ++i) {
		this.children('[' + attrName + '=' + order[i] + ']').appendTo(this);
  }
};

function updatePlaylist(playlist){
	//Oh my god this should so be in some reactive framework. I might try knockout.
	var $container = $('#list');
	$.get("/api/"+playlist, function(data){
		var current = [];
		var incoming = [];
		$container.children().each(function(){
			current.push($(this).attr('data-songid'));
		});
		for(var song in data){
			if(data.hasOwnProperty(song)){
				song = data[song];
				var index = current.indexOf(song._id);
				incoming.push(song._id);
				if(index==-1){
					$container.append("<div data-songid='"+song._id+"' data-upvotes='"+song.upvotes+"' data-downvotes='"+song.downvotes+"'><div class='input-prepend'><button class='add-on upvote form-height-fix'><i class='icon-circle-arrow-up'></i> <span>"+song.upvotes+"</span></button><button class='add-on downvote form-height-fix'><i class='icon-circle-arrow-down'></i> <span>"+song.downvotes+"</span></button><input type='text' disabled value='"+song.title+"' style='width:350px;' /></div></div>");
				}else{
					$song = $('div[data-songid='+song._id+']');
					if($song.attr('data-upvotes')!=song.upvotes){
						$('button.upvote span', $song).text(song.upvotes);
					}
					if($song.attr('data-downvotes')!=song.downvotes){
						$('button.downvote span', $song).text(song.downvotes);
					}
					current.splice(index,1);
				}
			};
		}
		for(var i=0;i<current.length;i++){
			$('div[data-songid='+current[i]+']').fadeTo(0).slideUp(function(){
				$(this).remove();
			});
		}
		$container.children().asort(incoming,'data-songid');
		var si = setTimeout(function(){updatePlaylist(playlist);},5000);
	});
};

$(document).ready(function(){
	var playlist = $('#playlist').val();
	
	updatePlaylist(playlist);

	$(document).on('click', 'button.upvote, button.downvote', function(){
		var $this = $(this);
		var songid = $this.parent().parent().attr('data-songid');
		var direction = ($this.hasClass('upvote'))?'upvote':'downvote';
		$.get('/api/'+songid+'/'+direction, function(){
			updatePlaylist(playlist);
		});
	});

	$('form').submit(function(){
		var input = $('input',$(this)).val();
		$.post("/api/"+playlist+"/add", {
			url: input
		}, function(){
			updatePlaylist(playlist);
		});
		return false;
	});
  
  $('#go-to-player').click(function(){
    location.href = location.href+'/player';
  });
	
});
