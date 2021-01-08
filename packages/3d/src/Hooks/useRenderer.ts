import * as THREE from "three";
import { useType, useRootEntity, useNewRootComponent } from "@hex-engine/core";

function StorageForUseRenderer(): { renderer: THREE.Renderer | null } {
  useType(StorageForUseRenderer);

  return {
    renderer: null,
  };
}

export function setRenderer(renderer: THREE.Renderer) {
  const storage =
    useRootEntity().getComponent(StorageForUseRenderer) ||
    useNewRootComponent(StorageForUseRenderer);
  storage.renderer = renderer;
}

/**
 * Returns the three.js renderer of the root component's Renderer.
 * This is the same renderer that gets passed into `useDraw`'s callback.
 */
export default function useRenderer() {
  const storage =
    useRootEntity().getComponent(StorageForUseRenderer) ||
    useNewRootComponent(StorageForUseRenderer);
  if (storage.renderer == null) {
    throw new Error(
      "Attempted to call useRenderer before setRenderer, so renderer was not yet available."
    );
  }

  return storage.renderer;
}
