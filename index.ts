const dirTree = require("directory-tree"); // reads directory and finds all images in it
const fs = require('fs'); // used to save folderStructure.json
const fr = require('face-recognition'); // recognize faces in images
const Jimp = require('jimp'); // crops images


// Change the variable below to the folder of your choice  ( dont forget of / or \\ at the end of folder string)
const folder = 'samples/';
const debug = true;
const _5pointsShapeMethod = false; // '5points' or '68points'

// Change the matrix below according to name changes thar are needed
const changeArray = [
    ['264', 'Chuck Noris - CER20'],

];
const updateNamesToDSCFormat = true; // Keep this true if you want to turn names like '1' to 'DSC_0001.jpg'. False to keep literal

// creates optimized changeArray
const changeNameOptimizedArray = {};
for (let x = 0; x < changeArray.length; x++) {
    const arr = changeArray[x];
    let upperExt;
    if (updateNamesToDSCFormat) {
        arr[0] = arr[0].split('.')[0];
        while (arr[0].length < 4) {
            arr[0] = '0' + arr[0];
        }
        arr[0] = 'DSC_' + arr[0] + '.jpg';
        upperExt = 'DSC_' + arr[0] + '.JPG';
        changeArray[x] = arr;
    }

    if (!arr[1].includes('.')) {
        arr[1] = arr[1] + '.JPG';
    }

    changeNameOptimizedArray[arr[0]] = arr[1];
    if (upperExt) {
        changeNameOptimizedArray[upperExt] = arr[1];
    }
}


/**
 * @description changes output files name. Ex: 'DSC_00111' to 'Person name - GROUP1'. changeArray variable needs to be changed ir order to work
 * @param fileName original file name
 * @returns name for the output files
 */
const changeName = (fileName) => {

    const newName = changeNameOptimizedArray[fileName]; //  changeArray.find(row => row[0] === fileName)[1];
    const resp = newName ? newName : fileName;

    const split = resp.split('.');
    const len = split.length - 1;
    if (len) { // lowercase extension standart
        split[len] = split[len].toLowerCase()
    }

    return split.join('.');
}

/**
 * @returns date string from now
 */
const dateStr = () => {
    const now = new Date();
    return ("0" + now.getHours()).slice(-2) + ":" + ("0" + now.getMinutes()).slice(-2) + ":" + ("0" + now.getSeconds()).slice(-2);
}


/**
 * @description reads all file names in selected folder
 * @param folder folder name
 */
const readFolder = (folder) => {

    console.log('[Starting] Reading folder "' + folder + '" ... ');
    const folderStructureFile = 'outputs/folderStructure.json'
    const filteredTree = dirTree(folder, {
        extensions: /\.(jpg|jpeg|JPG|JPEG|png|PNG)$/
    });

    const jsonString = JSON.stringify(filteredTree);
    if (jsonString) {
        fs.writeFileSync(folderStructureFile, jsonString);
        //console.log(folderStructureFile + ' was written to disk!')
        return jsonString;
    }
    return null;
}

/**
 * @description calcutes how much and where the picture should be cutted based on face recognition data
 * @param points array of cartesian coordinates based on face recognition location data
 * @param imageWidth original image width
 * @param name picture file name
 */
const cutAdvice = (points, imageWidth, name, indexStr) => {

    //console.log(faceRects.length + ' faceRects found at ' + name);
    const left = getLeftFromPoints(points);
    const right = getRightFromPoints(points);

    const faceWidth = right - left;
    let smallSize;
    let smallSizeWidth;
    let largeSizeWidth;

    if (left < (imageWidth - right)) {
        smallSize = 'LEFT';
        smallSizeWidth = left;
        largeSizeWidth = imageWidth - right;
    } else {
        smallSize = 'RIGHT';
        smallSizeWidth = imageWidth - right;
        largeSizeWidth = left;
    }
    const shouldCutSize = largeSizeWidth - smallSizeWidth;
    const expectedWidth = (smallSizeWidth * 2) + faceWidth;
    const shouldCut = (smallSize === 'LEFT' ? 'RIGHT' : 'LEFT');

    if (debug) {
        console.log('[' + indexStr + '"' + name + '" at ' + dateStr() + '] Image has ' + imageWidth + 'px width, Face has ' + faceWidth + 'px width');
        console.log('[' + name + ' Width] SmallSize is ' + smallSize + ' with ' + smallSizeWidth + 'px against ' + largeSizeWidth +
            'px of large size; Recommend cut of ' + shouldCutSize + 'px at the ' + shouldCut + '\n');
    }

    return { shouldCut, shouldCutSize, expectedWidth, faceWidth, smallSizeWidth };
}

/**
 * @description extracts cartesian points from shape object
 * @param shape object returned from predictor.predict
 */
const getPointsFromShape = (shape) => {
    return shape.getParts().map(part => part);
}

/**
 * @description defines start of face at X axis
 * @param points cartesian points array
 */
const getLeftFromPoints = (points) => {
    let left = points[0].x;
    for (let i = 1; i < points.length; i++) {
        if (points[i].x < left) {
            left = points[i].x;
        }
    }
    return left;
}

/**
 * @description defines end of face at X axis
 * @param points cartesian points array
 */
const getRightFromPoints = (points) => {
    let right = points[0].x;
    for (let i = 1; i < points.length; i++) {
        if (points[i].x > right) {
            right = points[i].x;
        }
    }
    return right;
}


/**
 * @description loads portrait file, recognizes face and cuts image based of cut advice
 * @param folder root folder name
 * @param name picture file name
 */
const centralizePicture = async (folder, names, index) => {

    const name = names[index];
    const image = fr.loadImage(folder + name);
    // loads detector and predictor
    const detector = fr.FaceDetector();
    const predictor = _5pointsShapeMethod ? fr.FaceLandmark5Predictor() : fr.FaceLandmark68Predictor();

    const faceRects = detector.locateFaces(image);
    //if (debug) console.log('[' + name + ' - ' + dateStr() + '] faceRects found. Starting shapes recognition...')
    const shapes = faceRects.map(rect => predictor.predict(image, rect.rect));
    //if (debug) console.log('[' + name + ' - ' + dateStr() + '] shapes found. Starting cut advice and cropping')


    if (!faceRects || !faceRects.length || !shapes || !shapes.length) { // Did not recognize as portrait

        console.log('[Error!] No faces found at "' + name + '". This picture wont be saved at outputs folder');

    } else {

        // Uncoment to print detection at a window
        /*const win = new fr.ImageWindow()
        win.setImage(image)
        win.renderFaceDetections(shapes)
        fr.hitEnterToContinue()*/

        const indexStr = (index+1) + '/' + names.length + ': ';
        const points = getPointsFromShape(shapes[0]);
        const advice = cutAdvice(points, image.cols, name, indexStr);

        /*if (advice.shouldCutSize < 5) {
            console.log('No need to cut image ' + name);
            return;
        }*/ // allways create a new image at output folders to avoid "losing" images from one folder to another

        Jimp.read(folder + name)
            .then(jimpImage => {

                if (advice.shouldCut === 'LEFT') {
                    jimpImage.crop(advice.shouldCutSize, 0, advice.expectedWidth, image.rows);
                } else { // cut at RIGHT
                    jimpImage.crop(0, 0, advice.expectedWidth, image.rows);
                }

                const newFileName = changeName(name);

                jimpImage.write('outputs/' + newFileName);

                console.log('[OK! ' + dateStr() + '] Adjusted "' + newFileName +
                    '" saved to outputs folder! (cut ' + advice.shouldCutSize + 'px from ' + advice.shouldCut +
                    '. Face of ' + advice.faceWidth + 'px in now ' + advice.expectedWidth + 'px image - ' +
                    advice.smallSizeWidth + 'px each border)');

                // If file contains - markup, creates folders using the second part of filename
                const nameSplit = newFileName.split('-');
                if (nameSplit.length > 1) {

                    const markup = nameSplit[1].split('.')[0].trim();

                    const subFolder = 'outputs/' + markup + '/';

                    if (!fs.existsSync(subFolder)) {
                        fs.mkdirSync(subFolder);
                    }
                    // saves image file also in this folder
                    jimpImage.write(subFolder + newFileName);
                }

            })
            .catch(err => {
                console.error(name, err);
            });

    }
}

/**
 * @description getss all picture names and then calls centralize picture for each picture
 * @param folder root folder
 */
const cropAllImagesFromFolder = (folder) => {

    if (!folder) {
        console.log('[Error!] Please specify a folder name');
        return;
    }

    const tree = JSON.parse(readFolder(folder));
    if (!tree) {
        console.log('[Error!] Could not find folder "' + folder + '"')
        if (!(folder.endsWith('/') || folder.endsWith('\\'))) {
            const usesSlash = folder.includes('/');
            console.log('Its not a folder. Did you mean something like "' +
                folder + (usesSlash ? '/' : '\\') + '"?');
        }
        return;
    }
    const images = tree.children.filter(ch => ch.type === 'file');
    const imageNames = images.map(i => i.name);

    const shapeMethodStr = _5pointsShapeMethod ? '5 points' : '68 points';
    console.log('[Starting at ' + dateStr() + '] ' + imageNames.length + ' image' + (imageNames.length === 1 ? '' : 's') +
        ' to be adjusted. Shape method: ' + shapeMethodStr + '\n');

    for (let i = 0; i < imageNames.length; i++) {//  imageNames.forEach(imgName => {
        centralizePicture(folder, imageNames, i);
    };

}

// Main function call
cropAllImagesFromFolder(folder);


