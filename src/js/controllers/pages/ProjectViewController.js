angular.module('app.controllers').controller('ProjectViewController', [	'$scope',
																		'$stateParams',
																		'Auth',
																		'Networks',
																		'Project',
																		'ProjectUsers',
																		'ProjectRFIs',
																		'ProjectLongLeads',
																		'ProjectNetworks',
																		'ProjectPermits',
																		'ProjectProgressPlot',
																		'ProjectAudit',
																		'$modal',
																		'$http',
																		'toaster',
																		'LongLeads',
																		'Permits',	function(	$scope,
																								$stateParams,
																								Auth,
																								Networks,
																								Project,
																								ProjectUsers,
																								ProjectRFIs,
																								ProjectLongLeads,
																								ProjectNetworks,
																								ProjectPermits,
																								ProjectProgressPlot,
																								ProjectAudit,
																								$modal,
																								$http,
																								toaster,
																								LongLeads,
																								Permits ) {

	$scope.project_id       		= $stateParams.id;
	$scope.user_action      		= $stateParams.action;
	$scope.settings_action  		= 'location';
	$scope.newProjectRFI    		= ProjectRFIs();

	$scope.project_general  		= {};
	$scope.user_admin_level			= 3;
	$scope.map              		= { center: { latitude: 45, longitude: -73 }, zoom: 8 };

	$scope.project_rfis_returned	= false;

	$scope.init = function() {
		$scope.getProject();
		$scope.getProjectAudit();
		$scope.getProjectTodos();
		$scope.getProjectProgressPlot();
		$scope.getProjectNetworks();
		$scope.getProjectUsers();
		$scope.getProjectRFIs();

		initialiseWebSockets();
	}

	initialiseWebSockets = function() {
		var channel = pusher.subscribe('Project_'+$stateParams.id);
		channel.bind('audit-trail', function(data) {
			console.log(data);
			$scope.projectAudit.unshift(data);
		});
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
				$scope.user_admin_level						= res.data.pivot.role;

				if (res.data.long_lead_items) {
					$scope.getProjectLongLeads();
				}
				if (res.data.permit_assessment) {
					$scope.getProjectPermits();
				}

				$scope.project_general.name 				= res.data.name;
				$scope.project_general.desc					= res.data.desc;
				$scope.project_general.start_date 			= res.data.start_date;
				$scope.project_general.end_date_contract	= res.data.end_date_contract;
				$scope.project_general.client_id			= res.data.client.id;
				$scope.project_general.contractor_id		= res.data.contractor.id;
				$scope.project_general.consultant_id		= res.data.consultant.id;
			});
	}

	$scope.getProjectAudit = function() {
		ProjectAudit.get({id:$stateParams.id})
			.$promise.then(function(res) {
				// success handler
				$scope.projectAudit = res.data
			});
	}

	$scope.getProjectTodos = function() {
	  $http.get('http://api.metinet.co/projects/'+$stateParams.id+"/to-do").then(function (resp) {
	    $scope.projectTodo = resp.data.data;
	  });
	}

	$scope.getProjectLongLeads = function() {
		ProjectLongLeads.get({id:$stateParams.id})
			.$promise.then(function(res) {
				console.log(res);
				$scope.projectLongLeads = res.data
			});
	}

	$scope.getProjectPermits = function() {
		ProjectPermits.get({id:$stateParams.id})
			.$promise.then(function(res) {
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
	  });
	}

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

	$scope.openEditPermitModal = function(permitIndex) {
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

	$scope.getProjectNetworks = function() {
		ProjectNetworks.get({id:$stateParams.id})
			.$promise.then(function(res) {
				$scope.projectNetworks 		= res.data.networks;
				$scope.potential_networks 	= res.data.potential_networks;
			});
	}

	$scope.removeNetwork = function(network_index) {
		var _network_id	= $scope.projectNetworks[network_index].id;
		$('.btn-remove.network-'+_network_id).html('<i class="fa fa-fw fa-spin fa-refresh"></i>');
		$('.btn-remove.network-'+_network_id).removeClass('btn-danger btn-default');
		$('.btn-remove.network-'+_network_id).addClass('btn-default');
		ProjectNetworks.delete({id:$stateParams.id, network_id:_network_id})
			.$promise.then(function(response) {
				$scope.projectNetworks.splice(network_index, 1);
				$scope.potential_networks = response.data.potential_networks;
				$scope.getProjectUsers();
			}, function(response) {
				$('.btn-remove.network-'+_network_id).html('<i class="fa fa-fw fa-times"></i>');
				$('.btn-remove.network-'+_network_id).removeClass('btn-danger btn-default');
				$('.btn-remove.network-'+_network_id).addClass('btn-danger');
				toaster.pop('error', '', response.data.detail);
			});
	}

	$scope.addNetworkModal = function() {
		$('.add-network-modal-btn').prop('disabled', true);
		var modalInstance = $modal.open({
			templateUrl: 'tpl/project/modals/add_network.html',
			controller: 'ProjectAddNetworkModalController',
			resolve: {
				networks: function () {
					return $scope.potential_networks;
				}
			}
		});

		modalInstance.result.then(function(requested_network_data) {
			$('.add-network-modal-btn').removeClass('text-center btn-danger btn-primary');
			$('.add-network-modal-btn').addClass('text-center btn-primary');
			$('.add-network-modal-btn').html('<i class="fa fa-fw fa-refresh fa-spin"></i>');
			ProjectNetworks.save({id:$stateParams.id, network_id:requested_network_data.id})
				.$promise.then(function(response) {
					$('.add-network-modal-btn').removeClass('text-center btn-danger btn-primary');
					$('.add-network-modal-btn').addClass('btn-primary');
					$('.add-network-modal-btn').html('<i class="fa fa-fw fa-plus"></i>&nbsp;&nbsp;Add Network');					
					$('.add-network-modal-btn').prop('disabled', false);
					$scope.projectNetworks 		= response.data.networks;
					$scope.potential_networks 	= response.data.potential_networks;
					$scope.getProjectUsers();					
				}, function(response) {
					$('.add-network-modal-btn').removeClass('text-center btn-danger btn-primary');
					$('.add-network-modal-btn').addClass('btn-danger');
					$('.add-network-modal-btn').html('<i class="fa fa-fw fa-plus"></i>&nbsp;&nbsp;Add Network');					
					$('.add-network-modal-btn').prop('disabled', false);
				});
		});
	}

	$scope.getProjectUsers = function() {
		ProjectUsers.get({id:$stateParams.id})
			.$promise.then(function(res) {
				// success handler
				$scope.projectUsers 	= res.data.users;
				$scope.potential_users 	= res.data.potential_users;
			});
	}

	$scope.removeUser = function(user_index) {
		var _user = $scope.projectUsers[user_index];
		var r = confirm("Are you sure you want to delete " + _user.fullname + "?");
		if (r == true) {
			$('.btn-remove.user-'+_user.id).html('<i class="fa fa-fw fa-spin fa-refresh"></i>');
			$('.btn-remove.user-'+_user.id).removeClass('btn-danger btn-default');
			$('.btn-remove.user-'+_user.id).addClass('btn-default');			
			ProjectUsers.delete({id:$stateParams.id, userId: _user.id})
				.$promise.then(function(response) {
					$scope.projectUsers.splice(user_index, 1);					
					toaster.pop('success', 'User deleted', '.');
					$scope.potential_users = response.data.potential_users;
				});
		}
	}

	$scope.addUsersModal = function() {
		$('.add-users-modal-btn').prop('disabled', true);		
		var modalInstance = $modal.open({
			templateUrl: 'tpl/project/modals/add_users.html',
			controller: 'ProjectAddUsersModalController',
			resolve: {
				potential_users: function () {
					return $scope.potential_users;
				}
			}
		});

		modalInstance.result.then(function(selected_users) {
			$('.add-users-modal-btn').removeClass('text-center btn-danger btn-primary');
			$('.add-users-modal-btn').addClass('text-center btn-primary');
			$('.add-users-modal-btn').html('<i class="fa fa-fw fa-refresh fa-spin"></i>');	    	
			ProjectUsers.save({"id":$stateParams.id},{"users":selected_users})
				.$promise.then(function(response) {
					$('.add-users-modal-btn').removeClass('text-center btn-danger btn-primary');
					$('.add-users-modal-btn').addClass('btn-primary');
					$('.add-users-modal-btn').html('<i class="fa fa-fw fa-plus"></i>&nbsp;&nbsp;Add Users');					
					$('.add-users-modal-btn').prop('disabled', false);					
					toaster.pop('success', 'Users added', '');
					$scope.projectUsers 	= response.data.users;
					$scope.potential_users 	= response.data.potential_users;					
				}, function(response) {
					$('.add-users-modal-btn').removeClass('text-center btn-danger btn-primary');
					$('.add-users-modal-btn').addClass('btn-danger');
					$('.add-users-modal-btn').html('<i class="fa fa-fw fa-plus"></i>&nbsp;&nbsp;Add users');					
					$('.add-users-modal-btn').prop('disabled', false);
				});
		});
	};

	$scope.getProjectRFIs = function() {
		ProjectRFIs.get({id:$stateParams.id})
			.$promise.then(function(res) {		
				$scope.projectRFIs 				= res.data;
				$scope.project_rfis_returned	= true;
			});
	}

	$scope.openRfi = function(rfi_index, action) {
		var rfi_id = $scope.projectRFIs[rfi_index].id;
		$('.btn-'+action+'.rfi-'+rfi_id).prop('disabled', true);
		var modalInstance = $modal.open({
			templateUrl: 'tpl/project/modals/rfi.html',
			controller: 'ProjectViewRFIModalController',
			size: 'md',
			resolve: {
				rfi: function () {
					return $scope.projectRFIs[rfi_index];
				},
				action: function() {
					return action;
				}
			}
		});

		modalInstance.result.then(function(rfi) {
			if (action != 'edit' && action != 'respond') {
				return true;
			}

			$('.btn-'+action+'.rfi-'+rfi_id).removeClass('text-center btn-danger btn-primary btn-success');
			$('.btn-'+action+'.rfi-'+rfi_id).addClass('text-center btn-primary');
			$('.btn-'+action+'.rfi-'+rfi_id).html('<i class="fa fa-fw fa-refresh fa-spin"></i>');

			ProjectRFIs.update({"id":$stateParams.id, "rfi_id":rfi_id}, rfi)
				.$promise.then(function(response) {
					$('.btn-'+action+'.rfi-'+rfi_id).removeClass('text-center btn-danger btn-primary btn-success');
					$('.btn-'+action+'.rfi-'+rfi_id).addClass('btn-success');
					$('.btn-'+action+'.rfi-'+rfi_id).html('<i class="fa fa-fw fa-check"></i>');
					$('.btn-'+action+'.rfi-'+rfi_id).prop('disabled', false);
					$scope.projectUsers 	= response.data.users;
					$scope.potential_users 	= response.data.potential_users;					
				}, function(response) {
					$('.btn-'+action+'.rfi-'+rfi_id).removeClass('text-center btn-danger btn-primary btn-success');
					$('.btn-'+action+'.rfi-'+rfi_id).addClass('btn-danger');
					$('.btn-'+action+'.rfi-'+rfi_id).html('<i class="fa fa-fw fa-times"></i>');
					$('.btn-'+action+'.rfi-'+rfi_id).prop('disabled', false);
				});
		});		
	};

}]);