/**
 * @author:xuhongbo
 * @function:
 */
import { WebUtils } from '../package/WebUtils.js'
import { ModelHelper } from '../package/ModelHelper.js'
import { Constant } from '../package/Constants.js';

var app, viewer, drawableContainer, lightMng, directionalLight;;
const INTEGRATE_FILE = 1;
var BimfaceLoaderConfig = new BimfaceSDKLoaderConfig();
var webUtils = new WebUtils();
var currentState;

//2012994865071552
//2003993013200896 外立面
webUtils.getViewtoken(2014681931556192, 1).then((token) => {
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


        viewer.setBorderLineEnabled(false);
        window.viewer = viewer;
        viewer.setBackgroundColor = webUtils.fromColor(53, 53, 66, 1);
        webUtils.viewer = window.viewer;
        CLOUD.GlobalData.Renderer = 1;//全量加载
        viewer.addEventListener(Glodon.Bimface.Viewer.Viewer3DEvent.ViewAdded, function () {

            let modelHelper = new ModelHelper(viewer);
            //helper.createAixsHelper(viewer);
            let scene = modelHelper.getScene(), camera = modelHelper.getPerspectiveCamera(), renderer = modelHelper.getRender();
            renderer.domElement.addClass('canvasClass');
            window.myscene = scene;
            renderer.shadowMap.enabled = true;
            // viewer.enableShadow(true);
            lightMng = viewer.getLightManager();
            directionalLight = lightMng.getAllDirectionalLights()[0];
            directionalLight.enableShadow(true);
            viewer.setExposureShift(0.0);//曝光会影响色值
            renderer.alpha = true;
            renderer.setClearAlpha(0.08);

            // 创建标签容器
            var drawableConfig = new Glodon.Bimface.Plugins.Drawable.DrawableContainerConfig();
            drawableConfig.viewer = viewer;
            drawableContainer = new Glodon.Bimface.Plugins.Drawable.DrawableContainer(drawableConfig);
            webUtils.initModel();


            viewer.hideAllComponents();
            viewer.showComponentsByObjectData([{ "levelName": "F01", "categoryId": "-2000011" }]);

            modelHelper.createCustomTag(drawableContainer, { x: 93.95161259384439, y: 54.528018645199566, z: 3.3191588220577284 }, "<p style='background-color:red'>1223434534535434</p>");

            //记录：官网说只能按照专业和楼层加载，实际验证是可以通过更新的粒度进行加载的
            // viewer.showExclusiveComponentsByObjectData([
            // { "specialty": "幕墙" },
            //// { "levelName": "B01", "categoryId": "-2000011" },
            //// { "levelName": "B02", "categoryId": "-2000011" },
            //// { "levelName": "F01", "categoryId": "-2000011" },

            // { "levelName": "B01", "categoryId": "-2001140" },

            // { "levelName": "F01-wanda", "categoryId": "-2008044" },

            // { "levelName": "B02", "familyType": "常规 - 550mm" },
            // { "levelName": "B02", "familyType": "常规 - 475mm" },
            // { "levelName": "B02", "familyType": "常规 - 450mm" },
            // { "levelName": "B02", "categoryId": "-2001140" },//机械设备
            // { "levelName": "B02", "family": "楼板" },

            // { "levelName": "B01", "familyType": "常规 - 350mm" },
            // { "levelName": "B01", "categoryId": "-2001140" },//机械设备

            // { "levelName": "F01", "categoryId": "-2001140" },//机械设备
            // { "levelName": "F01", "familyType": "常规 - 350mm" },
            // { "levelName": "F01", "familyType": "幕墙 -100" },

            // { "levelName": "B02", "categoryId": Constant.category.dust },
            // { "levelName": "B01", "categoryId": Constant.category.dust },
            // { "levelName": "F02", "categoryId": Constant.category.dust },

            // { "levelName": "B02", "categoryId": Constant.category.dust_pipe },
            // { "levelName": "B01", "categoryId": Constant.category.dust_pipe },
            // { "levelName": "F02", "categoryId": Constant.category.dust_pipe },

            // { "levelName": "B02", "categoryId": Constant.category.dust_tail },
            // { "levelName": "B01", "categoryId": Constant.category.dust_tail },
            // { "levelName": "F02", "categoryId": Constant.category.dust_tail },

            // { "levelName": "B02", "categoryId": Constant.category.terminal },
            // { "levelName": "B01", "categoryId": Constant.category.terminal },
            // { "levelName": "F02", "categoryId": Constant.category.terminal },


            // ], null, () => {

            // viewer.transparentComponentsByObjectData([{ "specialty": "幕墙" }]);
            // viewer.setCameraStatus({
            //     "name": "persp",
            //     "position": {
            //         "x": 310306.3162180794,
            //         "y": 291693.30676286115,
            //         "z": 60996.95020649015
            //     },
            //     "target": {
            //         "x": 66442.58024564426,
            //         "y": -86527.22360390393,
            //         "z": -59921.76883971862
            //     },
            //     "up": {
            //         "x": -0.14061433399554304,
            //         "y": -0.21808964462018446,
            //         "z": 0.9657455751824243
            //     },
            //     "fov": 45,
            //     "zoom": 1,
            //     "version": 1,
            //     "coordinateSystem": "world"
            // }, () => {
            //     currentState = viewer.getCurrentState();
            //     window._currentState = currentState;
            // })
            viewer.render();

        });

        //外立面加载
        //viewer.overrideComponentsColorByObjectData([], new Glodon.Web.Graphics.Color('#6fa2bf'));
        //viewer.restoreComponentsColorById(["2149564"]);


        //相机视角
        setCamera(viewer, () => {


            //viewer.addView('69ceec4f8a5e4774a49efbd146d0d283');
        });

        //TODO:声明下方单击事件中需要的变量
        viewer.addEventListener(Glodon.Bimface.Viewer.Viewer3DEvent.MouseClicked, function (e) {
            if (!e.objectId) return;
            if (window.bim.queryCondition) {
                let condition = viewer.getObjectDataById(e.objectId);
                webUtils.layerPanel("#json-renderer", "auto", "auto", "筛选条件", 'layui-layer-molv', condition);
                return;
            }

            if (window.bim.component) {
                webUtils.layerPanel("#json-renderer", "auto", undefined, "构件信息", 'layui-layer-lan', e);
                return;
            }

            if (window.bim.recordObjectId) {
                webUtils.copyStringValue(e.objectId);
                return;
            }

            if (window.bim.recordArea) {
                let id = e.objectId;
                modelHelper.copyBoundaryData(id);
                return;
            }
            //TODO:Click logic

        });
        // });
    }
};

function onSDKLoadFailed(error) {
    console.log("Failed to load SDK!");
};


function setCamera(viewer, callback) {
    let start = {
        "name": "persp",
        "position": {
            "x": -58452.34349610743,
            "y": -134204.5367819747,
            "z": 235932.85501696888
        },
        "target": {
            "x": 154287.8541937896,
            "y": 78536.4445014704,
            "z": 23193.42987621797
        },
        "up": {
            "x": 0,
            "y": -0.0000036732055517689816,
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
            "x": 315374.8289995544,
            "y": -112847.18190688083,
            "z": 66259.87406961783
        },
        "target": {
            "x": 112042.23603395143,
            "y": 176869.1179280242,
            "z": -36187.730074447805
        },
        "up": {
            "x": -0.15972142351100194,
            "y": 0.2275735611762725,
            "z": 0.9605724028542402
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