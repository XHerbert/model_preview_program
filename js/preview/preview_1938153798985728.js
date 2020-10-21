/**
 * @author:xuhongbo
 * @function:wanda water system white
 */
import { WebUtils } from '../package/WebUtils.js'
import { ModelHelper } from '../package/ModelHelper.js'

var app, viewer, drawableContainer;
const SINGLE_FILE = 0;
var BimfaceLoaderConfig = new BimfaceSDKLoaderConfig();
var webUtils = new WebUtils();
var hidetoken;

webUtils.getViewtoken(1938153798985728, SINGLE_FILE).then((token) => {
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

            viewer.isolateComponentsByObjectData([{ "family": "基本墙", "levelName": "F3-saga" }, { "family": "楼板", "levelName": "F3-saga" }], Glodon.Bimface.Viewer.IsolateOption.HideOthers);
            viewer.overrideComponentsColorByObjectData([{ "family": "基本墙", "levelName": "F3-saga" }, { "family": "楼板", "levelName": "F3-saga" }], webUtils.fromColor(167, 167, 167, 1));

            webUtils.getFile('../../data/1938153798985728/space.json', function (data) {
                viewer.createRoom(data, 3300, webUtils.guid(), webUtils.fromHexColor("#708090", 0.45), webUtils.fromHexColor("#778899", 1));
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


            createTag({ x: 106848.99342876796, y: 159958.46350893454, z: 15849.999883117878 }, "bigcircle2", "");
            createTag({ x: 147259.284137998, y: 104541.69746192008, z: 15850.064883335008 }, "bigcircle2", "");
            createTag({ x: 99081.2708190525, y: 13990.056421873413, z: 15850.01312551748 }, "bigcircle2", "");
            createTag({ x: 21580.898206160877, y: 162879.80076748898, z: 14100.00064065045 }, "bigcircle2", "");

            //相机视角
            setCamera(viewer, () => {
                webUtils.initModel();
                bindEvent();
            });
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

function bindEvent() {

    //消防单层
    document.getElementById('fire').addEventListener('click', function () {

        viewer.restoreAllDefault();
        viewer.hideAllComponents();

        let show = [], area = [], components = [];
        show.push({ "levelName": "F3-saga", "categoryId": -2000011 }, { "levelName": "F3-saga", "categoryId": -2000032 }, { "levelName": "F3-saga", "categoryId": -2001330 });

        area.push({ "levelName": "F3-saga", "family": "商铺 2644" });
        components.push("1938153798985728.2785537", "1938153798985728.2258720");
        viewer.showComponentsByObjectData(show.concat(area));
        viewer.showComponentsById(components);

        viewer.overrideComponentsColorByObjectData([], webUtils.fromColor(167, 167, 167, 1));
        // viewer.overrideComponentsColorByObjectData(area, webUtils.fromColor(34, 139, 34, 0.65));

        viewer.render();

    });

}


function setCamera(viewer, callback) {
    let start = {
        "name": "persp",
        "position": {
            "x": -151298.6600262401,
            "y": 68182.85351010374,
            "z": 201429.4126784796
        },
        "target": {
            "x": 77029.96889687181,
            "y": 94450.61004729974,
            "z": 18126.43261369797
        },
        "up": {
            "x": 0.6194378916581947,
            "y": 0.07125769130720014,
            "z": 0.7818049883491526
        },
        "fov": 45,
        "zoom": 1,
        "version": 1,
        "coordinateSystem": "world"
    };

    let target = {
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