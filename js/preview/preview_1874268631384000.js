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

webUtils.getViewtoken(1874268631384000, INTEGRATE_FILE).then((token) => {
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

            //相机视角
            setCamera(viewer);

            viewer.hideAllComponents();
            viewer.showComponentsByObjectData([
                { "familyType": "内墙 - A3.5蒸压加气砼砌块 - 砌筑砂浆M5.0 - 200" },
                { "familyType": "内墙 - A5.0蒸压加气砼砌块 - 砌筑砂浆M7.5 - 200" },
                { "familyType": "内墙 - A5.0蒸压加气砼砌块 - 砌筑砂浆M5.0 - 200" },
                { "familyType": "内墙 - A7.5蒸压加气砼砌块 - 砌筑砂浆M5.0 - 200" },
                { "familyType": "内墙 - A3.5蒸压加气砼砌块 - 砌筑砂浆M5.0 - 100" },
                { "familyType": "内墙 - A3.5蒸压加气砼砌块 - 砌筑砂浆M5.0 - 150" },
                { "familyType": "内墙 - A5.0蒸压加气砼砌块 - 砌筑砂浆M7.5 - 100" },
                { "familyType": "内墙 - A5.0蒸压加气砼砌块 - 砌筑砂浆M5.0 - 100" },
                { "familyType": "内墙 - A7.5蒸压加气砼砌块 - 砌筑砂浆M5.0 - 100" },
                { "familyType": "外墙 - A5.0蒸压加气砼砌块 - 砌筑砂浆M5.0 - 200" },
                { "categoryId": "-2000023" }, //门
                { "categoryId": "-2000032", "specialty": "建筑" }, //楼板
                { "categoryId": "-2001330" }, //结构柱
                { "categoryId": "-2000011", "specialty": "结构" }, //墙
                { "familyType": "隔断 - 非隔热型钢化安全C类防火玻璃 - 15" }]);
            viewer.hideComponentsByObjectData([
                { "familyType": "顶棚3 - 水泥砂浆乳胶漆顶棚 - 16" },
                { "familyType": "顶棚7 - 板底刮腻子（防水耐擦洗涂料）顶棚 - 2" },
                { "familyType": "顶棚2 - 水泥砂浆顶棚 - 9" }
            ]);
            viewer.overrideComponentsColorByObjectData([{ "familyType": "楼面层 - 600x600大花白色人造岗石 - 50" }], new Glodon.Web.Graphics.Color("#75b58a", 1));
            viewer.render();
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