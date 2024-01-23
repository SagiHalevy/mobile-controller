import { Component,Renderer2, OnDestroy, OnInit  } from '@angular/core';

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
export class HomePagePcComponent implements OnInit, OnDestroy {
  
  constructor(private signalRService: PcService, private router:Router,private renderer: Renderer2) {}

  ngOnInit() {
    this.signalRService.disconnectHubIfConnected()
    this.renderer.addClass(document.body, 'bg-gradient-home');
  }
  ngOnDestroy() {
    this.signalRService.removeAllListeners();
    this.renderer.removeClass(document.body, 'bg-gradient-home');
  }


  //Establish web-socket connection and retrieve room ID from the server
  async createRoom(){
      await this.signalRService.startConnection();

      this.signalRService.addCreateRoomListener((newRoomId) => {
        this.router.navigate(['pc-lobby', newRoomId]);
      });
      
      this.signalRService.createRoom();
    }


}
