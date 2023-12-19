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
  orientationData:any;


  constructor(private route:ActivatedRoute,public signalRService: PcService, private router:Router){}

  ngOnInit(){
    this.route.params.subscribe(params => {     
      this.roomId = params['roomId'];   
    });
    this.signalRService.addControllerConnectedListener(()=>{
      this.signalRService.controllerConnected = true;  
    })
    this.signalRService.addControllerDisconnectedListener(()=>{
      console.log("controller has disconnected");
      this.signalRService.controllerConnected = false;
    })
    this.signalRService.addOrientationListener((orientationData)=>{
      console.log("orien");
      this.orientationData = orientationData; 
    })

  }

  startCarGame(){
    this.router.navigate(['car-game']);
  }
  ngOnDestroy() {
    this.signalRService.removeAllListeners();

  }


}
