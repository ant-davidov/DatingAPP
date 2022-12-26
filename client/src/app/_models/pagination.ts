export interface Paginaion {
    currentPage: number;
    itemsPerPage: number;
    totalItems: number;
    totalPages: number;
}
export class PaginaionResult<T>{
    result: T;
    pagination: Paginaion;

}