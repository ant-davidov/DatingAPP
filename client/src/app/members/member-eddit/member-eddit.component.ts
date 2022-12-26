import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { take } from 'rxjs/operators';
import { Member } from 'src/app/_models/member';
import { User } from 'src/app/_models/user';
import { AccountService } from 'src/app/_services/account.service';
import { MembersService } from 'src/app/_services/members.service';

@Component({
  selector: 'app-member-eddit',
  templateUrl: './member-eddit.component.html',
  styleUrls: ['./member-eddit.component.css']
})
export class MemberEdditComponent implements OnInit {
  @ViewChild('editForm') editForm: NgForm
  @HostListener('window:beforeunload',['$event']) unloandNotification($event:any){
    if(this.editForm.dirty){
      $event.returnValue=true
    }
  }
  member: Member
  user: User
  constructor(private accountService:AccountService, private memberService:MembersService,
    private toastr:ToastrService, private router: Router) {
    this.accountService.currentUser$.pipe(take(1)).subscribe(user => this.user = user)
    this.router.routeReuseStrategy.shouldReuseRoute = () =>false
   }

  ngOnInit(): void {
    this.loadMember()
  }
   loadMember(){
    this.memberService.getMember(this.user.username).subscribe(member => {
      this.member= member
    })
   }
   updateMember(){
    this.memberService.updateMember(this.member).subscribe( () => {
      this.toastr.success("Ok")
      this.editForm.reset(this.member)
    })
    
   }
}
