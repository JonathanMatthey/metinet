angular.module('app.controllers').controller('ProjectAuditHistoryController', [ '$scope',
																				'$modal',
																				'$stateParams',
																				'ProjectAudit',	function(   $scope,
																											$modal,
																											$stateParams,
																											ProjectAudit ) {

	$scope.full_audit = $scope.$parent.projectAudit;
	console.log($scope.full_audit);

	ProjectAudit.get({project_id:$stateParams.project_id})
		.$promise.then(function(res) {
			$scope.full_audit = res.data;
		});

	$scope.viewAuditItem	= function(audit_item_index) {
		var modalInstance = $modal.open({
			templateUrl: 'tpl/project/modals/audit_item.html',
			controller: 'ProjectAuditItemModalController',
			resolve: {
				audit_item: function() {
					return $scope.full_audit[audit_item_index];
				}
			}
		});
	}

}]);