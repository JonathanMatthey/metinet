angular.module('app.controllers').controller('ProjectLongLeadController', [ '$scope',
																			'$stateParams',
																			'Auth',
																			'ProjectLongLeads',
																			'LongLeads',
																			'ChangeLongLeadStatus',
																			'$modal',  	function(   $scope,
																									$stateParams,
																									Auth,
																									ProjectLongLeads,
																									LongLeads,
																									ChangeLongLeadStatus,
																									$modal ) {

	$scope.project_id               = $stateParams.id;
	$scope.long_leads_returned      = false;

	ProjectLongLeads.get({id:$stateParams.id})
		.$promise.then(function(res) {
			$scope.long_lead_items      = res.data
			$scope.long_leads_returned  = true;
		});

	$scope.openLongLeadItemModal = function(long_lead_index, action) {
		var modalInstance = $modal.open({
			templateUrl: 'tpl/project/modals/long_lead_item.html',
			controller: 'ProjectLongLeadItemModalController',
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

}]);