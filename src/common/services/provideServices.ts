import type Bottle from 'bottlejs';
import type { ConnectDecorator } from '../../container/types';
import { withoutSelectedServer } from '../../servers/helpers/withoutSelectedServer';
import { ErrorHandler } from '../ErrorHandler';
import { Home } from '../Home';
import { MainHeader } from '../MainHeader';
import { MenuLayout } from '../MenuLayout';
import { sidebarNotPresent, sidebarPresent } from '../reducers/sidebar';
import { ScrollToTop } from '../ScrollToTop';
import { ShlinkVersionsContainer } from '../ShlinkVersionsContainer';
import { HttpClient } from './HttpClient';
import { ImageDownloader } from './ImageDownloader';

export const provideServices = (bottle: Bottle, connect: ConnectDecorator) => {
  // Services
  bottle.constant('window', window);
  bottle.constant('console', console);
  bottle.constant('fetch', window.fetch.bind(window));

  bottle.service('HttpClient', HttpClient, 'fetch');
  bottle.service('ImageDownloader', ImageDownloader, 'HttpClient', 'window');

  // Components
  bottle.serviceFactory('ScrollToTop', () => ScrollToTop);

  bottle.serviceFactory('MainHeader', MainHeader, 'ServersDropdown');

  bottle.serviceFactory('Home', () => Home);
  bottle.decorator('Home', withoutSelectedServer);
  bottle.decorator('Home', connect(['servers'], ['resetSelectedServer']));

  bottle.serviceFactory('MenuLayout', MenuLayout, 'buildShlinkApiClient', 'ServerError');
  bottle.decorator('MenuLayout', connect(
    ['selectedServer', 'settings'],
    ['selectServer', 'sidebarPresent', 'sidebarNotPresent'],
  ));

  bottle.serviceFactory('ShlinkVersionsContainer', () => ShlinkVersionsContainer);
  bottle.decorator('ShlinkVersionsContainer', connect(['selectedServer', 'sidebar']));

  bottle.serviceFactory('ErrorHandler', ErrorHandler, 'window', 'console');

  // Actions
  bottle.serviceFactory('sidebarPresent', () => sidebarPresent);
  bottle.serviceFactory('sidebarNotPresent', () => sidebarNotPresent);
};
