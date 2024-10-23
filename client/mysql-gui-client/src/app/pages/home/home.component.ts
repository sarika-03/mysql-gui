import { AfterViewInit, Component, ElementRef, Input, OnChanges, SimpleChanges, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { newTabData } from '@lib/utils/storage/storage.types';
import * as CodeMirror from 'codemirror';
import 'codemirror/mode/sql/sql';
import 'codemirror/lib/codemirror.css';

@Component({
    selector: 'app-home',
    standalone: true,
    imports: [CommonModule, RouterModule, FormsModule],
    templateUrl: './home.component.html',
})
export class HomeComponent implements OnChanges, AfterViewInit {
    @Input() tabData!: newTabData;
    @ViewChild('editor', { static: false }) editor: ElementRef;
    tabs = [];
    selectedTab = 0;
    tabContent: string[] = [];
    editorInstance: any;

    constructor() {}

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['tabData'] && this.tabData?.dbName && this.tabData?.tableName) {
            this.addTab(this.tabData.dbName, this.tabData.tableName);
        }
    }

    ngAfterViewInit() {
        // Initialize CodeMirror on the textarea
        this.editorInstance = CodeMirror.fromTextArea(this.editor.nativeElement, {
            lineNumbers: true,
            mode: 'sql', // Use SQL mode for syntax highlighting
            theme: 'default',
            lineWrapping: true, // Enable line wrapping for better readability
            matchBrackets: true, // Highlight matching brackets
        });

        // Set initial content if available
        if (this.tabContent[this.selectedTab]) {
            this.editorInstance.setValue(this.tabContent[this.selectedTab]);
        } else {
            this.editorInstance.setValue(''); // Ensure there is always a valid string
        }
    }

    addTab(dbName: string, tableName: string) {
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

        // Add empty content for the new tab if it's not already initialized
        this.tabContent.push(`SELECT * FROM ${dbName}.${tableName};`);
        this.selectTab(this.tabs.length - 1);

        // Update CodeMirror content when a new tab is added
        if (this.editorInstance) {
            this.editorInstance.setValue(this.tabContent[this.selectedTab]);
        }
    }

    selectTab(tabIndex: number) {
        this.selectedTab = tabIndex;

        // Ensure there's valid content for the selected tab
        if (!this.tabContent[tabIndex]) {
            this.tabContent[tabIndex] = ''; // Initialize with an empty string if not set
        }

        // Update the editor content based on the selected tab
        if (this.editorInstance) {
            this.editorInstance.setValue(this.tabContent[tabIndex]);
        }
    }

    closeTab(tabIndex: number) {
        this.tabs.splice(tabIndex, 1);
        this.tabContent.splice(tabIndex, 1);
        this.selectedTab = this.tabs.length ? Math.max(0, tabIndex - 1) : -1;

        if (this.editorInstance && this.selectedTab >= 0) {
            this.editorInstance.setValue(this.tabContent[this.selectedTab]);
        } else {
            this.editorInstance.setValue('');
        }
    }
}
