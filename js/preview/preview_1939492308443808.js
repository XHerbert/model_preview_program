/**
 * @author:xuhongbo
 * @function:wanda water system white
 */
import { WebUtils } from '../package/WebUtils.js'
import { ModelHelper } from '../package/ModelHelper.js'

var app, viewer, drawableContainer;
const INTEGRATE_FILE = 1;
var BimfaceLoaderConfig = new BimfaceSDKLoaderConfig();
var webUtils = new WebUtils();

webUtils.getViewtoken(1939492308443808, INTEGRATE_FILE).then((token) => {
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

        viewer.setBorderLineEnabled(true);

        window.viewer = viewer;
        webUtils.viewer = window.viewer;
        viewer.addEventListener(Glodon.Bimface.Viewer.Viewer3DEvent.ViewAdded, function () {
            let modelHelper = new ModelHelper(viewer);
            //helper.createAixsHelper(viewer);
            let scene = modelHelper.getScene(), camera = modelHelper.getPerspectiveCamera(), renderer = modelHelper.getRender();
            renderer.domElement.addClass('canvasClass');
            window.myscene = scene;
            renderer.shadowMap.enabled = true;
            viewer.enableShadow(false);
            viewer.setExposureShift(0.0);//曝光会影响色值
            renderer.alpha = true;
            renderer.setClearAlpha(0.08);
            // viewer.setBackgroundColor(new Glodon.Web.Graphics.Color(234, 234, 234, 1));
            // viewer.setBackgroundColor(new Glodon.Web.Graphics.Color(46, 65, 84, 1));

            // 创建标签容器
            var drawableConfig = new Glodon.Bimface.Plugins.Drawable.DrawableContainerConfig();
            drawableConfig.viewer = viewer;
            drawableContainer = new Glodon.Bimface.Plugins.Drawable.DrawableContainer(drawableConfig);

            // 轮廓线不明显
            viewer.overrideComponentsFrameColorByObjectData([], new Glodon.Web.Graphics.Color(214, 214, 214, 0.6));//214

            // 建筑
            viewer.overrideComponentsColorByObjectData([{ "specialty": "建筑" }], new Glodon.Web.Graphics.Color(167, 167, 167, 0.1));

            // 机械设备
            viewer.overrideComponentsColorByObjectData([{ "familyType": "机械设备" }], new Glodon.Web.Graphics.Color(248, 226, 31, 1));

            // 机械设备 - 管道
            viewer.overrideComponentsColorByObjectData([{ "categoryId": "-2008000" }, { "categoryId": "-2001140" }, { "categoryId": "-2008122" }, { "categoryId": "-2001160" }, { "categoryId": "-2008010" }, { "categoryId": "-2008049" }, { "categoryId": "-2008044" }], new Glodon.Web.Graphics.Color(13, 173, 247, 1));

            //手动调整设备颜色
            viewer.overrideComponentsColorById(["1771855777580864.4711684"], new Glodon.Web.Graphics.Color(157, 14, 70, 1));
            viewer.overrideComponentsColorById(["1771855777580864.4711685"], new Glodon.Web.Graphics.Color(113, 162, 160, 1));

            drawArea(viewer);


            //基础设置
            viewer.hideViewHouse();
            document.getElementsByClassName('bf-toolbar bf-toolbar-bottom')[0].style.display = 'none';
            document.getElementsByClassName('gld-bf-tree')[0].style.display = 'none';
            document.getElementById('open-button').style.display = 'block';

            //相机视角
            setCamera(viewer);

            viewer.hideComponentsByObjectData([
                { "categoryId": "-2008085" },
                { "categoryId": "-2001140" },
                { "categoryId": "-2008122" }
            ]);
            viewer.showComponentsByObjectData([
                { "family": "变频给水泵组2" },
                { "family": "消火栓系统稳压气压罐 - 立式" },
                { "family": "消火栓加压泵 - 卧式" },
                { "family": "自动喷水加压泵 - 卧式" },
            ]);
            viewer.isolateComponentsByObjectData([{ "levelName": "B02" }, { "specialty": "建筑" }], Glodon.Bimface.Viewer.IsolateOption.MakeOthersTranslucent);

            // viewer.overrideComponentsColorByObjectData([[
            //     { "family": "变频给水泵组2" },
            //     { "family": "消火栓系统稳压气压罐 - 立式" },
            //     { "family": "消火栓加压泵 - 卧式" },
            //     { "family": "自动喷水加压泵 - 卧式" },
            // ]], webUtils.fromColor(112, 128, 144, 1));

            document.getElementById("white").addEventListener("click", function () {
                singleFloor(viewer);
            });

            viewer.addEventListener(Glodon.Bimface.Viewer.Viewer3DEvent.MouseClicked, function (e) {

                if (!e.objectId) return;
                if (window.bim.queryCondition) {
                    let condition = viewer.getObjectDataById(e.objectId);
                    webUtils.layerPanel("#json-renderer", "auto", "auto", "筛选条件", 'layui-layer-molv', condition);
                }

                if (window.bim.component) {
                    webUtils.layerPanel("#json-renderer", "auto", undefined, "构件信息", 'layui-layer-lan', e);
                }

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
            "x": -58466.900361232,
            "y": -65841.548494197,
            "z": 45386.62036006717
        },
        "target": {
            "x": 121256.04813040385,
            "y": 135725.8053610624,
            "z": -5536.867116585027
        },
        "up": {
            "x": 0.1233208337926485,
            "y": 0.13830611258904568,
            "z": 0.9826817344253389
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

function drawArea(viewer) {

    let height = 2438;
    let xiaofangshuibeng = { "version": "2.0", "loops": [[[{ "z": -10699.999571472328, "y": 16099.999355206408, "x": 72600.319466657413 }, { "z": -10699.999571472328, "y": 16099.99935520639, "x": 78053.006474027148 }], [{ "z": -10699.999571472328, "y": 16099.99935520639, "x": 78053.006474027148 }, { "z": -10699.999571472328, "y": 16099.999355206381, "x": 80449.996778033033 }], [{ "z": -10699.999571472328, "y": 16099.999355206381, "x": 80449.996778033033 }, { "z": -10699.999571472328, "y": 16099.999355206357, "x": 87999.996475660722 }], [{ "z": -10699.999571472328, "y": 16099.999355206357, "x": 87999.996475660722 }, { "z": -10699.999571472328, "y": 16399.999343191055, "x": 87999.996475660722 }], [{ "z": -10699.999571472328, "y": 16399.999343191055, "x": 87999.996475660722 }, { "z": -10699.999571472328, "y": 16399.999343191052, "x": 88797.139293954708 }], [{ "z": -10699.999571472328, "y": 16399.999343191048, "x": 88797.1392939547 }, { "z": -10699.999571472328, "y": 37099.947386429507, "x": 88599.996451663479 }], [{ "z": -10699.999571472328, "y": 37099.947386429507, "x": 88599.996451663479 }, { "z": -10699.999571472328, "y": 37099.947386429507, "x": 83899.996630911526 }], [{ "z": -10699.999571472328, "y": 37099.947386429507, "x": 83899.996630911526 }, { "z": -10699.999571472328, "y": 37099.947386429507, "x": 71699.997128462826 }], [{ "z": -10699.999571472328, "y": 37099.947386429507, "x": 71699.997128462841 }, { "z": -10699.999571472328, "y": 24249.999028804035, "x": 71699.997128462841 }], [{ "z": -10699.999571472328, "y": 24249.999028804035, "x": 71699.997128462841 }, { "z": -10699.999571472328, "y": 16099.999355206412, "x": 71699.997128462841 }], [{ "z": -10699.999571472328, "y": 16099.999355206412, "x": 71699.997128462826 }, { "z": -10699.999571472328, "y": 16099.999355206412, "x": 72600.319466657413 }]]] };
    viewer.createRoom(xiaofangshuibeng, height, "dashangye6", new Glodon.Web.Graphics.Color(255, 136, 0, 0.25), new Glodon.Web.Graphics.Color(255, 136, 0, 0.35));


    let normalColor = new Glodon.Web.Graphics.Color(112, 128, 144, 1);
    viewer.overrideComponentsColorById(["1939485366241280.1336674"], normalColor);
    viewer.overrideComponentsColorById(["1939485366241280.1336677"], normalColor);
    viewer.overrideComponentsColorById(["1939485366241280.1334004"], normalColor);
    viewer.overrideComponentsColorById(["1939485366241280.1335799"], webUtils.fromColor(255, 0, 0, 1));
    viewer.overrideComponentsColorById(["1939485366241280.1335950"], normalColor);
    viewer.overrideComponentsColorById(["1939485366241280.1331450"], normalColor);
    viewer.overrideComponentsColorById(["1939485366241280.1336676"], normalColor);
    viewer.overrideComponentsColorById(["1939485366241280.1336678"], normalColor);
    viewer.overrideComponentsColorById(["1939485366241280.1336679"], normalColor);
    viewer.overrideComponentsColorById(["1939485366241280.1336675"], normalColor);

    viewer.overrideComponentsColorById(["1939485366241280.1336065"], normalColor);
    viewer.overrideComponentsColorById(["1939485366241280.1336128"], normalColor);
    viewer.overrideComponentsColorById(["1939485366241280.1336329"], normalColor);
    viewer.overrideComponentsColorById(["1939485366241280.1336386"], normalColor);
    viewer.overrideComponentsColorById(["1939485366241280.1336619"], normalColor);

    viewer.render();
}

function singleFloor(viewer) {

    viewer.overrideComponentsColorByObjectData([{ "specialty": "建筑" }], new Glodon.Web.Graphics.Color(167, 167, 167, 1));
    viewer.isolateComponentsByObjectData([{ "levelName": "B02" }], Glodon.Bimface.Viewer.IsolateOption.HideOthers);
    viewer.hideComponentsById(["1862915938518976.2605511"]);
    viewer.hideComponentsByObjectData([{ "familyType": "楼面22 - 水泥砂浆楼面 - 20" }]);
    drawArea(viewer);
    viewer.setCameraStatus({
        "name": "persp",
        "position": {
            "x": 59579.40223056132,
            "y": 3171.788988400875,
            "z": 26337.676637598084
        },
        "target": {
            "x": 169839.65536896075,
            "y": 154303.3256380671,
            "z": -174970.22252246967
        },
        "up": {
            "x": 0.4317386616797187,
            "y": 0.5917702033154295,
            "z": 0.6807420616349636
        },
        "fov": 45,
        "zoom": 1,
        "version": 1,
        "coordinateSystem": "world"
    });
    viewer.render();
}

function water() {
    viewer.setCameraStatus({
        "name": "persp",
        "position": {
            "x": 383.5899590046742,
            "y": 91927.3277909603,
            "z": 12111.760942340503
        },
        "target": {
            "x": 122267.02007998478,
            "y": 254579.96797597955,
            "z": -172851.69908618843
        },
        "up": {
            "x": 0.4036068411717696,
            "y": 0.5386057228121012,
            "z": 0.7395981294685648
        },
        "fov": 45,
        "zoom": 1,
        "version": 1,
        "coordinateSystem": "world"
    });
    viewer.overrideComponentsColorByObjectData([{ "specialty": "建筑" }], new Glodon.Web.Graphics.Color(167, 167, 167, 1));
    viewer.isolateComponentsByObjectData([{ "levelName": "B02" }], Glodon.Bimface.Viewer.IsolateOption.HideOthers);
    viewer.render();
}