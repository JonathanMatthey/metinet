angular.module('app.controllers').controller('ProjectController', [ '$scope',
																	'$rootScope',
																	'$state',
																	'$stateParams',
																	'Project',
																	'ProjectAudit',
																	'ProjectJobs',	function(   $scope,
																								$rootScope,
																								$state,
																								$stateParams,
																								Project,
																								ProjectAudit,
																								ProjectJobs ) {

	$scope.project_id               = $stateParams.project_id;
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

		channel.bind('jobs-updated', function(data) {
			console.log(data);
			$scope.current_jobs 	= data.current_jobs;
			$scope.completed_jobs 	= data.completed_jobs;
			$scope.$apply();
		});
	};

	Project.get({id:$stateParams.project_id})
		.$promise.then(function(res) {
			$scope.project 				= res.data;
			$scope.user_admin_level		= res.data.pivot.role;
			$rootScope.current_project	= res.data;
		}, function(res) {
			if (res.status == 403) {
				$state.go('app.home');
			}
		});

	ProjectAudit.get({project_id:$stateParams.project_id})
		.$promise.then(function(res) {
			// success handler
			$scope.projectAudit = res.data
		});

	ProjectJobs.get({project_id:$stateParams.project_id})
		.$promise.then(function(res) {
			$scope.current_jobs 	= res.data.current_jobs;
			$scope.completed_jobs 	= res.data.completed_jobs;
		});

}]);