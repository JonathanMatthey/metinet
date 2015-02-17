angular.module('app.controllers').controller('ProjectCreateController', [	'$scope',
																			'$rootScope',
																			'$state',
																			'Countries',
																			'Currencies',
																			'Networks',
																			'Project', 	function(	$scope,
																									$rootScope,
																									$state,
																									Countries,
																									Currencies,
																									Networks,
																									Project	) {
	$scope.new_project 					= {};
	$scope.new_project.lat 				= 51.5085300;
	$scope.new_project.lng 				= -0.1257400;
	$scope.new_project.country_id 		= 'GB';
	$scope.new_project.currency_id 		= 'GBP';
	$scope.new_project.working_hours 	= 8;
	$scope.new_project.working_days 	= 5;

	$scope.steps = {
		step1: false,
		step2: false,
		step3: false,
		step4: false
	}

	$scope.marker_moved 				= false;

	$scope.map = {
			center: {
				latitude: $scope.new_project.lat,
				longitude: $scope.new_project.lng
			},
			zoom: 8,
			options: {
				scrollwheel: false
			}
		};

	$scope.marker = {
			id: 0,
			coords: {
				latitude: $scope.new_project.lat,
				longitude: $scope.new_project.lng
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
					$scope.new_project.lat = marker.getPosition().lat();
					$scope.new_project.lng = marker.getPosition().lng();
					Countries.findByCoords({action:'query'}, coords)
						.$promise.then(function(res) {
							console.log(res);
							$scope.new_project.country_id 		= res.data.iso;
							$scope.new_project.currency_id 		= res.data.currency_id;
							$scope.new_project.working_hours 	= res.data.working_hours;
							$scope.new_project.working_days 	= res.data.working_days;
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

	Countries.get()
		.$promise.then(function(res) {
			$scope.countries = res.data;
			console.log($scope.countries);
		});

	Currencies.get()
		.$promise.then(function(res) {
			$scope.currencies = res.data;
		});

	Networks.query()
		.$promise.then(function(response) {
			$scope.networks = response.data;
		});

	$scope.redrawMap	= function() {
		var mapEl 	= angular.element(document.querySelector('.angular-google-map'));
		var iScope 	= mapEl.isolateScope();
		var map 	= iScope.map;
		var zoom 	= map.getZoom();
		var center 	= map.getCenter();
		google.maps.event.trigger(map, "resize");
		map.setZoom(zoom);
		map.setCenter(center);
	}

	$scope.createProject = function() {
		$('#creating-project-visual').removeClass('text-danger');
		$('.tab-button').attr("disabled", true);
		$('#creating-project-visual').html('<i class="fa fa-fw fa-spin fa-refresh"></i>&nbsp;&nbsp;Creating Your Project...');
		Project.store({}, $scope.new_project)
			.$promise.then(function(res) {
				// Reset user projects, so the header controller automatically loads them all again to include the new one.
				$rootScope.user_projects	= null;
				//	Redirect the user to the projects page.
				$state.go('app.page.projects');
			}, function(res) {
				$('#creating-project-visual').addClass('text-danger');
				$('#creating-project-visual').html('<i class="fa fa-fw fa-exclamation"></i>Something went wrong. Please try again later.');
			});
	};

}]);