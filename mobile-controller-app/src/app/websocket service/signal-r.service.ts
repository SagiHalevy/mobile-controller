import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';
@Injectable({
  providedIn: 'root'
})
export class SignalRService {
  
  constructor() {}
  private hubConnection!: signalR.HubConnection

  startConnection = async ()=> {
    try {
      this.hubConnection = new signalR.HubConnectionBuilder()
        .withUrl('https://localhost:7154/orientationHub') 
        .build();
  
      await this.hubConnection.start();
      console.log('Connection started');
    } catch (error) {
      console.error('Error starting connection', error);
      throw error; // Re-throw the error to propagate it in the promise chain
    }
  };
  
  




//---Listeners---
  addMessageListener = (callback: (user: string, message: string) => void) => {
    this.hubConnection.on('ReceiveMessage', (user, message) => {
      callback(user, message);
    });
  };
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




  //---Sending to server---
  sendMessageToServer = (user: string, message: string) => {
    this.hubConnection.invoke('SendMessage', user, message);
  };
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
 
  createRoom = () => {
    this.hubConnection.invoke('CreateRoom').catch(err => console.error(err));
  };
  
  joinRoom = (roomId: string) => {
    this.hubConnection.invoke('JoinRoom', roomId).catch(err => console.error(err));
  };



  
}
