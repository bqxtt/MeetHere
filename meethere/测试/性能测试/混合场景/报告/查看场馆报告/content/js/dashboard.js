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

    var data = {"OkPercent": 95.65217391304348, "KoPercent": 4.3478260869565215};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.884, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "\/public\/login-261"], "isController": false}, {"data": [1.0, 500, 1500, "\/system\/username-258"], "isController": false}, {"data": [1.0, 500, 1500, "\/system\/authentication-302"], "isController": false}, {"data": [1.0, 500, 1500, "\/logout-306-1"], "isController": false}, {"data": [1.0, 500, 1500, "\/public\/login-276"], "isController": false}, {"data": [1.0, 500, 1500, "\/system\/authentication-301"], "isController": false}, {"data": [1.0, 500, 1500, "\/logout-306-0"], "isController": false}, {"data": [1.0, 500, 1500, "\/system\/username-289"], "isController": false}, {"data": [1.0, 500, 1500, "\/system\/username-300"], "isController": false}, {"data": [1.0, 500, 1500, "\/system\/authentication-259"], "isController": false}, {"data": [1.0, 500, 1500, "\/system\/authentication-303"], "isController": false}, {"data": [0.0, 500, 1500, "\/public\/class=\'img\'-305"], "isController": false}, {"data": [0.55, 500, 1500, "\/public\/login-267"], "isController": false}, {"data": [1.0, 500, 1500, "\/public\/index-277"], "isController": false}, {"data": [1.0, 500, 1500, "\/system\/authentication-290"], "isController": false}, {"data": [1.0, 500, 1500, "\/public\/sites-304"], "isController": false}, {"data": [1.0, 500, 1500, "\/public\/login-267-1"], "isController": false}, {"data": [1.0, 500, 1500, "\/system\/authentication-291"], "isController": false}, {"data": [0.55, 500, 1500, "\/public\/login-267-0"], "isController": false}, {"data": [1.0, 500, 1500, "\/logout-306"], "isController": false}, {"data": [0.5, 500, 1500, "\/-246"], "isController": false}, {"data": [1.0, 500, 1500, "\/system\/authentication-260"], "isController": false}, {"data": [1.0, 500, 1500, "\/public\/room_info.html-292"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 2300, 100, 4.3478260869565215, 96.00391304347839, 0, 1262, 396.1000000000008, 892.5999999999985, 1119.9699999999993, 153.59957259249364, 1854.5361438994257, 74.54979255709897], "isController": false}, "titles": ["Label", "#Samples", "KO", "Error %", "Average", "Min", "Max", "90th pct", "95th pct", "99th pct", "Transactions\/s", "Received", "Sent"], "items": [{"data": ["\/public\/login-261", 100, 0, 0.0, 7.149999999999997, 0, 86, 18.0, 24.94999999999999, 86.0, 116.68611435239207, 363.73249708284715, 47.631636522753794], "isController": false}, {"data": ["\/system\/username-258", 100, 0, 0.0, 8.449999999999996, 0, 86, 13.900000000000006, 85.0, 86.0, 116.41443538998836, 33.53736175785797, 41.495379802095464], "isController": false}, {"data": ["\/system\/authentication-302", 100, 0, 0.0, 3.2900000000000005, 0, 60, 6.900000000000006, 13.899999999999977, 59.599999999999795, 66.75567423230974, 20.013664052069426, 29.010034212283045], "isController": false}, {"data": ["\/logout-306-1", 100, 0, 0.0, 0.9500000000000003, 0, 2, 2.0, 2.0, 2.0, 55.5864369093941, 173.27334630350194, 27.087531267370764], "isController": false}, {"data": ["\/public\/login-276", 100, 0, 0.0, 6.309999999999998, 0, 135, 8.0, 15.899999999999977, 134.31999999999965, 66.57789613848203, 207.53578561917445, 23.34127413448735], "isController": false}, {"data": ["\/system\/authentication-301", 100, 0, 0.0, 2.860000000000001, 0, 58, 6.0, 7.0, 57.54999999999977, 66.75567423230974, 20.013664052069426, 29.010034212283045], "isController": false}, {"data": ["\/logout-306-0", 100, 0, 0.0, 1.3300000000000005, 0, 3, 2.0, 2.9499999999999886, 3.0, 55.5247084952804, 16.700791227096058, 26.35254719600222], "isController": false}, {"data": ["\/system\/username-289", 100, 0, 0.0, 4.790000000000002, 0, 82, 8.0, 13.949999999999989, 81.82999999999991, 66.48936170212765, 19.479305186170212, 27.92033743351064], "isController": false}, {"data": ["\/system\/username-300", 100, 0, 0.0, 3.3100000000000005, 0, 24, 7.900000000000006, 13.0, 23.949999999999974, 66.75567423230974, 19.557326435246996, 28.618887683578105], "isController": false}, {"data": ["\/system\/authentication-259", 100, 0, 0.0, 7.509999999999997, 0, 86, 14.0, 79.9499999999993, 85.99, 116.14401858304298, 34.820521196283394, 42.079522357723576], "isController": false}, {"data": ["\/system\/authentication-303", 100, 0, 0.0, 5.559999999999998, 0, 71, 14.900000000000006, 53.19999999999982, 70.91999999999996, 55.74136008918617, 16.711521042363433, 24.223540273132663], "isController": false}, {"data": ["\/public\/class=\'img\'-305", 100, 100, 100.0, 305.85, 2, 714, 572.5, 592.6999999999999, 714.0, 52.6592943654555, 32.500658241179565, 21.547113612427594], "isController": false}, {"data": ["\/public\/login-267", 100, 0, 0.0, 885.9199999999998, 154, 1262, 1155.4, 1197.95, 1261.4899999999998, 60.45949214026602, 211.13588270858526, 66.83607920193471], "isController": false}, {"data": ["\/public\/index-277", 100, 0, 0.0, 6.31, 0, 88, 8.0, 28.899999999999977, 87.92999999999996, 66.62225183211193, 202.53424800133246, 31.94484926715523], "isController": false}, {"data": ["\/system\/authentication-290", 100, 0, 0.0, 5.0900000000000025, 0, 77, 14.700000000000017, 28.449999999999875, 76.6099999999998, 66.44518272425249, 19.920577242524917, 28.291112956810633], "isController": false}, {"data": ["\/public\/sites-304", 100, 0, 0.0, 22.640000000000008, 5, 231, 45.200000000000045, 116.69999999999948, 230.99, 52.27391531625718, 12758.715041819132, 22.25725300575013], "isController": false}, {"data": ["\/public\/login-267-1", 100, 0, 0.0, 8.43, 0, 64, 23.0, 37.64999999999992, 63.969999999999985, 66.48936170212765, 207.25980718085106, 37.07561087101064], "isController": false}, {"data": ["\/system\/authentication-291", 100, 0, 0.0, 5.33, 0, 99, 7.900000000000006, 15.899999999999977, 98.69999999999985, 66.5335994677312, 19.947084996673322, 28.32875914836993], "isController": false}, {"data": ["\/public\/login-267-0", 100, 0, 0.0, 877.1399999999999, 147, 1235, 1143.2, 1179.55, 1234.6899999999998, 60.53268765133172, 22.699757869249396, 33.16292751210654], "isController": false}, {"data": ["\/logout-306", 200, 0, 0.0, 2.379999999999998, 1, 5, 4.0, 4.0, 5.0, 13.772207684891887, 47.07297548547032, 13.247680243768075], "isController": false}, {"data": ["\/-246", 200, 100, 50.0, 672.3649999999998, 1, 2109, 1642.5, 1779.75, 1925.7500000000002, 88.41732979664015, 11954.471982758621, 376.809792219275], "isController": false}, {"data": ["\/system\/authentication-260", 100, 0, 0.0, 5.8699999999999966, 0, 50, 13.600000000000023, 39.29999999999984, 49.97999999999999, 115.87485515643107, 34.73982473928157, 41.982003186558515], "isController": false}, {"data": ["\/public\/room_info.html-292", 100, 0, 0.0, 4.749999999999999, 0, 55, 8.0, 18.749999999999943, 54.83999999999992, 66.62225183211193, 259.78774566955366, 32.00991005996003], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["500", 100, 100.0, 4.3478260869565215], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 2300, 100, "500", 100, null, null, null, null, null, null, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["\/public\/class=\'img\'-305", 100, 100, "500", 100, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
