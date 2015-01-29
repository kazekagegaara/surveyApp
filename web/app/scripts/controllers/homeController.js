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
  			var nextDueAtFinal = new Date();  
        var nextDueSurveyID = "";			
  			angular.forEach(data, function(value, key) {
				angular.forEach(value,function(val,k){
					var nextDate = new Date(val.nextDueAt);					
          // console.log(nextDueAtFinal + " " + nextDate);
					if(k === 0){
						nextDueAtFinal = nextDate;
            nextDueSurveyID = val.surveyID;
          }
					else if(nextDueAtFinal > nextDate){            
						nextDueAtFinal = nextDate;
            nextDueSurveyID = val.surveyID;
					}
          // console.log(nextDueAtFinal);          
				});        
			});
			console.log(nextDueAtFinal);
      console.log(nextDueSurveyID);
      $scope.nextDueSurveyID = nextDueSurveyID;
			if(nextDueAtFinal.yyyymmdd() == new Date().yyyymmdd())
				$scope.surveyMessage = "You have no surveys due. Please check in again later.";
			else			
				$scope.surveyMessage = "You have a survey due at " + nextDueAtFinal +". To begin survey, please click on the Start Survey button.";
  		};

  		$scope.serviceError = function(data, status, headers, config){
  			console.log(data);
  			alert("Error! Please try again later.");
  		};

      $scope.getSurvey = function(){
        console.log($scope.nextDueSurveyID);
        var payloadForService = '{"surveyID":'+$scope.nextDueSurveyID+'}';
        console.log(payloadForService);
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