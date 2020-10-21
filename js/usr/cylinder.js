/**
 * @author xuhbd
 * @function cylinder animation
 */

import { ModelShaderChunk } from '../../shaders/common/ModelShaderChunk.js'
import { ModelHelper } from '../package/ModelHelper.js'
import { MathLibrary } from '../package/MathLibrary.js'

var scene = null;
var camera = null;
var mesh = null;
var controls = null;
var renderer = null;
var axesHelper = null;
var width = window.innerWidth;
var height = window.innerHeight;
var modelHelper = new ModelHelper();
var math = new MathLibrary();


let initScene = () => {
    axesHelper = new THREE.AxisHelper(100);
    scene = new THREE.Scene();
    //scene.add(axesHelper);
    window["scene"] = scene;
};

let initCamera = () => {
    camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 1000);
    camera.position.set(0, 100, 0);
    camera.lookAt(0, 0, 0);
    window["camera"] = camera;
};

let initRenderer = () => {
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0xD1BEBE);
    document.body.appendChild(renderer.domElement);
    window["renderer"] = renderer;
};


let initLight = () => {
    var light = new THREE.DirectionalLight(0x695DEE);
    light.position.set(100, 0, 10);
    scene.add(light);

};

let uniform = {
    u_height: 50.0,
    u_time: 0.0,
    u_color: {
        value: math.normalizeColor(new THREE.Vector3(30, 144, 255)) //颜色归一化
    }
}

let initGeometry = () => {
    var cylinderMaterial = new THREE.MeshBasicMaterial({ color: 0xEE2F5F, transparent: true, side: THREE.DoubleSide, wireframe: false, depthTest: false });
    var cylinderShaderMaterial = new THREE.ShaderMaterial({
        vertexShader: ModelShaderChunk.gradient_box_vertex_shader,
        fragmentShader: ModelShaderChunk.gradient_box_fragment_shader,
        uniforms: uniform,
        side: THREE.DoubleSide,
        transparent: true,
        wireframe: false,
        depthTest: false
    });
    window["mt"] = cylinderShaderMaterial;
    //参数4与5可以控制Mesh的形状，3代表三角形，4代表矩形，值越大越接近圆形
    var cylinderGeometry = new THREE.CylinderGeometry(10, 10, 50, 100, 100, true, 0, Math.PI * 2.0);
    mesh = new THREE.Mesh(cylinderGeometry, cylinderShaderMaterial);
    mesh.position.y = 25;
    mesh.name = "cylinder";
    scene.add(mesh);
};


let initPlaneGeometry = () => {
    scene.add(modelHelper.createGridHelper(400, 100, 0xff0000, 0xffffff));
}

let initControl = () => {
    controls = modelHelper.buildOrbitControls(camera, renderer);
};

let scale = 1.000;
let render = () => {
    //mesh.scale.x += scale;
    //mesh.scale.z += scale;
    uniform.u_time += 0.01;
    scale += 0.01;
    mesh.scale.set(scale, 1, scale);
    mesh.material.opacity -= 0.01;
    if (mesh.material.opacity <= 0) {
        //如果Mesh消失，还原Mesh
        scale = 1.0;
        mesh.scale.set(scale, scale, scale);
        mesh.material.opacity = 1.0;
    }
    controls.update();
    renderer.render(scene, camera);
    requestAnimationFrame(render);
};


let init = () => {
    window.onresize = onWindowResize;

    initScene();
    initCamera();
    initRenderer();
    initLight();
    initGeometry();
    initPlaneGeometry();
    initControl();
    render();
};


let onWindowResize = () => {
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
    renderer.render(scene, camera);
}

init();
