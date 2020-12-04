
import { WebUtils } from '../package/WebUtils.js'
import { ModelHelper } from '../package/ModelHelper.js'
import { light } from '../usr/light.js'


var app, viewer;
const INTEGRATION_FILE = 1;
var BimfaceLoaderConfig = new BimfaceSDKLoaderConfig();
var webUtil = new WebUtils();

webUtil.getViewtoken(1850344282898048, INTEGRATION_FILE).then((token) => {
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
        var modelHelper = new ModelHelper(viewer);
        window.viewer = viewer;
        webUtil.viewer = window.viewer;
        viewer.enableGlowEffect(true);
        viewer.addEventListener(Glodon.Bimface.Viewer.Viewer3DEvent.ViewAdded, function () {
            //helper.createAixsHelper(viewer);
            let scene = modelHelper.getScene(), camera = modelHelper.getPerspectiveCamera(), renderer = modelHelper.getRender();
            window.myscene = scene;
            document.getElementById('open-button').style.display = 'block';
            viewer.getViewer().rendererManager.renderer.renderer.shadowMap.enabled = true;
            viewer.getViewer().rendererManager.renderer.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
            scene.children[0].castShadow = true;
            bindEvent();

            // 万达制冷机房
            initScene(scene, viewer);
            initModel(viewer);
            viewer.setGlowEffectById(["1850332718385088.5299047", "1850332718385088.4491258"], { type: "outline", color: new Glodon.Web.Graphics.Color(255, 0, 0, 1) });
            viewer.addEventListener(Glodon.Bimface.Viewer.Viewer3DEvent.MouseClicked, function (e) {
                if (!e.objectId) return;
                if (window.bim.queryCondition) {
                    let condition = viewer.getObjectDataById(e.objectId);
                    webUtil.layerPanel("#json-renderer", "auto", "auto", "筛选条件", 'layui-layer-molv', condition);
                }

                if (window.bim.component) {
                    webUtil.layerPanel("#json-renderer", "auto", undefined, "构件信息", 'layui-layer-lan', e);
                }
            });
        });
    }
};

function onSDKLoadFailed(error) {
    console.log("Failed to load SDK!");
};

function bindEvent() {
    document.getElementById("white").addEventListener("click", () => {
        viewer.setBackgroundColor(new Glodon.Web.Graphics.Color(234, 234, 234, 1));
        viewer.overrideComponentsColorByObjectData([{ "specialty": "建筑" }, { "specialty": "结构" }], new Glodon.Web.Graphics.Color(167, 167, 167, 1));
        viewer.overrideComponentsColorByObjectData([{ "specialty": "暖通空调" }], new Glodon.Web.Graphics.Color(248, 226, 31, 1));
        viewer.overrideComponentsColorByObjectData([{ "categoryId": "-2008049" }, { "categoryId": "-2008055" }, { "systemType": "空调送风风管" }, { "systemType": "排油烟管" }, { "systemType": "排烟风管" }, { "systemType": "新风风管" }, { "systemType": "通风排风风管" }, { "systemType": "正压送风风管" }, { "systemType": "回风风管" }, { "systemType": "给水管" }, { "systemType": "补风管" }, { "systemType": "消防供水管" }, { "family": "管道类型" }, { "systemType": "喷淋管" }, { "systemType": "污水管" }, { "systemType": "雨水管" }, { "systemType": "冷、热水回水管" }, { "systemType": "冷凝水管" }, { "systemType": "冷、热水供水管" }], new Glodon.Web.Graphics.Color(13, 173, 247, 1));

        viewer.overrideComponentsColorById(["1850332718385088.5299047"], new Glodon.Web.Graphics.Color(157, 14, 70, 1));
        viewer.overrideComponentsColorById(["1850332718385088.4491258"], new Glodon.Web.Graphics.Color(157, 14, 70, 1));
        viewer.overrideComponentsColorById(["1850332718385088.5300720"], new Glodon.Web.Graphics.Color(113, 162, 160, 1));
        viewer.overrideComponentsColorById(["1850332718385088.4900920"], new Glodon.Web.Graphics.Color(113, 162, 160, 1));
        viewer.overrideComponentsColorById(["1850332718385088.5300592"], new Glodon.Web.Graphics.Color(113, 162, 160, 1));
        viewer.overrideComponentsColorById(["1850332718385088.4901277"], new Glodon.Web.Graphics.Color(157, 14, 70, 1));//热水泵

        viewer.setCameraStatus({
            "name": "persp",
            "position": {
                "x": 26901.74082165596,
                "y": 68238.12140633317,
                "z": 9605.27260912674
            },
            "target": {
                "x": -26628.16725904094,
                "y": 32216.845880673605,
                "z": -55250.891849645945
            },
            "up": {
                "x": -0.588164848827757,
                "y": -0.39579193684720787,
                "z": 0.7052736017533603
            },
            "fov": 45,
            "zoom": 0,
            "version": 1,
            "coordinateSystem": "world"
        });
        viewer.setGlowEffectById(["1850332718385088.5299047", "1850332718385088.4491258"], { type: "outline", color: new Glodon.Web.Graphics.Color(255, 0, 0, 1), spread: 2 });
        viewer.render();
    });

    document.getElementById("gray").addEventListener("click", () => {
        viewer.setBackgroundColor(new Glodon.Web.Graphics.Color(234, 234, 234, 1));
        viewer.overrideComponentsColorByObjectData([{ "specialty": "建筑" }, { "specialty": "结构" }], new Glodon.Web.Graphics.Color(167, 167, 167, 1));
        viewer.overrideComponentsColorByObjectData([{ "specialty": "暖通空调" }], new Glodon.Web.Graphics.Color(17, 177, 79, 1));
        viewer.overrideComponentsColorByObjectData([{ "categoryId": "-2008049" }, { "categoryId": "-2008055" }, { "systemType": "空调送风风管" }, { "systemType": "排油烟管" }, { "systemType": "排烟风管" }, { "systemType": "新风风管" }, { "systemType": "通风排风风管" }, { "systemType": "正压送风风管" }, { "systemType": "回风风管" }, { "systemType": "给水管" }, { "systemType": "补风管" }, { "systemType": "消防供水管" }, { "family": "管道类型" }, { "systemType": "喷淋管" }, { "systemType": "污水管" }, { "systemType": "雨水管" }, { "systemType": "冷、热水回水管" }, { "systemType": "冷凝水管" }, { "systemType": "冷、热水供水管" }], new Glodon.Web.Graphics.Color(126, 126, 126, 1));

        viewer.overrideComponentsColorById(["1850332718385088.5299047"], new Glodon.Web.Graphics.Color(157, 14, 70, 1));
        viewer.overrideComponentsColorById(["1850332718385088.4491258"], new Glodon.Web.Graphics.Color(157, 14, 70, 1));
        viewer.overrideComponentsColorById(["1850332718385088.5300720"], new Glodon.Web.Graphics.Color(113, 162, 160, 1));
        viewer.overrideComponentsColorById(["1850332718385088.4900920"], new Glodon.Web.Graphics.Color(113, 162, 160, 1));
        viewer.overrideComponentsColorById(["1850332718385088.5300592"], new Glodon.Web.Graphics.Color(113, 162, 160, 1));
        viewer.overrideComponentsColorById(["1850332718385088.4901277"], new Glodon.Web.Graphics.Color(157, 14, 70, 1));//热水泵
        viewer.setGlowEffectById(["1850332718385088.5299047", "1850332718385088.4491258"], { type: "body", color: new Glodon.Web.Graphics.Color(255, 0, 0, 1) });
        viewer.render();
    });

}

function initScene(scene, viewer) {
    window.ea = viewer.getExternalComponentManager();
    viewer.setBackgroundColor(new Glodon.Web.Graphics.Color(28, 45, 55, 1));

    let start = {
        "name": "persp",
        "position": {
            "x": -36719.46122559318,
            "y": -17073.75669740723,
            "z": 47722.03040187795
        },
        "target": {
            "x": 16098.799241644685,
            "y": 35744.698317162394,
            "z": -5096.038260086816
        },
        "up": {
            "x": 0,
            "y": -0.000003673204978973533,
            "z": 0.9999999999932538
        },
        "fov": 45,
        "version": 1
    };

    let target = {
        "name": "persp",
        "position": {
            "x": 47672.90064514055,
            "y": 74332.24584790962,
            "z": 29380.518148928408
        },
        "target": {
            "x": -5857.008696355016,
            "y": 38310.96947432557,
            "z": -35475.64783653954
        },
        "up": {
            "x": -0.5881648488319571,
            "y": -0.3957919368526773,
            "z": 0.7052736017467882
        },
        "fov": 45,
        "version": 1
    };

    viewer.setCameraStatus(start, () => {
        setTimeout(() => {
            viewer.setCameraStatus(target, () => {
                viewer.enableShadow(true);
            });
        }, 800);
    });

    // 创建标签容器
    var drawableConfig = new Glodon.Bimface.Plugins.Drawable.DrawableContainerConfig();
    drawableConfig.viewer = viewer;
    var drawableContainer = new Glodon.Bimface.Plugins.Drawable.DrawableContainer(drawableConfig);



    let idx = 1;
    scene.traverse(function (child) {
        if (child instanceof CLOUD.MeshEx || child instanceof CLOUD.Object3DEx || child instanceof THREE.Mesh) {
            child.castShadow = true;
            child.name = idx;
            child.receiveShadow = true;

            idx++;

        }
    }, true);

    var boxMesh = new THREE.Object3D();

    boxMesh.position.set(18196, 52936, -385)
    viewer.addExternalObject("boxMesh", boxMesh);



    // 配置聚光灯
    let spotLight = light.createSpotLight(0xffffff, 1.5, 1500, Math.PI / 3, 0.5, 2);
    spotLight.castShadow = true;
    spotLight.shadowDarkness = 1.0;
    spotLight.visible = true;
    spotLight.shadow.mapSize.width = 4096;
    spotLight.shadow.mapSize.height = 4096;
    // spotLight.shadowCameraVisible = true;

    //var targetObject = new THREE.Object3D();
    // targetObject.position.set({ x: 12352.515431644013, y: 53333.174581496525, z: -5899.999372838399 });
    // viewer.addExternalObject("targetObject", targetObject);

    spotLight.position.set(18196, 52936, 6285);
    spotLight.target = boxMesh;

    // var spotLightHelper = new THREE.SpotLightHelper(spotLight, 0xce3ced);
    // spotLightHelper.position.set(7055.299652797337, 39462.99907105393, -797.9316783322747);

    //var helper = new THREE.DirectionalLightHelper(spotLight, 5);
    // viewer.addExternalObject("shadow", new THREE.CameraHelper(spotLight.shadow.camera));
    viewer.addExternalObject("spotLight", spotLight);
    //viewer.getExternalComponentManager().setTransform("spotLight", { x: 10583.111505163692, y: 65108.77472340918, z: -4180.216448552426 });
    // viewer.addExternalObject("spotLightHelper", spotLightHelper);
    var spotLightHelper = new THREE.SpotLightHelper(spotLight);
    viewer.addExternalObject("spotLightHelper", spotLightHelper);


    // 配置Data-GUI
    var myControls;
    myControls = new function () {
        this.spotPX = 18196;
        this.spotPY = 52936;
        this.spotPZ = 6285;
        this.distance = 1500;

        this.backgroundColor = [28, 45, 55];
        this.floorColor = [9, 46, 81];
    };

    var setPosition = function () {
        viewer.getExternalComponentManager().setTransform("spotLight", { x: myControls.spotPX, y: myControls.spotPY, z: myControls.spotPZ });
        viewer.render();
    };

    var setParameters = function () {
        spotLight.distance = myControls.distance;
        viewer.render();
    };

    var changeBgColor = function () {
        viewer.setBackgroundColor(new Glodon.Web.Graphics.Color(myControls.backgroundColor[0], myControls.backgroundColor[1], myControls.backgroundColor[2], 1));
        viewer.render();
    };

    var changeFloorColor = function () {
        viewer.overrideComponentsColorByObjectData([{ "categoryId": "-2001300" }], new Glodon.Web.Graphics.Color(myControls.floorColor[0], myControls.floorColor[1], myControls.floorColor[2], 0.85));
        viewer.render();
    }

    var gui = new dat.GUI();
    var spotPosition = gui.addFolder("SpotLightPosition");
    spotPosition.add(myControls, 'spotPX', -10000, 80000).onChange(setPosition);
    spotPosition.add(myControls, 'spotPY', -10000, 80000).onChange(setPosition);
    spotPosition.add(myControls, 'spotPZ', -10000, 80000).onChange(setPosition);

    var spotParameters = gui.addFolder("SpotLightParameters");
    spotParameters.add(myControls, 'distance', 0, 5000).onChange(setParameters);

    var colors = gui.addFolder("ColorParameters");
    colors.addColor(myControls, 'backgroundColor').onChange(changeBgColor);
    colors.addColor(myControls, 'floorColor').onChange(changeFloorColor);



    //配置直射光，太刺眼，暂时去掉
    let dir = light.createDirectilyLight(0xffffff, 10);
    dir.target = boxMesh;
    dir.castShadow = true;

    // viewer.addExternalObject("dir", dir);

    //隐藏管道隔热层和建筑楼板
    viewer.hideComponentsByObjectData([{ "categoryId": "-2008122" }, { "categoryId": "-2000032" }]);

    viewer.overrideComponentsColorByObjectData([{ "specialty": "建筑" }, { "specialty": "结构" }], new Glodon.Web.Graphics.Color('#6699FF', 0.25));
    //设置机械设备颜色
    viewer.overrideComponentsColorByObjectData([{ "categoryId": "-2001140" }], new Glodon.Web.Graphics.Color(118, 205, 162, 0.95));

    //设置楼板颜色
    viewer.overrideComponentsColorByObjectData([{ "categoryId": "-2001300" }], new Glodon.Web.Graphics.Color(9, 46, 81, 1));

    //故障设备
    viewer.overrideComponentsColorById(["1850332718385088.5299047"], new Glodon.Web.Graphics.Color(228, 119, 111, 0.98));

    //关闭设备
    viewer.overrideComponentsColorById(["1850332718385088.5300592"], new Glodon.Web.Graphics.Color(78, 114, 167, 0.98));
    viewer.render();

}

function initModel(viewer) {
    document.getElementById("identity").style.display = "block";
    viewer.hideViewHouse();
    document.getElementsByClassName('dg ac')[0].style.display = "none";
    document.getElementsByClassName('bf-toolbar bf-toolbar-bottom')[0].style.display = 'none';
    document.getElementsByClassName('gld-bf-tree')[0].style.display = 'none';
}