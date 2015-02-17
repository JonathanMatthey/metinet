angular.module('app.controllers').controller('NetworkCreateController', [	'$scope',
																			'$state',
																			'$stateParams',
																			'$http',
																			'Auth',
																			'Networks',
																			'AccountTypes',	function(	$scope,
																										$state,
																										$stateParams,
																										$http,
																										Auth,
																										Networks,
																										AccountTypes 	) {

	$scope.request_error 	= false;
	$scope.account_types 	= {};
	$scope.network 			= {};

	$scope.change_subscription 	= function(value) {
		$scope.network.subscription = value;
	}

	$scope.searchCompanies		= function(value) {
		$http.get('https://api.linkedin.com/v1/company-search:(companies:(id,name,universal-name,website-url,industries,status,logo-url,blog-rss-url,twitter-id,employee-count-range,specialties,locations,description,stock-exchange,founded-year,end-year,num-followers))', {
				keywords: value,
				oauth2_access_token: '77q6eqq38byw5y',
				format: 'json'
			}).success(function(data, status, headers, config) {
				console.log(data);
			})
			.error(function(data, status, headers, config) {
			// called asynchronously if an error occurs
			// or server returns response with an error status.
			});
		console.log(value);
	}

	$scope.submit = function() {

		$scope.request_error = null;
		$('.submit-btn').html('<i class="fa fa-spin fa-refresh"></i>&nbsp;&nbsp;Saving...');
		$('.submit-btn').removeClass('btn-success btn-danger');
		$('.submit-btn').addClass('btn-primary');
		Networks.store({}, $scope.new_network)
			.$promise.then(function(response) {
				$('.submit-btn').html('<i class="fa fa-fw fa-check"></i>&nbsp;&nbsp;Saved');
				$('.submit-btn').removeClass('btn-primary');
				$('.submit-btn').addClass('btn-success');
				Auth.resetUserData(response.data.user_data);
				$state.go('app.page.network_settings');
			}, function(response) {
				console.log(response);
				$('.submit-btn').html('<i class="fa fa-fw fa-times"></i>&nbsp;&nbsp;Failed');
				$('.submit-btn').removeClass('btn-primary');
				$('.submit-btn').addClass('btn-danger');
				$scope.request_error = response.data.msg.text;
			});

	}

}]);