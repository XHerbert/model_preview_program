/**
 * @author:xuhongbo
 * @function:wanda white effiective
 */

import { WebUtils } from '../package/WebUtils.js'
import { ModelHelper } from '../package/ModelHelper.js'

var app, viewer, drawableContainer;
const INTEGRATE_FILE = 1;
var BimfaceLoaderConfig = new BimfaceSDKLoaderConfig();
var webUtils = new WebUtils();

webUtils.getViewtoken(1897052362842272, INTEGRATE_FILE).then((token) => {
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
            viewer.setExposureShift(-0.1);
            renderer.alpha = true;
            renderer.setClearAlpha(0.08);
            viewer.setBackgroundColor(new Glodon.Web.Graphics.Color(254, 254, 254, 1));

            // 创建标签容器
            var drawableConfig = new Glodon.Bimface.Plugins.Drawable.DrawableContainerConfig();
            drawableConfig.viewer = viewer;
            drawableContainer = new Glodon.Bimface.Plugins.Drawable.DrawableContainer(drawableConfig);

            // 轮廓线不明显
            viewer.overrideComponentsFrameColorByObjectData([], new Glodon.Web.Graphics.Color(255, 255, 255, 1));//214

            // 建筑
            viewer.overrideComponentsColorByObjectData([{ "specialty": "建筑" }], new Glodon.Web.Graphics.Color(236, 236, 236, 255));
            // viewer.overrideComponentsColorByObjectData([{ "specialty": "建筑" }], new Glodon.Web.Graphics.Color(185, 185, 185, 255));

            //手动调整颜色
            viewer.overrideComponentsColorByObjectData([{ "family": "静压箱组4" }, { "family": "静压箱组" }, { "family": "静压箱" }, { "family": "卧式暗装风机盘管" }], new Glodon.Web.Graphics.Color(255, 203, 193, 255));

            // 区域 
            viewer.overrideComponentsColorById(["1896419529082976.1089007"], new Glodon.Web.Graphics.Color(66, 199, 255, 255));

            //地面
            viewer.overrideComponentsColorByObjectData([{ "family": "楼板" }], new Glodon.Web.Graphics.Color(147, 147, 147, 255));

            //光源
            let light = new THREE.PointLight(0xff0000, 0.35, 10000);
            light.position.set(53789.66668783984, 116882.37157129617, -18220.363535766293);
            //myscene.add(light);

            bindEvent();
            //基础设置
            viewer.hideViewHouse();
            document.getElementsByClassName('bf-toolbar bf-toolbar-bottom')[0].style.display = 'none';
            document.getElementsByClassName('gld-bf-tree')[0].style.display = 'none';
            document.getElementById('open-button').style.display = 'block';

            //相机视角
            setCamera(viewer);
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
            "x": -45580.63703757153,
            "y": -91018.75694386024,
            "z": 149889.60077606415
        },
        "target": {
            "x": 101800.00352574831,
            "y": 56362.426952821195,
            "z": 2509.500086935528
        },
        "up": {
            "x": 0,
            "y": -0.000003673205054320099,
            "z": 0.9999999999932538
        },
        "fov": 45,
        "zoom": 1,
        "version": 1
    };

    let target = {
        "name": "persp",
        "position": {
            "x": 124338.56478218966,
            "y": 12693.696952653363,
            "z": 33353.34321106728
        },
        "target": {
            "x": 125105.00197370716,
            "y": 209455.65998773175,
            "z": -218435.48997485664
        },
        "up": {
            "x": 0.0030692365170997783,
            "y": 0.7879372721832468,
            "z": 0.6157478663313631
        },
        "fov": 45,
        "zoom": 1,
        "version": 1
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


function bindEvent() {
    document.getElementById("white").addEventListener("click", () => {

        viewer.setBackgroundColor(new Glodon.Web.Graphics.Color(214, 214, 214, 1));
        viewer.overrideComponentsColorById(["1896419529082976.1089007"], new Glodon.Web.Graphics.Color(66, 199, 255, 255));
        viewer.overrideComponentsColorByObjectData([{ "family": "静压箱组4" }, { "family": "静压箱组" }, { "family": "静压箱" }, { "family": "卧式暗装风机盘管" }], new Glodon.Web.Graphics.Color(255, 203, 193, 255));
        // viewer.overrideComponentsColorByObjectData([{ "family": "机械设备" }], new Glodon.Web.Graphics.Color(255, 203, 193, 255));
        // viewer.overrideComponentsColorByObjectData([{ "family": "风管" }], new Glodon.Web.Graphics.Color(239, 163, 153, 255));
        // viewer.overrideComponentsColorByObjectData([{ "familyType": "镀锌钢板 - 接头 - 法兰" }, { "familyType": "不锈钢板 - T型三通 - 法兰" }, {}], new Glodon.Web.Graphics.Color(95, 163, 255, 255));
        viewer.overrideComponentsColorByObjectData([{ "specialty": "建筑" }], new Glodon.Web.Graphics.Color(196, 196, 196, 255));
        viewer.render();
    });

    document.getElementById("blue").addEventListener("click", () => {
        viewer.overrideComponentsFrameColorByObjectData([{ "specialty": "建筑" }], new Glodon.Web.Graphics.Color('#1E90FF', 0.7));
        viewer.overrideComponentsColorByObjectData([{ "specialty": "建筑" }], new Glodon.Web.Graphics.Color('#6699FF', 0.65));
        viewer.overrideComponentsColorById(["1896419529082976.1089007"], new Glodon.Web.Graphics.Color(66, 199, 2555, 255));
        viewer.overrideComponentsColorByObjectData([{ "family": "静压箱组4" }, { "family": "静压箱组" }, { "family": "静压箱" }, { "family": "卧式暗装风机盘管" }], new Glodon.Web.Graphics.Color(255, 203, 193, 255));
        viewer.setBackgroundColor(new Glodon.Web.Graphics.Color(17, 25, 48, 1));
        viewer.render();
    });

    document.getElementById("black").addEventListener("click", () => {
        viewer.setBackgroundColor(new Glodon.Web.Graphics.Color(6, 3, 19, 1));
        viewer.overrideComponentsColorByObjectData([{ "specialty": "建筑" }], new Glodon.Web.Graphics.Color(52, 51, 164, 255));
        viewer.overrideComponentsColorById(["1896419529082976.1089007"], new Glodon.Web.Graphics.Color(66, 199, 255, 255));
        viewer.overrideComponentsColorByObjectData([{ "family": "静压箱组4" }, { "family": "静压箱组" }, { "family": "静压箱" }, { "family": "卧式暗装风机盘管" }], new Glodon.Web.Graphics.Color(255, 203, 193, 255));
        viewer.render();
    });

}