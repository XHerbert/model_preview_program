/**
 * @author:xuhongbo
 * @function:
 */
import { WebUtils } from '../package/WebUtils.js'
import { ModelHelper } from '../package/ModelHelper.js'

var app, viewer, drawableContainer, eoManager, lightMng, directionalLight;
const INTEGRATE_FILE = 1;
var BimfaceLoaderConfig = new BimfaceSDKLoaderConfig();
var webUtils = new WebUtils();
// 定义楼层爆炸的方向，缺省值为{x: 0, y: 0, z: 1}
var direction = { x: 1, y: 1, z: 1 };
var floorList = new Array();
var all = webUtils.getURLParameter('all');
var _file = all == "1" ? 2013928559494592 : 2008809476646336;
console.log(all);

webUtils.getViewtoken(2019386536298016, INTEGRATE_FILE).then((token) => {
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
    viewer.enableGlowEffect(true);
    window.viewer = viewer;
    viewer.setExposureShift(-0.025);
    viewer.setBackgroundColor = webUtils.fromColor(53, 53, 66, 1);
    webUtils.viewer = window.viewer;
    viewer.addEventListener(Glodon.Bimface.Viewer.Viewer3DEvent.ViewAdded, function () {
      requestAnimationFrame(() => eoManager = new Glodon.Bimface.Plugins.ExternalObject.ExternalObjectManager(viewer));
      let modelHelper = new ModelHelper(viewer);

      lightMng = viewer.getLightManager();
      directionalLight = lightMng.getAllDirectionalLights()[0];
      directionalLight.enableShadow(true);
      // window.myscene = scene;
      // renderer.shadowMap.enabled = true;
      // viewer.enableShadow(true);
      // Glodon.Bimface.Light.DirectionalLight.enableShadow(true)
      // viewer.setExposureShift(0.0);//曝光会影响色值
      // renderer.alpha = true;
      // renderer.setClearAlpha(0.08);

      // 创建标签容器
      // var drawableConfig = new Glodon.Bimface.Plugins.Drawable.DrawableContainerConfig();
      // drawableConfig.viewer = viewer;
      // drawableContainer = new Glodon.Bimface.Plugins.Drawable.DrawableContainer(drawableConfig);
      webUtils.initModel();

      // viewer.hideAllComponents();

      // viewer.overrideComponentsColorByObjectData([{ "categoryId": "-2000011" }, { "categoryId": "-2001330" }, { "categoryId": "-2000023" }], new Glodon.Web.Graphics.Color('#7396c3'));
      viewer.overrideComponentsColorByObjectData([{ "categoryId": "-2000011" }, { "categoryId": "-2000023" }], new Glodon.Web.Graphics.Color('#d7d7d7'));
      viewer.overrideComponentsColorByObjectData([{ "categoryId": "-2000032" }], new Glodon.Web.Graphics.Color('#8a8a8a'));//#6483ac
      // viewer.overrideComponentsColorByObjectData([{ "categoryId": "-2000032" }], new Glodon.Web.Graphics.Color('#7396c3'));


      // viewer.showComponentsByObjectData([
      //   { "categoryId": "-2000011" },//墙
      //   { "categoryId": "-2000151" },//常规模型
      //   { "categoryId": "-2001140" },//机械设备
      //   { "categoryId": "-2000032" },//楼板
      //   // { "categoryId": "-2000023" },//门
      //   // { "categoryId": "-2000120" }//楼梯
      // ]);
      viewer.hideComponentsByObjectData([{ "categoryId": "-2000100" }]);

      // viewer.addBlinkComponentsById(["2019375144970432.3144112", "2019375144970432.3151588", "2019375144970432.3151358"]);
      // viewer.setBlinkColor(new Glodon.Web.Graphics.Color("#FF0000", 0.8));
      viewer.overrideComponentsColorByObjectData(["2019375144970432.3144112", "2019375144970432.3151588", "2019375144970432.3151358"], new Glodon.Web.Graphics.Color("#FF0000", 0.8));
      // viewer.enableBlinkComponents(true);
      // viewer.setBlinkIntervalTime(1000);

      // viewer.setGlowEffectById(["2008010937968640.2494384", "2008010937968640.2425823"], { type: "outline", color: new Glodon.Web.Graphics.Color(255, 0, 0, 1) });
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
            viewer.setFloorExplosion(6, floorList, direction);
            viewer.render();
          });
        } else {
          viewer.setFloorExplosion(6, floorList, direction);
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
      "x": -71972.27135322015,
      "y": -96771.65447274146,
      "z": 100865.67389146521
    },
    "target": {
      "x": 243474.37793948737,
      "y": 216617.8762647885,
      "z": -87722.28580774585
    },
    "up": {
      "x": 0.27699679842282837,
      "y": 0.2751864324773532,
      "z": 0.9206221814859178
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