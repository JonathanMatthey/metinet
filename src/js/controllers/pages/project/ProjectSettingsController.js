angular.module('app.controllers').controller('ProjectSettingsController', [ '$scope',
																			'$stateParams',
																			'Networks',
																			'Project',
																			'ProjectUsers',
																			'ProjectNetworks',
																			'ProjectAudit',
																			'$modal',
																			'$http',
																			'uiGmapGoogleMapApi',
																			'toaster',
																			'Countries',
																			'Currencies',  	function(   $scope,
																										$stateParams,
																										Networks,
																										Project,
																										ProjectUsers,
																										ProjectNetworks,
																										ProjectAudit,
																										$modal,
																										$http,
																										uiGmapGoogleMapApi,
																										toaster,
																										Countries,
																										Currencies ) {

	$scope.settings_action          = 'location';
	$scope.project 					= $scope.$parent.project;
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

	Project.get({id:$stateParams.id})
		.$promise.then(function(res) {
			$scope.project 							= res.data;
			$scope.project_settings					= res.data;
			$scope.user_admin_level					= res.data.pivot.role;

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

	Countries.get()
		.$promise.then(function(response) {
			$scope.countries = response.data;
		});

	Currencies.get()
		.$promise.then(function(response) {
			$scope.currencies = response.data;
		});

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

	// START: Settings functionality

	var template_directory  = 'tpl/project/components/settings/';
	$scope.settings_action  = 'general';
	$scope.settings_menu    = [
		{
			state: 	'app.page.project.settings.general',
			name:   'General Settings',
			icon:   'fa-globe'
		},
		{
			state: 	'app.page.project.settings.networks',
			name:   'Networks',
			icon:   'fa-group'
		},
		{
			state: 	'app.page.project.settings.users',
			name:   'Users',
			icon:   'fa-building-o'
		},		
		{
			state: 	'app.page.project.settings.location',
			name:   'Location Settings',
			icon:   'fa-map-marker'
		},
		{
			state: 	'app.page.project.settings.tracking',
			name:   'Tracking Settings',
			icon:   'fa-line-chart'
		}                       
	];

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

}]);