import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanDeactivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { MemberEdditComponent } from '../members/member-eddit/member-eddit.component';
import { ConfirmService } from '../_services/confirm.service';

@Injectable({
  providedIn: 'root'
})
export class PreventUnsaveChangesGuard implements CanDeactivate<unknown> {

  constructor(private confirmService: ConfirmService) {}

  canDeactivate(
    component: MemberEdditComponent): Observable<boolean> | boolean {
      if(component.editForm.dirty){
        return  this.confirmService.confirm()
      }
      return true;
  }
  
}
