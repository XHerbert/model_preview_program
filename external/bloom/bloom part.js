



var unreal = {

    scene: null,
    camera: null,
    renderer: null,
    composer: null,
    mesh: null,
    bloomComposer: null,
    finalComposer: null,

    bloomLayer: null,
    entireLayer: null,
    ENTIRE_SCENE: 0,
    BLOOM_SCENE: 1,
    materials: {},
    darkMaterial: null,

    initRenderBloom: function (scene, camera, renderer, mesh) {

        this.scene = scene;
        this.camera = camera;
        window["camera"] = this.camera;
        this.scene.traverse(this.disposeMaterial);
        this.scene.children.length = 0;

        this.renderer = renderer;
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.toneMapping = THREE.ReinhardToneMapping;
        // this.renderer.autoClear = false;
        // this.renderer.gammaInput = true;
        // this.renderer.gammaOutput = true;
        // this.renderer.toneMappingExposure = Math.pow(0.9, 4.0);

        this.mesh = mesh;

        this.bloomLayer = new THREE.Layers();
        this.bloomLayer.set(this.BLOOM_SCENE);
        window["bloomLayer"] = this.bloomLayer;

        this.entireLayer = new THREE.Layers();
        this.entireLayer.set(this.ENTIRE_SCENE);
        window["entireLayer"] = this.entireLayer;

        this.darkMaterial = new THREE.MeshBasicMaterial({ color: 0x000000 });

        var renderScene = new THREE.RenderPass(this.scene, this.camera);
        //Bloom通道创建
        var bloomPass = new THREE.UnrealBloomPass(new THREE.Vector2(window.innerWidth, window.innerHeight), 1.5, 0.84, 0.05);
        //bloomPass.renderToScreen = true;
        bloomPass.threshold = 0.01;
        bloomPass.strength = 12.0;
        bloomPass.radius = 0.55;
        window.bloomPass = bloomPass;


        let effectFXAA = new THREE.ShaderPass(THREE.FXAAShader);
        effectFXAA.uniforms.resolution.value.set(1 / window.innerWidth, 1 / window.innerHeight);
        effectFXAA.renderToScreen = true;


        this.bloomComposer = new THREE.EffectComposer(this.renderer);
        this.bloomComposer.renderToScreen = false;
        this.bloomComposer.setSize(window.innerWidth, window.innerHeight);
        this.bloomComposer.addPass(renderScene);
        this.bloomComposer.addPass(effectFXAA);
        this.bloomComposer.addPass(bloomPass);


        let finalPass = new THREE.ShaderPass(
            new THREE.ShaderMaterial({
                uniforms: {
                    baseTexture: { value: null },
                    bloomTexture: { value: this.bloomComposer.renderTarget2.texture }
                },
                vertexShader: this.getVertexShader(),
                fragmentShader: this.getFragmentShader(),
                defines: {}
            }), "baseTexture"
        );
        window["finalPass"] = finalPass;

        finalPass.needsSwap = true;

        this.finalComposer = new THREE.EffectComposer(this.renderer);
        this.finalComposer.addPass(renderScene);
        this.finalComposer.addPass(finalPass);
        this.finalComposer.setSize(window.innerWidth, window.innerHeight);


        this.scene.traverse(unreal.darkenNonBloomed);
        //this.bloomComposer.render();
        this.scene.traverse(unreal.restoreMaterial);
        this.finalComposer.render();


        // 以下是未解决深度冲突问题的代码
        // this.composer = new THREE.EffectComposer(this.renderer);
        // this.composer.setSize(window.innerWidth, window.innerHeight);
        // this.composer.addPass(renderScene);

        // this.composer.addPass(effectFXAA);
        // // 眩光通道bloomPass插入到composer
        // this.composer.addPass(bloomPass);

        // var copyShader = new THREE.ShaderPass(THREE.CopyShader);
        // copyShader.renderToScreen = true;
        // this.composer.addPass(copyShader);

        // //反锯齿 R85版本代码
        // let ssaaRenderPass = new THREE.SSAARenderPass(this.scene, this.camera, 0x000000, 0);
        // ssaaRenderPass.setSize(window.innerWidth, window.innerHeight);
        // ssaaRenderPass.unbiased = true;
        // this.composer.addPass(ssaaRenderPass);
        // this.composerRenderer();

    },


    composerRenderer: function render() {

        // requestAnimationFrame(this.composerRenderer.bind(this));
        // this.renderer.clear();
        // this.camera.layers.set(1);
        // this.composer.render();
        // this.renderer.clearDepth();
        // this.camera.layers.set(0);
        // this.renderer.render(this.scene, this.camera);
    },


    renderBloom: function renderBloom(mask) {
        if (mask === true) {
            unreal.scene.traverse(unreal.darkenNonBloomed);
            unreal.bloomComposer.render();
            unreal.scene.traverse(unreal.restoreMaterial);
        } else {
            this.camera.layers.set(1);
            this.bloomComposer.render();
            this.camera.layers.set(0);
            //this.renderer.render();
        }
        //requestAnimationFrame(renderBloom);
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
    }
}

export { unreal }

