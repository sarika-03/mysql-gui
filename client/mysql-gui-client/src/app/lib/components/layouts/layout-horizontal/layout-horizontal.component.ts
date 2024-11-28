import { NavbarComponent } from '@lib/components';
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SideBarComponent } from '@lib/components';
import { HomeComponent } from '@pages/home/home.component';
import { newTabData, openAIEvent } from '@lib/utils/storage/storage.types';
import * as e from 'express';

@Component({
    selector: 'app-layout-horizontal',
    standalone: true,
    imports: [CommonModule, NavbarComponent, SideBarComponent, HomeComponent],
    templateUrl: './layout-horizontal.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LayoutHorizontalComponent {
    constructor() {}
    tabData: newTabData;
    databases: any = {};
    openAIEnabledFlag: openAIEvent;

    handleNewTabData(event: newTabData) {
        this.tabData = event;
    }
    handleInitData(event: newTabData) {
        this.databases = event;
    }
    handleOpenAIEvent(event: openAIEvent) {
        this.openAIEnabledFlag = event;
    }
}
