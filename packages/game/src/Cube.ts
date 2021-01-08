import * as THREE from "three";
import {
  useType,
  useNewComponent,
  useUpdate,
  useEntityName,
} from "@hex-engine/3d";

export default function Cube() {
  useType(Cube);
  useEntityName("Cube");

  const geometry = useNewComponent(() => {
    return new THREE.BoxGeometry();
  });

  const material = useNewComponent(
    () => new THREE.MeshLambertMaterial({ color: 0xb076c7 })
  );

  const mesh = useNewComponent(() => new THREE.Mesh(geometry, material));

  useUpdate(() => {
    mesh.rotation.x += 0.01;
    mesh.rotation.y += 0.01;
  });

  return {
    mesh,
  };
}
