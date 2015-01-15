angular.module('app.controllers').controller('ProjectTrackingSettingsController', [ '$scope',
																					'$stateParams',
																					'Project',  	function(   $scope,
																												$stateParams,
																												Project ) {

	Project.get({id:$stateParams.id})
		.$promise.then(function(response) {
			$scope.project_settings 				= response.data;
			$scope.project_settings.country_id 		= response.data.country.iso;
			$scope.project_settings.currency_id 	= response.data.currency.currency_id;
			$scope.project_settings.working_hours 	= response.data.working_hours;
			$scope.project_settings.working_days 	= response.data.working_days;			
		});

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