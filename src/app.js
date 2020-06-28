import * as THREE from 'three/build/three.module';
import { GLTFLoader } from 'three/examples/jsm/loaders/glTFLoader';

import pumo from './pumo.glb';
import pumoHairTex from './pumo-hair-tex-01.png';
import hairFragShader from './hair.frag';
import hairVertShader from './hair.vert';

const size = 300;

const loader = new GLTFLoader();
const center = new THREE.Vector2(size/2, size/2);
const clock = new THREE.Clock();
const cursor = new THREE.Vector2(0, 0);
const u_resolution = new THREE.Vector2(size, size);
const u_time = new THREE.Uniform(new Number(0.0));

let camera, scene, renderer;
let eagerness = 10;
const texLoader = new THREE.TextureLoader();

const hairUniforms = {
	colorA: { type: 'vec3', value: new THREE.Color(0xFF0000) },
	colorB: { type: 'vec3', value: new THREE.Color(0x00FF00) },
	u_resolution: { type: 'vec2', value: u_resolution },
	u_time,
	hair_tex: { type: 't', value: texLoader.load(pumoHairTex) },
}

onmousemove = (e) => {
	[ cursor.x, cursor.y ] = [ e.clientX, e.clientY ];
}

onresize = (_e) => {
	renderer.setSize( u_resolution );
	// TODO Redo the camera thing
	[ center.x, center.y ] = [ size/2, size/2 ];
	[ hairUniforms.u_resolution.x, hairUniforms.u_resolution.y ] = [ size, size ];
}

function setup() {
	camera = new THREE.PerspectiveCamera( 10, 1.0, 0.01, 1000 );	
	camera.position.z = 20;
	camera.lookAt(new THREE.Vector3(0,0,0))

    loader.load(pumo, function(gltf) {
		scene = new THREE.Scene();
		const pumo = gltf.scene || gltf.scenes[0];

		for (let o of pumo.children) {
			switch(o.name) {
				case 'Face':
					o.material = new THREE.MeshBasicMaterial({ color: 0xffffff });
					break;
				case 'Hair':
					o.material = new THREE.ShaderMaterial({
						uniforms: hairUniforms,
						vertexShader: hairVertShader,
						fragmentShader: hairFragShader
					});
					// o.material = new THREE.MeshBasicMaterial({ map: texLoader.load(pumoHairTex) });
					// o.material.map.flipY = false;
					break;
				case 'Beard':
					o.material = new THREE.MeshBasicMaterial({ color: 0x303030 });
					break;
				case 'Glasses':
					o.material = new THREE.MeshBasicMaterial({ color: 0x000000, wireframe: true });
					break;
			}
		}
		scene.add(pumo);

		let geom = new THREE.PlaneGeometry(3.5, 3.5);
		let mat = new THREE.ShaderMaterial({
			uniforms: hairUniforms,
			vertexShader: hairVertShader,
			fragmentShader: hairFragShader
		});
		// scene.add(new THREE.Mesh(geom, mat));

		scene.background = new THREE.Color( 0x404040 );
		clock.start();
	}, undefined, function(error) {
        console.log(error);
	});	

	renderer = new THREE.WebGLRenderer( { antialias: true, alpha: true } );
	renderer.setPixelRatio(window.devicePixelRatio);
	renderer.setSize( size, size );
	document.body.appendChild( renderer.domElement );
}

function loop() {
	if (scene && camera) {
		u_time.value = clock.getElapsedTime();
		let direction = { x: (cursor.x - center.x)/size, y: (center.y - cursor.y)/size };
		[ camera.position.x, camera.position.y ] = [ -eagerness*direction.x, -eagerness*direction.y ];
		camera.lookAt(new THREE.Vector3(0, 0, 0));
		renderer.render( scene, camera );
	}
	requestAnimationFrame( loop );
}

setup();
loop();
