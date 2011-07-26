jQuery(document).ready(function() {


	//setup new centerpoint for map
    var latlng = new google.maps.LatLng(60.17, 24.93);

	//setup the map
    var myOptions = {
      zoom: 12,
      center: latlng,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };

	//initialize map with prior settings
    var map = new google.maps.Map(document.getElementById("map_canvas"),
        myOptions);

		//get-parameters
	function getParameterByName(name)
		{
		  name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
		  var regexS = "[\\?&]" + name + "=([^&#]*)";
		  var regex = new RegExp(regexS);
		  var results = regex.exec(window.location.href);
		  if(results == null)
		    return "";
		  else
		    return decodeURIComponent(results[1].replace(/\+/g, " "));
		}

	//prepare for getJSON request
	var request_data = null;
	var request_base = '/spots.json';
	var request_arguments = '';
	
	//build request arguments
	if (getParameterByName('category')) {
		request_arguments = '/?category='+getParameterByName('category');
	}
	
	var request_target = request_base+request_arguments;
	
	jQuery.getJSON(request_target, request_data , function(data){
		jQuery.each(data, function(i, object) {
			
			var spotLatLng = new google.maps.LatLng(object.spot.latitude,object.spot.longitude);
						
			var spot_title = object.spot.title;
			var spot_desc = object.spot.description;
			
			var contentString = '<div class="bubble" id="content"><h1>'+spot_title+'</h1>'+
			'<p>'+spot_desc.substring(0, 30)+'...</p><p><a href="spots/'+object.spot.id+'">View details..</a></p></div>';
		    
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
			var newCenter = marker.getPosition();
			map.setCenter(newCenter);
			
	    });
	
		google.maps.event.addListener(map, 'click', function() {
			infowindow.close(map,marker);
		});
		
		google.maps.event.addListener(map, 'dragstart', function() {
			infowindow.close(map,marker);
		});
		
		})
	});

	

});