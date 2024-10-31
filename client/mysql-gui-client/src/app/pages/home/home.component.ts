import {
    AfterViewChecked,
    AfterViewInit,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    ElementRef,
    Input,
    OnChanges,
    SimpleChanges,
    ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { newTabData } from '@lib/utils/storage/storage.types';
import { ResultGridComponent } from '@pages/resultgrid/resultgrid.component';
import * as ace from 'ace-builds';
import 'ace-builds/src-noconflict/mode-sql';
import 'ace-builds/src-noconflict/theme-github';
import 'ace-builds/src-noconflict/ext-language_tools';

@Component({
    selector: 'app-home',
    standalone: true,
    imports: [CommonModule, RouterModule, FormsModule, ResultGridComponent],
    templateUrl: './home.component.html',
})
export class HomeComponent implements OnChanges, AfterViewInit, AfterViewChecked {
    @Input() tabData!: newTabData;
    @ViewChild('editor', { static: false }) editor: ElementRef;
    @ViewChild('tabContainer', { static: false }) tabContainer: ElementRef;
    tabs = [];
    selectedTab = -1;
    tabContent: string[] = [];
    editorInstance: any;
    needsEditorInit = false;
    triggerQuery: string = '';
    executeTriggered: boolean = false;
    selectedDB: string = '';
    currentTabId: string = '';

    constructor(private cdr: ChangeDetectorRef) {}

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['tabData'] && this.tabData?.dbName && this.tabData?.tableName) {
            this.addTab(this.tabData.dbName, this.tabData.tableName);
        }
    }

    ngAfterViewInit() {
        this.checkAndInitializeEditor();
    }

    ngAfterViewChecked() {
        if (this.needsEditorInit && this.selectedTab >= 0 && this.editor && !this.editorInstance) {
            this.checkAndInitializeEditor();
            this.editorInstance.setValue(this.tabContent[this.selectedTab]);
            this.needsEditorInit = false;
        }
    }

    checkAndInitializeEditor() {
        if (!this.editorInstance && this.editor) {
            this.initializeEditor();
        }
    }

    initializeEditor() {
        ace.config.set('basePath', 'https://cdnjs.cloudflare.com/ajax/libs/ace/1.4.12/');

        if (!this.editorInstance) {
            this.editorInstance = ace.edit(this.editor.nativeElement);

            this.editorInstance.setOptions({
                mode: 'ace/mode/sql',
                theme: 'ace/theme/github',
                fontSize: '14px',
                showPrintMargin: false,
                wrap: true,
                showGutter: true,
                highlightActiveLine: true,
                tabSize: 4,
                cursorStyle: 'smooth',
                showInvisibles: false,
                enableBasicAutocompletion: true,
                enableLiveAutocompletion: true,
                enableSnippets: true,
            });
            const langTools = ace.require('ace/ext/language_tools');
            langTools.setCompleters([langTools.snippetCompleter, langTools.textCompleter, langTools.keyWordCompleter]);
            this.editorInstance.on('change', () => {
                this.tabContent[this.selectedTab] = this.editorInstance.getValue();
            });

            this.editorInstance.commands.addCommand({
                name: 'find',
                bindKey: { win: 'Ctrl-F', mac: 'Command-F' },
                exec: (editor) => editor.execCommand('find'),
            });
            this.editorInstance.commands.addCommand({
                name: 'replace',
                bindKey: { win: 'Ctrl-H', mac: 'Command-Option-F' },
                exec: (editor) => editor.execCommand('replace'),
            });
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

        this.tabContent.push(`SELECT * FROM ${dbName}.${tableName};`);
        this.selectTab(this.tabs.length - 1);

        if (!this.editorInstance) {
            this.needsEditorInit = true;
        } else {
            this.editorInstance.setValue(this.tabContent[this.selectedTab]);
            this.triggerQuery = this.tabContent[this.selectedTab];
            this.selectedDB = dbName;
            this.currentTabId = id;
        }

        this.cdr.detectChanges();
        this.scrollTabIntoView(this.tabs.length - 1);
    }

    selectTab(tabIndex: number) {
        if (!this.tabContent[tabIndex]) {
            this.tabContent[tabIndex] = '';
        }

        this.selectedTab = tabIndex;
        this.selectedDB = this.tabs[tabIndex].dbName;
        this.triggerQuery = this.tabContent[tabIndex];
        this.currentTabId = this.tabs[tabIndex].id;

        if (this.editorInstance) {
            this.editorInstance.setValue(this.tabContent[tabIndex]);
        }
        this.executeTriggered = false;
        this.cdr.detectChanges();
        this.scrollTabIntoView(tabIndex);
    }

    scrollTabIntoView(tabIndex: number) {
        if (this.tabContainer && this.tabContainer.nativeElement) {
            const tabElement = this.tabContainer.nativeElement.children[tabIndex];
            if (tabElement) {
                tabElement.scrollIntoView({ behavior: 'smooth', inline: 'center' });
            }
        }
    }

    closeTab(tabIndex: number) {
        this.tabs.splice(tabIndex, 1);
        this.tabContent.splice(tabIndex, 1);
        this.selectedTab = this.tabs.length ? Math.max(0, tabIndex - 1) : -1;

        if (this.editorInstance && this.selectedTab >= 0) {
            this.editorInstance.setValue(this.tabContent[this.selectedTab]);
            this.triggerQuery = this.tabContent[this.selectedTab];
            this.selectedDB = this.tabs[this.selectedTab]?.dbName || '';
            this.currentTabId = this.tabs[this.selectedTab]?.id || '';
        } else {
            this.editorInstance?.destroy();
            this.editorInstance = null;
            this.needsEditorInit = true;
        }
    }

    handleExecQueryClick() {
        this.triggerQuery = this.tabContent[this.selectedTab];
        this.executeTriggered = true;
    }

    onDiscQueryClick() {
        if (this.editorInstance) {
            this.editorInstance.setValue('');
        }
        this.tabContent[this.selectedTab] = '';
        this.triggerQuery = '';
        this.executeTriggered = false;
    }
}
