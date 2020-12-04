/**
 * @author:xuhongbo
 * @function:
 */
import { WebUtils } from '../package/WebUtils.js'
import { ModelHelper } from '../package/ModelHelper.js'
import { EffectLibrary } from '../package/EffectLibrary.js'
import { Constant } from '../package/Constants.js'

var app, viewer, drawableContainer, lightMng, directionalLight, eoManager, curveAnimationConfig, curveAnimation;
var splineCurve, path = [];
const SINGLE_FILE = 0;
var BimfaceLoaderConfig = new BimfaceSDKLoaderConfig();
var webUtils = new WebUtils();
var effectLibrary = new EffectLibrary();
var hidetoken;

webUtils.getViewtoken(1884340121831521, SINGLE_FILE).then((token) => {
    BimfaceLoaderConfig.viewToken = token;
    hidetoken = token;
    BimfaceSDKLoader.load(BimfaceLoaderConfig, onSDKLoadSucceeded, onSDKLoadFailed);
});

function onSDKLoadSucceeded(viewMetaData) {
    if (viewMetaData.viewType == "3DView") {
        var view = document.getElementById('view');
        var config = new Glodon.Bimface.Application.WebApplication3DConfig();
        config.domElement = view;
        config.enableReplaceMaterial = true;
        app = new Glodon.Bimface.Application.WebApplication3D(config);
        viewer = app.getViewer();

        viewer.setCameraAnimation(false);
        app.addView(BimfaceLoaderConfig.viewToken);
        viewer.setBorderLineEnabled(false);
        window.viewer = viewer;
        viewer.setBackgroundColor(webUtils.fromColor(17, 38, 66, 1));
        webUtils.viewer = window.viewer;
        effectLibrary.viewer = window.viewer;
        viewer.addEventListener(Glodon.Bimface.Viewer.Viewer3DEvent.ViewAdded, function () {
            requestAnimationFrame(() => {
                eoManager = new Glodon.Bimface.Plugins.ExternalObject.ExternalObjectManager(viewer);
                setCamera(viewer, createWallEffect);
            });
            let modelHelper = new ModelHelper(viewer);
            //helper.createAixsHelper(viewer);




            // viewer.enableShadow(true);
            // lightMng = viewer.getLightManager();
            // directionalLight = lightMng.getAllDirectionalLights()[0];
            // directionalLight.enableShadow(true);
            // viewer.setExposureShift(0.0);//曝光会影响色值
            // renderer.alpha = true;
            // renderer.setClearAlpha(0.08);

            // 创建标签容器
            // var drawableConfig = new Glodon.Bimface.Plugins.Drawable.DrawableContainerConfig();
            // drawableConfig.viewer = viewer;
            // drawableContainer = new Glodon.Bimface.Plugins.Drawable.DrawableContainer(drawableConfig);
            webUtils.initModel();

            // viewer.overrideComponentsColorByObjectData([{ "categoryId": "-2000032" }], webUtils.fromColor(17, 38, 66, 1));





            //相机视角
            // setCamera(viewer, bindEvent);
            let pointsOfWorld = [];
            window._pointsOfWorld = pointsOfWorld;
            //TODO:声明下方单击事件中需要的变量
            viewer.addEventListener(Glodon.Bimface.Viewer.Viewer3DEvent.MouseClicked, function (e) {
                if (!e.objectId) return;

                //record world position
                pointsOfWorld.push(e.worldPosition);


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
            "x": -1348786.2109939798,
            "y": -1968537.0071496805,
            "z": 1604210.440398626
        },
        "target": {
            "x": 235729.98472487924,
            "y": -384014.97512648936,
            "z": 19699.998723980323
        },
        "up": {
            "x": 0,
            "y": -0.0000036732054314081396,
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
            "x": -339376.4539420492,
            "y": 506232.89574802615,
            "z": 187971.2126705709
        },
        "target": {
            "x": 1158149.8271378668,
            "y": -1432208.6624309914,
            "z": -1049742.3386725863
        },
        "up": {
            "x": 0.27571056993591764,
            "y": -0.3568918933809997,
            "z": 0.8925311524336484
        },
        "fov": 45,
        "zoom": 1,
        "version": 1,
        "coordinateSystem": "world"
    };

    viewer.setCameraStatus(start, () => {
        setTimeout(() => {
            viewer.setCameraStatus(target, () => {
                //bindEvent();
                if (callback) {
                    callback();
                };
                viewer.recordCustomedHomeview(target);
            })
        }, 800);
    });
}

// 常见电子围墙效果
function createWallEffect() {
    let path = [
        { x: 90906.72925462366, y: 374293.90837424155, z: 19.584075296748544 },
        { x: 90992.14572583562, y: 274832.1057293313, z: -271.09520606173055 },
        { x: 161664.0017769008, y: 275001.4487984253, z: 19.58407529583927 },
        { x: 161119.36200446793, y: 373662.2839433945, z: 19.584075296684922 },
        { x: 90906.72925462366, y: 374293.90837424155, z: 19.584075296748544 }];

    let path2 = [
        {
            x: 75818.91919656626,
            y: 374070.26670463936,
            z: 20.77459649836643
        },
        {
            x: 76602.40720230827,
            y: 265821.5363790948,
            z: 20.7745964974386
        },
        {
            x: -30717.54566919077,
            y: 267697.3354060453,
            z: 20.774596497440125
        },
        {
            x: -19211.871783396775,
            y: 306917.9757531004,
            z: 20.77459649779085
        },
        {
            x: 46021.16351249664,
            y: 307847.94570644596,
            z: 20.774596497798818
        },
        {
            x: 46120.94723871846,
            y: 338339.4970106232,
            z: 20.77459649804562
        },
        {
            x: -7102.708527903692,
            y: 338091.0001453213,
            z: 20.77459649805804
        },
        {
            x: 3171.9371458727665,
            y: 374190.7307607487,
            z: 20.774596498367465
        },
        {
            x: 75818.91919656626,
            y: 374070.26670463936,
            z: 20.77459649836643
        }
    ];
    let centerPoint = { x: 127558.6904568029, y: 322181.5967759746, z: 29999.99707529418 };
    let slavePoints = [{ x: 428705.3023207032, y: 246105.07969800566, z: 19999.999352279603 }, { x: 8198.580026423226, y: 147686.44213394247, z: 25099.999187109785 }, { x: -355960.98944854754, y: 145934.92260080954, z: 39699.998714272195 }];

    effectLibrary.electricWallEffect(Constant.direction.Normal, false, 3500, 40000, path, new Glodon.Web.Graphics.Color(255, 12, 12, 1));
    effectLibrary.fireEffect(null, 8, null);
    effectLibrary.flyLines(eoManager, centerPoint, slavePoints, new Glodon.Web.Graphics.Color(217, 28, 13, 1.0), 18);
}

function bindEvent() {
    var color = new Glodon.Web.Graphics.Color(17, 218, 183, 1.0);
    var width = 3;
    var style = {
        "lineType": "Continuous",
        "lineStyle": null
    };
    var count = 0;
    var z = 0;
    var points = [[{ "x": -62842.315213844886, "y": -1127574.7070681632, "z": z }, { "x": 515163.17874531, "y": -832830.4847844915, "z": z }, { "x": 762059.685180404, "y": -763929.1973259944, "z": z }]];

    for (var i = 0; i < points.length; i++) {
        // 构造曲线
        var splineCurve = new Glodon.Bimface.Plugins.Geometry.SplineCurve(points[i], color, width, style);
        path.push(splineCurve);
        // 曲线贴图
        splineCurve.setMap({
            src: "https://static-test.bimface.com/attach/3f9b4c5612194a71b0523766840351e6_流线贴图1028-6.png",
            // 允许颜色覆盖
            enableColorOverride: false
        },
            function () {
                eoManager.addObject("splineCurve" + count, path[count]);
                count++;
            });
    }

    // 构造曲线动画的配置项
    curveAnimationConfig = new Glodon.Bimface.Plugins.Animation.CurveAnimationConfig();
    // 配置Viewer对象、曲线对象、动画时间、动画循环、动画类型等参数
    curveAnimationConfig.viewer = viewer;
    curveAnimationConfig.curves = path;
    curveAnimationConfig.time = 1200;
    curveAnimationConfig.loop = true;
    curveAnimationConfig.type = "flow";
    // 构造曲线动画对象
    curveAnimation = new Glodon.Bimface.Plugins.Animation.CurveAnimation(curveAnimationConfig);
    curveAnimation.play();
}