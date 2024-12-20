import { INavData } from '@coreui/angular';

export const navItems: INavData[] = [
  {
    name: 'Dashboard',
    url: '/dashboard',
    iconComponent: { name: 'cil-speedometer' },
    // badge: {
    //   color: 'info',
    //   text: 'NEW'
    // }
  },
  {
    title: true,
    name: 'Menu'
  },
  // {
  //   name: 'Colors',
  //   url: '/theme/colors',
  //   iconComponent: { name: 'cil-drop' }
  // },
  // {
  //   name: 'Project',
  //   url: '/theme/typography',
  //   linkProps: { fragment: 'someAnchor' },
  //   iconComponent: { name: 'cil-pencil' }
  // },
  // {
  //   name: 'Components',
  //   title: true
  // },
  // {
  //   name: 'Base',
  //   url: '/base',
  //   iconComponent: { name: 'cil-puzzle' },
  //   children: [
  // //     {
  // //       name: 'Accordion',
  // //       url: '/base/accordion'
  // //     },
  // //     {
  // //       name: 'Breadcrumbs',
  // //       url: '/base/breadcrumbs'
  // //     },
  // //     {
  // //       name: 'Cards',
  // //       url: '/base/cards'
  // //     },
  // //     {
  // //       name: 'Carousel',
  // //       url: '/base/carousel'
  // //     },
  // //     {
  // //       name: 'Collapse',
  // //       url: '/base/collapse'
  // //     },
  // //     {
  // //       name: 'List Group',
  // //       url: '/base/list-group'
  // //     },
  // //     {
  // //       name: 'Navs & Tabs',
  // //       url: '/base/navs'
  // //     },
  // //     {
  // //       name: 'Pagination',
  // //       url: '/base/pagination'
  // //     },
  // //     {
  // //       name: 'Placeholder',
  // //       url: '/base/placeholder'
  // //     },
  // //     {
  // //       name: 'Popovers',
  // //       url: '/base/popovers'
  // //     },
  // //     {
  // //       name: 'Progress',
  // //       url: '/base/progress'
  // //     },
  // //     {
  // //       name: 'Spinners',
  // //       url: '/base/spinners'
  // //     },
  //   // {
  //   //     name: 'Tables',
  //   //     url: '/base/tables'
  //   //   }
  // //     {
  // //       name: 'Tabs',
  // //       url: '/base/tabs'
  // //     },
  // // //     {
  // //       name: 'Tooltips',
  // //       url: '/base/tooltips'
  // //     }
  //   ]
  // },
  {
    name: 'Import',
    url: '/files',
    iconComponent: { name: 'cil-pencil' },
    children: [
      {
        name: 'Source File',
        url: '/files/source-file'
      },
      {
        name: 'Target File ',
        url: '/files/cible-file'
      },
      {
        name: 'List of Files',
        url: '/files/list-of-files'
      },
     
     
    ]
  },
  {
    name: 'Project',
    url: '/projects',
    iconComponent: { name: 'cil-notes' },
    children: [
      {
        name: 'List of Projects',
        url: '/projects/list-of-projects'
      },
      {
        name: 'List of Actors',
        url: '/projects/list-of-actors'
      },
      {
        name: 'List of Actions',
        url: '/projects/ext-list-of-actions'
      },
 

      {
        name: 'Add project',
        url: '/projects/add-project'
      },
      // {
      //   name: 'Add Actor',
      //   url: '/projects/add-actor' 
      // },
      //     {
      //   name: 'Edit Actor',
      //  // url: '/projects/edit-actor'  ***Invisible***
      // },
 
  //     {
  //       name: 'Range',
  //       url: '/forms/range'
  //     },
  
  
  //     {
  //       name: 'Layout',
  //       url: '/forms/layout'
  //     },
  //     {
  //       name: 'Validation',
  //       url: '/forms/validation'
  //     }
     ]
   },
  // {
  //   name: 'Charts',
  //   url: '/charts',
  //   iconComponent: { name: 'cil-chart-pie' }
  // },
  {
    name: 'Transco',
    iconComponent: { name: 'cil-star' },
    url: '/icons',
    children: [
      // {
      //   name: 'CoreUI Free',
      //   url: '/icons/coreui-icons',
      //   badge: {
      //     color: 'success',
      //     text: 'FREE'
      //   }
      // },
      // {
      //   name: 'CoreUI Flags',
      //   url: '/icons/flags'
      // },
      {
        name: 'Add Transco',
        url: '/projects/transco'
      }
    ]
  },
  // {
  //   name: 'Notifications',
  //   url: '/notifications',
  //   iconComponent: { name: 'cil-bell' },
  //   children: [
  //     {
  //       name: 'Alerts',
  //       url: '/notifications/alerts'
  //     },
  //     {
  //       name: 'Badges',
  //       url: '/notifications/badges'
  //     },
  //     {
  //       name: 'Modal',
  //       url: '/notifications/modal'
  //     },
  //     {
  //       name: 'Toast',
  //       url: '/notifications/toasts'
  //     }
  //   ]
  // },
  // {
  //   name: 'actions',
  //   url: '/actions',
  //   iconComponent: { name: 'cil-calculator' },
  //   badge: {
  //     color: 'info',
  //     text: 'NEW'
  //   }
  // },
  // {
  //   title: true,
  //   name: 'Extras'
  // },
  // {
  //   name: 'Pages',
  //   url: '/login',
  //   iconComponent: { name: 'cil-star' },
  //   children: [
  //     {
  //       name: 'Login',
  //       url: '/login'
  //     },
  //     {
  //       name: 'Register',
  //       url: '/register'
  //     },
  //     {
  //       name: 'Error 404',
  //       url: '/404'
  //     },
  //     {
  //       name: 'Error 500',
  //       url: '/500'
  //     }
  //   ]
  // },
];
