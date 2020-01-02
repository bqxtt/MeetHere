/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var showControllersOnly = false;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

/*
 * Add header in statistics table to group metrics by category
 * format
 *
 */
function summaryTableHeader(header) {
    var newRow = header.insertRow(-1);
    newRow.className = "tablesorter-no-sort";
    var cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Requests";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 3;
    cell.innerHTML = "Executions";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 6;
    cell.innerHTML = "Response Times (ms)";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Throughput";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 2;
    cell.innerHTML = "Network (KB/sec)";
    newRow.appendChild(cell);
}

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex, headerCreator) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();

    // Call callback is available
    if(headerCreator) {
        headerCreator(header);
    }

    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter) {
        regexp = new RegExp(seriesFilter, 'i');
    }
    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            if(item.data.length > 0) {
                var newRow = tBody.insertRow(-1);
                for(var col=0; col < item.data.length; col++){
                    var cell = newRow.insertCell(-1);
                    cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
                }
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": 100.0, "KoPercent": 0.0};
    var dataset = [
        {
            "label" : "KO",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "OK",
            "data" : data.OkPercent,
            "color" : "#9ACD32"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round10(series.percent, -2)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.9063571428571429, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.998, 500, 1500, "\/user\/reverse-72"], "isController": false}, {"data": [1.0, 500, 1500, "\/system\/username-84"], "isController": false}, {"data": [0.99975, 500, 1500, "\/system\/username-20"], "isController": false}, {"data": [1.0, 500, 1500, "\/system\/username-67"], "isController": false}, {"data": [1.0, 500, 1500, "\/public\/login-31-1"], "isController": false}, {"data": [0.137625, 500, 1500, "\/public\/login-31"], "isController": false}, {"data": [0.15, 500, 1500, "\/public\/login-31-0"], "isController": false}, {"data": [0.98125, 500, 1500, "\/system\/userId-71"], "isController": false}, {"data": [0.998625, 500, 1500, "\/-7"], "isController": false}, {"data": [1.0, 500, 1500, "\/public\/index-41"], "isController": false}, {"data": [0.9995, 500, 1500, "\/system\/authentication-55"], "isController": false}, {"data": [0.9995, 500, 1500, "\/public\/sites-70"], "isController": false}, {"data": [0.99975, 500, 1500, "\/system\/authentication-54"], "isController": false}, {"data": [1.0, 500, 1500, "\/system\/username-53"], "isController": false}, {"data": [1.0, 500, 1500, "\/public\/login-40"], "isController": false}, {"data": [1.0, 500, 1500, "\/public\/login-25"], "isController": false}, {"data": [0.99975, 500, 1500, "\/user\/reservation.html-56"], "isController": false}, {"data": [1.0, 500, 1500, "\/system\/authentication-68"], "isController": false}, {"data": [1.0, 500, 1500, "\/user\/reservation.html-73"], "isController": false}, {"data": [0.997, 500, 1500, "\/public\/sites-85"], "isController": false}, {"data": [1.0, 500, 1500, "\/system\/authentication-69"], "isController": false}, {"data": [1.0, 500, 1500, "\/system\/authentication-22"], "isController": false}, {"data": [1.0, 500, 1500, "\/system\/authentication-86"], "isController": false}, {"data": [1.0, 500, 1500, "\/system\/authentication-21"], "isController": false}, {"data": [0.99975, 500, 1500, "\/system\/authentication-87"], "isController": false}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 50000, 0, 0.0, 166.42672000000104, 0, 3120, 123.0, 1864.0, 2310.0, 1521.7920623326029, 31694.140482331994, 729.5625703828829], "isController": false}, "titles": ["Label", "#Samples", "KO", "Error %", "Average", "Min", "Max", "90th pct", "95th pct", "99th pct", "Transactions\/s", "Received", "Sent"], "items": [{"data": ["\/user\/reverse-72", 2000, 0, 0.0, 31.51850000000001, 1, 812, 76.0, 125.89999999999964, 388.72000000000025, 61.28014216992984, 18.072854429022275, 38.53946441155743], "isController": false}, {"data": ["\/system\/username-84", 2000, 0, 0.0, 19.622000000000018, 0, 418, 43.0, 76.94999999999982, 231.0, 61.29328838492185, 18.076731535396874, 26.277103125957705], "isController": false}, {"data": ["\/system\/username-20", 2000, 0, 0.0, 20.015000000000015, 0, 579, 45.0, 83.94999999999982, 258.94000000000005, 61.332760894231654, 18.046446149835933, 24.718779708056058], "isController": false}, {"data": ["\/system\/username-67", 2000, 0, 0.0, 17.385499999999997, 0, 409, 39.0, 56.94999999999982, 277.9000000000001, 61.2238650626014, 18.0562570790094, 26.247340588361343], "isController": false}, {"data": ["\/public\/login-31-1", 2000, 0, 0.0, 41.71450000000014, 0, 378, 121.0, 188.0, 293.94000000000005, 61.20138315125922, 190.77618654181583, 34.12694314391505], "isController": false}, {"data": ["\/public\/login-31", 4000, 0, 0.0, 1933.828500000002, 87, 3687, 2687.9, 2842.0, 3154.99, 121.9958521410272, 16074.740568195682, 403.42026808588514], "isController": false}, {"data": ["\/public\/login-31-0", 2000, 0, 0.0, 1801.1450000000016, 86, 3027, 2436.9, 2545.95, 2705.96, 61.014674029104, 22.880502760914, 36.388341239818175], "isController": false}, {"data": ["\/system\/userId-71", 4000, 0, 0.0, 108.87949999999954, 0, 1233, 347.9000000000001, 469.9499999999998, 645.9899999999998, 122.52649635483672, 15339.92248284629, 227.40391242418673], "isController": false}, {"data": ["\/-7", 4000, 0, 0.0, 64.09775000000018, 0, 816, 204.9000000000001, 283.0, 443.9599999999991, 122.088941794097, 616.015732304734, 152.44425876751214], "isController": false}, {"data": ["\/public\/index-41", 2000, 0, 0.0, 14.634500000000005, 0, 404, 33.0, 52.94999999999982, 138.98000000000002, 61.20700208103807, 186.07167722487452, 29.348279318153995], "isController": false}, {"data": ["\/system\/authentication-55", 2000, 0, 0.0, 14.779500000000018, 0, 627, 30.90000000000009, 49.94999999999982, 208.99, 61.21449559255632, 18.352392721596477, 26.06398445151812], "isController": false}, {"data": ["\/public\/sites-70", 2000, 0, 0.0, 38.491000000000064, 4, 544, 88.90000000000009, 156.0, 353.99, 61.23136270397698, 14944.99701497107, 26.071166151302698], "isController": false}, {"data": ["\/system\/authentication-54", 2000, 0, 0.0, 15.581999999999988, 0, 566, 35.0, 54.0, 206.0, 61.216369257139355, 18.352954455021273, 26.064782222766368], "isController": false}, {"data": ["\/system\/username-53", 2000, 0, 0.0, 15.565500000000007, 0, 429, 33.0, 50.94999999999982, 231.99, 61.2088752869166, 18.051836266258608, 25.702945677123186], "isController": false}, {"data": ["\/public\/login-40", 2000, 0, 0.0, 16.001000000000037, 0, 363, 32.0, 51.0, 253.99, 61.2032560132199, 190.78202460370892, 21.457000887447215], "isController": false}, {"data": ["\/public\/login-25", 2000, 0, 0.0, 19.80149999999998, 0, 476, 49.90000000000009, 80.0, 219.0, 61.34028523232633, 191.20917037264226, 27.8966512038031], "isController": false}, {"data": ["\/user\/reservation.html-56", 2000, 0, 0.0, 17.384000000000015, 0, 524, 38.0, 60.94999999999982, 217.9000000000001, 61.21824303642485, 276.9766796755433, 29.413452708907254], "isController": false}, {"data": ["\/system\/authentication-68", 2000, 0, 0.0, 15.713499999999986, 0, 351, 39.0, 64.0, 136.71000000000026, 61.22761365375785, 18.356325577835605, 26.607703199142815], "isController": false}, {"data": ["\/user\/reservation.html-73", 2000, 0, 0.0, 17.982000000000014, 0, 441, 40.0, 78.0, 170.93000000000006, 61.291410008887254, 277.30771735466277, 31.004834359964452], "isController": false}, {"data": ["\/public\/sites-85", 2000, 0, 0.0, 45.03199999999992, 4, 633, 102.0, 211.89999999999964, 432.9200000000001, 61.28765360218184, 14958.736171973154, 26.095133760303984], "isController": false}, {"data": ["\/system\/authentication-69", 2000, 0, 0.0, 16.25550000000002, 0, 327, 38.0, 67.0, 152.96000000000004, 61.23511221334313, 18.35857368114877, 26.61096185052509], "isController": false}, {"data": ["\/system\/authentication-22", 2000, 0, 0.0, 19.983000000000008, 0, 440, 49.90000000000009, 83.0, 202.87000000000012, 61.33840397472858, 18.398645954732256, 25.080458734588724], "isController": false}, {"data": ["\/system\/authentication-86", 2000, 0, 0.0, 22.6555, 0, 448, 54.90000000000009, 89.94999999999982, 254.92000000000007, 61.29516687609182, 18.37657835054706, 26.637059824082872], "isController": false}, {"data": ["\/system\/authentication-21", 2000, 0, 0.0, 19.487500000000015, 0, 396, 48.0, 84.0, 219.0, 61.33464180569185, 18.388413119479885, 25.07892043363592], "isController": false}, {"data": ["\/system\/authentication-87", 2000, 0, 0.0, 24.116999999999994, 0, 595, 61.0, 94.0, 322.93000000000006, 61.297045482407746, 18.377141565526543, 26.63787621061665], "isController": false}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Percentile 1
            case 8:
            // Percentile 2
            case 9:
            // Percentile 3
            case 10:
            // Throughput
            case 11:
            // Kbytes/s
            case 12:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": []}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 50000, 0, null, null, null, null, null, null, null, null, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
