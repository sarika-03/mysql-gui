import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { RouterModule } from '@angular/router';
import { newTabData } from '@lib/utils/storage/storage.types';

@Component({
    selector: 'app-home',
    standalone: true,
    imports: [CommonModule, RouterModule],
    templateUrl: './home.component.html',
    changeDetection: ChangeDetectionStrategy.Default,
})
export class HomeComponent implements OnChanges {
    @Input() tabData!: newTabData;
    tabs = [];
    selectedTab = 1;

    constructor(private cdr: ChangeDetectorRef) {
        console.log(this.tabData);
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['tabData']) {
            this.addTab(this.tabData.dbName, this.tabData.tableName);
            console.log('newTabData updated:', this.tabData);
        }
    }

    addTab(dbName, tableName) {
        const id = `${dbName}.${tableName}`;
        const tabIndex = this.tabs.findIndex((tab) => tab.id === id);
        if (tabIndex > -1) {
            this.selectTab(tabIndex);
            return;
        }
        this.tabs.push({
            id,
            dbName,
            tableName,
        });
        this.selectTab(this.tabs.length - 1);
    }

    selectTab(tabIndex: number) {
        this.selectedTab = tabIndex;
    }
}
