angular.module('app.controllers').controller('ProjectListController', [	'$scope',
																		'Project',
																		'$rootScope', 	function(	$scope,
																									Project,
																									$rootScope 	) {

	$rootScope.$watchCollection('user_projects', function(new_value) {
		if (new_value) {
			$scope.projects = new_value;
		} else {
			Project.query();
		}
	});

}]);