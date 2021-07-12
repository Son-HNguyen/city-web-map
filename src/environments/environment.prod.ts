const cesium = require('cesium');

export const environment = {
  production: false,
  cesium,
  cesiumViewer: cesium.Viewer,
  cesiumCamera: cesium.Camera,
  cookieExpireDefault: 7,
  cookieNames: {
    cameraPosition: 'cameraPosition'
  }
};
