"use strict";

let width = window.innerWidth;
let height = window.innerWidth * 0.75;

function isMobile() {
	return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

function isLandscape() {
	return window.innerHeight > window.innerWidth;
}

console.log(isMobile(), isLandscape());

let facemesh;
let video;
let predictions = [];
const scaleFactorX = width / 640;
const scaleFactorY = height / 480;
const scaleFactorCircle = width / 640;

let cameraOptions = {
	video: {
		facingMode: {
			exact: "environment"
		}
	}
};

//eyemomentvariables
let leftX = 0;
let leftY = 0;
let rightX = 0;
let rightY = 0;

function setup() {
	createCanvas(width, height);   //base 640*480
	// video = createCapture(cameraOptions);
	if (isMobile()) {
		video = createCapture(cameraOptions);
	} else {
		video = createCapture(VIDEO);
	}
	video.size(width, height);
	const faceOptions = { withLandmarks: true, withExpressions: false, withDescriptors: false, maxFaces: 10 };
	facemesh = ml5.facemesh(video, faceOptions, modelReady);

	// This sets up an event that fills the global variable "predictions"
	// with an array every time new predictions are made
	facemesh.on("predict", results => {
		predictions = results;
	});

	// Hide the video element, and just show the canvas
	video.hide();
}

function modelReady() {
	console.log("Model ready!");
}

function draw() {
	image(video, 0, 0, width, height);

	// We can call both functions to draw all keypoints
	drawKeypoints();
}

// A function to draw ellipses over the detected keypoints
function drawKeypoints() {

	let n = 25 * scaleFactorX;
	let col = color("#ff3a41");
	for (let i = 0; i < predictions.length; i += 1) {
		const keypoints = predictions[i].scaledMesh;
		let newLX = keypoints[427][0];
		let newLY = keypoints[427][1];
		let newRX = keypoints[207][0];
		let newRY = keypoints[207][1];

		//Lerp to calculate the transition when moving head around
		leftX = lerp(leftX, newLX, 0.2);
		leftY = lerp(leftY, newLY, 0.2);
		rightX = lerp(rightX, newRX, 1);
		rightY = lerp(rightY, newRY, 0.2);
		// console.log(keypoints[207], keypoints[427]);

		//draw shape based on desired points
		// fill(255, 0, 0);
		// noStroke();
		// ellipse(rightX*scaleFactor, rightY*scaleFactor, 25, 25)
		// ellipse(leftX*scaleFactor, leftY*scaleFactor, 25, 25)

		for (let a = 0; a < n; a += 1.5) {
			let alph = map(a, 0, n - 1, 50, 0)
			col.setAlpha(alph);
			fill(col);
			noStroke();
			//strokeWeight(1);
			//stroke(255);
			circle(leftX * scaleFactorX, leftY * scaleFactorY, a);
			circle(rightX * scaleFactorX, rightY * scaleFactorY, a);
		}
		// Draw all facial keypoints.
		//     for (let j = 0; j < keypoints.length; j += 1) {
		//       const [x, y] = keypoints[j];

		//       fill(0, 255, 0);
		//       textSize(5);
		//       // ellipse(x, y, 2, 2);
		//       //reference points
		//       text(j, x*1.5, y*1.5);

		//       // console.log(`Keypoint ${j}: [${x}, ${y}]`);
		//     }
	}
}