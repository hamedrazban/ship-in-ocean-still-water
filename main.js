
import './style.css'
import javascriptLogo from './javascript.svg'
import { setupCounter } from './counter.js'
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { Water } from 'three/examples/jsm/objects/Water.js';
import { Sky } from 'three/examples/jsm/objects/Sky.js';
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader'
import * as vesseljs from 'vesseljs'
import * as Mirror from 'mirror'

import * as Gui from 'vesseljs/examples/3D_engine/dat.gui.min.js'
import {browse_files_Elias_Hasle} from 'vesseljs/examples/libs/browse_files_Elias_Hasle.js'
import {Patch_interpolation} from 'vesseljs/examples/3D_engine/Patch_interpolation.js'
import {Configureable_ocean} from 'vesseljs/examples/3D_engine/legacy/Configureable_ocean.js'




import {STLLoader} from 'vesseljs/examples/3D_engine/STLLoader.js'
import {mirror} from 'vesseljs/examples/3D_engine/legacy/Mirror.js'
import {WaterShader} from 'vesseljs/examples/3D_engine/legacy/WaterShader.js'
// import {OrbitControls} from 'vesseljs/examples/3D_engine/OrbitControls.js'
import {skybox_from_examples as Skybox} from 'vesseljs/examples/3D_engine/legacy/skybox_from_examples.js'
import {Playback} from 'vesseljs/examples/3D_engine/Playback.js'
import {Ship3D_v2 as Ship3D} from 'vesseljs/examples/3D_engine/Ship3D_v2.js'

// import * as Skybox from '/vesseljs/examples/3D_engine/legacy/skybox_from_examples.js'
// import * as Playback from '/vesseljs/examples/3D_engine/Playback.js'
// import * as Ship3D from '/vesseljs/examples/3D_engine/Ship3D_v2.js'


const loader= new THREE.GLTFLoader()


"use strict";

//Globals
var renderer, camera, controls, gui, stats;
var scene, zUpCont, playback, bodies, ocean, ship3D;


function main() {
    //Renderer setup
    //document.body.style = "overflow: hidden;";
    document.body.style.overflow = "hidden";
    var container = document.createElement("div");
    //container.style = "position: absolute; top: 0; left: 0;"
    Object.assign(container.style, {
        position: "absolute",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh"
    });
    document.body.appendChild(container);
    renderer = new THREE.WebGLRenderer({
        antialias: true
    });
    
    //renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x99aadd);
    container.appendChild(renderer.domElement);

    playback = new Playback({
        parentGUI: gui
    });

    //Scene setup:
    scene = new THREE.Scene();
    let sun = new THREE.DirectionalLight(0xffffff, 2);
    sun.position.set(-512, 246, 128);
    scene.add(sun);

    //Ocean size
    let oSize = 2048;

    scene.add(new Skybox(oSize));

    //Use Z up from now on:
    THREE.Object3D.DefaultUp.set(0, 0, 1);
    zUpCont = new THREE.Group();
    zUpCont.rotation.x = -0.5 * Math.PI;
    scene.add(zUpCont);

    //Camera setup
    camera = new THREE.PerspectiveCamera(26, window.innerWidth / window.innerHeight, 1, 1000000);
    let onResize = function() {
        let w = container.clientWidth;
        let h = container.clientHeight;
        renderer.setSize(w, h);
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
    };
    window.addEventListener('resize', onResize, false);
    onResize();
    camera.position.set(oSize * 0.05, -oSize * 0.3, oSize * 0.05);
    camera.lookAt(zUpCont.position);
    zUpCont.add(camera);

    controls = new THREE.OrbitControls(camera, renderer.domElement);
    //controls.minDistance = 0;
    controls.maxDistance = 0.5 * oSize;
    controls.enablePan = false;
    controls.maxPolarAngle = 0.5 * Math.PI - 0.1;
    controls.minPolarAngle = 0.1;

    //zUpCont.add(new THREE.AxisHelper(1000));
    zUpCont.add(new THREE.HemisphereLight(0xccccff, 0x666688, 1));

    ocean = new Ocean({
        parentGUI: gui,
        sunDir: sun.position.clone().normalize(),
        size: oSize,
        segments: 127
    });
    playback.add(ocean);
    zUpCont.add(ocean);

    Vessel.loadShip( /*"vesseljs/examples/specs/ship_specifications/PX121.json"*/
        /*"vesseljs/examples/specs/ship_specifications/blockCase.json"*/
        /*"vesseljs/examples/specs/ship_specifications/prismaticHull.json"*/
        "vesseljs/examples/ship_specs/trapezoidPrismHull.json",
        function(ship) {
            ship3D = new Ship3D(ship, {
                upperColor: 0x33aa33,
                lowerColor: 0xaa3333,
                hullOpacity: 1,
                deckOpacity: 1,
                objectOpacity: 1
            });
            zUpCont.add(ship3D);
        });

    playback.play();

    requestAnimationFrame(animate);
}




// my boats ================================================================================




// function random(min,max){
// return Math.random()*(max-min)+min
// }

// class movingBoat {
// constructor(folder){
// loader.load(`assets/${folder}/scene.gltf`,(gltf)=>{
// scene.add(gltf.scene)
// gltf.scene.scale.set(10,10,10)
// gltf.scene.position.set(random(-200,200),7,random(-200,200))
// gltf.scene.rotation.set(0,random(0,10),0)
// this.movingboat=gltf.scene
// })
// }
// update(){
// if(this.movingboat){
// this.movingboat.rotation.y += .01
// this.movingboat.translateX(-2)
// }
// }
// }
// const movingBoat1= new movingBoat('boat2')
// const movingBoat2= new movingBoat('boat3')


// class Boat {
// constructor(folder,_x,_y,_z,_r){
// loader.load(`assets/${folder}/scene.gltf`,(gltf)=> {
// scene.add(gltf.scene)
// gltf.scene.scale.set(5,5,5)
// gltf.scene.position.set(_x,_y,_z)
// gltf.scene.rotation.set(0,_r,0)
// this.boat=gltf.scene
// this.speed={
// vel:0,
// rot:0
// }
// })
// }
// stop(){
// this.speed.vel=0
// this.speed.rot=0
// }
// update(){
// if(this.boat){
// this.boat.rotation.y += this.speed.rot
// this.boat.translateX(this.speed.vel)
// }
// }
// }
// const boat1=new Boat('boat1',0,22,20,2)
// ======================================================================================================

function animate(millitime) {

    let playing = playback.update();

    //Disable this to freeze water when not playing
    if (!playing) {
        ocean.water.material.uniforms.time.value += 1 / 60;
    }

    ocean.water.render();

    renderer.render(scene, camera);
    requestAnimationFrame(animate);
}