import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { PointerLockControls } from 'three/examples/jsm/controls/PointerLockControls.js'
import { Cube } from './cube.js'
import * as CANNON from 'cannon-es'

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
    friction: 0,
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

// Add event listener to keypresses
let moveForward = false;
let moveBackward = false;
let moveLeft = false;
let moveRight = false;
let canJump = true;

let velocity = new THREE.Vector3(0, 0, 0)
const direction = new THREE.Vector3(0, 0, 1);

const onKeyDown = function (event) {

  switch (event.code) {

    case 'ArrowUp':
    case 'KeyW':
      moveForward = true;
      break;

    case 'ArrowLeft':
    case 'KeyA':
      moveLeft = true;
      break;

    case 'ArrowDown':
    case 'KeyS':
      moveBackward = true;
      break;

    case 'ArrowRight':
    case 'KeyD':
      moveRight = true;
      break;

    case 'Space':
      if (canJump === true) velocity.y += 350;
      canJump = false;
      break;

  }

};

const onKeyUp = function (event) {

  switch (event.code) {

    case 'ArrowUp':
    case 'KeyW':
      moveForward = false;
      break;

    case 'ArrowLeft':
    case 'KeyA':
      moveLeft = false;
      break;

    case 'ArrowDown':
    case 'KeyS':
      moveBackward = false;
      break;

    case 'ArrowRight':
    case 'KeyD':
      moveRight = false;
      break;

  }

};

document.addEventListener('keydown', onKeyDown);
document.addEventListener('keyup', onKeyUp);

canvas.addEventListener('click', function () {
  controls.lock()
})

////////////////////////////////////////////////////////// Animate Loop


const clock = new THREE.Clock()
let oldElapsedTime = 0

let prevTime = performance.now();
//console.log(prevTime);

function animate() {

  // Call the animate function again on the next frame
  requestAnimationFrame(animate)

  /* // CANNON Physics
  const elapsedTime = clock.getElapsedTime()
  const deltaTime = elapsedTime - oldElapsedTime
  oldElapsedTime = elapsedTime

  // Update Cannon World
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

  // Render the Scene
  renderer.render(scene, camera)

  // Update the controls  
  //console.log(controls.getObject().position.x, controls.getObject().position.y, controls.getObject().position.z);


}

animate()

// Add a listener to the window resize event
window.addEventListener('resize', function () {
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  renderer.setSize(window.innerWidth, window.innerHeight)
})