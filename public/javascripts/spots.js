jQuery(document).ready(function() {

    var latlng = new google.maps.LatLng(60.17, 24.93);

    var myOptions = {
      zoom: 12,
      center: latlng,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };

    var map = new google.maps.Map(document.getElementById("map_canvas"),
        myOptions);

	var request_data = null;
  	
	jQuery.getJSON('spots.json', request_data , function(data){
		jQuery.each(data, function(i, object) {
			
			console.log(object.spot.title);
			
			var spotLatLng = new google.maps.LatLng(object.spot.latitude,object.spot.longitude);
						
			var spot_title = object.spot.title;
			var spot_desc = object.spot.description;
			
			var contentString = '<div id="content"><h1>'+spot_title+'</h1>'+
			'<p>'+spot_desc+'</p></div>';
		    
			var infowindow = new google.maps.InfoWindow({
		        content: contentString
		    });
						
						
			var marker = new google.maps.Marker({
		      position: spotLatLng, 
		      map: map,
		      title: spot_title
		  });
		
		google.maps.event.addListener(marker, 'click', function() {
	      infowindow.open(map,marker);
	    });
		
		})
	});
});