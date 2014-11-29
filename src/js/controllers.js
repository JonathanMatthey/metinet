'use strict';

/* Controllers */

angular.module('app.controllers', ['pascalprecht.translate', 'ngCookies'])
  .controller('AppCtrl', ['$scope', '$translate', '$localStorage', '$window',
    function(              $scope,   $translate,   $localStorage,   $window ) {
      // add 'ie' classes to html
      var isIE = !!navigator.userAgent.match(/MSIE/i);
      isIE && angular.element($window.document.body).addClass('ie');
      isSmartDevice( $window ) && angular.element($window.document.body).addClass('smart');

      // config
      $scope.app = {
        name: 'Metinet',
        version: '0.0.2',
        // for chart colors
        color: {
          primary: '#eee',
          info:    '#23b7e5',
          success: '#27c24c',
          warning: '#fad733',
          danger:  '#f05050',
          light:   '#e8eff0',
          dark:    '#3a3f51',
          black:   '#1c2b36'
        },
        settings: {
          themeID: 1,
          navbarHeaderColor: 'bg-metinet',
          navbarCollapseColor: 'bg-metinet',//'bg-white-only',
          asideColor: 'bg-black',
          headerFixed: true,
          asideFixed: false,
          asideFolded: true,
          asideDock: false,
          container: true
        }
      }

      // save settings to local storage
      if ( angular.isDefined($localStorage.settings) ) {
        $scope.app.settings =  $localStorage.settings;
      } else {
        $localStorage.settings = $scope.app.settings;
      }
      $scope.$watch('app.settings', function(){
        if( $scope.app.settings.asideDock  &&  $scope.app.settings.asideFixed ){
          // aside dock and fixed must set the header fixed.
          $scope.app.settings.headerFixed = true;
        }
        // save to local storage
        $localStorage.settings = $scope.app.settings;
      }, true);

      // angular translate
      $scope.lang = { isopen: false };
      $scope.langs = {en:'English', de_DE:'German', it_IT:'Italian'};
      $scope.selectLang = $scope.langs[$translate.proposedLanguage()] || "English";
      $scope.setLang = function(langKey, $event) {
        // set the current lang
        $scope.selectLang = $scope.langs[langKey];
        // You can change the language during runtime
        $translate.use(langKey);
        $scope.lang.isopen = !$scope.lang.isopen;
      };

      function isSmartDevice( $window )
      {
          // Adapted from http://www.detectmobilebrowsers.com
          var ua = $window['navigator']['userAgent'] || $window['navigator']['vendor'] || $window['opera'];
          // Checks for iOs, Android, Blackberry, Opera Mini, and Windows mobile devices
          return (/iPhone|iPod|iPad|Silk|Android|BlackBerry|Opera Mini|IEMobile/).test(ua);
      }

  }])
  // -- Projects Controllers -- START
  .controller('ProjectListController', ['$scope', '$state', '$window', 'Auth', 'Project', function($scope,$state,$window,Auth,Project) {
    $scope.projects = Project.query();
  }])

  .controller('ProjectCreateController', ['$scope', '$state', '$window', '$http', 'Auth', 'Project', 'moment', 'toaster', function($scope,$state,$window,$http,Auth,Project,moment,toaster) {
    $scope.project = new Project();
    $scope.projectCountry = {};
    $scope.project.name = "Big New Project";
    $scope.project.lat = 1.1;
    $scope.project.lng = 2.2;
    $scope.project.client_name = "JCB";
    $scope.project.contractor_name = "Mr Contractor";
    $scope.project.consultant_name = "Mrs Consultant";
    $scope.project.start_date = new moment().format("DD-MMMM-YYYY");//new moment().format("YYYY-MM-DD 00:00:00");
    $scope.project.end_date_contract = new moment().add(6, 'M').format("DD-MMMM-YYYY");
    $scope.project.progress_reports = true;
    $scope.project.long_lead_items = true;
    $scope.project.risk_assessment = true;
    $scope.project.permit_assessment = true;
    $scope.project.cost_management = true;
    $scope.project.terms = true;

    $http.get('http://178.62.117.241/countries').then(function (resp) {
      $scope.countries = resp.data.data;
      console.log('$scope.countries ')
      console.log($scope.countries )
      $scope.projectCountry = $scope.countries[1];
    });

    $http.get('http://178.62.117.241/currencies').then(function (resp) {
      $scope.currencies = resp.data.data;
      console.log('$scope.currencies' )
      console.log($scope.currencies )
    });

    $scope.updateCountry = function(country) {
      $scope.project.country_id = country.iso
      $scope.project.working_hours = country.working_hours;
      $scope.project.working_days = country.working_days;
    }

    $scope.updateCurrency = function(currency) {
      console.log(currency)
      $scope.project.currency_id = currency.code
    }

    $scope.create = function() {
      console.log($scope.project);
      toaster.pop('wait', 'Saving Project', 'Shouldn\'t take long...');
      $scope.project.$save(
        function(data){
          console.log(JSON.stringify(data));
          if(!data.result){
            toaster.pop('error', 'Error', '');
          }else{
            toaster.pop('success', 'Success', '');
            setTimeout(function(){
              $state.go('app.page.projects');
            }, 1500);
          }
      });
    };
  }])

  .controller('ProjectViewController', ['$scope', '$stateParams','Auth', 'Project', 'ProjectUsers', 'ProjectRFIs', 'ProjectLongLeads', 'ProjectNetworks', 'ProjectLeaves', 'ProjectPermits','ProjectProgressPlot','ProjectAudit', 'Networks', '$modal', '$http', 'toaster',
    function($scope,$stateParams,Auth,Project,ProjectUsers,ProjectRFIs,ProjectLongLeads,ProjectNetworks, ProjectLeaves, ProjectPermits, ProjectProgressPlot, ProjectAudit, Networks, $modal, $http, toaster) {

    $scope.newProjectRFI = ProjectRFIs();

    $scope.init = function(){
      $scope.getProject();
      $scope.getProjectUsers();
      $scope.getProjectAudit();
      $scope.getProjectRFIs();
      $scope.getProjectNetworks();
      $scope.getProjectLongLeads();
      $scope.getProjectPermits();
      $scope.getProjectLeaves();
      $scope.getProjectProgressPlot();
    }

    $scope.getProject = function(){
      Project.get({id:$stateParams.id})
      .$promise.then(function(res) {
        $scope.project = res.data;
        console.log('-- project project');
        console.log($scope.project);
      });
    }

    $scope.getProjectUsers = function(){
      ProjectUsers.get({
        id:$stateParams.id
      })
      .$promise.then(function(res) {
          // success handler
        $scope.projectUsers = res.data
        console.log('-- projectUsers');
        console.log(res.data);
      });
    }

    $scope.deleteUser = function (userId) {
      console.log('deleteUser',userId);
      ProjectUsers.delete({
        id:$stateParams.id,
        users: [userId]
      })
      .$promise.then(function(res) {
          // success handler
      });
    }

    $scope.getProjectAudit = function(){
      ProjectAudit.get({
        id:$stateParams.id
      })
      .$promise.then(function(res) {
          // success handler
        $scope.projectAudit = res.data
        console.log('-- projectAudit');
        console.log(res.data);
      });
    }

    $scope.getProjectRFIs = function(){
      ProjectRFIs.get({
        id:$stateParams.id
      })
      .$promise.then(function(res) {
          // success handler
        $scope.projectRFIs = res.data;
        console.log('-- projectRFIs');
        console.log(res.data);
      });
    }

    $scope.getProjectNetworks = function(){
      ProjectNetworks.get({
        id:$stateParams.id
      })
      .$promise.then(function(res) {
          // success handler
        $scope.projectNetworks = res.data
        console.log('-- projectNetworks');
        console.log(res.data);
      });
    }

    $scope.getProjectLongLeads = function(){
      ProjectLongLeads.get({
        id:$stateParams.id
      })
      .$promise.then(function(res) {
          // success handler
        $scope.projectLongLeads = res.data
        console.log('-- projectLongLeads');
        console.log(res.data);
      });
    }

    $scope.getProjectPermits = function(){
      ProjectPermits.get({
        id:$stateParams.id
      })
      .$promise.then(function(res) {
          // success handler
        $scope.projectPermits = res.data
        console.log('-- projectPermits');
        console.log(res.data);
      });
    }

    $scope.getProjectLeaves = function(){
      ProjectLeaves.get({
        id:$stateParams.id
      })
      .$promise.then(function(res) {
          // success handler
        $scope.projectLeaves = res.data
        console.log('-- projectLeaves');
        console.log(res.data);
      });
    }

    $scope.getProjectProgressPlot = function(){
      ProjectProgressPlot.get({
        id:$stateParams.id
      })
      .$promise.then(function(res) {
          // success handler
        $scope.projectProgressPlot = res.data
        console.log('-- projectProgressPlot');
        console.log(res.data);
        $scope.d0_1 = res.data.actual_plot;
        $scope.d0_2 = res.data.calculated_plot;
      });
    }

    // $scope.createRFI = function(rfi){
    //   toaster.pop('wait', 'Saving RFI', 'Shouldn\'t take long...');
    //   $scope.newProjectRFI.$save(
    //     function(data){
    //       console.log(JSON.stringify(data));
    //       if (!data.result) {
    //         toaster.pop('error', 'Error', '');
    //       } else {
    //         toaster.pop('success', 'Success', '');
    //         // setTimeout(function(){
    //           // $state.go('app.page.projects');
    //         // }, 1500);
    //       }
    //   });
    // }
    // $scope.d0_1 = "[1350687600000, 0], [1351292400000, 0.049174569722515], [1351900800000, 0.11239901650861], [1352505600000, 0.25992272567615], [1353110400000, 0.4074464348437], [1353715200000, 0.55497014401124], [1354320000000, 0.70249385317878], [1354924800000, 0.85001756234633], [1355529600000, 0.99754127151387], [1356134400000, 1.1731647348086], [1356739200000, 1.3698630136986], [1357344000000, 1.5314365999298], [1357948800000, 1.7632595714787], [1358553600000, 2.0512820512821], [1359158400000, 2.31822971549], [1359763200000, 2.5781524411661], [1360368000000, 2.8099754127151], [1360972800000, 3.0066736916052], [1361577600000, 3.3017211099403], [1362182400000, 3.6880927291886], [1362787200000, 4.137688795223], [1363392000000, 4.5802599227257], [1363996800000, 5.1211801896733], [1364601600000, 5.662100456621], [1365202800000, 6.2030207235687], [1365807600000, 6.7439409905163], [1366412400000, 7.284861257464], [1367017200000, 7.8257815244117], [1367622000000, 8.3877766069547], [1368226800000, 8.9778714436249], [1368831600000, 9.5890410958904], [1369436400000, 10.242360379347], [1370041200000, 10.930804355462], [1370646000000, 11.703547593959], [1371250800000, 12.490340709519], [1371855600000, 13.277133825079], [1372460400000, 14.063926940639], [1373065200000, 14.913944502986], [1373670000000, 15.778011942396], [1374274800000, 16.663154197401], [1374879600000, 17.597471022129], [1375484400000, 18.531787846856], [1376089200000, 19.466104671584], [1376694000000, 20.400421496312], [1377298800000, 21.33473832104], [1377903600000, 22.297154899895], [1378508400000, 23.329820864067], [1379113200000, 24.36248682824], [1379718000000, 25.353003161222], [1380322800000, 26.301369863014], [1380927600000, 27.165437302424], [1381532400000, 27.966280295047], [1382137200000, 28.837372672989], [1382742000000, 29.757639620653], [1383350400000, 30.64980681419], [1383955200000, 31.696522655427], [1384560000000, 32.764313312259], [1385164800000, 33.775904460836], [1385769600000, 34.61889708465], [1386374400000, 35.623463294696], [1386979200000, 36.663154197401], [1387584000000, 37.730944854233], [1388188800000, 38.777660695469], [1388793600000, 39.873551106428], [1389398400000, 40.850017562346], [1390003200000, 41.945907973305], [1390608000000, 43.294696171408], [1391212800000, 44.685634000702], [1391817600000, 45.943097997892], [1392422400000, 47.095187917106], [1393027200000, 48.310502283105], [1393632000000, 49.582016157359], [1394236800000, 50.832455216017], [1394841600000, 52.153143659993], [1395446400000, 53.523006673692], [1396051200000, 54.654021777309], [1396652400000, 55.665612925887], [1397257200000, 56.810677906568], [1397862000000, 58.018967334036], [1398466800000, 59.100807867931], [1399071600000, 60.189673340358], [1399676400000, 61.313663505444], [1400281200000, 62.521952932912], [1400886000000, 63.758342114506], [1401490800000, 64.966631541974], [1402095600000, 66.139796276783], [1402700400000, 67.186512118019], [1403305200000, 68.219178082192], [1403910000000, 69.167544783983], [1404514800000, 70.186160871092], [1405119600000, 71.169652265543], [1405724400000, 71.977520196698], [1406329200000, 72.7291886196], [1406934000000, 73.403582718651], [1407538800000, 74.049877063576], [1408143600000, 74.604847207587], [1408748400000, 75.16684229013], [1409353200000, 75.700737618546], [1409958000000, 76.248682824025], [1410562800000, 76.775553213909], [1411167600000, 77.246224095539], [1411772400000, 77.737969792764], [1412377200000, 78.22971548999], [1412982000000, 78.721461187215], [1413586800000, 79.227256761503], [1414191600000, 79.641728134879], [1414800000000, 79.950825430278], [1415404800000, 80.288022479803], [1416009600000, 80.632244467861], [1416614400000, 80.976466455919], [1417219200000, 81.292588689849], [1417824000000, 81.601685985248], [1418428800000, 81.945907973305], [1419033600000, 82.290129961363], [1419638400000, 82.59220231823], [1420243200000, 82.971548998946], [1420848000000, 83.371970495258], [1421452800000, 83.870741131015], [1422057600000, 84.341412012645], [1422662400000, 84.783983140148], [1423267200000, 85.18440463646], [1423872000000, 85.451352300667], [1424476800000, 85.746399719003], [1425081600000, 85.985247629083], [1425686400000, 86.195995785037], [1426291200000, 86.48401826484], [1426896000000, 86.807165437303], [1427500800000, 87.024938531788], [1428102000000, 87.130312609765], [1428706800000, 87.221636810678], [1429311600000, 87.305936073059], [1429916400000, 87.390235335441], [1430521200000, 87.50263435195], [1431126000000, 87.650158061117], [1431730800000, 87.769582016157], [1432335600000, 87.903055848261], [1432940400000, 88.050579557429], [1433545200000, 88.198103266597], [1434150000000, 88.373726729891], [1434754800000, 88.584474885845], [1435359600000, 88.851422550053], [1435964400000, 89.188619599579], [1436569200000, 89.518791710573], [1437174000000, 89.799789251844], [1437778800000, 90.05971197752], [1438383600000, 90.326659641728], [1438988400000, 90.53038285915], [1439593200000, 90.741131015104], [1440198000000, 90.972953986653], [1440802800000, 91.338250790306], [1441407600000, 91.731647348086], [1442012400000, 92.075869336143], [1442617200000, 92.448191078328], [1443222000000, 92.918861959958], [1443826800000, 93.424657534247], [1444431600000, 93.860203723218], [1445036400000, 94.113101510362], [1445641200000, 94.443273621356], [1446249600000, 94.731296101159], [1446854400000, 94.984193888304], [1447459200000, 95.258166491043], [1448064000000, 95.602388479101], [1448668800000, 95.869336143309], [1449273600000, 96.066034422199], [1449878400000, 96.318932209343], [1450483200000, 96.578854935019], [1451088000000, 96.944151738672], [1451692800000, 97.190024587285], [1452297600000, 97.499121882684], [1452902400000, 97.702845100105], [1453507200000, 97.885493501932], [1454112000000, 98.0330172111], [1454716800000, 98.180540920267], [1455321600000, 98.236740428521], [1455926400000, 98.335089567966], [1456531200000, 98.482613277134], [1457136000000, 98.566912539515], [1457740800000, 98.749560941342], [1458345600000, 98.981383912891], [1458950400000, 99.114857744995], [1459551600000, 99.164032314717], [1460156400000, 99.227256761503], [1460761200000, 99.283456269758], [1461366000000, 99.304531085353], [1461970800000, 99.346680716544], [1462575600000, 99.388830347735], [1463180400000, 99.445029855989], [1463785200000, 99.494204425711], [1464390000000, 99.543378995434], [1464994800000, 99.592553565156], [1465599600000, 99.641728134879], [1466204400000, 99.690902704601], [1466809200000, 99.740077274324], [1467414000000, 99.789251844046], [1468018800000, 99.838426413769], [1468623600000, 99.929750614682], [1469228400000, 100], [1469833200000, 100], [1470438000000, 100], [1471042800000, 100], [1471647600000, 100], [1472252400000, 100], [1472857200000, 100], [1473462000000, 100], [1474066800000, 100]";
    // $scope.d0_2 = [ [0,4],[1,4.5],[2,7],[3,4.5],[4,3],[5,3.5],[6,6],[7,3],[8,4],[9,3] ];


    $scope.openAddRFIToNetworkModal = function(){
      Networks.get({
        id:$stateParams.id
      })
      .$promise.then(function(res) {
        $scope.networks = res.data
        var modalInstance = $modal.open({
          templateUrl: 'tpl/modal_add_rfi.html',
          controller: 'AddRFIToNetworkModal',
          resolve: {
            networks: function () {
              return $scope.networks;
            }
          }
        });
        modalInstance.result.then(function (newRFI) {
          newRFI._id = $stateParams.id;
          ProjectRFIs.save(newRFI,function(u, putResponseHeaders) {
            toaster.pop('success', 'User added', '.');
            $scope.getProjectRFIs();
          });
        }, function () {
        });
      });
    }

    $scope.openAddUserToNetworkModal = function () {
      $http.get('http://178.62.117.241/projects/'+ $stateParams.id +'/potential-users')
      .then(function(resp){
        $scope.potentialUsers = resp.data.data;
        var modalInstance = $modal.open({
          templateUrl: 'tpl/modal_add_user_to_network.html',
          controller: 'AddUserToNetworkModal',
          resolve: {
            potentialUsers: function () {
              return $scope.potentialUsers;
            }
          }
        });

        modalInstance.result.then(function (selectedUsers) {
          console.log(selectedUsers);
          ProjectUsers.save({"_id":$stateParams.id,"users":selectedUsers},function(u, putResponseHeaders) {
            toaster.pop('success', 'User added', '');
            setTimeout(function(){
            }, 1500);
          });
        }, function () {
        });
      });
    };

  }])
  .controller('ProjectViewGanttController', ['$scope', '$stateParams','Auth', 'Project', 'ProjectGantt',
    function($scope,$stateParams,Auth,Project,ProjectGantt) {

    $scope.gantt_data = {
      'data':[],
      'links':[]
    };

    var link, dataNode;

    Project.get({id:$stateParams.id})
    .$promise.then(function(res) {
      $scope.project = res.data;
      console.log('-- project:');
      console.log($scope.project);
    });

    ProjectGantt.get({id:$stateParams.id})
    .$promise.then(function(res) {
      $scope.gantt_data_raw = res.data;
      console.log('-- gantt data:');
      console.log($scope.gantt_data_raw);

      for (var i = 0; i < $scope.gantt_data_raw.gantt_data.length; i++){
        var type;
        var start_date = $scope.gantt_data_raw.gantt_data[i].start_date.substring(8,10) + "-" +
        $scope.gantt_data_raw.gantt_data[i].start_date.substring(5,7) + "-" +
        $scope.gantt_data_raw.gantt_data[i].start_date.substring(0,4);
        console.log(start_date);
        if(!$scope.gantt_data_raw.gantt_data[i].is_leaf){
          type = gantt.config.types.task;
        } else {
          type = gantt.config.types.project;
        }
        dataNode = {
                "id": $scope.gantt_data_raw.gantt_data[i].id,
                "text": $scope.gantt_data_raw.gantt_data[i].name,
                "start_date": start_date,
                "duration": $scope.gantt_data_raw.gantt_data[i].duration,
                "parent":  $scope.gantt_data_raw.gantt_data[i].parent_id,
                "type": type
              }
        $scope.gantt_data.data.push(dataNode);
      }

      for (var j = 0; j < $scope.gantt_data_raw.dependencies.length; j++){
        link = {
                "id": j,
                "source": $scope.gantt_data_raw.dependencies[j].source,
                "target":  $scope.gantt_data_raw.dependencies[j].target,
                "type":  $scope.gantt_data_raw.dependencies[j].type
              }
        $scope.gantt_data.links.push(link);
      }

      console.log('ganta data');
      console.log($scope.gantt_data)
      gantt.parse($scope.gantt_data);

    });

  }])
  .controller('NodeViewController', ['$scope', '$stateParams','Auth', 'Node', 'NodePermits', 'NodeLongLeads', 'NodeUsers', 'NodeAudit',
    function($scope,$stateParams,Auth,Node,NodePermits,NodeLongLeads,NodeUsers,NodeAudit) {

    console.log('nodeviewcontr')
    Node.get({id:$stateParams.id})
    .$promise.then(function(res) {
      $scope.node = res.data;
      console.log('-- node:');
      console.log($scope.node);
      if ($scope.node.is_leaf){
        // get users / permits / audit / longleads

        NodeUsers.get({
          id:$stateParams.id
        })
        .$promise.then(function(res) {
            // success handler
          $scope.nodeUsers = res.data
          console.log('-- nodeUsers');
          console.log(res.data);
        });

        NodeLongLeads.get({
          id:$stateParams.id
        })
        .$promise.then(function(res) {
            // success handler
          $scope.nodeLongLeads = res.data
          console.log('-- nodeLongLeads');
          console.log(res.data);
        });

        NodePermits.get({
          id:$stateParams.id
        })
        .$promise.then(function(res) {
            // success handler
          $scope.nodePermits = res.data
          console.log('-- nodePermits');
          console.log(res.data);
        });

        NodeAudit.get({
          id:$stateParams.id
        })
        .$promise.then(function(res) {
            // success handler
          $scope.nodeAudit = res.data
          console.log('-- nodeAudits');
          console.log(res.data);
        });

      }
    });

  }])
  .controller('ProjectNetworkCreateController', ['$scope', '$stateParams','Auth', 'Project', 'ProjectNetworks',
    function($scope,$stateParams,Auth,Project,ProjectNetworks){

      Project.get({id:$stateParams.id})
      .$promise.then(function(res) {
        $scope.project = res.data;
        console.log('-- project project');
        console.log($scope.project);
      });

      $scope.projectNetwork = new ProjectNetworks();

      $scope.addProjectNetwork=function(){
          $scope.projectNetwork.$save(function(){
              $state.go('projectNetwork');
          });
      }

  }])
  // -- Projects Controllers -- END

  // bootstrap controller
  .controller('AccordionDemoCtrl', ['$scope', function($scope) {
    $scope.oneAtATime = true;

    $scope.groups = [
      {
        title: 'Accordion group header - #1',
        content: 'Dynamic group body - #1'
      },
      {
        title: 'Accordion group header - #2',
        content: 'Dynamic group body - #2'
      }
    ];

    $scope.items = ['Item 1', 'Item 2', 'Item 3'];

    $scope.addItem = function() {
      var newItemNo = $scope.items.length + 1;
      $scope.items.push('Item ' + newItemNo);
    };

    $scope.status = {
      isFirstOpen: true,
      isFirstDisabled: false
    };
  }])
  .controller('AlertDemoCtrl', ['$scope', function($scope) {
    $scope.alerts = [
      { type: 'success', msg: 'Well done! You successfully read this important alert message.' },
      { type: 'info', msg: 'Heads up! This alert needs your attention, but it is not super important.' },
      { type: 'warning', msg: 'Warning! Best check yo self, you are not looking too good...' }
    ];

    $scope.addAlert = function() {
      $scope.alerts.push({type: 'danger', msg: 'Oh snap! Change a few things up and try submitting again.'});
    };

    $scope.closeAlert = function(index) {
      $scope.alerts.splice(index, 1);
    };
  }])
  .controller('ButtonsDemoCtrl', ['$scope', function($scope) {
    $scope.singleModel = 1;

    $scope.radioModel = 'Middle';

    $scope.checkModel = {
      left: false,
      middle: true,
      right: false
    };
  }])
  .controller('CarouselDemoCtrl', ['$scope', function($scope) {
    $scope.myInterval = 5000;
    var slides = $scope.slides = [];
    $scope.addSlide = function() {
      slides.push({
        image: 'img/c' + slides.length + '.jpg',
        text: ['Carousel text #0','Carousel text #1','Carousel text #2','Carousel text #3'][slides.length % 4]
      });
    };
    for (var i=0; i<4; i++) {
      $scope.addSlide();
    }
  }])
  .controller('DropdownDemoCtrl', ['$scope', function($scope) {
    $scope.items = [
      'The first choice!',
      'And another choice for you.',
      'but wait! A third!'
    ];

    $scope.status = {
      isopen: false
    };

    $scope.toggled = function(open) {
      //console.log('Dropdown is now: ', open);
    };

    $scope.toggleDropdown = function($event) {
      $event.preventDefault();
      $event.stopPropagation();
      $scope.status.isopen = !$scope.status.isopen;
    };
  }])
  .controller('ModalInstanceCtrl', ['$scope', '$modalInstance', 'items', function($scope, $modalInstance, items) {
    $scope.items = items;
    $scope.selected = {
      item: $scope.items[0]
    };

    $scope.ok = function () {
      $modalInstance.close($scope.selected.item);
    };

    $scope.cancel = function () {
      $modalInstance.dismiss('cancel');
    };
  }])
  .controller('AddUserToNetworkModal', ['$scope', '$modalInstance', 'potentialUsers',  function($scope, $modalInstance, potentialUsers) {
    $scope.potentialUsers = potentialUsers;
    $scope.selectedUsers = [];

    $scope.ok = function () {
      $modalInstance.close($scope.selectedUsers);
    };

    $scope.cancel = function () {
      $modalInstance.dismiss('cancel');
    };
  }])
  .controller('AddRFIToNetworkModal', ['$scope', '$modalInstance', 'networks',  function($scope, $modalInstance, networks) {
    $scope.networks = networks;
    $scope.selectedUsers = [];
    $scope.newRFI = {};

    $scope.ok = function () {
      $scope.newRFI.requesting_network_id = $scope.requestingNetwork.id;
      $scope.newRFI.responding_network_id = $scope.respondingNetwork.id;
      $modalInstance.close($scope.newRFI);
    };

    $scope.cancel = function () {
      $modalInstance.dismiss('cancel');
    };
  }])
  .controller('ModalRFICtrl', ['$scope', '$modal', '$log', function($scope, $modal, $log) {
    $scope.items = ['rfi1', 'rfi2', 'rfi3'];
    $scope.open = function (size, templateUrl) {
      var modalInstance = $modal.open({
        templateUrl: templateUrl,
        controller: 'ModalInstanceCtrl',
        size: size,
        resolve: {
          items: function () {
            return $scope.items;
          }
        }
      });

      modalInstance.result.then(function (selectedItem) {
        $scope.selected = selectedItem;
      }, function () {
        $log.info('Modal dismissed at: ' + new Date());
      });
    };
  }])
  .controller('ModalPermitCtrl', ['$scope', '$modal', '$log', 'ProjectPermits', function($scope, $modal, $log, ProjectPermits) {
    $scope.items = ['permit1', 'permit2', 'permit3'];
    $scope.open = function (size) {
      var modalInstance = $modal.open({
        templateUrl: 'permitEditModalContent.html',
        controller: 'ModalInstanceCtrl',
        size: size,
        resolve: {
          items: function () {
            return $scope.items;
          }
        }
      });

      modalInstance.result.then(function (selectedItem) {
        $scope.selected = selectedItem;
      }, function () {
        $log.info('Modal dismissed at: ' + new Date());
      });
    };
    $scope.newPermit = new ProjectPermits();
    $scope.newPermit.name = "Big New Project";
    $scope.newPermit.lat = 1.1;
    $scope.newPermit.lng = 2.2;
    $scope.newPermit.client_name = "JCB";

    $scope.create = function() {
      console.log($scope.newPermit);
      toaster.pop('wait', 'Saving Permit', 'Shouldn\'t take long...');
      $scope.newPermit.$save(
        function(data){
          console.log(JSON.stringify(data));
          if(!data.result){
            toaster.pop('error', 'Error', '');
          }else{
            toaster.pop('success', 'Success', '');
            setTimeout(function(){
              // $state.go('app.page.projects');
            }, 1500);
          }
      });
    };
  }])
  .controller('PaginationDemoCtrl', ['$scope', '$log', function($scope, $log) {
    $scope.totalItems = 64;
    $scope.currentPage = 4;

    $scope.setPage = function (pageNo) {
      $scope.currentPage = pageNo;
    };

    $scope.pageChanged = function() {
      $log.info('Page changed to: ' + $scope.currentPage);
    };

    $scope.maxSize = 5;
    $scope.bigTotalItems = 175;
    $scope.bigCurrentPage = 1;
  }])
  .controller('PopoverDemoCtrl', ['$scope', function($scope) {
    $scope.dynamicPopover = 'Hello, World!';
    $scope.dynamicPopoverTitle = 'Title';
  }])
  .controller('ProgressDemoCtrl', ['$scope', function($scope) {
    $scope.max = 200;

    $scope.random = function() {
      var value = Math.floor((Math.random() * 100) + 1);
      var type;

      if (value < 25) {
        type = 'success';
      } else if (value < 50) {
        type = 'info';
      } else if (value < 75) {
        type = 'warning';
      } else {
        type = 'danger';
      }

      $scope.showWarning = (type === 'danger' || type === 'warning');

      $scope.dynamic = value;
      $scope.type = type;
    };
    $scope.random();

    $scope.randomStacked = function() {
      $scope.stacked = [];
      var types = ['success', 'info', 'warning', 'danger'];

      for (var i = 0, n = Math.floor((Math.random() * 4) + 1); i < n; i++) {
          var index = Math.floor((Math.random() * 4));
          $scope.stacked.push({
            value: Math.floor((Math.random() * 30) + 1),
            type: types[index]
          });
      }
    };
    $scope.randomStacked();
  }])
  .controller('TabsDemoCtrl', ['$scope', function($scope) {
    $scope.tabs = [
      { title:'Dynamic Title 1', content:'Dynamic content 1' },
      { title:'Dynamic Title 2', content:'Dynamic content 2', disabled: true }
    ];
  }])
  .controller('RatingDemoCtrl', ['$scope', function($scope) {
    $scope.rate = 7;
    $scope.max = 10;
    $scope.isReadonly = false;

    $scope.hoveringOver = function(value) {
      $scope.overStar = value;
      $scope.percent = 100 * (value / $scope.max);
    };
  }])
  .controller('TooltipDemoCtrl', ['$scope', function($scope) {
    $scope.dynamicTooltip = 'Hello, World!';
    $scope.dynamicTooltipText = 'dynamic';
    $scope.htmlTooltip = 'I\'ve been made <b>bold</b>!';
  }])
  .controller('TypeaheadDemoCtrl', ['$scope', '$http', function($scope, $http) {
    $scope.selected = undefined;
    $scope.states = ['Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey', 'New Mexico', 'New York', 'North Dakota', 'North Carolina', 'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'];
    // Any function returning a promise object can be used to load values asynchronously
    $scope.getLocation = function(val) {
      return $http.get('http://maps.googleapis.com/maps/api/geocode/json', {
        params: {
          address: val,
          sensor: false
        }
      }).then(function(res){
        var addresses = [];
        angular.forEach(res.data.results, function(item){
          addresses.push(item.formatted_address);
        });
        return addresses;
      });
    };
  }])
  .controller('DatepickerDemoCtrl', ['$scope', function($scope) {
    $scope.today = function() {
      $scope.dt = new Date();
    };
    $scope.today();

    $scope.clear = function () {
      $scope.dt = null;
    };

    // Disable weekend selection
    $scope.disabled = function(date, mode) {
      return ( mode === 'day' && ( date.getDay() === 0 || date.getDay() === 6 ) );
    };

    $scope.toggleMin = function() {
      $scope.minDate = $scope.minDate ? null : new Date();
    };
    $scope.toggleMin();

    $scope.open = function($event) {
      $event.preventDefault();
      $event.stopPropagation();

      $scope.opened = true;
    };

    $scope.dateOptions = {
      formatYear: 'yy',
      startingDay: 1,
      class: 'datepicker'
    };

    $scope.initDate = new Date('2016-15-20');
    $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
    $scope.format = $scope.formats[0];
  }])
  .controller('TimepickerDemoCtrl', ['$scope', function($scope) {
    $scope.mytime = new Date();

    $scope.hstep = 1;
    $scope.mstep = 15;

    $scope.options = {
      hstep: [1, 2, 3],
      mstep: [1, 5, 10, 15, 25, 30]
    };

    $scope.ismeridian = true;
    $scope.toggleMode = function() {
      $scope.ismeridian = ! $scope.ismeridian;
    };

    $scope.update = function() {
      var d = new Date();
      d.setHours( 14 );
      d.setMinutes( 0 );
      $scope.mytime = d;
    };

    $scope.changed = function () {
      //console.log('Time changed to: ' + $scope.mytime);
    };

    $scope.clear = function() {
      $scope.mytime = null;
    };
  }])

  // Form controller
  .controller('FormDemoCtrl', ['$scope', function($scope) {
    $scope.notBlackListed = function(value) {
      var blacklist = ['bad@domain.com','verybad@domain.com'];
      return blacklist.indexOf(value) === -1;
    }

    $scope.val = 15;
    var updateModel = function(val){
      $scope.$apply(function(){
        $scope.val = val;
      });
    };
    angular.element("#slider").on('slideStop', function(data){
      updateModel(data.value);
    });

    $scope.select2Number = [
      {text:'First',  value:'One'},
      {text:'Second', value:'Two'},
      {text:'Third',  value:'Three'}
    ];

    $scope.list_of_string = ['tag1', 'tag2']
    $scope.select2Options = {
        'multiple': true,
        'simple_tags': true,
        'tags': ['tag1', 'tag2', 'tag3', 'tag4']  // Can be empty list.
    };

  }])

  // Flot Chart controller
  .controller('FlotChartDemoCtrl', ['$scope', function($scope) {

  }])

  // jVectorMap controller
  .controller('JVectorMapDemoCtrl', ['$scope', function($scope) {
    $scope.world_markers = [
      {latLng: [41.90, 12.45], name: 'Vatican City'},
      {latLng: [43.73, 7.41], name: 'Monaco'},
      {latLng: [-0.52, 166.93], name: 'Nauru'},
      {latLng: [-8.51, 179.21], name: 'Tuvalu'},
      {latLng: [43.93, 12.46], name: 'San Marino'},
      {latLng: [47.14, 9.52], name: 'Liechtenstein'},
      {latLng: [7.11, 171.06], name: 'Marshall Islands'},
      {latLng: [17.3, -62.73], name: 'Saint Kitts and Nevis'},
      {latLng: [3.2, 73.22], name: 'Maldives'},
      {latLng: [35.88, 14.5], name: 'Malta'},
      {latLng: [12.05, -61.75], name: 'Grenada'},
      {latLng: [13.16, -61.23], name: 'Saint Vincent and the Grenadines'},
      {latLng: [13.16, -59.55], name: 'Barbados'},
      {latLng: [17.11, -61.85], name: 'Antigua and Barbuda'},
      {latLng: [-4.61, 55.45], name: 'Seychelles'},
      {latLng: [7.35, 134.46], name: 'Palau'},
      {latLng: [42.5, 1.51], name: 'Andorra'},
      {latLng: [14.01, -60.98], name: 'Saint Lucia'},
      {latLng: [6.91, 158.18], name: 'Federated States of Micronesia'},
      {latLng: [1.3, 103.8], name: 'Singapore'},
      {latLng: [1.46, 173.03], name: 'Kiribati'},
      {latLng: [-21.13, -175.2], name: 'Tonga'},
      {latLng: [15.3, -61.38], name: 'Dominica'},
      {latLng: [-20.2, 57.5], name: 'Mauritius'},
      {latLng: [26.02, 50.55], name: 'Bahrain'},
      {latLng: [0.33, 6.73], name: 'São Tomé and Príncipe'}
    ];

    $scope.usa_markers = [
      {latLng: [40.71, -74.00], name: 'New York'},
      {latLng: [34.05, -118.24], name: 'Los Angeles'},
      {latLng: [41.87, -87.62], name: 'Chicago'},
      {latLng: [29.76, -95.36], name: 'Houston'},
      {latLng: [39.95, -75.16], name: 'Philadelphia'},
      {latLng: [38.90, -77.03], name: 'Washington'},
      {latLng: [37.36, -122.03], name: 'Silicon Valley'}
    ];
  }])

  // signin controller
  .controller('SigninFormController', ['$scope', '$http', '$state','Auth', function($scope, $http, $state, Auth) {
    $scope.user = {};
    $scope.authError = null;
    Auth.clearCredentials();
    console.log(Auth.clearCredentials());

    $scope.login = function() {
      $scope.authError = null;
      // Try to login
      $http.post('http://178.62.117.241/auth', {
        headers: {'Authorization': 'Basic amVtaW1hLnNjb3R0QGZha2VyZW1haWwuY29tOnRlc3QxMjM0'},
        email: $scope.user.email,
        password: $scope.user.password})
      .then(function(response) {
        if ( response.status === 200 ) {
          // user logged in
          Auth.setCredentials($scope.user.email,$scope.user.password);
          $state.go('app.dashboard-v1');
        }else{
          $scope.authError = 'Email or Password not right';
        }
      }, function(response) {
        if ( response.status === 403 ) {
          $scope.authError = 'Email or Password not right';
        } else {
          $scope.authError = 'Server Error';
        }
      });
    };
  }])

  // signup controller
  .controller('SignupFormController', ['$scope', '$http', '$state', function($scope, $http, $state) {
    $scope.user = {};
    $scope.authError = null;
    $scope.signup = function() {
      alert("signup!");
      $scope.authError = null;
      // Try to create
      $http.post('api/signup', {name: $scope.user.name, email: $scope.user.email, password: $scope.user.password})
      .then(function(response) {
        if ( !response.data.user ) {
          $scope.authError = response;
        }else{
          $state.go('app.dashboard-v1');
        }
      }, function(x) {
        $scope.authError = 'Server Error';
      });
    };
  }])
  // tab controller
  .controller('CustomTabController', ['$scope', function($scope) {
    $scope.tabs = [true, false, false];
    $scope.tab = function(index){
      angular.forEach($scope.tabs, function(i, v) {
        $scope.tabs[v] = false;
      });
      $scope.tabs[index] = true;
    }
  }])
 ;