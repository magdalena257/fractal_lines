var canvas = document.querySelector('canvas');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
var ctx = canvas.getContext('2d');
const inputFraction = document.getElementById('UI_fraction')

const inputTime = document.getElementById('UI_time')
// INTERFACE:
ctx.strokeStyle = "#352143"; // CHANGE COLOR OF THE BACKGROUND
const TECHNICAL_DRAWING = 0; //IF TRUE, DISPLAYS PARTS HELPFUL TO DEVELPEMENT
let fraction = 5; // HELPS SETTING THE RATIO, WHERE THE FIRST LINE WOULD HIT
const UI_colorFigure = document.getElementById('colorFigure');

const UI_colorLines = document.getElementById('colorLines');
// const UI_rotation = document.getElementById('rotation');
const btnDisplayUI = document.querySelector('button');
const form = document.querySelector('form');
const preset1 = document.getElementById('preset1');
const preset2 = document.getElementById('preset2');
const reset = document.getElementById('reset');
const inputRotation = document.getElementById('UI_rotation')
let time = 50 //SETS THE INTERVAL TIME OF CALLING THE DRAW LINES FUNCTION
let rotation = 0;



if (TECHNICAL_DRAWING) console.log("width i height: ", canvas.height, canvas.width);
let a; // ?????????
let maxX = window.innerWidth; // IF YOU WANT TO CHANGE THE WIDTH AND HEIGHT, GO TO STYLES.CSS
let maxY = window.innerHeight;
let ratio = window.innerHeight / fraction;


//LIST OF POINTS:

//LIST OF POINTS, WHERE THE LINES WILL START. NEXT POINTS WILL BE ADDED TO THIS LIST
let ArrPoints = [{
        x: 0,
        y: 0
    },
    {
        x: maxX,
        y: ratio
    },
    {
        x: maxX - ratio,
        y: maxY
    },
    {
        x: 0,
        y: maxY - ratio
    },
];
newBreakPoints();

btnDisplayUI.addEventListener('click', () => {

    form.style.display = 'flex';
    btnDisplayUI.style.display = 'none';
})

preset1.addEventListener('click', () => {

    inputFraction.value = 21;

    inputTime.value = 4;
    UI_colorFigure.checked = true;
    UI_colorLines.checked = false;

    inputRotation.value = 100;
});
preset2.addEventListener('click', () => {

    inputFraction.value = 2;

    inputTime.value = 14;
    UI_colorFigure.checked = true;
    UI_colorLines.checked = true;
    inputRotation.value = 0;
});
reset.addEventListener('click', () => {

    inputFraction.value = 6;

    inputTime.value = 50;
    UI_colorFigure.checked = false;
    UI_colorLines.checked = false;
    inputRotation.value = 0;
    color = `black`;

    clearInterval(rotationID);
    canvas.style.transform = `rotate(0deg)`;
    console.log(canvas.style.transform);

    document.body.style.backgroundColor = 'white';
    btnDisplayUI.style.backgroundColor = 'white';

})
//FULLFILLING THE ARRAY WITH BREAKPOINTS, USING RETURNBREAKPOINTS FUNCTION:
function newBreakPoints() {
    let i = 0;
    while (lineLength(ArrPoints[i], ArrPoints[i + 1]) > 10) {
        let newBreakPoint = returnBreakpoint(ArrPoints[i], ArrPoints[i + 1]);
        ArrPoints.push(newBreakPoint);
        i++;
    };
}

function returnBreakpoint(point1, point2) {

    let r = lineLength(point1, point2) * (1 / fraction);
    if (TECHNICAL_DRAWING) drawCircle(point1, r);
    let slope = ((point1.y - point2.y) / (point1.x - point2.x)); //from y = slope*x + yIntercept
    let yIntercept = (point1.y - slope * point1.x);

    //from forumla:
    let a = 1 + (slope * slope);
    let b = -point1.x * 2 + (slope * (yIntercept - point1.y)) * 2;
    let c = point1.x * point1.x + (yIntercept - point1.y) * (yIntercept - point1.y) - r * r;

    //from delta:
    let gx = (-b + Math.sqrt(b * b - 4 * a * c)) / (2 * a);
    let gy = slope * gx + yIntercept;
    let ox = (-b - Math.sqrt(b * b - 4 * a * c)) / (2 * a);
    let oy = slope * ox + yIntercept;

    // coming with two breakpoints, but only one of them is in the right direction (closer)
    let breakPoint1 = {
        x: gx,
        y: gy
    };
    let breakPoint2 = {
        x: ox,
        y: oy
    };

    if (lineLength(breakPoint1, point2) < lineLength(breakPoint2, point2)) {
        return breakPoint1;
    } else {
        return breakPoint2;
    };
};


//DRAWING LINES:

let j = 0; //number of line currently been drawing

let color = `black`;

let intervalID = setInterval(animateLines, time); //CALLS THE FUNCTION ANIMATELINES, AT INTERVALS OF SET TIME;
let rotationID;

function animateLines() {
    if (lineLength(ArrPoints[j], ArrPoints[j + 1]) > 10) {
        drawLines(ArrPoints[j], ArrPoints[j + 1], color);
        j++;
        //        console.log(j);
    } else {
        clearInterval(rotationID);
        if (parseInt(inputRotation.value)) {
            if (inputRotation.value)
                rotationID = setInterval(() => {
                    canvas.style.transform = `rotate(${rotation%360}deg`
                    rotation += parseInt(inputRotation.value);
                    console.log(rotation);
                }, time)

        } else clearInterval(rotationID);
        if (UI_colorFigure.checked);
        else color = 'white';
        document.body.style.backgroundColor = color;
        if (UI_colorFigure.checked) color = get_random_color();
        else color = 'black';
        canvas.style.borderColor = color;
        btnDisplayUI.style.color = color;
        form.style.color = color;
        btnDisplayUI.style.borderColor = color;
        j = 0;
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        if (inputTime.value) {
            time = inputTime.value;
            clearInterval(intervalID);
            intervalID = setInterval(animateLines, time);
        }

        if (inputFraction.value) {
            fraction = inputFraction.value;
            ratio = window.innerHeight / fraction;
            ArrPoints = [{
                    x: 0,
                    y: 0
                },
                {
                    x: maxX,
                    y: ratio
                },
                {
                    x: maxX - ratio,
                    y: maxY
                },
                {
                    x: 0,
                    y: maxY - ratio
                },
            ];
            // console.log(ArrPoints);
            newBreakPoints();

        }
    };
};


for (i of ArrPoints) {
    if (TECHNICAL_DRAWING == 1) {
        drawPoint(i);
    };
};

//THE CORE FUNCTION TO DRAW LINES"
function drawLines(point1, point2, color) {
    ctx.beginPath();
    ctx.moveTo(point1.x, point1.y);
    ctx.lineTo(point2.x, point2.y);
    if (UI_colorLines.checked === true) color = get_random_color();
    ctx.strokeStyle = color;
    ctx.lineWidth = 4;

    ctx.stroke();
};

//FOR TECHNICAL DRAWINGS:
function drawCircle(point, r) {
    ctx.beginPath();
    ctx.arc(point.x, point.y, r, 0, 2 * Math.PI);
    ctx.stroke();
};
//FOR TECHNICAL DRAWINGS:
function drawPoint(point) {
    ctx.beginPath();
    ctx.moveTo(point.x, point.y);
    ctx.fillStyle = "blue";
    ctx.arc(point.x, point.y, 3, 0, 2 * Math.PI);
    ctx.fill();
    ctx.stroke();
};

//FORUMLA FOR GETTING THE LENGTH, HAVING COORDINATES OF TWO POINTS:
function lineLength(pointA, pointB) {
    return Math.sqrt((Math.pow(Math.abs(pointA.x - pointB.x), 2) + (Math.pow(Math.abs(pointA.y - pointB.y), 2))));
};

//FUNC TO GET A RANDOM COLOR:
function get_random_color() {
    function c() {
        var hex = Math.floor(Math.random() * 256).toString(16);
        return ("0" + String(hex)).substr(-2); // pad with zero
    }
    return "#" + c() + c() + c();
};

//EXPERIMENTAL PART, TRYING TO DRAW POINTS INSTEAD OF LINES, DOESN'T WORK YET; 
//IN ORDER TO USE IT, IN FUNCTION ANIMATELINES CHANGE FROM DRAWLINES TO DRAWLINESFROMFORMULA

function drawLinesFromFormula(point1, point2, color) {
    let slope = ((point1.y - point2.y) / (point1.x - point2.x));
    let yIntercept = (point1.y - slope * point1.x);

    ctx.strokeStyle = color;

    let id = setInterval(function () {
        if (point1.x <= point2.x) {
            a = {
                x: point1.x,
                y: point1.x * slope + yIntercept
            };
            drawPoint(a);
            if (point1.x < point2.x) {
                point1.x += 10;
            } else {
                point1.x -= 10;
            };
            console.log(a);
        } else {
            clearInterval(id);
            console.log("NIE");
            console.log("points ", point1, point2);
        };
    }, 10);

};