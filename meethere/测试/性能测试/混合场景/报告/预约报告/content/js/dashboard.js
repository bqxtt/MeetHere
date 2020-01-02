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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.9532142857142857, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "\/public\/login-94-1"], "isController": false}, {"data": [1.0, 500, 1500, "\/system\/authentication-118"], "isController": false}, {"data": [0.57, 500, 1500, "\/public\/login-94-0"], "isController": false}, {"data": [1.0, 500, 1500, "\/system\/username-130"], "isController": false}, {"data": [0.56, 500, 1500, "\/public\/login-94"], "isController": false}, {"data": [1.0, 500, 1500, "\/public\/login-95"], "isController": false}, {"data": [1.0, 500, 1500, "\/system\/authentication-117"], "isController": false}, {"data": [1.0, 500, 1500, "\/public\/index-104"], "isController": false}, {"data": [1.0, 500, 1500, "\/logout-151"], "isController": false}, {"data": [1.0, 500, 1500, "\/system\/authentication-132"], "isController": false}, {"data": [1.0, 500, 1500, "\/system\/username-116"], "isController": false}, {"data": [1.0, 500, 1500, "\/system\/authentication-131"], "isController": false}, {"data": [1.0, 500, 1500, "\/user\/reservation.html-119"], "isController": false}, {"data": [1.0, 500, 1500, "\/system\/userId-134"], "isController": false}, {"data": [1.0, 500, 1500, "\/system\/authentication-148"], "isController": false}, {"data": [1.0, 500, 1500, "\/user\/reservation.html-136"], "isController": false}, {"data": [1.0, 500, 1500, "\/system\/username-147"], "isController": false}, {"data": [1.0, 500, 1500, "\/system\/authentication-149"], "isController": false}, {"data": [1.0, 500, 1500, "\/public\/login-88"], "isController": false}, {"data": [1.0, 500, 1500, "\/public\/login-103"], "isController": false}, {"data": [1.0, 500, 1500, "\/logout-151-1"], "isController": false}, {"data": [1.0, 500, 1500, "\/user\/reverse-135"], "isController": false}, {"data": [1.0, 500, 1500, "\/logout-151-0"], "isController": false}, {"data": [1.0, 500, 1500, "\/public\/sites-133"], "isController": false}, {"data": [1.0, 500, 1500, "\/public\/sites-150"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 2500, 0, 0.0, 53.96400000000003, 0, 909, 61.0, 604.9499999999998, 749.9899999999998, 85.82217645039478, 1808.0385877960866, 43.18598738414006], "isController": false}, "titles": ["Label", "#Samples", "KO", "Error %", "Average", "Min", "Max", "90th pct", "95th pct", "99th pct", "Transactions\/s", "Received", "Sent"], "items": [{"data": ["\/public\/login-94-1", 100, 0, 0.0, 17.6, 0, 102, 68.30000000000004, 77.94999999999999, 101.89999999999995, 72.04610951008645, 224.58123198847264, 40.17414895533142], "isController": false}, {"data": ["\/system\/authentication-118", 100, 0, 0.0, 5.260000000000001, 0, 60, 15.700000000000017, 16.0, 59.989999999999995, 71.99424046076314, 21.584210763138948, 30.653797696184306], "isController": false}, {"data": ["\/public\/login-94-0", 100, 0, 0.0, 596.8400000000001, 119, 901, 757.3000000000001, 856.4499999999994, 900.8699999999999, 66.35700066357, 24.883875248838756, 36.35378649635037], "isController": false}, {"data": ["\/system\/username-130", 100, 0, 0.0, 5.439999999999999, 0, 126, 10.0, 16.94999999999999, 125.33999999999966, 72.09805335255948, 21.12247656813266, 30.909224044700792], "isController": false}, {"data": ["\/public\/login-94", 200, 0, 0.0, 662.6249999999999, 125, 1099, 879.7, 926.95, 1014.0, 13.49345567399811, 1798.964904365133, 47.200740453380114], "isController": false}, {"data": ["\/public\/login-95", 100, 0, 0.0, 5.010000000000001, 0, 21, 13.0, 16.0, 20.989999999999995, 71.99424046076314, 224.4195464362851, 34.520675845932324], "isController": false}, {"data": ["\/system\/authentication-117", 100, 0, 0.0, 6.83, 0, 181, 13.0, 17.0, 180.00999999999948, 71.99424046076314, 21.584210763138948, 30.653797696184306], "isController": false}, {"data": ["\/public\/index-104", 100, 0, 0.0, 13.390000000000006, 0, 113, 19.0, 106.0, 113.0, 71.94244604316546, 218.7078462230216, 34.495840827338135], "isController": false}, {"data": ["\/logout-151", 100, 0, 0.0, 1.8699999999999997, 1, 7, 4.0, 4.0, 6.989999999999995, 71.37758743754462, 243.96636331192005, 68.6591051034975], "isController": false}, {"data": ["\/system\/authentication-132", 100, 0, 0.0, 4.630000000000001, 0, 170, 9.900000000000006, 14.949999999999989, 168.46999999999923, 72.20216606498195, 21.646547833935017, 31.376917870036102], "isController": false}, {"data": ["\/system\/username-116", 100, 0, 0.0, 5.310000000000001, 0, 63, 12.900000000000006, 17.0, 63.0, 71.99424046076314, 21.0920626349892, 30.23195644348452], "isController": false}, {"data": ["\/system\/authentication-131", 100, 0, 0.0, 8.130000000000003, 0, 120, 15.0, 52.29999999999961, 119.99, 72.25433526011561, 21.662188403179194, 31.399589053468212], "isController": false}, {"data": ["\/user\/reservation.html-119", 100, 0, 0.0, 13.230000000000002, 0, 239, 17.0, 102.44999999999987, 237.88999999999942, 72.04610951008645, 325.96643101585016, 34.615904178674356], "isController": false}, {"data": ["\/system\/userId-134", 200, 0, 0.0, 9.489999999999998, 1, 32, 21.0, 26.0, 30.99000000000001, 12.815583749839805, 1626.3213567698322, 29.942660274894273], "isController": false}, {"data": ["\/system\/authentication-148", 100, 0, 0.0, 0.7799999999999999, 0, 7, 1.0, 2.0, 6.9599999999999795, 71.27583749109053, 21.368830185317176, 30.974362972202425], "isController": false}, {"data": ["\/user\/reservation.html-136", 100, 0, 0.0, 1.1199999999999999, 0, 7, 2.0, 2.0, 7.0, 71.22507122507123, 322.2517138532764, 36.02987001424501], "isController": false}, {"data": ["\/system\/username-147", 100, 0, 0.0, 0.7200000000000002, 0, 3, 1.0, 1.9499999999999886, 2.989999999999995, 71.22507122507123, 20.866720085470085, 30.53496705840456], "isController": false}, {"data": ["\/system\/authentication-149", 100, 0, 0.0, 0.8999999999999998, 0, 6, 2.0, 3.0, 5.969999999999985, 71.37758743754462, 21.399335296216986, 31.018580478229836], "isController": false}, {"data": ["\/public\/login-88", 200, 0, 0.0, 6.230000000000003, 1, 48, 19.500000000000085, 48.0, 48.0, 5.9864108473764555, 18.660765063306297, 2.2507501721093117], "isController": false}, {"data": ["\/public\/login-103", 100, 0, 0.0, 12.449999999999994, 0, 172, 17.0, 108.39999999999964, 171.48999999999972, 72.09805335255948, 224.7431506849315, 25.276563626532084], "isController": false}, {"data": ["\/logout-151-1", 100, 0, 0.0, 1.0500000000000005, 0, 6, 2.0, 2.0, 5.969999999999985, 71.37758743754462, 222.4973233404711, 34.7826329407566], "isController": false}, {"data": ["\/user\/reverse-135", 100, 0, 0.0, 2.9799999999999995, 1, 9, 6.0, 6.0, 8.989999999999995, 71.02272727272728, 20.946155894886363, 44.59727894176137], "isController": false}, {"data": ["\/logout-151-0", 100, 0, 0.0, 0.7299999999999996, 0, 3, 2.0, 2.0, 3.0, 71.37758743754462, 21.469039971448964, 33.876472162740896], "isController": false}, {"data": ["\/public\/sites-133", 100, 0, 0.0, 15.349999999999996, 4, 116, 31.0, 72.39999999999986, 115.95999999999998, 72.04610951008645, 17584.597892651298, 30.6758825648415], "isController": false}, {"data": ["\/public\/sites-150", 100, 0, 0.0, 5.669999999999997, 4, 12, 8.0, 9.0, 11.989999999999995, 71.12375533428165, 17359.47501778094, 30.28316145092461], "isController": false}]}, function(index, item){
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
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 2500, 0, null, null, null, null, null, null, null, null, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
