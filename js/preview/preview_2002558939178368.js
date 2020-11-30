/**
 * @author:xuhongbo
 * @function:
 */
import { WebUtils } from '../package/WebUtils.js'
import { ModelHelper } from '../package/ModelHelper.js'

var app, viewer, drawableContainer, eoManager;
const INTEGRATE_FILE = 1;
var BimfaceLoaderConfig = new BimfaceSDKLoaderConfig();
var webUtils = new WebUtils();
// 定义楼层爆炸的方向，缺省值为{x: 0, y: 0, z: 1}
var direction = { x: 1, y: 1, z: 1 };
var floorList = new Array();

webUtils.getViewtoken(2002558939178368, INTEGRATE_FILE).then((token) => {
  BimfaceLoaderConfig.viewToken = token;
  BimfaceSDKLoader.load(BimfaceLoaderConfig, onSDKLoadSucceeded, onSDKLoadFailed);
});

function onSDKLoadSucceeded(viewMetaData) {
  if (viewMetaData.viewType == "3DView") {
    var view = document.getElementById('view');
    var config = new Glodon.Bimface.Application.WebApplication3DConfig();
    config.domElement = view;
    config.enableExplosion = true;
    app = new Glodon.Bimface.Application.WebApplication3D(config);
    viewer = app.getViewer();
    viewer.setCameraAnimation(true);
    app.addView(BimfaceLoaderConfig.viewToken);
    CLOUD.GlobalData.Renderer = CLOUD.EnumRendererType.FULL;

    viewer.setBorderLineEnabled(false);
    window.viewer = viewer;

    viewer.setBackgroundColor = webUtils.fromColor(53, 53, 66, 1);
    webUtils.viewer = window.viewer;
    viewer.addEventListener(Glodon.Bimface.Viewer.Viewer3DEvent.ViewAdded, function () {
      eoManager = new Glodon.Bimface.Viewer.ExternalObjectManager(viewer);
      let modelHelper = new ModelHelper(viewer);
      //helper.createAixsHelper(viewer);
      let scene = modelHelper.getScene(), camera = modelHelper.getPerspectiveCamera(), renderer = modelHelper.getRender();
      renderer.domElement.addClass('canvasClass');
      // window.myscene = scene;
      // renderer.shadowMap.enabled = true;
      viewer.enableShadow(true);
      // viewer.setExposureShift(0.0);//曝光会影响色值
      // renderer.alpha = true;
      // renderer.setClearAlpha(0.08);

      // 创建标签容器
      // var drawableConfig = new Glodon.Bimface.Plugins.Drawable.DrawableContainerConfig();
      // drawableConfig.viewer = viewer;
      // drawableContainer = new Glodon.Bimface.Plugins.Drawable.DrawableContainer(drawableConfig);
      webUtils.initModel();

      viewer.hideAllComponents();
      viewer.overrideComponentsColorByObjectData([{ "categoryId": "-2000011" }], new Glodon.Web.Graphics.Color('#A7A7A7'));
      viewer.showComponentsByObjectData([
        { "categoryId": "-2000011" },//墙
        { "categoryId": "-2000151" },//常规模型
        { "categoryId": "-2001140" },//机械设备
        { "categoryId": "-2000032" },//楼板
        // { "categoryId": "-2000023" },//门
        // { "categoryId": "-2000120" }//楼梯
      ]);
      viewer.hideComponentsByObjectData([{ "specialty": "幕墙" }]);


      viewer.render();

      //相机视角
      setCamera(viewer, () => {
        if (floorList.length == 0) {
          viewer.getFloors(function (data) {
            if (!data) {
              console.log('No floor data.');
              return;
            }
            for (var i = 0; i < data.length; i++) {
              floorList.push(data[i].id);
            }
            viewer.setFloorExplosion(3, floorList, direction);
            //TODO:将楼板下移
            // let name = 'F1F1';
            // let external = eoManager.convert("1999669228873920.2840410", true);
            // window._external_ = external;
            // console.log(external);
            // window._name_ = name;
            // window._eom_ = eoManager;
            // eoManager.addObject(name, external, 1999669228873920);
            // eoManager.translate("1999669228873920.2840410", { x: 0, y: 0, z: -5500 });
            viewer.render();
          });
        } else {
          viewer.setFloorExplosion(3, floorList, direction);
        }
      });

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
      "x": -115187.08005874095,
      "y": -194576.98083021885,
      "z": 287028.7336579654
    },
    "target": {
      "x": 163670.71690268448,
      "y": 84281.84325784317,
      "z": 8171.9493462812125
    },
    "up": {
      "x": 0,
      "y": -0.0000036732050424591237,
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
      "x": -153857.86815328503,
      "y": -231241.75294860924,
      "z": 199506.17129807232
    },
    "target": {
      "x": 161588.7918140016,
      "y": 82147.78838960828,
      "z": 10918.20521958532
    },
    "up": {
      "x": 0.2769967983958842,
      "y": 0.27518643248095714,
      "z": 0.9206221814929474
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