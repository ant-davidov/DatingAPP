import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HubConnection } from '@microsoft/signalr';
import { HubConnectionBuilder } from '@microsoft/signalr/dist/esm/HubConnectionBuilder';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject } from 'rxjs';
import { take } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { User } from '../_models/user';

@Injectable({
  providedIn: 'root'
})
export class PresenceService {
  hubUrl = environment.hubUrl
  private hubConnection : HubConnection
  private onlineuserSource = new BehaviorSubject<string[]>([])
  onlineUsers$ = this.onlineuserSource.asObservable()

  constructor(private toastr: ToastrService, private router: Router) { }
  createHubConnection(user:User){
    this.hubConnection = new HubConnectionBuilder()
      .withUrl(this.hubUrl+ 'presence', {
        accessTokenFactory:() => user.token
      })
      .withAutomaticReconnect()
      .build()
      
      this.hubConnection
        .start()
        .catch(error => console.log(error))
      this.hubConnection.on('UserIsOnline',username => {
        this.onlineUsers$.pipe(take(1)).subscribe(usernames =>{
          this.onlineuserSource.next([...usernames,username])
        })
      })
      this.hubConnection.on('UserIsOffline',username => {
        this.onlineUsers$.pipe(take(1)).subscribe(usernames => {
          this.onlineuserSource.next([...usernames,username])
        })
      
      })

      this.hubConnection.on('GetOnlineUsers',(username: string[]) =>{
        this.onlineuserSource.next(username)
      })

      this.hubConnection.on('NewMessageReceived',({username, knownAs}) => {
        console.log(username)
        this.toastr.info(knownAs + ' has sent you a new message!')
          .onTap
          .pipe(take(1))
          .subscribe(() => this.router.navigateByUrl('/members/' + username + '?tab=3'))
      })
  }
  stopHubConnection(){
    this.hubConnection.stop().catch(error => console.log(error));
  }
}
