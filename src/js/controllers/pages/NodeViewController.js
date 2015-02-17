angular.module('app.controllers').controller('NodeViewController', [	'$scope',
																		'$stateParams',
																		'Auth',
																		'Node',
																		'NodePermits',
																		'ChangePermitStatus',
																		'NodeLongLeads',
																		'ChangeLongLeadStatus',
																		'NodeUsers',
																		'NodeAudit',
																		'$modal',
																		'LongLeads',
																		'Permits',
																		'Project',
																		'toaster',	function(	$scope,
																								$stateParams,
																								Auth,
																								Node,
																								NodePermits,
																								ChangePermitStatus,
																								NodeLongLeads,
																								ChangeLongLeadStatus,
																								NodeUsers,
																								NodeAudit,
																								$modal,
																								LongLeads,
																								Permits,
																								Project,
																								toaster	) {

	$scope.current_user 		= Auth.getCredential('user_data');
	$scope.node_returned 		= false;
	$scope.long_leads_returned 	= false;
	$scope.permits_returned 	= false;
	$scope.users_returned 		= false;

	$scope.percent 				= {
							progress: 0,
							projected: 0
						}

	$scope.data2				= [0, 0, 0, 0, 0, 0, 0, 0];


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

	$scope.init = function() {
		initialiseWebSockets();
	};

	initialiseWebSockets = function() {
		var channel = pusher.subscribe('Node_'+$stateParams.node_id);
		channel.bind('audit-trail', function(data) {
			$scope.node_audit_history.unshift(data[0]);
			$scope.node_audit_history.pop();
			$scope.$apply();
		});
	};

	Node.get({id:$stateParams.node_id})
		.$promise.then(function(res) {
			$scope.node 				= res.data;
			$scope.progress 			= res.data.progress;

			$scope.percent.progress 	= res.data.progress;
			$scope.percent.projected 	= res.data.projected_progress;

			if (res.recent_progress) {

				var i;
				var sparkline_plot = [];
				for (i = 0; i < res.data.recent_progress.length; i++) {
					sparkline_plot.push(res.data.recent_progress[i].progress);
				}

				var number_of_points 		= res.data.recent_progress.length;
				$scope.progress_change 		= Math.round((res.data.recent_progress[0].progress - res.data.recent_progress[(number_of_points - 1)].progress) * -1);

				$('#progress_graph').sparkline(sparkline_plot, {	type: 'line',
														height: 65,
														width: '100%',
														lineWidth: 2,
														valueSpots: {'0:':'#fff'},
														lineColor: '#fff',
														spotColor: '#fff',
														fillColor: '',
														highlightLineColor: '#fff',
														spotRadius: 3 	});

			}

			if ($scope.node.is_leaf) {
				// get permits / longleads
				$scope.getPermits();
				$scope.getLongLeads();
			}

			$scope.node_returned 		= true;
	});

	$scope.editNode = function() {
		var modalInstance 	= $modal.open({
			templateUrl: 'tpl/nodes/modals/edit_node.html',
			controller: 'EditNodeModalController',
				resolve: {
					node: function () {
						return $scope.node;
					},
					is_leaf: function () {
						return $scope.node.is_leaf;
					}
				}
		});

		modalInstance.result
			.then(function (node_data) {
				$scope.node = node_data;
				return $scope.updateNode();
			});
	}

	$scope.updateNode = function() {
		Node.update({id:$stateParams.node_id}, $scope.node)
			.$promise.then(function(res) {
				$scope.node = res.data;
			});
	}

	NodeAudit.get({id:$stateParams.node_id})
		.$promise.then(function(res) {
			// success handler
			$scope.node_audit_history = res.data;
		});

	NodeUsers.get({id:$stateParams.node_id})
		.$promise.then(function(res) {
			$scope.node_users 		= res.data.current_users;
			$scope.potential_users	= res.data.potential_users;
			$scope.users_returned 	= true;
		});

	$scope.addUsers = function() {
		var modalInstance 	= $modal.open({
			templateUrl: 'tpl/nodes/modals/add_users.html',
			controller: 'NodeAddUsersModalController',
				resolve: {
					potential_users: function () {
						return $scope.potential_users;
					}
				}
		});

		modalInstance.result
			.then(function (_users) {
				$scope.users_returned 			= false;
				NodeUsers.store({id:$stateParams.node_id}, {users: _users})
					.$promise.then(function(response) {
						$scope.node_users 		= response.data.current_users;
						$scope.potential_users	= response.data.potential_users;
						$scope.users_returned 	= true;
					}, function(response) {
						// Failed
					})
			}, function () {
				// Failed
			});
	}

	$scope.removeUser = function(user_index) {
		var _user = $scope.node_users[user_index];
		$('.btn-remove.user-'+_user.id).html('<i class="fa fa-fw fa-spin fa-refresh"></i>');
		$('.btn-remove.user-'+_user.id).removeClass('btn-danger btn-default');
		$('.btn-remove.user-'+_user.id).addClass('btn-default');
		NodeUsers.delete({id:$stateParams.node_id, user_id: _user.id})
			.$promise.then(function(response) {
				$scope.node_users 		= response.data.current_users;
				$scope.potential_users	= response.data.potential_users;
			});
	}

	// START: Long Lead Item Functionality

	$scope.getLongLeads = function() {
		$scope.long_leads_returned 	= false;
		NodeLongLeads.get({id:$stateParams.node_id})
			.$promise.then(function(res) {
				$scope.long_lead_items 		= res.data
				$scope.long_leads_returned  = true;
			});
	};

	$scope.openLongLeadItemModal = function(long_lead_index, action) {
		var modalInstance = $modal.open({
			templateUrl: 'tpl/nodes/modals/long_lead_item.html',
			controller: 'NodeLongLeadItemModalController',
			resolve: {
				long_lead: function() {
					return $scope.long_lead_items[long_lead_index];
				},
				action: function() {
					return action;
				}
			}
		});

		modalInstance.result.then(function(long_lead) {
			if (action == 'view') {
				return true;
			}

			$('.btn-edit.long_lead-'+long_lead.id).removeClass('text-center btn-danger btn-success');
			$('.btn-edit.long_lead-'+long_lead.id).addClass('text-center');
			$('.btn-edit.long_lead-'+long_lead.id).html('<i class="fa fa-fw fa-refresh fa-spin"></i>');

			LongLeads.update({id:long_lead.id}, long_lead)
				.$promise.then(function(res) {
					$('.btn-edit.long_lead-'+long_lead.id).removeClass('text-center btn-danger btn-success');
					$('.btn-edit.long_lead-'+long_lead.id).addClass('btn-success');
					$('.btn-edit.long_lead-'+long_lead.id).html('<i class="fa fa-fw fa-check"></i>');
					$('.btn-edit.long_lead-'+long_lead.id).prop('disabled', false);
					$scope.long_lead_items[long_lead_index] = res.data;
				}, function(response) {
					$('.btn-edit.long_lead-'+long_lead.id).removeClass('text-center btn-danger btn-success');
					$('.btn-edit.long_lead-'+long_lead.id).addClass('btn-danger');
					$('.btn-edit.long_lead-'+long_lead.id).html('<i class="fa fa-fw fa-times"></i>');
					$('.btn-edit.long_lead-'+long_lead.id).prop('disabled', false);
				});
		});
	};

	$scope.addLongLead 		= function() {
		var modalInstance	= $modal.open({
			templateUrl: 'tpl/nodes/modals/long_lead_item.html',
			controller: 'NodeLongLeadItemModalController',
			resolve: {
				long_lead: function () {
					return null;
				},
				action: function() {
					return 'create';
				}
			}
		});

		modalInstance.result
			.then(function (long_lead_data) {
				$scope.adding_long_lead	= true;
				$('.btn-add-long-lead').removeClass('btn-primary btn-danger btn-success');
				$('.btn-add-long-lead').addClass('btn-primary');
				$('.btn-add-long-lead').html('<i class="fa fa-fw fa-spin fa-refresh"></i>&nbsp;&nbsp;Processing');
				NodeLongLeads.save({id:$stateParams.node_id}, long_lead_data)
					.$promise.then(function(response) {
						$('.btn-add-long-lead').removeClass('btn-primary btn-danger btn-success');
						$('.btn-add-long-lead').addClass('btn-success');
						$('.btn-add-long-lead').html('<i class="fa fa-fw fa-plus"></i>&nbsp;&nbsp;Add Long Lead Item');
						$scope.long_lead_items 	= response.data
						$scope.adding_long_lead	= false;
						setTimeout(function() {
							$('.btn-add-long-lead').removeClass('btn-primary btn-danger btn-success');
							$('.btn-add-long-lead').addClass('btn-primary');
						}, 3000);
					}, function(response) {
						$('.btn-add-long-lead').removeClass('btn-primary btn-danger btn-success');
						$('.btn-add-long-lead').addClass('btn-danger');
						$('.btn-add-long-lead').html('<i class="fa fa-fw fa-plus"></i>&nbsp;&nbsp;Add Long Lead Item');
						$scope.adding_long_lead	= false;
					});
			});
	}

	$scope.changeLongLeadStatus = function(long_lead_index, _action, _status) {
		var long_lead_item  = $scope.long_lead_items[long_lead_index];
		$('.btn-edit.long_lead-'+long_lead_item.id).removeClass('text-center text-danger btn-danger btn-success');
		$('.btn-edit.long_lead-'+long_lead_item.id).addClass('text-center');
		$('.btn-edit.long_lead-'+long_lead_item.id).html('<i class="fa fa-fw fa-refresh fa-spin"></i>');

		ChangeLongLeadStatus.update({id:long_lead_item.id, action:_action}, long_lead_item)
			.$promise.then(function(res) {
				$('.btn-edit.long_lead-'+long_lead_item.id).removeClass('text-center btn-danger btn-success');
				$('.btn-edit.long_lead-'+long_lead_item.id).addClass('btn-success');
				$('.btn-edit.long_lead-'+long_lead_item.id).html('<i class="fa fa-fw fa-check"></i>');
				$('.btn-edit.long_lead-'+long_lead_item.id).prop('disabled', false);
				$scope.long_lead_items[long_lead_index] = res.data;
			}, function(response) {
				$('.btn-edit.long_lead-'+long_lead_item.id).removeClass('text-center btn-danger btn-success');
				$('.btn-edit.long_lead-'+long_lead_item.id).addClass('btn-danger');
				$('.btn-edit.long_lead-'+long_lead_item.id).html('<i class="fa fa-fw fa-times"></i>');
				$('.btn-edit.long_lead-'+long_lead_item.id).prop('disabled', false);
			});
	};

	$scope.deleteLongLead = function(long_lead_index) {
		var long_lead_id = $scope.long_lead_items[long_lead_index].id;
		$('.btn-delete.long_lead-'+long_lead_id).removeClass('text-center text-danger btn-danger btn-success');
		$('.btn-delete.long_lead-'+long_lead_id).addClass('text-center');
		$('.btn-delete.long_lead-'+long_lead_id).html('<i class="fa fa-fw fa-refresh fa-spin"></i>');

		LongLeads.delete({id:long_lead_id})
			.$promise.then(function(res) {
				$scope.long_lead_items.splice(long_lead_index, 1);
			}, function(response) {
				$('.btn-delete.long_lead-'+long_lead_id).removeClass('text-center btn-danger btn-success');
				$('.btn-delete.long_lead-'+long_lead_id).addClass('btn-danger');
				$('.btn-delete.long_lead-'+long_lead_id).html('<i class="fa fa-fw fa-times"></i>');
				$('.btn-delete.long_lead-'+long_lead_id).prop('disabled', false);
			});
	};

	// END: Long Lead Item Functionality

	// START: Permit Functionality

	$scope.getPermits = function() {
		NodePermits.get({id:$stateParams.node_id})
			.$promise.then(function(res) {
				$scope.permits          = res.data
				$scope.permits_returned = true;
			});
	};

	$scope.openPermitModal = function(permit_index, action) {
		var modalInstance = $modal.open({
			templateUrl: 'tpl/nodes/modals/permit.html',
			controller: 'NodePermitModalController',
			resolve: {
				permit: function() {
					return $scope.permits[permit_index];
				},
				action: function() {
					return action;
				}
			}
		});

		modalInstance.result.then(function(permit) {
			if (action == 'view') {
				return true;
			}

			$('.btn-edit.permit-'+permit.id).removeClass('text-center btn-danger btn-success');
			$('.btn-edit.permit-'+permit.id).addClass('text-center');
			$('.btn-edit.permit-'+permit.id).html('<i class="fa fa-fw fa-refresh fa-spin"></i>');

			Permits.update({id:permit.id}, permit)
				.$promise.then(function(res) {
					$('.btn-edit.permit-'+permit.id).removeClass('text-center btn-danger btn-success');
					$('.btn-edit.permit-'+permit.id).addClass('btn-success');
					$('.btn-edit.permit-'+permit.id).html('<i class="fa fa-fw fa-check"></i>');
					$('.btn-edit.permit-'+permit.id).prop('disabled', false);
					$scope.permits[permit_index] = res.data;
				}, function(response) {
					$('.btn-edit.permit-'+permit.id).removeClass('text-center btn-danger btn-success');
					$('.btn-edit.permit-'+permit.id).addClass('btn-danger');
					$('.btn-edit.permit-'+permit.id).html('<i class="fa fa-fw fa-times"></i>');
					$('.btn-edit.permit-'+permit.id).prop('disabled', false);
				});
		});
	};

	$scope.addPermit 		= function() {
		var modalInstance	= $modal.open({
			templateUrl: 'tpl/nodes/modals/permit.html',
			controller: 'NodePermitModalController',
			resolve: {
				permit: function () {
					return null;
				},
				action: function() {
					return 'create';
				}
			}
		});

		modalInstance.result
			.then(function (permit_data) {
				$scope.adding_permit	= true;
				$('.btn-add-permit').removeClass('btn-primary btn-danger btn-success');
				$('.btn-add-permit').addClass('btn-primary');
				$('.btn-add-permit').html('<i class="fa fa-fw fa-spin fa-refresh"></i>&nbsp;&nbsp;Processing');
				NodePermits.save({id:$stateParams.node_id}, permit_data)
					.$promise.then(function(response) {
						$('.btn-add-permit').removeClass('btn-primary btn-danger btn-success');
						$('.btn-add-permit').addClass('btn-success');
						$('.btn-add-permit').html('<i class="fa fa-fw fa-plus"></i>&nbsp;&nbsp;Add Permit');
						$scope.permits 			= response.data
						$scope.adding_permit	= false;
						setTimeout(function() {
							$('.btn-add-permit').removeClass('btn-primary btn-danger btn-success');
							$('.btn-add-permit').addClass('btn-primary');
						}, 3000);
					}, function(response) {
						$('.btn-add-permit').removeClass('btn-primary btn-danger btn-success');
						$('.btn-add-permit').addClass('btn-danger');
						$('.btn-add-permit').html('<i class="fa fa-fw fa-plus"></i>&nbsp;&nbsp;Add Permit');
						$scope.adding_permit	= false;
					});
			});
	}

	$scope.changePermitStatus = function(permit_index, _action, _status) {
		var permit  = $scope.permits[permit_index];
		$('.btn-edit.permit-'+permit.id).removeClass('text-center text-danger btn-danger btn-success');
		$('.btn-edit.permit-'+permit.id).addClass('text-center');
		$('.btn-edit.permit-'+permit.id).html('<i class="fa fa-fw fa-refresh fa-spin"></i>');

		ChangePermitStatus.update({id:permit.id, action:_action}, permit)
			.$promise.then(function(res) {
				$('.btn-edit.permit-'+permit.id).removeClass('text-center btn-danger btn-success');
				$('.btn-edit.permit-'+permit.id).addClass('btn-success');
				$('.btn-edit.permit-'+permit.id).html('<i class="fa fa-fw fa-check"></i>');
				$('.btn-edit.permit-'+permit.id).prop('disabled', false);
				$scope.permits[permit_index] = res.data;
			}, function(response) {
				$('.btn-edit.permit-'+permit.id).removeClass('text-center btn-danger btn-success');
				$('.btn-edit.permit-'+permit.id).addClass('btn-danger');
				$('.btn-edit.permit-'+permit.id).html('<i class="fa fa-fw fa-times"></i>');
				$('.btn-edit.permit-'+permit.id).prop('disabled', false);
			});
	};

	$scope.deletePermit = function(permit_index) {
		var permit_id = $scope.permits[permit_index].id;
		$('.btn-delete.permit-'+permit_id).removeClass('text-center text-danger btn-danger btn-success');
		$('.btn-delete.permit-'+permit_id).addClass('text-center');
		$('.btn-delete.permit-'+permit_id).html('<i class="fa fa-fw fa-refresh fa-spin"></i>');

		Permits.delete({id:permit_id})
			.$promise.then(function(res) {
				$scope.permits.splice(permit_index, 1);
			}, function(response) {
				$('.btn-delete.permit-'+permit_id).removeClass('text-center btn-danger btn-success');
				$('.btn-delete.permit-'+permit_id).addClass('btn-danger');
				$('.btn-delete.permit-'+permit_id).html('<i class="fa fa-fw fa-times"></i>');
				$('.btn-delete.permit-'+permit_id).prop('disabled', false);
			});
	};

	// END: Permit Functionality

}]);