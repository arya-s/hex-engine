import * as THREE from "three";
import { useNewComponent, useType, RunLoop } from "@hex-engine/core";
import Inspector from "@hex-engine/inspector";
import { setRenderer } from "../Hooks/useRenderer";
import { DrawChildren, useDraw } from "./DrawChildren";

export default Object.assign(function Renderer(options: {
  element?: HTMLElement;
}) {
  useType(Renderer);

  const renderer = new THREE.WebGLRenderer();

  let element: HTMLElement;
  if (options.element) {
    element = options.element;
  } else {
    element = document.createElement("div");
    document.body.appendChild(element);
  }
  element.className = element.className + " " + "hex-engine";
  element.appendChild(renderer.domElement);

  renderer.setSize(window.innerWidth, window.innerHeight);

  setRenderer(renderer);

  useNewComponent(RunLoop);
  useNewComponent(() => DrawChildren());

  if (process.env.NODE_ENV !== "production") {
    useNewComponent(() => Inspector());
  }

  let preDraw: (renderer: THREE.Renderer) => void = () => {};

  useDraw((renderer) => {
    preDraw(renderer);
  });

  return {
    element,
    renderer,
    useDraw,
  };
});

export { useDraw };
