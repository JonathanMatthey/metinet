angular.module('app.controllers').controller('UserSettingsController', [	'$scope',
																			'$state',
																			'Auth',
																			'User',
																			'Networks',
																			'Roles',
																			'$http',
																			'$modal', function(	$scope,
																								$state,
																								Auth,
																								User,
																								Networks,
																								Roles,
																								$http,
																								$modal	) {

	$scope.user_data 				= Auth.getCredential("user_data");
	$scope.user_has_network 		= Auth.getCredential("user_has_network");
	$scope.password_data			= {};
	$scope.network_request_status	= '';
	$scope.request_error			= null;
	$scope.network_request_error 	= null;
	var state_prefix				= 'app.page.settings.'

	$scope.settings_menu	= [
		{
			state: 	state_prefix+'account',
			name: 	'Account Settings',
			icon: 	'fa-globe',
		},
		{
			state: 	state_prefix+'network',
			name: 	'Network Settings',
			icon: 	'fa-building-o',
		},
		{
			state: 	state_prefix+'email_notifications',
			name: 	'Email Notification Settings',
			icon: 	'fa-envelope-o',
		},
		{
			state: 	state_prefix+'password',
			name: 	'Password Settings',
			icon: 	'fa-lock',
		},
		{
			state: 	state_prefix+'privacy',
			name: 	'Privacy Settings',
			icon: 	'fa-eye',
		}
	];

	$scope.network_init		= function() {
		executeNetworkStatus();
	}

	Networks.get()
		.$promise.then(function(response) {
			$scope.networks = response.data;
		}, function(response) {

		});

	Roles.get()
		.$promise.then(function(response) {
			$scope.roles = response.data;
		}, function(response) {

		});

	$scope.saveSettings = function(action_value) {
		$scope.request_error = null;
		$('.'+action_value+'-submit-btn').html('<i class="fa fa-spin fa-refresh"></i>&nbsp;&nbsp;Saving...');
		$('.'+action_value+'-submit-btn').removeClass('btn-primary btn-success btn-danger btn-info');
		$('.'+action_value+'-submit-btn').addClass('btn-info');
		User.put({}, $scope.user_data)
			.$promise
			.then(function(response) {
				$('.'+action_value+'-submit-btn').html('<i class="fa fa-fw fa-check"></i>&nbsp;&nbsp;Saved');
				$('.'+action_value+'-submit-btn').removeClass('btn-primary btn-success btn-danger btn-info');
				$('.'+action_value+'-submit-btn').addClass('btn-success');
				Auth.resetUserData(response.data);
			}, function(response) {
				$('.'+action_value+'-submit-btn').html('<i class="fa fa-fw fa-times"></i>&nbsp;&nbsp;Failed');
				$('.'+action_value+'-submit-btn').removeClass('btn-primary btn-success btn-danger btn-info');
				$('.'+action_value+'-submit-btn').addClass('btn-danger');
				$scope.request_error = response.data.msg.text;
			});
	};

	$scope.savePassword = function() {
		$scope.request_error = null;
		$('.password-submit-btn').html('<i class="fa fa-spin fa-refresh"></i>&nbsp;&nbsp;Saving...');
		$('.password-submit-btn').removeClass('btn-primary btn-success btn-danger btn-info');
		$('.password-submit-btn').addClass('btn-info');
		var use = User.put({userId:'password'}, $scope.password_data)
			.$promise
			.then(function(response) {
				$('.password-submit-btn').html('<i class="fa fa-fw fa-check"></i>&nbsp;&nbsp;Saved');
				$('.password-submit-btn').removeClass('btn-primary btn-success btn-danger btn-info');
				$('.password-submit-btn').addClass('btn-success');
				//	Reset Credentials, otherwise all routes will fail.
				Auth.setCredentials($scope.user_data.email, $scope.password_data.password_new, response.data);
			}, function(response) {
				console.log(response);
				$('.password-submit-btn').html('<i class="fa fa-fw fa-times"></i>&nbsp;&nbsp;Failed');
				$('.password-submit-btn').removeClass('btn-primary btn-success btn-danger btn-info');
				$('.password-submit-btn').addClass('btn-danger');
				$scope.request_error = response.data.msg.text;
			});
	};

	$scope.changeAction = function(value) {
		$scope.settings_action	= value;
	};

	$scope.changeNetwork = function() {
		$scope.network_request_error = null;
		var modalInstance = $modal.open({
				templateUrl: 'tpl/user_settings/modals/change_network.html',
				controller: 'ChangeNetworkModal',
				size: 'md',
				resolve: {
					networks: function () {
						return $scope.networks;
					}
				}
			});
			modalInstance.result.then(function(submit_data) {
				$('.change-network-btn').html('<i class="fa fa-spin fa-refresh"></i>&nbsp;&nbsp;Requesting...');
				$('.change-network-btn').removeClass('btn-primary btn-success btn-danger btn-info');
				$('.change-network-btn').addClass('btn-info');
				User.put({}, { network_id: submit_data })
					.$promise
					.then(function(response) {
						$('.change-network-btn').html('<i class="fa fa-fw fa-check"></i>&nbsp;&nbsp;Changed');
						$('.change-network-btn').removeClass('btn-primary btn-success btn-danger btn-info');
						$('.change-network-btn').addClass('btn-success');
						$scope.user_data = response.data;
						Auth.resetUserData(response.data);

						$scope.user_data 		= Auth.getCredential("user_data");
						$scope.user_has_network	= Auth.getCredential("user_has_network");

						executeNetworkStatus()

					}, function(response) {
						$('.change-network-btn').html('<i class="fa fa-fw fa-times"></i>&nbsp;&nbsp;Failed');
						$('.change-network-btn').removeClass('btn-primary btn-success btn-danger btn-info');
						$('.change-network-btn').addClass('btn-danger');
						$scope.network_request_error = response.data.msg;
					});
			});
	};

	var executeNetworkStatus = function() {
		if ($scope.user_data.network) {
			var status = ($scope.user_data.network.pivot.network_confirm) ? 'Confirmed' : 'Pending';
			$scope.network_request_status = {
				colour: ($scope.user_data.network.pivot.network_confirm) ? 'success' : 'info',
				text: ($scope.user_data.network.pivot.network_confirm) ? 'Confirmed' : 'Pending'
			}
		} else {
			$scope.network_request_status = {
				colour: 'warning',
				text: 'Not Part of A Network'
			}
		}
	}

}]);