import { INavData } from '@coreui/angular';

export const navItems: INavData[] = [
  {
    name: 'Dashboard',
    url: '/dashboard',
    iconComponent: { name: 'cil-speedometer' },
    badge: {
      color: 'info',
      text: ''
    }
  },
  {
    name: 'User',
    url: '/user',
    iconComponent: { name: 'cil-people' }
  },
  
  {
    name: 'Masters',
    url: '/master',
    iconComponent: { name: 'cil-layers' },
    children: [
      {
        name: 'Edition',
        url: '/master/edition'
      },
      {
        name: 'Menu',
        url: '/master/menu'
      },
      {
        name: 'Menu Group',
        url: '/master/menuGroup'
      },
      {
        name: 'Module',
        url: '/master/module'
      },
      {
        name: 'Reseller',
        url: '/master/reseller'
      },
      {
        name: 'Customer',
        url: '/master/customer'
      },
      {
        name: 'Facility',
        url: '/master/facility'
      },
      {
        name: 'Product',
        url: '/master/product'
      },
      
    ]
  },
  {
    name: 'Activity',
    url: '/activity',
    iconComponent: { name: 'cil-list' },
    children: [
      {
        name: 'License',
        url: '/activity/license'
      },
    ]
  },
  {
    name: 'Reports',
    url: '/report',
    iconComponent: { name: 'cil-cursor' },
    children: [
      {
        name: 'License',
        url: '/report/licensereport',
      },
    ]
  },
  
  
 
  
];


export const resellerNavItems: INavData[] = [
  {
    name: 'Dashboard',
    url: '/dashboard',
    iconComponent: { name: 'cil-speedometer' },
    badge: {
      color: 'info',
      text: ''
    }
  },
  {
    name: 'Masters',
    url: '/master',
    iconComponent: { name: 'cil-layers' },
    children: [
      {
        name: 'Customer',
        url: '/master/customer'
      },
    ]
  },
];
