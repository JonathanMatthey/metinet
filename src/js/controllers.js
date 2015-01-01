'use strict';

/* Controllers */

angular.module('app.controllers', ['pascalprecht.translate', 'ngCookies'])
.controller('AppCtrl', ['$scope', '$translate', '$localStorage', '$window',
  function(   $scope,   $translate,   $localStorage,   $window ) {
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
          navbarCollapseColor: 'bg-white',
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
  .controller('MessagesListController', ['$scope', '$state', '$window', '$http', 'Auth', 'Conversations', function($scope,$state,$window,$http,Auth,Conversations) {
    $scope.conversations = {}

    $scope.init = function(){
      $scope.getConversations();

      $http.get('http://api.metinet.co/conversations/latest').then(function (resp) {
        console.log('resp ')
        console.log(resp )
      });

      $http.get('http://api.metinet.co/conversations/recipients').then(function (resp) {
        console.log('resp ')
        console.log(resp )
      });
    }

    $scope.getConversations = function(){
      $scope.conversations = Conversations.query();
    }

  }])

  .controller('HeaderController', ['$scope', '$state', '$window', '$http', 'Auth', function($scope,$state,$window,$http,Auth) {
    $scope.user_data = Auth.getCredential('user_data');
    $scope.init = function(){
    }

  }])

  .controller('ProjectSettingsController', ['$scope', '$state', '$window', 'Auth', '$http', 'toaster', function($scope,$state,$window,Auth,$http,toaster) {
    $scope.profile = {};

    $scope.currentUserId = Auth.getCredential("userid");

    $http.get('http://api.metinet.co/profiles/' + $scope.currentUserId).then(function (resp) {
      $scope.profile = resp.data.data;
    });

    $scope.saveProfile = function(){
      toaster.pop('wait', 'Saving Profile', 'Shouldn\'t take long...');
      $http.put('http://api.metinet.co/profiles',$scope.profile)
      .then(function(response) {
        console.log('qweqweqwe');
        toaster.pop('success', 'Success', '');
      });
    };
  }])

	.controller('ProjectListController', [	'$scope',
											'$document',
											'$state',
											'$window',
											'Project', 	function(	$scope,
																	$document,
																	$state,
																	$window,
																	Project 	) {
		Project.query().$promise
			.then(function(res) {
				$scope.projects = res;
			});
	}])

  .controller('ProjectCreateController', ['$scope', '$state', '$window', '$http', 'Auth', 'Project', 'moment', 'toaster', function($scope,$state,$window,$http,Auth,Project,moment,toaster) {
    $scope.project 						= new Project();
    $scope.projectCountry 				= {};
    $scope.project.name 				= "Big New Project";
    $scope.project.lat 					= 1.1;
    $scope.project.lng 					= 2.2;
    $scope.project.client_name 			= "JCB";
    $scope.project.contractor_name 		= "Mr Contractor";
    $scope.project.consultant_name 		= "Mrs Consultant";
    $scope.project.start_date 			= new moment().format("DD-MMMM-YYYY");//new moment().format("YYYY-MM-DD 00:00:00");
    $scope.project.end_date_contract 	= new moment().add(6, 'M').format("DD-MMMM-YYYY");
    $scope.project.progress_reports 	= true;
    $scope.project.long_lead_items 		= true;
    $scope.project.risk_assessment 		= true;
    $scope.project.permit_assessment 	= true;
    $scope.project.cost_management 		= true;
    $scope.project.terms 				= true;

    $http.get('http://api.metinet.co/countries').then(function (resp) {
      $scope.countries = resp.data.data;
      console.log('$scope.countries ')
      console.log($scope.countries )
      $scope.projectCountry = $scope.countries[1];
    });

    $http.get('http://api.metinet.co/currencies').then(function (resp) {
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

    $scope.project_id       = $stateParams.id;
    $scope.user_action      = $stateParams.action;
    $scope.settings_action  = 'location';
    $scope.newProjectRFI    = ProjectRFIs();

    $scope.project_general  = {};
    $scope.map              = { center: { latitude: 45, longitude: -73 }, zoom: 8 };

    $scope.init = function() {
		$scope.getProject();
		$scope.getProjectAudit();
		$scope.getProjectTodos();
		$scope.getProjectProgressPlot();
		$scope.getProjectNetworks();
		$scope.getProjectUsers();
		$scope.getProjectRFIs();
		if ($scope.project.long_lead_items) {
			$scope.getProjectLongLeads();
		}
		if ($scope.project.permit_assessment) {
			$scope.getProjectPermits();
		}
    }

    $scope.changeAction = function(value) {
		$scope.user_action = value;
		if (value == 'overview') {
			$scope.refreshOverviewFlot();
		}
    }

    $scope.changeSettingsAction = function(value) {
      $scope.settings_action = value;
    }

  	$scope.refreshOverviewFlot = function(){
  		console.log("refreshing_plot");
  	}

    $scope.getProject = function(){
		Project.get({id:$stateParams.id})
			.$promise.then(function(res) {
				$scope.project 								            = res.data;

				$scope.project_general.name 				      = res.data.name;
				$scope.project_general.desc 				      = res.data.desc;
				$scope.project_general.start_date 			  = res.data.start_date;
				$scope.project_general.end_date_contract 	= res.data.end_date_contract;
				$scope.project_general.client_id 			    = res.data.client.id;
				$scope.project_general.contractor_id 		  = res.data.contractor.id;
				$scope.project_general.consultant_id 		  = res.data.consultant.id;
			});
    }

    $scope.getProjectUsers = function(){
      ProjectUsers.get({
        id:$stateParams.id
      })
      .$promise.then(function(res) {
        // success handler
        $scope.projectUsers = res.data
      });
    }

    $scope.deleteUser = function (userIndex) {
      console.log(userIndex)
      var user = $scope.projectUsers[userIndex];
      var r = confirm("Are you sure you want to delete " + user.fullname + "?");
      if (r == true) {
        ProjectUsers.delete({
          id:$stateParams.id,
          userId: user.id
        })
        .$promise.then(function(res) {
          toaster.pop('success', 'User deleted', '.');
          $scope.getProjectUsers();
        });
      }
    }

    $scope.getProjectAudit = function(){
      ProjectAudit.get({
        id:$stateParams.id
      })
      .$promise.then(function(res) {
        // success handler
        $scope.projectAudit = res.data
      });
    }

    $scope.getProjectRFIs = function(){
      ProjectRFIs.get({
        id:$stateParams.id
      })
      .$promise.then(function(res) {
        // success handler
        $scope.projectRFIs = res.data;
      });
    }

    $scope.getProjectNetworks = function(){
      ProjectNetworks.get({
        id:$stateParams.id
      })
      .$promise.then(function(res) {
        // success handler
        $scope.projectNetworks = res.data
      });
    }

    $scope.getProjectTodos = function(){
      $http.get('http://api.metinet.co/projects/'+$stateParams.id+"/to-do").then(function (resp) {
        $scope.projectTodo = resp.data.data;
      });
    }

    $scope.getProjectLongLeads = function(){
      ProjectLongLeads.get({
        id:$stateParams.id
      })
      .$promise.then(function(res) {
        // success handler
        $scope.projectLongLeads = res.data
      });
    }

    $scope.getProjectPermits = function(){
      ProjectPermits.get({
        id:$stateParams.id
      })
      .$promise.then(function(res) {
        // success handler
        $scope.projectPermits = res.data
      });
    }

    $scope.getProjectProgressPlot = function(){
      ProjectProgressPlot.get({
        id:$stateParams.id
      })
      .$promise.then(function(res) {
        // success handler
        $scope.projectProgressPlot = res.data;
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
      $http.get('http://api.metinet.co/projects/'+ $stateParams.id +'/potential-users')
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
      $http.get('http://api.metinet.co/long-leads/'+longleadId+'/audit').then(function (resp) {
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
      $http.get('http://api.metinet.co/permits/'+permitId+'/audit').then(function (resp) {
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

    $scope.openEditPermitModal = function(permitIndex){
      var permitId = $scope.projectPermits[permitIndex].id;
      var permit = $scope.projectPermits[permitIndex];
      var modalInstance = $modal.open({
        templateUrl: 'tpl/modal_permit.form.html',
        controller: 'EditPermitModal',
        resolve: {
          permit: function () {
            return permit;
          }
        }
      });

      modalInstance.result.then(function (permit) {
        // permit._id = $stateParams.id;
        console.log(permit);
        Permits.save(permit,function(u, putResponseHeaders) {
          toaster.pop('success', 'Permit saved', '.');
          $scope.getNodePermits();
        });
      }, function () {
      });
    }

    $scope.openEditLongLeadModal = function(longleadIndex){
      var longleadId = $scope.projectLongLeads[longleadIndex].id;
      var longlead = $scope.projectLongLeads[longleadIndex];
      var modalInstance = $modal.open({
        templateUrl: 'tpl/modal_longlead.form.html',
        controller: 'AddLongLeadModal',
        resolve: {
          longlead: function () {
            return longlead;
          }
        }
      });

      modalInstance.result.then(function (longlead) {
        // longlead._id = $stateParams.id;
        console.log(longlead);
        LongLeads.save(longlead,function(u, putResponseHeaders) {
          toaster.pop('success', 'LongLead saved', '.');
          $scope.getNodeLongLeads();
        });
      }, function () {
      });
    }

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
.controller('ProjectViewGanttController', [
  '$scope',
  '$stateParams',
  'Auth',
  'Project',
  'ProjectGantt',
  'Node',
  'toaster',
  'NodeDependencies',
  '$http',
  function(
    $scope,
    $stateParams,
    Auth,
    Project,
    ProjectGantt,
    Node,
    toaster,
    NodeDependencies,
    $http
  ) {

    $scope.gantt_data = {
      'data':[],
      'links':[]
    };

    $scope.projectId = $stateParams.id;

    var link, dataNode;
    ProjectGantt.get({id:$scope.projectId})
    .$promise.then(function(res) {
      $scope.project = res.data.project;
      $scope.gantt_data_raw = res.data;
      console.log('gantt data');
      console.log($scope.gantt_data_raw);

      for (var i = 0; i < $scope.gantt_data_raw.data.length; i++){
        var type;
        // var start_date = $scope.gantt_data_raw.data[i].start_date.substring(8,10) + "-" +
            // $scope.gantt_data_raw.data[i].start_date.substring(5,7) + "-" +
            // $scope.gantt_data_raw.data[i].start_date.substring(0,4);
        if($scope.gantt_data_raw.data[i].is_leaf){
          type = gantt.config.types.task;
        } else {
          type = gantt.config.types.project;
        }

        dataNode = {
          "id": $scope.gantt_data_raw.data[i].id,
          "text": $scope.gantt_data_raw.data[i].name,
          "start_date": $scope.gantt_data_raw.data[i].gantt_start_date,
          "duration": $scope.gantt_data_raw.data[i].duration,
          "parent": $scope.gantt_data_raw.data[i].parent,
          "type": type,
          "progress": (parseInt($scope.gantt_data_raw.data[i].progress,10)/100)
        }
        // if parent node doesnt exist, clear parent field
        if($scope.gantt_data_raw.data[i].parent === null || $scope.gantt_data_raw.data[i].parent === 0){
          delete (dataNode.parent);
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
      console.log($scope.gantt_data);
      $scope.refreshProgressGantt();
      gantt_data = $scope.gantt_data;
    });

    gantt.attachEvent("onAfterTaskUpdate", function(id,item){
      var updatedNode = {}
      console.log(id,item);
      updatedNode.id = item.id;
      updatedNode.name = item.text;
      updatedNode.duration = item.duration;
      updatedNode.progress = ''+(item.progress * 100);
      updatedNode.start_date = moment(item.start_date).format("YYYY-MM-DD 00:00:00");
      updatedNode.end_date = moment(item.end_date).format("YYYY-MM-DD 00:00:00");
      Node.update(updatedNode,function(u, putResponseHeaders) {
        toaster.pop('success', 'Saved', updatedNode.name);
      });
    });
    gantt.attachEvent("onBeforeTaskDelete", function(id,item){
      console.log(id,item);
      var r = confirm("Deleting this task will delete all its Permits and Long Lead items, continue ?");
      if (r == true) {
        Node.delete({id:item.id},function(u, putResponseHeaders) {
          toaster.pop('success', 'Deleted', item.text);
          return true;
        });
      }
      else{
        return false;
      }
    });
    gantt.attachEvent("onTaskOpened", function(id){
      console.log(id);
      var task = _.find($scope.gantt_data.data,{"id":parseInt(id,10)});
      task.open = true;
    });
    gantt.attachEvent("onTaskClosed", function(id){
      console.log(id);
      var task = _.find($scope.gantt_data.data,{"id":parseInt(id,10)});
      task.open = false;
    });
    gantt.attachEvent("onBeforeTaskAdd", function(id,item){
      var newNode = item;
      var parentId = newNode.parent;
      var parentNodeIndex = _.findIndex($scope.gantt_data.data,{"id":parseInt(newNode.parent,10)});
      var parentNode = $scope.gantt_data.data[parentNodeIndex];

      if (parentNode.type === "task"){
        var r = confirm("Creating a new task will convert " + parentNode.text + " into a folder, and lose all links, permits and long leads - continue ?");
        if (r == false) {
          return false;
        }
      }

      parentNode.open = true;
      newNode.duration = 100;
      newNode.parent_id = parseInt(parentId,10);
      newNode.name  = newNode.text;
      parentNode.duration = 100;
      parentNode.type = "project";
      newNode.start_date = parentNode.start_date;

      // save new node
      delete(newNode.id);
      delete(newNode.end_date);
      delete(newNode.text);
      delete(newNode.parent);

      $http.post('http://api.metinet.co/projects/' + $scope.projectId + '/nodes', {
        headers: {'Authorization': 'Basic amVtaW1hLnNjb3R0QGZha2VyZW1haWwuY29tOnRlc3QxMjM0'},
        name: newNode.name,
        start_date: newNode.start_date,
        duration: newNode.duration,
        parent_id: newNode.parent_id
      })
      .then(function(response) {
        var dataNode = {
          "id": response.data.data.id,
          "text": response.data.data.name,
          "start_date": response.data.data.gantt_start_date,
          "duration": response.data.data.duration,
          "parent": response.data.data.parent,
          "type": "task",
          "progress": (parseInt(response.data.data.progress,10)/100)
        };
        $scope.gantt_data.data.push(dataNode);
        gantt.parse($scope.gantt_data);
        console.log('resp',response);
        toaster.pop('success', 'Created new Task', '.');
        if ( response.status === 200 ) {
          // user logged in
        }else{
        }
      }, function(response) {
        if ( response.status === 403 ) {
        } else {
        }
      });

      // loop through links, find links on previous node and delete those
      _.each($scope.gantt_data.links,function(obj, i){
        if(typeof obj !== "undefined" && (obj.source === parseInt(parentId,10) || obj.target === parseInt(newNode.parent,10))){
          delete($scope.gantt_data.links[i]);
          console.log('== start_date', moment(parentNode.start_date).format("DD-MM-YYYY"));
          console.log('== end_date', moment(parentNode.start_date).add(200, 'day').format("DD-MM-YYYY"));
          // var updatedNode = {};
          // updatedNode.id = parentNode.id;
          // updatedNode.type = "project";
          // Node.update(updatedNode,function(u, putResponseHeaders) {
          //   toaster.pop('success', 'Saved', updatedNode.name);
          // });
          // }
        }
      });
      $scope.refreshProgressGantt();
      return true;
      // $scope.refreshProgressGantt();
    });
    gantt.attachEvent("onAfterLinkUpdate", function(id,item){
      console.log(id,item);
      item.node_id = item.source;
      delete(item.id);
      NodeDependencies.save(item,function(u, putResponseHeaders) {
        toaster.pop('success', 'Updated link', '.');
        $scope.refreshProgressGantt();
      });
    });
    gantt.attachEvent("onAfterLinkDelete", function(id,item){
      console.log(id,item);
      NodeDependencies.delete({node_id:item.source,id:item.id},function(u, putResponseHeaders) {
        toaster.pop('success', 'Deleted link', '.');
        $scope.refreshProgressGantt();
      });
    });
    gantt.attachEvent("onAfterLinkAdd", function(id,item){
      console.log(id,item);
      delete(item.id);
      item.node_id = item.source;
      NodeDependencies.save(item,function(u, putResponseHeaders) {
        toaster.pop('success', 'Saved new link', '.');
        $scope.refreshProgressGantt();
      });
    });

    $scope.refreshProgressGantt = function(){
      gantt.parse($scope.gantt_data);
    }

}])
.controller('NodeViewController', [
  '$scope',
  '$stateParams',
  'Auth',
  'Node',
  'NodePermits',
  'NodeLongLeads',
  'NodeUsers',
  'NodeAudit',
  '$modal',
  'LongLeads',
  'toaster',
  function($scope,
    $stateParams,
    Auth,
    Node,
    NodePermits,
    NodeLongLeads,
    NodeUsers,
    NodeAudit,
    $modal,
    LongLeads,
    toaster
    ) {

  	$scope.percent = {
  		progress: 0,
  		projected: 0
  	}

    $scope.options = {
        animate:{
            duration:1000,
            enabled:true
        },
        size: 75,
        barColor: $scope.app.color.black,
        trackColor: $scope.app.color.primary,
        scaleColor: $scope.app.color.black,
        lineWidth: 2,
        lineCap:'circle'
    };

	  $scope.range = {
	    min: 30,
	    max: 60
	  };

    Node.get({id:$stateParams.id})
      .$promise.then(function(res) {
        $scope.node 			= res.data;
				$scope.progress 	= res.data.progress;

				$scope.percent.progress = res.data.progress;
				$scope.percent.projected = res.data.projected_progress;

        var i;
        var sparkline_plot = [];
        for (i = 0; i < res.data.recent_progress.length; i++) {
        	sparkline_plot.push(res.data.recent_progress[i].progress);
        }

        $scope.sparkline_plot = sparkline_plot;

        $('#sparkline').sparkline(	sparkline_plot, {
      																type:'line',
      																barColor:'green',
      																lineWidth: 5
        													});

        if ($scope.node.is_leaf){
          // get users / permits / audit / longleads
          $scope.getNodeAudit();
          $scope.getNodePermits();
          $scope.getNodeLongLeads();
          $scope.getNodeUsers();
        }
      });

    $scope.getNodeAudit = function(){
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

    $scope.getNodePermits = function(){
      NodePermits.get({
        id:$stateParams.id
      })
      .$promise.then(function(res) {
        // success handler
        $scope.nodePermits = res.data
        console.log('-- nodePermits');
        console.log(res.data);
      });
    }

    $scope.getNodeLongLeads = function(){
      NodeLongLeads.get({
        id:$stateParams.id
      })
      .$promise.then(function(res) {
        // success handler
        $scope.nodeLongLeads = res.data
        console.log('-- nodeLongLeads');
        console.log(res.data);
        console.log('$scope.nodeLongLeads.length');
        console.log($scope.nodeLongLeads.length);

      });
    }

    $scope.getNodeUsers = function(){
      NodeUsers.get({
        id:$stateParams.id
      })
      .$promise.then(function(res) {
        // success handler
        $scope.nodeUsers = res.data
        console.log('-- nodeUsers');
        console.log(res.data);
      });
    }

    $scope.openAddLongLeadModal = function(){
      $scope.newLongLead = new NodeLongLeads();
      var modalInstance = $modal.open({
        templateUrl: 'tpl/modal_longlead.form.html',
        controller: 'AddLongLeadModal',
        resolve: {
          longlead: function () {
            return $scope.newLongLead;
          }
        }
      });

      modalInstance.result.then(function (newLongLead) {
        newLongLead._id = $stateParams.id;
        console.log(newLongLead);
        NodeLongLeads.save(newLongLead,function(u, putResponseHeaders) {
          toaster.pop('success', 'Long Lead Item added', '.');
          $scope.getNodeLongLeads();
        });
      }, function () {
      });
    }

    $scope.openAddPermitModal = function(){
      $scope.newPermit = new NodePermits();
      var modalInstance = $modal.open({
        templateUrl: 'tpl/modal_permit.form.html',
        controller: 'AddPermitModal',
        resolve: {
          permit: function () {
            return $scope.newPermit;
          }
        }
      });

      modalInstance.result.then(function (newPermit) {
        newPermit._id = $stateParams.id;
        console.log(newPermit);
        NodePermits.save(newPermit,function(u, putResponseHeaders) {
          toaster.pop('success', 'Permit added', '.');
          $scope.getNodePermits();
        });
      }, function () {
      });
    }
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
  .controller('EditPermitModal', ['$scope', '$modalInstance', 'permit', function($scope, $modalInstance, permit) {
    $scope.permit = permit;

    $scope.ok = function () {
      $modalInstance.close($scope.permit);
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
  .controller('AddLongLeadModal', ['$scope', '$modalInstance', 'longlead',  function($scope, $modalInstance, longlead) {
    $scope.longlead = longlead;

    $scope.ok = function () {
      $modalInstance.close($scope.longlead);
    };

    $scope.cancel = function () {
      $modalInstance.dismiss('cancel');
    };
  }])
  .controller('AddPermitModal', ['$scope', '$modalInstance', 'permit', function($scope, $modalInstance, permit) {
    $scope.permit = permit;

    $scope.ok = function () {
      $modalInstance.close($scope.permit);
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
  .controller('HomepageController', [	'$scope',
  										'UserHomepage',
  										'UserProjects',
  										'$http',
  										'Auth', function(	$scope,
															UserHomepage,
															UserProjects,
															$http,
															Auth	) {
    var plot;

    $scope.newsfeed 		= [];
    $scope.newsfeedSkip 	= 0;

    $scope.upcoming_tasks 	= [];
    $scope.current_tasks 	= [];
    $scope.network_rfis 	= [];

    $scope.homepage_action	= 'overview';

    $scope.user_data		= Auth.getCredential('user_data');

    $scope.init = function(){

		UserProjects.query({id:$scope.user_data.id})
			.$promise.then(function(data) {
				$scope.user_projects	= data;
			});

		UserHomepage.get({})
			.$promise.then(function(res) {
				$scope.current_tasks	= res.data.current_tasks;
				$scope.upcoming_tasks	= res.data.upcoming_tasks;
				$scope.network_rfis		= res.data.network_rfis;
				console.log(res.data.seven_day);
				$scope.seven_day		= res.data.seven_day;

				$('#current_tasks_table').trigger('footable_redraw');
				$('#upcoming_tasks_table').trigger('footable_redraw');

				$.plot(	'#plot',
					[
						{ label: "Actual", data: [ res.data.seven_day.progress_plot ], },
							{ label: "Calculated", data: [ res.data.seven_day.projected_progress_plot ] }
					],
					{
						colors: [
							'#314554',
							'{{ app.color.info }}'
						],
						series: {
							shadowSize: 3
						},
						xaxis: {
							mode:'time',
							minTickSize: [1, 'day'],
							timeformat: '%d-%m-%Y',
							font: { color: '#507b9b' }
						},
						yaxis: {
							font: { color: '#507b9b' },
							max:100
						},
						grid: {
							hoverable: true,
							clickable: true,
							borderWidth: 0,
							color: '#1c2b36'
						},
						tooltip: true,
						tooltipOpts: {
							content: '%y% on %x',
							defaultTheme: false,
							shifts: {
								x: 10,
								y: -25
							}
						}
					});

			});

		  $scope.getNewsfeed();

    }

    $scope.changeAction = function(value) {
    	$scope.homepage_action = value;
    	if (value == 'overview') {
    		$scope.refreshOverviewFlot();
    	}
		if (value == 'current_tasks') {
			$('#current_tasks_table').trigger('footable_redraw');
		}
		if (value == 'upcoming_tasks') {
			$('#upcoming_tasks_table').trigger('footable_redraw');
		}

    }

  	$scope.getNewsfeed = function(){
  		$http.get('http://api.metinet.co/user/newsfeed/'+$scope.newsfeedSkip).then(function (resp) {
  			$.merge($scope.newsfeed, resp.data.data);
  			$scope.newsfeedSkip++;
  		});
  	}

  	$scope.refreshOverviewFlot = function(){
  		$.plot.draw();
  	}

  }])
  .controller('NetworkViewController', ['$scope', '$stateParams', 'Auth', 'Networks', 'NetworkProjects', function($scope, $stateParams, Auth, Networks, NetworkProjects) {

    $scope.network = {};

    $scope.init = function(){
      Networks.get({id:$stateParams.id})
      .$promise.then(function(res) {
        $scope.network = res.data;
      });

      NetworkProjects.query({id:$stateParams.id})
      .$promise.then(function(data) {
        $scope.network.projects = data;
      });
    }

  }])
  .controller('ProfileViewController', [  '$scope',
                                          '$stateParams',
                                          'Profile',
                                          'UserConnections',
                                          'UserProjects', function(   $scope,
                                                                      $stateParams,
                                                                      Profile,
                                                                      UserConnections,
                                                                      UserProjects ) {

    $scope.profile = {};

    Profile.query({id:$stateParams.id})
    .$promise.then(function(data) {
      console.log(data);
      $scope.profile = data;
    });

    UserConnections.query({id:$stateParams.id})
    .$promise.then(function(data) {
      console.log(data);
      $scope.profile.connections = data;
    });

    UserProjects.query({id:$stateParams.id})
    .$promise.then(function(data) {
      console.log(data);
      $scope.profile.projects = data;
    });

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

    $scope.signUpUser = {};

    $scope.login = function() {
      $scope.authError = null;
      // Try to login
      $http.post('http://api.metinet.co/auth', {
        headers: {'Authorization': 'Basic amVtaW1hLnNjb3R0QGZha2VyZW1haWwuY29tOnRlc3QxMjM0'},
        email: $scope.user.email,
        password: $scope.user.password})
      .then(function(response) {
        if ( response.status === 200 ) {
          // user logged in
          Auth.setCredentials($scope.user.email,$scope.user.password,response.data.user_data);
          $state.go('app.home');
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
    $scope.signUpUser = {};
    $scope.authError = null;

    $scope.signup = function() {
      $scope.authError = null;
      // Try to login
      $http.post('http://api.metinet.co/user', {
        headers: {'Authorization': 'Basic amVtaW1hLnNjb3R0QGZha2VyZW1haWwuY29tOnRlc3QxMjM0'},
          email: $scope.signUpUser.email,
          password: $scope.signUpUser.password,
          firstname: $scope.signUpUser.firstname,
          lastname: $scope.signUpUser.lastname,
          terms: $scope.signUpUser.terms
        })
      .then(function(response) {
        if ( response.status === 200 ) {
          // user logged in
          Auth.setCredentials($scope.signUpUser.email,$scope.signUpUser.password,response.data.user_data);
          $state.go('app.home');
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
;