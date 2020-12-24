/**
 * @author:xuhongbo
 * @function:global constans
 */

/**
 * @fileOverview 模块功能：全局常量包
 * @module Constant
 */
var Constant = {

    /**
     * 电子围墙动画方向
     */
    direction: {
        Normal: "Normal",
        Tangent: "Tangent"
    },
    /**
     * 火焰类型
     */
    fireType: {
        Fire: "Fire",
        Smoke: "Smoke"
    },
    /**
     * 与bimface对应的方法名称
     */
    method: {
        overrideComponentsColorByObjectData: "overrideComponentsColorByObjectData",
        showComponentsByObjectData: "showComponentsByObjectData",
        hideAllComponents: "hideAllComponents",
        hideComponentsByObjectData: "hideComponentsByObjectData",
        showAllComponents: "showAllComponents",
        overrideComponentsColorById: "overrideComponentsColorById",
        showComponentsById: "showComponentsById",
        hideComponentsById: "hideComponentsById",
        transparentComponentsByObjectData: "transparentComponentsByObjectData",
        opaqueComponentsByObjectData: "opaqueComponentsByObjectData",
        showExclusiveComponentsByObjectData: "showExclusiveComponentsByObjectData"
    },

    category: {
        equipment: -2001140,
        wall: -2000011,
        floor: -2000032,
        dust: -2008000,
        dust_tail: -2008010,
        dust_pipe: -2008016,
        terminal: -2008013,
    }
}

export { Constant }