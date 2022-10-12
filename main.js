import * as THREE from 'three'
import { World } from './world.js'


let keyControls = {
  foward: false,
  backward: false,
  left: false,
  right: false,
  jump: false
}

// Add event listener to keydown
document.addEventListener('keydown', (event) => {
  switch (event.key) { // Keycode deprecated ?????
    case 'w':
    case 'ArrowUp':
      keyControls.foward = true
      break
    case 'a':
    case 'ArrowLeft':
      keyControls.left = true
      break
    case 's':
    case 'ArrowDown':
      keyControls.backward = true
      break
    case 'd':
    case 'ArrowRight':  
      keyControls.right = true
      break
    case ' ':
      keyControls.jump = true
      console.log('jump')
      break
    default:
      break
  }

})

// Add event listener to keyup
document.addEventListener('keyup', (event) => {
  switch (event.key) { // Keycode deprecated ?????
    case 'w':
    case 'ArrowUp':
      keyControls.foward = false
      break
    case 'a':
    case 'ArrowLeft':
      keyControls.left = false
      break
    case 's':
    case 'ArrowDown':
      keyControls.backward = false
      break
    case 'd':
    case 'ArrowRight':
      keyControls.right = false
      break
    case ' ':
      keyControls.jump = false
      break
    default:
      break
  }

})

const vel = .25

const clock = new THREE.Clock()
let oldElapsedTime = 0

let prevTime = performance.now();

function animate() {

  // Update the stats
  //stats.begin()

  const elapsedTime = clock.getElapsedTime()
  const deltaTime = elapsedTime - oldElapsedTime
  oldElapsedTime = elapsedTime

  // Update Cannon World
  world.step(1/60, deltaTime, 3)

  cube1._Update()
  cube2._Update()
  cube3._Update()

  // Update Key Controls
  if (keyControls.foward) {    
    cube1.cubeBody.velocity.z -= vel
  } else if (keyControls.backward) {
    cube1.cubeBody.velocity.z += vel
  }

  if (keyControls.left) {
    cube1.cubeBody.velocity.x -= vel
  } else if (keyControls.right) {
    cube1.cubeBody.velocity.x += vel
  }

  if (keyControls.jump) {
    cube1.cubeBody.velocity.y += vel
  }

  // Render the Scene
  renderer.render(scene, camera)

  // Update the controls  
  //console.log(controls.getObject().position.x, controls.getObject().position.y, controls.getObject().position.z);

  // Call the animate function again on the next frame
  requestAnimationFrame(animate)

  //stats.end()
}

/* animate() */




let APP = null;

window.addEventListener('DOMContentLoaded', () => {
  APP = new World();
  console.log(APP);
});