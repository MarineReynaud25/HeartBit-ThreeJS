import * as THREE from 'three';
//import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';
import { STLLoader } from 'three/addons/loaders/STLLoader';
import { OBJLoader } from 'three/addons/loaders/OBJLoader';
import { FBXLoader } from 'three/addons/loaders/FBXLoader';
import { MTLLoader } from 'three/addons/loaders/MTLLoader';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';



console.log(THREE);
//const gui = new GUI();
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 15;

const canvas = document.getElementById('canvas');
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true,
});

renderer.setSize( window.innerWidth, window.innerHeight );
renderer.setPixelRatio( window.devicePixelRatio );

const composer = new EffectComposer(renderer);
const renderPass = new RenderPass(scene, camera);
const bloomPass = new UnrealBloomPass(
    new THREE.Vector2(window.innerWidth, window.innerHeight),
    0.35 , // strength
    1, // radius
    0.2 // threshold
);
const outputPass = new OutputPass();

composer.addPass(renderPass);
composer.addPass(bloomPass);
composer.addPass(outputPass);


//const controls = new OrbitControls(camera, canvas);

window.addEventListener('resize', () => {
    camera.aspect =  window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
});

const textureLoader = new THREE.TextureLoader();
let loaded = false;
const loading = document.getElementById("loading");
let textureEquirec = textureLoader.load( './assets/bedroom3.webp' ,()=>{
    loaded = true;
    loading.style.visibility = "hidden";
},
// function (xhr) {
//     //if 100% loaded
//     console.log("Loading state");
//     console.log((xhr.loaded / xhr.total * 100) + "% loaded");

// }
);
textureEquirec.mapping = THREE.EquirectangularReflectionMapping;
textureEquirec.colorSpace = THREE.SRGBColorSpace;
scene.background = textureEquirec;

const light = new THREE.AmbientLight(0xffffff, 2, 0, 0.01);
scene.add(light);

const loader = new STLLoader();
let heartMesh2;
loader.load(
    './assets/Heart.stl',
    (geometry) => {
        const initialMaterial = new THREE.MeshPhysicalMaterial({
            color: 0xff0000,
            opacity: 0,
            visible: true,
            alphaTest:0,
            clearcoat: 0.5,
            clearcoatRoughness: 0.25,
            envMap: textureEquirec,
            envMapIntensity: 1.0,
            ior: 2,
            iridescence: 0.1,
            metalness: 1,
            roughness: 0.1,
            thickness: 2.0,
            transmission: 1.0,
        });

        heartMesh2 = new THREE.Mesh(geometry, initialMaterial);
        scene.add(heartMesh2);
        heartMesh2.position.set(-2.9, -1.3, 9.1);
        heartMesh2.rotation.set(23, 0, 0.1);
        heartMesh2.scale.set(0.01, 0.01, 0.01);   


    },
);

let heartMesh
let heartInitialPosition;
let light2 = undefined;
const loader5 = new STLLoader();
loader5.load(
    './assets/Heart.stl',
    (geometry) => {
        const initialMaterial = new THREE.MeshStandardMaterial({
            color: 0xff00ff,
            roughness: 0.5, 
            metalness: 0.8,
        });

        heartMesh = new THREE.Mesh(geometry, initialMaterial);
        scene.add(heartMesh);
        heartMesh.scale.set(0.015,0.015,0.015);
        heartMesh.position.set(7,-5,0);
        heartMesh.rotation.set(-70.7,0,0);   
        heartInitialPosition = heartMesh.position.y;

        light2 = new THREE.SpotLight( 0xffffff, 5, 0, 0.03, 0, 0 );
        light2.decay = 0;
        light2.position.set( 3, 10, 180 );
        scene.add( light2 );
        light2.target = heartMesh;
        light2.visible = false;
    },
    
);

const loader4 = new STLLoader();
loader4.load(
    './assets/support.stl',
    (support) => {
        var textureLoader = new THREE.TextureLoader().load('./assets/bois.jpg');

        let geometry = support;
        let material = new THREE.MeshStandardMaterial({
            map: textureLoader
        });
        var mesh = new THREE.Mesh(geometry,material)
        mesh.scale.set(0.02,0.02,0.02);
        mesh.position.set(8, -5, -2);
        scene.add(mesh);
})



const mtlLoader = new MTLLoader();
var table = undefined;
mtlLoader.load("./assets/Table.mtl", function(materials)
{
    materials.preload();
    var objLoader = new OBJLoader();
    objLoader.setMaterials(materials);
    objLoader.load("./assets/Table.obj", function(object)
    {    
        table = object;
        table.position.set(129.8, -237.9, -271.4);
        table.rotation.set(0, 0.6, 0);
        scene.add( table );
    });
});

var loader6 = new FBXLoader();
loader6.load(
    './assets/lavalamp.fbx',
    function (object) {
        object.position.set(29.5,-37.3,-79.1);
        scene.add(object);
    },
);

var loader3 = new GLTFLoader();
var sword = undefined;   
loader3.load( './assets/marine.glb', function ( gltf )
{
    sword = gltf.scene;  
    sword.scale.set(8, 8, 8);
    sword.position.set(-3, -12.3, 8);
    sword.rotation.set(0, 6.5, 0);
scene.add(sword);
} );



const losangegeo = new THREE.OctahedronGeometry( 3,0 ); 
const losangemat = new THREE.MeshPhongMaterial({
    color: 0x00ff00,
    opacity: 1,
    visible: true,
    alphaTest:0,
    clearcoat: 0.3,
    clearcoatRoughness: 0.25,
    envMap: textureEquirec,
    envMapIntensity: 1.0,
    ior: 2,
    iridescence: 0.8,
    metalness: 0.5,
    roughness: 0.5,
    thickness: 5.0,
    transmission: 1.0,

})
const losange = new THREE.Mesh(losangegeo, losangemat ); scene.add( losange );
losange.position.set(-3, 4, 8);
losange.scale.set(0.3, 0.3, 0.3);

const raycaster = new THREE.Raycaster();
let pointerPosition = { x: 0, y: 0 };
window.addEventListener('pointermove', (event) => {
    pointerPosition.x = ( event.clientX / window.innerWidth ) * 2 - 1;
    pointerPosition.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
});

const alert = document.getElementById("alert");


let state = false;
window.addEventListener('pointerdown', () => {
    raycaster.setFromCamera(pointerPosition, camera);
    const intersects = raycaster.intersectObject(heartMesh2);
    
    if (intersects.length > 0) {
        state = !state;
        light2.visible = false;
    } if(state) {
        light2.visible = true;
        
    }
});

let state2 = false;
window.addEventListener('pointerdown', () => {
    raycaster.setFromCamera(pointerPosition, camera);
    const intersects = raycaster.intersectObject(heartMesh);
    
    if (intersects.length > 0) {
        state2 = !state2;
        alert.style.visibility="hidden";
    } if(state2) {
        alert.style.visibility = "visible";
        
    }
});

let angle = 0
const animate = () => {
    requestAnimationFrame(animate);
    if (loaded){

        //controls.update()
        //renderer.render(scene, camera);
        composer.render();
        angle += 1
        losange.rotation.set(0,0.05*angle,0);
        
        if (heartMesh) {
            // Mouvement de haut en bas limité
            heartMesh.position.y = heartInitialPosition + Math.sin(Date.now() * 0.001) * 1;
            // Limiter le mouvement à y +2 et y -2
            if (heartMesh.position.y > heartInitialPosition + 1) {
                heartMesh.position.y = heartInitialPosition +1;
            } else if (heartMesh.position.y < heartInitialPosition - 1) {
                heartMesh.position.y = heartInitialPosition - 1;
            } 
        }
    }
};
    
    animate();