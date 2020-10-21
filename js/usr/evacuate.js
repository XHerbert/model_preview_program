/**
 * @author:xuhbd
 * @function:消防疏散路线动画演示
 */

var evacuate = {

    //声明存储材质的集合
    textureCollection: [],

    myviewer: null,

    //生产材质
    generateMaterial: function generateMaterial(repeat) {
        var basicMaterial = new THREE.MeshBasicMaterial();
        var texture = new THREE.TextureLoader().load('images/icon_arrow_right_pow.png', function (map) {
            basicMaterial.map = map;
            basicMaterial.wireframe = false;
            basicMaterial.needsUpdate = true;
            basicMaterial.transparent = true;
            basicMaterial.side = THREE.DoubleSide;
        });
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        texture.repeat.x = repeat;
        this.textureCollection.push(texture);
        return basicMaterial;
    },

    //创建路线
    loadPlane: function loadPlane(planeArray, viewer) {
        this.myviewer = viewer;
        // 标准宽度
        const statndardWidth = 500;
        // 用于计算标准图片重复个数
        const statndardRepeat = 600;
        // 指定默认角度
        const rotate = Math.PI / 2;

        var planeGroup = new THREE.Group();
        // 思路一：仅用最大点进行定位（目前采用）
        // 思路二：用最大点和最小点进行定位
        for (let k = 0, l = planeArray.length; k < l; k++) {
            let l = 0;
            let position_x = 0;
            let position_y = 0;
            let z_offset = 5;
            //区分横向和纵向
            if (planeArray[k].direction === 1 || planeArray[k].direction === -1) {
                l = Math.floor(planeArray[k].max_position.y - planeArray[k].min_position.y);
                position_x = planeArray[k].max_position.x - (statndardWidth / 2);
                position_y = planeArray[k].max_position.y - (l / 2);

            } else {
                l = Math.floor(planeArray[k].max_position.x - planeArray[k].min_position.x);
                position_x = planeArray[k].max_position.x - (l / 2);
                position_y = planeArray[k].max_position.y - (statndardWidth / 2);
            }

            let _material = this.generateMaterial(Math.floor(l / statndardRepeat));
            let planeGeometry = new THREE.PlaneBufferGeometry(l, statndardWidth, 100, 50);
            let plane = new THREE.Mesh(planeGeometry, _material);
            plane.position.x = position_x;
            plane.position.y = position_y;
            plane.position.z = planeArray[k].max_position.z + z_offset;
            plane.rotation.z = rotate * planeArray[k].direction;
            planeGroup.add(plane);
        }
        return planeGroup;
    },

    //创建动画
    animate: function animate() {
        //这里不能直接用this.animate,第二次调用自身时,this就变成了window
        let animationId = requestAnimationFrame(this.animate.bind(this));
        for (let m = 0, len = this.textureCollection.length; m < len; m++) {
            this.textureCollection[m].offset.x += 0.005;
        }
        this.myviewer.render();
    },

    run_example: function example(viewer) {
        this.myviewer = viewer;
        let planeArray = [];
        const UP = 1;
        const DOWN = -1;
        const LEFT = 2;
        const RIGHT = 0;

        //演示数据，基于模型1833342816790432
        let a = { min_position: { x: -10432.83984375, y: 20233.87109375, z: 15 }, max_position: { x: -9932.83984375, y: 26744.16796875, z: 40 }, direction: UP };
        let b = { min_position: { x: -14117.83984375, y: 28943.8671875, z: 15 }, max_position: { x: -12812.83984375, y: 29443.8671875, z: 50 }, direction: RIGHT };
        let c = { min_position: { x: -7591.01171875, y: 27244.16796875, z: 15 }, max_position: { x: -7091.01171875, y: 33333.8671875, z: 20 }, direction: UP };
        let d = { min_position: { x: -12812.83984375, y: 26744.16796875, z: 15 }, max_position: { x: -10180.83203125, y: 27244.16796875, z: 20 }, direction: LEFT };
        let e = { min_position: { x: -10180.83203125, y: 26744.16796875, z: 15 }, max_position: { x: -7089.44091796875, y: 27244.16796875, z: 20 }, direction: RIGHT };
        let f = { min_position: { x: -12812.83984375, y: 27243.869140625, z: 15 }, max_position: { x: -12312.83984375, y: 29444.169921875, z: 20 }, direction: UP };
        let g = { min_position: { x: -12312.83984375, y: 28944.06640625, z: 15 }, max_position: { x: -10282.90234375, y: 29444.06640625, z: 20 }, direction: RIGHT };
        let h = { min_position: { x: -10282.9013671875, y: 28944.06640625, z: 20 }, max_position: { x: -7591.0107421875, y: 29444.06640625, z: 25 }, direction: RIGHT };
        planeArray.push(a);
        planeArray.push(b);
        planeArray.push(c);
        planeArray.push(d);
        planeArray.push(e);
        planeArray.push(f);
        planeArray.push(g);
        planeArray.push(h);

        let planeGroup = this.loadPlane(planeArray, this.myviewer);
        this.myviewer.addExternalObject("planeGroup", planeGroup);
        this.animate();
    }
}

export { evacuate }