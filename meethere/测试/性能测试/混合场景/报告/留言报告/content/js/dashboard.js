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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.9659574468085106, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "\/system\/userId-224"], "isController": false}, {"data": [1.0, 500, 1500, "\/system\/username-198"], "isController": false}, {"data": [1.0, 500, 1500, "\/public\/messages\/8-207"], "isController": false}, {"data": [1.0, 500, 1500, "\/system\/userId-201"], "isController": false}, {"data": [1.0, 500, 1500, "\/public\/login-175"], "isController": false}, {"data": [1.0, 500, 1500, "\/public\/message.html-191"], "isController": false}, {"data": [1.0, 500, 1500, "\/system\/getusernamebyid\/3-227"], "isController": false}, {"data": [1.0, 500, 1500, "\/system\/authentication-190"], "isController": false}, {"data": [1.0, 500, 1500, "\/system\/getusernamebyid\/3-204"], "isController": false}, {"data": [1.0, 500, 1500, "\/public\/message.html-214"], "isController": false}, {"data": [1.0, 500, 1500, "\/public\/messages\/11-232"], "isController": false}, {"data": [1.0, 500, 1500, "\/public\/index-176"], "isController": false}, {"data": [1.0, 500, 1500, "\/system\/getusernamebyid\/3-208"], "isController": false}, {"data": [1.0, 500, 1500, "\/system\/getusernamebyid\/3-229"], "isController": false}, {"data": [1.0, 500, 1500, "\/system\/getusernamebyid\/3-206"], "isController": false}, {"data": [1.0, 500, 1500, "\/system\/authentication-199"], "isController": false}, {"data": [1.0, 500, 1500, "\/system\/getusernamebyid\/7-202"], "isController": false}, {"data": [1.0, 500, 1500, "\/public\/messages\/20-236"], "isController": false}, {"data": [0.55, 500, 1500, "\/public\/login-166-0"], "isController": false}, {"data": [1.0, 500, 1500, "\/system\/getusernamebyid\/7-225"], "isController": false}, {"data": [1.0, 500, 1500, "\/public\/login-166-1"], "isController": false}, {"data": [1.0, 500, 1500, "\/system\/username-188"], "isController": false}, {"data": [1.0, 500, 1500, "\/system\/username-221"], "isController": false}, {"data": [1.0, 500, 1500, "\/user\/reply-213"], "isController": false}, {"data": [0.6525, 500, 1500, "\/public\/login-160"], "isController": false}, {"data": [1.0, 500, 1500, "\/system\/userId-212"], "isController": false}, {"data": [1.0, 500, 1500, "\/logout-237-0"], "isController": false}, {"data": [0.545, 500, 1500, "\/public\/login-166"], "isController": false}, {"data": [1.0, 500, 1500, "\/logout-237-1"], "isController": false}, {"data": [1.0, 500, 1500, "\/public\/messages-203"], "isController": false}, {"data": [1.0, 500, 1500, "\/public\/messages-226"], "isController": false}, {"data": [1.0, 500, 1500, "\/public\/messages\/19-211"], "isController": false}, {"data": [1.0, 500, 1500, "\/public\/messages\/19-234"], "isController": false}, {"data": [1.0, 500, 1500, "\/public\/messages\/4-228"], "isController": false}, {"data": [1.0, 500, 1500, "\/logout-237"], "isController": false}, {"data": [1.0, 500, 1500, "\/public\/messages\/4-205"], "isController": false}, {"data": [1.0, 500, 1500, "\/public\/messages\/8-230"], "isController": false}, {"data": [1.0, 500, 1500, "\/system\/getusernamebyid\/7-235"], "isController": false}, {"data": [1.0, 500, 1500, "\/public\/messages\/11-209"], "isController": false}, {"data": [1.0, 500, 1500, "\/system\/authentication-223"], "isController": false}, {"data": [1.0, 500, 1500, "\/system\/authentication-189"], "isController": false}, {"data": [1.0, 500, 1500, "\/system\/authentication-200"], "isController": false}, {"data": [1.0, 500, 1500, "\/system\/authentication-222"], "isController": false}, {"data": [1.0, 500, 1500, "\/system\/getusernamebyid\/3-233"], "isController": false}, {"data": [1.0, 500, 1500, "\/system\/getusernamebyid\/3-210"], "isController": false}, {"data": [1.0, 500, 1500, "\/system\/getusernamebyid\/3-231"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 4600, 0, 0.0, 51.34217391304349, 0, 1354, 29.0, 145.89999999999964, 1107.9899999999998, 2025.5394099515631, 2960.587468350947, 948.7835755173933], "isController": false}, "titles": ["Label", "#Samples", "KO", "Error %", "Average", "Min", "Max", "90th pct", "95th pct", "99th pct", "Transactions\/s", "Received", "Sent"], "items": [{"data": ["\/system\/userId-224", 100, 0, 0.0, 9.88, 1, 248, 15.800000000000011, 26.699999999999932, 246.6399999999993, 54.70459518599562, 16.400694064551423, 23.238768462800873], "isController": false}, {"data": ["\/system\/username-198", 100, 0, 0.0, 4.179999999999998, 0, 30, 7.900000000000006, 13.899999999999977, 29.85999999999993, 56.85048322910745, 16.655415008527573, 24.26138786242183], "isController": false}, {"data": ["\/public\/messages\/8-207", 100, 0, 0.0, 8.13, 1, 99, 16.900000000000006, 24.849999999999966, 98.27999999999963, 55.21811154058531, 16.015409304251794, 23.672608365543898], "isController": false}, {"data": ["\/system\/userId-201", 100, 0, 0.0, 22.049999999999997, 1, 270, 60.30000000000004, 137.84999999999997, 269.07999999999953, 53.96654074473827, 16.179421883432273, 22.925239476524556], "isController": false}, {"data": ["\/public\/login-175", 100, 0, 0.0, 6.539999999999998, 0, 83, 11.0, 21.899999999999977, 82.63999999999982, 57.04506560182544, 177.82016543069025, 19.999197803764975], "isController": false}, {"data": ["\/public\/message.html-191", 100, 0, 0.0, 7.300000000000001, 1, 94, 8.0, 21.849999999999966, 93.89999999999995, 56.88282138794084, 263.7496444823663, 27.21931882821388], "isController": false}, {"data": ["\/system\/getusernamebyid\/3-227", 100, 0, 0.0, 9.58, 1, 148, 19.900000000000006, 25.94999999999999, 147.0399999999995, 54.614964500273075, 15.893808028399782, 23.787377116329875], "isController": false}, {"data": ["\/system\/authentication-190", 100, 0, 0.0, 5.3199999999999985, 1, 53, 12.0, 14.0, 52.89999999999995, 56.91519635742743, 17.06344265793967, 24.2334234490609], "isController": false}, {"data": ["\/system\/getusernamebyid\/3-204", 100, 0, 0.0, 12.050000000000002, 1, 188, 17.900000000000006, 38.94999999999999, 187.49999999999974, 54.34782608695652, 15.816066576086955, 23.67102581521739], "isController": false}, {"data": ["\/public\/message.html-214", 100, 0, 0.0, 6.1499999999999995, 1, 54, 10.900000000000006, 17.849999999999966, 53.76999999999988, 54.6448087431694, 253.3726092896175, 27.535860655737704], "isController": false}, {"data": ["\/public\/messages\/11-232", 100, 0, 0.0, 14.19, 1, 196, 20.900000000000006, 109.89999999999907, 195.46999999999974, 54.6448087431694, 15.849129098360654, 23.4801912568306], "isController": false}, {"data": ["\/public\/index-176", 100, 0, 0.0, 6.499999999999998, 0, 76, 11.0, 31.64999999999992, 75.78999999999989, 57.01254275940707, 173.32035704104902, 27.337068842645383], "isController": false}, {"data": ["\/system\/getusernamebyid\/3-208", 100, 0, 0.0, 16.13, 1, 167, 38.00000000000006, 130.69999999999925, 167.0, 55.37098560354374, 16.113821982281284, 24.116659745293465], "isController": false}, {"data": ["\/system\/getusernamebyid\/3-229", 100, 0, 0.0, 10.729999999999999, 1, 134, 26.900000000000006, 37.94999999999999, 133.30999999999966, 54.614964500273075, 15.893808028399782, 23.787377116329875], "isController": false}, {"data": ["\/system\/getusernamebyid\/3-206", 100, 0, 0.0, 10.069999999999997, 1, 149, 18.0, 25.699999999999932, 148.27999999999963, 55.15719801434087, 16.051606453392168, 24.02354522890237], "isController": false}, {"data": ["\/system\/authentication-199", 100, 0, 0.0, 5.14, 0, 54, 8.0, 17.94999999999999, 53.86999999999993, 56.85048322910745, 17.04404135872655, 24.594496162592385], "isController": false}, {"data": ["\/system\/getusernamebyid\/7-202", 100, 0, 0.0, 16.119999999999997, 1, 191, 27.900000000000006, 98.24999999999937, 190.54999999999978, 54.02485143165856, 15.82759319286872, 23.530355213398163], "isController": false}, {"data": ["\/public\/messages\/20-236", 100, 0, 0.0, 13.730000000000002, 1, 257, 21.900000000000006, 40.69999999999993, 255.80999999999938, 54.70459518599562, 15.866469502188183, 23.505880743982495], "isController": false}, {"data": ["\/public\/login-166-0", 100, 0, 0.0, 945.03, 258, 1326, 1178.9, 1297.8999999999996, 1325.84, 49.62779156327544, 18.610421836228287, 27.188663151364764], "isController": false}, {"data": ["\/system\/getusernamebyid\/7-225", 100, 0, 0.0, 10.650000000000002, 1, 225, 21.0, 37.0, 223.19999999999908, 54.58515283842795, 15.991743995633188, 23.774392740174672], "isController": false}, {"data": ["\/public\/login-166-1", 100, 0, 0.0, 10.05, 0, 99, 23.900000000000006, 46.0, 98.73999999999987, 57.04506560182544, 177.82016543069025, 31.8093090416429], "isController": false}, {"data": ["\/system\/username-188", 100, 0, 0.0, 4.070000000000003, 0, 21, 8.0, 14.699999999999932, 20.969999999999985, 56.98005698005698, 16.693376068376068, 23.927172364672366], "isController": false}, {"data": ["\/system\/username-221", 100, 0, 0.0, 7.240000000000001, 0, 108, 15.600000000000023, 31.29999999999984, 107.27999999999963, 54.6448087431694, 16.00922131147541, 23.320099043715846], "isController": false}, {"data": ["\/user\/reply-213", 100, 0, 0.0, 18.549999999999997, 1, 283, 34.60000000000002, 55.0, 282.87999999999994, 54.55537370430987, 16.089573104200763, 32.39225313693399], "isController": false}, {"data": ["\/public\/login-160", 200, 0, 0.0, 708.69, 1, 1897, 1625.8, 1748.95, 1884.5600000000004, 85.17887563884156, 2701.9579495847534, 845.7996166950596], "isController": false}, {"data": ["\/system\/userId-212", 100, 0, 0.0, 14.229999999999997, 1, 272, 26.80000000000001, 43.799999999999955, 270.6299999999993, 53.93743257820928, 16.17069511866235, 22.91287419093851], "isController": false}, {"data": ["\/logout-237-0", 100, 0, 0.0, 3.9899999999999998, 0, 25, 9.0, 12.0, 24.89999999999995, 56.68934240362812, 17.05109126984127, 26.794571995464853], "isController": false}, {"data": ["\/public\/login-166", 100, 0, 0.0, 956.5899999999996, 262, 1354, 1205.7, 1305.5999999999995, 1353.6299999999999, 49.554013875123886, 173.0519078295342, 54.78041377601586], "isController": false}, {"data": ["\/logout-237-1", 100, 0, 0.0, 4.669999999999999, 0, 30, 12.0, 14.0, 29.85999999999993, 56.68934240362812, 176.71130952380952, 27.51426091269841], "isController": false}, {"data": ["\/public\/messages-203", 100, 0, 0.0, 14.98, 1, 400, 18.0, 49.29999999999984, 397.3899999999987, 54.200542005420054, 629.1417894647697, 23.130504742547426], "isController": false}, {"data": ["\/public\/messages-226", 100, 0, 0.0, 19.449999999999996, 1, 231, 38.500000000000085, 140.14999999999958, 230.95999999999998, 54.55537370430987, 740.2977743112384, 23.281931942171305], "isController": false}, {"data": ["\/public\/messages\/19-211", 100, 0, 0.0, 11.559999999999999, 1, 171, 20.0, 37.89999999999998, 170.6199999999998, 56.78591709256105, 16.47013415672913, 24.400198750709826], "isController": false}, {"data": ["\/public\/messages\/19-234", 100, 0, 0.0, 15.870000000000012, 1, 184, 27.0, 121.84999999999906, 183.96999999999997, 54.67468562055768, 15.85779455986878, 23.49302897758338], "isController": false}, {"data": ["\/public\/messages\/4-228", 100, 0, 0.0, 12.09, 1, 191, 21.0, 43.0, 190.49999999999974, 54.614964500273075, 15.840473102129984, 23.41403263244129], "isController": false}, {"data": ["\/logout-237", 100, 0, 0.0, 8.869999999999996, 1, 36, 22.700000000000017, 24.94999999999999, 35.969999999999985, 56.657223796033996, 193.65262039660058, 54.27806303116147], "isController": false}, {"data": ["\/public\/messages\/4-205", 100, 0, 0.0, 7.479999999999999, 1, 42, 13.900000000000006, 17.94999999999999, 41.87999999999994, 54.141851651326476, 15.703251894964808, 23.211203979426095], "isController": false}, {"data": ["\/public\/messages\/8-230", 100, 0, 0.0, 13.420000000000002, 1, 142, 23.80000000000001, 74.84999999999997, 141.89999999999995, 54.6448087431694, 15.849129098360654, 23.426827185792348], "isController": false}, {"data": ["\/system\/getusernamebyid\/7-235", 100, 0, 0.0, 16.560000000000006, 1, 189, 35.90000000000006, 136.24999999999937, 188.70999999999987, 54.70459518599562, 16.026736870897153, 23.826415481400435], "isController": false}, {"data": ["\/public\/messages\/11-209", 100, 0, 0.0, 7.660000000000001, 1, 51, 18.0, 34.74999999999994, 50.929999999999964, 55.61735261401557, 16.131204810901, 23.898081201334815], "isController": false}, {"data": ["\/system\/authentication-223", 100, 0, 0.0, 6.9, 0, 54, 13.0, 26.899999999999977, 53.89999999999995, 54.70459518599562, 16.400694064551423, 23.666148112691467], "isController": false}, {"data": ["\/system\/authentication-189", 100, 0, 0.0, 5.609999999999999, 0, 84, 8.0, 16.899999999999977, 83.52999999999976, 56.98005698005698, 17.08288817663818, 24.26103988603989], "isController": false}, {"data": ["\/system\/authentication-200", 100, 0, 0.0, 4.54, 0, 34, 8.0, 10.949999999999989, 33.969999999999985, 56.88282138794084, 17.05373649032992, 24.608486205915813], "isController": false}, {"data": ["\/system\/authentication-222", 100, 0, 0.0, 6.6400000000000015, 0, 136, 9.900000000000006, 14.949999999999989, 134.9999999999995, 54.73453749315818, 16.409670908593323, 23.679101669403394], "isController": false}, {"data": ["\/system\/getusernamebyid\/3-233", 100, 0, 0.0, 9.549999999999999, 1, 140, 17.900000000000006, 29.549999999999898, 139.75999999999988, 54.67468562055768, 15.911187807545106, 23.813388463641335], "isController": false}, {"data": ["\/system\/getusernamebyid\/3-210", 100, 0, 0.0, 11.03, 1, 192, 19.900000000000006, 27.0, 191.42999999999972, 55.99104143337066, 16.294267917133258, 24.38672312430011], "isController": false}, {"data": ["\/system\/getusernamebyid\/3-231", 100, 0, 0.0, 11.290000000000001, 1, 85, 29.700000000000017, 47.94999999999999, 84.97999999999999, 54.6448087431694, 15.902493169398907, 23.800375683060107], "isController": false}]}, function(index, item){
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
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 4600, 0, null, null, null, null, null, null, null, null, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
