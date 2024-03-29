import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { User } from './_models/user';
import { AccountService } from './_services/account.service';
import { PresenceService } from './_services/presence.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent  implements OnInit {
  title = 'The Dating App';
  users: any;

  constructor(private accoutService: AccountService,private presence: PresenceService) {}
  ngOnInit(): void {
  
    this.serCurrentUser()

  }
  serCurrentUser(){
    const user: User =JSON.parse(localStorage.getItem('user'))
    if(user){
      this.accoutService.setCurrentUser(user)
      this.presence.createHubConnection(user)
    }
    
  }

  
}
