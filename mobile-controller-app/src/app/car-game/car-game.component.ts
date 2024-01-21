import { Component, Renderer2, OnDestroy, OnInit } from '@angular/core';
import { PcService } from '../websocket service/pc-service/pc.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-car-game',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './car-game.component.html',
  styleUrls: ['./car-game.component.css']
})
export class CarGameComponent implements OnInit, OnDestroy {
  constructor(public signalRService: PcService, private renderer: Renderer2) {}

  orientationData: any;
  carPosition = { x: 50, y: window.innerHeight*0.6};
  carDimension = {x:120, y:120}
  obstacleDimension = {x:20, y:20}
  maxX = window.innerWidth;
  sensitivity = 0.1;
  initialBeta = -12;
  deadZoneThreshold = 0.5;
  maxSpeed = 125;
  score = 0;
  obstacleSpeed = 6;
  obstacles: any[] = [];

  ngOnInit() {
    this.renderer.addClass(document.body, 'bg-car-game');
    this.signalRService.addOrientationListener((orientationData) => {
      this.orientationData = orientationData;
      this.updateCarPositionAndRotation();
    });
    this.signalRService.addControllerDisconnectedListener(() => {
      console.log("controller has disconnected");
      this.signalRService.controllerConnected = false;
    });

    // Initialize obstacles
    this.obstacles = this.generateRandomObstacles();
    setInterval(() => {
      this.updateObstaclePositions();
    }, 50); 
  }

  ngOnDestroy() {
    this.signalRService.removeAllListeners();
    this.renderer.removeClass(document.body, 'bg-car-game');
  }

  private updateCarPositionAndRotation() {
    const relativeBeta = this.orientationData.beta - this.initialBeta;
    const betaWithinDeadZone = Math.abs(relativeBeta) < this.deadZoneThreshold;
    let effectiveBeta = betaWithinDeadZone ? 0 : relativeBeta;

    effectiveBeta = Math.max(-this.maxSpeed, Math.min(effectiveBeta, this.maxSpeed));
    this.carPosition.x += effectiveBeta * this.sensitivity;

    // Constrain the position within the screen
    this.carPosition.x = Math.max(0, Math.min(this.carPosition.x, this.maxX));

    // Check for collisions with obstacles
    for (const obstacle of this.obstacles) {
      if (this.isCollision(this.carPosition, obstacle)) {
        this.resetGame();
      }
    }
  }

  private updateObstaclePositions() {
    for (const obstacle of this.obstacles) {
      obstacle.y += this.obstacleSpeed;
      console.log(obstacle.x)
      if (obstacle.y > window.innerHeight) {
        // If the obstacle falls below the screen, reset its position
        obstacle.y = 0;
        obstacle.x = Math.random() * this.maxX;
      }
    }
  }

  private isCollision(carPosition: { x: number, y: number }, obstacle: any): boolean {
    return (
      carPosition.x < obstacle.x + obstacle.width &&
      carPosition.x + this.carDimension.x > obstacle.x && 
      carPosition.y < obstacle.y + obstacle.height &&
      carPosition.y + this.carDimension.y > obstacle.y 
    );
  }

  private resetGame() {
    console.log("Yaeaeaea")
    this.score = 0;
    this.obstacles = this.generateRandomObstacles();
  }

  private generateRandomObstacles(): any[] {
    const numObstacles = 1;
    const maxObstacleX = this.maxX;

    return Array.from({ length: numObstacles }, () => ({
      x: Math.random() * maxObstacleX,
      y: 0, 
      width: this.obstacleDimension.x, 
      height: this.obstacleDimension.y, 
    }));
  }
}
