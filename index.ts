const fr = require('face-recognition');
const Jimp = require('jimp');

const debug = true;
const folder = 'samples/';

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


const centralizePicture = async (folder, name) => {

    const image = fr.loadImage(folder + name);
    const detector = fr.FaceDetector();
    //const targetSize = 150
    //const faceImages = detector.detectFaces(image, targetSize)
    //faceImages.forEach((img, i) => fr.saveImage(`face_${i}.png`, img))

    const faceRects = detector.locateFaces(image)
    // faceRects.MmodRect.left: Pixel recognition starts,  faceRects.right: Pixel recognition ends
    // [ MmodRect { confidence: 1.041917324066162,
    //rect: Rect { area: 240590, bottom: 977, top: 488, right: 810, left: 320 } } ]

    const advice = cutAdvice(faceRects, image.cols, name);

    if (advice.shouldCutSize < 5) {
        console.log('No need to cut image ' + name);
        return;
    }

    Jimp.read(folder + name)
        .then(jimpImage => {

            if (advice.shouldCut === 'LEFT') {
                jimpImage.crop(advice.shouldCutSize, 0, advice.expectedWidth, image.rows);
            } else { // cut at RIGHT
                jimpImage.crop(0, 0, advice.expectedWidth, image.rows);
            }

            jimpImage.write('outputs/' + name);

        })
        .catch(err => {
            console.error(err);
        });

}

centralizePicture(folder, '2018.jpg');

