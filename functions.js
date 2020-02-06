//find Min and max
function findMinMaxValue(albumName, numRow,dataMax,dataMin){
    for(var i=0;i<numCols-4;i++){
        if(dataMatrix[numRow][i]>dataMax){
            dataMax = dataMatrix[numRow][i];
        }
    }
    dataMin = dataMax;
    for(var i = 0; i<numCols-4; i++){
        if(dataMatrix[numRow][i]<dataMin){
            dataMin = dataMatrix[numRow][i];
        }
    }
    albumMax[numRow]=dataMax;
    albumMin[numRow]=dataMin;
    print(albumName + " maxvalue " + dataMax + " minvalue " + dataMin);
}

function BlockMove(event) {
    // Tell the browser to not to "bounce" the content.
    event.preventDefault();
}

// TODO: Implement the get camera matrix method
function getCameraMatrix() {
    var matrix = [];
    console.log("CamMatrix: ");
    console.log(cam.cameraMatrix.mat4);
    for(var i = 0; i < cam.cameraMatrix.mat4; i++) {
        matrix[i] = cam.cameraMatrix.mat4[i];
    }
    console.log(matrix);
    return matrix;
}
