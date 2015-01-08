angular.module('app.controllers').controller('NetworkCreateController', [	'$scope',
																			'$stateParams',
																			'Networks',
																			'AccountTypes',	function(	$scope,
																										$stateParams,
																										Networks,
																										AccountTypes 	) {

	$scope.request_error 	= false;
	$scope.account_types 	= {};
	$scope.network 			= {};

	AccountTypes.get().$promise
		.then(function(response) {
			$scope.account_types 		= response.data;
			$scope.network.subscription	= response.data[1].id;
		}, function(response) {

		});

	$scope.change_subscription = function(value) {
		$scope.network.subscription = value;
	}

	$scope.submit = function() {

		$scope.request_error = null;			
		$('.submit-btn').html('<i class="fa fa-spin fa-refresh"></i>&nbsp;&nbsp;Saving...');
		$('.submit-btn').removeClass('btn-success btn-danger');
		$('.submit-btn').addClass('btn-primary');
		Networks.store()
			.$promise
			.then(function(response) {
				$('.submit-btn').html('<i class="fa fa-fw fa-check"></i>&nbsp;&nbsp;Saved');
				$('.submit-btn').removeClass('btn-primary');
				$('.submit-btn').addClass('btn-success');
			}, function(response) {
				$('.submit-btn').html('<i class="fa fa-fw fa-times"></i>&nbsp;&nbsp;Failed');
				$('.submit-btn').removeClass('btn-primary');
				$('.submit-btn').addClass('btn-danger');
				$scope.request_error = response.data.msg.text;
			});

	}

}]);