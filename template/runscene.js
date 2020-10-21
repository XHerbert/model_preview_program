/**
 * @author xuhbd
 * @function template of run a scene
 */

var scene = null;
var camera = null;
var mesh = null;
var controls = null;
var renderer = null;
var axesHelper = null;
var width = window.innerWidth;
var height = window.innerHeight;


initScene = () => {
    axesHelper = new THREE.AxisHelper(100);
    scene = new THREE.Scene();
    scene.add(axesHelper);
};

initCamera = () => {
    camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 1000);
    camera.position.set(0, 0, 100);
    camera.lookAt(0, 0, 0);
};

initRenderer = () => {
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0xD1BEBE);
    document.body.appendChild(renderer.domElement);
};


initLight = () => {
    var light = new THREE.DirectionalLight(0x695DEE);
    light.position.set(100, 0, 10);
    scene.add(light);

};

initGeometry = () => {
    var planeMaterial;

    //var material = new THREE.MeshBasicMaterial({ color: 0x00fff0, opacity: 0.8, wireframe: false });

    // load方法是异步的，按照同步的写法，材质会变成黑色
    // 直接移动Mesh

    var textureLoader = new THREE.TextureLoader();
    var texture = textureLoader.load('../images/icon_arrow_right.png', () => { });
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.x = 10;
    texture.mapping = THREE.EquirectangularReflectionMapping;
    var tubeMaterial = new THREE.MeshBasicMaterial({
        map: texture,
        transparent: true,
        wireframe: true,
        //color: 0xff0000
    });

    var planeGeometry = new THREE.PlaneGeometry(100, 5, 100, 20);
    mesh = new THREE.Mesh(planeGeometry, tubeMaterial);
    //scene.add(mesh);
};

var rollTexture;
initPlaneGeometry = () => {

    // 依靠移动材质的offset属性实现动画
    var rollMat = new THREE.MeshBasicMaterial();
    rollTexture = new THREE.TextureLoader().load('../images/icon_arrow_right_pow.png', function (map) {
        rollMat.map = map;
        rollMat.wireframe = false;
        rollMat.needsUpdate = true;
        rollMat.transparent = true;
        rollMat.side = THREE.DoubleSide;
    });
    rollTexture.wrapS = THREE.RepeatWrapping;
    rollTexture.wrapT = THREE.RepeatWrapping;
    rollTexture.repeat.x = 10;

    var planeGeometry2 = new THREE.PlaneGeometry(100, 5, 100, 20);
    var planeGeometry3 = new THREE.PlaneGeometry(100, 5, 100, 20);

    var obj2 = new THREE.Mesh(planeGeometry2, rollMat);
    obj2.position.set(0, 0, 0);
    obj2.translateX(50);

    var obj3 = new THREE.Mesh(planeGeometry3, rollMat);
    obj3.position.set(50, 50, 0);
    obj3.rotation.z = Math.PI / 2;

    scene.add(obj2);
    scene.add(obj3);
}

initControl = () => {
    controls = new THREE.OrbitControls(camera, renderer.domElement);
    // 使用阻尼,指定是否有惯性
    controls.enableDamping = true;
    // 动态阻尼系数 就是鼠标拖拽旋转灵敏度，阻尼越小越灵敏
    controls.dampingFactor = 0.05;
    // 是否可以缩放
    controls.enableZoom = true;
    //是否自动旋转
    controls.autoRotate = false;
    //设置相机距离原点的最近距离
    controls.minDistance = 10;
    //设置相机距离原点的最远距离
    controls.maxDistance = 600;
    //是否开启右键拖拽
    controls.enablePan = true;
};
render = () => {

    mesh.position.x += 0.01;
    rollTexture.offset.x -= 0.01;
    controls.update();
    renderer.render(scene, camera);
    requestAnimationFrame(render);
    //window.requestAnimationFrame(render.bind(this));
};
init = () => {
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


onWindowResize = () => {
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
    renderer.render(scene, camera);
}

init();
