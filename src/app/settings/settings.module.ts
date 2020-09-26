import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SettingsRoutingModule } from './settings-routing.module';
import { SettingsComponent } from './settings.component';
import { TeamsComponent } from './teams/teams.component';
import { YearsComponent } from './years/years.component';
import { SharedModule } from '../_shared/shared.module';
import { CoursesComponent } from './courses/courses.component';
import { UsersComponent } from './users/users.component';


@NgModule({
  declarations: [SettingsComponent, TeamsComponent, YearsComponent, CoursesComponent, UsersComponent],
  imports: [
    CommonModule,
    SharedModule,

    SettingsRoutingModule
  ]
})
export class SettingsModule { }
