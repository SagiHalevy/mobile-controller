import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { CommonModule } from '@angular/common';
import { PcService } from '../../websocket service/pc-service/pc.service';

@Component({
  selector: 'app-lobby-pc',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './lobby-pc.component.html',
  styleUrl: './lobby-pc.component.css'
})

export class LobbyPcComponent {
  roomId:string = '';
  controllerConnected: boolean = false;
  orientationData:any;

  carPosition = { x: 50, y: 50 };
  maxX = 100; // Maximum allowed value for x (adjust as needed)
  sensitivity = 0.1; // Adjust the sensitivity for movement
  initialBeta = -12; // Set the initial beta value
  deadZoneThreshold = 0.5
  maxSpeed = 7;

  constructor(private route:ActivatedRoute,private signalRService: PcService){}

  ngOnInit(){
    this.route.params.subscribe(params => {     
      this.roomId = params['roomId'];   
    });
    this.signalRService.addControllerConnectedListener(()=>{
      this.controllerConnected = true;
    })
    this.signalRService.addOrientationListener((orientationData)=>{
      console.log("goti t");
      this.orientationData = orientationData;
      this.updateCarPositionAndRotation();
    })
    this.signalRService.addControllerDisconnectedListener(()=>{
      console.log("controller has disconnected");
      this.controllerConnected = false;
    })
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
