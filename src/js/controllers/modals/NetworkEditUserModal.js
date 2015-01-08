angular.module('app.controllers').controller('NetworkEditUserModal', [	'$scope',
																			'$modalInstance',
																			'user',
																			'network_locations',
																			'roles',	function(	$scope,
																									$modalInstance,
																									user,
																									network_locations,
																									roles	) {

	$scope.submit_data 	= {
		id: user.id,
		firstname: user.firstname,
		lastname: user.lastname,
		email: user.email,
		tel: user.tel,
		headline: user.headline,
		location: user.network.pivot.location,
		office_ext: user.office_ext,
		project_auto_access: (user.network.pivot.project_auto_access) ? true : false,
		role: user.network.pivot.role,
		pm_mail_project_updates: user.pm_mail_project_updates,
		pm_mail_daily_report: user.pm_mail_daily_report,
		pm_mail_daily_report_nothing_due: user.pm_mail_daily_report_nothing_due,
		pm_mail_weekend: user.pm_mail_weekend,
		pm_mail_task_completion: user.pm_mail_task_completion
	};

	$scope.network_locations 	= network_locations;
	$scope.roles 				= roles;		

	$scope.ok = function () {
		$modalInstance.close($scope.submit_data);
	};

	$scope.cancel = function () {
		$modalInstance.dismiss('cancel');
	};

}]);