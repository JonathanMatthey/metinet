angular.module('app.controllers').controller('NetworkSettingsController', [	'$scope',
																				'$location',
																				'$stateParams',
																				'$modal',
																				'toaster',
																				'Auth',
																				'AccountTypes',
																				'Roles',
																				'Countries',												
																				'Networks',
																				'NetworkUsers',
																				'NetworkLocations', function(	$scope,
																												$location,
																												$stateParams,
																												$modal,
																												toaster,
																												Auth,
																												AccountTypes,
																												Roles,
																												Countries,
																												Networks,
																												NetworkUsers,
																												NetworkLocations 	) {

	var user_has_network 				= Auth.getCredential("user_has_network");
	if (!user_has_network) {
		$location.path('/');
	}

	var current_user_data 				= Auth.getCredential("user_data");
	$scope.user_is_network_admin 		= Auth.getCredential("user_is_network_admin");
	$scope.user_is_network_super_admin 	= Auth.getCredential("user_is_network_super_admin");
	$scope.network_data					= {};
	$scope.request_error				= null;
	$scope.settings_action				= 'general';
	var template_directory				= 'tpl/networks/settings_parts/';		

	$scope.settings_menu	= [
		{
			action: 'general',
			name: 	'General Settings',
			icon: 	'fa-globe',
			tpl: 	template_directory+'general_settings.html',
			show: 	true
		},
		{
			action: 'users',
			name: 	'Users',
			icon: 	'fa-group',
			tpl: 	template_directory+'users.html',
			show: 	true				
		},
		{
			action: 'locations',
			name: 	'Locations',
			icon: 	'fa-map-marker',
			tpl: 	template_directory+'locations.html',
			show: 	true
		},
		{
			action: 'subscription',
			name: 	'Subscription Settings',
			icon: 	'fa-credit-card',
			tpl: 	template_directory+'subscription_settings.html',
			show: 	$scope.user_is_network_super_admin
		},
		{
			action: 'delete',
			name: 	'Delete Network',
			icon: 	'fa-times',
			tpl: 	template_directory+'delete_network.html',
			show: 	$scope.user_is_network_super_admin
		}						
	];

	$scope.init = function() {
		$scope.getNetworkData();
		$scope.getAccountTypes();
		$scope.getRoles();
		$scope.getCountries();			
	}

	$scope.changeAction = function(value) {
		$scope.settings_action = value;
	}

	$scope.getNetworkData = function() {
		Networks.get({id:current_user_data.network.id})
			.$promise
			.then(function(response) {
				$scope.network_data = response.data;
			}, function(response) {

			});
	}

	$scope.getAccountTypes = function() {
		AccountTypes.get().$promise
			.then(function(response) {
				$scope.account_types = response.data;
			}, function(response) {

			});
	}

	$scope.getRoles = function() {
		Roles.get().$promise
			.then(function(response) {
				$scope.roles = response.data;
			}, function(response) {

			});
	}

	$scope.getCountries = function() {
		Countries.get().$promise
			.then(function(response) {
				$scope.countries = response.data;
			}, function(response) {

			});
	}

	$scope.updateNetwork = function() {
		$scope.request_error = null;			
		$('.submit-btn').html('<i class="fa fa-spin fa-refresh"></i>&nbsp;&nbsp;Saving...');
		$('.submit-btn').removeClass('btn-success btn-danger btn-info btn-primary');
		$('.submit-btn').addClass('btn-info');
		Networks.update({id:current_user_data.network.id}, $scope.network_data)
			.$promise
			.then(function(response) {
				$('.submit-btn').html('<i class="fa fa-fw fa-check"></i>&nbsp;&nbsp;Saved');
				$('.submit-btn').removeClass('btn-success btn-danger btn-info btn-primary');
				$('.submit-btn').addClass('btn-success');
				Auth.resetUserData(response.user_data);
			}, function(response) {
				$('.submit-btn').html('<i class="fa fa-fw fa-times"></i>&nbsp;&nbsp;Failed');
				$('.submit-btn').removeClass('btn-success btn-danger btn-info btn-primary');
				$('.submit-btn').addClass('btn-danger');
				$scope.request_error = response.data.msg.text;
			});			
	}

	$scope.deleteNetwork = function() {
		$scope.request_error = null;			
		$('.delete-btn').html('<i class="fa fa-spin fa-refresh"></i>&nbsp;&nbsp;Saving...');
		$('.delete-btn').removeClass('btn-success btn-danger');
		$('.delete-btn').addClass('btn-danger');
		Networks.delete({id:current_user_data.network.id})
			.$promise
			.then(function(response) {
				$('.delete-btn').html('<i class="fa fa-fw fa-check"></i>&nbsp;&nbsp;Saved');
				$('.delete-btn').removeClass('btn-danger');
				$('.delete-btn').addClass('btn-success');
				Auth.resetUserData(response.user_data);
				$location.path('/');					
			}, function(response) {
				$('.delete-btn').html('<i class="fa fa-fw fa-times"></i>&nbsp;&nbsp;Failed');
				$('.delete-btn').removeClass('btn-danger');
				$('.delete-btn').addClass('btn-danger');
				$scope.request_error = response.data.msg.text;
			});			
	}

	$scope.editLocation = function(location_index) {
		var modalInstance = $modal.open({
				templateUrl: 'tpl/networks/settings_parts/modals/edit_location.html',
				controller: 'NetworkEditLocationModal',
				size: 'md',
				resolve: {
					location: function () {
						return $scope.network_data.locations[location_index];
					},
					countries: function () {
						return $scope.countries;
					}
				}
			});
			modalInstance.result.then(function(submit_data) {
				var _location_id = submit_data.id;
				$('.btn-update.location-'+_location_id).removeClass('btn-success btn-info');
				$('.btn-update.location-'+_location_id).addClass('btn-info');					
				$('.btn-update.location-'+_location_id).html('<i class="fa fa-fw fa-spin fa-refresh"></i>');
				console.log(submit_data);
				NetworkLocations.update({network_id:current_user_data.network.id, loc_id:_location_id}, submit_data)
					.$promise
					.then(function(response) {
						console.log(response);							
						$('.btn-update.location-'+_location_id).removeClass('btn-success btn-info');
						$('.btn-update.location-'+_location_id).addClass('btn-success');
						$('.btn-update.location-'+_location_id).html('<i class="fa fa-fw fa-check"></i>');
						$scope.network_data.locations[location_index] = response.data;
					}, function(response) {
						$('.btn-update.location-'+_location_id).html('<i class="fa fa-fw fa-times"></i>');
						toaster.pop('error', 'Oops.', response.data.detail);
					});
			});
	}

	$scope.deleteLocation = function(location_index) {
		var location_id = $scope.network_data.locations[location_index].id;			
		$('.btn-delete.location-'+location_id).html('<i class="fa fa-spin fa-refresh"></i>');
		$('.btn-delete.location-'+location_id).removeClass('btn-info btn-default btn-danger btn-success');
		$('.btn-delete.location-'+location_id).addClass('btn-info');
		NetworkLocations.delete({network_id:current_user_data.network.id, loc_id:location_id})
			.$promise
			.then(function(response) {
				$('.btn-delete.location-'+location_id).html('<i class="fa fa-fw fa-check"></i>');
				$scope.network_data.locations.splice(location_index, 1);
				$scope.getNetworkData();
			}, function(response) {
				$('.btn-delete.location-'+location_id).attr('disabled','');					
				$('.btn-delete.location-'+location_id).html('<i class="fa fa-fw fa-times"></i>');
				$('.btn-delete.location-'+location_id).removeClass('btn-info btn-default btn-danger btn-success');
				$('.btn-delete.location-'+location_id).addClass('btn-danger');
			});
	}

	$scope.confirmUser = function(user_index) {
		var user_id = $scope.network_data.users[user_index].id;			
		$('.btn-pending.user-'+user_id).attr('disabled','disabled');
		$('.btn-pending.user-'+user_id).html('<i class="fa fa-spin fa-refresh"></i>&nbsp;&nbsp;Confirming...');
		$('.btn-pending.user-'+user_id).removeClass('btn-info btn-default btn-danger btn-success');
		$('.btn-pending.user-'+user_id).addClass('btn-info');
		NetworkUsers.confirm({network_id:current_user_data.network.id, user_id:user_id})
			.$promise
			.then(function(response) {
				console.log(response);
				$scope.network_data.users[user_index] = response.data;					
				$('.btn-pending.user-'+user_id).html('<i class="fa fa-fw fa-check"></i>&nbsp;&nbsp;Confirmed');
				$('.btn-pending.user-'+user_id).removeClass('btn-info btn-default btn-danger btn-success');
				$('.btn-pending.user-'+user_id).addClass('btn-success');
			}, function(response) {
				$('.btn-pending.user-'+user_id).attr('disabled','');					
				$('.btn-pending.user-'+user_id).html('<i class="fa fa-fw fa-times"></i>&nbsp;&nbsp;Failed');
				$('.btn-pending.user-'+user_id).removeClass('btn-info btn-default btn-danger btn-success');
				$('.btn-pending.user-'+user_id).addClass('btn-danger');
			});

	}

	$scope.openEditUserModal = function(user_index) {
		var modalInstance = $modal.open({
				templateUrl: 'tpl/networks/settings_parts/modals/edit_user.html',
				controller: 'NetworkEditUserModal',
				size: 'lg',
				resolve: {
					user: function () {
						return $scope.network_data.users[user_index];
					},
					network_locations: function() {
						return $scope.network_data.locations;
					},
					roles: function() {
						return $scope.roles;
					}
				}
			});
			modalInstance.result.then(function(submit_data) {
				var _user_id = submit_data.id;
				$('.btn-update.user-'+_user_id).removeClass('btn-success btn-info');
				$('.btn-update.user-'+_user_id).addClass('btn-info');					
				$('.btn-update.user-'+_user_id).html('<i class="fa fa-fw fa-spin fa-refresh"></i>');
				NetworkLocations.update({network_id:current_user_data.network.id, location_id:_location_id}, submit_data)
					.$promise
					.then(function(response) {
						$('.btn-update.user-'+_user_id).removeClass('btn-success btn-info');
						$('.btn-update.user-'+_user_id).addClass('btn-success');
						$('.btn-update.user-'+_user_id).html('<i class="fa fa-fw fa-check"></i>');
						$scope.network_data.users[user_index] = response.data;
					}, function(response) {
						$('.btn-update.user-'+_user_id).html('<i class="fa fa-fw fa-times"></i>');
						toaster.pop('error', 'Oops.', response.data.detail);
					});
			});
	}

	$scope.deleteUser = function(user_index) {
		var user_id = $scope.network_data.users[user_index].id;
		$('.btn-delete.user-'+user_id).attr('disabled','disabled');
		$('.btn-delete.user-'+user_id).html('<i class="fa fa-spin fa-refresh"></i>');
		NetworkUsers.delete({network_id:current_user_data.network.id, user_id:user_id})
			.$promise
			.then(function(response) {
				$('.btn-delete.user-'+user_id).html('<i class="fa fa-fw fa-trash-o"></i>');
				$scope.network_data.users.splice(user_index, 1);
			}, function(response) {
				$('.btn-delete.user-'+user_id).html('<i class="fa fa-fw fa-trash-o"></i>');
				$('.btn-delete.user-'+user_id).attr('disabled','');
			});

	}

}]);