import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { throwError, Observable, of } from 'rxjs';
import { concatMap, mergeMap, switchMap, tap} from 'rxjs/operators';
import { Supplier } from './supplier';

@Injectable({
  providedIn: 'root'
})
export class SupplierService {
  suppliersUrl = 'api/suppliers';

  supplierWithConcatMap$ = of(1,5,8)
  .pipe(
    tap(id => console.log('concatMap source observable', id)),
    concatMap (id => this.http.get<Supplier>(`${this.suppliersUrl}/${id}`)),
    tap(item => console.log('concatMap result', item)),
  );

  supplierWithMergeMap$ = of(1,5,8)
  .pipe(
    tap(id => console.log('mergeMap source observable', id)),
    mergeMap (id => this.http.get<Supplier>(`${this.suppliersUrl}/${id}`)),
    tap(item => console.log('mergeMap result', item)),
  );

  supplierWithSwitchMap$ = of(1,5,8)
  .pipe(
    tap(id => console.log('switchMap source observable', id)),
   switchMap (id => this.http.get<Supplier>(`${this.suppliersUrl}/${id}`)),
    tap(item => console.log('switchMap result', item)),
  );

  constructor(private http: HttpClient) {}

  private handleError(err: any): Observable<never> {
    // in a real world app, we may send the server to some remote logging infrastructure
    // instead of just logging it to the console
    let errorMessage: string;
    if (err.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      errorMessage = `An error occurred: ${err.error.message}`;
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      errorMessage = `Backend returned code ${err.status}: ${err.body.error}`;
    }
    console.error(err);
    return throwError(errorMessage);
  }

}
