/**
 * @author:xuhongbo
 * @function:wanda F01 effiective
 */

import { WebUtils } from '../package/WebUtils.js'
import { ModelHelper } from '../package/ModelHelper.js'

var app, viewer, drawableContainer, composer, outlinePass, effectFXAA;
const INTEGRATE_FILE = 1;
var BimfaceLoaderConfig = new BimfaceSDKLoaderConfig();
var webUtils = new WebUtils();

// BimfaceLoaderConfig.viewToken = '0d3c791f12df41a9b7ce06393cea9333';
// BimfaceSDKLoader.load(BimfaceLoaderConfig, onSDKLoadSucceeded, onSDKLoadFailed);
webUtils.getViewtoken(1943820799820576, INTEGRATE_FILE).then((token) => {
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

        window.viewer = viewer;
        webUtils.viewer = window.viewer;
        viewer.addEventListener(Glodon.Bimface.Viewer.Viewer3DEvent.ViewAdded, function () {
            let modelHelper = new ModelHelper(viewer);
            //helper.createAixsHelper(viewer);
            let scene = modelHelper.getScene(), camera = modelHelper.getPerspectiveCamera(), renderer = modelHelper.getRender();
            window.myscene = scene;
            renderer.shadowMap.enabled = true;
            viewer.enableShadow(true);
            viewer.setExposureShift(0.2);
            renderer.alpha = true;
            renderer.setClearAlpha(0.08);
            viewer.setBackgroundColor(new Glodon.Web.Graphics.Color(6, 3, 19, 1));
            let uniform = {
                time: { value: 0.0 }
            }

            // 创建标签容器
            var drawableConfig = new Glodon.Bimface.Plugins.Drawable.DrawableContainerConfig();
            drawableConfig.viewer = viewer;
            drawableContainer = new Glodon.Bimface.Plugins.Drawable.DrawableContainer(drawableConfig);

            //空间
            viewer.overrideComponentsColorById(["1891307035887712.2933839"], new Glodon.Web.Graphics.Color(255, 136, 0, 0.7));//orange
            viewer.overrideComponentsColorById(["1891307035887712.2935384"], new Glodon.Web.Graphics.Color(245, 78, 69, 0.6));//red
            viewer.overrideComponentsColorById(["1891307035887712.2932489"], new Glodon.Web.Graphics.Color(255, 255, 255, 0.5));//white
            viewer.overrideComponentsColorById(["1891307035887712.2934706"], new Glodon.Web.Graphics.Color(245, 78, 69, 0.6));//red

            //设备
            viewer.overrideComponentsColorById(["1891307035887712.1765452"], new Glodon.Web.Graphics.Color(255, 31, 18, 0.8));
            viewer.overrideComponentsColorById(["1891307035887712.2263790"], new Glodon.Web.Graphics.Color(255, 31, 18, 0.8));
            viewer.overrideComponentsColorById(["1891307035887712.2299577"], new Glodon.Web.Graphics.Color(255, 245, 18, 0.8));

            viewer.overrideComponentsColorById(["1891307035887712.2299911", "1891307035887712.2300102", "1891307035887712.2224685", "1891307035887712.2300377"], new Glodon.Web.Graphics.Color(233, 30, 99, 0.8));

            //白色空间内的风管
            viewer.overrideComponentsColorById(["1891307035887712.2059701", "1891307035887712.1740248", "1891307035887712.1740251", "1891307035887712.1740249", "1891307035887712.1740677", "1891307035887712.1740247", "1891307035887712.2220209", "1891307035887712.2220206", "1891307035887712.2220324", "1891307035887712.2220327", "1891307035887712.2314358", "1891307035887712.2314355", "1891307035887712.1733863", "1891307035887712.2314580", "1891307035887712.2314578", "1891307035887712.1733882", "1891307035887712.1733864", "1891307035887712.2220271", "1891307035887712.2220268"], new Glodon.Web.Graphics.Color(255, 255, 255, 0.98));

            //地平面
            viewer.overrideComponentsColorByObjectData([{ "family": "楼板" }], new Glodon.Web.Graphics.Color(179, 178, 177, 0.85));
            let wid = 200000, hei = 200000;
            var planeGeometry = new THREE.PlaneBufferGeometry(wid, hei);
            let loader = new THREE.TextureLoader();
            var planeMaterial = new THREE.MeshBasicMaterial({});

            //TODO:替换底图图片，最好是径向渐变，与背景色融合在一起
            let others = loader.load('../../images/back.jpg', function (map) {
                planeMaterial.map = map;
                var plane = new THREE.Mesh(planeGeometry, planeMaterial);
                plane.translateX(wid / 2);
                plane.translateY(hei / 2);
                // viewer.addExternalObject("plane", plane);
            });

            //空间转换
            let whiteArea = viewer.convertToExternalObject("mainArea", ['1891307035887712.2932489'], true);
            let box = new THREE.BoxBufferGeometry(10000, 10000, 10000);

            let material = new THREE.MeshBasicMaterial({
                color: 0xffffff,
                wireframe: false,
                transparent: true,
                opacity: 0.5
            });
            whiteArea.children[0].material = material;
            viewer.addExternalObject("area", whiteArea);

            //顶部扶栏
            let arrays = ['1891307035887712.2785404', "1891307035887712.2784673", "1891307035887712.2785383", "1891307035887712.2842603", "1891307035887712.2785481", "1891307035887712.2785443", "1891307035887712.2785463"];
            let fulanMaterial = new THREE.ShaderMaterial({
                uniforms: uniform,
                vertexShader: document.getElementById('vertex').textContent,
                fragmentShader: document.getElementById('fragment').textContent
            });
            let fulanGroup = new THREE.Group();
            for (let a = 0; a < arrays.length; a++) {
                let _ = [];
                _.push(arrays[a]);
                let name = "fulan" + a;
                // let fulan = viewer.convertToExternalObject(name, _, true);
                // fulan.children[0].material = fulanMaterial;
                //暂时不用
                //viewer.addExternalObject(name, fulan);
            }

            viewer.hideViewHouse();
            document.getElementsByClassName('bf-toolbar bf-toolbar-bottom')[0].style.display = 'none';
            document.getElementsByClassName('gld-bf-tree')[0].style.display = 'none';
            document.getElementById('open-button').style.display = 'block';
            bindEvent();


            viewer.addEventListener(Glodon.Bimface.Viewer.Viewer3DEvent.MouseClicked, function (e) {
                if (!e.objectId) return;
                console.log(e);

                if (window.bim.queryCondition) {
                    let condition = viewer.getObjectDataById(e.objectId, (condition) => {
                        console.log("condition", condition);
                    });
                    webUtils.layerPanel("#json-renderer", "auto", "auto", "筛选条件", 'layui-layer-molv', condition);
                }

                if (window.bim.component) {
                    webUtils.layerPanel("#json-renderer", "auto", undefined, "构件信息", 'layui-layer-lan', e);
                }
            })




            //产生边缘，并追加到场景中，不透明度1，由于不能设置线宽，所以通过克隆、偏移的方式解决线宽问题
            var edges = new THREE.EdgesGeometry(new THREE.Geometry().fromBufferGeometry(whiteArea.children[0].geometry));
            // var line = new THREE.LineSegments(edges, new THREE.LineBasicMaterial({ color: 0xffffff }));
            var line = new THREE.LineSegments(edges, new THREE.ShaderMaterial({
                uniforms: uniform,
                vertexShader: document.getElementById('edgevertex').textContent,
                fragmentShader: document.getElementById('edgefragment').textContent
            }));
            let lineGroup = new THREE.Group();
            lineGroup.add(line);

            for (let idx = -50; idx < 50; idx++) {
                let lineClone = line.clone();
                lineClone.position.x = line.position.x + idx;
                lineClone.position.y = line.position.y + idx;
                lineGroup.add(lineClone);
            }
            viewer.addExternalObject("edges", lineGroup);

            //创建标签
            setCamera(viewer, () => {
                createTag({ x: 106848.99342876796, y: 159958.46350893454, z: 15849.999883117878 }, "bigcircle2", "");
                createTag({ x: 147259.284137998, y: 104541.69746192008, z: 15850.064883335008 }, "bigcircle2", "");
                createTag({ x: 99081.2708190525, y: 13990.056421873413, z: 15850.01312551748 }, "bigcircle2", "");
                createTag({ x: 28789.34954544223, y: 70984.95282537282, z: 14392.88910126507 }, "bigcircle2", "");
            });

            function createTag(position, styleClass, text) {
                var config = new Glodon.Bimface.Plugins.Drawable.CustomItemConfig();
                var content = document.createElement('div');
                //TODO:替换图标
                // content.innerHTML = '<div class="item"><div style="width:49px;height:35px;"><img src="../../images/icon.png" height="32" width="32"/></div><div  id="canvasDiv" class="1' + styleClass + '">' + text + '</div></div>'
                content.innerHTML = '<div class="item"><div style="width:49px;height:35px;"></div><div  id="canvasDiv" class="1' + styleClass + '">' + text + '</div></div>'
                config.content = content;
                config.viewer = viewer;
                config.worldPosition = position;
                var customItem = new Glodon.Bimface.Plugins.Drawable.CustomItem(config);
                drawableContainer.addItem(customItem);
            };

            //处理顶部扶栏
            let dir = 1.0;
            //run();

            function run() {
                viewer.render();
                requestAnimationFrame(run);
                uniform.time.value += 0.314 * dir;
                // if (uniform.time.value >= 1.0) {
                //     dir = -1.0;
                // }
                // if (uniform.time.value <= 0.0) {
                //     dir = 1.0;
                // }
            };
        });
    }
};

function onSDKLoadFailed(error) {
    console.log("Failed to load SDK!");
};


function setCamera(viewer, callback) {
    let start = {
        "name": "persp",
        "position": {
            "x": -87876.72699139986,
            "y": -70229.03759091756,
            "z": 177726.35885637588
        },
        "target": {
            "x": 76800.0291669729,
            "y": 94448.32512707186,
            "z": 13050.200708430179
        },
        "up": {
            "x": 0,
            "y": -0.0000036732161161965555,
            "z": 0.9999999999932538
        },
        "fov": 45,
        "zoom": 1,
        "version": 1
    };

    let target = {
        "name": "persp",
        "position": {
            "x": -65819.22381067692,
            "y": 20026.144011659544,
            "z": 100344.9821103466
        },
        "target": {
            "x": 134715.02658292453,
            "y": 138445.01443164545,
            "z": -64331.338046253855
        },
        "up": {
            "x": 0.4971421741856359,
            "y": 0.29356637301827576,
            "z": 0.8164976688753457
        },
        "fov": 45,
        "zoom": 1,
        "version": 1
    };

    viewer.setCameraStatus(start, () => {
        setTimeout(() => {
            viewer.setCameraStatus(target, () => {

                if (callback) {
                    callback();
                };
                viewer.recordCustomedHomeview(target);
            })
        }, 800);
    });
}

function formatHtml(data) {
    return $('#json-renderer').jsonViewer(data);
}


function bindEvent() {
    document.getElementById("white").addEventListener("click", () => {
        viewer.setBackgroundColor(new Glodon.Web.Graphics.Color(234, 234, 234, 1));
        viewer.showExclusiveComponentsByObjectData([{ "levelName": "F03" }]);
        viewer.overrideComponentsColorByObjectData([{ "family": "基本墙" }, { "family": "圆柱" }, { "family": "矩形柱" }, { "family": "砼圆形柱" }, { "family": "砼矩形柱" }, { "family": "楼板" }], new Glodon.Web.Graphics.Color(167, 167, 167, 1));
        viewer.overrideComponentsColorByObjectData([{ "systemType": "空调送风风管" }, { "systemType": "排油烟管" }, { "systemType": "排烟风管" }, { "systemType": "新风风管" }, { "systemType": "通风排风风管" }, { "systemType": "正压送风风管" }, { "systemType": "回风风管" }, { "systemType": "给水管" }, { "systemType": "补风管" }, { "systemType": "消防供水管" }, { "family": "管道类型" }, { "systemType": "喷淋管" }, { "systemType": "污水管" }, { "systemType": "雨水管" }, { "systemType": "冷、热水回水管" }, { "systemType": "冷凝水管" }, { "systemType": "冷、热水供水管" }], new Glodon.Web.Graphics.Color(13, 173, 247, 1));
        viewer.overrideComponentsColorByObjectData([{ "family": "SCEF-轴流风机" }, { "family": "VTSF-柜式离心风机 - 电机外置1" }, { "family": "KLAP-油烟净化器" }, { "family": "ATFC-卧式暗装风机盘管1" }, { "family": "ATAH-吊顶式空气处理机组" }, { "family": "ATAH- 卧式 - 顶出后送式 - 2000-9000 CMH" }], new Glodon.Web.Graphics.Color(248, 226, 31, 1));
        viewer.overrideComponentsColorById(["2263790"], new Glodon.Web.Graphics.Color(255, 0, 0, 1));
        viewer.render();
    });


    document.getElementById('black').addEventListener("click", function () {

        viewer.hideComponentsByObjectData([
            { "categoryId": "-2008000" },
            { "categoryId": "-2001140" },
            { "categoryId": "-2008010" },
            { "categoryId": "-2008044" },
            { "categoryId": "-2008013" },
            { "categoryId": "-2008016" },
            { "categoryId": "-2008049" },
        ]);

        webUtils.getFile('../../data/1943820799820576/space.json', function (data) {
            viewer.createRoom(data, 3300, webUtils.guid(), webUtils.fromHexColor("#708090", 0.45), webUtils.fromHexColor("#778899", 1));
        });

        viewer.setCameraStatus({
            "name": "persp",
            "position": {
                "x": -31389.746906083536,
                "y": 201945.61220601082,
                "z": 44389.95103905967
            },
            "target": {
                "x": 170544.08937820388,
                "y": 70097.41444947965,
                "z": -107906.10209393282
            },
            "up": {
                "x": 0.44708088593911066,
                "y": -0.29191584436937484,
                "z": 0.8455198526551667
            },
            "fov": 45,
            "zoom": 1,
            "version": 1,
            "coordinateSystem": "world"
        });
        viewer.render();
    });
}