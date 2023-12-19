import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ControllerService } from '../../websocket service/controller-service/controller.service';


@Component({
  selector: 'app-lobby-controller',
  standalone: true,
  imports: [],
  templateUrl: './lobby-controller.component.html',
  styleUrl: './lobby-controller.component.css'
})
export class LobbyControllerComponent {
  roomId:string = '';

  constructor(private route:ActivatedRoute,private signalRService: ControllerService,private router:Router){}
  ngOnInit(){
    this.route.params.subscribe(params => {     
      this.roomId = params['roomId'];   
    });
    this.signalRService.addRoomCreatorDisconnectedListener(()=>{
      console.log("room creator has disconnected(Redirecting to home page)");
      this.router.navigate(['']);
      
    })  
    window.addEventListener('deviceorientation', this.orientationEventListener);
  }



  //Sending the orientation data to the server
  private orientationEventListener = (event: DeviceOrientationEvent) => {   
    const { alpha, beta, gamma } = event;
    const orientationData = { alpha, beta, gamma };
    this.signalRService.sendOrientationToServer(orientationData);    
  };
}
