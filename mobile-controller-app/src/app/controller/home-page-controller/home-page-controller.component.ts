import { Component } from '@angular/core';

import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ControllerService } from '../../websocket service/controller-service/controller.service';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-home-page-controller',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './home-page-controller.component.html',
  styleUrl: './home-page-controller.component.css'
})


export class HomePageControllerComponent {
  messageFromTheServer: string|null = null;
  roomId = '';
  constructor(private signalRService: ControllerService, private router:Router) {
  }
  ngOnInit() {
    this.signalRService.disconnectHubIfConnected()

  }
  
  //Joining room is for the mobile device
  async joinRoom(){
    await this.signalRService.startConnection();
    
    this.signalRService.addGetMessageListener((message) => {
      console.log(`Message from the server: ${message}`);
      this.messageFromTheServer = message;
      setTimeout(() => { //remove the message after a while
        this.messageFromTheServer = null;
      }, 3000);
      this.signalRService.disconnectHubIfConnected(); //DC bcz if a message from the server is received here it means something went wrong.
    });

    this.signalRService.addJoinRoomListener((roomId) => {
      this.router.navigate(['controller-lobby', roomId]);
      console.log(`Connection Joined to: ${roomId}`);
    });
    this.signalRService.joinRoom(this.roomId);
  }

  ngOnDestroy() {
    this.signalRService.removeAllListeners();

  }

}
