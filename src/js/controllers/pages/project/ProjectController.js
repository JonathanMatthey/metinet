angular.module('app.controllers').controller('ProjectController', [ '$scope',
																	'$stateParams',
																	'Project',
																	'ProjectAudit',	function(   $scope,
																								$stateParams,
																								Project,
																								ProjectAudit ) {

	$scope.project_id               = $stateParams.project_id;
	$scope.project 					= {};
	$scope.user_action              = $stateParams.action;
	$scope.user_admin_level         = 3;

	$scope.init = function() {
		initialiseWebSockets();
	}

	initialiseWebSockets = function() {
		var channel = pusher.subscribe('Project_'+$stateParams.project_id);
		channel.bind('audit-trail', function(data) {
			console.log(data);
			$scope.projectAudit.unshift(data[0]);
			$scope.projectAudit.pop();
			$scope.$apply();
		});
	};

	Project.get({id:$stateParams.project_id})
		.$promise.then(function(res) {
			$scope.project 				= res.data;
			$scope.user_admin_level		= res.data.pivot.role;
		});

	ProjectAudit.get({id:$stateParams.project_id})
		.$promise.then(function(res) {
			// success handler
			$scope.projectAudit = res.data
		});

}]);