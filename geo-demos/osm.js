// Replace '10001' with the desired ZIP code
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

//const spinner = document.querySelector("#spinner");

function showSpinner() {
    //document.getElementById('spinner').style.display = 'block';
    //spinner.classList.add("display");
    //spinner.style.display = "inline-block";
    const spinner = document.getElementById("spinner");
    spinner.style.display = "inline-block"; // Show the spinner
    console.log("displaying spinner");
    //setTimeout(() => { hideSpinner(); }, 5000);
}

function hideSpinner() {
    //document.getElementById('spinner').style.display = 'none';
    console.log("hiding spinner");
    //spinner.classList.remove("display");
    const spinner = document.getElementById("spinner");
    spinner.style.display = "none";
}

//lat1,lat2,lon1,lon2
function setBoundingBox(bb) {
    //const name = document.getElementById('bounding-box-span').value;
    document.getElementById("bounding-box-span").innerText = `${bb}`;
    //alert(`${bb}`);
}

function getZipCodeData(event) {
    event.preventDefault();
    console.log("getZipCodeData ...");
    showSpinner();
    sleep(1).then(() => { console.log('should be spinning!'); });
    const zipCode = document.getElementById("zipCodeInput").value;
    console.log("found zipcode " + zipCode);

    //const zipCode = '23323';
    const nominatimUrl = `https://nominatim.openstreetmap.org/search?postalcode=${zipCode}&format=json`;

    fetch(nominatimUrl)
        .then(response => response.json())
        .then(data => {
            const boundingBox = data[0].boundingbox;
            const lat1 = boundingBox[0]; // South latitude
            const lat2 = boundingBox[1]; // North latitude
            const lon1 = boundingBox[2]; // West longitude
            const lon2 = boundingBox[3]; // East longitude
            console.log(`Bounding Box for ZIP ${zipCode}:`, boundingBox);
            //setBoundingBox(boundingBox);
            //getNodesAndLinks(boundingBox);
            //sleep(4000);
        })
        .catch(error => console.error('Error fetching bounding box:', error))
        .finally(() => {
            console.log("getZipCodeData done"); 
            hideSpinner();
        });
    
}

function getClientGeo() {
    if (navigator.geolocation) {
        showSpinner();
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const latitude = position.coords.latitude;
                const longitude = position.coords.longitude;

                // Use the latitude and longitude values
                console.log("Latitude:", latitude);
                console.log("Longitude:", longitude);
                hideSpinner();
            },
            (error) => {
                // Handle geolocation errors
                console.error("Error getting geolocation:", error);
            }
        );

    } else {
        // Handle cases where geolocation is not supported
        console.error("Geolocation is not supported by this browser.");
    }
}

function getNodesAndLinks(boundingBox) {
    console.log("getNodesAndLinks ...");
    // query Overpass API
    const lat1 = boundingBox[0]; // South latitude
    const lat2 = boundingBox[1]; // North latitude
    const lon1 = boundingBox[2]; // West longitude
    const lon2 = boundingBox[3]; // East longitude
    const overpassUrl = "https://overpass-api.de/api/interpreter";
    const query = `
        [out:json];
        (
        node(${lat1},${lon1},${lat2},${lon2});  // All nodes in bounding box
        way(${lat1},${lon1},${lat2},${lon2});   // All ways (links) in bounding box
        );
        out body;
        >;
        out skel qt;
        `;
    fetch(overpassUrl, {
        method: "POST",
        body: query
    })
        .then(response => response.json())
        .then(data => {
            console.log('OSM Data for Nodes and Ways:', data);
            // Process the nodes and ways from the data
        })
        .catch(error => console.error('Error fetching OSM data:', error))
        .finally(() => {console.log("getNodesAndLinks done");})
}
