import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SettingsRoutingModule } from './settings-routing.module';
import { SettingsComponent } from './settings.component';
import { YearsComponent } from './years/years.component';
import { SharedModule } from '../_shared/shared.module';
import { CoursesComponent } from './courses/courses.component';
import { UsersComponent } from './users/users.component';
import { AddYearDialogComponent } from './years/add-year-dialog/add-year-dialog.component';
import { YearDetailComponent } from './years/year-detail/year-detail.component';


@NgModule({
  declarations: [
    SettingsComponent,
    YearsComponent,
    CoursesComponent,
    UsersComponent,
    AddYearDialogComponent,
    YearDetailComponent
  ],
  imports: [
    CommonModule,
    SharedModule,

    SettingsRoutingModule
  ]
})
export class SettingsModule { }
