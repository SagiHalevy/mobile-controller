import { Component } from '@angular/core';

import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ControllerService } from '../../websocket service/controller-service/controller.service';
@Component({
  selector: 'app-home-page-controller',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './home-page-controller.component.html',
  styleUrl: './home-page-controller.component.css'
})


export class HomePageControllerComponent {
  roomId = '';
  constructor(private signalRService: ControllerService, private router:Router) {

  }
  //Joining room is for the mobile device
  async joinRoom(){
    if (!this.signalRService.isConnectionEstablished()) {
      await this.signalRService.startConnection();
      this.signalRService.addJoinRoomListener((roomId) => {
        this.router.navigate(['controller-lobby', roomId]);
        console.log(`Connection Joined to: ${roomId}`);
      });
      this.signalRService.joinRoom(this.roomId);
    }
  }

  ngOnDestroy() {
    this.signalRService.removeAllListeners();

  }

}
