/**
 * @author:xuhongbo
 * @function:wanda
 */
import { WebUtils } from '../package/WebUtils.js'
import { ModelHelper } from '../package/ModelHelper.js'

var app, viewer, drawableContainer;
const INTEGRATE_FILE = 1;
var BimfaceLoaderConfig = new BimfaceSDKLoaderConfig();
var webUtils = new WebUtils();
var hidetoken;
//
webUtils.getViewtoken(1938169418687136, INTEGRATE_FILE).then((token) => {
    BimfaceLoaderConfig.viewToken = token;
    hidetoken = token;
    BimfaceSDKLoader.load(BimfaceLoaderConfig, onSDKLoadSucceeded, onSDKLoadFailed);
});

function onSDKLoadSucceeded(viewMetaData) {
    if (viewMetaData.viewType == "3DView") {
        var view = document.getElementById('view');
        var config = new Glodon.Bimface.Application.WebApplication3DConfig();
        config.enableExplosion = true;
        config.domElement = view;
        app = new Glodon.Bimface.Application.WebApplication3D(config);
        viewer = app.getViewer();
        viewer.setCameraAnimation(true);
        app.addView(BimfaceLoaderConfig.viewToken);

        viewer.setBorderLineEnabled(true);
        window.viewer = viewer;
        viewer.setBackgroundColor = webUtils.fromColor(53, 53, 66, 1);
        webUtils.viewer = window.viewer;
        viewer.addEventListener(Glodon.Bimface.Viewer.Viewer3DEvent.ViewAdded, function () {

            let modelHelper = new ModelHelper(viewer);
            let scene = modelHelper.getScene(), camera = modelHelper.getPerspectiveCamera(), renderer = modelHelper.getRender();
            renderer.domElement.addClass('canvasClass');
            window.myscene = scene;
            renderer.shadowMap.enabled = true;
            viewer.enableShadow(false);
            viewer.setExposureShift(0.0);//曝光会影响色值
            renderer.alpha = true;
            renderer.setClearAlpha(0.08);

            // 创建标签容器
            var drawableConfig = new Glodon.Bimface.Plugins.Drawable.DrawableContainerConfig();
            drawableConfig.viewer = viewer;
            drawableContainer = new Glodon.Bimface.Plugins.Drawable.DrawableContainer(drawableConfig);
            webUtils.initModel();
            //暖通筛选条件，特别多的那个Excel文件
            //buildCondition(viewer);

            //楼层炸开
            //floorExplosive(viewer);
            //相机视角
            setCamera(viewer, floorExplosive);
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
        "name": "persp",
        "position": {
            "x": -252038.4862944593,
            "y": -165483.85836714864,
            "z": 283364.4827180268
        },
        "target": {
            "x": 23666.9982062731,
            "y": 110222.64164917718,
            "z": 7659.99941964464
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
            "x": -137822.99232434228,
            "y": -98499.27984101845,
            "z": 178256.635617329
        },
        "target": {
            "x": 172703.70907606668,
            "y": 212028.13458493465,
            "z": -9323.86190933627
        },
        "up": {
            "x": 0.2777597223080557,
            "y": 0.27775636583090557,
            "z": 0.9196199964679759
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

function buildCondition(viewer) {
    viewer.hideAllComponents();
    let showCondition = [];
    let hideCondition = [];
    /** B01 begin **/
    showCondition.push({ "categoryId": "-2001320", "levelName": "B01" });//结构框架 - 排除{"family": "砼梁梯"}
    showCondition.push({ "categoryId": "-2001140", "levelName": "B01" });//机械设备 - 排除{"family": "FSHB-消火栓连体箱"}
    showCondition.push({ "familyType": "地下室外墙 - 300", "levelName": "B01" }, { "familyType": "地下室外墙 - 350", "levelName": "B01" }, { "familyType": "外墙 - A5.0蒸压加气砼砌块 - 砌筑砂浆M5.0 - 200", "levelName": "B01" });//B01墙
    showCondition.push({ "familyType": "砼板 - 200", "levelName": "B01" }, { "familyType": "砼板 - 350", "levelName": "B01" }, { "familyType": "砼板 - 550", "levelName": "B01" }, { "familyType": "砼板 - 250", "levelName": "B01" }, { "familyType": "砼板 - 180", "levelName": "B01" }, { "familyType": "砼板 - 300", "levelName": "B01" }, { "familyType": "砼板 - 500", "levelName": "B01" }, { "familyType": "砼板 - 120", "levelName": "B01" }, { "familyType": "砼板 - 150", "levelName": "B01" });//B01楼板
    viewer.showComponentsByObjectData(showCondition);

    hideCondition.push({ "familyType": "消火栓连体箱", "levelName": "B01" });
    hideCondition.push({ "family": "砼梁梯", "levelName": "B01" });
    viewer.hideComponentsByObjectData(hideCondition);
    /** B01 end **/

    /** F01 begin **/
    showCondition.length = hideCondition.length = 0;
    showCondition.push({ "family": "砼矩形梁", "levelName": "F01" }, { "family": "砼变截面矩形梁", "levelName": "F01" });//结构框架
    showCondition.push({ "categoryId": "-2001140", "levelName": "F01" });//机械设备
    showCondition.push({ "familyType": "外墙 - 玻璃幕墙 - 300", "levelName": "F01" });//墙
    showCondition.push({ "familyType": "砼板 - 130", "levelName": "F01" }, { "familyType": "砼板 - 170", "levelName": "F01" }, { "familyType": "砼板 - 200", "levelName": "F01" }, { "familyType": "砼板 - 100", "levelName": "F01" }, { "familyType": "砼板 - 140", "levelName": "F01" }, { "familyType": "砼板 - 120", "levelName": "F01" }, { "familyType": "砼板 - 150", "levelName": "F01" }, { "familyType": "砼板 - 230", "levelName": "F01" });//楼板
    viewer.showComponentsByObjectData(showCondition);

    hideCondition.push({ "familyType": "消火栓连体箱", "levelName": "F01" });
    hideCondition.push({ "family": "FEFE-手提式灭火器1", "levelName": "F01" }, { "family": "FEFE-超细干粉灭火器-吸顶", "levelName": "F01" }, { "family": "FSHB-薄型普通消火栓箱 - 暗装1", "levelName": "F01" });
    viewer.hideComponentsByObjectData(hideCondition);
    /** F01 end **/

    /** F02 begin **/
    showCondition.length = hideCondition.length = 0;
    showCondition.push({ "family": "砼矩形梁", "levelName": "F02" }, { "family": "砼变截面矩形梁", "levelName": "F02" });//结构框架
    showCondition.push({ "categoryId": "-2001140", "levelName": "F02" });//机械设备
    showCondition.push({ "familyType": "幕墙- 玻璃 -300", "levelName": "F02" }, { "familyType": "幕墙- 防火玻璃 -200", "levelName": "F02" }, { "familyType": "外墙 - A5.0蒸压加气砼砌块 - 砌筑砂浆M5.0 - 200", "levelName": "F02" }, { "familyType": "幕墙- 玻璃 -270", "levelName": "F02" }, { "familyType": "幕墙- 玻璃 -100", "levelName": "F02" });//墙
    showCondition.push({ "familyType": "砼板 - 130", "levelName": "F02" }, { "familyType": "砼板 - 170", "levelName": "F02" }, { "familyType": "砼板 - 200", "levelName": "F02" }, { "familyType": "砼板 - 100", "levelName": "F02" }, { "familyType": "砼板 - 140", "levelName": "F02" }, { "familyType": "砼板 - 120", "levelName": "F02" }, { "familyType": "砼板 - 150", "levelName": "F02" }, { "familyType": "砼板 - 220", "levelName": "F02" });//楼板
    viewer.showComponentsByObjectData(showCondition);

    hideCondition.push({ "family": "FEFE-手提式灭火器", "levelName": "F02" }, { "family": "FSHB-薄型普通消火栓箱 - 暗装", "levelName": "F02" });
    viewer.hideComponentsByObjectData(hideCondition);
    /** F02 end **/

    /** F03 begin **/
    showCondition.length = hideCondition.length = 0;
    showCondition.push({ "family": "砼矩形梁", "levelName": "F03" }, { "family": "砼变截面矩形梁", "levelName": "F03" });//结构框架
    showCondition.push({ "categoryId": "-2001140", "levelName": "F03" });//机械设备
    showCondition.push({ "familyType": "内墙 - A5.0蒸压加气砼砌块 - 砌筑砂浆M5.0 - 300-玻璃", "levelName": "F03" });//墙
    showCondition.push({ "familyType": "砼板 - 130", "levelName": "F03" }, { "familyType": "砼板 - 170", "levelName": "F03" }, { "familyType": "砼板 - 200", "levelName": "F03" }, { "familyType": "砼板 - 100", "levelName": "F03" }, { "familyType": "砼板 - 110", "levelName": "F03" }, { "familyType": "砼板 - 140", "levelName": "F03" }, { "familyType": "砼板 - 120", "levelName": "F03" }, { "familyType": "砼板 - 150", "levelName": "F03" }, { "familyType": "砼板 - 220", "levelName": "F03" });//楼板
    viewer.showComponentsByObjectData(showCondition);

    hideCondition.push({ "family": "FEFE-手提式灭火器", "levelName": "F03" }, { "family": "FEFE-超细干粉灭火器-吸顶", "levelName": "F03" }, { "family": "FSHB-薄型普通消火栓箱 - 暗装", "levelName": "F03" }, { "family": "FSHB-消火栓箱-左接", "levelName": "F03" });
    viewer.hideComponentsByObjectData(hideCondition);
    /** F03 end **/


    viewer.render();
}

function floorExplosive() {
    viewer.hideAllComponents();
    let showCondition = [], floorList = new Array();
    showCondition.push({ "categoryId": "-2000011" });//墙
    showCondition.push({ "categoryId": "-2001330" });//结构柱
    //楼板
    showCondition.push({ "categoryId": "-2000032", "levelName": "F01" });
    showCondition.push({ "categoryId": "-2000032", "levelName": "F02" });
    showCondition.push({ "categoryId": "-2000032", "levelName": "F03" });
    showCondition.push({ "categoryId": "-2000032", "levelName": "B01" });

    viewer.showComponentsByObjectData(showCondition);

    if (floorList.length == 0) {
        viewer.getFloors(function (data) {
            if (!data) {
                console.log('No floor data.');
                return;
            }
            for (var i = 0; i < data.length; i++) {
                floorList.push(data[i].id);
            }
            viewer.setFloorExplosion(3, floorList);
            viewer.render();
        });
    } else {
        viewer.setFloorExplosion(3, floorList);
        viewer.render();
    }
}


