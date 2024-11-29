// github-integration.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GithubIntegrationService {

  private apiUrl = 'http://localhost:3000/api/github';

  constructor(private http: HttpClient) { }

  checkConnection(): Observable<any> {
    // return this.http.get<any>(`${this.apiUrl}/orgs`, { withCredentials: true })
    return this.http.get<any>(`${this.apiUrl}/status`, { withCredentials: true });
  }



  disconnect(): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/disconnect`, { withCredentials: true });
  }
}
