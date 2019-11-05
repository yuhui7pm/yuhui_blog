L2Dwidget.init({
    model: {
		jsonPath: './live2dCat/live2d-widget-model-wanko/assets/wanko.model.json'
    },
    display: {
      superSample: 2,
      width: 150,
      height: 150,
      position: 'left',
      hOffset: -70,
      vOffset: -50
    },
    mobile: {
      show: true,
      scale: 0.8,
      motion: true
    },
    react: {
      opacityDefault: 0.9,
      opacityOnHover: 0.2
    }
 })