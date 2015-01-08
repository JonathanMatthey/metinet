angular.module('app.controllers').controller('ProjectViewController', [	'$scope',
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
																			'Permits',	function(	$scope,
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
																									Permits 	) {

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

		$scope.refreshOverviewFlot = function() {
			console.log("refreshing_plot");
		}

	$scope.getProject = function() {
		Project.get({id:$stateParams.id})
			.$promise.then(function(res) {
				$scope.project 								= res.data;

				$scope.project_general.name 				= res.data.name;
				$scope.project_general.desc					= res.data.desc;
				$scope.project_general.start_date 			= res.data.start_date;
				$scope.project_general.end_date_contract	= res.data.end_date_contract;
				$scope.project_general.client_id			= res.data.client.id;
				$scope.project_general.contractor_id		= res.data.contractor.id;
				$scope.project_general.consultant_id		= res.data.consultant.id;
			});
	}

	$scope.getProjectUsers = function() {
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

	$scope.getProjectAudit = function() {
		ProjectAudit.get({
			id:$stateParams.id
		})
		.$promise.then(function(res) {
			// success handler
			$scope.projectAudit = res.data
		});
	}

	$scope.getProjectRFIs = function() {
		ProjectRFIs.get({
			id:$stateParams.id
		})
		.$promise.then(function(res) {
			// success handler
			$scope.projectRFIs = res.data;
		});
	}

	$scope.getProjectNetworks = function() {
	  ProjectNetworks.get({
	    id:$stateParams.id
	  })
	  .$promise.then(function(res) {
	    // success handler
	    $scope.projectNetworks = res.data
	  });
	}

	$scope.getProjectTodos = function() {
	  $http.get('http://api.metinet.co/projects/'+$stateParams.id+"/to-do").then(function (resp) {
	    $scope.projectTodo = resp.data.data;
	  });
	}

	$scope.getProjectLongLeads = function() {
	  ProjectLongLeads.get({
	    id:$stateParams.id
	  })
	  .$promise.then(function(res) {
	    // success handler
	    $scope.projectLongLeads = res.data
	  });
	}

	$scope.getProjectPermits = function() {
	  ProjectPermits.get({
	    id:$stateParams.id
	  })
	  .$promise.then(function(res) {
	    // success handler
	    $scope.projectPermits = res.data
	  });
	}

	$scope.getProjectProgressPlot = function() {
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

	$scope.openAddPackageModal = function() {
	  var modalInstance = $modal.open({
	    templateUrl: 'tpl/project/modal_add_package.html',
	    controller: 'AddPackageModal'       
	  });
	  modalInstance.result.then(function(newPackage) {
		console.log("here");
		console.log(newPackage);
	  });
	}

	$scope.openAddRFIToNetworkModal = function() {
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
}]);