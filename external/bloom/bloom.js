



var unreal = {

    scene: null,
    camera: null,
    renderer: null,
    composer: null,
    mesh: null,
    bloomComposer: null,

    bloomLayer: null,
    entireLayer: null,
    ENTIRE_SCENE: 0,
    BLOOM_SCENE: 1,
    materials: {},
    darkMaterial: null,

    initRenderBloom: function (scene, camera, renderer, mesh) {

        this.scene = scene;
        this.camera = camera;

        this.renderer = renderer.renderer;

        this.renderer.toneMapping = THREE.ReinhardToneMapping;
        this.renderer.autoClear = false;
        this.renderer.gammaInput = true;
        this.renderer.gammaOutput = true;
        this.renderer.toneMappingExposure = Math.pow(0.9, 4.0);

        this.mesh = mesh;

        this.bloomLayer = new THREE.Layers();
        this.bloomLayer.set(this.BLOOM_SCENE);
        window["bloomLayer"] = this.bloomLayer;

        this.entireLayer = new THREE.Layers();
        this.entireLayer.set(this.ENTIRE_SCENE);
        window["entireLayer"] = this.entireLayer;
        this.darkMaterial = new THREE.MeshBasicMaterial({});

        // this.renderer.autoClear = false;
        var renderScene = new THREE.RenderPass(scene, camera);
        //Bloom通道创建
        var bloomPass = new THREE.UnrealBloomPass(new THREE.Vector2(window.innerWidth, window.innerHeight), 1.5, 0.4, 0.85);
        bloomPass.renderToScreen = true;
        bloomPass.threshold = 0.0;
        bloomPass.strength = 70.0;
        bloomPass.radius = 0.1;

        // bloomPass.threshold = 0;
        // bloomPass.strength = 0.75;
        // bloomPass.radius = 1;
        // bloomPass.bloomStrength = 3.0;
        window.bloomPass = bloomPass;


        let effectFXAA = new THREE.ShaderPass(THREE.FXAAShader);
        effectFXAA.uniforms.resolution.value.set(1 / window.innerWidth, 1 / window.innerHeight);

        // let bloomComposer = new THREE.EffectComposer(this.renderer);
        // bloomComposer.renderToScreen = false;
        // bloomComposer.addPass(renderScene);
        // bloomComposer.addPass(bloomPass);
        // this.bloomComposer = bloomComposer;


        // let finalPass = new THREE.ShaderPass(
        //     new THREE.ShaderMaterial({
        //         uniforms: {
        //             baseTexture: { value: null },
        //             bloomTexture: { value: bloomComposer.renderTarget2.texture }
        //         },
        //         vertexShader: this.getVertexShader(),
        //         fragmentShader: this.getFragmentShader(),
        //         defines: {}
        //     }), "baseTexture"
        // );
        // finalPass.needsSwap = true;
        // let finalComposer = new THREE.EffectComposer(renderer);
        // finalComposer.addPass(renderScene);
        // finalComposer.addPass(finalPass);

        // this.renderBloom(true);
        // finalComposer.render();

        //修改整个场景构件透明度
        //unreal.scene.traverse(unreal.changeAlpha);



        this.composer = new THREE.EffectComposer(this.renderer);
        this.composer.setSize(window.innerWidth, window.innerHeight);
        this.composer.addPass(renderScene);

        this.composer.addPass(effectFXAA);
        // 眩光通道bloomPass插入到composer
        this.composer.addPass(bloomPass);

        var copyShader = new THREE.ShaderPass(THREE.CopyShader);
        copyShader.renderToScreen = true;
        this.composer.addPass(copyShader);

        //反锯齿 R85版本代码
        let ssaaRenderPass = new THREE.SSAARenderPass(this.scene, this.camera, 0x000000, 0);
        ssaaRenderPass.setSize(window.innerWidth, window.innerHeight);
        ssaaRenderPass.unbiased = true;
        //this.composer.addPass(ssaaRenderPass);
        this.composerRenderer();

    },


    composerRenderer: function render() {

        requestAnimationFrame(this.composerRenderer.bind(this));
        this.renderer.clear();
        this.camera.layers.set(1);
        // this.camera.layers = this.bloomLayer;
        this.composer.render();
        this.renderer.clearDepth();
        this.camera.layers.set(0);//this.entireLayer;
        this.renderer.render(this.scene, this.camera);
    },


    renderBloom: function renderBloom(mask) {
        if (mask === true) {
            unreal.scene.traverse(unreal.darkenNonBloomed);
            unreal.bloomComposer.render();
            unreal.scene.traverse(unreal.restoreMaterial);
        } else {
            unreal.camera.layers.set(unreal.BLOOM_SCENE);
            unreal.bloomComposer.render();
            unreal.camera.layers.set(unreal.ENTIRE_SCENE);
        }
    },


    getVertexShader: function () {
        return `
            varying vec2 vUv;
            void main() {
                vUv = uv;
                gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
            }
        `;
    },

    getFragmentShader: function () {
        return `
        uniform sampler2D baseTexture;
        uniform sampler2D bloomTexture;
        varying vec2 vUv;
        vec4 getTexture( sampler2D texelToLinearTexture ) {
            return mapTexelToLinear( texture2D( texelToLinearTexture , vUv ) );
        }

        void main() {
            gl_FragColor = ( getTexture( baseTexture ) + vec4( 1.0 ) * getTexture( bloomTexture ) );
        }
        `;
    },

    darkenNonBloomed: function darkenNonBloomed(obj) {
        if (obj.isMesh && unreal.bloomLayer.test(obj.layers) === false) {
            unreal.materials[obj.uuid] = obj.material;
            obj.material = unreal.darkMaterial;
        }
    },
    restoreMaterial: function restoreMaterial(obj) {
        if (unreal.materials[obj.uuid]) {
            obj.material = unreal.materials[obj.uuid];
            delete unreal.materials[obj.uuid];
        }
    },
    changeAlpha: function changeAlpha(obj) {
        const alpha = 0.8;
        if (obj.isMesh && unreal.bloomLayer.test(obj.layers) === false) {
            if (obj.material && obj.name != "onlyline") {
                if (obj.material.length) {
                    for (let m = 0, len = obj.material.length; m < len; m++) {
                        obj.material[m].transparent = true;
                        obj.material[m].opacity = alpha;
                        obj.material.needsUpdate = true;
                    }
                } else {
                    obj.material.transparent = true;
                    obj.material.opacity = alpha;
                    obj.material.needsUpdate = true;
                }

            }
        }
    },
}

export { unreal }

