import './main.scss';

// esri config and auth
import esri = __esri;
import esriConfig from '@arcgis/core/config';

// loading screen
import LoadingScreen from '@vernonia/core/widgets/LoadingScreen';

// map, view and layers
import Map from '@arcgis/core/Map';
import MapView from '@arcgis/core/views/MapView';
import Basemap from '@arcgis/core/Basemap';
import BingMapsLayer from '@arcgis/core/layers/BingMapsLayer';
import VectorTileLayer from '@arcgis/core/layers/VectorTileLayer';
import FeatureLayer from '@arcgis/core/layers/FeatureLayer';
import GroupLayer from '@arcgis/core/layers/GroupLayer';

// layout
import Viewer from '@vernonia/core/layouts/Viewer';

import ViewControl from '@vernonia/core/widgets/ViewControl';
import UIWidgetSwitcher from '@vernonia/core/widgets/UIWidgetSwitcher';
import Legend from '@arcgis/core/widgets/Legend';
import Print from '@vernonia/core/widgets/Print';
import Measure from '@vernonia/core/widgets/Measure';

import SimpleRenderer from '@arcgis/core/renderers/SimpleRenderer';
import { SimpleFillSymbol } from '@arcgis/core/symbols';
import TaxLotPopup from '@vernonia/core/popups/TaxLotPopup';

// config portal and auth
esriConfig.portalUrl = 'https://gisportal.vernonia-or.gov/portal';

// app config and init loading screen
const title = 'Wastewater Inflow and Infiltration Defects';

const loadingScreen = new LoadingScreen({
  title,
});

const taxLots = new FeatureLayer({
  portalItem: {
    id: 'a6063eb199e640e0bbc2d5ceca23de9a',
  },
  opacity: 0.75,
  popupTemplate: new TaxLotPopup(),
  renderer: new SimpleRenderer({
    symbol: new SimpleFillSymbol({
      color: [0, 0, 0, 0],
      outline: {
        color: [246, 213, 109, 0.5],
        width: 0.5,
      },
    }),
  }),
});

const cityLimits = new FeatureLayer({
  portalItem: {
    id: 'eb0c7507611e44b7923dd1c0167e3b92',
  },
});

// view
const view = new MapView({
  map: new Map({
    basemap: new Basemap({
      baseLayers: [
        new BingMapsLayer({
          style: 'aerial',
          key: 'Ao8BC5dsixV4B1uhNaUAK_ejjm6jtZ8G3oXQ5c5Q-WtmpORHOMklBvzqSIEXwdxe',
        }),
        new VectorTileLayer({
          portalItem: {
            id: 'f9a5da71cd61480680e456f0a3d4e1ce',
          },
        }),
      ],
      thumbnailUrl:
        'https://gisportal.vernonia-or.gov/portal/sharing/rest/content/items/b6130a13beb74026b89960fbd424021f/info/thumbnail/thumbnail1579125721359.png?f=json',
    }),
    layers: [taxLots, cityLimits],
    ground: 'world-elevation',
  }),
  zoom: 15,
  center: [-123.18291178267039, 45.8616094153766],
  constraints: {
    rotationEnabled: false,
  },
  popup: {
    dockEnabled: true,
    dockOptions: {
      position: 'bottom-left',
      breakpoint: false,
    },
  },
});

const viewer = new Viewer({
  view,
  title,
  includeSearch: false,
});

view.when(() => {
  view.ui.add(
    new ViewControl({ view: view as esri.MapView, fullscreenElement: viewer.container as HTMLDivElement }),
    'top-left',
  );

  view.ui.add(
    new UIWidgetSwitcher({
      widgetInfos: [
        {
          widget: new Legend({ view }),
          text: 'Legend',
          icon: 'legend',
        },
        {
          widget: new Measure({ view }),
          text: 'Measure',
          icon: 'measure',
        },
        {
          widget: new Print({
            view,
            printServiceUrl:
              'https://gisportal.vernonia-or.gov/arcgis/rest/services/Utilities/PrintingTools/GPServer/Export%20Web%20Map%20Task',
          }),
          text: 'Print',
          icon: 'print',
        },
      ],
    }),
    'top-right',
  );

  view.map.layers.add(
    new GroupLayer({
      portalItem: {
        id: 'dcb8d22f188c4bdd827badd79b770bcc',
      },
    }),
  );

  loadingScreen.end();
});
