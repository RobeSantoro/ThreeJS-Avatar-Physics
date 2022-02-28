import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
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

let cubePosition = new THREE.Vector3(0, 1, 5)
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

const cubeShape = new CANNON.Box(new CANNON.Vec3(cubeSize.x*.5, cubeSize.y*.5, cubeSize.z*.5))
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

scene.add(camera)

////////////////////////////////////////////////////////////// Renderer

// Create the Renderer
const renderer = new THREE.WebGLRenderer({
  antialias: true
})
// Render the Scene
renderer.setSize(window.innerWidth, window.innerHeight)
renderer.render(scene, camera)

document.body.appendChild(renderer.domElement)

///////////////////////////////////////////////////////// Orbit Controls

const controls = new OrbitControls(camera, renderer.domElement)
controls.enableDamping = true
controls.dampingFactor = 0.25
controls.target.set(cubePosition.x, cubePosition.y, cubePosition.z)

const offset = new THREE.Vector3(0, 0, 0)

/////////////////////////////////////////////////////////// Animate Loop

const clock = new THREE.Clock()
let oldElapsedTime = 0

// Add event listener to keypresses
document.addEventListener('keydown', (event) => {
  if (!event.repeat) {
    //console.log(event.repeat);
    switch (event.code) { // Keycode deprecated ?????
      case "KeyW":
      case "ArrowUp":
        cubeBody.velocity.z -= 5 // Move forward
        break
      case "KeyA":
      case "ArrowLeft":
        cubeBody.velocity.x -= 5 // Move left
        break
      case "KeyS":
      case "ArrowDown":
        cubeBody.velocity.z += 5 // Move backward      
        break
      case "KeyD":
      case "ArrowRight":
        cubeBody.velocity.x += 5 // Move right      
        break
      case 'Space':
        cubeBody.velocity.y += 5 // Jump
        break
      default:
        break
    }
  }
}, false)

document.addEventListener('keyup', (event) => {  
  switch (event.code) { // Keycode deprecated ?????
    case "KeyW":
    case "ArrowUp":
    case "KeyS":
    case "ArrowDown":
    case "KeyA":
    case "ArrowLeft":
    case "KeyD":
    case "ArrowRight":
      cubeBody.velocity.set(0, 0, 0) // Stop moving
      break
    //case 'Space':
      cubeBody.velocity.set(0, 0, 0) // Stop jumping
    default:
      break
  }
}, false)

function animate() {

  const elapsedTime = clock.getElapsedTime()
  const deltaTime = elapsedTime - oldElapsedTime
  oldElapsedTime = elapsedTime

  // Update Cannon World
  world.step(1 / 60, deltaTime, 3)

  // Update cube position
  //cube.position.y = cubeBody.position.y
  //console.log(cubeBody.position.y);
  cube.position.copy(cubeBody.position)
  //cube.quaternion.copy(cubeBody.quaternion)

  // Render the Scene
  renderer.render(scene, camera)

  // Update the controls  
  //console.log(cubeBody.position.x, cubeBody.position.y, cubeBody.position.z);
  
  //controls.object.position.copy(cubeBody.position)
  controls.target.set(cube.position.x, cube.position.y, cube.position.z)
  controls.update()

  // Call the animate function again on the next frame
  requestAnimationFrame(animate)
}

animate()

// Add a listener to the window resize event
window.addEventListener('resize', function () {
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  renderer.setSize(window.innerWidth, window.innerHeight)
})