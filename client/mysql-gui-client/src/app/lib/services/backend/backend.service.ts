import { Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class BackendService {
    BASE_URL = environment.apiUrl;

    constructor(private _http: HttpClient) {}

    getDatabases(): Observable<any[]> {
        return this._http.get<any[]>(`${this.BASE_URL}/databases`);
    }

    executeQuery(query: string, dbName: string): Observable<any[]> {
        console.log('calledbackend');
        const payload = { query };
        return this._http.post<any[]>(`${this.BASE_URL}/database/${dbName}/execute-query`, payload);
    }
}
