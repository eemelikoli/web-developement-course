"use strict";

console.log(data);

var leimausValinnat = new Set();
var sarja = "";
window.onload = function() {
    // luodaan checkboxit saatavilla olevista leimaustavoista
    let leimausTavat = document.querySelectorAll(".valinnat")[0];
    data[2].leimaustapa.forEach((tapa, index) => {
        let valinta = luoKentta(tapa, "checkbox", tapa);
        leimausTavat.appendChild(valinta);
    });

    // luodaan radiobuttonit saatavilla olevista sarjoista
    let sarjat = document.querySelectorAll(".valinnat")[1];
    data[2].sarjat.sort((a, b) => a.nimi > b.nimi);
    data[2].sarjat.forEach((sarja, index) => {
        let valinta = luoKentta(sarja.nimi, "radio", sarja.nimi, "sarja", index);
        sarjat.appendChild(valinta);
    });

    //tulostetaan joukkueet ja luodaan muuttuja kaikkien sarjojen joukkueita varten
    var joukkueLista = tulostaJoukkueet(data);

    //validointi joukkueen nimen pituudelle ja olemassa oleville joukkueen nimille
    let nimi = document.getElementById("nimi");
    nimi.addEventListener("input", function(e) {
        //trimmataan välilyönnit nimen alusta ja lopusta
        let value = nimi.value.trim();
        // tarkistetaan ensin pituus ja sitten nimen esiintyminen
        if (value.length < 2) {
            nimi.setCustomValidity(
                "Nimen täytyy olla vähintään kaksi merkkiä pitkä."
            );
        } else if (
            joukkueLista
            .map(joukkue => joukkue.nimi.trim().toLowerCase())
            .indexOf(value.toLowerCase()) > -1
        ) {
            nimi.setCustomValidity("Saman niminen joukkue on jo olemassa.");
        } else {
            nimi.setCustomValidity("");
        }
        nimi.reportValidity();
    });

    // asetetaan arvo leimaustavoille sitä mukaa kun ne muuttuvat
    let checkboxit = document.querySelectorAll('input[type="checkbox"]');
    for (let c of checkboxit) {
        c.addEventListener("change", function(e) {
            if (e.target.checked) {
                leimausValinnat.add(e.target.value);
            } else {
                leimausValinnat.delete(e.target.value);
            }
        });
    }

    // päivitetään sarja muuttujalle käyttäjän valitsema sarja aina kun se muuttuu
    let radioButtonit = document.querySelectorAll('input[type="radio"]');
    for (let r of radioButtonit) {
        r.addEventListener("change", function(e) {
            sarja = r.value;
        });
    }

    // käsitellään lomakkeen lähettäminen
    let button = document.getElementById("tallenna");
    button.addEventListener("click", function(e) {
        let form = document.querySelector("form");
        tarkistaLeimaukset(form);

        e.preventDefault(); //estetään lähettäminen palvelimelle
        form.reportValidity();

        if (form.checkValidity()) {
            let joukkue = muodostaJoukkue(joukkueLista);
            lisaaJoukkue(data, "Jäärogaining", sarja, joukkue);
        }
    });
};

/**
 * Tarkistaa, että vähintään yksi leimaustapa on valittuna
 */
function tarkistaLeimaukset(form) {
    let checkboxit = document.querySelectorAll('input[type="checkbox"]');
    for (let c of checkboxit) {
        if (leimausValinnat.size) {
            c.setCustomValidity("");
        } else {
            c.setCustomValidity("Valitse ainakin yksi leimaustapa.");
            removeMsg();
        }
    }

}

function removeMsg() {
    let msg = document.getElementById('viesti');
    if (msg) {
        msg.parentNode.removeChild(msg);
    }
}

/**
 * Muodostaa joukkue objektin
 * @param {array} lista
 *
 */
function muodostaJoukkue(lista) {
    let joukkue = {
        nimi: "",
        jasenet: ["Foo Bar", "Bar Foo"],
        id: 0,
        leimaustapa: []
    };

    let id = 0;
    while (id === 0 || lista.some(joukkue => joukkue.id === id)) {
        id = Math.floor(Math.random() * 1000000000000000);
    }

    joukkue.id = id;
    joukkue.nimi = document.getElementById("nimi").value;
    joukkue.leimaustapa = Array.from(leimausValinnat);

    return joukkue;
}

/**
 * Funktio lisää datarakenteeseen uuden joukkueen
 * @param {object} data datarakenne johon joukkue lisätään
 * @param {string} kilpailu kilpailun nimi johon joukkue lisätään
 * @param {object} joukkue lisätävän joukkueen tiedot objektina
 * @param {string} sarja sarja johon joukkue lisätään
 */
function lisaaJoukkue(data, kilpailu, sarja, joukkue) {
    let kIdx = data.findIndex(element => element.nimi === kilpailu);
    if (kIdx !== -1) {
        let sIdx = data[kIdx].sarjat.findIndex(element => element.nimi === sarja);
        if (sIdx !== -1) {
            data[kIdx].sarjat[sIdx].joukkueet.push(joukkue);
        }
    }

    let body = document.querySelector("body");
    let form = document.querySelector('form');
    if (!document.getElementById('viesti')) {
        let msg = document.createElement("p");
        msg.setAttribute("id", "viesti");
        msg.appendChild(document.createTextNode('Joukkue ' + joukkue.nimi + " on lisätty."))
        body.insertBefore(msg, form);
    } else {
        let msg = document.getElementById('viesti');
        msg.textContent = 'Joukkue ' + joukkue.nimi + " on lisätty.";
    }

    form.reset();
    leimausValinnat.clear();
    tulostaJoukkueet(data);
}

/**
 *
 * @param {string} labelText label elementin arvo
 * @param {string} type input elementin tyyppi
 * @param {string} id input elementin id
 * @returns {element} label elementin, joka sisältää input elementin
 */
function luoKentta(labelText, type, id, name, index) {
    //let p = document.createElement('p');
    let label = document.createElement("label");
    label.setAttribute("for", id);

    let input = document.createElement("input");
    input.setAttribute("type", type);
    input.setAttribute("id", id);
    input.setAttribute("value", id);
    if (name !== undefined) {
        input.setAttribute("name", name);
    } else {
        input.setAttribute("name", id);
    }

    if (index === 0) {
        input.setAttribute("checked", "checked");
        sarja = id;
    }

    label.appendChild(document.createTextNode(labelText));
    //p.appendChild(label);
    label.appendChild(input);
    return label;
}

/**
 * Funktio tulostaa data esiintyvien joukkueiden nimet aakkosjärjestyksessä ja jokaisen joukkueen jäsenet aakkosjärjestyksessä
 * @param {*} data data jossa joukkueet esiintyvät
 */
function tulostaJoukkueet(data) {
    let joukkueet = document.getElementById("joukkueet");
    let printArr = [];

    data.forEach(element => {
        element.sarjat.forEach(sarja => {
            printArr = printArr.concat(sarja.joukkueet);
        });
    });
    printArr.sort((a, b) => (a.nimi.toLowerCase() > b.nimi.toLowerCase() ? 1 : -1));

    let ul = document.createElement("ul");
    printArr.forEach(joukkue => {
        let li = document.createElement("li");
        li.appendChild(document.createTextNode(joukkue.nimi));

        let inner_ul = document.createElement("ul");
        joukkue.jasenet.sort((a, b) => a > b);

        joukkue.jasenet.forEach(jasen => {
            let inner_li = document.createElement("li");
            inner_li.appendChild(document.createTextNode(jasen));
            inner_ul.appendChild(inner_li);
        });

        li.appendChild(inner_ul);
        ul.appendChild(li);
    });

    if (joukkueet.hasChildNodes()) {
        joukkueet.replaceChild(ul, joukkueet.childNodes[0]);
    } else {
        joukkueet.appendChild(ul);
    }

    return printArr;
}