// voit tutkia tarkemmin käsiteltäviä tietorakenteita konsolin kautta 
// tai json-editorin kautta osoitteessa http://jsoneditoronline.org/
// Jos käytät json-editoria niin avaa data osoitteesta:
// http://appro.mit.jyu.fi/tiea2120/vt/vt1/2019/data.json

// Seuraavilla voit tutkia selaimen konsolissa käytössäsi olevaa tietorakennetta. 

console.log(data);

//console.dir(data);

// voit vapaasti luoda data-rakenteen pohjalta omia aputietorakenteita

// Kirjoita tästä eteenpäin oma ohjelmakoodisi

"use strict";

/**
 * Funktio tulostaa data esiintyvien joukkueiden nimet aakkosjärjestyksessä
 * @param {*} data data jossa joukkueet esiintyvät
 */
function tulostaJoukkueet(data) {
    let printArr = [];

    data.forEach(element => {
        element.sarjat.forEach(sarja => {
            printArr = printArr.concat(sarja.joukkueet);
        });
    });

    printArr.sort((a, b) => (a.nimi > b.nimi) ? 1 : -1);
    printArr.forEach(joukkue => {
        console.log(joukkue.nimi);
    });
}

/**
 * Funktio lisää datarakenteeseen uuden joukkueen
 * @param {object} data datarakenne johon joukkue lisätään
 * @param {string} kilpailu kilpailun nimi johon joukkue lisätään
 * @param {object} joukkue lisätävän joukkueen tiedot objektina
 * @param {string} sarja sarja johon joukkue lisätään
 */
function lisaaJoukkue(data, kilpailu, joukkue, sarja) {
    let kIdx = data.findIndex(element => element.nimi === kilpailu);
    if (kIdx !== -1) {
        let sIdx = data[kIdx].sarjat.findIndex(element => element.nimi === sarja);
        if (sIdx !== -1) {
            data[kIdx].sarjat[sIdx].joukkueet.push(joukkue);
        }
    }
    tulostaJoukkueet(data);
}

/**
 * Funktio tulostaa rastien rastikoodit aakkosjärjestyksessä, jos rastikoodi alkaa kokonaisluvulla.
 * @param {Array} rastit taulukko rasteista
 */
function tulostaRastit(rastit) {
    let filtered = rastit.filter(rasti => /^\d/.test(rasti.koodi)).map(rasti => rasti.koodi);
    filtered.sort((a, b) => (a > b) ? 1 : -1);
    console.log(filtered.join(';'));
}

let uusiJoukkue = {
    "nimi": "Mallijoukkue",
    "jasenet": [
        "Tommi Lahtonen",
        "Matti Meikäläinen"
    ],
    "id": 99999
}

// luodaan uusi taulukko kaikkien kilpailujen rasteja varten
let rastit = [];

//data.map(element => element.rastit.map(el => el));
//console.log(rastit);

data.forEach(element => {
    rastit = rastit.concat(element.rastit);
});

lisaaJoukkue(data, "Jäärogaining", uusiJoukkue, "8h")
tulostaRastit(rastit);