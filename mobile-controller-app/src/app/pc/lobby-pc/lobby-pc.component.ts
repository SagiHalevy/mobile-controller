import { Component,Renderer2, OnDestroy, OnInit  } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { CommonModule } from '@angular/common';
import { PcService } from '../../websocket service/pc-service/pc.service';

@Component({
  selector: 'app-lobby-pc',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './lobby-pc.component.html',
  styleUrl: './lobby-pc.component.css',

})

export class LobbyPcComponent  implements OnInit, OnDestroy  {
  roomId:string = '';
  orientationData:any;


  constructor(private route:ActivatedRoute,public signalRService: PcService, private router:Router,private renderer: Renderer2){}

  ngOnInit(){
    this.renderer.addClass(document.body, 'bg-gradient-lobby');
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
  ngOnDestroy() {
    this.signalRService.removeAllListeners();
    this.renderer.removeClass(document.body, 'bg-gradient-lobby');
  }



  startCarGame(){
    this.router.navigate(['car-game']);
  }



}
