function createMarker(input) {
var marker = new GMarker(input.point);
GEvent.addListener(marker, "click", function() {
marker.openInfoWindowHtml( input.homeTeam + " vs. " + input.awayTeam );
});
return marker;
}
function parseJson (doc) {
var jsonData = eval("(" + doc + ")");
for (var i = 0; i < jsonData.markers.length; i++) {
var marker = createMarker(jsonData.markers[i]);
gmap.addOverlay(marker);
}
}
downloadUrl("http://localhost:3000/spots.json", function(data, responseCode) {
parseJson(data);
});