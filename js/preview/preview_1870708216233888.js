/**
 * @author:xuhongbo
 * @description:wanda 
 */
import { WebUtils } from '../package/WebUtils.js'
import { ModelHelper } from '../package/ModelHelper.js'
import { light } from '../usr/light.js'
import { unreal } from '../../external/bloom/bloom.js'



var app, viewer, modelHelper;
const INTEGRATION_FILE = 1;
var BimfaceLoaderConfig = new BimfaceSDKLoaderConfig();
var webUtils = new WebUtils();
webUtils.getViewtoken(1870708216233888, INTEGRATION_FILE).then((token) => {
    BimfaceLoaderConfig.viewToken = token;
    BimfaceSDKLoader.load(BimfaceLoaderConfig, onSDKLoadSucceeded, onSDKLoadFailed);
});

function onSDKLoadSucceeded(viewMetaData) {
    if (viewMetaData.viewType == "3DView") {
        var view = document.getElementById('view');
        var config = new Glodon.Bimface.Application.WebApplication3DConfig();
        config.domElement = view;
        var eventManager = Glodon.Bimface.Application.WebApplication3DEvent;
        app = new Glodon.Bimface.Application.WebApplication3D(config);
        viewer = app.getViewer();
        viewer.setCameraAnimation(true);
        app.addView(BimfaceLoaderConfig.viewToken);

        viewer.setBackgroundColor(new Glodon.Web.Graphics.Color(Math.floor(Math.random() * 256), Math.floor(Math.random() * 256), Math.floor(Math.random() * 256), 1), new Glodon.Web.Graphics.Color(Math.floor(Math.random() * 256), Math.floor(Math.random() * 256), Math.floor(Math.random() * 256), 0.5));
        viewer.setBorderLineEnabled(false);
        viewer.setBackgroundColor(new Glodon.Web.Graphics.Color(7, 1, 18, 1));
        viewer.hideViewHouse();
        window.viewer = viewer;

        webUtils.viewer = window.viewer;
        modelHelper = new ModelHelper(viewer);
        viewer.addEventListener(Glodon.Bimface.Viewer.Viewer3DEvent.ViewAdded, function () {
            modelHelper.createAixsHelper(viewer);
            let scene = modelHelper.getScene(), camera = modelHelper.getPerspectiveCamera(), renderer = modelHelper.getRender();
            camera.layers.enable(1);
            window.myscene = scene;
            document.getElementById('open-button').style.display = 'block';
            viewer.getViewer().rendererManager.renderer.renderer.shadowMap.enabled = true;
            viewer.getViewer().rendererManager.renderer.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

            addComponents();
            overrideComponents();
            setupPointsCloud();
            setupCameraAnimation();
            setupSpotLight();
            recordComponents();
            bloomEffective();
            viewer.render();

        });
    }
};

//通过GUI控制灯光参数
var gui = new dat.GUI();
var colors = gui.addFolder("ColorParameters");
var whiteHousePosition = gui.addFolder("whiteHousePosition");
// 配置Data-GUI
var myControls;
myControls = new function () {
    this.distance = 1500;
    this.wallColor = [48, 46, 177]
    this.backgroundColor = [28, 45, 55];
    this.floorColor = [9, 46, 81];

    this.spotPX = -5111.036635551991;
    this.spotPY = -9890.132060013117;
    this.spotPZ = 24319.110676428667;
    this.distance = 1500;

    this.whiteHouseX = -50000;
    this.whiteHouseY = 10000;
};


function addComponents() {

    // 创建承载底板
    let planeGeometry = new THREE.PlaneGeometry(800000, 800000);
    let planeMaterial = new THREE.MeshLambertMaterial({ color: 0x605F5E, transparent: true, opacity: 1.0, side: THREE.DoubleSide });
    let planeMesh = new THREE.Mesh(planeGeometry, planeMaterial);
    // 如果接收阴影效果，底板需要单独处理
    planeMesh.receiveShadow = true;
    planeMesh.position.set(200000, 200000, -400);
    planeMesh.receiveShadow = true;

    // 创建平面网格辅助
    let gridHelper = new THREE.GridHelper(400000, 40);
    gridHelper.rotation.x = Math.PI / 2;
    gridHelper.position.set(100000, 100000, -4900);

    // <!-- 开始创建高光边缘线 -->

    let linesGroup = new THREE.Group();
    //画线，发光底座

    let points = [];//存储
    points.push(new THREE.Vector3(277.4425289822727, 115770.0902268365, -164));
    points.push(new THREE.Vector3(-135.077686350571, 8214.240517057453, -164));

    points.push(new THREE.Vector3(53475.93716436427, 8214.240517035996, -164));
    points.push(new THREE.Vector3(54005.079567780645, -1960.000020754663, 43));

    points.push(new THREE.Vector3(215564.33701531516, -2253.978428404575, -164));
    points.push(new THREE.Vector3(215574.27598882426, 115677.52683345789, -164));
    points.push(new THREE.Vector3(277.4425289822727, 115770.0902268365, -164));

    let onlyLine = [];
    onlyLine.push(new THREE.Vector3(-2552.498144020344, 6941.893546154866, 21872.974129265043));
    onlyLine.push(new THREE.Vector3(-2649.9998391014765, 6753.372131326079, 4431));



    for (let l = 0, len = points.length; l < len; l++) {
        let geometry = new THREE.Geometry();
        geometry.vertices.push(points[l]);
        if (l + 1 >= len) { break };
        geometry.vertices.push(points[l + 1]);
        var material = new THREE.LineBasicMaterial({ color: 0xffffff });
        var line = new THREE.Line(geometry, material);
        line.layers.set(1);
        line.layers.enable(1);
        linesGroup.add(line);
    }



    // let geometry2 = new THREE.Geometry();
    // geometry2.vertices = onlyLine;

    // let material2 = new THREE.LineBasicMaterial({ color: 0xffffff });
    // let onlyline = new THREE.Line(geometry2, material2);
    // line.layers.set(1);
    // line.layers.enable(1);
    // linesGroup.add(line);
    //只修改底板的透明度
    viewer.overrideComponentsColorById(["1870705090226272.5067484"], new Glodon.Web.Graphics.Color("#0000FF", 0.75));

    var cylindergeometry = new THREE.CylinderGeometry(50, 50, 17440, 32);
    var cylindermaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
    var cylinder = new THREE.Mesh(cylindergeometry, cylindermaterial);
    cylinder.rotation.x = Math.PI / 2;
    window["cylinder"] = cylinder;
    cylinder.position.set(-2649.9998391014765, 6753.372131326079, 4431 + 8725);
    viewer.addExternalObject("onlyline", cylinder);

    cylindergeometry = new THREE.CylinderGeometry(50, 50, 17440, 32);
    viewer.addExternalObject("box", linesGroup);
};

// 重写构件颜色
function overrideComponents() {
    viewer.overrideComponentsColorByObjectData([{ "categoryId": "-2000011" }, { "categoryId": "-2000170" }], new Glodon.Web.Graphics.Color(25, 25, 112, 1));

    let changeWallColor = () => {
        viewer.overrideComponentsColorByObjectData([{ "categoryId": "-2000011" }, { "categoryId": "-2000170" }], new Glodon.Web.Graphics.Color(myControls.wallColor[0], myControls.wallColor[1], myControls.wallColor[2], 1));
        //viewer.render();
    };

    let changeBgColor = () => {
        viewer.setBackgroundColor(new Glodon.Web.Graphics.Color(myControls.backgroundColor[0], myControls.backgroundColor[1], myControls.backgroundColor[2], 1));
        //viewer.render();
    };
    colors.addColor(myControls, 'backgroundColor').onChange(changeBgColor);
    colors.addColor(myControls, 'wallColor').onChange(changeWallColor);
};

// 粒子系统
function setupPointsCloud() {
    let geometry = new THREE.BufferGeometry();
    let positions = [];
    let colors = [];
    let pointColor = new THREE.Color();
    let n = 1920, n2 = n / 4;

    var texture = new THREE.TextureLoader().load("../../images/star.png");
    var pointsMaterial = new THREE.PointsMaterial(
        {
            size: 3,
            sizeAttenuation: true,
            map: texture,
            vertexColors: THREE.VertexColors,
            transparent: true,
            opacity: 0.7,
            depthWrite: false,
            blending: THREE.CustomBlending,
            blendEquation: THREE.AddEquation,
            blendSrc: THREE.SrcAlphaFactor,
            blendDst: THREE.OneMinusSrcAlphaFactor
        });

    for (let j = 0; j < 20500; j++) {
        // 点
        let x = Math.random() * n - n2;
        let y = Math.random() * n - n2;
        let z = Math.random() * n - n2;

        positions.push(x, y, z);

        // 颜色
        // let vx = (x / n) + 0.3;
        // let vy = (y / n) + 0.3;
        // let vz = (z / n) + 0.3;
        let vx = 1.0;
        let vy = 1.0;
        let vz = 1.0;

        pointColor.setRGB(vx, vy, vz);
        colors.push(pointColor.r, pointColor.g, pointColor.b);

    }
    geometry.addAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    geometry.addAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
    let points = new THREE.Points(geometry, pointsMaterial);
    modelHelper.getScene().add(points);
    // viewer.addExternalObject("points", points);
};

// 白膜
function setupWhiteHouses() {
    let ratio = 2
    let height = 18000;
    let boxGeometry = new THREE.BoxBufferGeometry(5000 * ratio, 5000 * ratio, height * ratio);
    let boxMaterial = new THREE.MeshLambertMaterial({ color: 0x1B1946, transparent: true, opacity: 0.05 });
    let boxMesh = new THREE.Mesh(boxGeometry, boxMaterial);

    let edges = new THREE.EdgesHelper(boxMesh, 0x2449A6);
    let unitWhiteHouse = new THREE.Group();
    unitWhiteHouse.add(boxMesh);
    unitWhiteHouse.add(edges);

    let interval = 150;
    let cloneMesh = null;
    let index = 0;


    let changeWhitehouse = () => {
        viewer.getExternalComponentManager().setTransform('index0', { x: myControls.whiteHouseX, y: myControls.whiteHouseY, z: (height * ratio + 10) });
        viewer.render();
    }
    whiteHousePosition.add(myControls, 'whiteHouseX', -10000, 20000).onChange(changeWhitehouse);
    whiteHousePosition.add(myControls, 'whiteHouseY', 0, 20000).onChange(changeWhitehouse);

    let whiteHouseGroup = new THREE.Group();
    //TODO:划定范围，随机宽高度
    for (let g = 0; g < 10; g++) {
        cloneMesh = unitWhiteHouse.clone();
        cloneMesh.position.set(Math.random() * 1000000, Math.random() * 1000000, (height * ratio) / 2 - 5000);
        whiteHouseGroup.add(cloneMesh);
        index++;
    }
    viewer.addExternalObject("whiteHouseGroup", whiteHouseGroup);
    viewer.render();

    //用于动态递增效果
    // let id = setInterval(() => {
    //     cloneMesh = unitWhiteHouse.clone();
    //     cloneMesh.position.set(myControls.whiteHouseX, myControls.whiteHouseY, (height * ratio) / 2 * (index + 1) - 5000);
    //     viewer.addExternalObject("index" + index, cloneMesh);
    //     viewer.render();
    //     index++;
    //     if (index >= 1) {
    //         clearInterval(id);
    //     }
    // }, interval);
};

// 相机位
function setupCameraAnimation() {
    let start = {
        "name": "persp",
        "position": {
            "x": 97453.0197917097,
            "y": -338623.23033853434,
            "z": 204649.9843120962
        },
        "target": {
            "x": 97453.00276979106,
            "y": 130620.81137323385,
            "z": 19063.456096175596
        },
        "up": {
            "x": -1.3341470586563286e-8,
            "y": 0.36778132687924164,
            "z": 0.929912305327198
        },
        "fov": 45,
        "version": 1
    };
    let target = {
        "name": "persp",
        "position": {
            "x": 105740.8951629523,
            "y": -161832.34077849006,
            "z": 83221.35397935935
        },
        "target": {
            "x": 113725.59821097896,
            "y": 326115.3836533049,
            "z": -45135.996213566315
        },
        "up": {
            "x": 0.004161958773317822,
            "y": 0.25433481663272894,
            "z": 0.9671072738572312
        },
        "fov": 45,
        "version": 1
    };
    let target2 = {
        "name": "persp",
        "position": {
            "x": -23538.54952733095,
            "y": -32727.4275582069,
            "z": 17847.770292227357
        },
        "target": {
            "x": 399741.6254347889,
            "y": 235122.26658792433,
            "z": -43166.988790040574
        },
        "up": {
            "x": 0.10217732391862963,
            "y": 0.06465362729411368,
            "z": 0.992662935217459
        },
        "fov": 45,
        "version": 1
    };
    let target3 = {
        "name": "persp",
        "position": {
            "x": -39187.73938283122,
            "y": -42857.860852787766,
            "z": 23130.977432096384
        },
        "target": {
            "x": 320106.3274588263,
            "y": 308189.9833147363,
            "z": -24885.374142182627
        },
        "up": {
            "x": 0.06806321359593363,
            "y": 0.06649739260386797,
            "z": 0.9954624532004616
        },
        "fov": 45,
        "version": 1
    };

    viewer.setCameraStatus(start, () => {
        setTimeout(() => {

        }, viewer.setCameraStatus(target3, () => {
            //setupWhiteHouses();
            viewer.recordCustomedHomeview(target3);
            viewer.enableShadow(true);
        }), 1000);
    })
};

// 加入光源
function setupSpotLight() {
    let spotLightGroup = new THREE.Group();
    myscene.children[0].traverseVisible(function (obj) {
        if (obj instanceof THREE.Mesh && obj.visible == true) {
            //如果是路灯本身，则不投射阴影或者将灯源向下调整
            obj.castShadow = true;
            obj.receiveShadow = true;
        }
    });
    //配置曝光
    viewer.setExposureShift(-0.15);
    //左侧第一个路灯
    let spotLight = light.createSpotLight(0x0000ff, 5.5, 1000, Math.PI / 3, 0.45, 0.54);
    // let spotHelper = new THREE.SpotLightHelper(spotLight);
    spotLight.shadowDarkness = 2.0;
    // 根据报警设备计算出聚光灯位置
    let lightPos = { x: -5111.036635551991, y: -9890.132060013117, z: 78528.110676428667 };
    spotLight.position.set(lightPos.x, lightPos.y, lightPos.z);
    let targetObject = new THREE.Object3D();
    // targetObject.position.set(-13721.8359375, 20874.232421875, 0);
    targetObject.position.set(-4966.626934519282, -10069.579342800722, -2799.9998780278406);
    spotLightGroup.add(targetObject);
    spotLight.target = targetObject;
    spotLight.castShadow = true;
    spotLightGroup.add(spotLight);

    //右侧第一个路灯
    let cloneSpotLight = spotLight.clone();
    cloneSpotLight.position.x = 227016.4710214996;
    cloneSpotLight.position.y = -19504.67488260478;
    let cloneTargetObject = targetObject.clone();
    cloneTargetObject.position.set(227217.87280367102, -19338.508854654265, -3759.999682772739);
    spotLightGroup.add(cloneTargetObject);
    cloneSpotLight.castShadow = true;
    cloneSpotLight.target = cloneTargetObject;
    spotLightGroup.add(cloneSpotLight);

    //左侧第二个路灯
    cloneSpotLight = spotLight.clone();
    cloneSpotLight.position.x = 70384.08839066587;
    cloneSpotLight.position.y = -22381.867152165396;
    cloneTargetObject = targetObject.clone();
    cloneTargetObject.position.set(70439.19107403923, - 22364.808790433657, -3089.9999368957715);
    spotLightGroup.add(cloneTargetObject);
    cloneSpotLight.castShadow = true;
    cloneSpotLight.intensity = 15.5;
    cloneSpotLight.target = cloneTargetObject;
    spotLightGroup.add(cloneSpotLight);

    //统一加入场景
    viewer.addExternalObject("spotLight", spotLightGroup);
    // viewer.addExternalObject("spotHelper", spotHelper);



    var setPosition = function () {
        viewer.getExternalComponentManager().setTransform("spotLight", { x: myControls.spotPX, y: myControls.spotPY, z: myControls.spotPZ });
        viewer.render();
    };

    var setParameters = function () {
        spotLight.distance = myControls.distance;
        viewer.render();
    };

    var spotPosition = gui.addFolder("SpotLightPosition");
    spotPosition.add(myControls, 'spotPX', 0, 80000).onChange(setPosition);
    spotPosition.add(myControls, 'spotPY', 0, 80000).onChange(setPosition);
    spotPosition.add(myControls, 'spotPZ', 0, 80000).onChange(setPosition);

    var spotParameters = gui.addFolder("SpotLightParameters");
    spotParameters.add(myControls, 'distance', 0, 50000).onChange(setParameters);
}

// 记录Mesh与构件的对应关系
function recordComponents() {
    let collect = [];
    myscene.children[0].traverseVisible((mesh) => {
        if (mesh instanceof THREE.Mesh && mesh._indicesGroup) {
            let _key = null;
            for (let m in mesh._indicesGroup) {
                _key = m;
            }
            mesh.material.wireframe = true;
            window[_key] = mesh;
            collect.push(window[_key]);
            // console.log(mesh.layers.mask);
        } else {
            //console.log(mesh);
            if (mesh.material) {
                if (mesh.material.length) {
                    // mesh.material[0].wireframe = true;
                } else {
                    // mesh.material.wireframe = true;
                }
            }
            // mesh.visible = false;
            //console.log(mesh.layers.mask);
        }
    });
    //console.table(collect);
}

// 从顶点创建几何体
function createBufferGeometryFromPoints() {
    $.get('../../shaders/1870708216233888/points.json', function (points) {
        let vertices = new Float32Array(points);
        var verticesPosition = new THREE.BufferAttribute(vertices, 3);
        var geometry = new THREE.BufferGeometry();
        geometry.addAttribute('position', verticesPosition);

        var material = new THREE.ShaderMaterial({

            //加载顶点着色器程序
            vertexShader: document.getElementById('vertexshader').textContent,

            //加载片元着色器程序
            fragmentShader: document.getElementById('fragmentshader').textContent,

        });//着色器材质对象

        // let material = new THREE.MeshBasicMaterial({
        //     color: 0xffffff,
        //     wireframe: true
        // });
        var mesh = new THREE.Mesh(geometry, material);//模型对象
        mesh.layers.set(3);//2的3次方
        // mesh.position.set(0, 0, 30000);
        // myscene.add(mesh);
        // viewer.addExternalObject("ccd", mesh);
        // viewer.render();
    });
}

// 创建bloom泛光
function bloomEffective() {
    webUtils.loadScript('../../external/bloom/EffectComposer.js', function () {
        webUtils.loadScript('../../external/bloom/RenderPass.js', function () {
            webUtils.loadScript('../../external/bloom/UnrealBloomPass.js', function () {
                webUtils.loadScript('../../external/bloom/LuminosityHighPassShader.js', function () {
                    webUtils.loadScript('../../node_modules/_three@0.85.2@three/examples/js/postprocessing/SSAARenderPass.js', function () {
                        let scene = webUtils.getScene(), camera = webUtils.getPerspectiveCamera(), renderer = webUtils.getRender();
                        unreal.initRenderBloom(scene, camera, renderer);
                        unreal.composerRenderer();
                    })
                })
            })
        })
    });
}

function onSDKLoadFailed(error) {
    console.log("Failed to load SDK!");
};