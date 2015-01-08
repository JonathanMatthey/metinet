angular.module('app.controllers').controller('ProjectListController', [	'$scope',
																			'$document',
																			'$state',
																			'$window',
																			'Project', 	function(	$scope,
																									$document,
																									$state,
																									$window,
																									Project 	) {
	Project.query().$promise
		.then(function(res) {
			$scope.projects = res;
		});
}]);