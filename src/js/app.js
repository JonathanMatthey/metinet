'use strict';

// routes avail at
// https://bitbucket.org/stevchenks/fixing_metinet_api/src/7f82ee9db72b3c2160859c7dedd54c04a09d1474/app/routes.php?at=master

// Declare app level module which depends on filters, and services
var app = angular.module('app', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngStorage',
    'ui.router',
    'ui.bootstrap',
    'easypiechart',
    'ui.load',
    'ui.jq',
    'ui.validate',
    'oc.lazyLoad',
    'pascalprecht.translate',
    'app.filters',
    'app.services',
    'app.directives',
    'app.controllers',
    'angularMoment',
    'toaster',
    'truncate',
    'angular-lodash',
    'ngMap'
  ])
.run(
  [          '$rootScope', '$state', '$stateParams','$cookieStore','$http',
    function ($rootScope,   $state,   $stateParams,$cookieStore,$http) {
        $rootScope.$state                               = $state;
        $rootScope.$stateParams                         = $stateParams;
        $http.defaults.headers.common['Authorization']  = 'Basic ' + $cookieStore.get('authdata');
    }
  ]
)
.config(
  [          '$stateProvider', '$urlRouterProvider', '$httpProvider', '$controllerProvider', '$compileProvider', '$filterProvider', '$provide',
    function ($stateProvider,   $urlRouterProvider,  $httpProvider, $controllerProvider,   $compileProvider,   $filterProvider,   $provide) {

        // lazy controller, directive and service
        app.controller = $controllerProvider.register;
        app.directive  = $compileProvider.directive;
        app.filter     = $filterProvider.register;
        app.factory    = $provide.factory;
        app.service    = $provide.service;
        app.constant   = $provide.constant;
        app.value      = $provide.value;

        $urlRouterProvider
            .otherwise('/app/home');
        $stateProvider
            .state('app', {
                abstract: true,
                url: '/app',
                templateUrl: 'tpl/app.html'
            })
            .state('app.home', {
                url: '/home',
                controller:'HomepageController',
                templateUrl: 'tpl/page_homepage.html',
                resolve: {
                    deps: ['uiLoad',
                      function( uiLoad ){
                        return uiLoad.load([
                            'js/libs/moment.min.js'
                        ]);
                    }]
                }                
            })
            // pages
            .state('app.page', {
                url: '/page',
                template: '<div class="hbox hbox-auto-xs bg-light " ng-init="" ui-view></div>'
            })
            .state('app.page.profile', {
                url: '/profile/:id',
                controller:'ProfileViewController',                
                templateUrl: 'tpl/page_profile.html'
            })
            .state('app.page.company', {
                url: '/company/:id',
                controller:'NetworkViewController',
                templateUrl: 'tpl/page_company.html'
            })
            .state('app.page.settings', {
                url: '/settings',
                templateUrl: 'tpl/page_settings.html',
                controller:'ProjectSettingsController'
            })
            .state('app.page.projects', {
                url: '/projects',
                templateUrl: 'tpl/page_projects.html',
                controller:'ProjectListController',
				resolve: {
					deps: ['uiLoad',
						function( uiLoad ){
							return uiLoad.load([
								'js/libs/moment.min.js',
								'js/jquery/charts/sparkline/jquery.sparkline.min.js',
								'js/jquery/charts/flot/jquery.flot.min.js',
								'js/jquery/charts/flot/jquery.flot.resize.js'
							]);
						}]
				}
            })
            .state('app.page.gantt', {
                url: '/projects/:id/gantt',
                templateUrl: 'tpl/page_gantt.html',
                controller:'ProjectViewGanttController'
            })
            .state('app.page.network', {
                url: '/projects/:id/network/create',
                templateUrl: 'tpl/page_project_network_new.html',
                controller:'ProjectNetworkCreateController'
            })
            .state('app.page.newproject',{
                url:'/projects/new',
                templateUrl: 'tpl/page_project_new.html',
                controller:'ProjectCreateController',
                resolve: {
                    deps: ['uiLoad',
                      function( uiLoad ){
                        return uiLoad.load([
                            'js/libs/moment.min.js'
                        ]);
                    }]
                }
            })
            .state('app.page.branchnode',{
                url:'/nodes/:id',
                templateUrl: 'tpl/page_node.html',
                controller:'NodeViewController',
                resolve: {
                    deps: ['uiLoad',
                      function( uiLoad ){
                        return uiLoad.load([
                            'js/libs/moment.min.js',
                            'js/jquery/charts/sparkline/jquery.sparkline.min.js',
                            'js/jquery/slider/slider.css'
                        ]);
                    }]
                }
            })
            .state('app.page.project',{
                url:'/projects/:id/:action',
                templateUrl: 'tpl/page_project_2.html',
                controller: 'ProjectViewController',
				resolve: {
					deps: ['uiLoad',
						function( uiLoad ){
							return uiLoad.load([
								'//rawgit.com/allenhwkim/angularjs-google-maps/master/build/scripts/ng-map.min.js',
								'//maps.googleapis.com/maps/api/js?sensor=false',
								'js/jquery/charts/flot/jquery.flot.min.js',
								'js/jquery/charts/flot/jquery.flot.resize.js'
							]);
						}]
				}                                
            })
            .state('app.page.search', {
                url: '/search',
                templateUrl: 'tpl/page_search.html'
            })
            .state('app.docs', {
                url: '/docs',
                templateUrl: 'tpl/docs.html'
            })
            // others
            .state('lockme', {
                url: '/lockme',
                templateUrl: 'tpl/page_lockme.html'
            })
            .state('access', {
                url: '/access',
                template: '<div ui-view class="fade-in-right-big smooth"></div>'
            })
            .state('access.signin', {
                url: '/signin',
                templateUrl: 'tpl/page_signin.html'
            })
            .state('access.signup', {
                url: '/signup',
                templateUrl: 'tpl/page_signup.html'
            })
            .state('access.forgotpwd', {
                url: '/forgotpwd',
                templateUrl: 'tpl/page_forgotpwd.html'
            })
            .state('access.404', {
                url: '/404',
                templateUrl: 'tpl/page_404.html'
            })
            // mail
            .state('app.mail', {
                abstract: true,
                url: '/mail',
                templateUrl: 'tpl/mail.html',
                // use resolve to load other dependences
                resolve: {
                    deps: ['uiLoad',
                      function( uiLoad ){
                        return uiLoad.load([
                            'js/app/mail/mail.js',
                            'js/app/mail/mail-service.js',
                            'js/libs/moment.min.js'
                        ]);
                    }]
                }
            })
            .state('app.mail.list', {
                url: '/inbox/{fold}',
                templateUrl: 'tpl/mail.list.html'
            })
            .state('app.mail.detail', {
                url: '/{mailId:[0-9]{1,4}}',
                templateUrl: 'tpl/mail.detail.html'
            })
            .state('app.mail.compose', {
                url: '/compose',
                templateUrl: 'tpl/mail.new.html'
            })
            .state('apps', {
                abstract: true,
                url: '/apps',
                templateUrl: 'tpl/layout.html'
            })
            .state('apps.users', {
                url: '/users',
                templateUrl: 'tpl/apps_users.html',
                resolve: {
                    deps: ['uiLoad',
                      function( uiLoad ){
                        return uiLoad.load([
                            'js/app/users/users.js'
                        ]);
                    }]
                }
            })
    }
  ]
)

// translate config
.config(['$translateProvider', function($translateProvider){

  // Register a loader for the static files
  // So, the module will search missing translation tables under the specified urls.
  // Those urls are [prefix][langKey][suffix].
  $translateProvider.useStaticFilesLoader({
    prefix: 'l10n/',
    suffix: '.js'
  });

  // Tell the module what language to use by default
  $translateProvider.preferredLanguage('en');

  // Tell the module to store the language in the local storage
  $translateProvider.useLocalStorage();

}])

/**
 * jQuery plugin config use ui-jq directive , config the js and css files that required
 * key: function name of the jQuery plugin
 * value: array of the css js file located
 */
.constant('JQ_CONFIG', {
    easyPieChart:   ['js/jquery/charts/easypiechart/jquery.easy-pie-chart.js'],
    sparkline:      ['js/jquery/charts/sparkline/jquery.sparkline.min.js'],
    plot:           ['js/jquery/charts/flot/jquery.flot.min.js',
                        'js/jquery/charts/flot/jquery.flot.resize.js',
                        'js/jquery/charts/flot/jquery.flot.tooltip.min.js',
                        'js/jquery/charts/flot/jquery.flot.spline.js',
                        'js/jquery/charts/flot/jquery.flot.orderBars.js',
                        'js/jquery/charts/flot/jquery.flot.time.js',
                        'js/jquery/charts/flot/jquery.flot.pie.min.js'],
    slimScroll:     ['js/jquery/slimscroll/jquery.slimscroll.min.js'],
    sortable:       ['js/jquery/sortable/jquery.sortable.js'],
    nestable:       ['js/jquery/nestable/jquery.nestable.js',
                        'js/jquery/nestable/nestable.css'],
    filestyle:      ['js/jquery/file/bootstrap-filestyle.min.js'],
    slider:         ['js/jquery/slider/bootstrap-slider.js',
                        'js/jquery/slider/slider.css'],
    chosen:         ['js/jquery/chosen/chosen.jquery.min.js',
                        'js/jquery/chosen/chosen.css'],
    TouchSpin:      ['js/jquery/spinner/jquery.bootstrap-touchspin.min.js',
                        'js/jquery/spinner/jquery.bootstrap-touchspin.css'],
    wysiwyg:        ['js/jquery/wysiwyg/bootstrap-wysiwyg.js',
                        'js/jquery/wysiwyg/jquery.hotkeys.js'],
    dataTable:      ['js/jquery/datatables/jquery.dataTables.min.js',
                        'js/jquery/datatables/dataTables.bootstrap.js',
                        'js/jquery/datatables/dataTables.bootstrap.css'],
    vectorMap:      ['js/jquery/jvectormap/jquery-jvectormap.min.js',
                        'js/jquery/jvectormap/jquery-jvectormap-world-mill-en.js',
                        'js/jquery/jvectormap/jquery-jvectormap-us-aea-en.js',
                        'js/jquery/jvectormap/jquery-jvectormap.css'],
    footable:       ['js/jquery/footable/footable.all.min.js',
                        'js/jquery/footable/footable.core.css']
    }
)

// modules config
.constant('MODULE_CONFIG', {
    select2:        ['js/jquery/select2/select2.css',
                        'js/jquery/select2/select2-bootstrap.css',
                        'js/jquery/select2/select2.min.js',
                        'js/modules/ui-select2.js']
    }
)

// oclazyload config
.config(['$ocLazyLoadProvider', function($ocLazyLoadProvider) {
    // We configure ocLazyLoad to use the lib script.js as the async loader
    $ocLazyLoadProvider.config({
        debug: true,
        events: true,
        modules: [
            {
                name: 'ngGrid',
                files: [
                    'js/modules/ng-grid/ng-grid.min.js',
                    'js/modules/ng-grid/ng-grid.css',
                    'js/modules/ng-grid/theme.css'
                ]
            },
            {
                name: 'toaster',
                files: [
                    'js/modules/toaster/toaster.js',
                    'js/modules/toaster/toaster.css'
                ]
            }
        ]
    });
}]);
