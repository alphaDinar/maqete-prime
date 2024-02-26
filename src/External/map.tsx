import axios from "axios";

const googlePlacesApiKey = "AIzaSyDGhwhhuj2vEurAWx5FFoq_LuoQ1OBArdg";
const groundURL = 'https://corsproxy.io/?https://maps.googleapis.com/maps/api/place/autocomplete/json';

export const getUserLocation = () => {
  if (!navigator.geolocation) {
    new Error('Geolocation is not supported by this browser.');
  } else {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        console.log(position)
        return {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        };
      },
      (error) => { }
    )
  };
};

export const getUserAddress = async (lat: number, lon: number) => {
  const request = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lon}&key=AIzaSyDmxzx-9xBr72qFUs1H4QcHQU7YzXGg_js`;
  const res = await axios.post(request);
  return res.data.results[0].address_components[1].short_name || '';
}

export const predictPlaces = async (val: string) => {
  const request = `${groundURL}?input=${val}&components=country:GH&key=${googlePlacesApiKey}`;
  const res = await axios.post(request);
  return res;
}

