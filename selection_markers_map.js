function selectionMarkersMap(setting, groups) {
    var id = setting.id;
    var idMenu = setting.idMenu;
    var idMenuTemplate = setting.idMenuTemplate;
    var activeClass = setting.activeClass;
    var activeEl = setting.activeEl;
    var center = setting.center;
    var iconUrl = setting.iconUrl;
    var iconSize = setting.iconSize;
    var zoom = setting.zoom;
    var accessToken = setting.accessToken;

    var $idMenu = $('#' + idMenu);

    var source = document.getElementById(idMenuTemplate).innerHTML;
    var template = Handlebars.compile(source);

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
    var customIconCenter = L.icon({iconUrl: iconUrl, iconSize: iconSize});

    // Creating a marker
    var markerCenter = new L.Marker(center, {clickable: false, draggable: false, icon: customIconCenter});
    // Adding marker to the map
    markerCenter.addTo(map);

    var layers = groups.map((group) => {
        var menu = group.menu
        var iconUrl = group.iconUrl
        var icons = group.icons

        var layer = icons.map(markerData => {
            // Icon options
            var iconOptions = {
                iconUrl: iconUrl,
                iconSize: iconSize
            }

            // Creating a custom icon
            var customIcon = L.icon(iconOptions);

            // Options for the marker
            var markerOptions = {
                clickable: false,
                draggable: false,
                icon: customIcon
            }
            // Creating a marker
            var marker = new L.Marker(markerData.center, markerOptions);

            return marker
        })

        var layerGroup = L.layerGroup(layer);
        if (menu.default) {
            layerGroup.addTo(map);
        }

        return {menu: menu, layerGroup: layerGroup}
    })

    layers.forEach((layer) => {
        var menu = layer.menu
        var layerGroup = layer.layerGroup

        menu.activeClass = activeClass
        menu.activeEl = activeEl
        var html = template(menu);
            $(html)
            .on('click', layerGroup, function (e) {
                var $this = $(this)
                var $activeEl = $this.find('.' + activeEl)
                if ($activeEl.hasClass(activeClass)) {
                    $activeEl.removeClass(activeClass)
                    // Removing layer from map
                    map.removeLayer(e.data);
                } else {
                    $activeEl.addClass(activeClass)
                    // add layer from map
                    e.data.addTo(map);

                }
            })
            .appendTo($idMenu)
    })
}
