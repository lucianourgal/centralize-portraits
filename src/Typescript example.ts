import * as fr from 'face-recognition'

class FaceRecognitionProcessor {

public async toyImage(name: string) {

    
    const predictor = fr.FaceLandmark5Predictor();

    const image = fr.loadImage(name);

    console.log('Image loaded');
    const detector = fr.FaceDetector();
    const targetSize = 640;

    const faceImages = detector.detectFaces(image, targetSize);
    console.log('face detected');
    const faceRects = detector.locateFaces(image)

    //const shapes = faceRects.map(rect => predictor.predict(image, rect));
    console.log(faceRects);

    // save file
    faceImages.forEach((img, i) => fr.saveImage(`../outputs/face_${i}.png`, img))

}



}


export default new FaceRecognitionProcessor();