/**
 * @author:xuhongbo
 * @function:elevator animation
 * @description:1846091003430848
 * @url:http://10.1.73.67:8001/preview.html?viewToken=102751d730a940a68541759cab1cee7f
 */

import TWEEN from '../common/Tween.js'
/**
 * 
 * @param {viewer} viewer 对象
 * @param {name} name 名称
 * @param {position}  position 初始位置
 * @param {faceTo} faceTo 电梯面对方向
 * @param {direction} direction 升降方向
 * @param {id} id 电梯构件Id
 */
function Elevator(viewer, name, position, faceTo, direction, id) {
    this.__proto__._viewer = viewer;
    this.__proto__._name = name;
    this.__proto__._id = id;
    this.__proto__._position = position;
    this.__proto__._direction = direction;
    this.__proto__._faceTo = faceTo;
    this.__proto__._high = 0;
    this.__proto__._current_floor = 1;
    this.__proto__._target_floor = 1;
    this.__proto__._time = 2000;
}


Elevator.prototype.build = () => {
    console.log("begin to build");
    let width = 1200, height = 2600, depth = 1000;
    let panelWidth = 200, panelHeight = 200, segments = 100;
    let globalMap = {};

    let _viewer_ = Elevator.prototype._viewer;
    let _position_ = Elevator.prototype._position;
    let _name_ = Elevator.prototype._name;
    let _current_floor_ = Elevator.prototype._current_floor;
    let _target_floor_ = Elevator.prototype._target_floor;
    let _time_ = Elevator.prototype._time;
    let _faceTo_ = Elevator.prototype._faceTo;
    let _direction_ = Elevator.prototype._direction;
    let _id_ = Elevator.prototype._id;

    //确认电梯的规格，暂时按当前参数创建
    let box = new THREE.BoxBufferGeometry(width, height, depth);
    let panel = new THREE.PlaneBufferGeometry(panelWidth, panelHeight, segments, segments);
    let panelFloor = new THREE.PlaneBufferGeometry(panelWidth, panelHeight, segments, segments);

    let group = new THREE.Group();

    // 电梯侧面材质
    let othersMaterial = new THREE.MeshPhongMaterial();
    // 电梯顶部材质
    let topMaterial = new THREE.MeshPhongMaterial();
    // 电梯正面材质
    let frontMaterial = new THREE.MeshPhongMaterial();

    let upMaterial = new THREE.MeshBasicMaterial();
    let downMaterial = new THREE.MeshBasicMaterial();

    let belowOneFloorMaterial = new THREE.MeshBasicMaterial();
    let OneFloorMaterial = new THREE.MeshBasicMaterial();
    let TwoFloorMaterial = new THREE.MeshBasicMaterial();
    let ThreeFloorMaterial = new THREE.MeshBasicMaterial();
    let FourFloorMaterial = new THREE.MeshBasicMaterial();
    let FiveFloorMaterial = new THREE.MeshBasicMaterial();
    let SixFloorMaterial = new THREE.MeshBasicMaterial();

    const GO_UP = 1;
    const GO_DOWN = -1;
    const SPEED = 0.04;
    const INTERVAL = 2000;
    const FLOOR_ONE = 1;
    const CHANGABLE_ELEVATOR_ONE = 581194;
    const CHANGABLE_ELEVATOR_TWO = 581193;

    group.name = _name_;
    //合并loader
    let loader = new THREE.TextureLoader();
    loader.setCrossOrigin("Anonymous");

    let others = loader.load('images/basic.png', function (map) {
        othersMaterial.map = map;
        othersMaterial.wireframe = false;
        othersMaterial.needsUpdate = true;
    });

    let top = loader.load('images/top.png', function (map) {
        topMaterial.map = map;
        topMaterial.wireframe = false;
        topMaterial.needsUpdate = true;
    });

    let front = loader.load('images/front.png', function (map) {
        frontMaterial.map = map;
        frontMaterial.wireframe = false;
        frontMaterial.needsUpdate = true;
    });

    let pathList = [];
    pathList.push({ role: belowOneFloorMaterial, path: 'images/Digit/-1F.png' });
    pathList.push({ role: OneFloorMaterial, path: 'images/Digit/1F.png' });
    pathList.push({ role: TwoFloorMaterial, path: 'images/Digit/2F.png' });
    pathList.push({ role: ThreeFloorMaterial, path: 'images/Digit/3F.png' });
    pathList.push({ role: FourFloorMaterial, path: 'images/Digit/4F.png' });
    pathList.push({ role: FiveFloorMaterial, path: 'images/Digit/5F.png' });
    pathList.push({ role: SixFloorMaterial, path: 'images/Digit/6F.png' });


    const buildMaterials = (item) => {
        return new Promise((resolve, reject) => {
            loader.load(item.path, function (map) {
                item.role.map = map;
                item.role.wireframe = false;
                item.role.needsUpdate = true;
            });
        });
    }

    for (let i = 0; i < pathList.length; i++) {
        buildMaterials(pathList[i]);
    }

    let up = loader.load('images/ele_up.png', function (map) {
        upMaterial.map = map;
        upMaterial.wireframe = false;
        upMaterial.needsUpdate = true;
    });
    up.wrapS = THREE.RepeatWrapping;
    up.wrapT = THREE.RepeatWrapping;
    up.repeat.y = 1;
    window[_name_] = up;

    let down = loader.load('images/ele_down.png', function (map) {
        downMaterial.map = map;
        downMaterial.wireframe = false;
        downMaterial.needsUpdate = true;
    });
    down.wrapS = THREE.RepeatWrapping;
    down.wrapT = THREE.RepeatWrapping;
    down.repeat.y = 1;

    let planeUpDownMesh = new THREE.Mesh(panel, upMaterial);
    planeUpDownMesh.position.z = 505;
    planeUpDownMesh.position.x = 210;

    let planeFloorMesh = new THREE.Mesh(panelFloor, OneFloorMaterial);
    planeFloorMesh.position.z = 505;
    planeFloorMesh.position.x = 210;
    planeFloorMesh.position.y = planeUpDownMesh.position.y - 200;

    let ms = [othersMaterial, othersMaterial, topMaterial, othersMaterial, frontMaterial, othersMaterial];

    let boxMesh = new THREE.Mesh(box, ms);
    //TODO:调整位置，使模型包含电梯
    group.add(boxMesh);
    group.add(planeUpDownMesh);
    group.add(planeFloorMesh);

    group.rotation.x = Math.PI / 2;
    group.updateMatrixWorld();

    if (_faceTo_ == 1) {
        group.rotation.y = -Math.PI / 2;
    }

    _viewer_.addExternalObject(_name_, group);
    _viewer_.render();

    let tween = new TWEEN.Tween(_position_)
        .to({ z: height / 2 }, 10)
        .onUpdate(onUpdate)
        .onComplete(onComplete)
        .start();


    //TODO:引入websocket代替上面的for循环
    var socket;

    socket = new WebSocket("ws://10.1.73.67:8087/gfmcenter/websocket/0004/" + _id_);
    socket.onopen = () => {
        console.log("socket opened!");
    }

    //TODO:msg需前端自行解析，h代表上升高度，d代表升降方向，f代表目标楼层
    socket.onmessage = (msg) => {

        console.log(msg);
        let _data = JSON.parse(msg.data);
        let val = 0;
        if (_data.data) {
            let _v = JSON.parse(_data.data);
            if (_v.h >= 0 && _v.d >= 0) {
                val = _v.h;
                _target_floor_ = _v.f;
                _time_ = Math.abs(_target_floor_ - _current_floor_) * INTERVAL;
                let _height = Number(val) + (height / 2);

                tween = null;
                tween = new TWEEN.Tween(_position_)
                    .to({ z: _height }, _time_)
                    .easing(TWEEN.Easing.Cubic.Out)
                    .onUpdate(onUpdate)
                    .onStart(onStart)
                    .onComplete(onComplete)
                    .start();
            }
        }
    }

    socket.onclose = () => {
        console.log("socket closed!");
    }

    socket.onerror = () => {
        console.error("error!");
    }


    let mgr = viewer.getExternalComponentManager();
    function animation() {
        if (!window[_name_]) {
            window[_name_] = up;
        }
        window[_name_].offset.y += SPEED * _direction_;
        TWEEN.update();
        mgr.setTransform(_name_, _position_);
        requestAnimationFrame(animation.bind(this));
        viewer.render();
    }

    animation();

    function onUpdate(object) {
        // 此处计算经过的楼层
        if (_position_.z < 8300 && _position_.z > 8100) {
            console.info("FFFF03");
        }
    };

    function onStart(object) {
        console.log("start");
        if (_target_floor_ - _current_floor_ < 0) {
            _direction_ = GO_DOWN;
            window[_name_] = downMaterial.map;
            planeUpDownMesh.material = downMaterial;
        } else {
            _direction_ = GO_UP;
            window[_name_] = upMaterial.map;
            planeUpDownMesh.material = upMaterial;
        }

        //TODO:当启动动画时，需要判断楼层以便切换材质
        if ((_id_ == CHANGABLE_ELEVATOR_ONE || _id_ == CHANGABLE_ELEVATOR_TWO)) {
            if (_target_floor_ !== FLOOR_ONE) {
                group.rotation.y = Math.PI / 2;
            } else {
                group.rotation.y = -Math.PI / 2;
            }
        }
    };

    function onStop(object) {

    };

    //TODO:根据方向参数调整材质1上-1下
    function onComplete(object) {
        // 完成动画后，切换楼层文本
        console.log("complete");
        console.log("_current_floor_", _current_floor_);
        //if (_target_floor_ - _current_floor_ < 0) {
        if (_direction_ < 0) {
            _direction_ = -1;
            window[_name_] = downMaterial.map;
            planeUpDownMesh.material = downMaterial;
        } else {
            _direction_ = 1;
            window[_name_] = upMaterial.map;
            planeUpDownMesh.material = upMaterial;
        }
        _current_floor_ = _target_floor_;
        //切换当前坐标
        _position_.z = object.z;

        //切换楼层
        switch (_current_floor_) {
            case 1:
                planeFloorMesh.material = OneFloorMaterial;
                break;
            case 2:
                planeFloorMesh.material = TwoFloorMaterial;
                break;
            case 3:
                planeFloorMesh.material = ThreeFloorMaterial;
                break;
            case 4:
                planeFloorMesh.material = FourFloorMaterial;
                break;
            case 5:
                planeFloorMesh.material = FiveFloorMaterial;
                break;
            case 6:
                planeFloorMesh.material = SixFloorMaterial;
                break;
            case -1:
                planeFloorMesh.material = belowOneFloorMaterial;
                break;
        }
    };
};

export { Elevator }