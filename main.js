import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

//import { Cube } from './cube.js'
import * as CANNON from 'cannon-es'

import Stats from 'three/examples/jsm/libs/stats.module.js'

// Add Stats
const stats = new Stats()
document.body.appendChild(stats.dom)

// Create the Scene
const scene = new THREE.Scene()

// Camera
const camera = new THREE.PerspectiveCamera(30, window.innerWidth / window.innerHeight, 0.1, 1000)
camera.position.set(-10, 5, 10)
camera.lookAt(new THREE.Vector3(0, 0, 0))

scene.add(camera)

// Add grid helper and axis helper
const gridHelper = new THREE.GridHelper(10, 10)
const axesHelper = new THREE.AxesHelper(5)
scene.add(gridHelper, axesHelper)

// Add a light
const light = new THREE.DirectionalLight(0xffffff, 1)
light.position.set(-1, 3, 4)

scene.add(light)

// Create the Renderer
const renderer = new THREE.WebGLRenderer( { 
  antialias: true
 } )
// Render the Scene
renderer.setSize(window.innerWidth, window.innerHeight)
renderer.render(scene, camera)

document.body.appendChild(renderer.domElement)

// Add OrbitControls
const controls = new OrbitControls(camera, renderer.domElement)
controls.autoRotate = true
controls.autoRotateSpeed = 0.1

//////////////////////////////////////////////////////////// Three.js World

// Create a cube
const cube = new THREE.Mesh(
  new THREE.BoxGeometry(1, 1, 1),
  new THREE.MeshStandardMaterial({
    color: 0x00ff00,
    roughness: 1,
    metalness: 0
  })
)

scene.add(cube)

////////////////////////////////////////////////////// Cannon Physics World
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

// Cube cannon shape
const cubeShape = new CANNON.Box(new CANNON.Vec3(.5,.5,.5))
// Cube cannon body
const cubeBody = new CANNON.Body({
  mass: 1,
  position: new CANNON.Vec3(0, 3, 0),
  shape: cubeShape,
  quaternion: new CANNON.Quaternion().setFromEuler(45, 0, 0),
  material: defaultMaterial
})
world.addBody(cubeBody)



////////////////////////////////////////////////////////////// Animate Loop

const clock = new THREE.Clock()
let oldElapsedTime = 0

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
})

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


function animate() {

  // Update the stats
  stats.begin()

  const elapsedTime = clock.getElapsedTime()
  const deltaTime = elapsedTime - oldElapsedTime
  oldElapsedTime = elapsedTime  

  // Update Cannon World
  world.step(1/60, deltaTime, 3)
  cube.position.copy(cubeBody.position)
  cube.quaternion.copy(cubeBody.quaternion)

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
  controls.update()

  // Call the animate function again on the next frame
  requestAnimationFrame(animate)

  stats.end()
}

animate()

// Add a listener to the window resize event
window.addEventListener('resize', function() {
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  renderer.setSize(window.innerWidth, window.innerHeight)
})