import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';
@Injectable({
  providedIn: 'root'
})
export class PcService {
  public controllerConnected = false;
  private hubConnection!: signalR.HubConnection;
  startConnection = async ()=> {
    try {
      this.hubConnection = new signalR.HubConnectionBuilder()
        //.withUrl('https://localhost:7154/orientationHub') 
        .withUrl('https://localhost:32768/orientationHub') //docker
        //.withUrl('https://mobile-remote-server20240124183535.azurewebsites.net/orientationHub') 
        .build();

      await this.hubConnection.start();
      console.log('Connection started');
    } catch (error) {
      console.error('Error starting connection', error);
      throw error; // Re-throw the error to propagate it in the promise chain
    }
  };

  disconnectHubIfConnected() {
    if(this.hubConnection && this.hubConnection.state === signalR.HubConnectionState.Connected){
      this.hubConnection.stop();
    }
  }

 

  //listeners
  addOrientationListener = (callback: (orientationData: any) => void) => {
    this.hubConnection.on('ReceiveOrientation', (orientationData) => {
      callback(orientationData);
    });
  };
  addCreateRoomListener = (callback: (newRoomId: string) => void) => {
    this.hubConnection.on('ReceiveRoomId', (newRoomId) => {
      callback(newRoomId);
    });
  };
  addJoinRoomListener = (callback: (roomId: string) => void) => {
    this.hubConnection.on('ReceiveSuccessJoin', (roomId) => {
      callback(roomId);
    });
  };
  addControllerConnectedListener = (callback: () => void) => {
    this.hubConnection.on('ControllerSuccessJoin', () => {
      callback();
    });
  };
  addControllerDisconnectedListener = (callback: () => void) => {
    this.hubConnection.on('ControllerDisconnected', () => {
      callback();
    });
  };


  //sending to the server
  createRoom = () => {
    this.hubConnection.invoke('CreateRoom').catch(err => console.error(err));
  };


   // Remove event listeners
  removeAllListeners = () => {
    if(this.hubConnection){
      this.hubConnection.off('ReceiveOrientation'); 
      this.hubConnection.off('ReceiveRoomId'); 
      this.hubConnection.off('ReceiveSuccessJoin'); 
      this.hubConnection.off('ControllerSuccessJoin'); 
      this.hubConnection.off('ControllerDisconnected'); 
    }
  }


}
