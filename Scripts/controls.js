
document.addEventListener("keydown",keyDownHandler, false); 
document.addEventListener("keyup",keyUpHandler, false); 
canvas.addEventListener("mousedown", mousedownHandler);
canvas.addEventListener("mouseup", mouseupHandler);
canvas.addEventListener("DOMMouseScroll", mousewheelHandler);

function mousewheelHandler(event) {
	if(shoot_status != 2) return;
	var temp = -event.detail;
	if(temp > 0) shoot_speed++;
	else shoot_speed--;
}

function mousedownHandler(event) {


	prevmx = event.clientX;
	prevmy = event.clientY;
}

function mouseupHandler(event) {
	curmx = event.clientX;
	curmy = event.clientY;
	if(curmx > prevmx && shoot_status == 0) {
		striker.position.y -= 80.0/500.0*(curmx-prevmx);
	}
	else if(shoot_status == 0) {
		striker.position.y -= 80.0/500.0*(curmx-prevmx);

	}
	if(shoot_status == 1) {
		shoot_angle-=((curmx-prevmx)/500.0*2.0*Math.PI/2.0);
	}
}

function keyDownHandler(event)
{
	var keyPressed = event.keyCode;

	if (keyPressed == 37)
	{
		if(shoot_status == 1) angle_change = 1;
		else if(shoot_status == 0) striker_direction = 1;
	}
	else if(keyPressed == 39) {
		if(shoot_status == 1) angle_change = -1;
		else if(shoot_status == 0) striker_direction = -1;
	}
	if(keyPressed == 38) {
		if(shoot_status == 2) speed_inc = 1;
	}
	if(keyPressed == 40) {
		if(shoot_status == 2) speed_inc = -1;
	}
}

function keyUpHandler(event)
{
	var keyPressed = event.keyCode;
	if (keyPressed == 13)
	{
		if(shoot_status == 0) {
			striker_direction = 0;
			draw_dir = 1;
			shoot_status = 1;
		}
		else if (shoot_status == 1) {
			draw_dir = 0;
			shoot_status = 2;
		}
		else if(shoot_status == 2) {
			shoot_status = 3;
				coll_audio.play();
			striker_vx = init_vx = shoot_speed*Math.cos(shoot_angle);
			striker_vy = init_vy = shoot_speed*Math.sin(shoot_angle);
		}	
	}
	else if((keyPressed == 37 || keyPressed == 39)) {
		if(shoot_status == 1) angle_change = 0;
		else if(shoot_status == 0) striker_direction = 0;
	}
	else if(keyPressed == 38 || keyPressed == 40) {
		if(shoot_status == 2) speed_inc = 0;
	}
	else if(keyPressed == 86) current_view = ((current_view+1)%3);
	else if(keyPressed == 87) {
		color = 0;
		setup_continue();
	}
	else if(keyPressed == 66) {
		color = 1;
		setup_continue();
		
	}
}