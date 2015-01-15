angular.module('app.controllers').controller('ProjectGeneralSettingsController', [ 	'$scope',
																					'$stateParams',
																					'Project',
																					'$modal',  	function(   $scope,
																											$stateParams,
																											Project,
																											$modal ) {
	Project.get({id:$stateParams.project_id})
		.$promise.then(function(response) {
			$scope.project_settings 				= response.data;
			$scope.project_settings.country_id 		= response.data.country.iso;
			$scope.project_settings.currency_id 	= response.data.currency.currency_id;
			$scope.project_settings.working_hours 	= response.data.working_hours;
			$scope.project_settings.working_days 	= response.data.working_days;
		});

	$scope.submitSettings   = function() {
		$('.btn-submit').removeClass('text-center btn-danger btn-success btn-primary');
		$('.btn-submit').addClass('btn-primary text-center');
		$('.btn-submit').html('<i class="fa fa-fw fa-refresh fa-spin"></i>');
		Project.update({id:$stateParams.project_id}, $scope.project_settings)
			.$promise.then(function(response) {
				$('.btn-submit').removeClass('text-center btn-danger btn-success btn-primary');
				$('.btn-submit').addClass('text-center btn-primary');
				$('.btn-submit').html('Save');
				$scope.project          = response.data;
				$scope.user_admin_level = response.data.pivot.role;
			}, function(response) {
				$('.btn-submit').removeClass('text-center btn-danger btn-success btn-primary');
				$('.btn-submit').addClass('btn-danger');
				$('.btn-submit').html('<i class="fa fa-fw fa-times"></i>');
			});
	}

}]);