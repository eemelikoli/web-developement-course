"use strict";

window.onload = function() {
    bunny();

    let p = 10;
    //p = Math.floor(Math.random() * 15);
    for (var i = 0; i < p; i++) {
        luoPalkki(i);
    }
}

/**
 * funktio luo kaksi kanvas elementtiä ja piirtää niille kaksi pupun puolikasta
 */
function bunny() {
    var canvas_1 = document.createElement('canvas'),
        ctx_1 = canvas_1.getContext('2d'),
        canvas_2 = document.createElement('canvas'),
        ctx_2 = canvas_2.getContext('2d');

    canvas_1.setAttribute('id', 'bunny-1');
    canvas_2.setAttribute('id', 'bunny-2');

    var bunny = document.querySelector('#bunny');
    bunny.appendChild(canvas_1);
    bunny.appendChild(canvas_2);

    var img = new Image();
    img.src = 'bunny.png';
    img.onload = function() {
        var w = img.width,
            h = img.height,
            clipY = 350,
            h2 = h - clipY;

        canvas_1.width = w;
        canvas_1.height = clipY;
        canvas_1.setAttribute("data-bunny-1-height", clipY);

        canvas_2.width = w;
        canvas_2.height = h2;
        canvas_2.setAttribute("data-bunny-12height", h2);

        //draw slice 1
        ctx_1.drawImage(img, 0, 0, w, clipY, 0, 0, w, clipY);

        //draw slice 2
        ctx_2.drawImage(img, 0, clipY, w, h2, 0, 0, w, h2);

    }
}

/***
 * luo koko sivun levyisen keltaisen palkin svg elementtinä
 *  {int} delay perusta animoinnin viivelle, joka elementille lisätään
 */
function luoPalkki(delay) {
    let svgns = 'http://www.w3.org/2000/svg';
    // luodaan svg elementti
    let svg = document.createElementNS(svgns, "svg");

    // astetaan svg-elementille luokka ja yksilöllinen viive inline tyylillä
    svg.setAttribute('class', 'palkki');
    svg.setAttribute('style', "animation-delay: " + delay / 4 + "s");

    // luodaan suorakulmio
    const rect = document.createElementNS(svgns, "rect");
    rect.setAttribute("width", "100%");
    rect.setAttribute("height", "100%");
    rect.setAttribute("fill", "url('#grad1')");

    var defs = document.createElementNS(svgns, 'defs');
    var gradient = document.createElementNS(svgns, 'linearGradient');

    // muuttujat gradientille
    var stops = [{
        "color": "rgb(0,0,0)",
        "offset": "0%",
        "opacity": "0"
    }, {
        "color": "rgb(255, 238, 0)",
        "offset": "40%",
        "opacity": "1"
    }, {
        "color": "rgb(255, 238, 0)",
        "offset": "60%",
        "opacity": "1"
    }, {
        "color": "rgb(0,0,0)",
        "offset": "100%",
        "opacity": "0"
    }];

    // lisää gradientin muuttujien perusteella gradientille <stop> elementit
    for (var i = 0, length = stops.length; i < length; i++) {
        // luodaan stop elementti ja lisätään siihen muuttujat
        var stop = document.createElementNS(svgns, 'stop');
        stop.setAttribute('offset', stops[i].offset);
        stop.setAttribute('stop-color', stops[i].color);
        stop.setAttribute('stop-opacity', stops[i].opacity);

        // lisätään stop elementti gradientille
        gradient.appendChild(stop);
    }

    // lisätään gradient elementille attribuutit ja id
    gradient.id = 'grad1';
    gradient.setAttribute('x1', '0');
    gradient.setAttribute('x2', '0');
    gradient.setAttribute('y1', '0');
    gradient.setAttribute('y2', '75%');

    // lisätään gradient elementti defs elementille ja defs sekä rect elementit svg elementille
    defs.appendChild(gradient);
    svg.appendChild(defs);
    svg.appendChild(rect);

    document.querySelector('body').appendChild(svg);
}


/*
//pupun animointi toteutettu canvas animaationa
img.onload = function() {
    var w = img.width,
        h = img.height;

    canvas_1.width = w;
    canvas_2.width = w;
    canvas_1.height = window.innerHeight - 10;

    var x = canvas.width / 2 - w / 2,
        y = canvas.height / 2 - h / 2,
        y1 = y,
        y2 = y,
        dy = 3,
        clipY = 300,
        h2 = h - clipY;

    //draw slice 1
    ctx.drawImage(img, 0, 0, w, clipY, x, y1, w, clipY);

    //draw slice 2
    ctx.drawImage(img, 0, clipY, w, h - clipY, x, y2 + clipY, w, h - clipY);

    function animate() {
        requestAnimationFrame(animate);
        ctx.clearRect(0, 0, innerWidth, canvas.height);

        //draw slice 1
        ctx.drawImage(img, 0, 0, w, clipY, x, y1, w, clipY);

        //draw slice 2
        ctx.drawImage(img, 0, clipY, w, h - clipY, x, y2 + clipY, w, h - clipY);

        if (y1 < 0 || (y1 > y || y2 < y) || y2 + clipY + h2 > canvas.height) {
            dy = -dy;
        }

        y1 -= dy;
        y2 += dy;
    }
    animate();         
}*/