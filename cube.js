import * as THREE from 'three';
import * as CANNON from 'cannon-es'

export class Cube {
  constructor(params) {
    this._CreateThreeCube(params)
    this._CreateCannonCube(params)
  }
    
  _CreateThreeCube(params) {
    const geometry = new THREE.BoxGeometry(params.cubeSize.x, params.cubeSize.y, params.cubeSize.z)
    const material = new THREE.MeshStandardMaterial({ color: params.cubeColor })
    this.cubeMesh = new THREE.Mesh(geometry, material)
    this.cubeMesh.position.y = (params.cubePosition.y * 0.5)
    params.scene.add(this.cubeMesh)
  }

  _CreateCannonCube(params) {
    const cubeShape = new CANNON.Box(new CANNON.Vec3(params.cubeSize.x * .5, params.cubeSize.y * .5, params.cubeSize.z * .5))
    this.cubeBody = new CANNON.Body({
      mass: 1,
      position: params.cubePosition,
      shape: cubeShape,
      quaternion: new CANNON.Quaternion().setFromEuler(0, 0, 0),
      material: params.defaultMaterial
    })
    params.world.addBody(this.cubeBody)
  }

  _Update() {
    this.cubeMesh.position.copy(this.cubeBody.position)
    this.cubeMesh.quaternion.copy(this.cubeBody.quaternion)
  }

}

