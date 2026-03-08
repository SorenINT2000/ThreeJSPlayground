import {
    Scene,
    PerspectiveCamera,
    WebGLRenderer,
    BoxGeometry,
    MeshBasicMaterial,
    Mesh,
    TextureLoader,
} from 'three';

import { PointerLockControls } from 'three/examples/jsm/controls/PointerLockControls.js';

const loader = new TextureLoader();
const texture = loader.load( 'resources/images/texture.jpg' );

const scene = new Scene();

const camera = new PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
const controls = new PointerLockControls(camera, document.body);
// Lock mouse on click
document.addEventListener('click', () => {
    controls.lock();
});

camera.position.z = 5;

const renderer = new WebGLRenderer({ antialias: true });
const canvas = renderer.domElement;
const ctx = canvas.getContext('2d');

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

function cameraNeedsMovement(A: boolean, D: boolean, Lshift: boolean, Space: boolean, S: boolean, W: boolean): boolean {
    return A !== D || Lshift !== Space || S !== W;
}

renderer.setAnimationLoop((time) => {
    if (resizeRendererToDisplaySize(renderer)) {
        const canvas = renderer.domElement;
        camera.aspect = canvas.clientWidth / canvas.clientHeight;
        camera.updateProjectionMatrix();
    }

    if (cameraNeedsMovement(A, D, Lshift, Space, S, W)) {
        camera.translateX(mvt * (Number(D) - Number(A)));
        camera.translateY(mvt * (Number(Space) - Number(Lshift)));
        camera.translateZ(mvt * (Number(S) - Number(W)));
        camera.updateProjectionMatrix()
    }

    cube.rotation.x = time / 2000;
    cube.rotation.y = time / 1000;
    renderer.render( scene, camera );
});
