/**
 * @author:xuhongbo
 * @function:
 */
import { WebUtils } from '../package/WebUtils.js'
import { ModelHelper } from '../package/ModelHelper.js'

var app, viewer, drawableContainer, isShow;
const SINGLE_FILE = 0;
var BimfaceLoaderConfig = new BimfaceSDKLoaderConfig();
var webUtils = new WebUtils();
var hidetoken;

webUtils.getViewtoken(1955924074268864, SINGLE_FILE).then((token) => {
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
            viewer.enableShadow(false);
            viewer.setExposureShift(0.0);//曝光会影响色值
            renderer.alpha = true;
            renderer.setClearAlpha(0.08);

            // 创建标签容器
            var drawableConfig = new Glodon.Bimface.Plugins.Drawable.DrawableContainerConfig();
            drawableConfig.viewer = viewer;
            drawableContainer = new Glodon.Bimface.Plugins.Drawable.DrawableContainer(drawableConfig);
            webUtils.initModel();

            //相机视角
            // setCamera(viewer, function () {
            //     //开始加载设备模型 方式一：addView
            //     //viewer.addView('57d62010926b472b96a5ec8e2bdd8dda');
            // });
            bindEvent();
            viewer.addView('57d62010926b472b96a5ec8e2bdd8dda');

            viewer.addEventListener(Glodon.Bimface.Viewer.Viewer3DEvent.ViewLoading, function (e) {
                document.getElementsByClassName('bf-loading')[0].style.display = 'none';

            });

            viewer.addEventListener(Glodon.Bimface.Viewer.Viewer3DEvent.ViewChanged, function (e) {
                console.log(e);
                if (viewer.getModel) {
                    viewer.getModel(1955944555185120).hideAllComponents();
                    viewer.getModel(1955944555185120).showComponentsByObjectData([{ "family": "ATAH-吊顶式空气处理机组" }]);

                    if (viewer.getModel(1957231937914880)) {
                        viewer.getModel(1957231937914880).overrideComponentsColorByObjectData([], webUtils.fromColor(167, 167, 167, 1));
                    }

                }

                viewer.render();
                setTimeout(() => {
                    viewer.enableShadow(true);
                    viewer.render();
                }, 800);

                // viewer.setCameraStatus({
                //     "name": "persp",
                //     "position": {
                //         "x": -49744.03539447472,
                //         "y": -29596.266722380522,
                //         "z": 119970.95511615428
                //     },
                //     "target": {
                //         "x": 208884.2683213659,
                //         "y": 229032.98960825242,
                //         "z": -138656.40941157585
                //     },
                //     "up": {
                //         "x": 0,
                //         "y": -0.0000036731731979354334,
                //         "z": 0.9999999999932537
                //     },
                //     "fov": 45,
                //     "zoom": 1,
                //     "version": 1,
                //     "coordinateSystem": "world"
                // });

                // layer.msg("load finished!");
            })

            //TODO:声明下方单击事件中需要的变量
            viewer.addEventListener(Glodon.Bimface.Viewer.Viewer3DEvent.MouseClicked, function (e) {
                if (!e.objectId) return;
                if (window.bim.queryCondition) {
                    let condition = viewer.getModel(1955944555185120).getObjectDataById(e.objectId);
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
            "x": -242001.30420991874,
            "y": -148406.6096029717,
            "z": 263994.03086844477
        },
        "target": {
            "x": 16626.9995059219,
            "y": 110222.64672766118,
            "z": 5366.666340714643
        },
        "up": {
            "x": 0,
            "y": -0.0000036731731081360366,
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
            "x": -49744.03539447472,
            "y": -29596.266722380522,
            "z": 119970.95511615428
        },
        "target": {
            "x": 208884.2683213659,
            "y": 229032.98960825242,
            "z": -138656.40941157585
        },
        "up": {
            "x": 0,
            "y": -0.0000036731731979354334,
            "z": 0.9999999999932537
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
    //模拟单层   
    // 57d62010926b472b96a5ec8e2bdd8dda 暖通空调
    // 4da4a8e8bc2f48baad0c92197e031ce4 一层带内墙
    // 4223546d6a3b4fdcb80bd38bef2f71fa 一层外墙

    document.getElementById('floor').addEventListener('click', function () {
        viewer.showExclusiveComponentsByObjectData([{ "levelName": "F02" }]);
        viewer.getModel(1955944555185120).showExclusiveComponentsByObjectData([{ "levelName": "F02" }]);
        viewer.getModel(1955944555185120).hideAllComponents();
        viewer.getModel(1955944555185120).showComponentsByObjectData([{ "family": "ATAH-吊顶式空气处理机组" }]);

        viewer.hideView('4223546d6a3b4fdcb80bd38bef2f71fa');
        viewer.removeView('4223546d6a3b4fdcb80bd38bef2f71fa');
        viewer.addView('4da4a8e8bc2f48baad0c92197e031ce4');
        // viewer.setCameraStatus({
        //     "name": "persp",
        //     "position": {
        //         "x": -43962.85913353434,
        //         "y": -55454.0580275083,
        //         "z": 90788.02181015073
        //     },
        //     "target": {
        //         "x": 232165.3367021639,
        //         "y": 253243.7015667429,
        //         "z": -79871.65134309157
        //     },
        //     "up": {
        //         "x": 0.2539944741860429, 
        //         "y": 0.2839493731781604,
        //         "z": 0.924586156371966
        //     },
        //     "fov": 45,
        //     "zoom": 1,
        //     "version": 1,
        //     "coordinateSystem": "world"
        // }, () => {
        //     // viewer.showView('57d62010926b472b96a5ec8e2bdd8dda');
        //     viewer.render();
        // })
        viewer.render();
    });

    // 管网
    document.getElementById('net').addEventListener('click', function () {
        isShow = !isShow;
        if (isShow) {
            viewer.getModel(1955944555185120).showComponentsByObjectData([{ "levelName": "F02" }]);

        } else {
            viewer.getModel(1955944555185120).hideAllComponents();
            viewer.getModel(1955944555185120).showComponentsByObjectData([{ "family": "ATAH-吊顶式空气处理机组" }]);
            viewer.getModel(1955944555185120).overrideComponentsColorByObjectData([{ "family": "风管隔热层" }], webUtils.fromHexColor('#0DADF7', 1));
            viewer.getModel(1955944555185120).overrideComponentsColorByObjectData([{ "family": "ATAH-吊顶式空气处理机组" }], webUtils.fromHexColor('#F8E21F', 1));
        }
        viewer.render();
    });


}