angular.module('app.controllers').controller('NodeViewController', [	'$scope',
																		'$stateParams',
																		'Auth',
																		'Node',
																		'NodePermits',
																		'NodeLongLeads',
																		'NodeUsers',
																		'NodeAudit',
																		'$modal',
																		'LongLeads',
																		'toaster',	function(	$scope,
																								$stateParams,
																								Auth,
																								Node,
																								NodePermits,
																								NodeLongLeads,
																								NodeUsers,
																								NodeAudit,
																								$modal,
																								LongLeads,
																								toaster	) {

	$scope.percent = {
		progress: 0,
		projected: 0
	}

	$scope.options = {
		animate:{
			duration:1000,
			enabled:true
		},
		size: 75,
		barColor: $scope.app.color.black,
		trackColor: $scope.app.color.primary,
		scaleColor: $scope.app.color.black,
		lineWidth: 2,
		lineCap:'circle'
	};

	$scope.range = {
		min: 30,
		max: 60
	};

	Node.get({id:$stateParams.id})
		.$promise.then(function(res) {
			$scope.node 				= res.data;
			$scope.progress 			= res.data.progress;

			$scope.percent.progress 	= res.data.progress;
			$scope.percent.projected 	= res.data.projected_progress;

			var i;
			var sparkline_plot = [];
			for (i = 0; i < res.data.recent_progress.length; i++) {
				sparkline_plot.push(res.data.recent_progress[i].progress);
			}

			$scope.sparkline_plot = sparkline_plot;

			$('#sparkline').sparkline(	sparkline_plot, {	type:'line',
															barColor:'green',
															lineWidth: 5	});

			if ($scope.node.is_leaf){
				// get users / permits / audit / longleads
				$scope.getNodeAudit();
				$scope.getNodePermits();
				$scope.getNodeLongLeads();
				$scope.getNodeUsers();
			}
	});

	$scope.getNodeAudit = function() {
		NodeAudit.get({
			id:$stateParams.id
		})
		.$promise.then(function(res) {
			// success handler
			$scope.nodeAudit = res.data
			console.log('-- nodeAudits');
			console.log(res.data);
		});
	}

	$scope.getNodePermits = function() {
		NodePermits.get({
			id:$stateParams.id
		})
		.$promise.then(function(res) {
			// success handler
			$scope.nodePermits = res.data
			console.log('-- nodePermits');
			console.log(res.data);
		});
	}

	$scope.getNodeLongLeads = function() {
		NodeLongLeads.get({
			id:$stateParams.id
		})
		.$promise.then(function(res) {
			// success handler
			$scope.nodeLongLeads = res.data
			console.log('-- nodeLongLeads');
			console.log(res.data);
			console.log('$scope.nodeLongLeads.length');
			console.log($scope.nodeLongLeads.length);
		});
	}

	$scope.getNodeUsers = function() {
		NodeUsers.get({
			id:$stateParams.id
		})
		.$promise.then(function(res) {
			// success handler
			$scope.nodeUsers = res.data
			console.log('-- nodeUsers');
			console.log(res.data);
		});
	}

   	$scope.openAddLongLeadModal = function() {
		$scope.newLongLead = new NodeLongLeads();
			var modalInstance = $modal.open({
			templateUrl: 'tpl/modal_longlead.form.html',
			controller: 'AddLongLeadModal',
			resolve: {
				longlead: function () {
					return $scope.newLongLead;
				}
			}
		});

		modalInstance.result
			.then(function (newLongLead) {
				newLongLead._id = $stateParams.id;
				console.log(newLongLead);
				NodeLongLeads.save(newLongLead,function(u, putResponseHeaders) {
					toaster.pop('success', 'Long Lead Item added', '.');
					$scope.getNodeLongLeads();
				});
			}, function () {
		});
	}

	$scope.openAddPermitModal = function() {
		$scope.newPermit	= new NodePermits();
		var modalInstance 	= $modal.open({
			templateUrl: 'tpl/modal_permit.form.html',
			controller: 'AddPermitModal',
				resolve: {
					permit: function () {
						return $scope.newPermit;
					}
				}
		});

		modalInstance.result
			.then(function (newPermit) {
				newPermit._id = $stateParams.id;
				console.log(newPermit);
				NodePermits.save(newPermit,function(u, putResponseHeaders) {
					toaster.pop('success', 'Permit added', '.');
					$scope.getNodePermits();
				});
			}, function () {
		});
	}
}]);