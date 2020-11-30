/**
 * @author:xuhongbo
 * @function:shop sapce split and combine
 */

import { WebUtils } from '../package/WebUtils.js'
import { ModelHelper } from '../package/ModelHelper.js'
import { RoomUtils } from '../package/RoomUtils.js'
import { MathLibrary } from '../package/MathLibrary.js';

var app, viewer, maxX, maxY, minX, minY, objects = [], pointCollection = [], eoManager, newBoundary;
const SINGLE_FILE = 0;
const vertical = 1;
const horizontal = 2;
var BimfaceLoaderConfig = new BimfaceSDKLoaderConfig();
var webUtils = new WebUtils();
var math = new MathLibrary();

webUtils.getViewtoken(1650575476384896, SINGLE_FILE).then((token) => {
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
        viewer.setBorderLineEnabled(false);
        viewer.enableGlowEffect(true);
        window.viewer = viewer;
        webUtils.viewer = window.viewer;

        viewer.addEventListener(Glodon.Bimface.Viewer.Viewer3DEvent.ViewAdded, function () {
            eoManager = new Glodon.Bimface.Viewer.ExternalObjectManager(viewer);
            let modelHelper = new ModelHelper(viewer);
            modelHelper.createAixsHelper(viewer);
            let scene = modelHelper.getScene(), camera = modelHelper.getPerspectiveCamera(), renderer = modelHelper.getRender();
            renderer.domElement.addClass('canvasClass');
            window.scene = scene;
            renderer.shadowMap.enabled = true;
            viewer.enableShadow(false);
            renderer.alpha = true;
            renderer.setClearAlpha(0.08);

            // 设置捕获模式
            modelHelper.switchSnapMode(true);

            //基础设置
            viewer.hideViewHouse();
            document.getElementsByClassName('bf-toolbar bf-toolbar-bottom')[0].style.display = 'none';
            document.getElementsByClassName('gld-bf-tree')[0].style.display = 'none';
            document.getElementById('open-button').style.display = 'block';

            //创建房间
            pointCollection = [];
            var roomUtils = new RoomUtils(viewer);

            let leftArea = { "version": "2.0", "loops": [[[{ "z": 0.0, "y": 99.999999999873737, "x": 38506.136268202223 }, { "z": 0.0, "y": 99.99999999985306, "x": 44906.136268202215 }], [{ "z": 0.0, "y": 99.99999999985306, "x": 44906.136268202215 }, { "z": 0.0, "y": 8899.9999999998527, "x": 44906.136268202237 }], [{ "z": 0.0, "y": 8899.9999999998527, "x": 44906.136268202237 }, { "z": 0.0, "y": 8899.9999999998672, "x": 41006.136268202237 }], [{ "z": 0.0, "y": 8899.9999999998672, "x": 41006.136268202237 }, { "z": 0.0, "y": 8899.9999999998745, "x": 38506.136268202237 }], [{ "z": 0.0, "y": 8899.9999999998745, "x": 38506.136268202237 }, { "z": 0.0, "y": 99.999999999873737, "x": 38506.136268202223 }]]] };
            let rightArea = { "version": "2.0", "loops": [[[{ "z": 0.0, "y": 99.999999999895067, "x": 31906.136268202226 }, { "z": 0.0, "y": 99.999999999874376, "x": 38306.13626820223 }], [{ "z": 0.0, "y": 99.999999999874376, "x": 38306.13626820223 }, { "z": 0.0, "y": 8899.9999999998745, "x": 38306.136268202237 }], [{ "z": 0.0, "y": 8899.9999999998745, "x": 38306.136268202237 }, { "z": 0.0, "y": 8899.9999999998963, "x": 31906.136268202241 }], [{ "z": 0.0, "y": 8899.9999999998963, "x": 31906.136268202241 }, { "z": 0.0, "y": 99.999999999894968, "x": 31906.136268202226 }]]] };
            let areaList = [];
            areaList.push(leftArea);
            areaList.push(rightArea);
            newBoundary = roomUtils.mergeBoundaryPipeline(areaList, "origin");

            viewer.createRoom({ "version": "2.0", "loops": [[[{ "z": 0.0, "y": 8899.9999999999982, "x": 100.00000000001437 }, { "z": 0.0, "y": 99.99999999999784, "x": 100.00000000000017 }], [{ "z": 0.0, "y": 99.99999999999784, "x": 100.00000000000017 }, { "z": 0.0, "y": 99.999999999977135, "x": 6506.1362682022218 }], [{ "z": 0.0, "y": 99.999999999977135, "x": 6506.1362682022218 }, { "z": 0.0, "y": 8899.9999999999764, "x": 6506.1362682022354 }], [{ "z": 0.0, "y": 8899.9999999999764, "x": 6506.1362682022354 }, { "z": 0.0, "y": 8899.9999999999873, "x": 3606.1362682022323 }], [{ "z": 0.0, "y": 8899.9999999999873, "x": 3606.1362682022323 }, { "z": 0.0, "y": 8899.9999999999982, "x": 100.00000000001462 }]]] }, 3300, "1151511");
            viewer.createRoom({ "version": "2.0", "loops": [[[{ "z": 0.0, "y": 99.999999999976481, "x": 6706.1362682022218 }, { "z": 0.0, "y": 99.999999999955818, "x": 13106.136268202223 }], [{ "z": 0.0, "y": 99.999999999955818, "x": 13106.136268202223 }, { "z": 0.0, "y": 8899.9999999999563, "x": 13106.136268202239 }], [{ "z": 0.0, "y": 8899.9999999999563, "x": 13106.136268202239 }, { "z": 0.0, "y": 8899.9999999999764, "x": 6706.1362682022354 }], [{ "z": 0.0, "y": 8899.9999999999764, "x": 6706.1362682022354 }, { "z": 0.0, "y": 99.999999999977263, "x": 6706.1362682022218 }]]] }, 3300, "vdfvf");
            viewer.createRoom({ "version": "2.0", "loops": [[[{ "z": 0.0, "y": 99.999999999955165, "x": 13306.136268202221 }, { "z": 0.0, "y": 99.999999999934474, "x": 19706.136268202226 }], [{ "z": 0.0, "y": 99.999999999934474, "x": 19706.136268202226 }, { "z": 0.0, "y": 8899.9999999999345, "x": 19706.136268202241 }], [{ "z": 0.0, "y": 8899.9999999999345, "x": 19706.136268202241 }, { "z": 0.0, "y": 8899.9999999999563, "x": 13306.136268202235 }], [{ "z": 0.0, "y": 8899.9999999999563, "x": 13306.136268202235 }, { "z": 0.0, "y": 99.9999999999556, "x": 13306.136268202221 }]]] }, 3300, "ssdsds");
            viewer.render();

            var roomUtils2 = new RoomUtils(viewer);
            let areaLists = [];
            areaLists.push({ "version": "2.0", "loops": [[[{ "z": 0.0, "y": 8899.9999999999982, "x": 100.00000000001437 }, { "z": 0.0, "y": 99.99999999999784, "x": 100.00000000000017 }], [{ "z": 0.0, "y": 99.99999999999784, "x": 100.00000000000017 }, { "z": 0.0, "y": 99.999999999977135, "x": 6506.1362682022218 }], [{ "z": 0.0, "y": 99.999999999977135, "x": 6506.1362682022218 }, { "z": 0.0, "y": 8899.9999999999764, "x": 6506.1362682022354 }], [{ "z": 0.0, "y": 8899.9999999999764, "x": 6506.1362682022354 }, { "z": 0.0, "y": 8899.9999999999873, "x": 3606.1362682022323 }], [{ "z": 0.0, "y": 8899.9999999999873, "x": 3606.1362682022323 }, { "z": 0.0, "y": 8899.9999999999982, "x": 100.00000000001462 }]]] });
            areaLists.push({ "version": "2.0", "loops": [[[{ "z": 0.0, "y": 99.999999999976481, "x": 6706.1362682022218 }, { "z": 0.0, "y": 99.999999999955818, "x": 13106.136268202223 }], [{ "z": 0.0, "y": 99.999999999955818, "x": 13106.136268202223 }, { "z": 0.0, "y": 8899.9999999999563, "x": 13106.136268202239 }], [{ "z": 0.0, "y": 8899.9999999999563, "x": 13106.136268202239 }, { "z": 0.0, "y": 8899.9999999999764, "x": 6706.1362682022354 }], [{ "z": 0.0, "y": 8899.9999999999764, "x": 6706.1362682022354 }, { "z": 0.0, "y": 99.999999999977263, "x": 6706.1362682022218 }]]] });
            areaLists.push({ "version": "2.0", "loops": [[[{ "z": 0.0, "y": 99.999999999955165, "x": 13306.136268202221 }, { "z": 0.0, "y": 99.999999999934474, "x": 19706.136268202226 }], [{ "z": 0.0, "y": 99.999999999934474, "x": 19706.136268202226 }, { "z": 0.0, "y": 8899.9999999999345, "x": 19706.136268202241 }], [{ "z": 0.0, "y": 8899.9999999999345, "x": 19706.136268202241 }, { "z": 0.0, "y": 8899.9999999999563, "x": 13306.136268202235 }], [{ "z": 0.0, "y": 8899.9999999999563, "x": 13306.136268202235 }, { "z": 0.0, "y": 99.9999999999556, "x": 13306.136268202221 }]]] });
            roomUtils2.mergeBoundaryPipeline(areaLists);
            viewer.render();


            let pointArray = [];
            let lineName;
            viewer.addEventListener(Glodon.Bimface.Viewer.Viewer3DEvent.MouseClicked, function (e) {
                if (!e.objectId) return;
                //测试禁用选中
                //viewer.removeSelectedId([e.objectId]);
                //viewer.render();

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

                if (window.bim.drawRooms) {
                    pointArray.push(new THREE.Vector3(e.worldPosition.x, e.worldPosition.y, e.worldPosition.z));
                    if (pointArray.length == 2) {
                        viewer.hideRoomsById(["origin"]);
                        viewer.render();
                        if (lineName) {
                            eoManager.removeById(eoManager.getObjectIdByName(lineName));
                        }
                        try {
                            //计算直线方程
                            math.resolveEquation(pointArray);

                            //寻找交点
                            let crossPoint = math.findCrossPoint(newBoundary, pointArray, e.worldPosition.z);

                            //绘制切割线线段
                            lineName = modelHelper.drawLine(crossPoint.pointCollection, 10, "#FFFFFF", 1);

                            //绘制空间
                            viewer.createRoom(math.buildSplitAreas(crossPoint.crossObjectArray)[0], e.worldPosition.z, "first", webUtils.fromColor(255, 0, 0, 0.5), webUtils.fromColor(255, 0, 0, 1));
                            viewer.createRoom(math.buildSplitAreas(crossPoint.crossObjectArray)[1], e.worldPosition.z, "second", webUtils.fromColor(0, 255, 0, 0.5), webUtils.fromColor(0, 255, 0, 1));
                            pointArray = [];
                        } catch (error) {
                            console.log(error);
                            pointArray = [];
                        }
                    }
                }
            });

            //配置相机
            setCamera(viewer, bindEvent);
        });
    }
};


function drop(event) {
    event.preventDefault();
    var data = event.dataTransfer.getData("Text");
    //TODO:logic of effective to apply
    //event.target.appendChild(document.getElementById(data));
    let sel = viewer.getSelectedComponents();
    if (!sel.length) {
        alert("error");
        return;
    }
    // viewer.overrideComponentsColorById(sel, new Glodon.Web.Graphics.Color('#FF0000'));
    viewer.setGlowEffectById([sel], { type: "outline", color: new Glodon.Web.Graphics.Color(255, 255, 160, 1) });
    viewer.render();
    console.log(data);

}

function drag(ev) {
    ev.dataTransfer.setData("Text", ev.target.id);
}

function allowDrop(ev) {
    ev.preventDefault();
}

function onSDKLoadFailed(error) {
    console.log("Failed to load SDK!");
};


function bindEvent() {
    document.getElementById("horizon").onclick = function () {
        let keyword = '房间 1';
        viewer.getAreas((d) => {
            let b = d[0].rooms;
            for (let h = 0, len = d[0].rooms.length; h < len; h++) {
                if (d[0].rooms[h].name.indexOf(keyword) > -1) {
                    console.log(d[0].rooms[h]);
                }
            }
        });
    }

    document.getElementById("vertial").onclick = function () {
        let id = "220730";
        viewer.getAreas((d) => {
            let b = d[0].rooms;
            for (let h = 0, len = d[0].rooms.length; h < len; h++) {
                if (d[0].rooms[h].id === id) {
                    console.log(d[0].rooms[h]);
                }
            }
        });
    }

    document.getElementById('source').ondragstart = drag;
    document.getElementById('view').ondrop = drop;
    document.getElementById('view').ondragover = allowDrop;
}

function setCamera(viewer, callback) {
    let start = {
        "name": "persp",
        "position": {
            "x": -19160.77874765213,
            "y": -27160.436944213947,
            "z": 48351.901994318665
        },
        "target": {
            "x": 26441.290265272833,
            "y": 18441.800185267017,
            "z": 2750.0000276237247
        },
        "up": {
            "x": 0,
            "y": -0.0000036732050930154486,
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
            "x": 50031.246990425294,
            "y": -12343.379487725882,
            "z": 15045.743836760397
        },
        "target": {
            "x": 5982.546590778242,
            "y": 41689.91280856774,
            "z": -22085.9341374516
        },
        "up": {
            "x": -0.2970451696282537,
            "y": 0.36437272858367964,
            "z": 0.8826078868132814
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
                viewer.recordCustomHomeview(target);
            })
        }, 800);
    });








}

