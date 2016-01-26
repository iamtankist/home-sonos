var sonos = require('sonos');

sonos.search(function (device, model) {
    console.log('Model '+ model + ': http://'+device.host+':'+device.port+'/xml/device_description.xml')
});