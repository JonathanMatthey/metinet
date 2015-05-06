angular.module('app.controllers').controller('HomepageController', [	'$scope',
																		'$rootScope',
																		'UserHomepage',
																		'UserProjects',
																		'$http',
																		'Auth', function(	$scope,
																							$rootScope,
																							UserHomepage,
																							UserProjects,
																							$http,
																							Auth	) {
	var plot;

	$scope.newsfeed 		= [];
	$scope.newsfeedSkip 	= 0;

	$scope.homepage_returned 	= false;
	$scope.upcoming_tasks 		= [];
	$scope.current_tasks 		= [];
	$scope.network_rfis			= [];

	$scope.homepage_action	= 'overview';

	$scope.user_data		= Auth.getCredential('user_data');
	$scope.user_has_network	= Auth.getCredential('user_has_network');

	$scope.plot_data		= [
			{
				data: [],
				label: 'Calculated',
				points: {
					show: true,
					radius: 1
				},
				lines: {
					show: true,
					tension: 0.4,
					lineWidth: 1
				}
			},
			{
				data: [],
				label: 'Actual',
				points: {
					show: true,
					radius: 2
				},
				lines: {
					show: true,
					tension: 0.4,
					lineWidth: 1
				}
			}
		];

	$scope.plot_options		= {
			colors: [
				'#314554',
				'#23b7e5'
			],
			series: {
				shadowSize: 3
			},
			xaxis: {
				mode:'time',
				timeformat: '%d-%m-%Y',
				font: {
					color: '#507b9b'
				}
			},
			yaxis: {
				font: {
					color: '#507b9b'
				},
				min:0,
				max:100
			},
			grid: {
				hoverable: true,
				clickable: true,
				borderWidth: 0,
				color: '#1c2b36'
			},
			tooltip: true,
			tooltipOpts: {
				content: '%y% on %x',
				defaultTheme: false,
				shifts: {
					x: 10,
					y: -25
			  	}
			}
		};

	$rootScope.$watchCollection('user_projects', function(new_value) {
		$scope.user_projects	= new_value;
	});

	$scope.init = function() {
		if ($scope.user_has_network) {
			$scope.getProjects();
			$scope.getHomepage();
		}
		$scope.getNewsfeed();
	}

	$scope.changeAction = function(value) {
		$scope.homepage_action = value;
		if (value == 'overview') {
			$scope.refreshOverviewFlot();
		}
		if (value == 'current_tasks') {
			$('#current_tasks_table').trigger('footable_redraw');
		}
		if (value == 'upcoming_tasks') {
			$('#upcoming_tasks_table').trigger('footable_redraw');
		}

	}

	$scope.getNewsfeed = function() {
		$http.get($rootScope.api_url_version+'/newsfeed/'+$scope.newsfeedSkip).then(function (resp) {
			$scope.newsfeed = resp.data.data
			$scope.newsfeedSkip++;
		});
	}

	$scope.getProjects			= function() {
		UserProjects.query({id:$scope.user_data.id})
			.$promise.then(function(data) {
				$scope.user_projects	= data;
			});
	}

	$scope.getHomepage			= function() {
		UserHomepage.get({})
			.$promise.then(function(res) {
				console.log(res);
				$scope.current_tasks		= res.data.current_tasks;
				$scope.upcoming_tasks		= res.data.upcoming_tasks;
				$scope.network_rfis			= res.data.network_rfis;

				$scope.homepage_returned 	= true;

				$('#current_tasks_table').trigger('footable_redraw');
				$('#upcoming_tasks_table').trigger('footable_redraw');

				for (var i = 0; i < res.data.seven_day.projected_progress_plot.length; i++) {
					$scope.plot_data[0].data.push([res.data.seven_day.projected_progress_plot[i][0], res.data.seven_day.projected_progress_plot[i][1]]);
				}

				for (var i = 0; i < res.data.seven_day.progress_plot.length; i++) {
					$scope.plot_data[1].data.push([res.data.seven_day.progress_plot[i][0], res.data.seven_day.progress_plot[i][1]]);
				}

			}, function(response) {
				console.log(response);
			});
	}

}]);