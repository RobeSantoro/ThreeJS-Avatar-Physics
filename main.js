import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
<<<<<<< HEAD

//import { Cube } from './cube.js'
=======
import { PointerLockControls } from 'three/examples/jsm/controls/PointerLockControls.js'
import { Cube } from './cube.js'
>>>>>>> 55221f28ab3234e13989df22c3544025af6aa19c
import * as CANNON from 'cannon-es'

import Stats from 'three/examples/jsm/libs/stats.module.js'

// Add Stats
const stats = new Stats()
document.body.appendChild(stats.dom)

// Create the Scene
const scene = new THREE.Scene()

// Add grid helper and axis helper
const gridHelper = new THREE.GridHelper(10, 10)
const axesHelper = new THREE.AxesHelper(5)
scene.add(gridHelper, axesHelper)

// Add a light
const light = new THREE.DirectionalLight(0xffffff, 1)
light.position.set(-1, 3, 4)

scene.add(light)

/////////////////////////////////////////////////////////// Cube Params

let cubePosition = new THREE.Vector3(0, 1, 0)
let cubeSize = new THREE.Vector3(1, 1, 1)

//////////////////////////////////////////////////////// Three.js World

// Create a cube
const cube = new THREE.Mesh(
  new THREE.BoxGeometry(cubeSize.x, cubeSize.y, cubeSize.z),
  new THREE.MeshStandardMaterial({
    color: 0x00ff00,
    roughness: 1,
    metalness: 0
  })
)
cube.position.y = (cubePosition.y * 0.5)
scene.add(cube)

////////////////////////////////////////////////// Cannon Physics World

const world = new CANNON.World()
world.gravity.set(0, -9.82, 0)
world.broadphase = new CANNON.SAPBroadphase(world)
//world.allowSleep = true

// Cannon Materials
const defaultMaterial = new CANNON.Material('default')

// Cannon Contact Material
const defaultcontactMaterial = new CANNON.ContactMaterial(
  defaultMaterial,
  defaultMaterial,
  {
<<<<<<< HEAD
    friction: 0.1,
=======
    friction: 0,
>>>>>>> 55221f28ab3234e13989df22c3544025af6aa19c
    restitution: 0
  }
)
world.addContactMaterial(defaultcontactMaterial)

// Floor
const floorShape = new CANNON.Plane()
const floorBody = new CANNON.Body({
  mass: 0,
  shape: floorShape,
  material: defaultMaterial,
  quaternion: new CANNON.Quaternion().setFromAxisAngle(new CANNON.Vec3(1, 0, 0), -Math.PI / 2)
})
world.addBody(floorBody)

///////////////////////////////////////////////////// Cube cannon shape

const cubeShape = new CANNON.Box(new CANNON.Vec3(cubeSize.x * .5, cubeSize.y * .5, cubeSize.z * .5))
// Cube cannon body
const cubeBody = new CANNON.Body({
  mass: 1,
  position: cubePosition,
  shape: cubeShape,
  //quaternion: new CANNON.Quaternion().setFromEuler(45, 0, 0),
  material: defaultMaterial
})
world.addBody(cubeBody)

//////////////////////////////////////////////////////////////// Camera

// Camera
const camera = new THREE.PerspectiveCamera(30, window.innerWidth / window.innerHeight, 0.1, 1000)
camera.position.set(0, 5, 10)
camera.lookAt(new THREE.Vector3(cubePosition.x, cubePosition.y, cubePosition.z))

const cameraGroup = new THREE.Group()
cameraGroup.position.set(0, 0, 0)
cameraGroup.add(camera)
//scene.add(cameraGroup) // Added by controls.getObject()

////////////////////////////////////////////////////////////// Renderer

// Create the Renderer
const renderer = new THREE.WebGLRenderer({
  antialias: true
})
// Render the Scene
renderer.setSize(window.innerWidth, window.innerHeight)
renderer.render(scene, camera)

//////////////////////////////////////////////////////////// Canvas DOM 

const canvas = renderer.domElement
document.body.appendChild(canvas)

////////////////////////////////////////////////// Pointerlock Controls

const controls = new PointerLockControls(cameraGroup, canvas)
//console.log(controls.getObject())
scene.add(controls.getObject());

///////////////////////////////////////////////////// Keyboard Controls

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
      keyControls.foward = true
      break
    case 'a':
      keyControls.left = true
      break
    case 's':
      keyControls.backward = true
      break
    case 'd':
      keyControls.right = true
      break
    case 'space':
      keyControls.jump = true
      break
    default:
      break
  }

};

document.addEventListener('keydown', onKeyDown);
document.addEventListener('keyup', onKeyUp);

canvas.addEventListener('click', function () {
  controls.lock()
})

<<<<<<< HEAD
// Add event listener to keyup
document.addEventListener('keyup', (event) => {
  switch (event.key) { // Keycode deprecated ?????
    case 'w':
      keyControls.foward = false
      break
    case 'a':
      keyControls.left = false
      break
    case 's':
      keyControls.backward = false
      break
    case 'd':
      keyControls.right = false
      break
    case 'space':
      keyControls.jump = false
      break
    default:
      break
  }

})

const vel = 0.2
=======
////////////////////////////////////////////////////////// Animate Loop
>>>>>>> 55221f28ab3234e13989df22c3544025af6aa19c


const clock = new THREE.Clock()
let oldElapsedTime = 0

let prevTime = performance.now();
//console.log(prevTime);

function animate() {

<<<<<<< HEAD
  // Update the stats
  stats.begin()

=======
  // Call the animate function again on the next frame
  requestAnimationFrame(animate)

  /* // CANNON Physics
>>>>>>> 55221f28ab3234e13989df22c3544025af6aa19c
  const elapsedTime = clock.getElapsedTime()
  const deltaTime = elapsedTime - oldElapsedTime
  oldElapsedTime = elapsedTime

  // Update Cannon World
<<<<<<< HEAD
  world.step(1/60, deltaTime, 3)
  cube.position.copy(cubeBody.position)
  cube.quaternion.copy(cubeBody.quaternion)
=======
  world.step(1 / 60, deltaTime, 3) */

  // Update cube position
  // cube.position.copy(cubeBody.position)

  // Update camera position
  const time = performance.now();

  if (controls.isLocked === true) {

    const delta = (time - prevTime) / 1000;

    velocity.x -= velocity.x * 0.001 * delta;
    velocity.z -= velocity.z * 0.001 * delta;

    
    //velocity.y -= 9.8 * 100.0 * delta; // 100.0 = mass
    
    direction.z = Number(moveForward) - Number(moveBackward);
    direction.x = Number(moveRight) - Number(moveLeft);
    direction.normalize(); // this ensures consistent movements in all directions
    
    if (moveForward || moveBackward) velocity.z -= direction.z * 1 * delta;
    if (moveLeft || moveRight) velocity.x -= direction.x * 1 * delta;
    
    //console.log(velocity.x, velocity.z);
    /* if (onObject === true) {

      velocity.y = Math.max(0, velocity.y);
      canJump = true;

    } */

    controls.moveRight(- velocity.x * delta);
    controls.moveForward(- velocity.z * delta);

    //controls.getObject().position.y += (velocity.y * delta); // new behavior

    /*     if (controls.getObject().position.y < 10) {
    
          velocity.y = 0;
          controls.getObject().position.y = 10;
    
          canJump = true;
    
        } */


  }

  prevTime = time;
>>>>>>> 55221f28ab3234e13989df22c3544025af6aa19c

  // Update Key Controls
  if (keyControls.foward) {    
    cubeBody.velocity.z -= vel
  } else if (keyControls.backward) {
    cubeBody.velocity.z += vel
  }

  if (keyControls.left) {
    cubeBody.velocity.x -= vel
  } else if (keyControls.right) {
    cubeBody.velocity.x += vel
  }

  console.log(keyControls);

  // Render the Scene
  renderer.render(scene, camera)

  // Update the controls  
  //console.log(controls.getObject().position.x, controls.getObject().position.y, controls.getObject().position.z);


<<<<<<< HEAD
  // Call the animate function again on the next frame
  requestAnimationFrame(animate)

  stats.end()
=======
>>>>>>> 55221f28ab3234e13989df22c3544025af6aa19c
}

animate()

// Add a listener to the window resize event
window.addEventListener('resize', function () {
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  renderer.setSize(window.innerWidth, window.innerHeight)
})