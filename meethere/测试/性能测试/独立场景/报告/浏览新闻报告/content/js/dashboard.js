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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [1.0, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "\/public\/news.html-59"], "isController": false}, {"data": [1.0, 500, 1500, "\/system\/userId-80"], "isController": false}, {"data": [1.0, 500, 1500, "\/system\/authentication-81"], "isController": false}, {"data": [1.0, 500, 1500, "\/system\/userId-68"], "isController": false}, {"data": [1.0, 500, 1500, "\/public\/news\/3-71"], "isController": false}, {"data": [1.0, 500, 1500, "\/system\/username-67"], "isController": false}, {"data": [1.0, 500, 1500, "\/system\/username-78"], "isController": false}, {"data": [1.0, 500, 1500, "\/system\/authentication-79"], "isController": false}, {"data": [1.0, 500, 1500, "\/public\/news-70"], "isController": false}, {"data": [1.0, 500, 1500, "\/system\/authentication-69"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1000, 0, 0.0, 3.356999999999996, 0, 55, 6.0, 12.0, 54.0, 1142.857142857143, 22428.23660714286, 435.60267857142856], "isController": false}, "titles": ["Label", "#Samples", "KO", "Error %", "Average", "Min", "Max", "90th pct", "95th pct", "99th pct", "Transactions\/s", "Received", "Sent"], "items": [{"data": ["\/public\/news.html-59", 200, 0, 0.0, 16.624999999999996, 0, 122, 54.0, 81.94999999999999, 116.97000000000003, 202.83975659229208, 10943.73969954361, 234.53346855983773], "isController": false}, {"data": ["\/system\/userId-80", 100, 0, 0.0, 2.070000000000001, 0, 15, 5.0, 7.899999999999977, 14.97999999999999, 128.36970474967907, 38.4858392169448, 47.13575096277278], "isController": false}, {"data": ["\/system\/authentication-81", 100, 0, 0.0, 1.39, 0, 12, 3.9000000000000057, 6.849999999999966, 11.95999999999998, 128.04097311139566, 38.387283930857876, 48.015364916773365], "isController": false}, {"data": ["\/system\/userId-68", 100, 0, 0.0, 5.590000000000001, 0, 48, 13.900000000000006, 40.94999999999999, 47.95999999999998, 123.60939431396787, 37.058675834363406, 45.74996137206428], "isController": false}, {"data": ["\/public\/news\/3-71", 200, 0, 0.0, 6.955000000000003, 1, 50, 17.0, 23.0, 43.97000000000003, 251.57232704402514, 22765.084512578615, 293.82861635220127], "isController": false}, {"data": ["\/system\/username-67", 100, 0, 0.0, 1.3000000000000005, 0, 6, 3.0, 4.0, 5.989999999999995, 123.45679012345678, 35.56616512345679, 45.93460648148148], "isController": false}, {"data": ["\/system\/username-78", 100, 0, 0.0, 1.3900000000000003, 0, 12, 3.0, 6.0, 11.95999999999998, 127.38853503184713, 36.69884554140127, 47.024283439490446], "isController": false}, {"data": ["\/system\/authentication-79", 100, 0, 0.0, 1.2599999999999996, 0, 12, 3.0, 5.0, 11.949999999999974, 130.3780964797914, 39.08796447196871, 48.89178617992177], "isController": false}, {"data": ["\/public\/news-70", 100, 0, 0.0, 5.350000000000001, 2, 37, 12.900000000000006, 16.94999999999999, 37.0, 124.22360248447205, 12612.577639751553, 45.73466614906832], "isController": false}, {"data": ["\/system\/authentication-69", 100, 0, 0.0, 1.630000000000001, 0, 10, 5.0, 5.949999999999989, 10.0, 125.62814070351757, 37.66390546482412, 47.47860395728643], "isController": false}]}, function(index, item){
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
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1000, 0, null, null, null, null, null, null, null, null, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
