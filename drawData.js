function initControlPanel() {
    buttonRotate = createButton('Auto Rotate');
    buttonRotate.mousePressed(toggleAutoRotate);
    buttonRotate.position(20, 40);

    buttonTranslate = createButton('Auto Move');
    buttonTranslate.mousePressed(toggleAutoTanslate);
    buttonTranslate.position(20, 70);

    buttonPerspective = createButton('Perspective');
    buttonPerspective.mousePressed(togglePerspective);
    buttonPerspective.position(20, 100);

    let initStartYear = startYear;
    let initEndYear = startYear + 2;
    let sliderBlockInitY = 140;
    let sliderBlockInitX = 20;
    let sliderBlockDx = 80;
    let sliderBlockDy = 40;
    startYearLabel = createP("Start Year: ");
    startYearLabel.position(sliderBlockInitX, sliderBlockInitY);
    startYearValue = createP("" + initStartYear);
    startYearValue.position(sliderBlockInitX + sliderBlockDx, sliderBlockInitY);
    startYearSlider = createSlider(startYear, endYear, initStartYear, 1);
    startYearSlider.position(sliderBlockInitX, sliderBlockInitY + sliderBlockDy);
    startYearSlider.style('width', '120px');

    endYearLabel = createP("End Year: ");
    endYearLabel.position(sliderBlockInitX, sliderBlockInitY + sliderBlockDy * 2);
    endYearValue = createP("" + initEndYear);
    endYearValue.position(sliderBlockInitX + sliderBlockDx, sliderBlockInitY + sliderBlockDy * 2);
    endYearSlider = createSlider(startYear, endYear, initEndYear, 1);
    endYearSlider.position(sliderBlockInitX, sliderBlockInitY + sliderBlockDy * 3);
    endYearSlider.style('width', '120px');

    // Draw checkbox
    let initCheckboxX = 20;
    let initCheckboxY = windowHeight - 50;
    let checkboxDy = -25;
    let checkbox;
    for(var i = langIdxList.len - 1; i >= 0; i--) {
        checkbox = createCheckbox(" " + langList[i], langSwitch[i]);
        checkbox.position(initCheckboxX, initCheckboxY + checkboxDy * (langIdxList.len - 1 - i));
        checkbox.style('color', colorList[i]);
        checkbox.changed(checkboxChanged);
        langCheckboxes.unshift(checkbox);
    }
}


function drawMonthData(year, month, langIdx) {
    angleMode(RADIANS);
    var monthCheckoutTimes = datasetMatrix[getYearIdx(year)][getMonthIdx(month)][langIdx];
    var z = (getYearIdx(year) * 12 + getMonthIdx(month)) * dh;
    var x = Math.cos(Math.PI / 6 * getMonthIdx(month)) * (trackRadius + offset * langIdx);
    var y = Math.sin(Math.PI / 6 * getMonthIdx(month)) * (trackRadius + offset * langIdx);
    var c = colorList[langIdx];
    var size = monthCheckoutTimes;
    push();
    translate(x, -z, y);
    stroke(c);
    strokeWeight(2);
    ambientLight(0);
    c += 'cc';
    fill(c);
    // noStroke();
    // point(0, 0, 0);
    sphere(size / 3.5, 5, 3);
    // ellipse(x, y, size, size, 10);
    pop();
}

function drawMonthlyTrend(sYear, eYear) {
    // Read which year to start
    // Draw Data
    for (var y = sYear; y <= eYear; y++) {
        for (var m = 1; m <= 12; m++) {
            for(var i = 0; i < langIdxList.len; i++)
            drawMonthData(y, m, i);
        }
    }
}

function drawDayData(year, month, day, langIdx) {
    angleMode(RADIANS);
    var dayCheckoutTimes = datasetMatrixDays[getYearIdx(year)][getMonthIdx(month)][getDayIdx(day)][langIdx];
    if (dayCheckoutTimes == 0)
        return;
    var totalMonthDays = (year % 4 == 0 && month == 2) ? monthDays[getMonthIdx(month)] + 1 : monthDays[getMonthIdx(month)];
    var ddh = dh / totalMonthDays;
    var z = (getYearIdx(year) * 12 + getMonthIdx(month)) * dh + getDayIdx(day) * ddh;
    var angle = Math.PI / 6 * getMonthIdx(month) + Math.PI / 6 / totalMonthDays * getDayIdx(day);
    var x = Math.cos(angle) * (trackRadius + offset * langIdx);
    var y = Math.sin(angle) * (trackRadius + offset * langIdx);
    var c = colorList[langIdx];
    var size = Math.pow(dayCheckoutTimes, 1.1) * 2;
    push();
    translate(x, -z, y);
    rotateY(-angle);
    stroke(c);
    strokeWeight(3);
    ambientLight(0);
    c += 'cc';
    fill(c);
    // torus(size, 4, 5, 12);
    circle(0, 0, size)
    pop();    
}

function drawDailyData(sYear, eYear) {
    // Draw Data
    for (var y = sYear; y <= eYear; y++) {
        for (var m = 1; m <= 12; m++) {
            var totalDays = monthDays[getMonthIdx(m)];
            if (y % 4 == 0 && m == 2)
                totalDays += 1;
            for (var d = 1; d <= totalDays; d++){
                for(var i = 0; i < langIdxList.len; i++) {
                    if (langSwitch[i])
                        drawDayData(y, m, d, i);
                }
            }
        }
    }
}

function drawTimeLine(sYear, eYear) {
    angleMode(DEGREES);
    textAlign(LEFT, BOTTOM);
    for (var y = sYear; y <= eYear; y++) {
        for (var m = 1; m <= 12; m++) {
            var rotationIndex = getMonthIdx(m);
            var angle = rotationIndex * 360.0 / 12;
            // -y direction points up
            var axis = createVector(0, -1, 0);
            push();
            rotate(angle, axis);
            stroke('rgba(100, 90, 210, 0.50)');
            strokeWeight(3.5);
            
            // Draw timeline scale
            var h = (getYearIdx(y) * 12 + getMonthIdx(m)) * dh;
            line(trackRadius * 0.9, -h, 0, trackRadius * 0.95, -h, 0);
            var v = createVector(offset * (langIdxList.len - 1) + dateBarLength * 0.2, offset * (langIdxList.len - 1) + dateBarLength, h);
            line(trackRadius + v.x , - v.z, 0, trackRadius + v.y, - v.z, 0);

            push();
            translate(trackRadius + v.y, -v.z, 0);
            axis = createVector(0, 1, 0);
            translate(0, 10, 0);
            rotate(90, axis);
            fill('rgba(150, 120, 255, 0.95)');
            strokeWeight(3);
            textFont(Gotham);
            textSize(10);
            text(m, 5, 0);
            pop();

            // Draw timeline label
            axis = createVector(1, 0, 0);
            rotate(90, axis);
            fill('rgba(150, 120, 255, 0.95)');
            strokeWeight(3);
            textFont(Gotham);
            textSize(10);
            translate(0, 0, v.z);
            text(monthStrings[getMonthIdx(m)], trackRadius + v.x, -5);
            pop();
        }
    }

    // Draw helix
    stroke('rgba(100, 90, 210, 0.15)');
    strokeWeight(3);
    noFill();
    beginShape();
    let helixRadius = trackRadius + offset * (langIdxList.len - 1) + + dateBarLength * 0.2 - 2;
    for (var y = sYear; y <= eYear; y++) {
        for (var m = 1; m <= 12; m++) {
            var rotationIndex = getMonthIdx(m);
            var angle = rotationIndex * 360.0 / 12;
            // -y direction points up
            var h = (getYearIdx(y) * 12 + getMonthIdx(m)) * dh;
            var v = createVector(cos(angle) * helixRadius, -h, sin(angle) * helixRadius);
            // Insert vertex for the first point
            if (y == sYear && m == 1) {
                angle = - 360.0 / 12;
                var hh = (getYearIdx(y) * 12 + getMonthIdx(m) - 1) * dh;
                var vv = createVector(cos(angle) * helixRadius, -hh, sin(angle) * helixRadius);
                curveVertex(vv.x, vv.y, vv.z);
            }
            curveVertex(v.x, v.y, v.z);
            // Append vertex for the last point
            if (y == eYear && m == 12) {
                angle = 0;
                var hh = (getYearIdx(y) * 12 + getMonthIdx(m) + 1) * dh;
                var vv = createVector(cos(angle) * helixRadius, -hh, sin(angle) * helixRadius);
                curveVertex(vv.x, vv.y, vv.z);
            }
        }
    }
    endShape();

    // Year label
    stroke('rgba(100, 90, 210, 0.25)');
    strokeWeight(3);
    textAlign(CENTER, CENTER);
    for (var y = sYear; y <= eYear; y++) {
        var h = (dh * 12) * getYearIdx(y) + dh * 6;
        var hb = (dh * 12) * getYearIdx(y);
        var ht = hb + 12 * dh;
        var lineLen = trackRadius / 4;
        push();

        // Draw year seperator lines
        line(-lineLen/2, -hb, 0, lineLen/2, -hb, 0);
        line(0, -hb - 2, 0, 0, -hb - 3 * dh, 0);
        line(0, -ht + 2, 0, 0, -ht + 3 * dh, 0);
        if (y == eYear)
            line(-lineLen/2, -ht, 0, lineLen/2, -ht, 0);
        
        // Draw year label
        fill('rgba(150, 120, 255, 0.95)');
        textFont(Gotham);
        textSize(yearLabelFontSize);
        translate(0, -h, 0);
        text(y, 0, 0);
        pop();
    }
    
}