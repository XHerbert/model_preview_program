/**
 * @author:xuhb <xuhbd@foxmail.com>
 * @function:effect library
 */
import { Constant } from './Constants.js'

function EffectLibrary() {
    this.type = "Glodon.Effect.Library";
};

/**
 * @fileOverview 模块功能：模型效果库
 * @module EffectLibrary
 */
EffectLibrary.prototype = Object.assign(EffectLibrary.prototype, {

    constructor: EffectLibrary,

    /**
     * viewer 对象
     * @memberOf module:WebUtils#
     */
    viewer: null,

    /**
     * 电子围墙效果，可应用于防火分区等
     * @param {String} type 围墙动画方向  Normal：纵向  Tangent：横向 运动方式为沿着路径的切线方向
     * @param {Boolean} reverse 运动方向默认为逆时针
     * @param {Number} during 持续时长
     * @param {Number} height 高度
     * @param {Array} path 组成围墙路径的集合
     * @param {Color} color 围墙颜色
     */
    electricWallEffect: function (type, reverse, during, height, path, color) {
        let wallEffectConfig = new Glodon.Bimface.Plugins.Animation.WallEffectConfig();
        wallEffectConfig.viewer = this.viewer;
        wallEffectConfig.direction = {
            type: type || Constant.direction.Normal,
            reverse: reverse || false
        };

        wallEffectConfig.duration = during || 3500;
        wallEffectConfig.height = height || 40000;
        wallEffectConfig.path = path;
        // 电子围墙颜色
        wallEffectConfig.color = color;
        // 构造电子围墙扫描效果对象
        let wallEffect = new Glodon.Bimface.Plugins.Animation.WallEffect(wallEffectConfig);
    },

    /**
     * 火焰效果
     * @param {Object} firePosition 火焰位置
     * @param {Number} scale 火焰缩放大小 
     * @param {String} type 火焰类型 
     */
    fireEffect: function (firePosition, scale, type) {
        var firePos = firePosition || { x: 127558.6904568029, y: 322181.5967759746, z: 29999.99707529418 };
        let fireConfig = new Glodon.Bimface.Plugins.ParticleSystem.FireEffectConfig();
        fireConfig.position = firePos;
        // 设置火焰对象的viewer对象
        fireConfig.viewer = this.viewer;
        // 构造火焰对象
        let fireEffect = new Glodon.Bimface.Plugins.ParticleSystem.FireEffect(fireConfig);

        fireEffect.setType(type || Constant.fireType.Fire);
        fireEffect.setScale(scale);
        fireEffect.update();
    },

    /**
     * 飞线效果
     * @param {Object} eoManager 外部构件管理器实例
     * @param {Object} centerPoint 中心点坐标 
     * @param {Array} slavePoints 边缘点坐标集合 
     * @param {Color} color 飞线颜色 
     * @param {Number} width 飞线宽度 
     */
    flyLines: function (eoManager, centerPoint, slavePoints, color, width) {
        var flyCurve;
        var path = [], temp = [], flyCurvePoints = [];

        for (let s = 0, len = slavePoints.length; s < len; s++) {
            temp.push(centerPoint, slavePoints[s]);
            flyCurvePoints.push(temp);
            temp = [];
        }

        var style = {
            "lineType": "Continuous",
            "lineStyle": null
        };
        var count = 0;
        for (var i = 0; i < flyCurvePoints.length; i++) {
            // 构造曲线
            flyCurve = new Glodon.Bimface.Plugins.Geometry.SplineCurve(flyCurvePoints[i], color, width, style);
            path.push(flyCurve);
            // 拉伸曲线
            flyCurve.stretch();
            // 设置曲线贴图
            flyCurve.setMap({
                src: "https://static.bimface.com/attach/f4b5c5e71fce4090a63fc1c2e3839bd2_dynamic(1).png",
                // 允许颜色覆盖
                enableColorOverride: true
            },
                function () {
                    eoManager.addObject("flyCurve" + count, path[count]);
                    count++;
                });
        }

        let curveAnimationConfig = new Glodon.Bimface.Plugins.Animation.CurveAnimationConfig();
        // 配置Viewer对象、曲线对象、动画时间、动画循环、动画类型等参数
        curveAnimationConfig.viewer = this.viewer;
        curveAnimationConfig.curves = path;
        curveAnimationConfig.time = 1200;
        curveAnimationConfig.loop = true;
        curveAnimationConfig.type = "flow";
        // 构造曲线动画对象
        let curveAnimation = new Glodon.Bimface.Plugins.Animation.CurveAnimation(curveAnimationConfig);
        curveAnimation.play();
    }

});

export { EffectLibrary }