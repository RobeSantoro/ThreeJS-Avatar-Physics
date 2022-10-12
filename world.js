import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import Stats from 'three/examples/jsm/libs/stats.module.js'
import * as dat from 'dat.gui'
import * as CANNON from 'cannon-es'
import { Cube } from './cube.js'

export class World {
  constructor() {
    this.initCannonWorld()   
    this.initThreeWorld()
  }

  initCannonWorld() {
    this.cannonWorld = new CANNON.World()
    this.cannonWorld.gravity.set(0, -9.82, 0)
    this.cannonWorld.broadphase = new CANNON.NaiveBroadphase()
    this.cannonWorld.solver.iterations = 10
    this.cannonWorld.defaultContactMaterial.contactEquationStiffness = 1e9
    this.cannonWorld.defaultContactMaterial.contactEquationRelaxation = 1
    this.cannonWorld.defaultContactMaterial.friction = 0.3
    this.cannonWorld.defaultContactMaterial.frictionEquationStiffness = 1e9
    this.cannonWorld.defaultContactMaterial.frictionEquationRegularizationTime = 3
    this.cannonWorld.defaultContactMaterial.restitution = 0.3
    this.defaultCannonMaterial = new CANNON.Material()
    this.cannonWorld.addContactMaterial(new CANNON.ContactMaterial(this.defaultCannonMaterial, this.defaultCannonMaterial, {
      friction: 0,
      restitution: 0
    }))
    
    const floorShape = new CANNON.Plane()
    const floorBody = new CANNON.Body({
      mass: 0,
      shape: floorShape,
      material: this.defaultCannonMaterial,
      quaternion: new CANNON.Quaternion().setFromAxisAngle(new CANNON.Vec3(1, 0, 0), -Math.PI / 2)
    })
    this.cannonWorld.addBody(floorBody)
  }

  initThreeWorld() {
    this.scene = new THREE.Scene()
    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
    this.camera.position.z = 5

    this.stats = new Stats()
    this.stats.domElement.style.position = "static";
    document.body.appendChild(this.stats.domElement)

    const gui = new dat.GUI()
    const perfFolder = gui.addFolder("Performance");
    const perfLi = document.createElement("li");
    perfLi.appendChild(this.stats.domElement);
    perfLi.classList.add("gui-stats");
    perfFolder.__ul.appendChild(perfLi);
    perfFolder.open()

    const light = new THREE.DirectionalLight(0xffffff, 1)
    light.position.set(-1, 3, 4)
    this.scene.add(light)

    const gridHelper = new THREE.GridHelper(10, 10)
    gridHelper.position.y = -0.5
    this.scene.add(gridHelper)    

    this.renderer = new THREE.WebGLRenderer({ antialias: true })
    this.renderer.setSize(window.innerWidth, window.innerHeight)
    this.renderer.render(this.scene, this.camera)

    document.body.appendChild(this.renderer.domElement)

    this.controls = new OrbitControls(this.camera, this.renderer.domElement)

    window.addEventListener('resize', this.onWindowResize, false)
        
    const cube = new Cube({
      cubeSize: { x: 1, y: 1, z: 1 },
      cubePosition: { x: 0, y: 0, z: 0 },
      cubeColor: 0x00ff00,
      scene: this.scene,
      world: this.cannonWorld,
      defaultMaterial: this.defaultMaterial
    })

    this.update()
  }

  onWindowResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight
    this.camera.updateProjectionMatrix()
    this.renderer.setSize(window.innerWidth, window.innerHeight)    
  }

  update() {
    requestAnimationFrame((t) => {
      //console.log(Math.floor(t / 1000));
      if (this._previousRAF === null) {
        this._previousRAF = t;
      }

      this.update();

      
      
      
      this.renderer.render(this.scene, this.camera);        
      

      this._Step(t - this._previousRAF);
      this._previousRAF = t;
    });    

  }
  
  _Step(timeElapsed) {

    const timeElapsedS = timeElapsed * 0.001;
    this.controls.update()



    if (this.controls) { this.controls.update() }

    
    
    //this.cannonWorld.step(timeElapsedS);

  }

}