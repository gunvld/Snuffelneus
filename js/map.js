const googleApiKey = 'AIzaSyCHo5c-LRxqHqogNlDqMGvxA1JKLLp3V2U';
const script = document.createElement('script');
script.type = 'text/javascript';
script.src = `//maps.googleapis.com/maps/api/js?key=${googleApiKey}&callback=initMap`;
document.body.appendChild(script);

var tempContentString;
var markerArray = [];
var infoWindowArray = [];

function initMap() 
{
    var infowindow = new InfoBubble();
    const instance = axios.create
        ({
            baseURL: 'http://145.24.222.50:8000/api/',
            headers: { "Access-Control-Allow-Origin": "*" },
            timeout: 5000
        });

    instance.get('/measurements')
        .then(function (response) 
        {
            var pinsData = response.data;
            for (i = 0; i < pinsData.length; i++)
            {
                marker = new google.maps.Marker
                    ({
                        position:
                        {
                            lat: pinsData[i].location_latitude,
                            lng: pinsData[i].location_longitude,
                        },
                        map,
                    });
                google.maps.event.addListener(marker, 'click', (function (marker, i)
                {
                    return function ()
                    {
                        infowindow.setContent(`
                        <div class="Measurement">
                        <h2>
                            ${pinsData[i].location_address}
                        </h2>
                        <p class="Temperature">${pinsData[i].temperature}</p>
                        <p class="Humidity">${pinsData[i].humidity}</p>
                        </div>
                        `);
                        infowindow.open(map, marker);
                    }
                })(marker, i));
            }
            console.log(response);
        })
        .catch(function (error) { console.log(error); })
        ;

    const map = new google.maps.Map(
        document.getElementById('map'),
        {
            zoom: 12,
            center:
            {
                lat: 51.929433,
                lng: 4.488680,
            },
        },
    );
}
