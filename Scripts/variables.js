var WIDTH = 1000, HEIGHT = 540;

// scene object variables
var renderer, scene, camera, pointLight, spotLight;

// field variables
var fieldWidth = 220, fieldHeight = 220;

var striker_radius = 10;
var coin_radius = 7;

// game-related variables
var score = 0;

var striker, striker_direction = 0;
var shoot_angle = 0, shoot_speed = 30, speed_inc = 0;
var dash = new Array(20);

var angle_change = 0;
var draw_dir = 0;
var shoot_status = 0;

var friction = 0.5;
var init_vx, init_vy, striker_vx, striker_vy;

var t = 0.1;

var v_thresh = 0.1;

var coins = new Array(9);
var coin_velsx = new Array(9);
var coin_velsy = new Array(9);
var coin_dead = new Array(9);

var views = [
	[-200, 0, 104, 0, -60 * Math.PI/180, -90 * Math.PI/180], 
	[0, 0, 250, 0, 0, -90 * Math.PI/180],
	[0, 0, 0, 0, 0, 0]
];
var current_view = 0;


var color = 0

var redIn = 0;

var prevTime = 0, startTime = 0;

var canvas = document.getElementById("gameCanvas");
var rect = canvas.getBoundingClientRect();
var w = rect.right - rect.left;
var z = rect.bottom - rect.top;

var coin_audio = new Audio('audio/coin.wav');
var coll_audio = new Audio('audio/jump.wav');
var back_audio = new Audio('audio/music.wav');
back_audio.appendChild(coin_audio);
back_audio.appendChild(coll_audio);
back_audio.loop = true;

var gameWin = false;

var prevmx, prevmy, curmx, curmy;
