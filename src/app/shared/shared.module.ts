import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedRoutingModule } from './shared-routing.module';
import { SharedComponent } from './shared.component';
import { NavbarComponent } from './navbar/navbar.component';
import { ProfileComponent } from './profile/profile.component';
import { NgbCollapseModule } from '@ng-bootstrap/ng-bootstrap';


import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';


@NgModule({
  declarations: [
    SharedComponent,
    NavbarComponent,
    ProfileComponent
  ],
  imports: [
    CommonModule,
    SharedRoutingModule,
NgbCollapseModule,
 MatToolbarModule,
    MatButtonModule,
    MatIconModule

  ],
  exports: [
    NavbarComponent,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule
  ]
})
export class SharedModule { }
