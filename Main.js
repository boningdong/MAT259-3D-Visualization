/*************************************************************************************
 Data Visualization - Basic 3D Demo                

 Author: Weidi Zhang                        
 Supervisor: George Legrady                           

 Purpose: Show how to present volume data in a basic 3D environment     

 Usage:

1.Left-clicking and dragging will rotate the camera position about the center of the sketch
2.right-clicking and dragging will pan the camera position without rotation
3.using the mouse wheel (scrolling) will move the camera closer or further from the center of the sketch. 

2.Press 'a' 's''d''f' will show four different albums respectively

step 1. preload files
step 2. setup - initialize data and get basic information
step 3. draw - draw data titles and labels
step 4. user interface design and user interactions
 *************************************************************************************/
let dataset;
let tableIdx = {
    title: 1,
    times: 2,
    year: 3,
    month: 4,
    day: 5,
    minIdx: function() {
        return 1;
    }, 
    maxIdx: function() {
        return 5;
    }
};

// DatasetMatrix
let datasetMatrix = [];
let datasetMatrixDays = [];
const monthDays = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
const langList = ['Python', 'C/C++', 'Swift', 'Javascript', 'Java', 'PHP', 'SQL', 'Kotlin', 'Ruby'];
const colorList = ['#C68DFF', '#64C1FF', '#FFA024', '#FFF18D', '#FF6F00', '#75FFE4', '#9AFF75', '#6CFFF1', '#E44646']
const langSwitch = [true, true, true, true, true, true, true, true, true];
const langIdxList = {
    'python': 0,
    'ccpp': 1,
    'swift': 2, 
    'javascript': 3,
    'java': 4,
    'php': 5,
    'sql': 6,
    'kotlin': 7,
    'ruby':8,
    len: 9
}
const monthStrings = ["Jan.", "Feb.", "Mar.", "Apr.", "May", "June", "July", "Aug.", "Sept.", "Oct.", "Nov.", "Dec."];
const startYear = 2006
const endYear = 2020
function getYearIdx(year) {return year >= 2006 && year <= 2020 ? year - 2006 : NaN;}
function getMonthIdx(month) {return month >= 1 && month <= 12 ? month - 1 : NaN;}
function getDayIdx(day) {return day >= 1 && day <= 31 ? day - 1 : NaN;}

let cam;
let cameraTranslation;

const translateBound = dh * 12 * (endYear - startYear);
const initialHeight = dh * 12 * 1.2;

let isAutoRotation = true;
let isAutoTranslate = false;
let isPerspective = true;

let lastTime = 0;
let currentTime = 0;
let deltaTime = 0;

let totalTranslateDistance = 0;
let totalRotationAngle = 0;

// GUI Panel
let buttonRotate, buttonTranslate;
let buttonPerspective;
let yearLabel = "All years";
let startYearLabel, endYearLabel;
let startYearValue, endYearValue;
let startYearSlider, endYearSlider;
let langCheckboxes = [];

function preload() {
    Gotham = loadFont('data/Gotham-Bold.otf');
    DIN = loadFont('data/DIN.otf');
    dataset = loadTable("data/ProgLangTrendWithDates.csv", 'csv', 'header');
}

function setup() {
    createCanvas(windowWidth, windowHeight, WEBGL); // processing we use size(x,y, P3D)
    // Sets a perspective projection for the camera in a 3D sketch.
    // perspective([fovy], [aspect], [near], [far])
    cam = createCamera();
    cam.perspective(PI / 3.0, width / height, 0.1, 5000);
    cam.move(0, -initialHeight, 0);

    // Initialize dataset matrix table
    /* This table will be like
    --------------------------
    2006
        1
            python: num
            c: num
            ...
        2
        3
        ...
    2007
    2008
    ...
    -------------------------- */
    print("Initializing dataset matrix!");
    for (var yy = startYear; yy <= endYear; yy++) {
        datasetMatrix[getYearIdx(yy)] = [];
        for (var mm = 1; mm <= 12; mm++) {
            datasetMatrix[getYearIdx(yy)][getMonthIdx(mm)] = [];
            // Initialize language tables
            for (var i = 0; i < Object.keys(langIdxList).length - 1; i++) {
                datasetMatrix[getYearIdx(yy)][getMonthIdx(mm)][i] = 0;
            }
        }
    }
    print("datasetMatrix has been initialized!");
    // Initialize dataset matrix with days
    /* This table will be like
    --------------------------
    2006
        1
            1
                python: num
                c: num
                ...
            2
            ...
        2
        3
        ...
    2007
    2008
    ...
    -------------------------- */
    print("Initializing dataset (days) matrix!");
    for (var yy = startYear; yy <= endYear; yy++) {
        datasetMatrixDays[getYearIdx(yy)] = [];
        for (var mm = 1; mm <= 12; mm++) {
            datasetMatrixDays[getYearIdx(yy)][getMonthIdx(mm)] = [];
            
            for (var dd = 0; dd < monthDays[getMonthIdx(mm)]; dd++) {
                datasetMatrixDays[getYearIdx(yy)][getMonthIdx(mm)][dd] = [];
                for (var i = 0; i < Object.keys(langIdxList).length - 1; i++) {
                    datasetMatrixDays[getYearIdx(yy)][getMonthIdx(mm)][dd][i] = 0;
                }
            }
            // Check if Feb has 29 days.
            if ((yy % 4 == 0) && (mm == 2)) {
                datasetMatrixDays[getYearIdx(yy)][getMonthIdx(mm)][28] = [];
                for (var i = 0; i < Object.keys(langIdxList).length - 1; i++) {
                    datasetMatrixDays[getYearIdx(yy)][getMonthIdx(mm)][dd][i] = 0;
                }
            }
        }
    }
    print("Done initializing dataset (days) matrix!");
    
    
    // Fill in the data from the table
    num_rows = dataset.getRowCount();
    num_cols = dataset.getColumnCount();
    print("Rows " + num_rows + " , Columns: " + num_cols);
    
    // retrieve data from table
    for (var i = 0; i < num_rows; i++) {
        var langIdx = -1;
        var title = dataset.getString(i, tableIdx.title);
        var checkoutTimes = dataset.getNum(i, tableIdx.times);
        var year = dataset.getNum(i, tableIdx.year);
        var month = dataset.getNum(i, tableIdx.month);
        var day = dataset.getNum(i, tableIdx.day);
        title = title.toLowerCase();
        title = ' ' + title + ' '

        //['Python', 'C/C++', 'Swift', 'C#', 'Javascript', 'Java', 'PHP', 'SQL', 'Kotlin', 'Ruby'];
        if (title.includes(' python '))
            langIdx = langIdxList.python;
        else if (title.includes('javascript'))
            langIdx = langIdxList.javascript;
        else if (title.includes('java'))
            langIdx = langIdxList.java;
        else if (title.includes(' php '))
            langIdx = langIdxList.php;
        else if (title.includes(' sql '))
            langIdx = langIdxList.sql;
        else if (title.includes(' kotlin '))
            langIdx = langIdxList.kotlin;
        else if (title.includes(' swift '))
            langIdx = langIdxList.swift
        else if (title.includes('ruby'))
            langIdx = langIdxList.ruby;
        else if (title.includes(' c++ ') || title.includes(' c '))
            langIdx = langIdxList.ccpp;

        if (langIdx == -1) {
            print("Cannot classify the book based on its title.");
            print("Title: " + title);
            continue;
        }

        datasetMatrix[getYearIdx(year)][getMonthIdx(month)][langIdx] += checkoutTimes;
        datasetMatrixDays[getYearIdx(year)][getMonthIdx(month)][getDayIdx(day)][langIdx] += checkoutTimes;
    }
    console.log("dataset with days");

    // Control Panel
    initControlPanel();

    cameraTranslation = createVector(0, 0, 0);
    getCameraMatrix();
}

function draw() {
    // find the dt for translation
    currentTime = millis() / 1000.0;
    deltaTime = currentTime - lastTime;
    lastTime = currentTime;

    orbitControl(0.5, 0.5, 0.5);
    
    translate(0, initialHeight, 0);
    moveCamera();
    tiltCamera();

    if (isAutoRotation) {
        totalRotationAngle += deltaTime * 5;
    }
    if (isAutoTranslate) {
        if(totalTranslateDistance < translateBound)
            totalTranslateDistance += deltaTime * 5;
        
    } 
    // Read which year to start
    var sYear = startYearSlider.value();
    var eYear = endYearSlider.value();
    startYearValue.html("" + sYear);
    endYearValue.html("" + eYear);
    rotateY(totalRotationAngle);
    background('#161524');
    lights();
    translate(0, totalTranslateDistance, 0);  
    drawDailyData(sYear, eYear);
    drawTimeLine(sYear, eYear);
}

function moveCamera() {
    // Get the code from http://keycode.info/
    if (keyIsDown(87)){ //w
        cameraTranslation.z -= cameraSpeed;
    } else if (keyIsDown(83)) { //s
        cameraTranslation.z += cameraSpeed;
    } else if (keyIsDown(65)) { //a
        cameraTranslation.x -= cameraSpeed;
    } else if (keyIsDown(68)) { //d
        cameraTranslation.x += cameraSpeed;
    } else if (keyIsDown(CONTROL)) {
        cameraTranslation.y += cameraSpeed;
    } else if (keyIsDown(32)) {
        cameraTranslation.y -= cameraSpeed;
    }
    cam.move(cameraTranslation.x, cameraTranslation.y, cameraTranslation.z);
    cameraTranslation = createVector(0, 0, 0);
}

function tiltCamera() {
    angleMode(DEGREES);
    if (keyIsDown(38)) { //up
        cam.tilt(-cameraOmega);
    } else if (keyIsDown(40)) {//down
        cam.tilt(cameraOmega);
    }
}





















