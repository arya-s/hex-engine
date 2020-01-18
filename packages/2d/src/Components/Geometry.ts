import { useType } from "@hex-engine/core";
import { Angle, Point, Polygon, Shape } from "../Models";
import { useInspectorHoverOutline, useEntityTransforms } from "../Hooks";

function Geometry({
  shape = new Polygon([new Point(0, 0)]),
  position = new Point(0, 0),
  rotation = new Angle(0),
  scale = new Point(1, 1),
}: {
  shape?: Shape | undefined;
  position?: Point | undefined;
  rotation?: Angle | undefined;
  scale?: Point | undefined;
}) {
  useType(Geometry);

  const transforms = useEntityTransforms();

  const geometry = {
    shape,
    position,
    rotation,
    scale,
    worldPosition() {
      const matrix = transforms.asMatrix();
      return new Point(matrix.e, matrix.f);
    },
  };

  useInspectorHoverOutline(() => geometry.shape);

  return geometry;
}

export default Geometry;