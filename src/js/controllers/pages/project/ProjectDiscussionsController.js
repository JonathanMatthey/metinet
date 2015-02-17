angular.module('app.controllers').controller('ProjectDiscussionsController', [  '$scope',
																				'$stateParams',
																				'ProjectDiscussions',	function(	$scope,
																													$stateParams,
																													ProjectDiscussions	)
{
	$scope.discussions_returned	= false;

	ProjectDiscussions.get({project_id:$stateParams.project_id})
		.$promise.then(function(response) {
			$scope.discussions_returned	= true;
			$scope.discussions 	= response.data;
			$('.footable').footable();
		});

}]);