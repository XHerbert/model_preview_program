/**
 * @author:xuhongbo
 * @function:
 */
import { WebUtils } from '../package/WebUtils.js'
import { ModelHelper } from '../package/ModelHelper.js'

var app, viewer, drawableContainer;
const SINGLE_FILE = 0;
var BimfaceLoaderConfig = new BimfaceSDKLoaderConfig();
var webUtils = new WebUtils();
var hidetoken;

webUtils.getViewtoken(1948099216558080, SINGLE_FILE).then((token) => {
    BimfaceLoaderConfig.viewToken = token;
    hidetoken = token;
    BimfaceSDKLoader.load(BimfaceLoaderConfig, onSDKLoadSucceeded, onSDKLoadFailed);
});

function onSDKLoadSucceeded(viewMetaData) {
    if (viewMetaData.viewType == "3DView") {
        var view = document.getElementById('view');
        var config = new Glodon.Bimface.Application.WebApplication3DConfig();
        config.domElement = view;
        app = new Glodon.Bimface.Application.WebApplication3D(config);
        viewer = app.getViewer();
        viewer.setCameraAnimation(true);
        app.addView(BimfaceLoaderConfig.viewToken);


        viewer.setBorderLineEnabled(false);
        window.viewer = viewer;
        viewer.setBackgroundColor = webUtils.fromColor(53, 53, 66, 1);
        webUtils.viewer = window.viewer;
        viewer.addEventListener(Glodon.Bimface.Viewer.Viewer3DEvent.ViewAdded, function () {

            let modelHelper = new ModelHelper(viewer);
            //helper.createAixsHelper(viewer);
            let scene = modelHelper.getScene(), camera = modelHelper.getPerspectiveCamera(), renderer = modelHelper.getRender();
            renderer.domElement.addClass('canvasClass');
            window.myscene = scene;
            renderer.shadowMap.enabled = true;
            viewer.enableShadow(true);
            viewer.setExposureShift(0.0);//曝光会影响色值
            renderer.alpha = true;
            renderer.setClearAlpha(0.08);

            // 创建标签容器
            var drawableConfig = new Glodon.Bimface.Plugins.Drawable.DrawableContainerConfig();
            drawableConfig.viewer = viewer;
            drawableContainer = new Glodon.Bimface.Plugins.Drawable.DrawableContainer(drawableConfig);
            webUtils.initModel();


            viewer.overrideComponentsColorByObjectData([{ "categoryId": "-2000011" }, { "categoryId": "-2000023" }, { "categoryId": "-2000032" }], webUtils.fromColor(0, 105, 185, 0.2));

            //TODO:筛选构件
            let showCondition = [];
            viewer.hideAllComponents();
            showCondition.push({ "categoryId": "-2000011", "levelName": "暖通水管平面视图" });
            showCondition.push({ "categoryId": "-2000014", "levelName": "暖通水管平面视图" });
            showCondition.push({ "categoryId": "-2000023", "levelName": "暖通水管平面视图" });
            showCondition.push({ "categoryId": "-2000120", "levelName": "暖通水管平面视图" });
            showCondition.push({ "categoryId": "-2000032", "levelName": "暖通水管平面视图" });
            showCondition.push({ "categoryId": "-2001350", "levelName": "暖通水管平面视图" });
            viewer.showComponentsByObjectData(showCondition);

            viewer.overrideComponentsColorByObjectData([{ "family": "ELES-自动扶梯", }], webUtils.fromColor(61, 136, 80, 1));
            viewer.render();

            //相机视角
            setCamera(viewer);

            //TODO:声明下方单击事件中需要的变量
            viewer.addEventListener(Glodon.Bimface.Viewer.Viewer3DEvent.MouseClicked, function (e) {
                if (!e.objectId) return;
                if (window.bim.queryCondition) {
                    let condition = viewer.getObjectDataById(e.objectId);
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
            "x": -241838.39314756144,
            "y": -155283.72764989338,
            "z": 270539.42681082746
        },
        "target": {
            "x": 23666.9982062731,
            "y": 110222.64164917698,
            "z": 5034.999618523104
        },
        "up": {
            "x": 0,
            "y": -0.0000036732050033678383,
            "z": 0.9999999999932537
        },
        "fov": 45,
        "zoom": 1,
        "version": 1,
        "coordinateSystem": "world"
    };

    let target = {
        "name": "persp",
        "position": {
            "x": -31940.964207053956,
            "y": -31646.375712010275,
            "z": 82864.99232931783
        },
        "target": {
            "x": 247547.58750068722,
            "y": 240620.2560410177,
            "z": -160520.2836373493
        },
        "up": {
            "x": 0.37910384121624086,
            "y": 0.3693035558346805,
            "z": 0.8484663583330528
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

    document.getElementById('single').addEventListener('click', function () {
        viewer.hideAllComponents();
        let showCondition = [];
        showCondition.push({ "categoryId": "-2000011", "levelName": "暖通水管平面视图" });
        showCondition.push({ "categoryId": "-2000014", "levelName": "暖通水管平面视图" });
        showCondition.push({ "categoryId": "-2001330", "levelName": "暖通水管平面视图" });
        showCondition.push({ "categoryId": "-2000032", "levelName": "暖通水管平面视图" });
        showCondition.push({ "categoryId": "-2001140", "levelName": "暖通水管平面视图" });
        viewer.showComponentsByObjectData(showCondition);

        let hideCondition = [];
        hideCondition.push({ "family": "FSHB-薄型普通消火栓箱 - 暗装1", "levelName": "暖通水管平面视图" });
        hideCondition.push({ "family": "FEFE-超细干粉灭火器-吸顶", "levelName": "暖通水管平面视图" });
        viewer.hideComponentsByObjectData(hideCondition);

        //设备绿色
        viewer.overrideComponentsColorByObjectData([{ "categoryId": "-2001140", "levelName": "暖通水管平面视图" }], webUtils.fromColor(17, 177, 79, 1));

        viewer.overrideComponentsColorByObjectData([{ "categoryId": "-2000011" }, { "categoryId": "-2001330" }, { "categoryId": "-2000032" }], new Glodon.Web.Graphics.Color(167, 167, 167, 1));
        viewer.overrideComponentsColorById(["1573864"], webUtils.fromColor(255, 144, 0, 1));//处理中，金黄色
        viewer.overrideComponentsColorById(["1573837"], webUtils.fromColor(157, 14, 70, 1));//报警中，红色

        viewer.setCameraStatus({
            "name": "persp",
            "position": {
                "x": 2517.1597600872624,
                "y": 56609.14966976671,
                "z": 22742.813252981396
            },
            "target": {
                "x": 282005.70087658026,
                "y": 328875.7711088854,
                "z": -220642.4534938701
            },
            "up": {
                "x": 0.3791038412177533,
                "y": 0.36930355583848296,
                "z": 0.8484663583307218
            },
            "fov": 45,
            "zoom": 1,
            "version": 1,
            "coordinateSystem": "world"
        });
        viewer.render();
    });
}