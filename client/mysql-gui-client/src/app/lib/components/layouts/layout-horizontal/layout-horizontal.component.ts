import { NavbarComponent } from '@lib/components';
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SideBarComponent } from '@lib/components';

@Component({
    selector: 'app-layout-horizontal',
    standalone: true,
    imports: [CommonModule, NavbarComponent, SideBarComponent],
    templateUrl: './layout-horizontal.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LayoutHorizontalComponent {}
