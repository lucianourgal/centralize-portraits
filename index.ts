const fr = require('face-recognition')

const centralizePicture = async (name) => {

    const image = fr.loadImage(name)
    const detector = fr.FaceDetector()
    const targetSize = 150
    const faceImages = detector.detectFaces(image, targetSize)
    faceImages.forEach((img, i) => fr.saveImage(`face_${i}.png`, img))

}

centralizePicture('samples/2018.jpg');


/*
// import nodejs bindings to native tensorflow,
// not required, but will speed up things drastically (python required)
//import '@tensorflow/tfjs-node';
import * as canvas from 'canvas';
import * as faceapi from 'face-api.js';
import { readFile } from 'fs'
import { tf, toNetInput } from 'face-api.js';
// implements nodejs wrappers for HTMLCanvasElement, HTMLImageElement, ImageData

function toArrayBuffer(buf) {
    var ab = new ArrayBuffer(buf.length);
    var view = new Uint8Array(ab);
    for (var i = 0; i < buf.length; ++i) {
        view[i] = buf[i];
    }
    return ab;
}



 /*
    // patch nodejs environment, we need to provide an implementation of
    // HTMLCanvasElement and HTMLImageElement
    
    const { Canvas, Image, ImageData } = canvas;
    const x = faceapi.env.monkeyPatch({ /*Canvas, Image, ImageData })
    

    readFile(name, function (err, data) {
        if (err) throw err;

        const img = toArrayBuffer(data)

        const netInput = img instanceof tf.Tensor
      ? img
      : await toNetInput(data)

        const detection = faceapi.detectSingleFace(img as Float32Array) //What is TNetInput ????
        console.log(detection);
        //res.write(data);
    }); */
