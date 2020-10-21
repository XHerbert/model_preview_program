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

webUtils.getViewtoken(1952981815526144, INTEGRATE_FILE).then((token) => {
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
            let showCondition = [];
            showCondition.push({ "specialty": "建筑", "familyType": "外墙 - 玻璃幕墙 - 300", "levelName": "F01" });

            showCondition.push({ "specialty": "建筑", "familyType": "内墙 - A5.0蒸压加气砼砌块 - 砌筑砂浆M5.0 - 200", "levelName": "F02" });
            showCondition.push({ "specialty": "建筑", "familyType": "幕墙- 玻璃 -300", "levelName": "F02" });
            showCondition.push({ "specialty": "建筑", "familyType": "幕墙- 防火玻璃 -200", "levelName": "F02" });
            showCondition.push({ "specialty": "建筑", "family": "楼板", "levelName": "F02" });
            showCondition.push({ "specialty": "建筑", "familyType": "幕墙- 玻璃 -270", "levelName": "F02" });
            showCondition.push({ "specialty": "建筑", "familyType": "外墙 - A5.0蒸压加气砼砌块 - 砌筑砂浆M5.0 - 200", "levelName": "F02" });
            showCondition.push({ "specialty": "建筑", "categoryId": "-2001320", "levelName": "F02" });//结构框架

            showCondition.push({ "specialty": "建筑", "familyType": "内墙 - A5.0蒸压加气砼砌块 - 砌筑砂浆M5.0 - 200", "levelName": "F03" });
            showCondition.push({ "specialty": "建筑", "familyType": "内墙 - A5.0蒸压加气砼砌块 - 砌筑砂浆M5.0 - 300-玻璃", "levelName": "F03" });
            showCondition.push({ "specialty": "建筑", "categoryId": "-2001320", "levelName": "F03" });//结构框架

            showCondition.push({ "specialty": "结构", "familyType": "剪力墙 - 400", "levelName": "F04" });
            showCondition.push({ "specialty": "结构", "familyType": "剪力墙 - 300", "levelName": "F04" });
            showCondition.push({ "specialty": "结构", "family": "楼板", "levelName": "F04" });
            showCondition.push({ "specialty": "建筑", "family": "防火卷帘 - 侧装", "levelName": "F04" });
            showCondition.push({ "specialty": "结构", "categoryId": "-2001320", "levelName": "F04" });//结构框架
            showCondition.push({ "specialty": "建筑", "categoryId": "-2000011", "levelName": "F04" });//墙

            showCondition.push({ "specialty": "结构", "familyType": "剪力墙 - 400", "levelName": "F05" });
            showCondition.push({ "specialty": "建筑", "family": "楼板", "levelName": "F05" });
            showCondition.push({ "specialty": "结构", "categoryId": "-2001320", "levelName": "F05" });//结构框架
            showCondition.push({ "specialty": "建筑", "categoryId": "-2000011", "levelName": "F05" });//墙

            showCondition.push({ "specialty": "结构", "categoryId": "-2000032", "levelName": "F06" });//楼板
            showCondition.push({ "specialty": "建筑", "family": "楼板", "levelName": "F06" });//楼板
            showCondition.push({ "specialty": "建筑", "categoryId": "-2000011", "levelName": "F06" });//墙
            showCondition.push({ "specialty": "结构", "categoryId": "-2001320", "levelName": "F06" });//结构框架

            viewer.showComponentsByObjectData(showCondition);

            viewer.overrideComponentsColorByObjectData([], webUtils.fromColor(66, 127, 207, 1));
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
        //TODO:设置模型起始视角    
    };

    let target = {
        //TODO:设置模型最终视角
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