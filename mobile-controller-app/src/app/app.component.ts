import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, Router } from '@angular/router';
import { OrientationSendComponent } from './orientation-send/orientation-send.component';
import { HomePageComponent } from './home-page/home-page.component';
import { HomePagePcComponent } from './pc/home-page-pc/home-page-pc.component';
import { HomePageControllerComponent } from './controller/home-page-controller/home-page-controller.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet,OrientationSendComponent,HomePageComponent,HomePagePcComponent,HomePageControllerComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  constructor( private router:Router) {
    
  }
  title = 'mobile-controller-app';
  isMobile:boolean = this.isMobileDevice();
  ngOnInit(){
    if(this.isMobile){
      this.router.navigate(['controller']);
    }
    else{
      this.router.navigate(['pc']);
    }
  }
   //Check if the user is using a mobile device, THIS MIGHT NOT BE ALWAYS ACCURATE
   isMobileDevice() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) && ('ontouchstart' in window || navigator.maxTouchPoints > 0);
  }
}
