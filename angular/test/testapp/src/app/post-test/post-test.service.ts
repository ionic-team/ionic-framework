import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class PostTestService {
  constructor(private http: HttpClient) { }

  post(data: any) {
    return this.http.post('http://localhost:5000/test', data);
  }
}
