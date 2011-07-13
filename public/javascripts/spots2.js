$(document).ready(function() {
    var sports = ['Skeittaus', 'Jalkapallo', 'Tennis', 'Koripallo', 'Juoksu', 'Lentopallo', 'Sähly', 'Muu laji'];
    
    
    var sidebar = $('#sidebar');
    var info = sidebar.find('.content');
    var list = sidebar.find('.list');
    var form = sidebar.find('form');
    var loader = sidebar.find('.loader');
    
    
    var map = new GMap2(document.getElementById("map"));
    
    var cookie = $.cookie('map_area');
    
    if(cookie) {
        cookie = cookie.split(';');
        
        var center = new GLatLng(cookie[1], cookie[0]);
        map.setCenter(center, parseInt(cookie[2]));
    }
    else {
        var center = new GLatLng(60.17, 24.93);
        map.setCenter(center, 11);
    }
    
    map.setUIToDefault();
    
    var category = 0;
    var markers = new Array();
    
    
    // Ikonien määrittelyt
    var icons = new Array();
    var icon_sizes = [[20,23], [18,21], [16,19], [13,15], [12,13]];
    
    $.each(icon_sizes, function(i, size) {  
        var icon = new GIcon(G_DEFAULT_ICON);
        
        icon.sprite = {image: "img/markers.png", top: 0, left: i*20}
        icon.iconSize = new GSize(size[0], size[1]);
        icon.iconAnchor = new GPoint(size[0]/2, size[1]);
        icon.shadow = false;
        
        icons[i] = icon;
    });
    
    var add_icon = new GIcon(G_DEFAULT_ICON);
    add_icon.sprite = {image: "img/markers.png", top: 46, left: 0}
    add_icon.iconSize = new GSize(44, 52);
    add_icon.iconAnchor = new GPoint(22, 52);
    add_icon.imageMap = [0,0, 44,0, 44,52, 0,52];
    add_icon.shadow = false;
    
    
    function loadCategory() {
        var b = map.getBounds();
        var bmin = b.getSouthWest();
        var bmax = b.getNorthEast();
        
        $.getJSON('points.php', {
            id: category,
            bmin_x: bmin.x,
            bmin_y: bmin.y,
            bmax_x: bmax.x,
            bmax_y: bmax.y
        }, function(response) {
            var html = '<h2>Merkinnät alueella</h2>';
            
            var current_markers = new Array();
            var timestamp = new Date().getTime() / 1000;
            
            $.each(response, function(i, point) {
                var marker = markers[point.id];
                
                if(!marker) {
                    var icon = Math.floor((timestamp - point.time) / 86400);
                    if(icon > 4) icon = 4;
                    
                    var marker = new GMarker(new GLatLng(point.lat, point.long), {
                        icon: icons[icon]
                    });
                    
                    function show() {
                        var html = '<h3>'+point.name+'</h3>';
                        html += '<p class="address">'+point.address+' ('+point.reldate+')</p>';
                        
                        var infow = marker.openInfoWindowHtml(html);
                        
                        loader.fadeIn();
                        
                        info.hide().load('info.php?id='+point.id, function() {
                            list.hide();
                            info.fadeIn();
                            loader.fadeOut(200);
                            
                            $(this).find('form').submit(function() {
                                $.post('info.php', $(this).serialize()+'&id='+point.id+'&save=1', show);
                                
                                return(false);
                            });
                        });
                    }
                    
                    GEvent.addListener(marker, "click", show);
                    
                    //var tooltip = new Tooltip(marker, point.name, 4);
                    //marker.tooltip = tooltip; 
                    
                    map.addOverlay(marker);
                    //map.addOverlay(tooltip);
                    
                    markers[point.id] = marker;
                }
                
                current_markers[point.id] = marker;
                
                
                html += '<div rel="'+point.id+'"><span class="icon" style="background-position: -8px -'+((point.sport-1)*28)+'px;"></span><h3>'+point.name;
                
                if(point.address)
                    html += ' @ <span class="address">'+point.address+'</span>';
                
                html += '</h3><p class="reldate">'+point.reldate+'</p></div>';
            });
            
            list.html(html);
            
            $.each(markers, function(id, marker) {
                if(!current_markers[id] && id > 0) {
                    delete markers[id];
                    
                    if(marker)
                    map.removeOverlay(marker);
                }
            });
        });
    }
    
    loadCategory();
    
    GEvent.addListener(map, "moveend", function() {
        loadCategory();
        
        var b = map.getBounds();
        var center = b.getCenter();
        
        $.cookie('map_area', center.x+';'+center.y+';'+map.getZoom());
    });
    
    GEvent.addListener(map, 'infowindowclose', function() {
        info.hide();
        list.fadeIn();
    });
    
    list.delegate('div', 'click', function() {
        var id = $(this).attr('rel');
        
        GEvent.trigger(markers[id], 'click');
    });
    
    
    $('.sport-select').each(function() {
        var self = $(this);
        var ul = $(this).find('ul');
        var main = $(this).attr('id') == 'sport-select';
        
        for(i = 0; i < sports.length; i++) {
            ul.append('<li></li>');
        }
        
        $(this).hover(false, function() {
            ul.fadeOut(200);
        });
        var p = $(this).find('p').click(function() {
            ul.fadeIn();
        });
        
        $(this).find('li').click(function() {
            ul.children().removeClass('selected');
            $(this).addClass('selected');
            
            var pos = ($(this).position().top-2);
            p.addClass('selected').css('background-position', '0 -'+pos+'px');
            
            category = (pos/28)+1;
            ul.fadeOut(200);
            
            if(main)
                loadCategory();
            else
                self.next('input').val(category);
        });
    });
    
    
    
    var new_marker = false;
    
    $('a.new').click(function() {
        list.hide();
        info.hide();
        form.fadeIn();
        
        var fieldsets = form.find('fieldset');
        fieldsets.eq(1).hide();
        
        var submit = form.find('input[type=image]').hide();
        
        map.clearOverlays();
        
        var new_marker = false;
        
        GEvent.addListener(map, "click", function(overlay, latlng) {
            if(new_marker) return false;
            
            form.get(0).lat.value = latlng.y;
            form.get(0).long.value = latlng.x;
            
            fieldsets.eq(0).find('label').html('<b>Sijainti:</b> '+latlng.x+' x '+latlng.y);
            
            new_marker = new GMarker(latlng, {
                icon: add_icon,
                draggable: true
            });
            
            GEvent.addListener(new_marker, "dragend", function(latlng) {
                form.get(0).lat.value = latlng.y;
                form.get(0).long.value = latlng.x;
            });
            
            map.addOverlay(new_marker);
            
            fieldsets.eq(1).fadeIn();
            submit.fadeIn();
        });
    });
    
    form.submit(function() {
        var error = false;
        
        $(this).find('input[type=text], input[type=hidden], textarea').each(function() {
            if(this.value.length == 0) {
                error = true;
                $(this).addClass('error');
            }
            else {
                $(this).removeClass('error');
            }
        });
        
        if(error) {
            alert('Täytäthän kaikki kentät ensin...');
            return(false);
        }
        
        $.post('new.php', $(this).serialize(), function() {
            form.hide();
            list.show();
            
            markers = new Array();
            map.clearOverlays();
            
            category = 0;
            loadCategory();
        });
        
        return(false);
    });
});