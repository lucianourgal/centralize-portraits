const fr = require('face-recognition');


const cutAdvice = (faceRects, imageWidth) => {

    const left =  faceRects[0].rect.left;
    const right =  faceRects[0].rect.right;

    const faceWidth = right - left;
    let smallSize;
    let smallSizeWidth;
    let largeSizeWidth;

    if(left < (imageWidth - right)) {
        smallSize = 'LEFT';
        smallSizeWidth = left;
        largeSizeWidth = imageWidth - right;
    } else {
        smallSize = 'RIGHT';
        smallSizeWidth = imageWidth - right;
        largeSizeWidth = left;
    }
    const shouldCutSize = largeSizeWidth - smallSizeWidth;

    console.log('[Width] Image has '+imageWidth+'px, Face has ' + faceWidth + 'px;');
    console.log('[Width] SmallSize is '+smallSize+' with ' + smallSizeWidth + 'px against '+largeSizeWidth+'px of large size;');
    const shouldCut = (smallSize === 'LEFT' ?  'RIGHT' : 'LEFT');
    console.log('[Width] Recommend cut of ' + shouldCutSize+ 'px at the ' + shouldCut);

    return { shouldCut, shouldCutSize };
}


const centralizePicture = async (name) => {

    const image = fr.loadImage(name)
    const detector = fr.FaceDetector()
    //const targetSize = 150
    //const faceImages = detector.detectFaces(image, targetSize)
    //faceImages.forEach((img, i) => fr.saveImage(`face_${i}.png`, img))

    const faceRects = detector.locateFaces(image)
    // faceRects.MmodRect.left: Pixel recognition starts,  faceRects.right: Pixel recognition ends
    // [ MmodRect { confidence: 1.041917324066162,
    //rect: Rect { area: 240590, bottom: 977, top: 488, right: 810, left: 320 } } ]

    const advice = cutAdvice(faceRects, image.cols);

}

centralizePicture('samples/2014.png');

