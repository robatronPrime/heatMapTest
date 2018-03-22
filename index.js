let map;
function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    zoom: 5,
    center: {lat: 53.85252660044951, lng: -2.8},
    mapTypeId: 'terrain'
  });

  // Create a <script> tag and set the URL, or json document as the source.
  const script = document.createElement('script');

  //link to json file
  script.src = 'tidePredic.json';

  //append link to json file in index.html
  document.getElementsByTagName('head')[0].appendChild(script);

}

function callback(results) {

  let markers = [];
  let portData = [];
  portData = {
    portPos: [],
    portName: []
  };


  results.items.forEach(item =>{
    let lat = parseFloat(item.lat);
    let lng = parseFloat(item.long);
    let latLng = new google.maps.LatLng(lat, lng);
    let date = item.readings[0].date;
    let time = item.readings[0].depths[0].time;
    let depth = item.readings[0].depths[0].depth;
    let keelClear = parseFloat(item.keelClear);
    let contentString = '<div id="content">'+
    '<div id="siteNotice">'+
    '</div>'+
    '<h1 id="firstHeading" class="firstHeading">'+ item.label + '</h1>'+
    '<div id="bodyContent">'+
    '<p><b> Depth Reading </b></p>' +
    '<p> Date: ' + date + '</p>' +
    '<p> Time: '+ time + '</p>' +
    '<p> Depth: '+ depth + '</p>' +
    '<p> Under Keel Clearance: '+ keelClear + 'm</p>' +
    '</div>'+
    '</div>';

    portData.portPos.push({
      lat:lat,
      lng:lng,
      name:contentString,
      keel:keelClear,
      depth:depth
    });
  })

  // Sets up markers
  function addMarker(location, infowindow){
    let marker = new google.maps.Marker({
      position: location,
      map: map
    })

    // When a marker is clicked zoom in on that marker
    // and open a info window
    marker.addListener('click', function() {
      map.setZoom(10);
      map.setCenter(marker.getPosition());
      infowindow.open(map, marker);
    })

    // Push the marker to the markers array
    function shipCalc(draught) {
      console.log('foo');
      clearMarkers();
      let newPorts = [];
      const dock = portData.portPos.filter((port) => { if((port.depth -port.keel) < draught) {newPorts.push(port)} })
      newPorts.forEach(port => {
        // Create an info window for each port
        let infowindow = new google.maps.InfoWindow({
          content: port.name
        })

        // Add a marker for each port
        addMarker({lat:port.lat,lng:port.lng}, infowindow)
      })
    }
    markers.push(marker)
  }

  window.onload=function buttonInit() {
    const scimitar = document.getElementById("scimitar");
    const sabre = document.getElementById("sabre");
    const tyne = document.getElementById("tyne");
    const quorn = document.getElementById("quorn");
    const ledbury = document.getElementById("ledbury");
    const chidd = document.getElementById("chidd");
    const catt = document.getElementById("catt");
    const defend = document.getElementById("defend");
    const kent = document.getElementById("kent");
    const west = document.getElementById("west");
    const wave = document.getElementById("wave");

    scimitar.addEventListener('click', shipCalc(1.2));
    sabre.addEventListener('click', shipCalc(3.3));
    tyne.addEventListener('click', shipCalc(3.8));
    quorn.addEventListener('click', shipCalc(2.2));
    ledbury.addEventListener('click', shipCalc(2.2));
    chidd.addEventListener('click', shipCalc(2.2));
    catt.addEventListener('click', shipCalc(2.2));
    defend.addEventListener('click', shipCalc(7.4));
    kent.addEventListener('click', shipCalc(6.2));
    west.addEventListener('click', shipCalc(7.3));
    wave.addEventListener('click', shipCalc(9.97));
  }

  portData.portPos.forEach(port => {
    // Create an info window for each port
    let infowindow = new google.maps.InfoWindow({
      content: port.name
    })

    // Add a marker for each port
    addMarker({lat:port.lat,lng:port.lng}, infowindow)
  })
}

function setMapOnAll(map) {
  markers.forEach(marker => {
    marker.setMap(map);
  })
}

function clearMarkers() {
  console.log('bar');
  setMapOnAll(null);
}
