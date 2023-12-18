import { Component} from '@angular/core';
import { SignalRService } from '../websocket service/signal-r.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-orientation-send',
  standalone: true,
  imports: [CommonModule, RouterModule,FormsModule],
  templateUrl: './orientation-send.component.html',
  styleUrl: './orientation-send.component.css'
})
export class OrientationSendComponent {
  user = ''; // Add a property for the user
  message = ''; // Add a property for the message
  chatMessages: any[] = []; // Add a property for storing chat messages
  isOrientationListening: boolean = false; // Added definition
  isMobile: boolean = this.isMobileDevice();
  roomId: string = "";
  constructor(private signalRService: SignalRService) {
 
  }
  

//Activated by button, send the message to the server
  sendMessageToServer() {
    this.signalRService.sendMessageToServer(this.user, this.message);
    // Clear the message input after sending
    this.message = '';
  }


//Activated by button, on/off to send orientation data to server
 toggleDeviceOrientation() {
  if ('DeviceOrientationEvent' in window && this.isMobileDevice()) {
    if (!this.isOrientationListening) {
      // Start listening for device orientation
      window.addEventListener('deviceorientation', this.orientationEventListener);
      this.isOrientationListening = true;
    } else {
      // Stop listening for device orientation
      window.removeEventListener('deviceorientation', this.orientationEventListener);
      this.isOrientationListening = false;
    }
  } else {
    console.error('Device orientation not supported');
  }
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


//Check if the user is using a mobile device, THIS MIGHT NOT BE ALWAYS ACCURATE
isMobileDevice() {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) && ('ontouchstart' in window || navigator.maxTouchPoints > 0);
}

//Establish web-socket connection and retrieve room ID from the server --@@copied
async createRoom(){
  await this.signalRService.startConnection();
  this.signalRService.addMessageListener((user, message) => {
    console.log(`server sends back: ${user}: ${message}`);
    this.chatMessages.push({ user, message }); // Add the received message to chatMessages
  });

  this.signalRService.addCreateRoomListener((newRoomId) => {
    this.roomId = newRoomId;
  });
  this.signalRService.createRoom();
}









}
