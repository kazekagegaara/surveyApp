(function () {

'use strict';

  angular.module('surveyApp', ['ngRoute'])

  .config(['$locationProvider','$routeProvider',function($locationProvider, $routeProvider) {      
      // routes
      $routeProvider
        .when("/", {
          templateUrl: "/partials/home.html",
          controller: "homeController"
        })
        .when("/survey",{
          templateUrl: "/partials/survey.html",
          controller: "surveyController"
        })
        .when("/surveyEnd",{
          templateUrl: "/partials/surveyEnd.html",
          controller: "surveyEndController"
        })
        .when("/settings",{
          templateUrl: "/partials/settings.html",
          controller: "settingsController"
        })
        .otherwise({
           redirectTo: '/'
        });

        // for removing the "#" from URLs
        // also need to add a <base> tag for this to work
        $locationProvider.html5Mode(true);
        
    }
  ]);

}());