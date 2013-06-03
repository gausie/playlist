ko.bindingHandlers.sorted = {
	update: function(element, valueAccessor) {
		$(element).parent().children().tsort({ attr: 'data-order' });
	}
};

function SongsViewModel() {
	var self = this;
	
	var model = {
		'songs': []
	};
	
	self.playlist = $('#playlist').val();
	
	self.songs = ko.viewmodel.fromModel(model,{
		arrayChildId:{
			"{root}.songs":"_id"
		}
	});
	
	self.upvote = function(song){
		self.vote("upvote",song._id());
	}
	
	self.downvote = function(song){
		self.vote("downvote",song._id());
	}
	
	self.vote = function(direction, songid){
		$.get('/api/'+songid+'/'+direction, function(){
			self.sync();
		});
	}
	
	self.sync = function(){
		$.get('/api/'+self.playlist, function(data){
			ko.viewmodel.updateFromModel(self.songs, data);
		});
		//var t = setTimeout(function(){ self.sync() }, 1000);
	}

	self.sync();

}

ko.applyBindings(new SongsViewModel());
