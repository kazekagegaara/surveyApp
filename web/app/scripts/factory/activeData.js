(function () {

'use strict';
	
	//Load controller
  	angular.module('surveyApp').service('activeData', function(){
  		
      this.questions = [];
      
      this.setSurveyQuestions = function(questions){
        this.questions = questions;
      };     
  		
      this.getSurveyQuestions = function(){
        return this.questions;
      };
  		
  	});

})();