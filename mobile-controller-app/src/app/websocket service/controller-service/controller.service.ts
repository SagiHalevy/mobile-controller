import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';
@Injectable({
  providedIn: 'root'
})
export class ControllerService {

  constructor() { }
  private hubConnection!: signalR.HubConnection;
  startConnection = async ()=> {
    try {
      this.hubConnection = new signalR.HubConnectionBuilder()
        .withUrl('https://192.168.1.24:5001/orientationHub') 
        .build();
  
      await this.hubConnection.start();
      console.log('Connection started');
    } catch (error) {
      console.error('Error starting connection', error);
      throw error; // Re-throw the error to propagate it in the promise chain
    }
  };

  // Check if the connection is established
  isConnectionEstablished() {
    return this.hubConnection && this.hubConnection.state === signalR.HubConnectionState.Connected;
  }

  //listeners
  addJoinRoomListener = (callback: (roomId: string) => void) => {
    this.hubConnection.on('ReceiveSuccessJoin', (roomId) => {
      callback(roomId);
    });
  };
  addRoomCreatorDisconnectedListener = (callback: () => void) => {
    this.hubConnection.on('RoomCreatorDisconnected', () => {
      callback();
    });
  };





//sending to the server
sendOrientationToServer(orientationData: any) {
  if (this.hubConnection && this.hubConnection.state === signalR.HubConnectionState.Connected) {
    // Invoke the server method to handle the orientation data
    this.hubConnection.invoke('SendOrientation', orientationData)
      .catch((err) => {
        console.error('Error while sending orientation data:', err);
      });
  } else {
    console.error('Hub connection not established or in an invalid state');
  }
}
joinRoom = (roomId: string) => {
  this.hubConnection.invoke('JoinRoom', roomId).catch(err => console.error(err));
};



  // Remove event listeners
  removeAllListeners = () => {
    if(this.hubConnection){
      this.hubConnection.off('ReceiveSuccessJoin'); 
      this.hubConnection.off('RoomCreatorDisconnected'); 
    }
  }

}
