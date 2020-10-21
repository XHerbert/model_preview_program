/**
 * @author:xuhongbo
 * @function:Math Library
 */

import { WebUtils } from './WebUtils.js'
import { RoomUtils } from './RoomUtils.js'
import { ModelHelper } from './ModelHelper.js'
/**
 * @fileOverview 模块功能：数学、算法工具包
 * @module MathLibrary
 */
function MathLibrary() {
    this.type = "Glodon.Math.Library";
};

MathLibrary.prototype = Object.assign(MathLibrary.prototype, {

    /**
     * 获取指定大小区间随机数
     * @param {Number} min 最小值
     * @param {Number} max 最大值
     * @returns {Number} 最大值与最小值间的随机数
     */
    getRandomInt: function (min, max, scale) {
        (scale <= 0 || !scale) && (scale = 1.0);
        min = Math.ceil(min);
        max = Math.floor(max);
        return (Math.floor(Math.random() * (max - min)) + min) * scale;
    },

    /**
     * 2D坐标转3D
     * @param {Object} event 点击事件对象
     * @param {Object} camera 相机对象
     * @requires WebUtils
     * @returns {Vector3} 3D坐标值
     */
    getLocalPosition: function (event, camera) {
        let modelHelper = new ModelHelper();
        modelHelper.getPerspectiveCamera(camera);

        let mouse = new THREE.Vector2();
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

        return new THREE.Vector3(mouse.x, mouse.y, 0);
    },

    /**
     *  3D坐标转2D
     * @param {Vector3} vector3 
     * @param {Object} camera 
     * @returns {Vector2} 2D坐标值
     */
    get2dPosition(vector3, camera) {
        if (!camera) {
            return;
        }
        var standardVector = vector3.project(camera);//世界坐标转标准设备坐标
        var a = window.innerWidth / 2;
        var b = window.innerHeight / 2;
        var x = Math.round(standardVector.x * a + a);//标准设备坐标转屏幕坐标
        var y = Math.round(-standardVector.y * b + b);//标准设备坐标转屏幕坐标
        return new THREE.Vector2(x, y);
    },

    /**
     * 颜色归一化
     * @param {Vector3} color 三维颜色向量，如Vector3(120,120,255)
     * @returns {Vector3} 归一化后的三维颜色向量
     */
    normalizeColor: function (color) {
        return new THREE.Vector3(color.x / 255, color.y / 255, color.z / 255);
    },

    /**
     * 根据二维坐标点集和求解二元一次方程直线
     * @param {Array} pointArray 二维坐标点集合 [{x:100,y:200},{x:200,y:400}]
     * @returns {Object} 返回直线【Y = Ax + b】的斜率【A】和截距【b】  
     */
    resolveEquation: function (pointArray) {
        let result = {
            A: 0, b: 0
        };
        if (!pointArray || !pointArray.length) {
            console.warn("parameter pointArray invalidate!");
            return;
        }

        //解方程 Y = Ax + b 核心算法，此处考虑要不要四舍五入
        let A, b
        //不存在斜率
        if (Math.round(pointArray[1].y) === Math.round(pointArray[0].y)) {
            A = 0;
            b = pointArray[0].y;
            console.log("点集" + JSON.stringify(pointArray) + "对应的二元一次方程为：Y = " + b);
        } else if (Math.round(pointArray[0].x) === Math.round(pointArray[1].x)) {
            A = 0;
            b = pointArray[0].x;
            console.log("点集" + JSON.stringify(pointArray) + "对应的二元一次方程为：X = " + b);
        }
        //存在斜率
        else {
            A = (pointArray[1].y - pointArray[0].y) / (pointArray[1].x - pointArray[0].x);
            b = pointArray[0].y - pointArray[0].x * (pointArray[0].y - pointArray[1].y) / (pointArray[0].x - pointArray[1].x);
            console.log("点集" + JSON.stringify(pointArray) + "对应的二元一次方程为：Y = " + A + "*x + " + b);
        }
        result.A = A;
        result.b = b;
        return result;
    },

    /**
     * 根据点集合与边界计算交点
     * @param {Object} boundary 空间边界数据
     * @param {Array} pointArray 分割点集合
     * @param {Number} height 高度
     * @requires RoomUtils
     * @returns {Array} crossPointArray 直线与边界交点集合
     */
    findCrossPoint: function (boundary, pointArray, height) {
        let roomUtils = new RoomUtils();
        //整理边界数据
        boundary = roomUtils.cleanBoundaryData(boundary);
        //计算分割点集所在的直线方程 Y = Ax + b
        let { A, b } = this.resolveEquation(pointArray);
        let pointList = boundary.loops[0];
        //直线与边界的交点集合，N条边N个点，最终会保留两个交点
        let pointCollection = [];
        let crossObjectArray = [];
        for (let n = 0, len = pointList.length; n < len; n++) {
            //item => 标识线段的两端点集合 [{x:x,y:y},{x:x,y:y}]
            let item = pointList[n];
            let roundX0 = Math.round(item[0].x), roundX1 = Math.round(item[1].x);
            let roundY0 = Math.round(item[0].y), roundY1 = Math.round(item[1].y);
            let crossObject = { item: item, cross: false, crossBy: undefined };
            //当边界线是垂直直线
            if (roundX0 === roundX1) {
                let y = this.calculateCoordinate(A, b, item[0].x, 0);
                let point = { x: item[0].x, y: y, z: height };
                //如果交点Y坐标在线段两端之间则加入到集合
                if (Math.min(item[0].y, item[1].y) < y && Math.max(item[0].y, item[1].y) > y) {
                    pointCollection.push(new THREE.Vector3(point.x, point.y, point.z));
                    crossObject.cross = true;
                    crossObject.crossBy = new THREE.Vector3(point.x, point.y, point.z);
                }
            }

            //当边界线是水平直线
            if (roundY0 === roundY1) {
                let x = this.calculateCoordinate(A, b, 0, item[0].y);
                let point = { x: x, y: item[0].y, z: height };
                //如果交点X坐标在线段两端之间则加入到集合
                if (Math.min(item[0].x, item[1].x) < x && Math.max(item[0].x, item[1].x) > x) {
                    pointCollection.push(new THREE.Vector3(point.x, point.y, point.z));
                    crossObject.cross = true;
                    crossObject.crossBy = new THREE.Vector3(point.x, point.y, point.z);
                }
            }
            crossObjectArray.push(crossObject);
            //其他情形暂不考虑，先验证可行性与准确性            
        }
        return { pointCollection: pointCollection, crossObjectArray: crossObjectArray };
    },

    /**
     * 根据直线方程求坐标点
     * @param {Number} A 直线斜率 
     * @param {Number} b 直线截距
     * @param {Number} x X坐标，如果X已知则Y传0
     * @param {Number} y Y坐标，如果Y已知则X传0
     * @returns {Number} X或Y坐标的值
     */
    calculateCoordinate: function (A, b, x, y) {
        //如果x没有传值，求x；如果y没有传值，求y；
        if (!x) {
            if (A == 0) {
                console.warn("Y = b!");
                return b;
            }
            return (y - b) / A;
        } else {
            return A * x + b;
        }
    },

    /**
     * 创建拆分后的空间
     * @param {Array} crossObjectArray 用于拆分空间的点集合 
     * @requires WebUtils
     * @requires ModelHelper
     * @returns {Array} 拆分后的空间边界集合
     */
    buildSplitAreas: function (crossObjectArray) {
        if (!crossObjectArray) return;
        console.log(crossObjectArray);

        var webUtils = new WebUtils();
        var modelHelper = new ModelHelper();
        //标识切割边是否相邻
        let isAdjacent = false;
        let boundaryCollection = [];
        //区分邻边还是对边
        for (let i = 0, len = crossObjectArray.length; i < len; i++) {
            if (i !== len - 1 && crossObjectArray[i].cross && crossObjectArray[i + 1].cross) {
                isAdjacent = true;
            }
        };
        //首尾相接时
        if (crossObjectArray[0].cross && crossObjectArray[crossObjectArray.length - 1].cross) {
            isAdjacent = true;
        }

        console.log(isAdjacent);
        //如果交点相邻
        if (isAdjacent) {
            //找到切割点的公共点作为中间点构件边界
            let boundaryPoints = [];
            let boundary = crossObjectArray.filter(p => { return p.cross });

            //找到公共点，如果不是首尾相接，取中间，否则取两边
            let commonPoint = webUtils.isObjectEqual(boundary[0].item[0], boundary[1].item[1]) ? boundary[0].item[0] : boundary[0].item[1];

            //寻找相交线中非公共点
            let leftPoint = [];
            webUtils.isObjectEqual(boundary[0].item[0], boundary[1].item[1]) ? leftPoint.push(boundary[0].item[1], boundary[1].item[0]) : leftPoint.push(boundary[0].item[0], boundary[1].item[1]);


            for (let k = 0, len = boundary.length; k < len; k++) {
                boundary[k].crossBy.z = 0;
                boundaryPoints.push(boundary[k].crossBy);
            }
            boundaryPoints.splice(1, 0, commonPoint);

            //获取三角侧边界对象
            var boundarys = modelHelper.buildAreaBoundary(boundaryPoints);
            boundaryCollection.push(boundarys);

            //开始寻找另一侧点集
            let oppositeBoundary = crossObjectArray.filter(p => { return !p.cross });
            let oppositePoint = webUtils.isObjectEqual(oppositeBoundary[0].item[0], oppositeBoundary[1].item[1]) ? oppositeBoundary[0].item[0] : oppositeBoundary[0].item[1];

            //组装另一侧空间边界
            leftPoint.splice(1, 0, oppositePoint);

            //点集排序
            if (leftPoint[0].x === boundary[0].crossBy.x || leftPoint[0].y === boundary[0].crossBy.y) {
                leftPoint.splice(0, 0, boundary[0].crossBy);
                leftPoint.splice(leftPoint.length, 0, boundary[1].crossBy);
            } else {
                leftPoint.splice(0, 0, boundary[1].crossBy);
                leftPoint.splice(leftPoint.length, 0, boundary[0].crossBy);
            }

            //获取非三角侧边界对象
            console.log("leftPoint", leftPoint);
            var boundarys2 = modelHelper.buildAreaBoundary(leftPoint);
            boundaryCollection.push(boundarys2);

        } else {
            let points = [];
            //如果交点非相邻（对边）
            if (crossObjectArray[0].cross) {
                crossObjectArray[0].crossBy.z = crossObjectArray[2].crossBy.z = 0;
                points.push(crossObjectArray[3].item[0], crossObjectArray[3].item[1], crossObjectArray[0].crossBy, crossObjectArray[2].crossBy);
                boundaryCollection.push(modelHelper.buildAreaBoundary(points));
                points = [];
                points.push(crossObjectArray[0].crossBy, crossObjectArray[1].item[0], crossObjectArray[1].item[1], crossObjectArray[2].crossBy);
                boundaryCollection.push(modelHelper.buildAreaBoundary(points));
            } else {
                crossObjectArray[1].crossBy.z = crossObjectArray[3].crossBy.z = 0;
                points.push(crossObjectArray[0].item[0], crossObjectArray[0].item[1], crossObjectArray[1].crossBy, crossObjectArray[3].crossBy);
                boundaryCollection.push(modelHelper.buildAreaBoundary(points));
                points = [];
                points.push(crossObjectArray[1].crossBy, crossObjectArray[2].item[0], crossObjectArray[2].item[1], crossObjectArray[3].crossBy);
                boundaryCollection.push(modelHelper.buildAreaBoundary(points));
            }
        }
        return boundaryCollection;

    },

    /**
     * 边界对象转换
     * @param {Array} boundary 
     */
    convertBoundary: function (boundary) {

    },

    /**
     * 从一系列的点创建一条平滑的三维样条曲线
     * @param {Array} points 点集
     * @param {Boolean} closed 是否闭合
     * @returns {THREE.CatmullRomCurve3} 三维曲线路径
     */
    createCurve: function (points, closed) {
        let path = new THREE.CatmullRomCurve3(points, closed || true, "catmullrom", 5);
        return path;
    },

    /**
     * 获取3*3单位矩阵
     */
    getThreeMatrix: function () {
        return [1, 0, 0, 0, 1, 0, 0, 0, 1];
    },

    /**
     * 获取4*4单位矩阵
     */
    getFourMatrix: function () {
        return [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];
    },

    /**
     * 根据包围盒数据绘制出场景或构件的包围盒
     * @param {Object} boundingBox 构件或场景的包围盒数据对象 
     * @returns {Object} 返回包围和尺寸和位置
     */
    getDrawBoundingBoxData: function (boundingBox) {
        let max = boundingBox.max;
        let min = boundingBox.min;

        let size = { width: 0, height: 0, depth: 0 };
        size.width = max.x - min.x;
        size.height = max.y - min.y;
        size.depth = max.z - min.z;

        let position = { x: 0, y: 0, z: 0 };
        position.x = min.x + width / 2;
        position.y = min.y + height / 2;
        position.z = min.z + depth / 2;

        return { size: size, position: position };
    },

    /**
     * 将Float32数组按单元分组
     * @param {Array} array Float32 数组 
     * @param {Number} group 分组单元，一般3个元素为一组 
     */
    convertArrayToVectorList: function (array, group) {
        let vector3List = [];
        for (let i = 0; i < array.length; i += group) {
            let subGroup = new THREE.Vector3(array[i], array[i + 1], array[i + 2]);
            vector3List.push(subGroup);
        }
        return vector3List;
    }
});

export { MathLibrary }