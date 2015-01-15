angular.module('app.controllers').controller('ProjectLocationSettingsController', [ '$scope',
																					'$stateParams',
																					'Project',
																					'$modal',
																					'uiGmapGoogleMapApi',
																					'Countries',
																					'Currencies',  	function(   $scope,
																												$stateParams,
																												Project,
																												$modal,
																												uiGmapGoogleMapApi,
																												Countries,
																												Currencies ) {
	$scope.map 						= { 
										center: { latitude: 51.5000, longitude: 0.1333 },
										zoom: 10,
										options: { scrollwheel: false }
									};
	$scope.marker 					= { 
										id: 0,
										coords: { latitude: 0, longitude: 0 },
									};
	$scope.marker_moved 			= false;

	Project.get({id:$stateParams.id})
		.$promise.then(function(res) {
			$scope.project 							= res.data;
			$scope.project_settings					= res.data;
			$scope.user_admin_level					= res.data.pivot.role;

			$scope.project_settings.country_id 		= res.data.country.iso;
			$scope.project_settings.currency_id 	= res.data.country.currency_id;
			$scope.project_settings.working_hours 	= res.data.working_hours;
			$scope.project_settings.working_days 	= res.data.working_days;

			$scope.map = { 
					center: { 
						latitude: res.data.lat,
						longitude: res.data.lng
					},
					zoom: 10,
					options: {
						scrollwheel: false
					}
				};

			$scope.marker = {
					id: 0,
					coords: {
						latitude: res.data.lat,
						longitude: res.data.lng
					},
					options: { draggable: true },
					events: {
						dragend: function(marker, eventName, args) {
							$('#map-request-result').removeClass('alert-info alert-warning');
							$('#map-request-result').addClass('alert-info');
							$('#map-request-result').html('<i class="fa fa-fw fa-spin fa-refresh"></i>&nbsp;&nbsp;Loading country data...');
							$scope.marker_moved = true;
							$scope.map_request	= true;
							var coords = {
								lat: marker.getPosition().lat(),
								lng: marker.getPosition().lng()
							};
							$scope.project_settings.lat = marker.getPosition().lat();
							$scope.project_settings.lng = marker.getPosition().lng();								
							Countries.findByCoords({action:'query'}, coords)
								.$promise.then(function(res) {
									$scope.project_settings.country_id = res.data.iso;
									$scope.project_settings.currency_id = res.data.currency_id;
									$scope.project_settings.working_hours = res.data.working_hours;
									$scope.project_settings.working_days = res.data.working_days;
									$scope.marker_moved = false;
									$scope.map_request	= false;
								}, function(res) {
									$('#map-request-result').removeClass('alert-info alert-warning');
									$('#map-request-result').addClass('alert-warning');
									$('#map-request-result').html('It appears you did not select a land mass.  Please select the data below manually.');
									$scope.marker_moved = false;										
								});
						}
					}
				};
		});

	Countries.get()
		.$promise.then(function(response) {
			$scope.countries = response.data;
		});

	Currencies.get()
		.$promise.then(function(response) {
			$scope.currencies = response.data;
		});

	$scope.submitSettings   = function(action) {
		$('.btn-submit.'+action).removeClass('text-center btn-danger btn-success btn-primary');
		$('.btn-submit.'+action).addClass('btn-primary text-center');
		$('.btn-submit.'+action).html('<i class="fa fa-fw fa-refresh fa-spin"></i>');
		Project.update({id:$stateParams.id}, $scope.project_settings)
			.$promise.then(function(res) {
				$('.btn-submit.'+action).removeClass('text-center btn-danger btn-success btn-primary');
				$('.btn-submit.'+action).addClass('text-center btn-primary');
				$('.btn-submit.'+action).html('Save');
				$scope.project          = res.data;
				$scope.user_admin_level = res.data.pivot.role;
			}, function(response) {
				$('.btn-submit.'+action).removeClass('text-center btn-danger btn-success btn-primary');
				$('.btn-submit.'+action).addClass('btn-danger');
				$('.btn-submit.'+action).html('<i class="fa fa-fw fa-times"></i>');
			}); 
	}

}]);