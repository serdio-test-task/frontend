import { Injectable } from '@angular/core';
import {Observable} from "rxjs";
import {HttpClient} from "@angular/common/http";
@Injectable({
  providedIn: 'root',  // Ensures it's provided globally at the root level
})
export class OrganizationService {

  private apiUrl = 'http://localhost:3000/api/github';

  constructor(private http: HttpClient) { }

  getOrganizations(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/orgs`, { withCredentials: true });
  }
}
