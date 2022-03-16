// Import Three.js
import * as THREE from 'three'
// Import OrbitControls
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

// Import Cannon.js
import * as CANNON from 'cannon-es'

// Import Stats
import Stats from 'three/examples/jsm/libs/stats.module.js'

// Import DAT GUI
import * as dat from 'dat.gui'

// Import Cube class
import { Cube } from './cube.js'

// Add Stats
const stats = new Stats()
stats.domElement.height = '48px';
//[].forEach.call(stats.domElement.children, (child) => (child.style.display = ''));
document.body.appendChild(stats.dom)

// DAT GUI
const gui = new dat.GUI()
const perfFolder = gui.addFolder("Performance");
const perfLi = document.createElement("li");
stats.domElement.style.position = "static";
perfLi.appendChild(stats.domElement);
perfLi.classList.add("gui-stats");
perfFolder.__ul.appendChild(perfLi);
perfFolder.open()


// Create the Scene
const scene = new THREE.Scene()

// Add grid helper and axis helper
const gridHelper = new THREE.GridHelper(10, 10)
scene.add(gridHelper)

// Add a light
const light = new THREE.DirectionalLight(0xffffff, 1)
light.position.set(-1, 3, 4)

scene.add(light)

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
    friction: 0.1,
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

/////////////////////////////////////////////////////////// Cube Params

const params = {
  scene: scene,
  world: world,
  cubePosition: new THREE.Vector3(0, 1, 0),
  cubeSize:new THREE.Vector3(1, 1, 1),
  cubeColor: 0xff0000,
  material: defaultMaterial
}

const cube1 = new Cube(params)
console.log(cube1)

const cube2 = new Cube({
  scene: scene,
  world: world,
  cubePosition: new THREE.Vector3(0, 2, 0),
  cubeSize:new THREE.Vector3(1, 1, 1),
  cubeColor: 0x00ff00,
  material: defaultMaterial
})

const cube3 = new Cube({
  scene: scene,
  world: world,
  cubePosition: new THREE.Vector3(0, 3, 0),
  cubeSize:new THREE.Vector3(1, 1, 1),
  cubeColor: 0x0000ff,
  material: defaultMaterial
})


//////////////////////////////////////////////////////////////// Camera

// Camera
const camera = new THREE.PerspectiveCamera(30, window.innerWidth / window.innerHeight, 0.1, 1000)
camera.position.set(0, 5, 10)
camera.lookAt(new THREE.Vector3(params.cubePosition.x, params.cubePosition.y, params.cubePosition.z))

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

// Orbit Controls
new OrbitControls(camera, renderer.domElement)

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

const vel = .5


const clock = new THREE.Clock()
let oldElapsedTime = 0

let prevTime = performance.now();

function animate() {

  // Update the stats
  stats.begin()

  const elapsedTime = clock.getElapsedTime()
  const deltaTime = elapsedTime - oldElapsedTime
  oldElapsedTime = elapsedTime

  // Update Cannon World
  world.step(1/60, deltaTime, 3)

  cube1._Update(deltaTime)
  cube2._Update(deltaTime)
  cube3._Update(deltaTime)

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

  stats.end()
}

animate()

// Add a listener to the window resize event
window.addEventListener('resize', function () {
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  renderer.setSize(window.innerWidth, window.innerHeight)
})