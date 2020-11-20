"use strict"

// Ширина и высота экрана
const vw = Math.max(
    document.documentElement.clientWidth || 0,
    window.innerWidth || 0
);
const vh = Math.max(
    document.documentElement.clientHeight || 0,
    window.innerHeight || 0
);

// Инициализация канваса
let canvas = document.querySelector(".canvas");
let ctx = canvas.getContext("2d");

// Растягиваем на весь экран
canvas.width = vw;
canvas.height = vh;

let drawPolygon = (f) => {
    ctx.strokeStyle = 'black';
    ctx.fillStyle = f.fill;
    ctx.beginPath();
    ctx.moveTo(f.points[0].x + f.dx, f.points[0].y + f.dy);
    for (let i = 1; i < f.points.length; i++) {
        ctx.lineTo(f.points[i].x + f.dx, f.points[i].y + f.dy);
    }
    ctx.lineTo(f.points[0].x + f.dx, f.points[0].y + f.dy);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
};

let boatBottom = {
    points: [
        { x: 86, y: 407 },
        { x: 330, y: 407 },
        { x: 435, y: 306 },
        { x: 0, y: 306 }
    ],
    dx: 0,
    dy: 0,
    fill: 'Sienna'
};

let boatSail = {
    points: [
        { x: 215, y: 305 },
        { x: 218, y: 51  },
        { x: 54,  y: 233 }
    ],
    dx: 0,
    dy: 0,
    fill: 'Gold'
};

let boatFlag = {
    points: [
        { x: 218, y: 50 },
        { x: 218, y: 20  },
        { x: 170, y: 35  },
    ],
    dx: 0,
    dy: 0,
    fill: 'OrangeRed'
};

let render = (dx = 0) => {
    boatBottom.dx += dx;
    boatSail.dx += dx;
    boatFlag.dx += dx;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawPolygon(boatBottom);
    drawPolygon(boatSail);
    drawPolygon(boatFlag);
};

render();



let animationFlag = false;
let animate = () => {
    animationFlag = true;
    let prev = performance.now();
    requestAnimationFrame(function measure(time) {
        render(1 / 30 * (time - prev));
        prev = time;
        if (animationFlag) requestAnimationFrame(measure);
    });
};
animate();

let intersect

let inner = (f, p) => {
    let res = false;
    let n = f.points.length;
    for (let i = 0; i < n; i++) {
        let cur = { x: f.points[i].x + f.dx, y: f.points[i].y + f.dy };

        let prev_i = (i + n - 1) % n;
        let prev = { x: f.points[prev_i].x + f.dx, y: f.points[prev_i].y + f.dy };

        let next_i = (i + 1) % n;
        let next = { x: f.points[next_i].x + f.dx, y: f.points[next_i].y + f.dy };
        
        if (prev.y == cur.y && prev.y == p.y) {
            if (prev.x <= p.x && p.x <= cur.x) {
                return true;
            }
        }
        else if (cur.y < p.y && prev.y < p.y || cur.y > p.y && prev.y > p.y) {
            continue;
        }
        else if (cur.y < p.y && prev.y > p.y || cur.y > p.y && prev.y < p.y) {
            let x = (p.y - cur.y) * (prev.x - cur.x) / (prev.y - cur.y) + cur.x;

            if (p.x == x) {
                return true;
            }
            else if (p.x < x) {
                res = !res;
            }
        }
        else {
            if (cur.y == p.y) {
                if (prev.y < cur.y && cur.y < next.y || prev.y > cur.y && cur.y > next.y) {
                    res = !res;
                }
            }
        }
    }

    return res;
};

window.addEventListener('click', (e) => {
    let p = { x: e.clientX, y: e.clientY };
    animationFlag = false;

    setTimeout(() => {
        if (inner(boatBottom, p)) {
            boatBottom.fill = 'green';
        }
        if (inner(boatSail, p)) {
            boatSail.fill = 'green';
        }
        if (inner(boatFlag, p)) {
            boatFlag.fill = 'green';
        }
    
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawPolygon(boatBottom);
        drawPolygon(boatSail);
        drawPolygon(boatFlag);
        ctx.beginPath();
        ctx.moveTo(p.x - 15, p.y - 15);
        ctx.lineTo(p.x + 15, p.y + 15);
        ctx.moveTo(p.x + 15, p.y - 15);
        ctx.lineTo(p.x - 15, p.y + 15);
        // ctx.arc(p.x, p.y, 10, 0, 2 * Math.PI, false);
        ctx.strokeStyle = 'red';
        ctx.lineWidth = 2;
        ctx.stroke();
    }, 50);
    
});