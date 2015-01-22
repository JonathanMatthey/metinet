angular.module('app.controllers').controller('ProjectListController', [	'$scope',
																		'Project',
																		'$rootScope', 	function(	$scope,
																									Project,
																									$rootScope 	) {

	$scope.projects_returned 	= false;

	$rootScope.$watchCollection('user_projects', function(new_value) {
		if (new_value) {
			$scope.projects 			= new_value;
			$scope.projects_returned 	= true;
		} else {
			Project.query().$promise
				.then(function(response) {
					$rootScope.user_projects 	= response.data;
				});
		}
	});

}]);