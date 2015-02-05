(function () {

'use strict';
	
	//Load controller
  	angular.module('surveyApp').controller('homeController', ['$scope','$location','serviceCall','activeData',function($scope,$location,serviceCall,activeData) {      	

        $scope.title = "Home";
        $scope.nextDueSurveyID = "";

        $scope.controllerInit = function(){        	        	
        	if(!localStorage.surveyAppPin){
        		if(!localStorage.surveyAppServerSettings){
        			$scope.surveyMessage = "You don't have your PIN and server settings setup.";
        		}
        		else
          			$scope.surveyMessage = "You don't have your PIN setup.";
        	}
        	else if(!localStorage.surveyAppServerSettings){
          		$scope.surveyMessage = "You don't have your server settings setup.";
        	}    
        	else {
        		$("#startSurvey").removeClass("disabled");
        		var userPIN = localStorage.surveyAppPin;
  				  var payloadForService = '{"userPIN":'+userPIN+'}';
            /*jshint newcap: false */
  				  var surveyIDCall = new serviceCall("getSurveyID","GET");
  				  surveyIDCall.call(payloadForService,$scope.surveyIDsuccess,$scope.serviceError,"json/getSurveyID.json");
        	}    	  			
  		};

  		$scope.surveyIDsuccess = function(data, status, headers, config){  			        
        var dates = [];
        if(data.message == "Success"){
          angular.forEach(data.surveys, function(value,key){
            console.log(value.nextDueAt);
            dates.push(value.nextDueAt);
          });
          dates.sort(function(a, b){
            return Date.parse(a) - Date.parse(b);
          });
          console.log(dates);         
          var nextDueAtFinal = dates[0];
          var nextDueSurveyID = 0;
          angular.forEach(data.surveys, function(value,key){
            if(value.nextDueAt == nextDueAtFinal)
              $scope.nextDueSurveyID = value.surveyInstanceID;
          });
          console.log($scope.nextDueSurveyID);  
          activeData.setSurveyID($scope.nextDueSurveyID);
          $scope.surveyMessage = "You have a survey due at " + nextDueAtFinal +". To begin survey, please click on the Start Survey button.";
        }
        else if(data.message == "You have no active surveys"){
          $scope.surveyMessage = "You have no surveys due. Please check in again later.";
        }
        else if(data.message == "Your PIN is not active"){
          $scope.surveyMessage = "Your PIN is not active. Please contact the administrator.";
        }
        else if(data.message == "The PIN is invalid"){
          $scope.surveyMessage = "Your PIN is not invalid. Please contact the administrator.";
        }
        else if(data.message == "Unexpected Error"){
          $scope.surveyMessage = "Unexpected Error. Please contact the administrator.";
        }
  		};

  		$scope.serviceError = function(data, status, headers, config){
  			console.log(data);
  			alert("Error! Please try again later.");
  		};

      $scope.getSurvey = function(){
        console.log($scope.nextDueSurveyID);
        var payloadForService = '{"surveyID":'+$scope.nextDueSurveyID+'}';
        console.log(payloadForService);
        /*jshint newcap: false */
        var getSurveyCall = new serviceCall("getSurveyID","GET");
        getSurveyCall.call(payloadForService,$scope.getSurveySuccess,$scope.serviceError,"json/getSurvey.json");        
      };

      $scope.getSurveySuccess = function(data, status, headers, config){        
        console.log(data);
        activeData.setSurveyQuestions(data.questions);
        $scope.changePage('/survey');
      };


      $scope.changePage = function(path){   			    		      		          
      		$location.path(path);    		
  		};

  		// Date format conversion
  		Date.prototype.yyyymmdd = function() {
		    var yyyy = this.getFullYear().toString();
		    var mm = (this.getMonth()+1).toString(); // getMonth() is zero-based
		    var dd  = this.getDate().toString();
		    // var hh = this.getHours().toString();
		    // var mi = this.getMinutes().toString();
		    // var ss = this.getSeconds().toString();		    
		    // return yyyy + "-" +(mm[1]?mm:"0"+mm[0]) + "-" + (dd[1]?dd:"0"+dd[0]) + " " + hh + ":" + (mi[1]?mi:"0"+mi[0]) + ":" + (ss[1]?ss:"0"+ss[0]); // padding
		    return yyyy + "-" +(mm[1]?mm:"0"+mm[0]) + "-" + (dd[1]?dd:"0"+dd[0]); // padding
	   	}; 

  		$scope.controllerInit();

    }
  ]);

})();