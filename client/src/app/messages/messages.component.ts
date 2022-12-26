import { Component, OnInit } from '@angular/core';
import { Message } from '../_models/message';
import { Paginaion } from '../_models/pagination';
import { ConfirmService } from '../_services/confirm.service';
import { MessageService } from '../_services/message.service';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.css']
})
export class MessagesComponent implements OnInit {
  messages: Message[] = []
  pagination: Paginaion
  container = 'Unread'
  pageNumber = 1
  pageSize = 5
  constructor(private messageService: MessageService, private confirmService:ConfirmService) { }
  loading =false

  ngOnInit(): void {
    this.loadMessages()
    
  }

  loadMessages(){
    this.loading=true
    this.messageService.getMessgaes(this.pageNumber,this.pageSize,this.container).subscribe(response =>{
      this.messages= response.result
      this.pagination= response.pagination
      this.loading=false
    }
      )
  }

  deleteMessage(id: number){
    this.confirmService.confirm('Confirm delete message', 'This cannot be undone').subscribe( result =>{
      if(result){
        this.messageService.deleteMessage(id).subscribe(() =>{
          this.messages.splice(this.messages.findIndex(m => m.id === id ),1 )
        })  
      }
    })
    
  }
  
  pageChanged(event:any){
    if(this.pageNumber !== event.page){
    this.pageNumber =event.page
    this.loadMessages()
    console.log(this.messages)
    }
  }

}
