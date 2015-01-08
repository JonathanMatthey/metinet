angular.module('app.controllers').controller('ProjectCreateController', [	'$scope',
																			'$state', 
																			'$window', 
																			'$http', 
																			'Auth', 
																			'Project', 
																			'moment', 
																			'toaster', function(	$scope,
																									$state,
																									$window,
																									$http,
																									Auth,
																									Project,
																									moment,
																									toaster 	) {
		
	$scope.project 						= new Project();
	$scope.projectCountry 				= {};
	$scope.project.name 				= "Big New Project";
	$scope.project.lat 					= 1.1;
	$scope.project.lng 					= 2.2;
	$scope.project.client_name 			= "JCB";
	$scope.project.contractor_name 		= "Mr Contractor";
	$scope.project.consultant_name 		= "Mrs Consultant";
	$scope.project.start_date 			= new moment().format("DD-MMMM-YYYY");//new moment().format("YYYY-MM-DD 00:00:00");
	$scope.project.end_date_contract 	= new moment().add(6, 'M').format("DD-MMMM-YYYY");
	$scope.project.progress_reports 	= true;
	$scope.project.long_lead_items 		= true;
	$scope.project.risk_assessment 		= true;
	$scope.project.permit_assessment 	= true;
	$scope.project.cost_management 		= true;
	$scope.project.terms 				= true;

	$http.get('http://api.metinet.co/countries').then(function (resp) {
		$scope.countries = resp.data.data;
		console.log('$scope.countries ')
		console.log($scope.countries )
		$scope.projectCountry = $scope.countries[1];
	});

	$http.get('http://api.metinet.co/currencies').then(function (resp) {
		$scope.currencies = resp.data.data;
		console.log('$scope.currencies' )
		console.log($scope.currencies )
	});

	$scope.updateCountry = function(country) {
		$scope.project.country_id = country.iso
		$scope.project.working_hours = country.working_hours;
		$scope.project.working_days = country.working_days;
	}

	$scope.updateCurrency = function(currency) {
		$scope.project.currency_id = currency.code
	}

	$scope.create = function() {
		console.log($scope.project);
		toaster.pop('wait', 'Saving Project', 'Shouldn\'t take long...');
		$scope.project.$save( function(data) {
			if(!data.result){
				toaster.pop('error', 'Error', '');
			} else {
				toaster.pop('success', 'Success', '');
				setTimeout(function() {
					$state.go('app.page.projects');
				}, 1500);
			}
		});
	};
}]);