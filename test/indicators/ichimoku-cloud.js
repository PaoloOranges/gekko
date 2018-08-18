// Use history value and compute indicators from ichimoku cloud via excel/google sheets

let chai = require('chai');
let expect = chai.expect;
let should = chai.should;
let sinon = require('sinon');

let _ = require('lodash');

let util = require('../../core/util');
let dirs = util.dirs();
let INDICATOR_PATH = dirs.indicators;

const prices = [959.87988, 997.72988, 1015.97711, 1023.14188, 1126.76334, 994.67488, 883.09918, 896.83038, 908.14904, 894.18025, 906.05691, 785.22374, 803.37238, 826.29566, 817.91288, 822.20760, 830.50513, 903.84575, 874.99496, 895.79888, 893.62109, 920.44790, 918.60363, 922.07361, 890.32023, 893.04563, 915.95625, 919.27975, 920.31225, 915.93300, 921.17933, 964.70608, 979.70387, 1007.61371, 1013.02700, 1030.99941, 1014.83773, 1024.01375, 1050.11000, 1052.37661, 976.10300, 999.10350, 1008.84666, 1000.60463, 999.87738, 1011.78025, 1012.32599, 1035.20812, 1055.53685, 1056.63714, 1052.77929, 1084.75501, 1123.78843, 1123.22319, 1172.01715, 1174.86625, 1150.60571, 1175.04975, 1190.75195, 1187.56529, 1222.49940, 1259.41082, 1285.14000, 1267.02720, 1270.93330, 1275.19738, 1238.44700, 1157.39330, 1192.46914, 1098.61713, 1179.15988, 1227.49463, 1239.81623, 1245.37079, 1257.39963, 1180.94566, 1091.17189, 952.23236, 1029.80081, 1049.08449, 1118.63004, 1028.72686, 1038.78900, 941.91971, 959.34009, 956.78631, 1037.22925, 1046.12763, 1040.57550, 1037.90455, 1079.54931, 1086.92957, 1099.16913, 1141.81300, 1141.60036, 1133.07931, 1196.30794, 1190.45425, 1181.14984, 1208.80050, 1207.74488];

describe('indicators/ICHIMOKU-CLOUD', function() {

    let ICHIMOKUCLOUD = require(INDICATOR_PATH + 'ICHIMOKU-CLOUD');
    
    const configPeriods = {
        tenkansen : 9,
        kijunsen : 26,
        senkouspanb : 52,
        chikouspan : 26
    };

    // 9 days shift
    const verifiedTenkanSen = [1004.931256, 1004.931256, 1004.931256, 955.9935375, 955.9935375, 889.9493063, 846.6863875, 846.6863875, 846.6863875, 845.6403259, 845.6403259, 844.5347438, 853.6090625, 869.1803875, 869.1803875, 872.1406063, 876.2893688, 898.5342875, 898.5342875, 906.1969188, 906.1969188, 906.1969188, 906.1969188, 927.51315, 935.01205, 950.3296688, 964.48, 973.4662063, 973.4662063, 973.4662063, 985.6446625, 1008.541344, 1014.239806, 1014.239806, 1014.239806, 1014.239806, 1014.239806, 1014.239806, 1014.239806, 1014.239806, 1015.819925, 1027.870319, 1028.257256, 1042.316194, 1061.832902, 1067.784339, 1092.171569, 1105.037188, 1113.822768, 1113.914518, 1121.765618, 1137.753481, 1172.861294, 1191.317002, 1217.872857, 1217.872857, 1217.872857, 1230.094875, 1236.352643, 1221.26665, 1221.26665, 1191.878564, 1191.878564, 1186.907252, 1186.907252, 1186.907252, 1178.008377, 1178.008377, 1174.285756, 1104.815994, 1104.815994, 1104.815994, 1104.815994, 1104.815994, 1104.815994, 1061.432686, 1030.274879, 1030.274879, 1030.274879, 1030.274879, 1030.274879, 994.0236696, 1010.734514, 1014.424643, 1027.977719, 1049.299656, 1089.521125, 1089.858775, 1117.106244, 1117.106244, 1137.928626, 1147.865036, 1153.984813];
    // 26 days shift
    const verifiedKijunSen = [955.9935375, 955.9935375, 955.9935375, 955.9935375, 955.9935375, 889.9493063, 874.9649063, 882.4638063, 896.418725, 899.1253688, 908.111575, 908.111575, 917.1858938, 934.0114375, 935.1447438, 937.2921063, 941.4408688, 963.6857875, 963.6857875, 971.3484188, 971.3484188, 971.3484188, 971.3484188, 972.9285375, 973.4786812, 974.8413812, 1000.344006, 1019.860714, 1019.860714, 1043.975075, 1048.022788, 1069.786163, 1075.576375, 1083.427475, 1083.427475, 1099.3012, 1117.756908, 1130.6215, 1130.6215, 1130.6215, 1130.6215, 1142.12175, 1142.508688, 1142.508688, 1142.508688, 1148.460125, 1148.732994, 1160.174063, 1168.959643, 1168.959643, 1168.959643, 1184.947506, 1118.686181, 1118.686181, 1118.686181, 1118.686181, 1118.686181, 1118.686181, 1113.529857, 1113.529857, 1113.529857, 1113.529857, 1113.529857, 1108.558545, 1108.558545, 1108.558545, 1099.65967, 1099.65967, 1099.65967, 1099.65967, 1099.65967, 1099.65967, 1099.65967, 1099.65967, 1099.65967, 1075.360107];
    // 26 days shift
    const verifiedSenkouSpanA = [927.2639125, 927.2639125, 931.0952281, 931.0952281, 931.0952281, 898.0731125, 901.2390281, 908.7379281, 923.3741969, 931.8026844, 940.7888906, 940.7888906, 945.32605, 959.82805, 971.8430438, 975.7659563, 977.8403375, 988.9627969, 988.9627969, 992.7941125, 992.7941125, 992.7941125, 992.7941125, 994.3742313, 1000.6745, 1001.549319, 1021.3301, 1040.846808, 1043.822527, 1068.073322, 1076.529988, 1091.804465, 1094.745446, 1102.596546, 1110.590478, 1136.081247, 1154.536955, 1174.247179, 1174.247179, 1174.247179, 1180.358188, 1189.237196, 1181.887669, 1181.887669, 1167.193626, 1170.169345, 1167.820123, 1173.540657, 1177.933447, 1173.48401, 1173.48401, 1179.616631, 1111.751088, 1111.751088, 1111.751088, 1111.751088, 1111.751088, 1111.751088, 1087.481271, 1071.902368, 1071.902368, 1071.902368, 1071.902368, 1069.416712, 1051.291107, 1059.646529, 1057.042156, 1063.818694, 1074.479663, 1094.590397, 1094.759222, 1108.382957, 1108.382957, 1118.794148, 1123.762353, 1114.67246];
    // 52 days shift
    const verifiedSenkouSpanB = [955.9935375, 955.9935375, 955.9935375, 978.6204438, 980.0449938, 980.0449938, 980.1367438, 987.9878438, 987.9878438, 1003.861569, 1022.317277, 1035.181869, 1044.256188, 1051.526438, 1051.526438, 1053.6738, 1057.822563, 1080.067481, 1080.067481, 1087.730113, 1087.730113, 1087.730113, 1087.730113, 1087.730113, 1087.730113, 1089.092813, 1100.5365, 1100.5365, 1100.5365, 1100.5365, 1103.159663, 1118.686181, 1113.529857, 1113.529857, 1113.529857, 1113.529857, 1113.529857, 1113.529857, 1113.529857, 1113.529857, 1113.529857, 1113.529857, 1113.529857, 1113.529857, 1113.529857, 1113.529857, 1113.529857, 1113.529857, 1113.529857, 1113.529857];    
    // 52 days shift as spanB
    const verifiedCloudColor = ["GREEN", "GREEN", "GREEN", "GREEN", "GREEN", "GREEN", "GREEN", "GREEN", "GREEN", "GREEN", "GREEN", "GREEN", "GREEN", "GREEN", "GREEN", "GREEN", "GREEN", "GREEN", "GREEN", "GREEN", "GREEN", "GREEN", "GREEN", "GREEN", "GREEN", "GREEN", "GREEN", "GREEN", "GREEN", "GREEN", "GREEN", "RED", "RED", "RED", "RED", "RED", "RED", "RED", "RED", "RED", "RED", "RED", "RED", "RED", "RED", "RED", "RED", "GREEN", "GREEN", "GREEN"];
    // 52 days shift as spanB
    const verifiedTrend = ["UP", "UP", "UP", "UP", "UP", "UP", "UP", "UP", "UP", "UP", "UP", "UP", "UP", "UP", "UP", "UP", "FLAT", "UP", "FLAT", "UP", "UP", "UP", "UP", "UP", "UP", "FLAT", "DOWN", "DOWN", "DOWN", "UP", "DOWN", "DOWN", "DOWN", "DOWN", "DOWN", "DOWN", "DOWN", "DOWN", "DOWN", "FLAT", "FLAT", "FLAT", "UP", "UP", "UP", "UP", "UP", "UP", "UP", "UP"];

    it('should correctly calculate TenkanSen with default weight 9', function() {
      let ichimokuCloud = new ICHIMOKUCLOUD(configPeriods);
      _.each(prices, function(p, i) {
        ichimokuCloud.update(p);
        if(i >= configPeriods.tenkansen - 1)
        {
            var j = i - (configPeriods.tenkansen - 1);
            expect(ichimokuCloud.result.tenkanSen).to.closeTo(verifiedTenkanSen[j], 0.0001);
        }        
      });      
    });
  
    it('should correctly calculate KijunSen with default weight 26', function() {
        var ichimokuCloud = new ICHIMOKUCLOUD(configPeriods);
        _.each(prices, function(p, i) {
          ichimokuCloud.update(p);
          if(i >= configPeriods.kijunsen - 1)
          {
              var j = i - (configPeriods.kijunsen - 1);
              expect(ichimokuCloud.result.kijunSen).to.closeTo(verifiedKijunSen[j], 0.0001);
          }        
        });      
      });  

      it('should correctly calculate SenkouSpan A with default weight 9-26', function() {
        var ichimokuCloud = new ICHIMOKUCLOUD(configPeriods);
        _.each(prices, function(p, i) {
          ichimokuCloud.update(p);
          if(i >= configPeriods.kijunsen - 1)
          {
              var j = i - (configPeriods.kijunsen - 1);
              expect(ichimokuCloud.result.senkouSpanA).to.closeTo(verifiedSenkouSpanA[j], 0.0001);
          }        
        });      
      });  

      it('should correctly calculate SenkouSpan B with default weight 52', function() {
        var ichimokuCloud = new ICHIMOKUCLOUD(configPeriods);
        _.each(prices, function(p, i) {
          ichimokuCloud.update(p);
          if(i >= configPeriods.senkouspanb - 1)
          {
              var j = i - (configPeriods.senkouspanb - 1);
              expect(ichimokuCloud.result.senkouSpanB).to.closeTo(verifiedSenkouSpanB[j], 0.0001);
          }        
        });      
      });
      
      it('should correctly give cloud color after senkouSppanB periods', function() {
        var ichimokuCloud = new ICHIMOKUCLOUD(configPeriods);
        _.each(prices, function(p, i) {
          ichimokuCloud.update(p);
          if(i >= configPeriods.senkouspanb - 1)
          {
              var j = i - (configPeriods.senkouspanb - 1);
              expect(ichimokuCloud.getCloudColor()).to.equal(verifiedCloudColor[j]);
          }        
        });      
      });

      it('should correctly give trend after senkouSppanB periods', function() {
        var ichimokuCloud = new ICHIMOKUCLOUD(configPeriods);
        _.each(prices, function(p, i) {
          ichimokuCloud.update(p);
          if(i >= configPeriods.senkouspanb - 1)
          {
              var j = i - (configPeriods.senkouspanb - 1);
              expect(ichimokuCloud.getTrend()).to.equal(verifiedTrend[j]);
          }        
        });      
      });
  });