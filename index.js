"use strict";
var Startup = (function () {
    function Startup() {
    }
    Startup.main = function () {
        console.log('main');
        var scene = new MyScene(window.innerWidth, window.innerHeight);
        scene.init();
        window.onload = function () {
            scene.run();
        };
        return 0;
    };
    return Startup;
}());
var MyScene = (function () {
    function MyScene(width, height) {
        this.raycaster = new THREE.Raycaster();
        this.ready = false;
        this.mouse = new THREE.Vector2();
        this.sceneRootElement = document;
        this.viewport_width = width;
        this.viewport_height = height;
        this.lights = [];
        this.objects = [];
    }
    MyScene.prototype.init = function () {
        var _this = this;
        this.scene = new THREE.Scene(),
            this.renderer = new THREE.WebGLRenderer(),
            this.camera = new THREE.PerspectiveCamera(35, this.viewport_width / this.viewport_height, 0.1, 1000),
            this.renderer.setSize(this.viewport_width, this.viewport_height);
        document.getElementById('scene').appendChild(this.renderer.domElement);
        // setup
        // TODO: make promise
        this.createObjects();
        this.objects.forEach(function (o) { return _this.scene.add(o); });
        // lights
        this.createLights();
        this.lights.forEach(function (l) { return _this.scene.add(l); });
        // camera    
        this.camera.position.z = 5;
        this.scene.add(this.camera);
        this.sceneRootElement.addEventListener('click', this.onSceneClick.bind(this), false);
    };
    MyScene.prototype.run = function () {
        // action
        if (!this.ready) {
            setTimeout(function () {
                this.run();
            }.bind(this), 1000);
        }
        else {
            this.render();
        }
    };
    MyScene.prototype.onSceneClick = function (event) {
        event.preventDefault();
        this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
        console.log("clicked at (" + this.mouse.x + ", " + this.mouse.y + ")");
        this.checkForClicks = true;
    };
    MyScene.prototype.createLights = function () {
        var dirLight = new THREE.DirectionalLight(0xffffff, 1);
        dirLight.position.set(5, 5, 5);
        this.lights.push(dirLight);
        this.lights.push(new THREE.AmbientLight(0xffffff, 0.8));
    };
    MyScene.prototype.createObjects = function () {
        var geometry = new THREE.BoxGeometry(1, 1, 1);
        var material = new THREE.MeshPhongMaterial({
            color: 0x00ff00,
            specular: 0x0000cc,
            shininess: 0.5
        });
        this.cube = new THREE.Mesh(geometry, material);
        this.cube.name = "CUBE";
        this.objects.push(this.cube);
        var loader = new ColladaLoader();
        var url = 'models/Untitled.xml';
        loader.load(url, function (collada) {
            console.log('loaded collada');
            this.dae = collada.scene;
            this.dae.name = "BRICK WALL";
            this.objects.push(this.dae);
            this.scene.add(this.dae);
            this.ready = true;
        }.bind(this));
    };
    MyScene.prototype.render = function () {
        if (this.checkForClicks) {
            this.raycaster.setFromCamera(this.mouse, this.camera);
            var intersections = this.raycaster.intersectObjects(this.objects, true);
            if (intersections.length > 0) {
                for (var i = 0; i < intersections.length; i++) {
                    var obj = intersections[i].object;
                    while ((obj.name === null || obj.name === "") && obj.parent != null) {
                        obj = obj.parent;
                    }
                    console.log('clicked on ' + obj.name ? obj.name : 'unnamed object', obj);
                }
            }
            this.checkForClicks = false;
        }
        this.dae.rotation.x += 0.01;
        this.dae.rotation.y += 0.01;
        this.cube.rotation.x -= 0.005;
        this.cube.rotation.y -= 0.005;
        requestAnimationFrame(this.render.bind(this));
        this.renderer.render(this.scene, this.camera);
    };
    return MyScene;
}());
Startup.main();
//# sourceMappingURL=index.js.map