/**
 * @author:xuhongbo
 * @function:
 */
import { WebUtils } from '../package/WebUtils.js'
import { ModelHelper } from '../package/ModelHelper.js'

var app, viewer, drawableContainer, markerContainer;
const SINGLE_FILE = 0;
var BimfaceLoaderConfig = new BimfaceSDKLoaderConfig();
var webUtils = new WebUtils();
var hidetoken;

webUtils.getViewtoken(1855358567983040, SINGLE_FILE).then((token) => {
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

        var markerConfig = new Glodon.Bimface.Plugins.Marker3D.Marker3DContainerConfig();
        markerConfig.viewer = viewer;
        markerContainer = new Glodon.Bimface.Plugins.Marker3D.Marker3DContainer(markerConfig);

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

            viewer.overrideComponentsColorById(["ndae382c29-e035-4863-95bc-3be2b7c076f9"], webUtils.fromColor(66, 127, 207, 1));
            // viewer.overrideComponentsColorByObjectData([], webUtils.fromColor(66, 127, 207, 1));

            let src = 'http://static.bimface.com/resources/3DMarker/warner/warner_red.png';
            modelHelper.createMarker3DTag(markerContainer, src, { x: -315.96857436971857, y: 3709.8612403320276, z: 3112.4534935833517 }, "tooltip", _callback);
            modelHelper.createMarker3DTag(markerContainer, src, { x: -7428.354511888227, y: -4800.371397419461, z: 3133.4847305788976 }, "tooltip", _callback);

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
            "x": -18981.009240578405,
            "y": -18981.084153757038,
            "z": 22177.76213434364
        },
        "target": {
            "x": 0.004999999807598234,
            "y": -4.93938343351652e-10,
            "z": 3196.8168220570915
        },
        "up": {
            "x": 0,
            "y": -0.0000036732052246670526,
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
            "x": -12732.859273076621,
            "y": -14586.698301014387,
            "z": 8807.366745139745
        },
        "target": {
            "x": 7862.1868932281695,
            "y": 7547.187438696478,
            "z": -4106.65345266749
        },
        "up": {
            "x": 0.26758324490105967,
            "y": 0.2875727812667397,
            "z": 0.9196200859717731
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
    document.getElementById('cure').addEventListener('click', function () {
        viewer.overrideComponentsColorByObjectData([], webUtils.fromColor(66, 127, 207, 1));
        viewer.render();
    });

    document.getElementById('border').addEventListener('click', function () {
        viewer.restoreAllDefault();
        viewer.overrideComponentsColorById(["ndae382c29-e035-4863-95bc-3be2b7c076f9"], webUtils.fromColor(66, 127, 207, 1));
        viewer.render();
    });

}

function _callback() {

    alert(1);
}