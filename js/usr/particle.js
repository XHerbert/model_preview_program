import { SpriteMaterial } from '../../node_modules/_three@0.115.0@three/src/materials/SpriteMaterial.js'

function init() {

    var scene = null, camera = null, renderer = null, control = null;

    scene = new THREE.Scene();
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setClearColor(0x111111);
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(50, 50, 50);
    camera.lookAt(new THREE.Vector3(0, 0, 0));
    scene.add(camera);


    var geo = new THREE.Geometry();

    //THREE.ParticleBasicMaterial
    var material = new THREE.PointsMaterial({
        size: 5, transparent: true, opacity: 1.0,
        color: 0xff0000, vertexColor: true
    });

    var range = 500;
    for (let i = 0; i < 50; i++) {
        var particle = new THREE.Vector3(
            Math.random() * range - range / 2,
            Math.random() * range - range / 2,
            Math.random() * range - range / 2
        );
        geo.vertices.push(particle);
        var color = new THREE.Color(0x00ff00);
        color.setHSL(color.getHSL().h, color.getHSL().s, Math.random() * color.getHSL().l);
        geo.colors.push(color);

    }

    //THREE.ParticleSystem
    // var system = new THREE.Points(geo, material);
    // scene.add(system);


    let geometry = new THREE.BufferGeometry();
    let positions = [];
    let colors = [];
    let pointColor = new THREE.Color();
    let n = 1920, n2 = n / 4;


    var texture = new THREE.TextureLoader().load("../../images/star.png");
    var pointsMaterial = new THREE.PointsMaterial({ size: 5, sizeAttenuation: true, map: texture, vertexColors: THREE.VertexColors, transparent: true, opacity: 0.7 });



    for (let j = 0; j < 5500; j++) {
        // 点
        let x = Math.random() * n - n2;
        let y = Math.random() * n - n2;
        let z = Math.random() * n - n2;

        positions.push(x, y, z);

        // 颜色
        let vx = (x / n) + 0.3;
        let vy = (y / n) + 0.3;
        let vz = (z / n) + 0.3;
        // let vx = 1.0;
        // let vy = 1.0;
        // let vz = 1.0;


        pointColor.setRGB(vx, vy, vz);

        colors.push(pointColor.r, pointColor.g, pointColor.b);

    }
    geometry.addAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    geometry.addAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
    let points = new THREE.Points(geometry, pointsMaterial);
    scene.add(points);


    control = new THREE.OrbitControls(camera, renderer.domElement);
    control.enableDamping = true;
    control.dampingFactor = 0.25;
    control.enableZoom = true;
    control.autoRotate = false;
    control.enablePan = true;

    let animation = function () {
        control.update();
        renderer.render(scene, camera);
        requestAnimationFrame(animation);
    }
    animation();
}

function draw() {
    var canvas = document.createElement('canvas');
    canvas.width = 600;
    canvas.height = 600;

    var cxt = canvas.getContext("2d");

    cxt.save();
    cxt.beginPath();
    cxt.strokeStyle = "red";
    cxt.lineWidth = "1";
    cxt.closePath();
    cxt.beginPath();
    for (var i = 0; i < 5; i++) {
        cxt.lineTo(100 * Math.cos((18 + i * 72) * Math.PI / 180), -100 * Math.sin((18 + i * 72) * Math.PI / 180));
        cxt.lineTo(50 * Math.cos((54 + i * 72) * Math.PI / 180), -50 * Math.sin((54 + i * 72) * Math.PI / 180));
    }
    cxt.fillStyle = "white";

    var texture = new THREE.CanvasTexture(canvas);
    texture.needsUpdate = true;
    return texture;

}

function particleRender(context) {
    context.beginPath();
    context.arc(0, 0, 1, 0, 2 * Math.PI, true);
    context.fill();
}

init();