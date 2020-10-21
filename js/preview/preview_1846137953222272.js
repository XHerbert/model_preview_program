
import { WebUtils } from '../package/WebUtils.js'
import { ModelHelper } from '../package/ModelHelper.js'
import { light } from '../usr/light.js'

var app, viewer;
const INTEGRATION_FILE = 1;
var BimfaceLoaderConfig = new BimfaceSDKLoaderConfig();
var webUtils = new WebUtils();

webUtils.getViewtoken(1846137953222272, INTEGRATION_FILE).then((token) => {
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
        ///viewer.addModel(viewMetaData);//该方法加入的模型不能渲染烘焙

        viewer.setBackgroundColor(new Glodon.Web.Graphics.Color(Math.floor(Math.random() * 256), Math.floor(Math.random() * 256), Math.floor(Math.random() * 256), 1), new Glodon.Web.Graphics.Color(Math.floor(Math.random() * 256), Math.floor(Math.random() * 256), Math.floor(Math.random() * 256), 0.5));
        viewer.setBorderLineEnabled(false);

        window.viewer = viewer;
        webUtils.viewer = window.viewer;
        var modelHelper = new ModelHelper(viewer);
        viewer.addEventListener(Glodon.Bimface.Viewer.Viewer3DEvent.ViewAdded, function () {
            modelHelper.createAixsHelper(viewer);
            let scene = modelHelper.getScene(), camera = modelHelper.getPerspectiveCamera(), renderer = modelHelper.getRender();
            window.myscene = scene;
            document.getElementById('open-button').style.display = 'block';
            viewer.getViewer().rendererManager.renderer.renderer.shadowMap.enabled = true;
            viewer.getViewer().rendererManager.renderer.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
            filterComponents();
            setupCameraAnimation();
            setupSpotLight();
            viewer.enableShadow(true);
        });
    }
};


function filterComponents() {
    // 筛选条件【清理模型，在原基础上不变】
    viewer.showExclusiveComponentsByObjectData([{ "specialty": "暖通空调" }, { "specialty": "建筑" }]);
    viewer.hideAllComponents();
    viewer.showComponentsByObjectData([{ 'levelName': "F01", "specialty": "暖通空调" }, { 'levelName': "F01", "specialty": "建筑" },
    { 'levelName': "F01", "specialty": "建筑", "family": "基础底板" }, { 'levelName': "F01", "specialty": "建筑", "family": "矩形竖挺" }]);
    // viewer.transparentComponentsByObjectData([{ "levelName": "F01", "specialty": "建筑" }]);
    // viewer.opaqueComponentsByObjectData([{ "levelName": "F01", "specialty": "建筑", "family": "基本墙" }]);
    // viewer.opaqueComponentsByObjectData([{ "levelName": "F01", "specialty": "建筑", "family": "幕墙" }]);
    // 如果模型干净，则不必操作该步骤
    viewer.hideComponentsByObjectData([{ "levelName": "F01", "specialty": "建筑", "family": "HW-矩形梁" },
    { "levelName": "F01", "specialty": "建筑", "family": "复合天花板" }, { "levelName": "F01", "familyType": "楼板15" },
    { "levelName": "F01", "categoryId": "-2003400" }, { "familyType": "1f地毯68x44" }]);
    // 建筑结构相关构件统一处理
    viewer.overrideComponentsColorByObjectData([{ "levelName": "F01", "specialty": "建筑" }], new Glodon.Web.Graphics.Color('#6699FF', 0.65));

    // 如果接收阴影效果，底板需要单独处理
    viewer.overrideComponentsColorById(["1846135581550656.230629"], new Glodon.Web.Graphics.Color(9, 46, 88, 1));
    viewer.render();
};


function setupCameraAnimation() {
    let start = {
        "name": "persp",
        "position": {
            "x": -171305.05047805124,
            "y": -74663.7254624619,
            "z": 160033.52188237896
        },
        "target": {
            "x": 1242872.46645363,
            "y": 1117246.7919195802,
            "z": -1880304.9256063902
        },
        "up": {
            "x": 0.566532221489913,
            "y": 0.4774846084316825,
            "z": 0.6716023307914787
        },
        "fov": 45,
        "version": 1
    };
    let target = {
        "name": "persp",
        "position": {
            "x": 2082.8627501454434,
            "y": -9954.26472104519,
            "z": 42652.375062541185
        },
        "target": {
            "x": -1629268.9141900064,
            "y": 889679.6387211418,
            "z": -1985371.3974950057
        },
        "up": {
            "x": -0.6448833272817304,
            "y": 0.35562518527060727,
            "z": 0.6765029355407786
        },
        "fov": 45,
        "version": 1
    };
    viewer.setCameraStatus(start, () => {
        setTimeout(() => {

        }, viewer.setCameraStatus(target, () => {

        }), 1000);
    })
};


function setupSpotLight() {

    myscene.children[0].traverseVisible(function (obj) {
        if (obj instanceof THREE.Mesh && obj.visible == true) {
            obj.castShadow = true;
            obj.receiveShadow = true;
        }
    });

    let spotLight = light.createSpotLight(0xffffff, 2.5, 10000, Math.PI / 3, 0.65, 0.54);
    let spotHelper = new THREE.SpotLightHelper(spotLight);
    //TODO:灯光位置需要根据报警设备进行计算


    // 根据报警设备计算出聚光灯位置
    let base = 2000;
    let alarmPos = { x: -13309.474801123268, y: 22771.806640624985, z: 3009.999755859375 };
    // spotLight.position.set(alarmPos.x + base * 0, alarmPos.y + base * 0.5, alarmPos.z + base * 2);
    spotLight.position.set(0, 0, 45000.98787689209);
    let targetObject = new THREE.Object3D();
    // targetObject.position.set(-13721.8359375, 20874.232421875, 0);
    targetObject.position.set(alarmPos.x, alarmPos.y, alarmPos.z * 0);
    viewer.addExternalObject("targetObject", targetObject);
    spotLight.target = targetObject;
    spotLight.castShadow = true;
    viewer.addExternalObject("spotLight", spotLight);
    // viewer.addExternalObject("spotHelper", spotHelper);


    //通过GUI控制灯光参数
    var gui = new dat.GUI();

    // 配置Data-GUI
    var myControls;
    myControls = new function () {
        this.spotPX = alarmPos.x + base * 0;
        this.spotPY = alarmPos.y + base * 0.5;
        this.spotPZ = alarmPos.z + base * 2;
        this.distance = 1500;

        // this.backgroundColor = [28, 45, 55];
        // this.floorColor = [9, 46, 81];
    };


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

function onSDKLoadFailed(error) {
    console.log("Failed to load SDK!");
};