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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.91625, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "\/logout-35-0"], "isController": false}, {"data": [1.0, 500, 1500, "\/logout-35-1"], "isController": false}, {"data": [1.0, 500, 1500, "\/system\/username-32"], "isController": false}, {"data": [1.0, 500, 1500, "\/public\/index-20"], "isController": false}, {"data": [0.555, 500, 1500, "\/public\/login-10"], "isController": false}, {"data": [1.0, 500, 1500, "\/public\/login-10-1"], "isController": false}, {"data": [0.56, 500, 1500, "\/public\/login-10-0"], "isController": false}, {"data": [1.0, 500, 1500, "\/public\/login-36"], "isController": false}, {"data": [1.0, 500, 1500, "\/public\/login-19"], "isController": false}, {"data": [0.995, 500, 1500, "\/public\/login-1"], "isController": false}, {"data": [1.0, 500, 1500, "\/logout-35"], "isController": false}, {"data": [1.0, 500, 1500, "\/system\/authentication-33"], "isController": false}, {"data": [1.0, 500, 1500, "\/system\/authentication-34"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1300, 0, 0.0, 121.6138461538462, 0, 1367, 618.9000000000001, 765.0, 993.9100000000001, 888.5850991114149, 1852.79872265892, 482.54069121667806], "isController": false}, "titles": ["Label", "#Samples", "KO", "Error %", "Average", "Min", "Max", "90th pct", "95th pct", "99th pct", "Transactions\/s", "Received", "Sent"], "items": [{"data": ["\/logout-35-0", 100, 0, 0.0, 24.840000000000018, 0, 433, 50.30000000000004, 171.69999999999993, 432.92999999999995, 86.35578583765113, 25.974201208981004, 40.226279145077726], "isController": false}, {"data": ["\/logout-35-1", 100, 0, 0.0, 7.360000000000006, 0, 86, 16.50000000000003, 48.64999999999992, 85.99, 86.35578583765113, 269.1871761658031, 41.32259283246978], "isController": false}, {"data": ["\/system\/username-32", 100, 0, 0.0, 9.459999999999999, 0, 93, 40.0, 76.34999999999962, 92.95999999999998, 86.35578583765113, 25.468210276338517, 36.26268350604491], "isController": false}, {"data": ["\/public\/index-20", 100, 0, 0.0, 9.230000000000002, 0, 198, 12.900000000000006, 76.89999999999952, 197.40999999999968, 86.28127696289906, 262.29845232959445, 41.37119823123382], "isController": false}, {"data": ["\/public\/login-10", 200, 0, 0.0, 734.9549999999999, 194, 1372, 984.6, 1336.2999999999975, 1368.99, 142.04545454545456, 996.884432705966, 306.5629438920455], "isController": false}, {"data": ["\/public\/login-10-1", 100, 0, 0.0, 13.690000000000001, 0, 125, 42.80000000000001, 60.0, 124.53999999999976, 82.57638315441784, 257.40606936416185, 46.04601052848885], "isController": false}, {"data": ["\/public\/login-10-0", 100, 0, 0.0, 700.5400000000001, 190, 1366, 943.9, 1330.3999999999965, 1365.97, 71.32667617689016, 26.747503566333812, 39.21574090584879], "isController": false}, {"data": ["\/public\/login-36", 100, 0, 0.0, 4.180000000000001, 0, 49, 7.700000000000017, 28.349999999999852, 48.989999999999995, 86.35578583765113, 269.1871761658031, 41.32259283246978], "isController": false}, {"data": ["\/public\/login-19", 100, 0, 0.0, 6.94, 0, 177, 14.0, 28.64999999999992, 176.07999999999953, 82.64462809917356, 257.61880165289256, 28.974044421487605], "isController": false}, {"data": ["\/public\/login-1", 200, 0, 0.0, 42.490000000000016, 1, 994, 113.60000000000002, 160.84999999999997, 986.0300000000072, 169.34801016088062, 527.88950042337, 63.67088272650296], "isController": false}, {"data": ["\/logout-35", 200, 0, 0.0, 34.57, 1, 439, 96.80000000000001, 202.34999999999985, 435.95000000000005, 172.26528854435833, 857.2889750215331, 203.8921188630491], "isController": false}, {"data": ["\/system\/authentication-33", 100, 0, 0.0, 6.370000000000001, 0, 62, 25.600000000000023, 40.89999999999998, 61.97999999999999, 86.28127696289906, 25.867531276962897, 36.73694995685936], "isController": false}, {"data": ["\/system\/authentication-34", 100, 0, 0.0, 8.899999999999995, 0, 186, 29.0, 44.94999999999999, 185.26999999999964, 86.28127696289906, 25.867531276962897, 36.73694995685936], "isController": false}]}, function(index, item){
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
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1300, 0, null, null, null, null, null, null, null, null, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
