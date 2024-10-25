import { AfterViewInit, Component, ElementRef, Input, OnChanges, SimpleChanges, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { newTabData } from '@lib/utils/storage/storage.types';
import * as CodeMirror from 'codemirror';
import 'codemirror/mode/sql/sql';
import 'codemirror/lib/codemirror.css';
import { BackendService } from '@lib/services';

@Component({
    selector: 'app-resultgrid',
    standalone: true,
    imports: [CommonModule, RouterModule, FormsModule],
    templateUrl: './resultgrid.component.html',
})
export class ResultGridComponent {
    @Input() triggerQuery: string = '';
    @Input() dbName: string = '';
    @Input() tabId: string = '';

    tabsData = new Map<string, any[]>();
    headers: string[] = [];
    rows: any[] = [];

    constructor(private dbService: BackendService) {}

    ngOnChanges(changes: SimpleChanges) {
        if (changes['triggerQuery'] || changes['dbName'] || changes['tabId']) {
            if (this.dbName != '' && this.triggerQuery != '') {
                this.executeQuery();
            }
        }
    }

    executeQuery() {
        if (this.tabsData.has(this.tabId)) {
            console.log('Using cached data for tab:', this.tabId);
            return this.tabsData.get(this.tabId);
        }

        this.dbService.executeQuery(this.triggerQuery, this.dbName).subscribe(
            (data) => {
                console.log(data);
                this.tabsData.set(this.tabId, data);
                this.setData(data);
            },
            (error) => {
                console.error('Error fetching data', error);
            },
        );
    }
    private setData(data: any[]) {
        if (data && data.length > 0) {
            this.headers = Object.keys(data[0]);
            this.rows = data;
        } else {
            this.headers = [];
            this.rows = [];
        }
    }
}
