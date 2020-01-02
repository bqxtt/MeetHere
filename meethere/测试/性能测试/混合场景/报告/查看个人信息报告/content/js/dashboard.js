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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.9166666666666666, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "\/system\/authentication-339"], "isController": false}, {"data": [1.0, 500, 1500, "\/user\/user_info.html-340"], "isController": false}, {"data": [1.0, 500, 1500, "\/system\/authentication-338"], "isController": false}, {"data": [1.0, 500, 1500, "\/system\/authentication-349"], "isController": false}, {"data": [1.0, 500, 1500, "\/system\/username-346"], "isController": false}, {"data": [0.5, 500, 1500, "\/public\/login-315-0"], "isController": false}, {"data": [1.0, 500, 1500, "\/system\/authentication-348"], "isController": false}, {"data": [1.0, 500, 1500, "\/user\/center\/user1-350"], "isController": false}, {"data": [1.0, 500, 1500, "\/public\/login-324"], "isController": false}, {"data": [1.0, 500, 1500, "\/public\/login-316"], "isController": false}, {"data": [0.5, 500, 1500, "\/public\/login-315"], "isController": false}, {"data": [1.0, 500, 1500, "\/public\/index-325"], "isController": false}, {"data": [1.0, 500, 1500, "\/user\/orders\/username\/user1-351"], "isController": false}, {"data": [1.0, 500, 1500, "\/public\/login-315-1"], "isController": false}, {"data": [1.0, 500, 1500, "\/system\/username-337"], "isController": false}, {"data": [1.0, 500, 1500, "\/system\/userId-347"], "isController": false}, {"data": [1.0, 500, 1500, "\/user\/login.html-352"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1700, 0, 0.0, 90.17294117647066, 0, 891, 650.4000000000005, 752.0, 822.95, 1096.774193548387, 2961.000504032258, 539.9445564516129], "isController": false}, "titles": ["Label", "#Samples", "KO", "Error %", "Average", "Min", "Max", "90th pct", "95th pct", "99th pct", "Transactions\/s", "Received", "Sent"], "items": [{"data": ["\/system\/authentication-339", 100, 0, 0.0, 2.1100000000000017, 0, 10, 5.0, 6.949999999999989, 10.0, 110.25358324145535, 33.05454106945976, 46.94390848952591], "isController": false}, {"data": ["\/user\/user_info.html-340", 100, 0, 0.0, 3.87, 0, 62, 5.0, 10.899999999999977, 61.82999999999991, 110.13215859030836, 465.6955534140969, 52.699958700440526], "isController": false}, {"data": ["\/system\/authentication-338", 100, 0, 0.0, 3.1000000000000005, 0, 26, 7.0, 11.949999999999989, 25.93999999999997, 110.25358324145535, 33.05454106945976, 46.94390848952591], "isController": false}, {"data": ["\/system\/authentication-349", 100, 0, 0.0, 3.18, 0, 70, 7.0, 8.0, 69.63999999999982, 110.13215859030836, 33.01813738986784, 47.64506470264317], "isController": false}, {"data": ["\/system\/username-346", 100, 0, 0.0, 3.2800000000000007, 0, 24, 8.0, 20.549999999999898, 24.0, 110.13215859030836, 32.265280837004404, 46.99975908590308], "isController": false}, {"data": ["\/public\/login-315-0", 100, 0, 0.0, 723.5899999999998, 505, 890, 807.3000000000001, 827.75, 889.7899999999998, 65.44502617801047, 24.541884816753928, 36.30153795811518], "isController": false}, {"data": ["\/system\/authentication-348", 100, 0, 0.0, 2.7599999999999993, 0, 30, 5.0, 11.899999999999977, 30.0, 110.13215859030836, 33.01813738986784, 47.64506470264317], "isController": false}, {"data": ["\/user\/center\/user1-350", 100, 0, 0.0, 3.71, 0, 35, 8.900000000000006, 12.949999999999989, 34.85999999999993, 110.13215859030836, 51.086694658590304, 47.21486095814978], "isController": false}, {"data": ["\/public\/login-324", 100, 0, 0.0, 5.4399999999999995, 0, 223, 7.0, 13.899999999999977, 221.14999999999907, 110.13215859030836, 343.30258810572684, 38.61078606828194], "isController": false}, {"data": ["\/public\/login-316", 100, 0, 0.0, 7.000000000000001, 0, 173, 16.900000000000006, 30.849999999999966, 171.95999999999947, 110.01100110011001, 342.92491749174917, 53.50144389438944], "isController": false}, {"data": ["\/public\/login-315", 200, 0, 0.0, 766.8700000000002, 520, 1117, 881.7, 908.95, 956.9300000000001, 120.33694344163658, 2761.462563929001, 503.558401022864], "isController": false}, {"data": ["\/public\/index-325", 100, 0, 0.0, 4.010000000000001, 0, 111, 8.0, 10.0, 110.0199999999995, 110.13215859030836, 334.80606415198235, 52.80750963656387], "isController": false}, {"data": ["\/user\/orders\/username\/user1-351", 100, 0, 0.0, 11.130000000000003, 3, 143, 37.60000000000002, 45.94999999999999, 142.95, 109.76948408342481, 2167.0897365532383, 48.02414928649835], "isController": false}, {"data": ["\/public\/login-315-1", 100, 0, 0.0, 11.720000000000004, 0, 138, 32.80000000000001, 50.94999999999999, 137.63999999999982, 109.52902519167579, 341.4225082146769, 61.82400054764512], "isController": false}, {"data": ["\/system\/username-337", 100, 0, 0.0, 4.31, 0, 71, 8.900000000000006, 17.59999999999991, 70.85999999999993, 110.13215859030836, 32.265280837004404, 46.246902533039645], "isController": false}, {"data": ["\/system\/userId-347", 100, 0, 0.0, 3.7000000000000006, 1, 36, 8.0, 9.949999999999989, 35.89999999999995, 110.01100110011001, 32.981813806380636, 46.73318894389439], "isController": false}, {"data": ["\/user\/login.html-352", 100, 0, 0.0, 3.92, 0, 47, 5.0, 31.849999999999966, 46.91999999999996, 110.13215859030836, 343.30258810572684, 53.02261150881057], "isController": false}]}, function(index, item){
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
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1700, 0, null, null, null, null, null, null, null, null, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
