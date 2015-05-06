angular.module('app.controllers').controller('ProjectOverviewController', [ '$scope',
																			'$rootScope',
																			'$modal',
																			'$stateParams',
																			'ProjectProgressPlot',
																			'$http', 	function(   $scope,
																									$rootScope,
																									$modal,
																									$stateParams,
																									ProjectProgressPlot,
																									$http ) {

	$scope.project_id		= $stateParams.project_id;
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

	$http.get($rootScope.api_url_version+'/projects/'+$stateParams.project_id+"/to-do").then(function (resp) {
		$scope.projectTodo 	= resp.data.data;
	});

	ProjectProgressPlot.get({id:$stateParams.project_id})
		.$promise.then(function(res) {
			// success handler
			console.log(res.data);
			$scope.projectProgressPlot = res.data;

			for (var i = 0; i < res.data.calculated_plot.length; i++) {
				$scope.plot_data[0].data.push([res.data.calculated_plot[i][0], res.data.calculated_plot[i][1]]);
			}

			for (var i = 0; i < res.data.actual_plot.length; i++) {
				$scope.plot_data[1].data.push([res.data.actual_plot[i][0], res.data.actual_plot[i][1]]);
			}

		});

	$scope.importProjectFileModal = function() {
		var modalInstance = $modal.open({
			templateUrl: 'tpl/project/modals/import_project_file.html',
			controller: 'ProjectImportProjectFileModalController',
			resolve: {
				project: function() {
					return $scope.project;
				}
			}
		});
	};

	$scope.importTasksModal = function() {
		var modalInstance = $modal.open({
			templateUrl: 'tpl/project/modals/import_tasks.html',
			controller: 'ProjectImportTasksModalController',
			resolve: {
				project: function() {
					return $scope.project;
				}
			}
		});
	};

}]);