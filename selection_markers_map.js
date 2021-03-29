function selectionMarkersMap({id, idMenu, menuItem , center, title, iconUrl, iconSize, zoom, accessToken}, groups) {
    var $idMenu = $('#' + idMenu);
    var $menuItem = $('.' + menuItem).clone();
    $('.' + menuItem).remove()

    var map = L.map(id).setView(center, zoom);

    L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        maxZoom: 18,
        id: 'mapbox/streets-v11',
        tileSize: 512,
        zoomOffset: -1,
        accessToken: accessToken
    }).addTo(map);

    // Creating a custom icon
    var customIconCenter = L.icon({ iconUrl: iconUrl, iconSize: iconSize });

    // Creating a marker
    var markerCenter = new L.Marker(center, { title: title, clickable: true, draggable: false, icon: customIconCenter });
    markerCenter.bindPopup(title).openPopup();
    // Adding marker to the map
    markerCenter.addTo(map);

    var layers = groups.map(group => {
      var layer = group.icons.map(markerData => {
            // Icon options
            var iconOptions = {
                iconUrl: group.iconUrl,
                iconSize: iconSize
            }

            // Creating a custom icon
            var customIcon = L.icon(iconOptions);

            // Options for the marker
            var markerOptions = {
                title: markerData.title,
                clickable: true,
                draggable: false,
                icon: customIcon
            }
            // Creating a marker
            var marker = new L.Marker(markerData.center, markerOptions);

            // Adding pop-up to the marker
            marker.bindPopup(markerData.title).openPopup();
            return marker
        })
        var layerGroup = L.layerGroup(layer);
        if (group.default) {
            layerGroup.addTo(map);
        }
        return layerGroup
    })

    groups.map((layer, i) => {
         $menuItem
             .clone()
             .append(layer.name)
             .addClass(layer.default ? 'active' : '')
             .on('click', layers[i], function (e) {
                 var $this = $(this)
                 if ($this.hasClass('active')){
                     $this.removeClass('active')
                     // Removing layer from map
                     map.removeLayer(e.data);
                 }else {
                     $this.addClass('active')
                     // add layer from map
                     e.data.addTo(map);

                 }
             })
             .appendTo($idMenu)
    })
}
