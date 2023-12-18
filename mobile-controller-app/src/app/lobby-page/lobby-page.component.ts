import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { SignalRService } from '../websocket service/signal-r.service';

@Component({
  selector: 'app-lobby-page',
  standalone: true,
  imports: [CommonModule, FormsModule,RouterModule],
  templateUrl: './lobby-page.component.html',
  styleUrl: './lobby-page.component.css'
})
export class LobbyPageComponent implements OnInit{
  roomId:string = '';
  isMobile: boolean = this.isMobileDevice();
  controllerConnected: boolean = false;

  orientationData:any;

  carPosition = { x: 50, y: 50 };
  maxX = 100; // Maximum allowed value for x (adjust as needed)
  sensitivity = 0.1; // Adjust the sensitivity for movement
  initialBeta = -12; // Set the initial beta value
  deadZoneThreshold = 0.5
  maxSpeed = 7;
  private lastSentTime: number = 0;


  constructor(private route:ActivatedRoute,private signalRService: SignalRService,private router:Router){}

  ngOnInit(){
    window.addEventListener('beforeunload', this.onBeforeUnload.bind(this));

    this.route.params.subscribe(params => {     
      this.roomId = params['roomId'];   
    });

    if (!this.isMobile){
      this.signalRService.addControllerConnectedListener(()=>{
        this.controllerConnected = true;
      })
      this.signalRService.addOrientationListener((orientationData)=>{
        this.orientationData = orientationData;
        this.updateCarPositionAndRotation();
      })
    }else{
      window.addEventListener('deviceorientation', this.orientationEventListener);
    }
  
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
  
  
  
  
  ngOnDestroy() {
    // Remove the event listener when the component is destroyed
    window.removeEventListener('beforeunload', this.onBeforeUnload.bind(this));
  }

  // Event listener for window.beforeunload
  onBeforeUnload(event: BeforeUnloadEvent) {
    if (!this.controllerConnected) {
      // Display a warning message when the user is leaving the page
      event.returnValue = 'You have unsaved changes. Are you sure you want to leave?';
      //this.router.navigate(['']);
    }
  }

  //Check if the user is using a mobile device, THIS MIGHT NOT BE ALWAYS ACCURATE
  isMobileDevice() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) && ('ontouchstart' in window || navigator.maxTouchPoints > 0);
  }


  //Sending the orientation data to the server
  private orientationEventListener = (event: DeviceOrientationEvent) => {

  // Extract relevant orientation data
  
    const { alpha, beta, gamma } = event;

    // Create an object with the orientation data
    const orientationData = { alpha, beta, gamma };

    // Send the orientation data to the server
    this.signalRService.sendOrientationToServer(orientationData);
  
  };

}
