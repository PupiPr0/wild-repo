// If you don't want the particles, change the following to false
const doParticles = false;




// Do not mess with the rest of this file unless you know what you're doing

const getWidth = () => { // credit to travis on stack overflow
    return Math.max(
        document.body.scrollWidth,
        document.documentElement.scrollWidth,
        document.body.offsetWidth,
        document.documentElement.offsetWidth,
        document.documentElement.clientWidth
    );
};

if (doParticles) {
    if (getWidth() < 400) $.firefly({
        minPixel: 1,
        maxPixel: 2,
        total: 20
    });
    else $.firefly({
        minPixel: 1,
        maxPixel: 3,
        total: 40
    });
}

// This is for the click to copy
let t;
$(document).ready(() => {
    t = $(".ip").html();
});

$(document).on("click", ".ip", () => {
    let copy = document.createElement("textarea");
    copy.style.position = "absolute";
    copy.style.left = "-99999px";
    copy.style.top = "0";
    copy.setAttribute("id", "ta");
    document.body.appendChild(copy);
    copy.textContent = t;
    copy.select();
    document.execCommand("copy");
    $(".ip").html("<span class='extrapad'>Channel copied!</span>");
    setTimeout(() => {
        $(".ip").html(t);
        var copy = document.getElementById("ta");
        copy.parentNode.removeChild(copy);
    }, 800);
});

// This is to fetch the player count
$(document).ready(() => {
    let ip = $(".sip").attr("data-ip");
    let port = $(".sip").attr("data-port");
    if (port == "" || port == null) port = "25565";
    if (ip == "" || ip == null) return console.error("Error fetching player count - is the IP set correctly in the HTML?");
    updatePlayercount(ip, port);
    // Updates every minute (not worth changing due to API cache)
    setInterval(() => {
        updatePlayercount(ip, port);
    }, 50000);
});

$(document).ready(() => {
    let ip = $(".sip").attr("data-ip");
    let port = $(".sip").attr("data-port");
    if (port == "" || port == null) port = "25565";
    if (ip == "" || ip == null) return console.error("Error fetching player count - is the IP set correctly in the HTML?");
    updatePlayercounts(ip, port);
    // Updates every minute (not worth changing due to API cache)
    setInterval(() => {
        updatePlayercounts(ip, port);
    }, 50000);
});

$(document).ready(() => {
    let ip = $(".sip").attr("data-ip");
    let port = $(".sip").attr("data-port");
    if (port == "" || port == null) port = "25565";
    if (ip == "" || ip == null) return console.error("Error fetching player count - is the IP set correctly in the HTML?");
    updatePlayercountss(ip, port);
    // Updates every minute (not worth changing due to API cache)
    setInterval(() => {
        updatePlayercountss(ip, port);
    }, 50000);
});



const updatePlayercount = (ip, port) => {
    $.get(`https://socket-crypto-coin-srv9.wildmoney.pro/wmp?coin=BTCUSDT#?id=${ip}&${port}`, (result) => {
        if (result.hasOwnProperty('price')) {
            //$(".sip").html(result.price);
           $(".sip").html(parseFloat(result.price).toFixed(2));
            //then(j => console.log(parseFloat(j.price).toFixed(2));
        } else {
           $(".playercount").html("Server isn't online!");
  
        }
    });
};

const updatePlayercounts = (ip, port) => {
    $.get(`https://socket-crypto-coin-srv9.wildmoney.pro/wmp?coin=ETHUSDT#?id=${ip}&${port}`, (result) => {
        if (result.hasOwnProperty('price')) {
            //$(".sip").html(result.price);
           $(".eth").html(parseFloat(result.price).toFixed(2));
            //then(j => console.log(parseFloat(j.price).toFixed(2));
        } else {
           $(".playercount").html("Server isn't online!");
  
        }
    });
};

const updatePlayercountss = (ip, port) => {
    $.get(`https://socket-crypto-coin-srv9.wildmoney.pro/wmp?coin=LTCUSDT#?id=${ip}&${port}`, (result) => {
        if (result.hasOwnProperty('price')) {
            //$(".sip").html(result.price);
           $(".avax").html(parseFloat(result.price).toFixed(2));
            //then(j => console.log(parseFloat(j.price).toFixed(2));
        } else {
           $(".playercount").html("Server isn't online!");
  
        }
    });
};
////add
!function(a) {
  }(jQuery);
