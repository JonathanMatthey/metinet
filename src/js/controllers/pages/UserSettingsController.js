angular.module('app.controllers').controller('UserSettingsController', [	'$scope',
																			'$state',
																			'$window',
																			'Auth',
																			'User',
																			'Networks',
																			'Roles',											
																			'$http',
																			'$modal',
																			'toaster', function(	$scope,
																									$state,
																									$window,
																									Auth,
																									User,
																									Networks,
																									Roles,
																									$http,
																									$modal,
																									toaster 	) {

	var current_user_data 			= Auth.getCredential("user_data");
	$scope.password_data			= {};
	$scope.settings_action			= 'account';
	$scope.network_request_status	= '';
	$scope.request_error			= null;
	$scope.network_request_error 	= null;	
	var template_directory			= 'tpl/user_settings/sections/';

	$scope.settings_menu	= [
		{
			action: 'account',
			name: 	'Account Settings',
			icon: 	'fa-globe',
			tpl: 	template_directory+'account_settings.html'
		},
		{
			action: 'network',
			name: 	'Network Settings',
			icon: 	'fa-lock',
			tpl: 	template_directory+'network_settings.html'				
		},
		{
			action: 'email-notifications',
			name: 	'Email Notification Settings',
			icon: 	'fa-envelope-o',
			tpl: 	template_directory+'email_notification_settings.html'				
		},
		{
			action: 'password',
			name: 	'Password Settings',
			icon: 	'fa-lock',
			tpl: 	template_directory+'change_password.html'				
		},
		{
			action: 'privacy',
			name: 	'Privacy Settings',
			icon: 	'fa-lock',
			tpl: 	template_directory+'privacy_settings.html'				
		}						
	];

	User.get({userId:current_user_data.id})
		.$promise
		.then(function(response) {
			$scope.user_data = response.data;
			if (response.data.network) {
				var status = (response.data.network.pivot.network_confirm) ? 'Confirmed' : 'Pending';
				$scope.network_request_status = {
					colour: (response.data.network.pivot.network_confirm) ? 'success' : 'info',
					text: (response.data.network.pivot.network_confirm) ? 'Confirmed' : 'Pending'
				}
			} else {
				$scope.network_request_status = {
					colour: 'warning',
					text: 'Not Part of A Network'
				}
			}
			$scope.network_request_status
		}, function(response) {

		});

	Networks.get()
		.$promise
		.then(function(response) {
			$scope.networks = response.data;
		}, function(response) {

		});

	Roles.get()
		.$promise
		.then(function(response) {
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
					}, function(response) {
						$('.change-network-btn').html('<i class="fa fa-fw fa-times"></i>&nbsp;&nbsp;Failed');
						$('.change-network-btn').removeClass('btn-primary btn-success btn-danger btn-info');
						$('.change-network-btn').addClass('btn-danger');
						$scope.network_request_error = response.data.msg;
					});
			});
	};

}]);