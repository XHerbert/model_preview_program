
/**
 * @author:xuhongbo
 * @function:override carport material
 */


var material = {

    viewer: null,
    materialContainer: null,
    materialConfig: null,
    material: null,
    image: null,
    offset: [0, 0],
    scale: [0.075, 0.075],

    buildMaterialConfig: function (viewer, image, offset, scale) {
        this.viewer = viewer;
        this.materialContainer = new Glodon.Bimface.Plugins.Material.MaterialContainer();
        this.materialConfig = new Glodon.Bimface.Plugins.Material.MaterialConfig();
        this.materialConfig.viewer = viewer;
        this.materialConfig.src = this.image || "../images/zlp.png";
        this.materialConfig.offset = this.offset;
        this.materialConfig.scale = this.scale;
    },

    overrideComponents: function (components) {
        this.material = new Glodon.Bimface.Plugins.Material.Material(this.materialConfig);
        this.materialContainer.addMaterial(this.material);
        this.material.overrideComponentsMaterialById(components);
    },
}

export { material } 