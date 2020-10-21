/**
 * @author:xuhongbo
 * @function:custom pass render
 */
import { EffectComposer } from '/node_modules/_three@0.115.0@three/examples/jsm/postprocessing/EffectComposer.js'
import { RenderPass } from '/node_modules/_three@0.115.0@three/examples/jsm/postprocessing/RenderPass.js'
import { OutlinePass } from '/node_modules/_three@0.115.0@three/examples/jsm/postprocessing/OutlinePass.js'
import { UnrealBloomPass } from "/node_modules/_three@0.115.0@three/examples/jsm/postprocessing/UnrealBloomPass.js"
import { getScene, getPerspectiveCamera, getRender } from './utils.js'

var customPass = {

    composer: null,
    renderPass: null,
    outlinePass: null,
    viewer: null,

    //使用前先进行初始化
    init: function (viewer) {
        this.viewer = viewer;
        this.composer = new EffectComposer(getRender(viewer));
    },

    createOutlinePass: function () {
        this.outlinePass = new OutlinePass(
            new THREE.Vector2(window.innerWidth, window.innerHeight),
            getScene(this.viewer),
            getPerspectiveCamera(this.viewer)
        );

        this.outlinePass.visibleEdgeColor.set('#ff0000');
        this.outlinePass.hiddenEdgeColor.set('#ebd4cd');
        this.outlinePass.edgeStrength = 8;
        this.outlinePass.edgeGlow = 1;
        this.outlinePass.edgeThickness = 4;
        this.outlinePass.pulsePeriod = 0;
        this.composer.addPass(this.outlinePass);
    },

    addOutlinePass: function (obj) {
        this.outlinePass.selectedObjects = [obj];
    },

    run_demo: function () {
        // let raycaster = new THREE.Raycaster();
        //  let mouse = new THREE.Vector2();
        //  mouse.x = (event.clientPosition.x / window.innerWidth) * 2 - 1;
        //  mouse.y = -(event.clientPosition.y / window.innerHeight) * 2 + 1;

        //  // let vector = new THREE.Vector3(mouse.x, mouse.y, 0.5).unproject(camera);
        //  // var raycaster = new THREE.Raycaster(camera.position, vector.sub(camera.position).normalize());

        //  // raycaster.setFromCamera(mouse, camera);
        //  //let intersects = raycaster.intersectObjects(scene.children[0].children, true);
        //  let intersects = viewer.getViewer().getObjectsByClientCoordinates(mouse.x, mouse.y);
        //  //console.log(intersects);
        //  //const obj = intersects[0].object.object;
        //  const obj = intersects[0];
        //  outlinePass.selectedObjects = [obj];
        //viewer.render();
    }
}


var unreal = {

    scene: null,
    camera: null,
    renderer: null,
    composer: null,
    mesh: null,

    initRenderBloom: function (scene, camera, renderer) {

        this.scene = scene;
        this.camera = camera;
        this.renderer = renderer;

        var renderScene = new RenderPass(scene, camera);
        //Bloom通道创建
        var bloomPass = new UnrealBloomPass(new THREE.Vector2(window.innerWidth, window.innerHeight), 13.5, 0.8, 0.45);
        bloomPass.renderToScreen = false;
        bloomPass.threshold = 0;
        bloomPass.strength = 1.5;
        bloomPass.radius = 0;


        this.composer = new EffectComposer(this.renderer);
        this.composer.setSize(window.innerWidth, window.innerHeight);
        this.composer.addPass(renderScene);
        // 眩光通道bloomPass插入到composer
        this.composer.addPass(bloomPass);

        console.log(this.renderer);
        console.log(typeof (this.renderer));
    },
    composerRenderer: function render() {
        this.composer.render();
        requestAnimationFrame(this.composerRenderer.bind(this));
    }

}



export { customPass, unreal }

