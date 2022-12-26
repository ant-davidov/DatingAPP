import { HttpClient } from '@angular/common/http';
import { ThisReceiver } from '@angular/compiler';
import { Injectable } from '@angular/core';
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import { BehaviorSubject } from 'rxjs';
import { take } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Group } from '../_models/group';
import { Message } from '../_models/message';
import { User } from '../_models/user';
import { getPaginationHeaders, getPaginatedResult} from './paginationHelpers';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  baseUrl= environment.apiUrl
  hubUrl =environment.hubUrl
  private hubConnection: HubConnection
  private messageThradSource = new BehaviorSubject<Message[]>([])
  messageThread$ = this.messageThradSource.asObservable()

  constructor(private http: HttpClient) { }

  getMessgaes(pageNumber,pageSize,container){
    let params = getPaginationHeaders(pageNumber,pageSize)
    params = params.append('container',container)
    return getPaginatedResult<Message[]>(this.baseUrl+'messages',params, this.http)
  }

  createHubConnection(user: User, otherUsernmae:string){
    this.hubConnection = new HubConnectionBuilder()
      .withUrl(this.hubUrl + 'message?user='+ otherUsernmae,{
        accessTokenFactory: () =>user.token
      })
      .withAutomaticReconnect()
      .build()

    this.hubConnection.start().catch(error =>  console.log(error))
    this.hubConnection.on('ReceiveMessageThread',messages =>{
      this.messageThradSource.next(messages)
    })
    this.hubConnection.on("NewMessage",message =>{
      this.messageThread$.pipe(take(1)).subscribe(messages => {
        this.messageThradSource.next([...messages,message])
      })
    })

    this.hubConnection.on('UpdatedGroup',(group:Group) => {
      if(group.connections.some(x => x.username == otherUsernmae)) {
        this.messageThread$.pipe(take(1)).subscribe(message =>{
          message.forEach(message => {
            if(!message.dateRead){
              message.dateRead =new Date(Date.now())
            }
          })
          this.messageThradSource.next([...message])
        })
      }
    })

  }

  stopHubConnection(){
    if(this.hubConnection){
      this.hubConnection.stop()
    }
   
  }

  getMessageThread(username:string){
    return this.http.get<Message[]>(this.baseUrl+ 'messages/thread/' +username)
  }

  async sendMessage(username: string,content: string){
    return this.hubConnection.invoke("SendMessage",{recipientUsername: username, content})
      .catch(error => console.log(error))
  }

  deleteMessage(id:number){
    return this.http.delete(this.baseUrl + 'messages/' + id)
  }
}
