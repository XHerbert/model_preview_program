/**
 * @author:xuhongbo
 * @function:wanda leng-ji white
 */
import { WebUtils } from '../package/WebUtils.js'
import { ModelHelper } from '../package/ModelHelper.js'

var app, viewer, drawableContainer;
const INTEGRATE_FILE = 1;
var BimfaceLoaderConfig = new BimfaceSDKLoaderConfig();
var webUtils = new WebUtils();

webUtils.getViewtoken(1934572097954496, INTEGRATE_FILE).then((token) => {
    BimfaceLoaderConfig.viewToken = token;
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
        viewer.setBackgroundColor(new Glodon.Web.Graphics.Color(Math.floor(Math.random() * 256), Math.floor(Math.random() * 256), Math.floor(Math.random() * 256), 1), new Glodon.Web.Graphics.Color(Math.floor(Math.random() * 256), Math.floor(Math.random() * 256), Math.floor(Math.random() * 256), 0.5));
        viewer.setBorderLineEnabled(false);

        window.viewer = viewer;
        webUtils.viewer = window.viewer;
        viewer.addEventListener(Glodon.Bimface.Viewer.Viewer3DEvent.ViewAdded, function () {
            let modelHelper = new ModelHelper(viewer);
            //helper.createAixsHelper(viewer);
            let scene = modelHelper.getScene(), camera = modelHelper.getPerspectiveCamera(), renderer = modelHelper.getRender();
            renderer.domElement.addClass('canvasClass');
            window.myscene = scene;
            renderer.shadowMap.enabled = true;
            viewer.enableShadow(true);
            viewer.enableGlowEffect(true);
            viewer.setExposureShift(0.0);//曝光会影响色值
            renderer.alpha = true;
            renderer.setClearAlpha(0.08);
            viewer.setBackgroundColor(new Glodon.Web.Graphics.Color(234, 234, 234, 1));

            // 创建标签容器
            var drawableConfig = new Glodon.Bimface.Plugins.Drawable.DrawableContainerConfig();
            drawableConfig.viewer = viewer;
            drawableContainer = new Glodon.Bimface.Plugins.Drawable.DrawableContainer(drawableConfig);

            // 轮廓线不明显
            viewer.overrideComponentsFrameColorByObjectData([], new Glodon.Web.Graphics.Color(255, 255, 255, 1));//214

            // 建筑
            viewer.overrideComponentsColorByObjectData([{ "specialty": "建筑" }], new Glodon.Web.Graphics.Color(167, 167, 167, 1));

            // 机械设备
            viewer.overrideComponentsColorByObjectData([{ "specialty": "暖通空调" }], new Glodon.Web.Graphics.Color(248, 226, 31, 1));

            // 机械设备 - 管道
            viewer.overrideComponentsColorByObjectData([{ "categoryId": "-2008000" }, { "categoryId": "-2008010" }, { "categoryId": "-2008049" }, { "categoryId": "-2008044" }], new Glodon.Web.Graphics.Color(13, 173, 247, 1));

            //手动调整设备颜色
            viewer.overrideComponentsColorById(["1771855777580864.4711684"], new Glodon.Web.Graphics.Color(157, 14, 70, 1));
            viewer.overrideComponentsColorById(["1771855777580864.4711685"], new Glodon.Web.Graphics.Color(113, 162, 160, 1));

            // 测试发光效果
            viewer.setGlowEffectById(["1771855777580864.4711685"], {
                type: "outline",
                color: new Glodon.Web.Graphics.Color(255, 0, 0, 1),
                intensity: 1,
                spread: 5
            });

            //基础设置
            webUtils.initModel();

            //绿色设备
            document.getElementById('green').addEventListener('click', function () {
                greenEquipment();
            });

            //绿色设备
            document.getElementById('alert').addEventListener('click', function () {
                alertEquipment();
            })

            //相机视角
            setCamera(viewer);

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

function greenEquipment() {
    viewer.overrideComponentsColorByObjectData([{ "specialty": "暖通空调" }], new Glodon.Web.Graphics.Color(17, 177, 79, 1));
    viewer.overrideComponentsColorByObjectData([{ "categoryId": "-2008000" }, { "categoryId": "-2008010" }, { "categoryId": "-2008049" }, { "categoryId": "-2008044" }], new Glodon.Web.Graphics.Color(100, 99, 99, 1));
    viewer.overrideComponentsColorById(["1771855777580864.4711684"], new Glodon.Web.Graphics.Color(157, 14, 70, 1));
    viewer.overrideComponentsColorById(["1771855777580864.4711685"], new Glodon.Web.Graphics.Color(113, 162, 160, 1));
    viewer.render();
}

function alertEquipment() {
    viewer.overrideComponentsColorByObjectData([{ "specialty": "暖通空调" }], new Glodon.Web.Graphics.Color(17, 177, 79, 1));
    viewer.overrideComponentsColorByObjectData([{ "categoryId": "-2008000" }, { "categoryId": "-2008010" }, { "categoryId": "-2008049" }, { "categoryId": "-2008044" }], new Glodon.Web.Graphics.Color(126, 126, 126, 1));
    viewer.overrideComponentsColorById(["1771855777580864.4711684"], new Glodon.Web.Graphics.Color(157, 14, 70, 1));
    viewer.overrideComponentsColorById(["1771855777580864.4711685"], new Glodon.Web.Graphics.Color(113, 162, 160, 1));
    viewer.overrideComponentsColorById(["1771855777580864.5230327"], new Glodon.Web.Graphics.Color(255, 144, 0, 1));

    viewer.setCameraStatus({
        "name": "persp",
        "position": {
            "x": 109754.86536560098,
            "y": 23806.635608656772,
            "z": 92774.81697736064
        },
        "target": {
            "x": 116587.21945313984,
            "y": 197703.0533825992,
            "z": -119913.43562272112
        },
        "up": {
            "x": 0.030384500288325227,
            "y": 0.7733375726196868,
            "z": 0.6332659638074032
        },
        "fov": 45,
        "zoom": 1,
        "version": 1,
        "coordinateSystem": "world"
    });
    viewer.render();
}


function onSDKLoadFailed(error) {
    console.log("Failed to load SDK!");
};


function setCamera(viewer, callback) {
    let start = {
        "name": "persp",
        "position": {
            "x": -52217.15707794107,
            "y": -101089.74056823357,
            "z": 181791.32205288325
        },
        "target": {
            "x": 106446.99686331685,
            "y": 57574.99830420925,
            "z": 23127.7493188045
        },
        "up": {
            "x": 0,
            "y": -0.0000036732052505499887,
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
            "x": 139650.31545150344,
            "y": 84972.2318423684,
            "z": 35206.00766749013
        },
        "target": {
            "x": 279716.0357645569,
            "y": 260273.1944776336,
            "z": -123457.50077886833
        },
        "up": {
            "x": 0.36039387269749806,
            "y": 0.45105085349482577,
            "z": 0.8164982449973109
        },
        "fov": 45,
        "zoom": 1,
        "version": 1,
        "coordinateSystem": "world"
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