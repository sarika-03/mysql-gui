import { Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TableInfo } from '@lib/utils/storage/storage.types';

@Injectable({
    providedIn: 'root',
})
export class BackendService {
    BASE_URL = environment.apiUrl;

    constructor(private _http: HttpClient) {}

    getDatabases(): Observable<any[]> {
        return this._http.get<any[]>(`${this.BASE_URL}/api/mysql/databases`);
    }

    getTableInfo(dbName, table): Observable<TableInfo> {
        return this._http.get<TableInfo>(`${this.BASE_URL}/api/mysql/database/${dbName}/${table}/info`);
    }

    executeQuery(query: string, dbName: string, page: number = 1, pageSize: number = 10): Observable<any> {
        const payload = { query, page, pageSize };
        return this._http.post<any[]>(`${this.BASE_URL}/api/mysql/database/${dbName}/execute-query`, payload);
    }
}
