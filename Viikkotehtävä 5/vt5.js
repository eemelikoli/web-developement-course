console.log(data);

"use strict";

//alustetaan muuttujat
const idPrefix = "i";
var joukkueet = [],
    rastit = [],
    teamsOnMap = [];
var dragged,
    mymap;


$(window).on("load", function() {

    //luodaan kartta
    mymap = new L.map('map', {
        crs: L.TileLayer.MML.get3067Proj()
    });
    L.tileLayer.mml_wmts({ layer: "maastokartta" }).addTo(mymap);
    setMapSize(); //asetetaan karttaelementin koko


    // kerätään kaikki rastit tietorakenteesta
    data.forEach(element => {
        if (element.rastit.length > 0) {
            rastit = rastit.concat(element.rastit);
        }
    });
    // piirretään jokainen rasti kartalle
    for (var i = 0, j = rastit.length; i < j; i++) {
        L.circle(
            [rastit[i].lat, rastit[i].lon], {
                color: 'red',
                fillColor: '#f03',
                fillOpacity: 0.5,
                radius: 150
            }
        ).addTo(mymap);
    }
    fitMapToView(mymap, rastit);

    // kerätään kaikki joukkueet tietorakenteesta
    data.forEach(element => {
        element.sarjat.forEach(sarja => {
            joukkueet = joukkueet.concat(sarja.joukkueet);
        });
    });
    // lisätään kaikki joukkueet lista-elementtiin
    for (let i = 0, j = joukkueet.length; i < j; i++) {
        const joukkue = joukkueet[i];
        let color = rainbow(j, i);
        addToList(joukkue, color);
    }

    //luodaan tapahtumakuuntelijat 
    var onMap = document.querySelector("#on-map");
    onMap.addEventListener('dragover', dragOver);
    onMap.addEventListener('dragenter', dragEnter);
    onMap.addEventListener('dragleave', dragLeave);
    onMap.addEventListener('drop', dragDrop);
});

// jos ikkunan koko muuttuu niin päivitetään kartan koko
$(window).resize(setMapSize);

// addTo list with HTML drag-n-drop
function addToList(team, color) {
    let $li = $("<li></li>").text(team.nimi + '')
        .css("background-color", color)
        .addClass("team")
        .attr({ "id": idPrefix + team.id, "draggable": true });

    let $list = $("#not-on-map");
    $list.append($li);

    let li = document.querySelector("#" + idPrefix + team.id);
    li.addEventListener("dragstart", dragStart);
};


// addTo list with jquery ui drag-n-drop
/*
function addToList(team, color) {
    let $list = $("#not-on-map");
    let li = $("<li></li>").text(team.nimi + '').css("background-color", color)
        .attr("id", team.id)
        .addClass("team")
        .draggable({
            revert: "invalid",
            connectToSortable: "#on-map"
        });
    $list.append(li);
};
*/

//
function dragStart() {
    dragged = this;
}

//
function dragEnter() {
    this.className += " hovered";
}

//
function dragOver(e) {
    e.preventDefault();
}

//
function dragLeave() {
    this.className = "";
}

//
function dragDrop(e) {
    e.preventDefault();
    this.className = "";
    this.insertBefore(dragged, this.childNodes[0]);
    dragged.setAttribute("draggable", false);

    let teamColor = dragged.style.backgroundColor;
    let teamId = Number(dragged.id.slice(1));
    let team = joukkueet.find(function(element) {
        return element.id === teamId
    });

    addToMap(team, teamColor);
}

/**
 * 
 * @param {*} team 
 * @param {*} color 
 */
function addToMap(team, color) {

    //joukkueen rastien id:t rastitusjärjestestyksessä, sisältää myös rasteja joita ei ole olemassa
    let tags = team.rastit.map(function(element) {
        return Number(element.rasti);
    });

    let coordinates = rastit.filter(function(element) {
        return tags.includes(Number(element.id));
    }).sort(function(a, b) {
        return tags.indexOf(a.id) - tags.indexOf(b.id);
    }).map(function(element) {
        return [element.lat, element.lon];
    });
    var polyline = L.polyline(coordinates, { color: color }).addTo(mymap);
};

/**
 * 
 * @param {*} map 
 * @param {*} locations 
 */
function fitMapToView(map, locations) {

    //alustetaan näkymäalueelle koordinaatit
    let topLeft = [],
        bottomRight = [];

    for (var i = 0, j = locations.length; i < j; i++) {
        var coordinates = locations[i];
        if (topLeft[0] == undefined || topLeft[0] < coordinates.lat) {
            topLeft[0] = coordinates.lat;
        }
        if (topLeft[1] == undefined || topLeft[1] < coordinates.lon) {
            topLeft[1] = coordinates.lon;
        }
        if (bottomRight[0] == undefined || bottomRight[0] > coordinates.lat) {
            bottomRight[0] = coordinates.lat;
        }
        if (bottomRight[1] == undefined || bottomRight[1] > coordinates.lon) {
            bottomRight[1] = coordinates.lon;
        }
    }
    map.fitBounds([topLeft, bottomRight]);
}

function setMapSize() {
    let div = $("#map");
    div.css("width", 100 + "%");
    div.css("height", Math.round(window.innerHeight) / 2 + "px");
}

function rainbow(numOfSteps, step) {
    // This function generates vibrant, "evenly spaced" colours (i.e. no clustering). This is ideal for creating easily distinguishable vibrant markers in Google Maps and other apps.
    // Adam Cole, 2011-Sept-14
    // HSV to RBG adapted from: http://mjijackson.com/2008/02/rgb-to-hsl-and-rgb-to-hsv-color-model-conversion-algorithms-in-javascript
    let r, g, b;
    let h = step / numOfSteps;
    let i = ~~(h * 6);
    let f = h * 6 - i;
    let q = 1 - f;
    switch (i % 6) {
        case 0:
            r = 1;
            g = f;
            b = 0;
            break;
        case 1:
            r = q;
            g = 1;
            b = 0;
            break;
        case 2:
            r = 0;
            g = 1;
            b = f;
            break;
        case 3:
            r = 0;
            g = q;
            b = 1;
            break;
        case 4:
            r = f;
            g = 0;
            b = 1;
            break;
        case 5:
            r = 1;
            g = 0;
            b = q;
            break;
    }
    let c = "#" + ("00" + (~~(r * 255)).toString(16)).slice(-2) + ("00" + (~~(g * 255)).toString(16)).slice(-2) + ("00" + (~~(b * 255)).toString(16)).slice(-2);
    return (c);
}