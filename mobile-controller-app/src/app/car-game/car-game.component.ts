import { Component, Renderer2, OnDestroy, OnInit } from '@angular/core';
import { PcService } from '../websocket service/pc-service/pc.service';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-car-game',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './car-game.component.html',
  styleUrls: ['./car-game.component.css']
})
export class CarGameComponent implements OnInit, OnDestroy {
  constructor(public signalRService: PcService, private renderer: Renderer2, private router:Router,private route:ActivatedRoute) {}

  roomId:string = '';
  private obstacleUpdateInterval: any;
  gameOver: boolean = false; // Add a property to track game over state
  startTime: number = 0;
  calculatedScore: number | null = null; // Store the calculated score

  orientationData: any;
  initialBeta = -12; // in my phone, the initial beta rotation is -12 for some reason
  deadZoneThreshold = 0.5; //max Beta rotation that the car will stand still

  lives = 5; //initial lives for player

  carPosition = { x: 50, y: window.innerHeight*0.6};
  carDimension = {x:56, y:98}
  maxSpeed = 6;
  
  obstacleDimension = {x:20, y:20}
  numObstacles=10;
  obstacleMinSpeed = 6;
  obstacleMaxSpeed = 12;
  obstacles: any[] = []; //container for the obstacles objects that are  reused

  ngOnInit() {
    this.route.params.subscribe(params => {     
      this.roomId = params['roomId'];   
    });

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
    this.obstacleUpdateInterval = setInterval(() => {
      this.updateObstaclePositions();
    }, 30); 

    this.startTime = Date.now(); // Record the start time when the game begins
    this.calculatedScore=null;
  }

  ngOnDestroy() {
    clearInterval(this.obstacleUpdateInterval);
    this.signalRService.removeAllListeners();
    this.renderer.removeClass(document.body, 'bg-car-game');
  }

  private updateCarPositionAndRotation() {
    const relativeBeta = this.orientationData.beta - this.initialBeta;
    const betaWithinDeadZone = Math.abs(relativeBeta) < this.deadZoneThreshold; //stop the car if the Beta is very low(steady-mode)
    let effectiveBeta = betaWithinDeadZone ? 0 : relativeBeta;

    effectiveBeta = Math.max(-this.maxSpeed, Math.min(effectiveBeta, this.maxSpeed));
    this.carPosition.x += effectiveBeta 

    // Constrain the position within the screen
    this.carPosition.x = Math.max(0, Math.min(this.carPosition.x, window.innerWidth-this.carDimension.x));
  }

  private updateObstaclePositions() {
    for (const obstacle of this.obstacles) {
      obstacle.y += obstacle.obstacleSpeed;
      if (obstacle.y > window.innerHeight) {
        // If the obstacle falls below the screen, reset its position
        obstacle.y = 0;
        obstacle.x = Math.random() * window.innerWidth-this.obstacleDimension.x;
      }
      if(this.isCollision(this.carPosition, obstacle)){
        obstacle.y = 0;
        obstacle.x = Math.random() * window.innerWidth-this.obstacleDimension.x;
         this.lives -=1;
         if(this.lives<=0){
          this.gameOver = true;
          clearInterval(this.obstacleUpdateInterval);
         }
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


  private generateRandomObstacles(): any[] {
    const maxObstacleX = window.innerWidth;

    return Array.from({ length: this.numObstacles }, () => ({
      x: Math.random() * maxObstacleX,
      y: 0, 
      width: this.obstacleDimension.x, 
      height: this.obstacleDimension.y, 
      obstacleSpeed: Math.random()* this.obstacleMinSpeed + this.obstacleMaxSpeed  
    }));
  }


  returnToLobby(): void {
    this.router.navigate(['pc-lobby', this.roomId]);
  }

  playAgain(): void {
    // Reset game state and navigate to the game component again
    this.lives = 5;
    this.gameOver = false;
    this.obstacles = this.generateRandomObstacles();
    this.obstacleUpdateInterval = setInterval(() => {
      this.updateObstaclePositions();
    }, 30);
  }


  calculateScore(): number {
    if (this.gameOver && this.calculatedScore === null) {
      // Calculate the score based on the time of survival only once
      const endTime = Date.now();
      const elapsedTimeInSeconds = (endTime - this.startTime) / 1000; // Convert to seconds

      // 1 point for every second survived
      this.calculatedScore = Math.round(elapsedTimeInSeconds);
    }

    return this.calculatedScore || 0; // Return the calculated score or 0 if it's null
  }

}
