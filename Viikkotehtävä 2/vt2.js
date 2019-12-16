// data-muuttuja on sama kuin viikkotehtävässä 1.
//

"use strict";

console.log(data);

window.onload = function() {
    // Luodaan taulkon sisältö ja järjestetään se oikeaan järjestykseen
    let sisalto = [];
    data.forEach(kilpailu => {
        kilpailu.sarjat.forEach(sarja => {
            sarja.joukkueet.forEach(joukkue => {
                sisalto.push({ nimi: sarja.nimi, joukkue: joukkue.nimi });
            });
        });
    });
    sisalto.sort((a, b) => a.nimi.localeCompare(b.nimi) || a.joukkue.localeCompare(b.joukkue));

    // Määritetään taulukon otsikot ja mikä arvo tietorakenteessa kuuluu mihinkin sarakkeeseen.
    let sarakkeet = [{
            otsikko: "Sarjat",
            arvot: "nimi"
        },
        {
            otsikko: "Joukkueet",
            arvot: "joukkue"
        }
    ];

    // määritetään luotavat kentät
    let rastiKentat = [{
            label: "Lat",
            type: "text",
            id: "lat"
        },
        {
            label: "Lon",
            type: "text",
            id: "lon"
        },
        {
            label: "Koodi",
            type: "text",
            id: "koodi"
        }
    ];

    let tupa = document.getElementById("tupa");
    let taulukko = luoTaulukko(sisalto, sarakkeet, "Tulokset");
    tupa.appendChild(taulukko);

    let lomake = document.getElementsByTagName("form")[0];
    let kentat = luoLomake(rastiKentat);
    lomake.appendChild(kentat);

    let button = document.getElementById("rasti");
    button.addEventListener("click", klikkikasittelija);
};

/**
 * Käsittelee klikit kun painetaan tallenna nappia
 * @param {*} e event
 */
function klikkikasittelija(e) {
    e.preventDefault();
    luoRasti();
    var rastit = [];
    data.forEach(element => {
        rastit = rastit.concat(element.rastit);
    });
    tulostaRastit(rastit);
}

/**
 * Lisää uuden rasti Jäärogainen kilpailuun.
 */
function luoRasti() {
    let keys = Object.keys(data[2].rastit[0]);
    let rasti = {};

    keys.forEach(key => {
        if (key === "id") {
            return;
        }
        let input = document.getElementById(key);
        rasti[key] = input.value;
    });

    if (Object.values(rasti).some(value => value === "")) {
        console.log(rasti);
        return;
    }

    let id = 0;
    while (id === 0 || data[2].rastit.some(rasti => rasti.id === id)) {
        id = Math.floor(Math.random() * 1000000000000000);
    }
    rasti.id = id;
    data[2].rastit.push(rasti);
    data[2].rastit.sort((a, b) => {
        a.id > b.id;
    });

    data[2].rastit.forEach(rasti => {
        let string =
            "Koodi: " + rasti.koodi + ", Lat: " + rasti.lat + ", Lon: " + rasti.lon;
    });
}

/**
 * Funktio luo lomakke elementin
 * @kentat {array} taulu, joka sisältää lisättävät kentät
 * @returns {element} luotu lomake elementti
 */
function luoLomake(kentat) {
    let fieldSet = document.createElement("fieldset");
    let legend = document.createElement("legend");
    legend.appendChild(document.createTextNode("Rastin tiedot"));
    fieldSet.appendChild(legend);

    kentat.forEach(kentta => {
        let p = luoKentta(kentta.label, kentta.type, kentta.id);
        fieldSet.appendChild(p);
    });

    let p = document.createElement("p");
    let button = document.createElement("button");
    button.setAttribute("name", "rasti");
    button.setAttribute("id", "rasti");
    button.appendChild(document.createTextNode("Tallenna"));

    p.appendChild(button);
    fieldSet.appendChild(p);

    return fieldSet;
}

/**
 *
 * @param {string} labelText label elementin arvo
 * @param {string} type input elementin tyyppi
 * @param {string} id input elementin id
 * @returns {element} p elementin, joka sisältää label ja input elementit
 */
function luoKentta(labelText, type, id) {
    let p = document.createElement("p");
    let label = document.createElement("label");

    let input = document.createElement("input");
    input.setAttribute("type", type);
    input.setAttribute("id", id);
    input.setAttribute("value", "");

    label.appendChild(document.createTextNode(labelText));
    label.appendChild(input);
    p.appendChild(label);
    return p;
}

/**
 * Funktio luo taulukon annetun sisällön ja sarakkeiden perusteella
 * @param {Array} taulukonSisalto tietorakenne, jonka perusteella taulukko luodaan
 * @param {array} sarakkeet taulukossa käytettävät sarakkeet
 * @param {String} taulukonOtsikko taulukon otsikko
 * @returns {element} funktion luoma taulukko
 */
function luoTaulukko(taulukonSisalto, sarakkeet, taulukonOtsikko) {
    let taulukko = document.createElement("table");
    let caption = document.createElement("caption");

    caption.appendChild(document.createTextNode(taulukonOtsikko));
    taulukko.appendChild(caption);

    let rivi = document.createElement("tr");
    sarakkeet.forEach(sarake => {
        let solu = document.createElement("th");
        solu.appendChild(document.createTextNode(sarake.otsikko));
        rivi.appendChild(solu);
    });
    taulukko.appendChild(rivi);

    taulukonSisalto.forEach(element => {
        let rivi = document.createElement("tr");
        sarakkeet.forEach(sarake => {
            let solu = document.createElement("td");
            solu.appendChild(document.createTextNode(element[sarake.arvot]));
            rivi.appendChild(solu);
        });
        taulukko.appendChild(rivi);
    });
    return taulukko;
}

/**
 * Funktio tulostaa rastien rastikoodit aakkosjärjestyksessä, jos rastikoodi alkaa kokonaisluvulla.
 * @param {Array} rastit taulukko rasteista
 */
function tulostaRastit(rastit) {
    rastit.forEach(rasti => console.log("Rasti id: ", rasti.koodi, "lat: ", rasti.lat, "lon: ", rasti.lon));
}