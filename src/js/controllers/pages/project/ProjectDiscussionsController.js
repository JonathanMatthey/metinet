angular.module('app.controllers').controller('ProjectDiscussionsController', [  '$scope',
																				'$stateParams',
																				'ProjectDiscussions',	function(	$scope,
																													$stateParams,
																													ProjectDiscussions	) {


	ProjectDiscussions.get({project_id:$stateParams.project_id})
		.$promise.then(function(response) {
			$scope.discussions 	= response.data;
			$('.footable').footable();
		});

}]);