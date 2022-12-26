import { HttpClient, HttpParams } from "@angular/common/http";
import { map } from "rxjs/operators";
import { Member } from "../_models/member";
import { PaginaionResult } from "../_models/pagination";


export function  getPaginatedResult<T>(url,params, http :HttpClient) {
    const paginatedResult : PaginaionResult<T> = new PaginaionResult<T>();
    return http.get<T>(url, { observe: 'response', params }).pipe(
      map(response => {
        paginatedResult.result = response.body;
        if (response.headers.get('Pagination') !== null) {

          paginatedResult.pagination = JSON.parse(response.headers.get('Pagination'));
        }
        return paginatedResult;
      })

    );
  }
  export function  getPaginationHeaders(pageNumber:Number, pageSize:number){
    let params = new HttpParams()
    params = params.append('pageNumber',pageNumber.toString())
    params= params.append('pageSize',pageSize.toString())
    return params;
    }