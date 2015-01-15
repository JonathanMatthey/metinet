angular.module('app.controllers').controller('ProjectNetworksSettingsController', [ '$scope',
																					'$stateParams',
																					'ProjectNetworks',
																					'$modal',
																					'toaster',  	function(   $scope,
																												$stateParams,
																												ProjectNetworks,
																												$modal,
																												toaster ) {

	ProjectNetworks.get({id:$stateParams.project_id})
		.$promise.then(function(res) {
			$scope.projectNetworks          = res.data.networks;
			$scope.potential_networks       = res.data.potential_networks;
			$scope.networks_except_users    = res.data.networks_except_users;
		});

	$scope.removeNetwork = function(network_index) {
		var _network_id = $scope.projectNetworks[network_index].id;
		$('.btn-remove.network-'+_network_id).html('<i class="fa fa-fw fa-spin fa-refresh"></i>');
		$('.btn-remove.network-'+_network_id).removeClass('btn-danger btn-default');
		$('.btn-remove.network-'+_network_id).addClass('btn-default');
		ProjectNetworks.delete({id:$stateParams.project_id, network_id:_network_id})
			.$promise.then(function(response) {
				$scope.projectNetworks.splice(network_index, 1);
				$scope.potential_networks = response.data.potential_networks;
				$scope.getProjectUsers();
			}, function(response) {
				$('.btn-remove.network-'+_network_id).html('<i class="fa fa-fw fa-times"></i>');
				$('.btn-remove.network-'+_network_id).removeClass('btn-danger btn-default');
				$('.btn-remove.network-'+_network_id).addClass('btn-danger');
				toaster.pop('error', '', response.data.detail);
			});
	}

	$scope.addNetworkModal = function() {
		$('.add-network-modal-btn').prop('disabled', true);
		var modalInstance = $modal.open({
			templateUrl: 'tpl/project/modals/add_network.html',
			controller: 'ProjectAddNetworkModalController',
			resolve: {
				networks: function () {
					return $scope.potential_networks;
				}
			}
		});

		modalInstance.result.then(function(requested_network_data) {
			$('.add-network-modal-btn').removeClass('text-center btn-danger btn-primary');
			$('.add-network-modal-btn').addClass('text-center btn-primary');
			$('.add-network-modal-btn').html('<i class="fa fa-fw fa-refresh fa-spin"></i>');
			ProjectNetworks.save({id:$stateParams.project_id, network_id:requested_network_data.id})
				.$promise.then(function(response) {
					$('.add-network-modal-btn').removeClass('text-center btn-danger btn-primary');
					$('.add-network-modal-btn').addClass('btn-primary');
					$('.add-network-modal-btn').html('<i class="fa fa-fw fa-plus"></i>&nbsp;&nbsp;Add Network');
					$('.add-network-modal-btn').prop('disabled', false);
					$scope.projectNetworks      = response.data.networks;
					$scope.potential_networks   = response.data.potential_networks;
					$scope.getProjectUsers();
				}, function(response) {
					$('.add-network-modal-btn').removeClass('text-center btn-danger btn-primary');
					$('.add-network-modal-btn').addClass('btn-danger');
					$('.add-network-modal-btn').html('<i class="fa fa-fw fa-plus"></i>&nbsp;&nbsp;Add Network');
					$('.add-network-modal-btn').prop('disabled', false);
				});
		});
	}

}]);