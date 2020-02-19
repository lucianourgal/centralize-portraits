const dirTree = require("directory-tree"); // reads directory and finds all images in it
const fs = require('fs'); // used to save folderStructure.json
const fr = require('face-recognition'); // recognize faces in images
const Jimp = require('jimp'); // crops images

const debug = false;
// Change the variable below to the folder of your choice
const folder = 'C:\\Users\\lucia\\Documents\\GitHub\\centralize-portraits\\samples\\';

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
 * @param faceRects face recognition location data
 * @param imageWidth original image width
 * @param name picture file name
 */
const cutAdvice = (faceRects, imageWidth, name) => {

    const left = faceRects[0].rect.left;
    const right = faceRects[0].rect.right;

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
    const expectedWidth = smallSizeWidth * 2 + faceWidth;
    const shouldCut = (smallSize === 'LEFT' ? 'RIGHT' : 'LEFT');

    if (debug) {
        console.log('[' + name + ' Width] Image has ' + imageWidth + 'px, Face has ' + faceWidth + 'px;');
        console.log('[' + name + ' Width] SmallSize is ' + smallSize + ' with ' + smallSizeWidth + 'px against ' + largeSizeWidth + 'px of large size;');
        console.log('[' + name + ' Width] Recommend cut of ' + shouldCutSize + 'px at the ' + shouldCut);
    }

    return { shouldCut, shouldCutSize, expectedWidth };
}

/**
 * @description loads portrait file, recognizes face and cuts image based of cut advice
 * @param folder root folder name
 * @param name picture file name
 */
const centralizePicture = async (folder, name) => {

    const image = fr.loadImage(folder + name);
    const detector = fr.FaceDetector();
    //const targetSize = 150
    //const faceImages = detector.detectFaces(image, targetSize)
    //faceImages.forEach((img, i) => fr.saveImage(`face_${i}.png`, img))

    const faceRects = detector.locateFaces(image);
    // faceRects.MmodRect.left: Pixel recognition starts,  faceRects.right: Pixel recognition ends
    // [ MmodRect { confidence: 1.041917324066162,
    //rect: Rect { area: 240590, bottom: 977, top: 488, right: 810, left: 320 } } ]

    const advice = cutAdvice(faceRects, image.cols, name);

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

            jimpImage.write('outputs/' + name);
            console.log('[OK!] Adjusted "' + name + '" saved to outputs folder!');

            // If file contains - markup, creates folders using the second part of filename
            const nameSplit = name.split('-');
            if(nameSplit.length > 1) {

                const markup = nameSplit[1].split('.')[0].trim();

                const subFolder = 'outputs/'+ markup + '/';

                if (!fs.existsSync(subFolder)){
                    fs.mkdirSync(subFolder);
                }
                // saves image file also in this folder
                jimpImage.write(subFolder + name);
            }

        })
        .catch(err => {
            console.error(err);
        });

}

/**
 * @description getss all picture names and then calls centralize picture for each picture
 * @param folder root folder
 */
const cropAllImagesFromFolder = (folder) => {

    const tree = JSON.parse(readFolder(folder));
    const images = tree.children.filter(ch => ch.type === 'file');
    const imageNames = images.map(i => i.name);
    console.log('[Starting] ' + imageNames.length + ' images to be adjusted')

    imageNames.forEach(imgName => {
        centralizePicture(folder, imgName);
    });
}

// Main function call
cropAllImagesFromFolder(folder);


