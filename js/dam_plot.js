var visible = true;
var capacity = true;
var response = {};
var myChart = {};

function hostUrl(){{
    baseurl = 'https://s3-ap-southeast-2.amazonaws.com/www.kristianweegink.com/';
    return baseurl;
}}


window.onload = function() {
    var ctx = document.getElementById('myChart').getContext('2d');
    
    myChart = new Chart(ctx,{
      type: 'line',
      data: { datasets: [] },
      options: {
        scales:{
    	    xAxes:[{
                type:"time",
                time: { unit: 'day' },
    	    	distribution: "series",
    	    }],
    	}
      }
    }
    );
    
    const xhr = new XMLHttpRequest();
    const uri = hostUrl() + 'dams.json';
    xhr.open("GET", uri, true);
    xhr.onload = function(e) {
        response = JSON.parse(xhr.responseText);
        for (var key in response) { 
            var h = Math.floor(Math.random() * 360);
            var s = {
                label: key,
                borderColor: "hsl(" + h + ", 60%, 60%, 0.75)",
                fill: false,
                data:[]
                    };
            for (var utcSeconds in response[key]) {
                var d = new Date(0);
                d.setUTCSeconds(utcSeconds);
                var m = moment(d)
                s.data.push({x:m.format('YYYY-MM-DD HH:mm:ss'), y:response[key][utcSeconds].fill});
                        }
            myChart.data.datasets.push(s);
        }
        myChart.update();
    
    };
    xhr.send();

    document.getElementById("btnData").addEventListener("click", toggleData);
    document.getElementById("btnToggle").addEventListener("click", toggleVis);    
};

function toggleData() {
    console.log('Data set to capacity ' + capacity)
    myChart.data.labels = [];
    myChart.data.datasets = [];

    for (var key in response) { 
        var h = Math.floor(Math.random() * 360);
        var s = {
            label: key,
            borderColor: "hsl(" + h + ", 60%, 60%, 0.75)",
            fill: false,
            data:[]
                };
        for (var utcSeconds in response[key]) {
            var d = new Date(0);
            d.setUTCSeconds(utcSeconds);
            var m = moment(d)
            if (capacity) {
                y_data = response[key][utcSeconds].capacity;
                document.getElementById("btnData").textContent = 'Volume';
            } else {
                y_data = response[key][utcSeconds].fill;
                document.getElementById("btnData").textContent = 'Capacity';
            }        
            s.data.push({x:m.format('YYYY-MM-DD HH:mm:ss'), y:y_data});              
            }
        myChart.data.datasets.push(s);
    }
    myChart.update();
    capacity = !capacity;
    document.getElementById("btnToggle").textContent = 'Toggle Off';
    visibile = true;
};

function toggleVis() {
    console.log('Visibility set to ' + visible)
    myChart.data.datasets.forEach((dataset) => {
        dataset._meta[0].hidden = visible;
    });
    myChart.update();
    if (visible) {
        document.getElementById("btnToggle").textContent = 'Toggle On';
    } else {
        document.getElementById("btnToggle").textContent = 'Toggle Off';
    }        
    visible = !visible;
};
