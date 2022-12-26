import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { csLocale } from 'ngx-bootstrap/chronos';
import { Observable, of, pipe } from 'rxjs';
import { map, retry, take } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

import { Member } from '../_models/member';
import { PaginaionResult } from '../_models/pagination';
import { User } from '../_models/user';
import { UserParams } from '../_models/userParams';
import { AccountService } from './account.service';
import { getPaginatedResult, getPaginationHeaders } from './paginationHelpers';
const httpOptions ={
  headers: new HttpHeaders({
    Authorization: 'Bearer ' + JSON.parse(localStorage.getItem('user'))
  })
}
@Injectable({
  providedIn: 'root'
})
export class MembersService {
  baseUerl=environment.apiUrl
  members: Member[] = []
  memberCache= new Map()
  user:User
  userParams: UserParams

  constructor(private http: HttpClient, private accountService:AccountService) {
    this.accountService.currentUser$.pipe(take(1)).subscribe(user=> {
      this.user= user
      this.userParams = new UserParams(user)
    })
    
   }
   getUserParams(){
    return this.userParams
   }
   setUserParams(params){
    this.userParams= params
   }
   resetUserParams(){
    this.userParams= new UserParams(this.user)
    return this.userParams
   }
  getMembers(UserParams: UserParams){
    var response = this.memberCache.get(Object.values(UserParams).join('-'))
     if (response) {
       return of (response)
    }
    let params = getPaginationHeaders(UserParams.pageNumber,UserParams.pageSize)
    params =params.append('minAge',UserParams.minAge.toString())
    params =params.append('maxAge',UserParams.maxAge.toString())
    params =params.append('gender',UserParams.gender)
    params =params.append('orderBy',UserParams.orderBy)
    return getPaginatedResult<Member[]>(this.baseUerl +'users',params,this.http)
    .pipe(map( response =>{
      this.memberCache.set(Object.values(UserParams).join('-'),response)
      return response
    }))

  }

  addLike(username: string){
    return this.http.post(this.baseUerl + 'likes/' + username,{})
  }  
  getLikes(predicate: string, pageNumber , pageSize){
    let params = getPaginationHeaders(pageNumber,pageSize);
    params = params.append('predicate',predicate)
    console.log(predicate)
    return getPaginatedResult<Partial<Member[]>>(this.baseUerl + 'likes?predicate=' + predicate,params,this.http)
  }
  
  
  getMember(username: string){
    const member = [...this.memberCache.values()]
    .reduce((arr,elem)=>arr.concat(elem.result),[])
    .find((member:Member) => member.username === username)
     if(member) {
       return of(member)
    }
    return  this.http.get<Member>(this.baseUerl+`users/${username}`)
  }
  updateMember(member:Member){
    return this.http.put(this.baseUerl+'users',member).pipe(
      map(() => {
        const index = this.members.indexOf(member)
        this.members[index]= member;
      })
    )
  }
  setMainPhoto(photoId: number){
    return this.http.put(this.baseUerl + 'users/set-main-photo/' + photoId,{});
  }
  deletePhoto(photoId: number){
    return this.http.delete(this.baseUerl+ 'users/delete-photo/'+photoId)
  }
}
