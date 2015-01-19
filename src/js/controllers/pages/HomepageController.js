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

	$scope.upcoming_tasks 	= [];
	$scope.current_tasks 	= [];
	$scope.network_rfis 	= [];

	$scope.homepage_action	= 'overview';

	$scope.user_data		= Auth.getCredential('user_data');

	$scope.init = function() {

		UserProjects.query({id:$scope.user_data.id})
			.$promise.then(function(data) {
				$scope.user_projects	= data;
			});

		UserHomepage.get({})
			.$promise.then(function(res) {
				$scope.current_tasks	= res.data.current_tasks;
				$scope.upcoming_tasks	= res.data.upcoming_tasks;
				$scope.network_rfis		= res.data.network_rfis;
				console.log(res.data.seven_day);
				$scope.seven_day		= res.data.seven_day;

				$('#current_tasks_table').trigger('footable_redraw');
				$('#upcoming_tasks_table').trigger('footable_redraw');

				$.plot(	'#plot',
					[
						{ label: "Actual", data: [ res.data.seven_day.progress_plot ], },
							{ label: "Calculated", data: [ res.data.seven_day.projected_progress_plot ] }
					],
					{
						colors: [
							'#314554',
							'{{ app.color.info }}'
						],
						series: {
							shadowSize: 3
						},
						xaxis: {
							mode:'time',
							minTickSize: [1, 'day'],
							timeformat: '%d-%m-%Y',
							font: { color: '#507b9b' }
						},
						yaxis: {
							font: { color: '#507b9b' },
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
					});

			});

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
		$http.get($rootScope.api_url+'/user/newsfeed/'+$scope.newsfeedSkip).then(function (resp) {
			$.merge($scope.newsfeed, resp.data.data);
			$scope.newsfeedSkip++;
		});
	}

	$scope.refreshOverviewFlot = function() {
		$.plot.draw();
	}

}]);