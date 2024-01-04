import { Component,Renderer2, OnDestroy, OnInit } from '@angular/core';
import { PcService } from '../websocket service/pc-service/pc.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-car-game',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './car-game.component.html',
  styleUrl: './car-game.component.css'
})
export class CarGameComponent implements OnInit, OnDestroy {
  constructor(public signalRService: PcService, private renderer: Renderer2){}

  orientationData:any;

  carPosition = { x: 50, y: 50 };
  maxX = 100; // Maximum allowed value for x (adjust as needed)
  sensitivity = 0.1; // Adjust the sensitivity for movement
  initialBeta = -12; // Set the initial beta value
  deadZoneThreshold = 0.5
  maxSpeed = 7;

  ngOnInit(){
    this.renderer.addClass(document.body, 'bg-car-game');
    this.signalRService.addOrientationListener((orientationData)=>{
      console.log("orien from cargame");
      this.orientationData = orientationData;
      this.updateCarPositionAndRotation();
    })
    this.signalRService.addControllerDisconnectedListener(()=>{
      console.log("controller has disconnected");
      this.signalRService.controllerConnected = false;
    })
  }

  ngOnDestroy() {
    this.signalRService.removeAllListeners();
    this.renderer.removeClass(document.body, 'bg-car-game');
  }


  private updateCarPositionAndRotation() {
    // Calculate the relative beta value from the initial orientation
    const relativeBeta = this.orientationData.beta - this.initialBeta;
  
    // Apply a dead zone for the beta value
    const betaWithinDeadZone = Math.abs(relativeBeta) < this.deadZoneThreshold;
    let effectiveBeta = betaWithinDeadZone ? 0 : relativeBeta;

    // Limit the speed of the car
    effectiveBeta = Math.max(-this.maxSpeed, Math.min(effectiveBeta, this.maxSpeed));
    // Update the car's position based on the effective beta axis (steering)
    this.carPosition.x += effectiveBeta * this.sensitivity;
  
    // Constrain the position within the screen
    this.carPosition.x = Math.max(0, Math.min(this.carPosition.x, this.maxX));
  }


}
