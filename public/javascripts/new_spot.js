jQuery(document).ready(function() {

	//setup new centerpoint for map
	var latlng; //= new google.maps.LatLng(60.17, 24.93);
	
	function newGoogleMap(latitude, longitude) {	
		latlng = new google.maps.LatLng(latitude, longitude);	
	}
	
	if (navigator.geolocation) {
		navigator.geolocation.getCurrentPosition( 

				function (position) {

					//latlng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
					latlng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
					

					//initialize geocoder
					var geocoder;
					geocoder = new google.maps.Geocoder();	
							geocoder.geocode({'latLng': latlng}, function(results, status, callback) {
									if (status == google.maps.GeocoderStatus.OK && results[1]) {						
	
	
											console.log(jQuery('#spot_longitude'));
	
											jQuery('#spot_latitude').val(position.coords.latitude);
											jQuery('#spot_longitude').val(position.coords.longitude);
											jQuery('#spot_address').val(results[0].formatted_address);
											jQuery('#spot_area').val(results[2].formatted_address);
											
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

											function reverseGeocode(GClatlng) {

											var geocoded;	

													geocoder.geocode({'latLng': GClatlng}, function(results, status) {
															if (status == google.maps.GeocoderStatus.OK && results[1]) {						
																		
																		jQuery('#spot_latitude').val(GClatlng.lat());
																		jQuery('#spot_longitude').val(GClatlng.lng());
																		jQuery('#spot_address').val(results[0].formatted_address);
																		jQuery('#spot_area').val(results[2].formatted_address);
																		
																		infowindow.setContent('<div class="bubble" id="content"><h2>Add new spot here</h2><p>'+results[0].formatted_address+
																		'</p></div>');
																		infowindow.open(map,marker);
															}					
													});

											}
											
											
											
											
											var marker = new google.maps.Marker(
												{position: latlng, 
											    map: map,
											 	draggable:true}
											);

											var contentString = '<div class="bubble" id="content"><h1>New spot</h1></div>';


											var infowindow = new google.maps.InfoWindow({
										        content: contentString
										    });

											google.maps.event.addListener(marker, 'click', function() {
												var newCenter = marker.getPosition();
												map.setCenter(newCenter);
												infowindow.open(map,marker);
											});
											
											google.maps.event.addListener(map, 'click', function() {
												infowindow.close(map,marker);
											});

											google.maps.event.addListener(marker, 'dragend', function() {
												
												//zoom in and center into new position
												zoomLevel = map.getZoom();
												if (Number(zoomLevel) < 19) {
													zoomLevel = 1+zoomLevel;
													var newCenter = marker.getPosition();
													console.log('new center is '+newCenter);
													map.setCenter(newCenter);
													map.setZoom(zoomLevel);
												}
												reverseGeocode(marker.getPosition());
												infowindow.open(map,marker);
											});
											
										
											
											
											
											
									}					
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