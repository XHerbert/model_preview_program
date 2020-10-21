
/**
 * @author:xuhongbo
 * @function:lights 
 */

var light = {

    ambientLight: null,
    pointLight: null,
    spotLight: null,
    directionalLight: null,
    color: null,

    init: function (color) {
        this.color = !color && 0x404040;
        //this.ambientLight = new THREE.AmbientLight(0x1E90FF);0000FF
        this.ambientLight = new THREE.AmbientLight(this.color);
        console.log(this.color);
    },

    createAmbientLight: function () {
        this.ambientLight.intensity = 20;
        return this.ambientLight;
    },

    createPointLight: function () {
        this.pointLight = new THREE.PointLight(this.color, 30);
        //this.pointLight.position.z = 100;
        return this.pointLight;
    },

    createSpotLight: function (color, intensity, distance, angle, pu, au) {
        this.spotLight = new THREE.SpotLight(color, intensity, distance, angle, pu, au);
        return this.spotLight;
    },

    createDirectilyLight: function (color, intensity) {
        this.directionalLight = new THREE.DirectionalLight(color, intensity);
        return this.directionalLight;
    }
}

export { light }