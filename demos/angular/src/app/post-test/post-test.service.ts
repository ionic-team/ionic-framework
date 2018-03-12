import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class PostTestService {
  constructor(private http: HttpClient) { }

  post(data: any): Observable<any> {
    return this.http.post('http://localhost:5000/test', data);
  }
}
