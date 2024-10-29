import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedRoutingModule } from './shared-routing.module';
import { SharedComponent } from './shared.component';
import { NavbarComponent } from './navbar/navbar.component';
import { FooterComponent } from './footer/footer.component';
import { ProfileComponent } from './profile/profile.component';
import { NgbCollapseModule } from '@ng-bootstrap/ng-bootstrap';


@NgModule({
  declarations: [
    SharedComponent,
    NavbarComponent,
    FooterComponent,
    ProfileComponent
  ],
  imports: [
    CommonModule,
    SharedRoutingModule,
    NgbCollapseModule
  ],
  exports: [NavbarComponent, FooterComponent]
})
export class SharedModule { }
