const canvas = document.getElementById("renderCanvas");
const engine = new BABYLON.Engine(canvas, true);

// シーンの作成
const createScene = async () => {
    const scene = new BABYLON.Scene(engine);
    // new BABYLON.AxesViewer(scene, 0.1);

    const camera = new BABYLON.ArcRotateCamera("Camera", 0, Math.PI / 4, 0.5, BABYLON.Vector3.Zero(), scene);
    camera.wheelPrecision = 300;
    camera.inertia = 0.9;
    camera.minZ = 0.01;
    camera.attachControl(canvas, true);

    BABYLON.SceneLoader.ImportMeshAsync(null, "", "res/kushikatsu.ply", scene).then((result) => {
        const mesh = result.meshes[0];
        mesh.material.pointSize = 1.5;
        // 向きと位置を修正
        const center = BABYLON.Mesh.Center(result.meshes);
        mesh.rotateAround(center, new BABYLON.Vector3(1, 0, 0), -Math.PI / 2);
        mesh.position.subtractInPlace(center);
    });

    scene.onBeforeRenderObservable.add(() => {
        camera.beta = Math.min(camera.beta, Math.PI / 2);
        camera.radius = Math.max(camera.radius, 0.2);
        camera.radius = Math.min(camera.radius, 2.);
    });

    return scene;
};

// シーンの作成とレンダリング
createScene().then((scene) => {
    scene.debugLayer.show();
    engine.runRenderLoop(function () {
        if (scene) {
            scene.render();
        }
    });
});

// ウィンドウリサイズ時の処理
window.addEventListener("resize", () => { engine.resize(); });
