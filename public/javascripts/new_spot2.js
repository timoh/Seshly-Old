jQuery(document).ready(function() {

	//setup new centerpoint for map
	var latlng; //= new google.maps.LatLng(60.17, 24.93);
	
	function newGoogleMap(latitude, longitude) {	
		latlng = new google.maps.LatLng(latitude, longitude);	
	}
	
	if (navigator.geolocation) {
		navigator.geolocation.getCurrentPosition( 

				function (position) {
					//console.log('Latitude is:'+position.coords.latitude); 				
					
					//latlng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
					latlng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
					

					
					zoomLevel = Math.ceil((290000/position.coords.accuracy));
					console.log(zoomLevel);
					
					//setup the map
				    var myOptions = {
				      zoom: zoomLevel,
				      center: latlng,
				      mapTypeId: google.maps.MapTypeId.ROADMAP
				    };

					//initialize map with prior settings
				    var map = new google.maps.Map(document.getElementById("map_canvas"),
				        myOptions);
					console.log('Latlng is: '+latlng);
					
					
					//setup the map
				    var myOptions = {
				      zoom: 12,
				      center: latlng,
				      mapTypeId: google.maps.MapTypeId.ROADMAP
				    };

					//initialize map with prior settings
				    var map = new google.maps.Map(document.getElementById("map_canvas"),
				        myOptions);

					//initialize geocoder
					var geocoder;
					geocoder = new google.maps.Geocoder();	

					function reverseGeocode(GClatlng) {

					var geocoded;	

							geocoder.geocode({'latLng': GClatlng}, function(results, status, callback) {
									if (status == google.maps.GeocoderStatus.OK && results[1]) {						
												infowindow.setContent('<div id="content"><h2>Add new spot here</h2><p>'+results[0].formatted_address+
												'</p></div>');	


									}					
							});

					}





					var marker = new google.maps.Marker(
						{position: latlng, 
					    map: map,
					 	draggable:true}
					);

					var contentString = '<div id="content"><h1>New spot</h1></div>';


					var infowindow = new google.maps.InfoWindow({
				        content: contentString
				    });

					google.maps.event.addListener(marker, 'click', function() {
						infowindow.open(map,marker);
					});

					google.maps.event.addListener(marker, 'dragend', function() {

						reverseGeocode(marker.getPosition());
						infowindow.open(map,marker);
					});
					
				}, 

				function (error)
				{
					switch(error.code) 
					{
						case error.TIMEOUT:
							console.log('Location: Timeout');
							break;
						case error.POSITION_UNAVAILABLE:
							console.log('Location: Position unavailable');
							break;
						case error.PERMISSION_DENIED:
							console.log('Location: Permission denied');
							break;
						case error.UNKNOWN_ERROR:
							console.log('Location: Unknown error');
							break;
					}
				}
				);
	} else {
		alert ("Please refresh and enable location!");
	}

});