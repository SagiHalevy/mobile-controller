import { Component } from '@angular/core';

import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { PcService } from '../../websocket service/pc-service/pc.service';
@Component({
  selector: 'app-home-page-pc',
  standalone: true,
  imports: [FormsModule,CommonModule],
  templateUrl: './home-page-pc.component.html',
  styleUrl: './home-page-pc.component.css'
})
export class HomePagePcComponent {
  constructor(private signalRService: PcService, private router:Router) {
   
  }
  //Establish web-socket connection and retrieve room ID from the server
  async createRoom(){
    if (!this.signalRService.isConnectionEstablished()) {
      await this.signalRService.startConnection();

      this.signalRService.addCreateRoomListener((newRoomId) => {
        this.router.navigate(['pc-lobby', newRoomId]);
      });
      
      this.signalRService.createRoom();
    }
  }

  

}
