$(document).ready(function(){
	
	$('#generate').click(function(){
    $.get("/api/generate", function(data){
      location.href = location.href + data;
    });
  });
  
});
