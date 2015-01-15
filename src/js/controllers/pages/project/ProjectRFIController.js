angular.module('app.controllers').controller('ProjectRFIController', [ 	'$scope',
																		'$stateParams',
																		'ProjectRFIs',
																		'$modal',  	function(   $scope,
																								$stateParams,
																								ProjectRFIs,
																								$modal ) {

	$scope.project_id               = $stateParams.project_id;
	$scope.project_rfis_returned    = false;

	ProjectRFIs.get({id:$stateParams.project_id})
		.$promise.then(function(res) {
			$scope.projectRFIs 				= res.data;
			$scope.project_rfis_returned    = true;
		});

	$scope.openRfi = function(rfi_index, action) {
		var rfi_id = $scope.projectRFIs[rfi_index].id;
		$('.btn-'+action+'.rfi-'+rfi_id).prop('disabled', true);
		var modalInstance = $modal.open({
			templateUrl: 'tpl/project/modals/rfi.html',
			controller: 'ProjectRFIModalController',
			size: 'md',
			resolve: {
				rfi: function () {
					return $scope.projectRFIs[rfi_index];
				},
				action: function() {
					return action;
				}
			}
		});

		modalInstance.result.then(function(rfi) {
			if (rfi == 'cancel') {
				return false;
			}
			if (action != 'edit' && action != 'respond') {
				return true;
			}

			$('.btn-'+action+'.rfi-'+rfi_id).removeClass('text-center btn-danger btn-primary btn-success');
			$('.btn-'+action+'.rfi-'+rfi_id).addClass('text-center btn-primary');
			$('.btn-'+action+'.rfi-'+rfi_id).html('<i class="fa fa-fw fa-refresh fa-spin"></i>');

			ProjectRFIs.update({"id":$stateParams.project_id, "rfi_id":rfi_id}, rfi)
				.$promise.then(function(response) {
					$('.btn-'+action+'.rfi-'+rfi_id).removeClass('text-center btn-danger btn-primary btn-success');
					$('.btn-'+action+'.rfi-'+rfi_id).addClass('btn-success');
					$('.btn-'+action+'.rfi-'+rfi_id).html('<i class="fa fa-fw fa-check"></i>');
					$('.btn-'+action+'.rfi-'+rfi_id).prop('disabled', false);
				}, function(response) {
					$('.btn-'+action+'.rfi-'+rfi_id).removeClass('text-center btn-danger btn-primary btn-success');
					$('.btn-'+action+'.rfi-'+rfi_id).addClass('btn-danger');
					$('.btn-'+action+'.rfi-'+rfi_id).html('<i class="fa fa-fw fa-times"></i>');
					$('.btn-'+action+'.rfi-'+rfi_id).prop('disabled', false);
				});
		});
	};

	$scope.newRFI = function() {
		var modalInstance = $modal.open({
			templateUrl: 'tpl/project/modals/new_rfi.html',
			controller: 'ProjectNewRFIModalController',
			size: 'md',
			resolve: {
				possible_networks: function () {
					return $scope.networks_except_users;
				}
			}
		});

		modalInstance.result.then(function(rfi) {

			$('.new-rfi-modal-btn').removeClass('text-center btn-danger btn-primary btn-success');
			$('.new-rfi-modal-btn').addClass('text-center btn-primary');
			$('.new-rfi-modal-btn').html('<i class="fa fa-fw fa-refresh fa-spin"></i>');

			ProjectRFIs.store({"id":$stateParams.project_id}, rfi)
				.$promise.then(function(response) {
					$('.new-rfi-modal-btn').removeClass('text-center btn-danger btn-primary btn-success');
					$('.new-rfi-modal-btn').addClass('btn-success');
					$('.new-rfi-modal-btn').html('<i class="fa fa-fw fa-check"></i>');
					$('.new-rfi-modal-btn').prop('disabled', false);
					$scope.projectRFIs  = response.data;
				}, function(response) {
					$('.new-rfi-modal-btn').removeClass('text-center btn-danger btn-primary btn-success');
					$('.new-rfi-modal-btn').addClass('btn-danger');
					$('.new-rfi-modal-btn').html('<i class="fa fa-fw fa-times"></i>');
					$('.new-rfi-modal-btn').prop('disabled', false);
				});
		});

		// Return button to original state after 3 seconds.
		setTimeout(function() {
			$('.new-rfi-modal-btn').removeClass('text-center btn-danger btn-primary btn-success');
			$('.new-rfi-modal-btn').addClass('text-center btn-primary');
			$('.new-rfi-modal-btn').html('<i class="fa fa-fw fa-plus"></i>&nbsp;&nbsp;Add New RFI');
		}, 3000);

	};

}]);