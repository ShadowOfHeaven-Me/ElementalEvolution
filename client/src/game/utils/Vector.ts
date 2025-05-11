export class Vector {
  x: number;
  y: number;
  
  constructor(x: number = 0, y: number = 0) {
    this.x = x;
    this.y = y;
  }
  
  // Create a new Vector with the same values
  clone(): Vector {
    return new Vector(this.x, this.y);
  }
  
  // Add another vector to this one
  add(other: Vector): Vector {
    return new Vector(this.x + other.x, this.y + other.y);
  }
  
  // Subtract another vector from this one
  subtract(other: Vector): Vector {
    return new Vector(this.x - other.x, this.y - other.y);
  }
  
  // Multiply this vector by a scalar
  multiply(scalar: number): Vector {
    return new Vector(this.x * scalar, this.y * scalar);
  }
  
  // Divide this vector by a scalar
  divide(scalar: number): Vector {
    if (scalar === 0) {
      console.error("Cannot divide vector by zero");
      return this.clone();
    }
    return new Vector(this.x / scalar, this.y / scalar);
  }
  
  // Get the length (magnitude) of this vector
  length(): number {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  }
  
  // Get the squared length (useful for performance when comparing distances)
  lengthSquared(): number {
    return this.x * this.x + this.y * this.y;
  }
  
  // Normalize this vector (make it unit length)
  normalize(): Vector {
    const len = this.length();
    if (len === 0) {
      return this;
    }
    this.x /= len;
    this.y /= len;
    return this;
  }
  
  // Get a normalized copy of this vector
  normalized(): Vector {
    const len = this.length();
    if (len === 0) {
      return new Vector(0, 0);
    }
    return new Vector(this.x / len, this.y / len);
  }
  
  // Get distance to another vector
  distanceTo(other: Vector): number {
    const dx = this.x - other.x;
    const dy = this.y - other.y;
    return Math.sqrt(dx * dx + dy * dy);
  }
  
  // Get squared distance to another vector
  distanceSquaredTo(other: Vector): number {
    const dx = this.x - other.x;
    const dy = this.y - other.y;
    return dx * dx + dy * dy;
  }
  
  // Get the dot product with another vector
  dot(other: Vector): number {
    return this.x * other.x + this.y * other.y;
  }
  
  // Linear interpolation between this vector and another
  lerp(other: Vector, t: number): Vector {
    return new Vector(
      this.x + (other.x - this.x) * t,
      this.y + (other.y - this.y) * t
    );
  }
  
  // Rotate this vector by an angle (in radians)
  rotate(angle: number): Vector {
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);
    const nx = this.x * cos - this.y * sin;
    const ny = this.x * sin + this.y * cos;
    return new Vector(nx, ny);
  }
  
  // Get the angle of this vector (in radians)
  angle(): number {
    return Math.atan2(this.y, this.x);
  }
  
  // Get angle between this vector and another
  angleTo(other: Vector): number {
    return Math.atan2(other.y - this.y, other.x - this.x);
  }
  
  // Set the values of this vector
  set(x: number, y: number): Vector {
    this.x = x;
    this.y = y;
    return this;
  }
  
  // Check if this vector equals another
  equals(other: Vector): boolean {
    return this.x === other.x && this.y === other.y;
  }
  
  // Convert to string representation
  toString(): string {
    return `(${this.x}, ${this.y})`;
  }
}
