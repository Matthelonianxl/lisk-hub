import i18n from './i18n';

const buildTemplate = electron =>
  [
    {
      label: i18n.t('Edit'),
      submenu: [
        {
          role: 'undo',
          label: i18n.t('Undo'),
        },
        {
          role: 'redo',
          label: i18n.t('Redo'),
        },
        {
          type: 'separator',
        },
        {
          role: 'cut',
          label: i18n.t('Cut'),
        },
        {
          role: 'copy',
          label: i18n.t('Copy'),
        },
        {
          role: 'paste',
          label: i18n.t('Paste'),
        },
        {
          role: 'selectall',
          label: i18n.t('Select all'),
        },
      ],
    },
    {
      label: i18n.t('View'),
      submenu: [
        {
          role: 'reload',
          label: i18n.t('Reload'),
        },
        {
          role: 'togglefullscreen',
          label: i18n.t('Toggle full screen'),
        },
      ],
    },
    {
      label: i18n.t('Window'),
      submenu: [
        {
          role: 'minimize',
          label: i18n.t('Minimize'),
        },
      ],
    },
    {
      label: i18n.t('Help'),
      submenu: [
        {
          label: i18n.t('Lisk Website'),
          click() {
            electron.shell.openExternal('https://lisk.io');
          },
        },
        {
          label: i18n.t('Lisk Chat'),
          click() {
            electron.shell.openExternal('https://lisk.chat');
          },
        },
        {
          label: i18n.t('Lisk Explorer'),
          click() {
            electron.shell.openExternal('https://explorer.lisk.io');
          },
        },
        {
          label: i18n.t('Lisk Forum'),
          click() {
            electron.shell.openExternal('https://forum.lisk.io');
          },
        },
        {
          type: 'separator',
        },
        {
          label: i18n.t('Report Issue...'),
          click() {
            electron.shell.openExternal('https://lisk.zendesk.com/hc/en-us/requests/new');
          },
        },
        {
          label: i18n.t('What\'s New...'),
          click() {
            electron.shell.openExternal('https://github.com/LiskHQ/lisk-nano/releases');
          },
        },
      ],
    },
  ];

const addAboutMenuForMac = ({ template, name }) => {
  template.unshift({
    label: name,
    submenu: [
      {
        role: 'about',
        label: i18n.t('About'),
      },
      {
        role: 'quit',
        label: i18n.t('Quit'),
      },
    ],
  });
};

const addAboutMenuForNonMac = ({ template, electron }) => {
  const copyright = `Copyright © 2016 - ${new Date().getFullYear()} Lisk Foundation`;
  template[template.length - 1].submenu.push({
    label: i18n.t('About'),
    click(item, focusedWindow) {
      if (focusedWindow) {
        const options = {
          buttons: ['OK'],
          icon: `${__dirname}/assets/images/LISK.png`,
          message: `${i18n.t('Lisk Nano')}\n${i18n.t('Version')} ${electron.app.getVersion()}\n${copyright}`,
        };
        electron.dialog.showMessageBox(focusedWindow, options, () => {});
      }
    },
  });
};

module.exports = ({ electron }) => {
  const template = buildTemplate(i18n);
  if (process.platform === 'darwin') {
    addAboutMenuForMac({ template, name: electron.app.getName() });
  } else {
    addAboutMenuForNonMac({ template, electron });
  }
  return electron.Menu.buildFromTemplate(template);
};
