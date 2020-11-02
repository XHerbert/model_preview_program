/**
 * @author:xuhongbo
 * @function:
 */
import { WebUtils } from '../package/WebUtils.js'
import { ModelHelper } from '../package/ModelHelper.js'

var app, viewer, drawableContainer;
const INTEGRATE_FILE = 1;
var BimfaceLoaderConfig = new BimfaceSDKLoaderConfig();
var webUtils = new WebUtils();
var hidetoken;

webUtils.getViewtoken(1874292731699104, INTEGRATE_FILE).then((token) => {
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

            viewer.hideAllComponents();
            viewer.showComponentsByObjectData([
                { "specialty": "给排水" },
                { "specialty": "消防" },
                { "familyType": "内墙 - A5.0蒸压加气砼砌块 - 砌筑砂浆M7.5 - 200" },
                { "familyType": "内墙 - A3.5蒸压加气砼砌块 - 砌筑砂浆M5.0 - 200" },
                { "familyType": "内墙 - A5.0蒸压加气砼砌块 - 砌筑砂浆M5.0 - 200" },
                { "familyType": "内墙 - A5.0蒸压加气砼砌块 - 砌筑砂浆M7.5 - 150" },
                { "familyType": "内墙 - A3.5蒸压加气砼砌块 - 砌筑砂浆M5.0 - 100" },
                { "familyType": "内墙 - A5.0蒸压加气砼砌块 - 砌筑砂浆M5.0 - 100" },
                { "familyType": "内墙 - A3.5蒸压加气砼砌块 - 砌筑砂浆M5.0 - 150" },
                { "familyType": "内墙 - A5.0蒸压加气砼砌块 - 砌筑砂浆M7.5 - 300" },
                { "familyType": "内墙 - A5.0蒸压加气砼砌块 - 砌筑砂浆M7.5 - 100" },

                { "categoryId": "-2000011" },
                { "categoryId": "-2001300", "specialty": "结构" },
                { "categoryId": "-2001330", "specialty": "结构" }]);
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
            "x": -84928.08410091746,
            "y": -130665.68926097942,
            "z": 178828.64298811715
        },
        "target": {
            "x": 106151.25313908292,
            "y": 60414.3517881892,
            "z": -12250.000362593975
        },
        "up": {
            "x": 0,
            "y": -0.0000036732050583096847,
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
            "x": 17857.608492542407,
            "y": 34152.48543945853,
            "z": 20500.1346084025
        },
        "target": {
            "x": -33481.4882222341,
            "y": -113895.96795771242,
            "z": -271012.9795869153
        },
        "up": {
            "x": -0.288580379349776,
            "y": -0.8321976791788621,
            "z": 0.47346424091335054
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
    //TODO:bind dom event
}