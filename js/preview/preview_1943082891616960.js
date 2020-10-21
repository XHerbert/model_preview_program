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
var hidetoken;

webUtils.getViewtoken(1943082891616960, INTEGRATE_FILE).then((token) => {
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

            viewer.hideViewHouse();
            document.getElementsByClassName('bf-toolbar bf-toolbar-bottom')[0].style.display = 'none';
            document.getElementsByClassName('gld-bf-tree')[0].style.display = 'none';
            document.getElementById('open-button').style.display = 'block';
            viewer.overrideComponentsColorByObjectData([{ "specialty": "建筑" }], webUtils.fromColor(0, 105, 185, 0.2));//蓝色
            // viewer.overrideComponentsColorByObjectData([{ "specialty": "建筑" }], webUtils.fromColor(0, 145, 255, 0.2));//蓝色
            // viewer.overrideComponentsColorByObjectData([{ "specialty": "建筑" }], webUtils.fromColor(200, 200, 200, 0.75));//白色


            viewer.overrideComponentsColorByObjectData([{ "family": "自动扶梯", }], webUtils.fromColor(61, 136, 80, 1));

            let elevators = [];
            elevators.push("1942407203834048.2912252", "1942407203834048.2911642");
            viewer.overrideComponentsColorById(elevators, webUtils.fromColor(255, 0, 0, 1));
            elevators.length = 0;
            elevators.push("1942407940540416.2972910", "1942407940540416.2973041");
            viewer.overrideComponentsColorById(elevators, webUtils.fromColor(255, 127, 39, 1));

            //处理竖井（体量）
            viewer.overrideComponentsColorByObjectData([{ "categoryId": "-2003400" }], webUtils.fromColor(220, 220, 220, 0.5));
            elevators.length = 0;
            elevators.push("1943076649502912.3156526", "1943076649502912.3155403", "1943076468647936.3089839", "1943076468647936.3090007", "1943076468647936.3090838", "1943076757030912.3185450", "1943076468647936.3089663", "1943076649502912.3155540", "1943076581394624.3213462", "1943076757030912.3186423", "1943076468647936.3091243", "1943076649502912.3156084");
            viewer.overrideComponentsColorById(elevators, webUtils.fromColor(61, 136, 80, 1));
            elevators.length = 0;
            elevators.push("1943076757030912.3186216", "1943076581394624.3213717", "1943076581394624.3213019");
            viewer.overrideComponentsColorById(elevators, webUtils.fromColor(163, 168, 190, 1));
            elevators.length = 0;
            elevators.push("1943076757030912.3185233", "1943076581394624.3212442", "1943076757030912.3185939", "1943076757030912.3185800");
            viewer.overrideComponentsColorById(elevators, webUtils.fromColor(255, 127, 39, 1));
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
            "x": -110106.56579728762,
            "y": -92357.7796614936,
            "z": 216606.41411474583
        },
        "target": {
            "x": 77050.52714554721,
            "y": 94800.00264108233,
            "z": 29450.000820446836
        },
        "up": {
            "x": 0,
            "y": -0.0000036732051818094284,
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
            "x": -39300.41262888449,
            "y": -40346.63231575022,
            "z": 94975.8432246411
        },
        "target": {
            "x": 155836.2646334542,
            "y": 169370.48575908708,
            "z": -56759.925550480366
        },
        "up": {
            "x": 0.3188585707016792,
            "y": 0.34267924582756093,
            "z": 0.8836855472220514
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
                viewer.render();
            })
        }, 800);
    });
}