import * as THREE from "three";
import {
  useCallbackAsCurrent,
  useEntity,
  useFrame,
  Component,
  useType,
  useNewComponent,
  useCurrentComponent,
  useRootEntity,
  useNewRootComponent,
} from "@hex-engine/core";
import { useRendererDrawOrderSort } from "./DrawOrder";
import useRenderer from "../Hooks/useRenderer";

type DrawCallback = (renderer: THREE.Renderer) => void;

function StorageForDrawChildren() {
  useType(StorageForDrawChildren);

  return {
    callbacksByComponent: new WeakMap<Component, Set<DrawCallback>>(),
  };
}

/**
 * Registers a function to be called once a frame, after all `useUpdate` functions have been called.
 */
export function useDraw(callback: DrawCallback) {
  const storage =
    useRootEntity().getComponent(StorageForDrawChildren) ||
    useNewRootComponent(StorageForDrawChildren);

  const component = useCurrentComponent();
  let storageForComponent: Set<DrawCallback>;
  const maybeStorageForComponent = storage.callbacksByComponent.get(component);
  if (maybeStorageForComponent) {
    storageForComponent = maybeStorageForComponent;
  } else {
    storageForComponent = new Set();
    storage.callbacksByComponent.set(component, storageForComponent);
  }

  storageForComponent.add(useCallbackAsCurrent(callback));
}

/**
 * Iterates over all the descendant Entities, and calls their registered
 * draw callbacks, in the order specified by the Canvas.DrawOrder component
 * on the root Entity, or a default order if there is no such component.
 */
export function DrawChildren() {
  useType(DrawChildren);

  const renderer = useRenderer();
  const storage = useNewComponent(StorageForDrawChildren);

  function drawComponent(component: Component) {
    if (component.isEnabled) {
      const maybeStorageForComponent = storage.callbacksByComponent.get(
        component
      );
      if (maybeStorageForComponent) {
        for (const drawCallback of maybeStorageForComponent) {
          drawCallback(renderer);
        }
      }
    }
  }

  useFrame(() => {
    const sort = useRendererDrawOrderSort();
    const ent = useEntity();
    const ents = [ent, ...ent.descendants()];
    const components = sort(ents);

    for (const component of components) {
      drawComponent(component);
    }
  });
}
