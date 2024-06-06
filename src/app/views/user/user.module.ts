import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BadgeModule, CardModule, GridModule } from '@coreui/angular';
import { UserComponent } from './user.component';
import { UserRoutingModule } from './user-routing.module';
// import { DocsComponentsModule } from '@docs-components/docs-components.module';
import {MatIconModule} from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FlexLayoutModule } from '@angular/flex-layout';


@NgModule({
  declarations: [UserComponent],
  imports: [
    CommonModule,
    UserRoutingModule,
   
    CardModule,
    GridModule,
    BadgeModule,
    // DocsComponentsModule,
    MatIconModule,
    MatButtonModule,
    MatTableModule,
    MatCardModule,
    MatPaginatorModule,
    MatSortModule,
    MatFormFieldModule,
    MatTooltipModule,
    FlexLayoutModule
  ]
})
export class UserModule {
}
