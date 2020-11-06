window['bim'] = {};

// 目录开关
let onDirClickHandler = (obj) => {
    if (obj.checked) {
        document.getElementsByClassName('gld-bf-tree')[0].style.display = 'block';
    } else {
        document.getElementsByClassName('gld-bf-tree')[0].style.display = 'none';
    }
}

// 工具栏开关
let onToolClickHandler = (obj) => {
    if (obj.checked) {
        document.getElementsByClassName('bf-toolbar bf-toolbar-bottom')[0].style.display = 'block';
    } else {
        document.getElementsByClassName('bf-toolbar bf-toolbar-bottom')[0].style.display = 'none';
    }
}

// 楼层按钮
let onLevelClickHandler = (obj) => {
    if (obj.checked) {
        document.getElementById('levels').style.display = 'block';
    } else {
        document.getElementById('levels').style.display = 'none';
    }
    viewer.render();
}

// 模型轮廓线开关
let onWireFrameClickHandler = (obj) => {
    if (obj.checked) {
        viewer.setBorderLineEnabled(true);
    } else {
        viewer.setBorderLineEnabled(false);
    }
    viewer.render();
}

// 辅助坐标轴开关
let onAxisClickHandler = (obj) => {
    if (obj.checked) {
        viewer.addExternalObject("axis", axis);
    } else {
        viewer.removeExternalObjectByName("axis");
    }
    viewer.render();
}

// ViewHouse开关
let onViewHouseClickHandler = (obj) => {
    if (obj.checked) {
        viewer.showViewHouse();
    } else {
        viewer.hideViewHouse();
    }
    viewer.render();
}

// 悬停开关
let onMouseHoverClickHandler = (obj) => {
    if (obj.checked) {
        viewer.enableHover(true);
    } else {
        viewer.enableHover(false);
    }
    viewer.render();
}

// 参数控制器
let onParameterClickHandler = (obj) => {
    if (obj.checked && document.getElementsByClassName('dg ac')) {
        document.getElementsByClassName('dg ac')[0].style.display = "block";
    } else {
        document.getElementsByClassName('dg ac')[0].style.display = "none";
    }
}

// 冷水机房图例
let onLegendClickHandler = (obj) => {
    if (obj.checked && document.getElementById('identity')) {
        document.getElementById('identity').style.display = "block";
    } else {
        document.getElementById('identity').style.display = "none";
    }
}

let onEnableBlinkClickHandler = (obj) => {
    if (obj.checked && viewer) {
        viewer.enableBlinkComponents(true);
    } else {
        viewer.enableBlinkComponents(false);
    }
}

let onEnableBackgroundHandler = (obj) => {
    if (obj.checked) {
        document.getElementsByTagName('canvas')[0].classList.add('canvasClass'); //`background: url("../../images/projecta.png") no-repeat center;overflow: hidden`;
    } else {
        document.getElementsByTagName('canvas')[0].classList.remove('canvasClass');
    }
}

//开启单击构件查询构件筛选条件开关
let onConditionQueryHandler = (obj) => {
    if (obj.checked) {
        window.bim.queryCondition = true;
    } else {
        window.bim.queryCondition = false;
    }
}

//开启单击构件查询构件筛选条件开关
let onComponentQueryHandler = (obj) => {
    if (obj.checked) {
        window.bim.component = true;
    } else {
        window.bim.component = false;
    }
}

//开启空间拆分与合并
let onAreaRebuildHandler = (obj) => {
    if (obj.checked) {
        window.bim.drawRooms = true;
    } else {
        window.bim.drawRooms = false;
    }
}

//开启构件Id复制
let onRecordObjectIdHandler = (obj) => {
    if (obj.checked) {
        window.bim.recordObjectId = true;
    } else {
        window.bim.recordObjectId = false;
    }
}

//开启空间自定义路径绘制
var button;
let onDrawCustomAreaHandler = (obj) => {
    if (obj.checked) {
        window.bim.drawCustomArea = true;
        button = document.createElement("button");
        button.style.position = "absolute";
        button.style.top = "100px";
        button.id = "draw_id";
        button.style.right = "250px";
        button.innerText = "draw_area";
        button.style.zIndex = 99999;
        document.body.appendChild(button);
    } else {
        window.bim.drawCustomArea = false;
        window.bim.tagEventBind = false;
        document.body.removeChild(button);
    }
}

//开启空间复制
let onRecordOAreaHandler = (obj) => {
    if (obj.checked) {
        window.bim.recordArea = true;
    } else {
        window.bim.recordArea = false;
    }
}