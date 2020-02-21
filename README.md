# centralize-portraits
 - Centralize all pictures in choosed folder by using face recognition and image cropping<br>
 - The main point of this project is when you have a folder with lots of uncentralized portraits and wants to generate new centralized pictures from it<br>

 # Used links for this project
 https://www.sitepoint.com/quick-tip-multiple-versions-node-nvm/ <br>
 https://medium.com/@muehler.v/node-js-face-recognition-js-simple-and-robust-face-recognition-using-deep-learning-ea5ba8e852 <br>

 # Other links
 https://www.npmjs.com/package/faced <br>
 https://github.com/justadudewhohacks/face-api.js <br>
 https://medium.com/github-all-stars/github-all-stars-2-face-api-js-f3d6f135f4f7 <br>
 https://itnext.io/face-api-js-javascript-api-for-face-recognition-in-the-browser-with-tensorflow-js-bcc2a6c4cf07 <br>
 

# Notes
 - face-recognition.js package doesnt work in node >= 12. Try node version 8 (use nvm to have multiple nodeJS installs) <br>
 - Make sure you have CMake and Visual Studio 2017 installed <br>
 - npm install can be tricky since face-recognition library has lots of depedencies <br>
 - Avoid using too large files <br>


# Usage
 - Update folder variable <br>
 - nvm use 8.17.X <br>
 - npm install <br>
 - node index.ts <br>