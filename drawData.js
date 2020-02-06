function drawMonthData(year, month, langIdx) {
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
    // point(0, 0, 0);
    

    sphere(size / 3.5, 5, 3);
    // ellipse(x, y, size, size, 10);
    pop();
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

    // Draw year line cylinder
    // var totalHeight = (getYearIdx(endYear) * 12 + getMonthIdx(12)) * dh;
    // var cylinderRadius = trackRadius * 0.9;
    // fill('rgba(100, 90, 210, 0.05)');
    // noStroke();
    // push();
    // translate(0, -totalHeight/2, 0);
    // cylinder(cylinderRadius, totalHeight, 24, 1, false, false);
    // pop();
}