import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, map } from 'rxjs';
import { catchError, finalize, tap } from 'rxjs/operators';
import { Olympics } from '../models/Olympic';

@Injectable({
  providedIn: 'root',
})
export class OlympicService {
  private olympicUrl = './assets/mock/olympic.json';
  private olympics$ = new BehaviorSubject<any>(undefined);

  constructor(private http: HttpClient) {}

  loadInitialData() {
    return this.http.get<Olympics[]>(this.olympicUrl).pipe(
      tap((value) => this.olympics$.next(value)),
      catchError(err => {
        throw 'error in source. Details: ' + err;
      })
    );
  }

  getOlympics(): Observable<Olympics[]> {
    return this.olympics$.asObservable();
  }

  loadCountryByName(countryName: string) {
    return this.http.get<Olympics[]>(this.olympicUrl).pipe(
      map((data) => {
        let result: Olympics[] = data.filter((item) => item.country === countryName);
        if (result.length == 0) {
          throw new Error("counrty does not exist");
        }
        return result[0];
      })
    );
  }
}
