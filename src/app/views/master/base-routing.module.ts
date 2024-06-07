import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { CustomerComponent } from './customer/customer.component';
import { FacilityComponent } from './facility/facility.component';
import { CardsComponent } from './reseller/cards.component';
import { CarouselsComponent } from './modules/carousels.component';
import { CollapsesComponent } from './collapses/collapses.component';
import { ListGroupsComponent } from './list-groups/list-groups.component';
import { NavsComponent } from './navs/navs.component';
import { PaginationsComponent } from './paginations/paginations.component';
import { PopoversComponent } from './popovers/popovers.component';
import { ProgressComponent } from './Project/progress.component';
import { SpinnersComponent } from './spinners/spinners.component';
import { TablesComponent } from './tables/tables.component';
import { TooltipsComponent } from './tooltips/tooltips.component';
import { TabsComponent } from './tabs/tabs.component';
import { PlaceholdersComponent } from './placeholders/placeholders.component';
import { FacilityGroupComponent } from './facility-group/facility-group.component';
import { EditionComponent } from './edition/edition.component';
import { MenuComponent } from './menu/menu.component';
import { MenuGroupComponent } from './menu-group/menu-group.component';
import { ModuleComponent } from './module/module.component';
const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Master',
    },
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'cards',
      },
      {
        path: 'customer',
        component: CustomerComponent,
        data: {
          title: 'Customer',
        },
      },
      {
        path: 'facility',
        component: FacilityComponent,
        data: {
          title: 'Facility',
        },
      },
      {
        path: 'facility-group',
        component: FacilityGroupComponent,
        data: {
          title: 'facility-group',
        },
      },
      {
        path: 'reseller',
        component: CardsComponent,
        data: {
          title: 'Reseller',
        },
      },
      {
        path: 'edition',
        component: EditionComponent,
        data: {
          title: 'Edition',
        },
      },
      {
        path: 'menu',
        component: MenuComponent,
        data: {
          title: 'Menu',
        },
      },
      {
        path: 'menuGroup',
        component: MenuGroupComponent,
        data: {
          title: 'menuGroup',
        },
      },
      {
        path: 'module',
        component: ModuleComponent,
        data: {
          title: 'Module',
        },
      },
      {
        path: 'modules',
        component: CarouselsComponent,
        data: {
          title: 'Modules',
        },
      },
      
      {
        path: 'collapse',
        component: CollapsesComponent,
        data: {
          title: 'Collapse',
        },
      },
      {
        path: 'list-group',
        component: ListGroupsComponent,
        data: {
          title: 'List Group',
        },
      },
      {
        path: 'navs',
        component: NavsComponent,
        data: {
          title: 'Navs & Tabs',
        },
      },
      {
        path: 'pagination',
        component: PaginationsComponent,
        data: {
          title: 'Pagination',
        },
      },
      {
        path: 'placeholder',
        component: PlaceholdersComponent,
        data: {
          title: 'Placeholder',
        },
      },
      {
        path: 'popovers',
        component: PopoversComponent,
        data: {
          title: 'Popovers',
        },
      },
      {
        path: 'product',
        component: ProgressComponent,
        data: {
          title: 'Product',
        },
      },
      {
        path: 'spinners',
        component: SpinnersComponent,
        data: {
          title: 'Spinners',
        },
      },
      {
        path: 'tables',
        component: TablesComponent,
        data: {
          title: 'Tables',
        },
      },
      {
        path: 'tabs',
        component: TabsComponent,
        data: {
          title: 'Tabs',
        },
      },
      {
        path: 'tooltips',
        component: TooltipsComponent,
        data: {
          title: 'Tooltips',
        },
      },
      
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BaseRoutingModule {}

