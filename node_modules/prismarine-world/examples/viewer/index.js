/* global THREE */
const { WorldView, Viewer } = require('prismarine-viewer/viewer')
const { Vec3 } = require('vec3')
global.THREE = require('three')
require('three/examples/js/controls/OrbitControls')

const version = '1.16.4'

const viewDistance = 6
const center = new Vec3(0, 90, 0)

const World = require('prismarine-world')(version)

const diamondSquare = require('diamond-square')({ version, seed: Math.floor(Math.random() * Math.pow(2, 31)) })
const world = new World(diamondSquare)

const worldView = new WorldView(world, viewDistance, center)

// Create three.js context, add to page
const renderer = new THREE.WebGLRenderer()
renderer.setPixelRatio(window.devicePixelRatio || 1)
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)

// Create viewer
const viewer = new Viewer(renderer)
viewer.setVersion(version)
// Attach controls to viewer
const controls = new THREE.OrbitControls(viewer.camera, renderer.domElement)

// Link WorldView and Viewer
viewer.listen(worldView)
// Initialize viewer, load chunks
worldView.init(center)

viewer.camera.position.set(center.x, center.y, center.z)
controls.update()

// Browser animation loop
const animate = () => {
  window.requestAnimationFrame(animate)
  if (controls) controls.update()
  worldView.updatePosition(controls.target)
  renderer.render(viewer.scene, viewer.camera)
}
animate()
