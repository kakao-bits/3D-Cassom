back_audio.play();

function shootReset() 
{
	striker_direction = 0;
	shoot_status = 0;
	shoot_angle = 0;
	shoot_speed = 30;
	speed_inc = 0;
	angle_change = 0;
	draw_dir = 0;
	striker_vx = 0;
	striker_vy = 0;
	striker.position.x = -90;
	striker.position.y = 0;
}

function checkWin() 
{
	var i;
	for(i = 0; i<8; i++) {
		if(i%2 != color) continue;
		if(coin_dead[i]==false) break;
	}
	if(i==8 && coin_dead[8] == true) gameWin = true;


}

function gameReset() 
{
	var i;
	for(i = 0; i<9; i++) {
		coin_velsx[i] = 0;
		coin_velsy[i] = 0;
		coin_dead[i] = true;
	}
	prevTime = Date.now();
	startTime = prevTime;
}

function collisionStrikerCoins() {
	var i, dx, dy, dist, temp, j;
	for(i = 0; i<9; i++) {
		if(coin_dead[i]) continue;
		dx = striker.position.x - coins[i].position.x;
		dy = striker.position.y - coins[i].position.y;
		dist = Math.sqrt(dx*dx + dy*dy);
		if(dist <= striker_radius + coin_radius) {
			temp = coin_velsx[i];
			coin_velsx[i] = (coin_velsx[i]*(-3) + 2*10*striker_vx)/17.0;
			striker_vx = (striker_vx*(3) + 2*7*temp)/17.0;
			temp = coin_velsy[i];
			coin_velsy[i] = (coin_velsy[i]*(-3) + 2*10*striker_vy)/17.0;
			striker_vy = (striker_vy*(3) + 2*7*temp)/17.0;
		}
	}
	for(i = 0; i<9; i++) {
		if(coin_dead[i]) continue;

		for(j = i+1; j<9; j++) {


			dx = coins[j].position.x - coins[i].position.x;
			dy = coins[j].position.y - coins[i].position.y;
			dist = Math.sqrt(dx*dx + dy*dy);

			if(dist <= coin_radius + coin_radius) {

				temp = coin_velsx[i];
				coin_velsx[i] = coin_velsx[j];
				coin_velsx[j] = temp;
				temp = coin_velsy[i];
				coin_velsy[i] = coin_velsy[j];
				coin_velsy[j] = temp;
			}
		}
	}
}

function moveCoins() 
{
	var i;
	for(i = 0; i<9; i++) {
		if(coin_dead[i]) continue;

		if(coins[i].position.x >= 95 && coins[i].position.y >= 95) pocket(i);
		if(coins[i].position.x >= 95 && coins[i].position.y <= -95) pocket(i);
		if(coins[i].position.x <= -95 && coins[i].position.y <= -95) pocket(i);
		if(coins[i].position.x <= -95 && coins[i].position.y >= 95) pocket(i);
		if(coin_velsx[i]) coins[i].position.x += coin_velsx[i]*t - 0.5*friction*t*t;
		if(coin_velsy[i]) coins[i].position.y += coin_velsy[i]*t - 0.5*friction*t*t;
		if(coin_velsx[i] > 0) coin_velsx[i] -= friction*t;
		if(coin_velsx[i] < 0) coin_velsx[i] += friction*t;
		if(coin_velsy[i] > 0) coin_velsy[i] -= friction*t;
		if(coin_velsy[i] < 0) coin_velsy[i] += friction*t;

		if(coin_velsx[i] < v_thresh && coin_velsx[i] > -v_thresh) coin_velsx[i] = 0;
		if(coin_velsy[i] < v_thresh && coin_velsy[i] > -v_thresh) coin_velsy[i] = 0; 

		if(coins[i].position.x >= 100 || coins[i].position.x <= -100) {
		

			coin_velsx[i] *= -1;
		}
		if(coins[i].position.y >= 100 || coins[i].position.y <= -100) {


			coin_velsy[i] *= -1;
		}
	}
}

function pocket(num) 
{
		coin_audio.play();
	if(num == 8) {
		redIn = 1;

	}
	else {
		if(num%2 == color) {
			if (redIn) {
				score += 20;

				redIn = 0;
			}
			score += 5;
		}
		else score -= 20;
	}
	scene.remove(coins[num]);
	coin_dead[num] = true;
}

function fault() 
{
	score -= 10;
	coin_audio.play();
	shootReset();
}

function moveStriker() 
{
	if(shoot_status < 3) {
		if(striker.position.y <= 80 && striker.position.y >= -80)
			striker.position.y += 1.5*striker_direction;
		if(striker.position.y > 80) striker.position.y = 80;
		if(striker.position.y < -80) striker.position.y = -80;
		shoot_speed += 0.1*speed_inc;
	}
	else if(shoot_status == 3) {
		if(striker.position.x >= 95 && striker.position.y >= 95) fault();
		if(striker.position.x >= 95 && striker.position.y <= -95) fault();
		if(striker.position.x <= -95 && striker.position.y <= -95) fault();
		if(striker.position.x <= -95 && striker.position.y >= 95) fault();


		if(striker_vx) striker.position.x += striker_vx*t - 0.5*friction*t*t;
		if(striker_vy) striker.position.y += striker_vy*t - 0.5*friction*t*t;
		if(striker_vx > 0) striker_vx -= friction*t;
		if(striker_vx < 0) striker_vx += friction*t;

		if(striker_vy > 0) striker_vy -= friction*t;
		if(striker_vy < 0) striker_vy += friction*t;

		if(striker_vx < v_thresh && striker_vx > -v_thresh) striker_vx = 0;
		if(striker_vy < v_thresh && striker_vy > -v_thresh) striker_vy = 0; 

		if(striker.position.x >= 100 || striker.position.x <= -100) {
		
			striker_vx *= -1;
		}
		if(striker.position.y >= 100 || striker.position.y <= -100) {
			striker_vy *= -1;
		

		}
	}
}

function drawDirection() 
{
	var i;
	if(!draw_dir) {
		for(i = 0; i<20; i++) dash[i].position.z = -5;

		return;
	}
	shoot_angle += 2*Math.PI/180*angle_change;
	var originx = striker.position.x;
	var originy = striker.position.y;
	var dist = 10;
	for(i = 0; i<20; i++) {
		dash[i].position.x = originx + dist*i*Math.cos(shoot_angle);
		dash[i].position.y =  originy + dist*i*Math.sin(shoot_angle);
		if(shoot_status == 1) dash[i].position.z = 5;
		else dash[i].position.z = -5;
		dash[i].rotation.z = shoot_angle;
	}
}

function draw()
{	
	// draw THREE.JS scene
	renderer.render(scene, camera);
	if(!gameWin)
		document.getElementById("scores").innerHTML = "Speed: " + shoot_speed.toFixed(1) + "<br>Score: " + score + "<br>Time: " + ((Date.now() - startTime)/1000).toFixed(0).toString();
	else 
		document.getElementById("scores").innerHTML = "Congratulations! Final Score: " + score + "<br>Press F5 to play again!";

	// loop draw function call
	requestAnimationFrame(draw);
	if(Date.now() - prevTime >= 5000) {
		if(!gameWin) score--;
		prevTime = Date.now();
	}
	cameraPhysics();
	moveStriker();
	if(shoot_status == 3) {
		var i;
		for(i = 0; i<9; i++) {
			if(coin_dead[i]) continue;
			if(coin_velsy[i] || coin_velsx[i]) break;
		}
		if(i==9 && striker_vx == 0 && striker_vy == 0) {
			if(redIn) redIn++;
			if(redIn == 3) {
				coin_dead[8] = false;
				scene.add(coins[8]);
				coins[8].position.x = 0;
				coins[8].position.y = 0;
				coins[8].position.y = 2;
				coin_velsx[8] = 0;
				coin_velsy[8] = 0;

			}
			shootReset();
		}
	}
	drawDirection();
	collisionStrikerCoins();
	moveCoins();
	checkWin();
}

function setup()
{
	document.getElementById("scores").innerHTML = "It is your move!<br>Choose color W => White, B => Black";
	
}

function setup_continue() {
	score = 100;
	gameReset();
	// set up all the 3D objects in the scene	
	createScene();
	var i;
	for(i = 0; i<9; i++)
		coin_dead[i] = false;
	draw();

}

function createScene()
{
	// set some camera attributes
	var VIEW_ANGLE = 50,
	ASPECT = WIDTH / HEIGHT,
	NEAR = 0.1,
	FAR = 10000;
	var c = document.getElementById("gameCanvas");
	// create a WebGL renderer, camera
	// and a scene
	renderer = new THREE.WebGLRenderer();
	camera =
		new THREE.PerspectiveCamera(
				VIEW_ANGLE,
				ASPECT,
				NEAR,
				FAR);

	scene = new THREE.Scene();

	// add the camera to the scene
	scene.add(camera);

	// set a default position for the camera
	// not doing this somehow messes up shadow rendering
	camera.position.z = 320;

	// start the renderer
	renderer.setSize(WIDTH, HEIGHT);

	// attach the render-supplied DOM element
	c.appendChild(renderer.domElement);

	// set up the playing surface plane 
	var planeWidth = fieldWidth,
	planeHeight = fieldHeight,
	planeQuality = 10;


	// create the plane's material	
	var planeMaterial =
		new THREE.MeshLambertMaterial(
				{
					color: 0x4BD121
				});
	    var img = new THREE.MeshBasicMaterial({ //CHANGED to MeshBasicMaterial
        map:THREE.ImageUtils.loadTexture('images/board.jpg')
    });
    img.map.needsUpdate = true; //ADDED
	// create the table's material
	var tableMaterial =
		new THREE.MeshLambertMaterial(
				{
					color: 0x111111
				});
	// create the pillar's material
	var pillarMaterial =
		new THREE.MeshLambertMaterial(
				{
					color: 0x87835D
				});
	// create the ground's material
	var groundMaterial =
		new THREE.MeshLambertMaterial(
				{
					color: 0x888888
				});

		var black_material = new THREE.MeshLambertMaterial( {color: 0x000000} );
	var white_material = new THREE.MeshLambertMaterial( {color: 0xffffff} );
	var red_material = new THREE.MeshLambertMaterial( {color: 0xD55500} );
	var striker_material = new THREE.MeshLambertMaterial( {color: 0x222222} );


	// create the playing surface plane
	var plane = new THREE.Mesh(

			new THREE.PlaneGeometry(
				planeWidth * 0.95,	// 95% of table width, since we want to show where the ball goes out-of-bounds
				planeHeight,
				planeQuality,
				planeQuality),

			striker_material);


	scene.add(plane);
		var base = new THREE.Mesh(

			new THREE.PlaneGeometry(
				10,	// 95% of table width, since we want to show where the ball goes out-of-bounds
				170,
				planeQuality,
				planeQuality),

			red_material);
		base.position.z = 0.5;
		base.position.x = -90;
		//base.rotation.z = 90*Math.PI/180;


	scene.add(base);
	var temp = base.clone();
	temp.position.x = 90;
	scene.add(temp);
	plane.receiveShadow = true;
	temp = base.clone();
	temp.position.y = 80;
	temp.position.x = 0;

	temp.rotation.z = 90*Math.PI/180;
	scene.add(temp);
	temp = base.clone();
	temp.position.y = -80;
	temp.position.x = 0;
	temp.rotation.z = 90*Math.PI/180;


	scene.add(temp);


	var table = new THREE.Mesh(

			new THREE.CubeGeometry(
				planeWidth * 1.05,	// this creates the feel of a billiards table, with a lining
				planeHeight * 1.03,
				100,				// an arbitrary depth, the camera can't see much of it anyway
				planeQuality,
				planeQuality,
				1),

			tableMaterial);
	table.position.z = -51;	// we sink the table into the ground by 50 units. The extra 1 is so the plane can be seen
	scene.add(table);
	table.receiveShadow = true;	

	var geometry = new THREE.CylinderGeometry( 7, 7, 4, 32 );
	var striker_geometry = new THREE.CylinderGeometry( 10, 10, 2, 32 );
	var dash_geometry = new THREE.PlaneGeometry(5, 1);

	

	var temp = new THREE.Mesh( dash_geometry, white_material );
	temp.position.z = 5;
	temp.receiveShadow = true;
	temp.castShadow = true;


	var i;
	for(i = 0; i<20; i++) {
		dash[i] = temp.clone();
		scene.add(dash[i]);
		dash[i].position.z = 0;
	}
	for(i = 0; i<9; i++) {
		if(i==8) coins[i] = new THREE.Mesh( geometry, red_material );
		else if(i%2) coins[i] = new THREE.Mesh( geometry, black_material );
		else coins[i] = new THREE.Mesh( geometry, white_material );
		coins[i].rotation.x = 90*Math.PI/180;
		scene.add( coins[i] );
		coins[i].position.z = 2;
		coins[i].receiveShadow = true;
		coins[i].castShadow = true;
	}
	var circle_radius = 24;
	for(i = 0; i<8; i++) {
		coins[i].position.x = circle_radius*Math.cos(Math.PI/4*i);
		coins[i].position.y = circle_radius*Math.sin(Math.PI/4*i);
	}

	striker = new THREE.Mesh( striker_geometry, tableMaterial );
	striker.rotation.x = 90*Math.PI/180;
	scene.add( striker );
	striker.position.z = 2;
	striker.receiveShadow = true;
	striker.castShadow = true;
	striker.position.x = -90;

	var rings = new Array(4);

	var ring_geometry = new THREE.TorusGeometry( 10, 3, 16, 100 );
	var ring_material = new THREE.MeshLambertMaterial( { color: 0xFF2718 } );
	for(i = 0; i<4; i++) 
	{
		rings[i] = new THREE.Mesh( ring_geometry, ring_material );
		scene.add( rings[i] );
		rings[i].position.z = 0;
		rings[i].receiveShadow = true;
		rings[i].castShadow = true;

	}
	rings[0].position.x = -100;
	rings[0].position.y = -100;
	rings[1].position.x = 100;
	rings[1].position.y = -100;
	rings[2].position.x = -100;
	rings[2].position.y = 100;
	rings[3].position.x = 100;
	rings[3].position.y = 100;

	var material = new THREE.MeshBasicMaterial({
	color: 0x0000ff
});

var mesh = new THREE.Mesh( new THREE.RingGeometry( 11, 17, 32 ), ring_material );
mesh.position.z = 0.05;
scene.add( mesh );
var circle = new THREE.Mesh( new THREE.RingGeometry( 34, 40, 32 ), ring_material );
circle.position.z = 0.05;
scene.add( circle );



	// we iterate 10x (5x each side) to create pillars to show off shadows
	// this is for the pillars on the left
	for (var i = 0; i < 5; i++)
	{
		var backdrop = new THREE.Mesh(

				new THREE.CubeGeometry( 
					30, 
					30, 
					300, 
					1, 
					1,
					1 ),

				pillarMaterial);

		backdrop.position.x = -50 + i * 100;
		backdrop.position.y = 230;
		backdrop.position.z = -30;		
		backdrop.castShadow = true;
		backdrop.receiveShadow = true;		  
		scene.add(backdrop);	
	}
	// we iterate 10x (5x each side) to create pillars to show off shadows
	// this is for the pillars on the right
	for (var i = 0; i < 5; i++)
	{
		var backdrop = new THREE.Mesh(

				new THREE.CubeGeometry( 
					30, 
					30, 
					300, 
					1, 
					1,
					1 ),

				pillarMaterial);

		backdrop.position.x = -50 + i * 100;
		backdrop.position.y = -230;
		backdrop.position.z = -30;
		backdrop.castShadow = true;
		backdrop.receiveShadow = true;		
		scene.add(backdrop);	
	}

	// finally we finish by adding a ground plane
	// to show off pretty shadows
	var ground = new THREE.Mesh(

			new THREE.CubeGeometry( 
				1000, 
				1000, 
				3, 
				1, 
				1,
				1 ),

			groundMaterial);
	// set ground to arbitrary z position to best show off shadowing
	ground.position.z = -132;
	ground.receiveShadow = true;	
	scene.add(ground);		

	// // create a point light
	pointLight =
		new THREE.PointLight(0xF8D898);

	// set its position
	pointLight.position.x = -1000;
	pointLight.position.y = 0;
	pointLight.position.z = 1000;
	pointLight.intensity = 2.9;
	pointLight.distance = 10000;
	// add to the scene
	scene.add(pointLight);

	// add a spot light
	// this is important for casting shadows
	spotLight = new THREE.SpotLight(0xF8D898);
	spotLight.position.set(0, 0, 460);
	spotLight.intensity = 1.5;
	spotLight.castShadow = true;
	scene.add(spotLight);

	// MAGIC SHADOW CREATOR DELUXE EDITION with Lights PackTM DLC
	renderer.shadowMapEnabled = true;		
}

// Handles camera and lighting logic
function cameraPhysics()
{
	// we can easily notice shadows if we dynamically move lights during the game
	spotLight.position.x = 0;
	spotLight.position.y = 0;
	if(striker_vx || striker_vy) {
		var theta = Math.atan(Math.abs(striker_vy/striker_vx));
		if(striker_vx >0 && striker_vy >= 0) {
			views[2][5] = -90*Math.PI/180 + theta;
			views[2][0] = striker.position.x - 100*Math.cos(theta);
			views[2][1] = striker.position.y - 100*Math.sin(theta);
			if(theta < Math.PI/4) views[2][4] = (-60)*Math.PI/180;
			else views[2][3] = (60)*Math.PI/180;

		}
		else if(striker_vx <= 0 && striker_vy > 0) {
			views[2][5] = 90*Math.PI/180 - theta;
			views[2][0] = striker.position.x + 100*Math.cos(theta);
			views[2][1] = striker.position.y - 100*Math.sin(theta);
			if(theta < Math.PI/2) views[2][4] = 60*Math.PI/180;
			else views[2][3] = (60)*Math.PI/180;



		}
		else if(striker_vx < 0 && striker_vy <= 0) {
			views[2][5] = 90*Math.PI/180 + theta;
			views[2][0] = striker.position.x + 100*Math.cos(theta);
			views[2][1] = striker.position.y + 100*Math.sin(theta);
			if(theta < Math.PI/2) views[2][4] = (60)*Math.PI/180;
			else views[2][3] = (-60)*Math.PI/180;

		}

		else if(striker_vx >= 0 && striker_vy < 0) {
			views[2][5] = -90*Math.PI/180 - theta;
			views[2][0] = striker.position.x - 100*Math.cos(theta);
			views[2][1] = striker.position.y + 100*Math.sin(theta);
			if(theta < Math.PI/4) views[2][4] = -60*Math.PI/180;
			else views[2][3] = -60*Math.PI/180
		}
		views[2][2] = 104;
	}
	else {
		views[2][0] = striker.position.x-100;
		views[2][1] = striker.position.y;
		views[2][2] = 104;
		views[2][3] = 0;
		views[2][4] = -60 * Math.PI/180;
		views[2][5] = (-90) * Math.PI/180;
	}
	camera.position.x =  views[current_view][0];
	camera.position.y = views[current_view][1];
	camera.position.z = views[current_view][2];
	camera.rotation.z = views[current_view][5];
	camera.rotation.x = views[current_view][3];
	camera.rotation.y = views[current_view][4];
}
