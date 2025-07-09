export interface Vector2D {
  x: number;
  y: number;
}

export interface PhysicsItem {
  id: string;
  position: Vector2D;
  velocity: Vector2D;
  size: number;
  color: string;
}