function toggleAutoRotate() {
    isAutoRotation = !isAutoRotation;
}

function toggleAutoTanslate() {
    isAutoTranslate = !isAutoTranslate;
}

let cameraLocationPespective;

function togglePerspective() {
    isPerspective = !isPerspective;
    if (isPerspective) {
        cam.perspective(PI / 3.0, width / height, 0.1, 5000);
        orbitControl();
        cam.setPosition(0, 0, 0);
    }
    else {
        cam.ortho(-width / 2, width / 2, height / 2, -height / 2, 0, 500);
        cam.setPosition(0, 0, 0);
    }
}

function checkboxChanged() {
    console.log("Checkbox changed");
    for(var i = 0; i < langCheckboxes.length; i++) {
        langSwitch[i] = langCheckboxes[i].checked();
    }
}