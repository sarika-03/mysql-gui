import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

@Component({
    selector: 'app-sidebar',
    standalone: true,
    imports: [CommonModule, RouterModule],
    templateUrl: './sidebar.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SideBarComponent implements OnInit {
    private readonly _router = inject(Router);

    ngOnInit(): void {}

    openSections: { [key: string]: boolean } = {};
    tables: string[] = [
        'appointments',
        'billing',
        'cpu',
        'insuranceinformation',
        'labresults',
        'lifestyle_and_habits',
        'locations',
        'medicalhistory',
        'medicalrecords',
        'medications',
        'prescriptionmedications',
        'prescriptions',
        'robots',
        'staff',
        'surgery',
        'users',
        'vitals',
        'workinghours',
    ];

    toggleSection(section: string): void {
        this.openSections[section] = !this.openSections[section];
    }

    isOpen(section: string): boolean {
        return !!this.openSections[section];
    }
}
