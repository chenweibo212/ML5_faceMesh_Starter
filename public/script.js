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

	let col = color("#ff3a41");
	for (let i = 0; i < predictions.length; i += 1) {
		const keypoints = predictions[i].scaledMesh;
		const boundingBox = predictions[i].boundingBox;
		//boundingBox
		let topX = boundingBox.topLeft[0][0];
		let topY = boundingBox.topLeft[0][1];
		let bottomX = boundingBox.bottomRight[0][0];
		let bottomY = boundingBox.bottomRight[0][1];
		// let [bottomX, bottomY] = boundingBox[1];

		// //drawBox
		// strokeWeight(2);
		// stroke(0,0,255);
		// rect(topX*scaleFactorX, topY*scaleFactorY, (bottomX-topX)*scaleFactorX, (bottomY-topY)*scaleFactorY);
		
		//featurePoints
		let newLX = keypoints[427][0];
		let newLY = keypoints[427][1];
		let newRX = keypoints[207][0];
		let newRY = keypoints[207][1];

		//Lerp to calculate the transition when moving head around
		// leftX = lerp(leftX, newLX, 0.2);
		// leftY = lerp(leftY, newLY, 0.2);
		// rightX = lerp(rightX, newRX, 1);
		// rightY = lerp(rightY, newRY, 0.2);

		//circle scaleFactor
		let scaleFactorCircle = width / (bottomX-topX);
		console.log(scaleFactorCircle)
		let n = width*0.65/scaleFactorCircle;
		//can add a lerp as well

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
			circle(newLX * scaleFactorX, newLY * scaleFactorY, a);
			circle(newRX * scaleFactorX, newRY * scaleFactorY, a);
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