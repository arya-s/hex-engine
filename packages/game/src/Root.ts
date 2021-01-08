import * as THREE from "three";
import {
  useChild,
  useType,
  useDraw,
  useNewComponent,
  Renderer,
} from "@hex-engine/3d";
import Cube from "./Cube";

export default function Root() {
  useType(Root);

  useNewComponent(() => Renderer({}));

  const scene = useChild(() => new THREE.Scene());
  const camera = useNewComponent(
    () =>
      new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
      )
  );

  const light = useNewComponent(
    () => new THREE.HemisphereLight(0x404040, 0xffffff, 1.0)
  );

  camera.position.z = 5;

  const cube = useChild(() => Cube());
  scene.rootComponent.add(cube.rootComponent.mesh);
  scene.rootComponent.add(light);

  useDraw((renderer) => {
    renderer.render(scene.rootComponent, camera);
  });
}
