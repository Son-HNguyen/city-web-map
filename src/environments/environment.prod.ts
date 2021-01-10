let Cesium = require("cesium");

export const environment = {
  production: false,
  Cesium: Cesium,
  cesiumViewer: Cesium.Viewer,
  cesiumCamera: Cesium.Camera,
  cookieExpireDefault: 7,
  cookieNames: {
    cameraPosition: "cameraPosition"
  }
};
