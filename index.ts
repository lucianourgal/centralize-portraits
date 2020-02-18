// import nodejs bindings to native tensorflow,
// not required, but will speed up things drastically (python required)
//import '@tensorflow/tfjs-node';
import * as canvas from 'canvas';
import * as faceapi from 'face-api.js';
import { readFile } from 'fs'
// implements nodejs wrappers for HTMLCanvasElement, HTMLImageElement, ImageData

function toArrayBuffer(buf) {
    var ab = new ArrayBuffer(buf.length);
    var view = new Uint8Array(ab);
    for (var i = 0; i < buf.length; ++i) {
        view[i] = buf[i];
    }
    return ab;
}


const centralizePicture = (name: string) => {

    // patch nodejs environment, we need to provide an implementation of
    // HTMLCanvasElement and HTMLImageElement
    const { Canvas, Image, ImageData } = canvas;
    faceapi.env.monkeyPatch({ /*Canvas, Image,*/ ImageData })


    readFile(name, function (err, data) {
        if (err) throw err;

        const img = toArrayBuffer(data)
        const detection = faceapi.detectSingleFace(img) //What is TNetInput ????
        console.log(detection);
        //res.write(data);
    });

}

centralizePicture('samples/2018.jpg');