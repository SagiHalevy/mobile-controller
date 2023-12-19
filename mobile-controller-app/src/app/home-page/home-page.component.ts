import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { SignalRService } from '../websocket service/signal-r.service';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.css'
})
export class HomePageComponent {
  isMobile: boolean = this.isMobileDevice();
  roomId = '';
  constructor(private signalRService: SignalRService, private router:Router) {

  }


//Establish web-socket connection and retrieve room ID from the server
async createRoom(){
  if (!this.signalRService.isConnectionEstablished()) {
    await this.signalRService.startConnection();

    this.signalRService.addCreateRoomListener((newRoomId) => {
      this.router.navigate(['lobby', newRoomId]);
    });
    
    this.signalRService.createRoom();
  }
}

//Joining room is for the mobile device
async joinRoom(){

  if (!this.signalRService.isConnectionEstablished()) {
    await this.signalRService.startConnection();
    this.signalRService.addJoinRoomListener((roomId) => {
      this.router.navigate(['lobby', roomId]);
      console.log(`Connection Joined to: ${roomId}`);
    });
    this.signalRService.joinRoom(this.roomId);
  }
}


  //Check if the user is using a mobile device, THIS MIGHT NOT BE ALWAYS ACCURATE
  isMobileDevice() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) && ('ontouchstart' in window || navigator.maxTouchPoints > 0);
  }




}

