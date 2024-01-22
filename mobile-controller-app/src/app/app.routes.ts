import { Routes } from '@angular/router';
import { HomePagePcComponent } from './pc/home-page-pc/home-page-pc.component';
import { HomePageControllerComponent } from './controller/home-page-controller/home-page-controller.component';
import { LobbyPcComponent } from './pc/lobby-pc/lobby-pc.component';
import { LobbyControllerComponent } from './controller/lobby-controller/lobby-controller.component';
import { CarGameComponent } from './car-game/car-game.component';

export const routes: Routes = [
    {
        path: 'pc',
        component:HomePagePcComponent
    },
    {
        path: 'controller',
        component:HomePageControllerComponent
    },
    {
        path: 'pc-lobby/:roomId',
        component:LobbyPcComponent
    },
    {
        path: 'controller-lobby/:roomId',
        component:LobbyControllerComponent
    },
    {
        path: 'car-game/:roomId',
        component:CarGameComponent
    }
];
