function getUserLocation() {
	return new Promise((resolve, reject) => {
		var geolocation = null;
		if (!navigator.geolocation) {
            return reject(null)
        }
        navigator.geolocation.getCurrentPosition(function(position) {
            geolocation = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            }
            resolve(geolocation)
        });

	});
}

export default {
	getUserLocation
};
