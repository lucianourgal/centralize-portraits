[![buy_me_a_coffee_badge](https://img.shields.io/badge/buy%20me%20a%20coffee-donate-yellow.svg)](https://www.buymeacoffee.com/lucianourgal)
# centralize-portraits
 - Centralize all portrait pictures in choosed folder by using face recognition (face-recognition.js) and image cropping (Jimp library)<br>
 - The main point of this project is when you have a folder with lots of uncentralized portraits and wants to generate new centralized pictures from it<br>

 # Used links for this project
 https://www.sitepoint.com/quick-tip-multiple-versions-node-nvm/ <br>
 https://medium.com/@muehler.v/node-js-face-recognition-js-simple-and-robust-face-recognition-using-deep-learning-ea5ba8e852 <br>
 https://www.npmjs.com/package/face-recognition#boosting-performance <br>

 # Other links
 https://www.npmjs.com/package/faced <br>
 https://github.com/justadudewhohacks/face-api.js <br>
 https://medium.com/github-all-stars/github-all-stars-2-face-api-js-f3d6f135f4f7 <br>
 https://itnext.io/face-api-js-javascript-api-for-face-recognition-in-the-browser-with-tensorflow-js-bcc2a6c4cf07 <br>
 

# Notes
 - face-recognition.js package doesn't work in node >= 12. Try NodeJS version 10 (use nvm to have multiple NodeJS installs) <br>
 - Make sure you have CMake and Visual Studio 2017 installed <br>
 - npm install can be tricky since face-recognition library has lots of depedencies <br>
 - Avoid using too large files like 5k+ width, since they can crash face-recognition library <br>
 - Special ponctuation characters can't be read and will be skipped <br>


# Usage
 - Update folder variable at index.js <br>
 - Update changeArray variable according to example for automated renaming <br>
 - nvm use 10.17.0 <br>
 - npm install <br>
 - node index.js <br>
