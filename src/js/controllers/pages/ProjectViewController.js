angular.module('app.controllers').controller('ProjectViewController', [ '$scope',
																		'$stateParams',
																		'Auth',
																		'Networks',
																		'Project',
																		'ProjectUsers',
																		'ProjectRFIs',
																		'ProjectLongLeads',
																		'LongLeads',
																		'ChangeLongLeadStatus',
																		'ProjectNetworks',
																		'ProjectPermits',
																		'Permits',
																		'ChangePermitStatus',
																		'ProjectProgressPlot',
																		'ProjectAudit',
																		'$modal',
																		'$http',
																		'uiGmapGoogleMapApi',
																		'toaster',
																		'LongLeads',
																		'Countries',
																		'Currencies',
																		'Permits',  function(   $scope,
																								$stateParams,
																								Auth,
																								Networks,
																								Project,
																								ProjectUsers,
																								ProjectRFIs,
																								ProjectLongLeads,
																								LongLeads,
																								ChangeLongLeadStatus,
																								ProjectNetworks,
																								ProjectPermits,
																								Permits,
																								ChangePermitStatus,                                                                                             
																								ProjectProgressPlot,
																								ProjectAudit,
																								$modal,
																								$http,
																								uiGmapGoogleMapApi,
																								toaster,
																								LongLeads,
																								Countries,
																								Currencies,
																								Permits ) {

	$scope.project_id               = $stateParams.id;
	$scope.user_action              = $stateParams.action;
	$scope.settings_action          = 'location';
	$scope.newProjectRFI            = ProjectRFIs();

	$scope.project_general          = {};
	$scope.user_admin_level         = 3;
	$scope.map 						= { 
										center: { latitude: 51.5000, longitude: 0.1333 },
										zoom: 10,
										options: { scrollwheel: false }
									};
	$scope.marker 					= { 
										id: 0,
										coords: { latitude: 0, longitude: 0 },
									};
	$scope.marker_moved 			= false;
	$scope.permits_received         = false;
	$scope.long_leads_returned      = false;
	$scope.project_rfis_returned    = false;

	$scope.init = function() {
		$scope.getCountries();
		$scope.getCurrencies();			
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
			$scope.projectAudit.unshift(data[0]);
			$scope.projectAudit.pop();
			$scope.$apply();
		});
	};

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
				$scope.project 							= res.data;
				$scope.project_settings					= res.data;
				$scope.user_admin_level					= res.data.pivot.role;

				if (res.data.long_lead_items) {
					$scope.getProjectLongLeads();
				}
				if (res.data.permit_assessment) {
					$scope.getProjectPermits();
				}

				$scope.project_settings.country_id 		= res.data.iso;
				$scope.project_settings.currency_id 	= res.data.currency_id;
				$scope.project_settings.working_hours 	= res.data.working_hours;
				$scope.project_settings.working_days 	= res.data.working_days;

				$scope.map = { 
						center: { 
							latitude: res.data.lat,
							longitude: res.data.lng
						},
						zoom: 10,
						options: {
							scrollwheel: false
						}
					};

				$scope.marker = {
						id: 0,
						coords: {
							latitude: res.data.lat,
							longitude: res.data.lng
						},
						options: { draggable: true },
						events: {
							dragend: function(marker, eventName, args) {
								$('#map-request-result').removeClass('alert-info alert-warning');
								$('#map-request-result').addClass('alert-info');
								$('#map-request-result').html('<i class="fa fa-fw fa-spin fa-refresh"></i>&nbsp;&nbsp;Loading country data...');
								$scope.marker_moved = true;
								$scope.map_request	= true;
								var coords = {
									lat: marker.getPosition().lat(),
									lng: marker.getPosition().lng()
								};
								$scope.project_settings.lat = marker.getPosition().lat();
								$scope.project_settings.lng = marker.getPosition().lng();								
								Countries.findByCoords({action:'query'}, coords)
									.$promise.then(function(res) {
										console.log(res);
										$scope.project_settings.country_id = res.data.iso;
										$scope.project_settings.currency_id = res.data.currency_id;
										$scope.project_settings.working_hours = res.data.working_hours;
										$scope.project_settings.working_days = res.data.working_days;
										$scope.marker_moved = false;
										$scope.map_request	= false;
									}, function(res) {
										$('#map-request-result').removeClass('alert-info alert-warning');
										$('#map-request-result').addClass('alert-warning');
										$('#map-request-result').html('It appears you did not select a land mass.  Please select the data below manually.');
										$scope.marker_moved = false;										
									});
							}
						}
					};

			});
	}

	$scope.getCountries = function() {
		Countries.get()
			.$promise.then(function(response) {
				console.log(response);
				$scope.countries = response.data;
			});
	}

	$scope.getCurrencies = function() {
		Currencies.get()
			.$promise.then(function(response) {
				console.log(response);				
				$scope.currencies = response.data;
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

	$scope.getProjectNetworks = function() {
		ProjectNetworks.get({id:$stateParams.id})
			.$promise.then(function(res) {
				$scope.projectNetworks          = res.data.networks;
				$scope.potential_networks       = res.data.potential_networks;
				$scope.networks_except_users    = res.data.networks_except_users;               
			});
	}

	$scope.removeNetwork = function(network_index) {
		var _network_id = $scope.projectNetworks[network_index].id;
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
					$scope.projectNetworks      = response.data.networks;
					$scope.potential_networks   = response.data.potential_networks;
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
				$scope.projectUsers     = res.data.users;
				$scope.potential_users  = res.data.potential_users;
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
					$scope.projectUsers     = response.data.users;
					$scope.potential_users  = response.data.potential_users;                    
				}, function(response) {
					$('.add-users-modal-btn').removeClass('text-center btn-danger btn-primary');
					$('.add-users-modal-btn').addClass('btn-danger');
					$('.add-users-modal-btn').html('<i class="fa fa-fw fa-plus"></i>&nbsp;&nbsp;Add users');                    
					$('.add-users-modal-btn').prop('disabled', false);
				});
		});
	};

	// START: RFI Functionality

	$scope.getProjectRFIs = function() {
		ProjectRFIs.get({id:$stateParams.id})
			.$promise.then(function(res) {      
				$scope.projectRFIs              = res.data;
				$scope.project_rfis_returned    = true;
			});
	}

	$scope.openRfi = function(rfi_index, action) {
		var rfi_id = $scope.projectRFIs[rfi_index].id;
		$('.btn-'+action+'.rfi-'+rfi_id).prop('disabled', true);
		var modalInstance = $modal.open({
			templateUrl: 'tpl/project/modals/rfi.html',
			controller: 'ProjectRFIModalController',
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
				}, function(response) {
					$('.btn-'+action+'.rfi-'+rfi_id).removeClass('text-center btn-danger btn-primary btn-success');
					$('.btn-'+action+'.rfi-'+rfi_id).addClass('btn-danger');
					$('.btn-'+action+'.rfi-'+rfi_id).html('<i class="fa fa-fw fa-times"></i>');
					$('.btn-'+action+'.rfi-'+rfi_id).prop('disabled', false);
				});
		});     
	};

	$scope.newRFI = function() {
		var modalInstance = $modal.open({
			templateUrl: 'tpl/project/modals/new_rfi.html',
			controller: 'ProjectNewRFIModalController',
			size: 'md',
			resolve: {
				possible_networks: function () {
					return $scope.networks_except_users;
				}
			}
		});

		modalInstance.result.then(function(rfi) {

			$('.new-rfi-modal-btn').removeClass('text-center btn-danger btn-primary btn-success');
			$('.new-rfi-modal-btn').addClass('text-center btn-primary');
			$('.new-rfi-modal-btn').html('<i class="fa fa-fw fa-refresh fa-spin"></i>');

			ProjectRFIs.store({"id":$stateParams.id}, rfi)
				.$promise.then(function(response) {
					$('.new-rfi-modal-btn').removeClass('text-center btn-danger btn-primary btn-success');
					$('.new-rfi-modal-btn').addClass('btn-success');
					$('.new-rfi-modal-btn').html('<i class="fa fa-fw fa-check"></i>');
					$('.new-rfi-modal-btn').prop('disabled', false);
					$scope.projectRFIs  = response.data;
				}, function(response) {
					$('.new-rfi-modal-btn').removeClass('text-center btn-danger btn-primary btn-success');
					$('.new-rfi-modal-btn').addClass('btn-danger');
					$('.new-rfi-modal-btn').html('<i class="fa fa-fw fa-times"></i>');
					$('.new-rfi-modal-btn').prop('disabled', false);
				});
		});

		// Return button to original state after 3 seconds.
		setTimeout(function() {
			$('.new-rfi-modal-btn').removeClass('text-center btn-danger btn-primary btn-success');
			$('.new-rfi-modal-btn').addClass('text-center btn-primary');
			$('.new-rfi-modal-btn').html('<i class="fa fa-fw fa-plus"></i>&nbsp;&nbsp;Add New RFI');
		}, 3000);

	};

	// END: RFI Functionality

	// START: Long Lead Item Functionality

	$scope.getProjectLongLeads = function() {
		ProjectLongLeads.get({id:$stateParams.id})
			.$promise.then(function(res) {
				$scope.long_lead_items      = res.data
				$scope.long_leads_returned  = true;             
			});
	};

	$scope.openLongLeadItemModal = function(long_lead_index, action) {
		var modalInstance = $modal.open({
			templateUrl: 'tpl/project/modals/long_lead_item.html',
			controller: 'ProjectLongLeadItemModalController',
			resolve: {
				long_lead: function() {
					return $scope.long_lead_items[long_lead_index];
				},
				action: function() {
					return action;
				}
			}
		});

		modalInstance.result.then(function(long_lead) {
			if (action == 'view') {
				return true;
			}

			$('.btn-edit.long_lead-'+long_lead.id).removeClass('text-center btn-danger btn-success');
			$('.btn-edit.long_lead-'+long_lead.id).addClass('text-center');
			$('.btn-edit.long_lead-'+long_lead.id).html('<i class="fa fa-fw fa-refresh fa-spin"></i>');

			LongLeads.update({id:long_lead.id}, long_lead)
				.$promise.then(function(res) {
					$('.btn-edit.long_lead-'+long_lead.id).removeClass('text-center btn-danger btn-success');
					$('.btn-edit.long_lead-'+long_lead.id).addClass('btn-success');
					$('.btn-edit.long_lead-'+long_lead.id).html('<i class="fa fa-fw fa-check"></i>');
					$('.btn-edit.long_lead-'+long_lead.id).prop('disabled', false);                 
					$scope.long_lead_items[long_lead_index] = res.data;
				}, function(response) {
					$('.btn-edit.long_lead-'+long_lead.id).removeClass('text-center btn-danger btn-success');
					$('.btn-edit.long_lead-'+long_lead.id).addClass('btn-danger');
					$('.btn-edit.long_lead-'+long_lead.id).html('<i class="fa fa-fw fa-times"></i>');
					$('.btn-edit.long_lead-'+long_lead.id).prop('disabled', false);                 
				});
		});     
	};

	$scope.changeLongLeadStatus = function(long_lead_index, _action, _status) {
		var long_lead_item  = $scope.long_lead_items[long_lead_index];
		$('.btn-edit.long_lead-'+long_lead_item.id).removeClass('text-center text-danger btn-danger btn-success');
		$('.btn-edit.long_lead-'+long_lead_item.id).addClass('text-center');
		$('.btn-edit.long_lead-'+long_lead_item.id).html('<i class="fa fa-fw fa-refresh fa-spin"></i>');
	
		ChangeLongLeadStatus.update({id:long_lead_item.id, action:_action}, long_lead_item)
			.$promise.then(function(res) {
				$('.btn-edit.long_lead-'+long_lead_item.id).removeClass('text-center btn-danger btn-success');
				$('.btn-edit.long_lead-'+long_lead_item.id).addClass('btn-success');
				$('.btn-edit.long_lead-'+long_lead_item.id).html('<i class="fa fa-fw fa-check"></i>');
				$('.btn-edit.long_lead-'+long_lead_item.id).prop('disabled', false);                    
				$scope.long_lead_items[long_lead_index] = res.data;
			}, function(response) {
				$('.btn-edit.long_lead-'+long_lead_item.id).removeClass('text-center btn-danger btn-success');
				$('.btn-edit.long_lead-'+long_lead_item.id).addClass('btn-danger');
				$('.btn-edit.long_lead-'+long_lead_item.id).html('<i class="fa fa-fw fa-times"></i>');
				$('.btn-edit.long_lead-'+long_lead_item.id).prop('disabled', false);                    
			});
	};

	$scope.deleteLongLead = function(long_lead_index) {
		var long_lead_id = $scope.long_lead_items[long_lead_index].id;
		$('.btn-delete.long_lead-'+long_lead_id).removeClass('text-center text-danger btn-danger btn-success');
		$('.btn-delete.long_lead-'+long_lead_id).addClass('text-center');
		$('.btn-delete.long_lead-'+long_lead_id).html('<i class="fa fa-fw fa-refresh fa-spin"></i>');

		LongLeads.delete({id:long_lead_id})
			.$promise.then(function(res) {
				$scope.long_lead_items.splice(long_lead_index, 1);
			}, function(response) {
				$('.btn-delete.long_lead-'+long_lead_id).removeClass('text-center btn-danger btn-success');
				$('.btn-delete.long_lead-'+long_lead_id).addClass('btn-danger');
				$('.btn-delete.long_lead-'+long_lead_id).html('<i class="fa fa-fw fa-times"></i>');
				$('.btn-delete.long_lead-'+long_lead_id).prop('disabled', false);                   
			});
	};

	// END: Long Lead Item Functionality

	// START: Permit Functionality

	$scope.getProjectPermits = function() {
		ProjectPermits.get({id:$stateParams.id})
			.$promise.then(function(res) {
				$scope.permits          = res.data
				console.log($scope.permits);
				$scope.permits_returned = true;             
			});
	};

	$scope.openPermitModal = function(permit_index, action) {
		var modalInstance = $modal.open({
			templateUrl: 'tpl/project/modals/permit.html',
			controller: 'ProjectPermitModalController',
			resolve: {
				permit: function() {
					return $scope.permits[permit_index];
				},
				action: function() {
					return action;
				}
			}
		});

		modalInstance.result.then(function(permit) {
			if (action == 'view') {
				return true;
			}

			$('.btn-edit.permit-'+permit.id).removeClass('text-center btn-danger btn-success');
			$('.btn-edit.permit-'+permit.id).addClass('text-center');
			$('.btn-edit.permit-'+permit.id).html('<i class="fa fa-fw fa-refresh fa-spin"></i>');

			Permits.update({id:permit.id}, permit)
				.$promise.then(function(res) {
					$('.btn-edit.permit-'+permit.id).removeClass('text-center btn-danger btn-success');
					$('.btn-edit.permit-'+permit.id).addClass('btn-success');
					$('.btn-edit.permit-'+permit.id).html('<i class="fa fa-fw fa-check"></i>');
					$('.btn-edit.permit-'+permit.id).prop('disabled', false);                   
					$scope.permits[permit_index] = res.data;
				}, function(response) {
					$('.btn-edit.permit-'+permit.id).removeClass('text-center btn-danger btn-success');
					$('.btn-edit.permit-'+permit.id).addClass('btn-danger');
					$('.btn-edit.permit-'+permit.id).html('<i class="fa fa-fw fa-times"></i>');
					$('.btn-edit.permit-'+permit.id).prop('disabled', false);                   
				});
		});     
	};

	$scope.changePermitStatus = function(permit_index, _action, _status) {
		var permit  = $scope.permits[permit_index];
		$('.btn-edit.permit-'+permit.id).removeClass('text-center text-danger btn-danger btn-success');
		$('.btn-edit.permit-'+permit.id).addClass('text-center');
		$('.btn-edit.permit-'+permit.id).html('<i class="fa fa-fw fa-refresh fa-spin"></i>');
	
		ChangePermitStatus.update({id:permit.id, action:_action}, permit)
			.$promise.then(function(res) {
				$('.btn-edit.permit-'+permit.id).removeClass('text-center btn-danger btn-success');
				$('.btn-edit.permit-'+permit.id).addClass('btn-success');
				$('.btn-edit.permit-'+permit.id).html('<i class="fa fa-fw fa-check"></i>');
				$('.btn-edit.permit-'+permit.id).prop('disabled', false);                   
				$scope.permits[permit_index] = res.data;
			}, function(response) {
				$('.btn-edit.permit-'+permit.id).removeClass('text-center btn-danger btn-success');
				$('.btn-edit.permit-'+permit.id).addClass('btn-danger');
				$('.btn-edit.permit-'+permit.id).html('<i class="fa fa-fw fa-times"></i>');
				$('.btn-edit.permit-'+permit.id).prop('disabled', false);                   
			});
	};

	$scope.deletePermit = function(permit_index) {
		var permit_id = $scope.permits[permit_index].id;
		$('.btn-delete.permit-'+permit_id).removeClass('text-center text-danger btn-danger btn-success');
		$('.btn-delete.permit-'+permit_id).addClass('text-center');
		$('.btn-delete.permit-'+permit_id).html('<i class="fa fa-fw fa-refresh fa-spin"></i>');

		Permits.delete({id:permit_id})
			.$promise.then(function(res) {
				$scope.permits.splice(permit_index, 1);
			}, function(response) {
				$('.btn-delete.permit-'+permit_id).removeClass('text-center btn-danger btn-success');
				$('.btn-delete.permit-'+permit_id).addClass('btn-danger');
				$('.btn-delete.permit-'+permit_id).html('<i class="fa fa-fw fa-times"></i>');
				$('.btn-delete.permit-'+permit_id).prop('disabled', false);                 
			});
	};

	// END: Permit Functionality

	// START: Settings functionality

	var template_directory  = 'tpl/project/components/settings/';
	$scope.settings_action  = 'general';
	$scope.settings_menu    = [
		{
			action: 'general',
			name:   'General Settings',
			icon:   'fa-globe',
			tpl:    template_directory+'general_settings.html'
		},
		{
			action: 'location',
			name:   'Location Settings',
			icon:   'fa-map-marker',
			tpl:    template_directory+'location_settings.html'             
		},
		{
			action: 'tracking',
			name:   'Tracking Settings',
			icon:   'fa-line-chart',
			tpl:    template_directory+'tracking_settings.html'             
		}                       
	];

	$scope.changeSettingsAction = function(value) {
		$scope.settings_action = value;
		if (value == 'location') {
			redrawMap();
			redrawMap();			
		}
	}

	$scope.redrawMap	= function() {
		var mapEl 	= angular.element(document.querySelector('.angular-google-map'));
		var iScope 	= mapEl.isolateScope();
		var map 	= iScope.map;
		var zoom 	= map.getZoom();
		var center 	= map.getCenter();
		google.maps.event.trigger(map, "resize");
		map.setZoom(zoom);
		map.setCenter(center);		
	}

	$scope.submitSettings   = function(action) {
		$('.btn-submit.'+action).removeClass('text-center btn-danger btn-success btn-primary');
		$('.btn-submit.'+action).addClass('btn-primary text-center');
		$('.btn-submit.'+action).html('<i class="fa fa-fw fa-refresh fa-spin"></i>');       
		Project.update({id:$stateParams.id}, $scope.project_settings)
			.$promise.then(function(res) {
				$('.btn-submit.'+action).removeClass('text-center btn-danger btn-success btn-primary');
				$('.btn-submit.'+action).addClass('text-center btn-primary');
				$('.btn-submit.'+action).html('Save');              
				$scope.project          = res.data;
				$scope.user_admin_level = res.data.pivot.role;
			}, function(response) {
				$('.btn-submit.'+action).removeClass('text-center btn-danger btn-success btn-primary');
				$('.btn-submit.'+action).addClass('btn-danger');
				$('.btn-submit.'+action).html('<i class="fa fa-fw fa-times"></i>');
			}); 
	}

	// END: Settings functionality

}]);