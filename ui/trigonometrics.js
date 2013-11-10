function getAngleToPoint(x, y, robot) {
  var dx = x - robot.position.x;
  var dy = y - robot.position.y;
  var angle = Math.atan(dy/dx) * 180 / Math.PI;
  var targetAngle = 0; 
//  robot.log("\nx: " + x + "\ny: " + y + "\nrx: " + robot.position.x + "\nry: " + robot.position.y);
  
  if (dx > 0 && dy > 0) {
//    robot.log("dx > 0 && dy > 0");
		targetAngle = 90 + angle;		    
  }
  if (dx > 0 && dy < 0) {
//    robot.log("dx > 0 && dy < 0");
    targetAngle = 90 + angle;
  }
  if (dx < 0 && dy < 0) {
//    robot.log("dx < 0 && dy < 0");
    targetAngle = 270 + angle;
  }
  if (dx < 0 && dy > 0) {
//    robot.log("dx < 0 && dy > 0");
    targetAngle = 270 + angle;
  }  
  if (dx == 0) {
		  if (dy > 0) {
		  	targetAngle = 90;	  
      } else if (dy > 0) {
        targetAngle = 270;
      } else {
      	targetAngle = robot.angle; // change point  
      }    
  }  
  if (dy == 0) {
		  if (dx > 0) {
		  	targetAngle = 0;  
      } else if (dx > 0) {
      	targetAngle = 180;  
      } else {
      	targetAngle = robot.angle; // change point  
      }     
  }
  return Math.round(targetAngle);
}

// var volley = 0;
// function fireVolley(robot) {
//   if (volley > 0 && robot.gunCoolDownTime <=0 ) {
//     robot.fire();
//     volley--;
//   }  
// }

// function track(robot) {
// 	robot.rotateCannon(5);
//   robot.rotateCannon(-10);
// }

// // Rotate turret to given angle
// function aim(targetAngle, robot) {
//   var currentAngle = robot.cannonAbsoluteAngle + 270; // Is it always different!???
//   if (currentAngle > 360) {
//     currentAngle -= 360;  
//   }
//   robot.rotateCannon(getRotationToAngle(targetAngle, currentAngle));
// }

// // Returns the closest direction in which to rotate to a given angle 
// function getRotationToAngle(targetAngle, currentAngle) {
//   var diff = targetAngle - currentAngle;
//   var rotation = 0;
// //  robot.log("\nca = " + currentAngle + "\nta = " + targetAngle + "\ndiff = " + diff);
//   if (diff > 180) {
//     rotation = diff - 360;    
//   } else if (diff < -180) {
//     rotation = diff + 360; 
//   } else if (diff != 0) {
//     rotation = diff; 
//   }  
//   return rotation;
// }

// // proportions for moving and turning tank each step
// var movementStep = {
//   speed : 0.5,
//   rotate : 0.5,
//   rotationLeft : 0 // angle to rotate to
// }
// function move(robot, duration, x, y) {
//   var absRot = Math.round(duration * movementStep.rotate);
//   var dist = Math.round(duration * movementStep.speed); 
//   robot.ahead(dist);
  
//   // calculate angle to destination point
//   if (movementStep.rotationLeft == 0) {
//     movementStep.rotationLeft = getRotationToAngle(getAngleToPoint(x, y, robot), robot.angle);
		
//   }
  
// 	var rot = 0; //actual rotation for this turn  
// 	var additionalMovement = 0; // movement if no rotaion required 
  
// /*  robot.log(robot.angle);  
//   robot.log(getAngleToPoint(x, y, robot));
//   robot.log(movementStep.rotationLeft);
  
//   robot.turn(movementStep.rotationLeft);  */  
 
  
//   if (movementStep.rotationLeft > 0) {
//     // Turn tank CW
//     if (movementStep.rotationLeft < absRot) {
//     	rot = movementStep.rotationLeft; 
//       additionalMovement = absRot - rot;
//     } else {
//       rot = absRot;
//     }
//     robot.turn(rot);
//     movementStep.rotationLeft -= rot;   
//   } else if (movementStep.rotationLeft < 0) {
//     // Turn tank CCW
//     if (movementStep.rotationLeft > -absRot) {
//     	rot = movementStep.rotationLeft; 
//       additionalMovement = absRot + rot;
//     } else {
//       rot = -absRot;
//     }
//     robot.turn(rot);
//     movementStep.rotationLeft -= rot;    
//   } else {
//     additionalMovement = absRot;
//   }  
  
//   // Additional move if no rotation needed
//   if (additionalMovement > 0) {
// 		robot.ahead(additionalMovement);    
//   }