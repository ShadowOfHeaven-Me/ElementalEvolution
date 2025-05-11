import { Vector } from "../utils/Vector";

interface MousePosition {
  x: number;
  y: number;
}

interface InputState {
  up: boolean;
  down: boolean;
  left: boolean;
  right: boolean;
  shooting: boolean;
  mousePosition: MousePosition | null;
}

export class InputManager {
  private canvas: HTMLCanvasElement;
  private inputState: InputState;
  private keyDownHandler: (event: KeyboardEvent) => void;
  private keyUpHandler: (event: KeyboardEvent) => void;
  private mouseMoveHandler: (event: MouseEvent) => void;
  private mouseDownHandler: (event: MouseEvent) => void;
  private mouseUpHandler: (event: MouseEvent) => void;
  
  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    
    this.inputState = {
      up: false,
      down: false,
      left: false,
      right: false,
      shooting: false,
      mousePosition: null
    };
    
    // Bind event handlers
    this.keyDownHandler = this.handleKeyDown.bind(this);
    this.keyUpHandler = this.handleKeyUp.bind(this);
    this.mouseMoveHandler = this.handleMouseMove.bind(this);
    this.mouseDownHandler = this.handleMouseDown.bind(this);
    this.mouseUpHandler = this.handleMouseUp.bind(this);
    
    // Register event listeners
    window.addEventListener("keydown", this.keyDownHandler);
    window.addEventListener("keyup", this.keyUpHandler);
    canvas.addEventListener("mousemove", this.mouseMoveHandler);
    canvas.addEventListener("mousedown", this.mouseDownHandler);
    canvas.addEventListener("mouseup", this.mouseUpHandler);
  }
  
  // Get current input state
  getInput(): InputState {
    return { ...this.inputState };
  }
  
  // Clean up event listeners
  cleanup(): void {
    window.removeEventListener("keydown", this.keyDownHandler);
    window.removeEventListener("keyup", this.keyUpHandler);
    this.canvas.removeEventListener("mousemove", this.mouseMoveHandler);
    this.canvas.removeEventListener("mousedown", this.mouseDownHandler);
    this.canvas.removeEventListener("mouseup", this.mouseUpHandler);
  }
  
  // Handle key down events
  private handleKeyDown(event: KeyboardEvent): void {
    switch (event.code) {
      case "KeyW":
      case "ArrowUp":
        this.inputState.up = true;
        break;
      case "KeyS":
      case "ArrowDown":
        this.inputState.down = true;
        break;
      case "KeyA":
      case "ArrowLeft":
        this.inputState.left = true;
        break;
      case "KeyD":
      case "ArrowRight":
        this.inputState.right = true;
        break;
      case "Space":
        this.inputState.shooting = true;
        break;
    }
  }
  
  // Handle key up events
  private handleKeyUp(event: KeyboardEvent): void {
    switch (event.code) {
      case "KeyW":
      case "ArrowUp":
        this.inputState.up = false;
        break;
      case "KeyS":
      case "ArrowDown":
        this.inputState.down = false;
        break;
      case "KeyA":
      case "ArrowLeft":
        this.inputState.left = false;
        break;
      case "KeyD":
      case "ArrowRight":
        this.inputState.right = false;
        break;
      case "Space":
        this.inputState.shooting = false;
        break;
    }
  }
  
  // Handle mouse move events
  private handleMouseMove(event: MouseEvent): void {
    const rect = this.canvas.getBoundingClientRect();
    
    this.inputState.mousePosition = {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top
    };
  }
  
  // Handle mouse down events
  private handleMouseDown(event: MouseEvent): void {
    if (event.button === 0) { // Left mouse button
      this.inputState.shooting = true;
    }
  }
  
  // Handle mouse up events
  private handleMouseUp(event: MouseEvent): void {
    if (event.button === 0) { // Left mouse button
      this.inputState.shooting = false;
    }
  }
}
