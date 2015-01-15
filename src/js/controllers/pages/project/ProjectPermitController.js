angular.module('app.controllers').controller('ProjectPermitController', [ 	'$scope',
																			'$stateParams',
																			'Auth',
																			'ProjectPermits',
																			'Permits',
																			'ChangePermitStatus',
																			'$modal',  function(   $scope,
																									$stateParams,
																									Auth,
																									ProjectPermits,
																									Permits,
																									ChangePermitStatus,
																									$modal ) {

	$scope.project_id               = $stateParams.project_id;
	$scope.permits_returned         = false;

	ProjectPermits.get({id:$stateParams.project_id})
		.$promise.then(function(res) {
			$scope.permits          = res.data
			$scope.permits_returned = true;
		});

	$scope.openPermitModal = function(permit_index, action) {
		var modalInstance = $modal.open({
			templateUrl: 'tpl/project/modals/permit.html',
			controller: 'ProjectPermitModalController',
			resolve: {
				permit: function() {
					return $scope.permits[permit_index];
				},
				action: function() {
					return action;
				}
			}
		});

		modalInstance.result.then(function(permit) {
			if (action == 'view') {
				return true;
			}

			$('.btn-edit.permit-'+permit.id).removeClass('text-center btn-danger btn-success');
			$('.btn-edit.permit-'+permit.id).addClass('text-center');
			$('.btn-edit.permit-'+permit.id).html('<i class="fa fa-fw fa-refresh fa-spin"></i>');

			Permits.update({id:permit.id}, permit)
				.$promise.then(function(res) {
					$('.btn-edit.permit-'+permit.id).removeClass('text-center btn-danger btn-success');
					$('.btn-edit.permit-'+permit.id).addClass('btn-success');
					$('.btn-edit.permit-'+permit.id).html('<i class="fa fa-fw fa-check"></i>');
					$('.btn-edit.permit-'+permit.id).prop('disabled', false);
					$scope.permits[permit_index] = res.data;
				}, function(response) {
					$('.btn-edit.permit-'+permit.id).removeClass('text-center btn-danger btn-success');
					$('.btn-edit.permit-'+permit.id).addClass('btn-danger');
					$('.btn-edit.permit-'+permit.id).html('<i class="fa fa-fw fa-times"></i>');
					$('.btn-edit.permit-'+permit.id).prop('disabled', false);
				});
		});
	};

	$scope.changePermitStatus = function(permit_index, _action, _status) {
		var permit  = $scope.permits[permit_index];
		$('.btn-edit.permit-'+permit.id).removeClass('text-center text-danger btn-danger btn-success');
		$('.btn-edit.permit-'+permit.id).addClass('text-center');
		$('.btn-edit.permit-'+permit.id).html('<i class="fa fa-fw fa-refresh fa-spin"></i>');

		ChangePermitStatus.update({id:permit.id, action:_action}, permit)
			.$promise.then(function(res) {
				$('.btn-edit.permit-'+permit.id).removeClass('text-center btn-danger btn-success');
				$('.btn-edit.permit-'+permit.id).addClass('btn-success');
				$('.btn-edit.permit-'+permit.id).html('<i class="fa fa-fw fa-check"></i>');
				$('.btn-edit.permit-'+permit.id).prop('disabled', false);
				$scope.permits[permit_index] = res.data;
			}, function(response) {
				$('.btn-edit.permit-'+permit.id).removeClass('text-center btn-danger btn-success');
				$('.btn-edit.permit-'+permit.id).addClass('btn-danger');
				$('.btn-edit.permit-'+permit.id).html('<i class="fa fa-fw fa-times"></i>');
				$('.btn-edit.permit-'+permit.id).prop('disabled', false);
			});
	};

	$scope.deletePermit = function(permit_index) {
		var permit_id = $scope.permits[permit_index].id;
		$('.btn-delete.permit-'+permit_id).removeClass('text-center text-danger btn-danger btn-success');
		$('.btn-delete.permit-'+permit_id).addClass('text-center');
		$('.btn-delete.permit-'+permit_id).html('<i class="fa fa-fw fa-refresh fa-spin"></i>');

		Permits.delete({id:permit_id})
			.$promise.then(function(res) {
				$scope.permits.splice(permit_index, 1);
			}, function(response) {
				$('.btn-delete.permit-'+permit_id).removeClass('text-center btn-danger btn-success');
				$('.btn-delete.permit-'+permit_id).addClass('btn-danger');
				$('.btn-delete.permit-'+permit_id).html('<i class="fa fa-fw fa-times"></i>');
				$('.btn-delete.permit-'+permit_id).prop('disabled', false);
			});
	};

}]);