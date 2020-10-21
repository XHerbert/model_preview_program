/**
 * @author:xuhongbo
 * @function:
 */
import { WebUtils } from '../package/WebUtils.js'
import { ModelHelper } from '../package/ModelHelper.js'

var app, viewer, drawableContainer, isShow, runViewChangeCallBack;
const INTEGRATE_FILE = 1;
var BimfaceLoaderConfig = new BimfaceSDKLoaderConfig();
var webUtils = new WebUtils();
/*************************************** */
// 基础结构
var structure = 1959324457354208;
// 暖通
var ntModel = 1958008120345568;
// 视频
var video = 1958689963345920;
// 管道颜色
var pipeColor = '#646363';
// 设备颜色
var equipmentColor = '#11B14F';
// 基础框架颜色
var structureColor = '#A7A7A7';
// 背景色
var bgColor = '#EAEAEA';
/*************************************** */
webUtils.getViewtoken(structure, INTEGRATE_FILE).then((token) => {
    BimfaceLoaderConfig.viewToken = token;
    BimfaceSDKLoader.load(BimfaceLoaderConfig, onSDKLoadSucceeded, onSDKLoadFailed);
});

function onSDKLoadSucceeded(viewMetaData) {
    if (viewMetaData.viewType == "3DView") {
        var view = document.getElementById('view');
        var config = new Glodon.Bimface.Application.WebApplication3DConfig();
        config.domElement = view;
        config.enableExplosion = true;
        app = new Glodon.Bimface.Application.WebApplication3D(config);
        viewer = app.getViewer();
        viewer.setCameraAnimation(true);
        app.addView(BimfaceLoaderConfig.viewToken);


        viewer.setBorderLineEnabled(false);
        window.viewer = viewer;
        viewer.setBackgroundColor = webUtils.fromHexColor(bgColor, 1);
        webUtils.viewer = window.viewer;
        viewer.addEventListener(Glodon.Bimface.Viewer.Viewer3DEvent.ViewAdded, function () {

            let modelHelper = new ModelHelper(viewer);
            let scene = modelHelper.getScene(), camera = modelHelper.getPerspectiveCamera(), renderer = modelHelper.getRender();
            renderer.domElement.addClass('canvasClass');
            window.myscene = scene;
            renderer.shadowMap.enabled = true;
            viewer.enableShadow(true);
            viewer.setExposureShift(0.0);//曝光会影响色值
            renderer.alpha = true;
            renderer.setClearAlpha(0.08);
            runViewChangeCallBack = true;

            // 创建标签容器
            var drawableConfig = new Glodon.Bimface.Plugins.Drawable.DrawableContainerConfig();
            drawableConfig.viewer = viewer;
            drawableContainer = new Glodon.Bimface.Plugins.Drawable.DrawableContainer(drawableConfig);
            webUtils.initModel();

            viewer.overrideComponentsColorByObjectData([], webUtils.fromHexColor('#6187C9', 1));

            //相机视角
            setCamera(viewer, function () {
                webUtils.getViewtoken(ntModel, 1).then((token) => {
                    viewer.addView(token);
                });
            });

            bindEvent();
            //全楼空调

            viewer.addEventListener(Glodon.Bimface.Viewer.Viewer3DEvent.ViewLoading, function (e) {
                //document.getElementsByClassName('bf-loading')[0].style.display = 'none';
                viewer.enableScale(false);
                viewer.enableOrbit(false);
            });


            //此处在view发生变化时，都会执行，需要额外的逻辑处理，如果addView有自己的回调函数则可以解决
            viewer.addEventListener(Glodon.Bimface.Viewer.Viewer3DEvent.ViewChanged, function (e) {
                viewer.enableScale(true);
                viewer.enableOrbit(true);
                viewer.setCameraStatus({
                    "name": "persp",
                    "position": {
                        "x": -56703.78116638385,
                        "y": -44617.48852318813,
                        "z": 129840.7443973194
                    },
                    "target": {
                        "x": 170618.41800144612,
                        "y": 182705.5479483897,
                        "z": -97480.62926818861
                    },
                    "up": {
                        "x": 0,
                        "y": -8.951882265289603e-12,
                        "z": 1
                    },
                    "fov": 45,
                    "zoom": 1,
                    "version": 1,
                    "coordinateSystem": "world"
                });
                if (!runViewChangeCallBack) return;
                if (viewer.getModel) {
                    viewer.getModel(ntModel).hideAllComponents();
                    viewer.getModel(ntModel).showComponentsByObjectData([{ "family": "ATAH-吊顶式空气处理机组" }]);
                }
            });

            //TODO:声明下方单击事件中需要的变量
            viewer.addEventListener(Glodon.Bimface.Viewer.Viewer3DEvent.MouseClicked, function (e) {
                if (!e.objectId) return;
                if (window.bim.queryCondition) {
                    let condition = viewer.getModel(ntModel).getObjectDataById(e.objectId);
                    webUtils.layerPanel("#json-renderer", "auto", "auto", "筛选条件", 'layui-layer-molv', condition);
                }

                if (window.bim.component) {
                    webUtils.layerPanel("#json-renderer", "auto", undefined, "构件信息", 'layui-layer-lan', e);
                }
                if (window.bim.recordObjectId) {
                    webUtils.copyStringValue(e.objectId);
                }
                //TODO:Click logic

            });
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
            "x": -269551.86785909673,
            "y": -182892.30024976435,
            "z": 311902.8020926572
        },
        "target": {
            "x": 23561.99925036078,
            "y": 110222.64649617582,
            "z": 18789.99940268324
        },
        "up": {
            "x": 0,
            "y": -0.0000036732049621913,
            "z": 0.9999999999932538
        },
        "fov": 45,
        "zoom": 1,
        "version": 1,
        "coordinateSystem": "world"
    };

    let target = {
        "name": "persp",
        "position": {
            "x": -56703.78116638385,
            "y": -44617.48852318813,
            "z": 129840.7443973194
        },
        "target": {
            "x": 170618.41800144612,
            "y": 182705.5479483897,
            "z": -97480.62926818861
        },
        "up": {
            "x": 0,
            "y": -8.951882265289603e-12,
            "z": 1
        },
        "fov": 45,
        "zoom": 1,
        "version": 1,
        "coordinateSystem": "world"
    };

    viewer.setCameraStatus(start, () => {
        setTimeout(() => {
            viewer.setCameraStatus(target, () => {
                bindEvent();
                if (callback) {
                    callback();
                };
                viewer.recordCustomedHomeview(target);
            })
        }, 800);
    });
}

function bindEvent() {
    document.getElementById('floor').addEventListener('click', function () {
        webUtils.getViewtoken(video, 0).then((token) => {
            viewer.addView(token);
            runViewChangeCallBack = false;
            viewer.clearFloorExplosion();
        });
        viewer.getModel(structure).showExclusiveComponentsByObjectData([{ "levelName": "F01" }]);
        viewer.getModel(structure).restoreComponentsColorByObjectData([{ "levelName": "F01" }]);
        viewer.getModel(structure).overrideComponentsColorByObjectData([], webUtils.fromHexColor(structureColor, 1));

        viewer.getModel(ntModel).showExclusiveComponentsByObjectData([{ "levelName": "F01" }]);
        viewer.getModel(ntModel).hideAllComponents();
        viewer.getModel(ntModel).overrideComponentsColorByObjectData([{ "family": "ATAH-吊顶式空气处理机组" }], webUtils.fromHexColor(equipmentColor, 1));
        viewer.getModel(ntModel).showComponentsByObjectData([{ "family": "ATAH-吊顶式空气处理机组", "levelName": "F01" }]);
        viewer.enableShadow(true);
        viewer.render();
    });

    document.getElementById('net').addEventListener('click', function () {
        isShow = !isShow;
        if (isShow) {
            viewer.getModel(ntModel).showComponentsByObjectData([{ "levelName": "F01" }]);
            viewer.getModel(ntModel).overrideComponentsColorByObjectData([], webUtils.fromHexColor(pipeColor, 1));
            viewer.getModel(ntModel).overrideComponentsColorByObjectData([{ "family": "ATAH-吊顶式空气处理机组" }], webUtils.fromHexColor(equipmentColor, 1));

        } else {
            viewer.getModel(ntModel).hideAllComponents();
            viewer.getModel(ntModel).showComponentsByObjectData([{ "family": "ATAH-吊顶式空气处理机组", "levelName": "F01" }]);
        }
        viewer.render();
    });

    //楼层炸开
    document.getElementById('explosion').addEventListener('click', function () {
        let floorList = [];
        viewer.enableShadow(true);
        if (floorList.length == 0) {
            viewer.getFloors(function (data) {
                if (!data) {
                    console.log('No floor data.');
                    return;
                }
                viewer.getModel(structure).overrideComponentsColorByObjectData([], webUtils.fromHexColor(structureColor, 1));
                for (var i = 0; i < data.length; i++) {
                    floorList.push(data[i].id);
                }
                viewer.setFloorExplosion(3, floorList);
                viewer.setCameraStatus({
                    "name": "persp",
                    "position": {
                        "x": -214984.72406163535,
                        "y": -210215.79658323858,
                        "z": 316288.707660729
                    },
                    "target": {
                        "x": 119503.34280704556,
                        "y": 124273.10599535985,
                        "z": 131946.29440362408
                    },
                    "up": {
                        "x": 0.2567533206072301,
                        "y": 0.25675001982785506,
                        "z": 0.9317495155220403
                    },
                    "fov": 45,
                    "zoom": 1,
                    "version": 1,
                    "coordinateSystem": "world"
                });
                viewer.render();
            });
        } else {
            viewer.setFloorExplosion(3, floorList);
            viewer.render();
        }
    });
}