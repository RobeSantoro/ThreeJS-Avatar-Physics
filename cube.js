import * as THREE from 'three';

export class Cube {
  constructor(params) {
    this._CreateCube(params)
  }
    
  _CreateCube(params) {
    const geometry = new THREE.BoxGeometry(1, 1, 1)
    const material = new THREE.MeshStandardMaterial({ color: 0x00ff00 })
    const cube = new THREE.Mesh(geometry, material)
    params.add(cube)
  }

  _CreateCannonCube(params) {
    const shape = new CANNON.Box(new CANNON.Vec3(1, 1, 1))
    const body = new CANNON.Body({ mass: 0 })
    body.addShape(shape)
  }

}