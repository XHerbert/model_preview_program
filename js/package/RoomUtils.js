/**
 * @author:xuhb <xuhbd@foxmail.com>
 * @function:room utils
 */
import { WebUtils } from './WebUtils.js'
import { ModelHelper } from './ModelHelper.js';
/**
 * @fileOverview 模块功能：空间工具包
 * @module RoomUtils
 */
function RoomUtils(viewer) {
    this.viewer = viewer || window.viewer;
    this.type = "Glodon.Utils.Room";
}

var maxX, maxY, minX, minY;
var webUtils = new WebUtils();

RoomUtils.prototype = Object.assign(RoomUtils.prototype, {

    constructor: RoomUtils,

    /**
     * viewer 对象
     * @memberOf module:RoomUtils#
     */
    viewer: null,

    /**
     * 存储极值点的集合
     * @memberOf module:RoomUtils#
     */
    pointCollection: [],

    /**
     * 空间分割方向 1：纵向 2：横向
     * @memberOf module:RoomUtils#
     */
    direction: null,

    /**
     * 空间合并处理管道，适用于多个规则且相邻的矩形空间
     * @param {Array} boundaryArray 空间边界数据数组(必填)
     * @param {String} id 空间唯一标识(非必填)
     * @param {Number} height 空间高度(非必填)
     * @param {Glodon.Web.Graphics.Color} faceColor 空间表面颜色(非必填)
     * @param {Glodon.Web.Graphics.Color} frameColor 空间轮廓颜色(非必填)
     * @returns {Object} 新构造的空间边界
     * @requires WebUtils
     * @public
     */
    mergeBoundaryPipeline: function (boundaryArray, id, height, faceColor, frameColor) {
        if (!boundaryArray || !boundaryArray.length) {
            console.warn("boundaryArray is empty!");
            return;
        }

        const vertical = 1;
        for (let n = 0, len = boundaryArray.length; n < len; n++) {
            //第一步：整理数据，去除小数部分
            let cleanData = this.cleanBoundaryData(boundaryArray[n]);
            //第二步：将所有的点数据存储至一维数组
            this.storePointArray(cleanData);
        }

        //第三步：筛选极值点
        let extremum = this.extremumBoundaryPoint(this.pointCollection, vertical);
        //第四步：根据极值点构造新边界
        let newBoundary = this.buildBoundary(extremum);
        this.viewer.createRoom(newBoundary, height || 5500, id || webUtils.guid(), faceColor || webUtils.fromHexColor('#ff0000', 0.25), frameColor || webUtils.fromHexColor('#ff0000'));
        return newBoundary;
    },

    /**
     * 整理空间边界数据，去除小数部分
     * @param {Object} boundaryData 空间边界数据
     * @returns {Object} 去除小数部分的空间边界数据
     */
    cleanBoundaryData: function (boundaryData) {

        for (let m = 0, len = boundaryData.loops[0].length; m < len; m++) {
            let root = boundaryData.loops[0];
            for (let n = 0, sublength = root[m].length; n < sublength; n++) {
                let sub = root[m];

                //对数据进行简化
                sub[n].x = Math.round(sub[n].x);
                sub[n].y = Math.round(sub[n].y);
                sub[n].z = Math.round(sub[n].z);
            }
        }

        this.storePointArray(boundaryData);
        return boundaryData;

    },

    /**
     * 验证并存储空间边界顶点数据
     * @param {Object} boundaryData 整理后的空间边界数据
     * @returns {Array} 取出边界对象的顶点，存入顶点坐标集合
     */
    storePointArray: function (boundaryData) {
        let pointArray = [];
        for (let m = 0, len = boundaryData.loops[0].length; m < len; m++) {
            let root = boundaryData.loops[0];
            for (let n = 0, sublen = root[m].length; n < sublen; n++) {
                let sub = root[m];

                //依次存储边界点数据
                pointArray.push(sub[n]);

            }
        }
        let result = this.validatePointData(pointArray);
        if (!result) {
            console.warn("boundary data invalid!", pointArray);
            return;
        }

        //pointCollection用于存储多个空间的点位数据
        this.pointCollection = this.pointCollection.concat(pointArray);
        return pointArray;
    },

    /**
     * 验证边界点集合是否首尾相接
     * @param {Object} pointArray 边界点集合
     * @returns {Boolean} 是否符合收尾相接
     */
    validatePointData: function (pointArray) {

        let len = pointArray.length;
        let result = true;
        for (let i = 1; i < len; i += 2) {
            //如果是最后一个点
            if (i >= len - 1) {
                let first = pointArray[0];
                let last = pointArray[len - 1];
                if (!webUtils.isObjectEqual(first, last)) {
                    console.warn("data not closed!");
                    result = false;
                }
            } else {
                let before = pointArray[i];
                let after = pointArray[i + 1];
                if (!webUtils.isObjectEqual(before, after)) {
                    console.warn("data not closed!");
                    result = false;
                }
            }
        }
        return result;

    },


    /**
     * 通过顶点集合获取极值点，以便构造新的空间边界
     * @param {Array} pointCollection 被合并前的多个空间的顶点集合
     * @param {Number} direction 原空间的分隔方向 1：纵向 2：横向
     * @returns {Array} 从一系列顶点中筛选出的顶点集合
     */
    extremumBoundaryPoint: function (pointCollection, direction) {
        const vertical = 1, horizontal = 2;
        let extremumPoint = [];
        minX = maxX = pointCollection[0].x;
        minY = maxY = pointCollection[0].y;
        for (let n = 1, len = pointCollection.length; n < len; n++) {
            pointCollection[n].x > maxX ? maxX = pointCollection[n].x : null;
            pointCollection[n].x < minX ? minX = pointCollection[n].x : null;
            pointCollection[n].y > maxY ? maxY = pointCollection[n].y : null;
            pointCollection[n].y < minY ? minY = pointCollection[n].y : null;
        }

        for (let k = 0, len = pointCollection.length; k < len; k++) {
            let currentPoint = pointCollection[k];
            if (direction === 1) {
                if (!(currentPoint.x > minX && currentPoint.x < maxX)) {
                    let exist = extremumPoint.some(item => {
                        if (item.x == currentPoint.x && item.y == currentPoint.y) {
                            return true;
                        }
                        return false;
                    })

                    if (!exist) {
                        extremumPoint.push(currentPoint);
                    }

                } else {
                    // console.log("分割方向：纵向");
                }
            }
            if (direction === 2) {
                if (!(currentPoint.y > minY && currentPoint.y < maxY)) {
                    let exist = extremumPoint.some(item => {
                        if (item.x == currentPoint.x && item.y == currentPoint.y) {
                            return true;
                        }
                        return false;
                    })

                    if (!exist) {
                        extremumPoint.push(currentPoint);
                    }
                    // console.log("分割方向：横向");
                }
            }
        }
        //对符合条件的点集进行顺时针排序，思路是找到最大和最小占1、3索引，剩余的两个点随机
        return extremumPoint;

    },

    /**
     * 通过极值点构造新的边界数据
     * @param {Array} extremumPoints 边界极值点
     * @requires ModelHelper
     * @returns {Object} boundary 空间边界   
     */
    buildBoundary: function (extremumPoints) {

        let copy = Object.assign([], extremumPoints);
        copy.forEach(item => {
            if (item.x === maxX && item.y === maxY) {
                extremumPoints[0] = item;
            }
            if (item.x === minX && item.y === minY) {
                extremumPoints[2] = item;
            }
            if (item.x === maxX && item.y === minY) {
                extremumPoints[1] = item;
            }
            if (item.x === minX && item.y === maxY) {
                extremumPoints[3] = item;
            }
        });
        //排序完成后开始构造新的边界数据
        let modelHelper = new ModelHelper();
        let boundary = modelHelper.buildAreaBoundary(extremumPoints);
        return boundary;
    },

    /**
     * 通过一系列的有序点集构造空间
     * @param {Array} pointArray 点集
     * @param {Number} height 高度
     * @param {String} name 空间名称
     * @param {Glodon.Web.Graphics.Color} faceColor 空间颜色
     * @param {Glodon.Web.Graphics.Color} borderColor 空间边界颜色
     * @returns {String} 空间名称
   */
    drawAreaByClickPoints: function (pointArray, height, name, faceColor, borderColor) {
        if (!pointArray || !pointArray.length) {
            console.warn("pointArray is empty!")
            return;
        }
        let boundary = this.buildBoundary(pointArray);
        console.log(name, boundary);
        let ret = this.viewer.createRoom(boundary, height, name, faceColor, borderColor);
        return ret;
    },
});

export { RoomUtils }

