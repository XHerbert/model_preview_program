/**
 * @author:xuhongbo
 * @function:model helper,such as light 、axis 、plane
 */

import { WebUtils } from './WebUtils.js'
import { RoomUtils } from './RoomUtils.js'
import { Constant } from './Constants.js'

/**
 * @fileOverview 模块功能：模型工具包
 * @module ModelHelper
 */
function ModelHelper(viewer, eoManager) {
    this.eoManager = eoManager || null;
    this.viewer = viewer || null;
    this.webUtils = new WebUtils(this.viewer);
    this.roomUtils = new RoomUtils();
    this.type = "Glodon.Helper.ModelHelper";
}

ModelHelper.prototype = Object.assign(ModelHelper.prototype, {

    /**
     * 获取Scene对象
     * @param {Object} scene 非bimface场景时，传入的scene对象 
     * @returns {Object} 场景对象
     */
    getScene: function (scene) {
        return scene || this.viewer.getViewer().modelManager.getScene();
    },

    /**
     * 获取透视相机Camera对象
     * @param {Object} camera  非bimface场景时，传入的camera对象
     * @returns {Object} 相机对象
     */
    getPerspectiveCamera: function (camera) {
        return camera || this.viewer.getViewer().camera;
    },

    /**
     * 获取Render对象
     * @param {Object} renderer 非bimface场景时，传入的renderer对象
     * @returns {Object} 渲染器对象
     */
    getRender: function (renderer) {
        return renderer || this.viewer.getViewer().rendererManager.renderer.renderer;
    },

    /**
     * 创建辅助坐标轴
     * @param {Number} axisSize 坐标轴尺寸    
     */
    createAixsHelper: function (axisSize) {
        let axisHelper = new THREE.AxisHelper(axisSize || 3000);
        if (this.eoManager) {
            this.eoManager.addObject("axisHelper", axisHelper);
        }
        //this.viewer.addExternalObject();报错
    },

    /**
     * 创建辅助网格对象
     * @param {Number} size 坐标格尺寸
     * @param {Number} divisions 坐标格细分次数
     * @param {String} colorCenterLine  中线颜色
     * @param {String} colorGrid  坐标格网格线颜色
     * @param {Number} rotate  坐标格旋转角度，默认不旋转
     * @returns {Object} 网格辅助对象
     */
    createGridHelper: function (size, divisions, colorCenterLine, colorGrid, rotate) {
        let grid = new THREE.GridHelper(size || 10, divisions || 10, colorCenterLine, colorGrid);
        if (rotate) {
            grid.rotation.x = rotate;
        }
        return grid;
    },

    /**
     * 创建环境光Helper
     */
    createAmbientLightHelper: function () {
        let ambientLightHelper = new THREE.DirectionalLightHelper();
        this.viewer.addExternalObject("ambientLightHelper", ambientLightHelper);
    },

    /**
     * 创建标准的边界信息对象
     * @param {Array} pointArray 用于创建边界的点集 
     * @returns 边界对象
     */
    buildAreaBoundary: function (pointArray) {
        let boundary = {};
        boundary.version = "2.0";
        boundary.loops = [];
        boundary.loops[0] = [];

        for (let j = 0, len = pointArray.length; j < len; j++) {
            let arrayItem = [];
            if (j == len - 1) {
                arrayItem.push(pointArray[j]);
                arrayItem.push(pointArray[0]);
            } else {
                arrayItem.push(pointArray[j]);
                arrayItem.push(pointArray[j + 1]);
            }
            boundary.loops[0].push(arrayItem);
        }
        return boundary;
    },

    /**
     * 创建自定义标签
     * @param {Object} drawableContainer 标签容器
     * @param {Object} position 标签位置
     * @param {String} html 标签内容
     * @param {Function} html 单击标签回调事件
     */
    createCustomTag: function (drawableContainer, position, html, callback) {
        let config = new Glodon.Bimface.Plugins.Drawable.CustomItemConfig();
        let content = document.createElement('div');
        content.innerHTML = html;
        config.content = content;
        config.viewer = this.viewer;
        config.worldPosition = position;
        let customItem = new Glodon.Bimface.Plugins.Drawable.CustomItem(config);
        customItem.onClick(function (objectdata) {
            callback(objectdata);
        });

        drawableContainer.addItem(customItem);
    },

    /**
     * 创建3DMarker标签
     * @param {Object} marker3DContainer 3DMarker标签容器
     * @param {String} imageSrc 标签图片
     * @param {Object} position 标签位置
     * @param {String} tooltip 提示
     * @param {Fuction} callback 单击回调函数
     */
    createMarker3DTag: function (marker3DContainer, imageSrc, position, tooltip, callback) {

        var marker3dConfig = new Glodon.Bimface.Plugins.Marker3D.Marker3DConfig();
        marker3dConfig.src = imageSrc;
        marker3dConfig.worldPosition = position;
        marker3dConfig.tooltip = tooltip;
        var marker3d = new Glodon.Bimface.Plugins.Marker3D.Marker3D(marker3dConfig);
        marker3d.onClick(callback);
        marker3DContainer.addItem(marker3d);
    },

    /**
     * 场景中创建雾化效果
     * @param {String} color 雾颜色
     * @param {Number} near 近视点
     * @param {Number} far 远视点
     * @returns {Object} 雾对象
     */
    buildFog: function (color, near, far) {
        color = color || 0xcce0ff;
        near = near || 180;
        far = far || 250;
        return new THREE.Fog(color, near, far);
    },

    /**
     * 在模型中绘制矢量文本
     * @param {Object} viewer viewer对象 
     * @param {String} fontPath 字体路径
     * @param {Color} color 文本颜色
     * @param {Array} textArray 文本
     * @param {Number} fontSize 文本大小
     * @param {Number} opacity 文本透明度
     * @param {Number} rotate 旋转角度
     * @param {Boolean} wireframe 是否只显示边线
     */
    drawText: function (viewer, fontPath, color, textArray, fontSize, opacity, rotate, wireframe) {
        if (!textArray) {
            console.warn('textArray can not empty!');
            return;
        }

        var loader = new THREE.FontLoader();
        loader.load(fontPath, function (font) {

            var xMid = 0;
            let fontMaterial = new THREE.MeshBasicMaterial({ color: color, transparent: true, wireframe: wireframe, opacity: opacity, side: THREE.DoubleSide });

            for (let m = 0, len = this.textArray.length; m < len; m++) {

                let item = this.textArray[m];
                if (!item.boundingBox) continue;

                let bounding = JSON.parse(item.boundingBox);
                this.fontSize = ((bounding.max.x - bounding.min.x) * 0.08) > fontSize ? fontSize : ((bounding.max.x - bounding.min.x) * 0.08);

                let shapes = font.generateShapes(item.name, this.fontSize);
                let geometry = new THREE.ShapeGeometry(shapes);
                geometry.computeBoundingBox();

                xMid = - 0.5 * (geometry.boundingBox.max.x - geometry.boundingBox.min.x);
                geometry.translate(xMid, 0, 0);
                let textShape = new THREE.BufferGeometry();

                textShape.fromGeometry(geometry);
                text = new THREE.Mesh(textShape, fontMaterial);

                let centerX = (bounding.max.x + bounding.min.x) / 2;
                let centerY = (bounding.max.y + bounding.min.y) / 2;

                text.position.x = centerX;
                text.position.y = centerY;
                text.position.z = bounding.max.z + 5;
                viewer.addExternalObject(item.name, text);
            }
            viewer.render();
        });
    },

    /**
     * 在场景中根据外部构件名称获取外部构件
     * @param {Object} scene 场景对象
     * @param {String} name 外部构件名称
     * @returns {Object} 外部构件
     */
    getExternalObjectByName: function (scene, name) {
        return scene.getObjectByName(name);
    },

    /**
     * 启动路径动画
     * @param {Object} path 物体运动路径
     * @param {Number} time 完成动画所需时间
     * @param {Boolean} loop 是否循环执行动画
     * @param {Array} names 参数动画的构件集合
     */
    startPathAnimation: function (path, time, loop, names) {
        let pathAnimationConfig = new Glodon.Bimface.Plugins.Animation.PathAnimationConfig();
        pathAnimationConfig.viewer = this.viewer;
        pathAnimationConfig.path = path;
        pathAnimationConfig.time = time;
        pathAnimationConfig.loop = loop;
        pathAnimationConfig.objectNames = names;
        pathAnimationConfig.isPitchEnabled = true;
        pathAnimationConfig.isYawEnabled = true;
        pathAnimationConfig.originYaw = 0.5 * Math.PI;
        let pathAnimation = new Glodon.Bimface.Plugins.Animation.PathAnimation(pathAnimationConfig);
        pathAnimation.play();
    },

    /**
     * 创建模型拖拽控件
     * @param {Object} camera 相机对象
     * @param {Object} renderer 渲染器对象
     * @param {Number} dampingFactor 动态阻尼系数
     * @param {Number} minDistance 设置相机距离原点的最近距离
     * @param {Number} maxDistance 设置相机距离原点的最远距离
     * @returns 拖拽控件
     */
    buildOrbitControls: function (camera, renderer, dampingFactor, minDistance, maxDistance) {
        let controls = new THREE.OrbitControls(camera, renderer.domElement);
        // 使用阻尼,指定是否有惯性
        controls.enableDamping = true;
        // 动态阻尼系数 就是鼠标拖拽旋转灵敏度，阻尼越小越灵敏
        controls.dampingFactor = dampingFactor || 0.05;
        // 是否可以缩放
        controls.enableZoom = true;
        //是否自动旋转
        controls.autoRotate = false;
        //设置相机距离原点的最近距离
        controls.minDistance = minDistance || 10;
        //设置相机距离原点的最远距离
        controls.maxDistance = maxDistance || 600;
        //是否开启右键拖拽
        controls.enablePan = true;
        return controls;
    },

    /**
     * 为场景添加天空盒
     * @param {String} path 图片路径  
     * @param {Array} imageArray 图片组，六张图片分别是朝前的（posz）、朝后的（negz）、朝上的（posy）、朝下的（negy）、朝右的（posx）和朝左的（negx） 
     * @param {Object} scene scene 可选
     */
    setSkyBox: function (path, imageArray, scene) {
        //给场景添加天空盒子纹理
        let cubeTextureLoader = new THREE.CubeTextureLoader();
        cubeTextureLoader.setPath(path);
        /**
        var cubeTexture = cubeTextureLoader.load([
            'right.jpg', 'left.jpg',
            'top.jpg', 'bottom.jpg',
            'front.jpg', 'back.jpg'
        ]);
         */
        var cubeTexture = cubeTextureLoader.load(imageArray);
        let currentScene = this.getScene(scene);
        currentScene.background = cubeTexture;
    },

    /**
     * 绘制直线或折线线段，只有在bimface平台下可设置{width}参数
     * @param {Array} pointArray 用于绘制直线或折线线段的点集
     * @param {Number} width 直线或折线线段宽度
     * @param {String} color 十六进制直线或折线线段颜色 
     * @param {Number} alpha 线段颜色透明度     
     * @requires WebUtils
     * @returns {String} 返回直线或折线线段的名称
     */
    drawLine: function (pointArray, width, color, alpha) {
        let lineName = "line-" + this.webUtils.guid();
        let line = null;
        if (width > 1) {
            let splineCurve = new Glodon.Bimface.Plugins.Geometry.SplineCurve(pointArray);
            splineCurve.setWidth(width);
            splineCurve.setColor(this.webUtils.fromHexColor(color, alpha || 0.8));
            splineCurve.setType("polyline");
            line = splineCurve;
        } else {
            let lineGeometry = new THREE.Geometry();
            lineGeometry.vertices.push(
                pointArray[0], pointArray[1]
            );
            lineGeometry.colors.push(
                new THREE.Color(0xFFFF00 || color),
                new THREE.Color(0x808000 || color)
            )
            let lineMaterial = new THREE.LineBasicMaterial({ vertexColors: true });
            line = new THREE.Line(lineGeometry, lineMaterial);
        }
        this.viewer.addExternalObject(lineName, line);
        return lineName;
    },

    /**
     * 根据包围盒数据绘制包围盒
     * @param {Object} boundingBoxData 包围盒数据，包括尺寸、位置信息 
     * @param {String} faceColor 颜色
     * @param {NUmber} opacity 颜色透明度
     */
    drawBoundingBox: function (boundingBoxData, faceColor, opacity) {
        let boxGeometry = new THREE.BoxBufferGeometry(boundingBoxData.size.width, boundingBoxData.size.height, boundingBoxData.size.depth);
        let boxMaterial = new THREE.MeshBasicMaterial({ color: faceColor || 0xff0000, transparent: true, opacity: opacity || 0.3 });
        let boxMesh = new THREE.Mesh(boxGeometry, boxMaterial);
        boxMesh.position.x = boundingBoxData.position.x;
        boxMesh.position.y = boundingBoxData.position.y;
        boxMesh.position.z = boundingBoxData.position.z;
        this.viewer.addExternalObject(webUtils.guid(), boxMesh);
    },

    /**
     * 重写构件材质
     * @param {Object} materialContainer 材质容器
     * @param {String} image 材质贴图路径
     * @param {Number} offset 偏移
     * @param {Number} scale 缩放
     */
    buildMaterialConfig: function (materialContainer, image, offset, scale) {
        let materialConfig = new Glodon.Bimface.Plugins.Material.MaterialConfig();
        materialConfig.viewer = this.viewer;
        materialConfig.src = image;
        materialConfig.offset = offset;
        materialConfig.scale = scale || 1;
        let material = new Glodon.Bimface.Plugins.Material.Material(materialConfig);
        materialContainer.addMaterial(material);
    },

    /**
     * 复制选中的房间边界信息
     * @param {String} id 
     */
    copyBoundaryData: function (id) {
        let boundary_data = '';
        this.viewer.getAreas((d) => {
            let rooms = d[0].rooms;
            for (let h = 0, len = rooms.length; h < len; h++) {
                if (rooms[h].id === id) {
                    boundary_data = rooms[h];
                    console.log(boundary_data);
                    this.webUtils.copyStringValue(JSON.stringify(boundary_data));
                    break;
                }
            }
        });
    },

    /**
     * 恢复模型默认状态
     */
    resetModel: function () {
        if (this.viewer) {
            this.viewer.restoreAllDefault();
            this.viewer.setView(Glodon.Bimface.Viewer.ViewOption.Home, null);
            this.viewer.render();
        }
    },

    /**
     * 执行模型行为列表
     * @param {Array} data 模型行为队列数据，从接口获取
     */
    excuteModelBehaviour: function (data) {
        if (!data || !data.behaviourItemBeanList.length) {
            return;
        }

        this.resetModel();
        for (let i = 0, len = data.behaviourItemBeanList.length; i < len; i++) {
            let method = data.behaviourItemBeanList[i].behaviour;
            let params = data.behaviourItemBeanList[i].params;
            let color = '';
            let opacity = 1;
            //根据不同的key执行对应的方法
            switch (method) {
                case Constant.method.overrideComponentsColorByObjectData:
                    color = data.behaviourItemBeanList[i].actionValue.trim();
                    opacity = Number(data.behaviourItemBeanList[i].opacity);
                    viewer.overrideComponentsColorByObjectData(JSON.parse(params), new Glodon.Web.Graphics.Color(color, opacity));
                    break;
                case Constant.method.showComponentsByObjectData:
                    viewer.showComponentsByObjectData(JSON.parse(params));
                    break;
                case Constant.method.hideAllComponents:
                    viewer.hideAllComponents();
                    break;
                case Constant.method.hideComponentsByObjectData:
                    viewer.hideComponentsByObjectData(JSON.parse(params));
                    break;
                case Constant.method.showAllComponents:
                    viewer.showAllComponents();
                    break;
                case Constant.method.overrideComponentsColorById:
                    color = data.behaviourItemBeanList[i].actionValue.trim();
                    opacity = Number(data.behaviourItemBeanList[i].opacity);
                    viewer.overrideComponentsColorById(JSON.parse(params), new Glodon.Web.Graphics.Color(color, opacity));
                    break;
                case Constant.method.showComponentsById:
                    viewer.showComponentsById(JSON.parse(params));
                    break;
                case Constant.method.hideComponentsById:
                    viewer.hideComponentsById(JSON.parse(params));
                    break;
                case Constant.method.transparentComponentsByObjectData:
                    viewer.transparentComponentsByObjectData(JSON.parse(params));
                    break;
                case Constant.method.opaqueComponentsByObjectData:
                    viewer.opaqueComponentsByObjectData(JSON.parse(params));
                    break;
                case Constant.method.showExclusiveComponentsByObjectData:
                    viewer.showExclusiveComponentsByObjectData(JSON.parse(params));
                    break;
                default:
                    break;
            }
        }
        viewer.render();
    }
});

export { ModelHelper }
