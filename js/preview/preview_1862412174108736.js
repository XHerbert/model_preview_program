/**
 * @author:xuhongbo
 * @function:wanda F01 effiective
 */

import { WebUtils } from '../package/WebUtils.js'
import { light } from '../usr/light.js'
import { ModelHelper } from '../package/ModelHelper.js'

var app, viewer, modelHelper;
const SINGLE_FILE = 0;
var BimfaceLoaderConfig = new BimfaceSDKLoaderConfig();
var webUtils = new WebUtils();
webUtils.getViewtoken(1862412174108736, SINGLE_FILE).then((token) => {
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
        //CLOUD.EnumRendererType.IncrementRender = true;
        app.addView(BimfaceLoaderConfig.viewToken);
        ///viewer.addModel(viewMetaData);//该方法加入的模型不能渲染烘焙
        viewer.setBackgroundColor(new Glodon.Web.Graphics.Color(Math.floor(Math.random() * 256), Math.floor(Math.random() * 256), Math.floor(Math.random() * 256), 1), new Glodon.Web.Graphics.Color(Math.floor(Math.random() * 256), Math.floor(Math.random() * 256), Math.floor(Math.random() * 256), 0.5));
        viewer.setBorderLineEnabled(false);
        //雾化颜色
        //viewer.setBackgroundColor(new Glodon.Web.Graphics.Color(204, 224, 255, 1));
        window.viewer = viewer;
        webUtils.viewer = window.viewer;
        modelHelper = new ModelHelper(viewer);
        viewer.addEventListener(Glodon.Bimface.Viewer.Viewer3DEvent.ViewAdded, function () {
            // helper.createAixsHelper(viewer);
            let scene = modelHelper.getScene(), camera = modelHelper.getPerspectiveCamera(), renderer = modelHelper.getRender();
            window.myscene = scene;
            document.getElementById('open-button').style.display = 'block';
            viewer.getViewer().rendererManager.renderer.renderer.shadowMap.enabled = true;
            viewer.getViewer().rendererManager.renderer.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
            scene.children[0].castShadow = true;

            // 万达F01
            loadScene(scene, viewer);
            initModel(viewer);
        });
    }
};

function onSDKLoadFailed(error) {
    console.log("Failed to load SDK!");
};

function loadScene(scene, viewer) {

    //配置背景色
    viewer.setBackgroundColor(new Glodon.Web.Graphics.Color(17, 25, 48, 1));
    let target = {
        "name": "persp",
        "position": {
            "x": 59520.734802934116,
            "y": 123093.69817053257,
            "z": 34260.345659671184
        },
        "target": {
            "x": -224316.19336744788,
            "y": 315422.04662657925,
            "z": -248376.47357963238
        },
        "up": {
            "x": -0.5265832546798163,
            "y": 0.3568088802815823,
            "z": 0.7716200482381308
        },
        "fov": 45,
        "version": 1
    };
    let start = {
        "name": "persp",
        "position": {
            "x": -240057.2553095202,
            "y": -146317.55375275147,
            "z": 259138.32299000377
        },
        "target": {
            "x": 16481.999380017936,
            "y": 110222.64585687037,
            "z": 2599.9999023204928
        },
        "up": {
            "x": 0,
            "y": -0.0000036732373949049126,
            "z": 0.9999999999932535
        },
        "fov": 45,
        "version": 1
    };

    var uniform = {
        time: { value: 0.0 }
    }
    //获取着色器程序
    let vertexShader = document.getElementById('vertex').textContent;
    let fragmentShader = document.getElementById('fragment').textContent;
    //获取报警设备包围盒信息
    let max = { x: 48267.05078125, y: 145279.40625, z: 4566.999938964844 };
    let min = { x: 47267.050842285156, y: 143739.40625, z: 3833 };
    //偏移量
    let offset = 100, segment = 2.0;
    let width = (max.x - min.x + offset), height = (max.y - min.y + offset), depth = (max.z - min.z + offset);
    let targetPos = { x: (max.x + min.x + offset / segment) / segment, y: (max.y + min.y + offset / segment) / segment, z: (max.z + min.z + offset / segment) / segment };
    let boundingBoxGeometry = new THREE.BoxBufferGeometry(width, height, depth);
    let boundingBoxMaterial = new THREE.ShaderMaterial({
        vertexShader: vertexShader,
        fragmentShader: fragmentShader,
        transparent: true,
        uniforms: uniform
    });
    let boundingBoxMesh = new THREE.Mesh(boundingBoxGeometry, boundingBoxMaterial);
    boundingBoxMesh.position.set(targetPos.x, targetPos.y, targetPos.z);
    viewer.addExternalObject("boundingBox", boundingBoxMesh);

    // 创建标签容器
    var drawableConfig = new Glodon.Bimface.Plugins.Drawable.DrawableContainerConfig();
    drawableConfig.viewer = viewer;
    var drawableContainer = new Glodon.Bimface.Plugins.Drawable.DrawableContainer(drawableConfig);

    viewer.setCameraStatus(start, () => {
        setTimeout(() => {
            viewer.setCameraStatus(target, () => {
                // 添加设备标签
                var position = new Object();
                let max = { x: 48267.05078125, y: 145279.40625, z: 4566.999938964844 };
                let min = { x: 47267.050842285156, y: 143739.40625, z: 3833 };
                position = { x: (max.x + min.x) / 2, y: (max.y + min.y) / 2, z: max.z };

                modelHelper.createCustomTag(drawableContainer, position, '<div class="leadTips"><div style="width:49px;height:35px;"><img src="https://static.bimface.com/attach/24ce9654e88a4218908f46279e5c4b04_line.png" height="35" width="49"/></div><div  id="canvasDiv" class="tag">暖通空调 1#</div></div>');

                let areaPos1 = { x: 10849.856525750167, y: 140403.73229127374, z: 3.259261749377629e-8 };
                modelHelper.createCustomTag(drawableContainer, areaPos1, '<div class="leadTips"><div style="width:49px;height:35px;"><img src="https://static.bimface.com/attach/24ce9654e88a4218908f46279e5c4b04_line.png" height="35" width="49"/></div><div  id="canvasDiv" class="tag3">23.5℃</div></div>');

                let areaPos2 = { x: 35966.909079778336, y: 154820.3624507177, z: 3.5935210029869324e-8 };
                modelHelper.createCustomTag(drawableContainer, areaPos2, '<div class="leadTips"><div style="width:49px;height:35px;"><img src="https://static.bimface.com/attach/24ce9654e88a4218908f46279e5c4b04_line.png" height="35" width="49"/></div><div  id="canvasDiv" class="tag4">29.8℃</div></div>');

                let areaPos3 = { x: 11014.188939933792, y: 129270.36637729005, z: 3.000482423631823e-8 };
                modelHelper.createCustomTag(drawableContainer, areaPos3, '<div class="leadTips"><div style="width:49px;height:35px;"><img src="https://static.bimface.com/attach/24ce9654e88a4218908f46279e5c4b04_line.png" height="35" width="49"/></div><div  id="canvasDiv" class="tag">37.8℃</div></div>');
                viewer.recordCustomedHomeview(target);
                //启用阴影
                viewer.enableShadow(true);
            });
        }, 800);
    });



    // 配置聚光灯
    light.init(0xff0000);
    let spotLight = light.createSpotLight(0xffffff, 3, 10000, Math.PI / 2.5, 0.5, 2);
    spotLight.castShadow = true;
    spotLight.shadowDarkness = 1.0;
    spotLight.shadow.mapSize.width = 4096;
    spotLight.shadow.mapSize.height = 4096;
    spotLight.shadowCameraVisible = true;

    var targetObject = new THREE.Object3D();
    targetObject.position.set(24000.234344482422, 150799.96871948242, 0);
    viewer.addExternalObject("targetObject", targetObject);

    spotLight.position.set(24000.234344482422, 150799.96871948242, 18397);
    spotLight.target = targetObject;

    var spotLightHelper = new THREE.SpotLightHelper(spotLight, 0xce3ced);
    var helper = new THREE.DirectionalLightHelper(spotLight, 5);
    // viewer.addExternalObject("helper", helper);
    viewer.addExternalObject("spotLight", spotLight);

    //隐藏构件
    viewer.hideComponentsByObjectData([{ "levelName": "F2" }, { "levelName": "B1" }, { "levelName": "B2" }]);

    // 处理墙面
    viewer.overrideComponentsFrameColorByObjectData([{ "family": "基本墙" }], new Glodon.Web.Graphics.Color('#1E90FF', 0.7));
    viewer.overrideComponentsColorByObjectData([{ "family": "基本墙" }, { "family": "砼矩形柱" }, { "family": "砼圆形柱" }], new Glodon.Web.Graphics.Color('#6699FF', 0.65)); viewer.render();

    //楼板颜色
    viewer.overrideComponentsColorByObjectData([{ "family": "楼板" }], new Glodon.Web.Graphics.Color(9, 46, 88, 1));

    // 设备
    viewer.overrideComponentsColorById(["2187458"], new Glodon.Web.Graphics.Color(250, 33, 179, 1));

    // 设备关联设备
    viewer.overrideComponentsColorById(["1572573", "1572574", "1572576", "1572577", "1572578", "1572579", "1572580", "1572581", "1572582", "1572583", "1572584", "1572585", "1572586", "1572587", "1572588", "1572589", "1572590", "1572591", "1572592", "1572593", "1572594", "1572595", "1572596", "1572597", "1578246", "1578247", "1578254", "1578255", "1578256", "1578257", "1578258", "1578977", "1578978", "1578979", "1578980", "1578981", "1578982", "2026231"], new Glodon.Web.Graphics.Color(250, 227, 175, 1));

    // yellow
    viewer.overrideComponentsColorById(["2548998"], new Glodon.Web.Graphics.Color(209, 195, 96, 1));
    // pink
    viewer.overrideComponentsColorById(["2545707"], new Glodon.Web.Graphics.Color(237, 116, 121, 1));
    // green
    viewer.overrideComponentsColorById(["2548922"], new Glodon.Web.Graphics.Color(116, 199, 91, 1));

    viewer.overrideComponentsColorById(["2547739"], new Glodon.Web.Graphics.Color(78, 70, 171, 1));
    viewer.render();

    // 配置Data-GUI
    var myControls;
    myControls = new function () {
        this.spotPX = 24000.234344482422;
        this.spotPY = 150799.96871948242;
        this.spotPZ = 18397;
    };

    var setSpot = function () {
        viewer.getExternalComponentManager().setTransform("spotLight", { x: myControls.spotPX, y: myControls.spotPY, z: myControls.spotPZ });
        viewer.render();
    };

    var gui = new dat.GUI();
    var spotPosition = gui.addFolder("spotPosition");
    spotPosition.add(myControls, 'spotPX', -1000, 24000).onChange(setSpot);
    spotPosition.add(myControls, 'spotPY', -1000, 150799).onChange(setSpot);
    spotPosition.add(myControls, 'spotPZ', -1000, 20000).onChange(setSpot);

    let idx = 1;
    scene.traverseVisible(function (child) {
        if (child instanceof CLOUD.MeshEx || child instanceof CLOUD.Object3DEx || child instanceof THREE.Mesh) {
            child.castShadow = true;
            child.name = idx;
            child.receiveShadow = true;
            idx++;
        }
    }, true);

    function animation() {
        uniform.time.value += 0.25;
        requestAnimationFrame(animation);
        viewer.render();
    }
    animation();
}

function initModel(viewer) {
    viewer.hideViewHouse();
    document.getElementsByClassName('dg ac')[0].style.display = "none";
    document.getElementsByClassName('bf-toolbar bf-toolbar-bottom')[0].style.display = 'none';
    document.getElementsByClassName('gld-bf-tree')[0].style.display = 'none';
}