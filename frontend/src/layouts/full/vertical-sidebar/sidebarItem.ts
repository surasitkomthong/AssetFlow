import {
  CircleIcon,
  WindmillIcon,
  TypographyIcon,
  ShadowIcon,
  PaletteIcon,
  KeyIcon,
  BugIcon,
  DashboardIcon,
  BrandChromeIcon,
  HelpIcon,
  BuildingWarehouseIcon,
  DatabaseCogIcon,
  ArrowAutofitContentIcon
} from 'vue-tabler-icons';

export interface menu {
  header?: string;
  title?: string;
  icon?: object;
  to?: string;
  divider?: boolean;
  chip?: string;
  chipColor?: string;
  chipVariant?: string;
  chipIcon?: string;
  children?: menu[];
  disabled?: boolean;
  type?: string;
  subCaption?: string;
}

const sidebarItem: menu[] = [
  // { header: 'AssetFlow' },
  // {
  //   title: 'Dashboard',
  //   icon: DashboardIcon,
  //   to: '/dashboard/default'
  // },
  // { divider: true },
  { header: 'Management'},
  {
    title: 'Transactions',
    icon: ArrowAutofitContentIcon,
    to: '/transaction'
  },
  {
    title: 'Inventory items',
    icon: BuildingWarehouseIcon,
    to: '/inventory'
  },
  {
    title: 'Manage data',
    icon: DatabaseCogIcon,
    to: '/data-manage'
  },

  // { header: 'Pages' },
  // {
  //   title: 'Authentication',
  //   icon: KeyIcon,
  //   to: '/auth',
  //   children: [
  //     {
  //       title: 'Login',
  //       icon: CircleIcon,
  //       to: '/auth/login'
  //     },
  //     {
  //       title: 'Register',
  //       icon: CircleIcon,
  //       to: '/auth/register'
  //     }
  //   ]
  // },
  // {
  //   title: 'Error 404',
  //   icon: BugIcon,
  //   to: '/pages/error'
  // },
  // { divider: true },
  // { header: 'Utilities' },
  // {
  //   title: 'Inventory',
  //   icon: TypographyIcon,
  //   // to: '/utils/typography'
  // },
  // {
  //   title: 'Typography',
  //   icon: TypographyIcon,
  //   to: '/utils/typography'
  // },
  // {
  //   title: 'Shadows',
  //   icon: ShadowIcon,
  //   to: '/utils/shadows'
  // },
  // {
  //   title: 'Colors',
  //   icon: PaletteIcon,
  //   to: '/utils/colors'
  // },

  // {
  //   title: 'Icons',
  //   icon: WindmillIcon,
  //   to: '/forms/radio',
  //   children: [
  //     {
  //       title: 'Tabler Icons',
  //       icon: CircleIcon,
  //       to: '/icons/tabler'
  //     },
  //     {
  //       title: 'Material Icons',
  //       icon: CircleIcon,
  //       to: '/icons/material'
  //     }
  //   ]
  // },
  // { divider: true },
  // {
  //   title: 'Sample Page',
  //   icon: BrandChromeIcon,
  //   to: '/starter'
  // },
  // {
  //   title: 'Documentation',
  //   icon: HelpIcon,
  //   to: 'https://codedthemes.gitbook.io/berry-vuetify/',
  //   type: 'external'
  // }
];

export default sidebarItem;
