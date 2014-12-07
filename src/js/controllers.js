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

.controller('ProjectViewController', [
  '$scope',
  '$stateParams',
  'Auth',
  'Project',
  'ProjectUsers',
  'ProjectRFIs',
  'ProjectLongLeads',
  'ProjectNetworks',
  'ProjectLeaves',
  'ProjectPermits',
  'ProjectProgressPlot',
  'ProjectAudit',
  'Networks',
  '$modal',
  '$http',
  'toaster',
  'LongLeads',
  'Permits',
  function(
    $scope,
    $stateParams,
    Auth,
    Project,
    ProjectUsers,
    ProjectRFIs,
    ProjectLongLeads,
    ProjectNetworks,
    ProjectLeaves,
    ProjectPermits,
    ProjectProgressPlot,
    ProjectAudit,
    Networks,
    $modal,
    $http,
    toaster,
    LongLeads,
    Permits
    ) {

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
        userId: userId
      })
      .$promise.then(function(res) {
        toaster.pop('success', 'User deleted', '.');
        $scope.getProjectUsers();
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
            $scope.getProjectUsers();
          });
        }, function () {
        });
      });
    };

    $scope.openViewLongLeadModal = function (longleadIndex) {
      var longleadId = $scope.projectLongLeads[longleadIndex].id;
      $http.get('http://178.62.117.241/long-leads/'+longleadId+'/audit').then(function (resp) {
        $scope.longleadAudit = resp.data.data;
        var modalInstance = $modal.open({
          templateUrl: 'tpl/modal_longlead.html',
          controller: 'ViewLongLeadModal',
          resolve: {
            longleadItem: function () {
              return $scope.projectLongLeads[longleadIndex];
            },
            longleadAudit: function () {
              return $scope.longleadAudit;
            },
          }
        });
      });
    };

    $scope.openViewPermitModal = function (permitIndex) {
      var permitId = $scope.projectPermits[permitIndex].id;
      $http.get('http://178.62.117.241/permits/'+permitId+'/audit').then(function (resp) {
        console.log(resp )
        $scope.permitAudit = resp.data.data;
        var modalInstance = $modal.open({
          templateUrl: 'tpl/modal_permit.html',
          controller: 'ViewPermitModal',
          resolve: {
            permitItem: function () {
              return $scope.projectPermits[permitIndex];
            },
            permitAudit: function () {
              return $scope.permitAudit;
            },
          }
        });
      });
    };

    $scope.deleteLongLead = function (longLeadId,longLeadName) {
      var r = confirm("Are you sure you want to delete " + longLeadName + "?");
      if (r == true) {
        LongLeads.delete({
          id: longLeadId
        })
        .$promise.then(function(res) {
          $scope.getProjectLongLeads();
        });
      }
    };

    $scope.deletePermit = function (permitId,permitName) {
      var r = confirm("Are you sure you want to delete " + permitName + "?");
      if (r == true) {
        Permits.delete({
          id: permitId
        })
        .$promise.then(function(res) {
          $scope.getProjectPermits();
        });
      }
    };
  }])
.controller('ProjectViewGanttController', ['$scope', '$stateParams','Auth', 'Project', 'ProjectGantt',
  function($scope,$stateParams,Auth,Project,ProjectGantt) {

    $scope.gantt_data = {
      'data':[],
      'links':[]
    };

    var link, dataNode;


    ProjectGantt.get({id:$stateParams.id})
    .$promise.then(function(res) {
      $scope.project = res.data.project;
      $scope.gantt_data_raw = res.data;
      console.log('-- gantt data:');
      console.log($scope.gantt_data_raw);

      for (var i = 0; i < $scope.gantt_data_raw.data.length; i++){
        var type;
        var start_date = $scope.gantt_data_raw.data[i].start_date.substring(8,10) + "-" +
        $scope.gantt_data_raw.data[i].start_date.substring(5,7) + "-" +
        $scope.gantt_data_raw.data[i].start_date.substring(0,4);
        if($scope.gantt_data_raw.data[i].is_leaf){
          type = gantt.config.types.task;
        } else {
          type = gantt.config.types.project;
        }
        dataNode = {
          "id": $scope.gantt_data_raw.data[i].id,
          "text": $scope.gantt_data_raw.data[i].name,
          "start_date": start_date,
          "duration": $scope.gantt_data_raw.data[i].duration,
          "parent":  $scope.gantt_data_raw.data[i].parent_id,
          "type": type
        }
        $scope.gantt_data.data.push(dataNode);
      }

      for (var j = 0; j < $scope.gantt_data_raw.links.length; j++){
        link = {
          "id": j,
          "source": $scope.gantt_data_raw.links[j].source,
          "target":  $scope.gantt_data_raw.links[j].target,
          "type":  $scope.gantt_data_raw.links[j].type
        }
        $scope.gantt_data.links.push(link);
      }
      console.log('ganta data');
      console.log($scope.gantt_data)
      gantt.parse($scope.gantt_data);

      gantt_data = $scope.gantt_data.data;

    });

gantt.attachEvent("onAfterTaskUpdate", function(id,item){
  $scope.updateProgressGantt();
  $scope.updatingProjectGantt = true;
});
gantt.attachEvent("onAfterTaskDrag", function(id, mode, e){
  $scope.updateProgressGantt();
  $scope.updatingProjectGantt = true;
});
gantt.attachEvent("onAfterTaskDelete", function(id,item){
  $scope.updateProgressGantt();
  $scope.updatingProjectGantt = true;
});
gantt.attachEvent("onAfterTaskAdd", function(id,item){
  $scope.updateProgressGantt();
  $scope.updatingProjectGantt = true;
});
gantt.attachEvent("onAfterLinkUpdate", function(id,item){
  $scope.updateProgressGantt();
  $scope.updatingProjectGantt = true;
});
gantt.attachEvent("onAfterLinkDelete", function(id,item){
  $scope.updateProgressGantt();
  $scope.updatingProjectGantt = true;
});
gantt.attachEvent("onAfterLinkAdd", function(id,item){
  $scope.updateProgressGantt();
  $scope.updatingProjectGantt = true;
});

$scope.updatingProjectGantt = false;

$scope.updateProgressGantt = function(){
  if (!$scope.updatingProjectGantt){
    var data = gantt.serialize();
    console.log($stateParams.id);
    ProjectGantt.save({_id:$stateParams.id, data: data.data, links: data.links},function(u, putResponseHeaders) {
      $scope.updatingProjectGantt = false;
      toaster.pop('success', 'Gantt update', '');
      console.log('updated!');
    });
        // in case POST failed, enable it again
        setTimeout(function(){
          $scope.updatingProjectGantt = false;
        },3000);
      }
    }

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
  .controller('ViewLongLeadModal', ['$scope', '$modalInstance', 'longleadItem', 'longleadAudit', function($scope, $modalInstance, longleadItem, longleadAudit) {
    $scope.longleadItem = longleadItem;
    $scope.longleadAudit = longleadAudit;
    $scope.hideAudit = true;

    $scope.showAudit = function () {
      $scope.hideAudit = false;
    };

    $scope.ok = function () {
      $modalInstance.close();
    };

    $scope.cancel = function () {
      $modalInstance.dismiss('cancel');
    };
  }])
  .controller('ViewPermitModal', ['$scope', '$modalInstance', 'permitItem', 'permitAudit',  function($scope, $modalInstance, permitItem, permitAudit) {
    $scope.permit = permitItem;
    $scope.permitAudit = permitAudit;
    $scope.hideAudit = true;

    $scope.showAudit = function () {
    $scope.hideAudit = false;
    };

    $scope.ok = function () {
      $modalInstance.close();
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
  .controller('HomepageController', ['$scope', 'UserHomepage', function($scope, UserHomepage) {

    $scope.init = function(){
      console.log('qwe');

      UserHomepage.get({
      })
      .$promise.then(function(res) {
        console.log(res);
        $scope.homepageData = res.data
      });

    }

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