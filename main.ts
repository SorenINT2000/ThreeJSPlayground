import {
    Scene,
    PerspectiveCamera,
    WebGLRenderer,
    BoxGeometry,
    MeshBasicMaterial,
    Mesh,
    TextureLoader,
    AmbientLight,
    Color,
    Vector2,
} from 'three';

import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { PointerLockControls } from 'three/examples/jsm/controls/PointerLockControls.js';
import { FirstPersonControls } from 'three/examples/jsm/Addons.js';
import { vec2 } from 'three/tsl';

const scene = new Scene();

const textureLoader = new TextureLoader();
const gltfLoader = new GLTFLoader();


const texture = textureLoader.load('texture.jpg');
gltfLoader.load(
    'snowman_amanda_losneck.glb',
    ( gltf ) => { scene.add(gltf.scene); console.log(gltf.scene.children[0].children[1]) },
    ( xhr ) => console.log(`${xhr.loaded / xhr.total * 100}% loaded`),
    ( error ) => console.error(error)
);

const light = new AmbientLight( 0x404040 ); // soft white light
scene.add(light);



const camera = new PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
const controls = new PointerLockControls(camera, document.body);
// const controls = new FirstPersonControls(camera, document.body)
// Lock mouse on click
document.addEventListener('click', () => {
    controls.lock();
});

camera.position.z = 5;

const renderer = new WebGLRenderer({ antialias: true });
const canvas = renderer.domElement;

canvas.setAttribute("tabIndex", "0");
document.body.appendChild(canvas);

// Cube
const geometry = new BoxGeometry( 1, 1, 1 );
const material = new MeshBasicMaterial( { map: texture } );
const cube = new Mesh( geometry, material );
scene.add( cube );

function resizeRendererToDisplaySize(renderer: WebGLRenderer) {
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    const needResize = canvas.width !== width || canvas.height !== height;
    if (needResize) {
        renderer.setSize(width, height, false);
    }
    return needResize;
}

canvas.addEventListener('focus', () => {
    console.log('has focus press a key');
});

canvas.addEventListener('blur', () => {
    console.log('lost focus');
});

const mvt = 0.1;

let A = false;
let D = false;

let Lshift = false;
let Space = false;

let S = false;
let W = false;

canvas.addEventListener('keydown', (e) => {
    if (e.repeat) return; // ignore repeated events from holding down a key
    switch (e.code) {
        case "KeyA":
            A = true;
            break;
        case "KeyD":
            D = true;
            break;

        case "ShiftLeft":
            Lshift = true;
            break
        case "Space":
            Space = true;
            break;

        case "KeyS":
            S = true;
            break;
        case "KeyW":
            W = true;
            break;

        default:
            console.log(`keyCode: ${e.code}`);
    }
});

canvas.addEventListener('keyup', (e) => {
    switch (e.code) {
        case "KeyA":
            A = false;
            break;
        case "KeyD":
            D = false;
            break;

        case "ShiftLeft":
            Lshift = false;
            break
        case "Space":
            Space = false;
            break;

        case "KeyS":
            S = false;
            break;
        case "KeyW":
            W = false;
            break;

        default:
            console.log(`keyCode: ${e.code}`);
    }
});


renderer.setAnimationLoop((time) => {
    // Todo: see if you can add an event listener for this instead of checking it every time
    if (resizeRendererToDisplaySize(renderer)) {
        const canvas = renderer.domElement;
        camera.aspect = canvas.clientWidth / canvas.clientHeight;
        camera.updateProjectionMatrix();
    }

    const movementVector = new Vector2(0, 0)
    if (W !== S)
        movementVector.y = W ? 1 : -1;
    if (A !== D)
        movementVector.x = D ? 1 : -1;

    // normalize movementVector
    movementVector.normalize();
    
    controls.moveForward(Number(movementVector.y) * mvt)
    controls.moveRight(Number(movementVector.x) * mvt)
    
    if (Space !== Lshift)
        camera.position.y += (Number(Space) - Number(Lshift)) * mvt;

    cube.rotation.x = time / 2000;
    cube.rotation.y = time / 1000;
    renderer.render( scene, camera );
});
