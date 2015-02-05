(function () {

'use strict';
	
	//Load controller
  	angular.module('surveyApp').controller('surveyController', ['$scope','$location','activeData',function($scope,$location,activeData) {
      	
  		$scope.title = "Survey";  
  		$scope.questions = [];	  		
  		$scope.questionCounter = 0;
      $scope.answers = [];      
      $scope.selectedAnswer = '';
      $scope.surveyID = '';

      $scope.$watch('selectedAnswer', function(value) {        
        if(value !== '' && value !== undefined){    
          console.log(value);
          var currentQuesID = $scope.questions[$scope.questionCounter].quesID;  
          var answerID = JSON.parse(value).answerID;    
          console.log(answerID);          
          console.log($scope.questions[$scope.questionCounter].quesID);           
          $scope.saveAnswerToLocalStorage(currentQuesID,answerID);
          $("#next").removeClass("disabled");           
        }        
      });         

      $scope.saveAnswerToLocalStorage = function(quesID,ansID){        
        var surveyID = $scope.surveyID;        
        localStorage.setItem(surveyID + ":" + quesID,ansID);        
      };

      $scope.checkFromLocalStorage = function(quesID){
        var surveyID = $scope.surveyID;
        if(localStorage.getItem(surveyID + ":" + quesID) !== null)
          return localStorage.getItem(surveyID + ":" + quesID);
        else
          return "not set";
      };

  		$scope.controllerInit = function(){  			
  			$scope.questions = activeData.getSurveyQuestions();  
        $scope.surveyID = activeData.getSurveyID();         
        console.log($scope.questions);
        if($scope.questionCounter === 0)
          $("#prev").addClass("disabled"); 					
  			$scope.populateQuestions();
  		};

  		$scope.populateQuestions = function(){               
  			console.log($scope.questions[$scope.questionCounter]);
  			var questionText = $scope.questions[$scope.questionCounter].questionText;
  			$scope.question = questionText;
        if($scope.questions[$scope.questionCounter].questionType === "multiChoiceSingleCorrect"){
          $("#optionsTwo").hide();
          $("#optionsThree").hide(); 
          $("#optionsOne").show();          
        }
        else if($scope.questions[$scope.questionCounter].questionType === "multiChoiceMultipleCorrect"){
          $("#optionsOne").hide();          
          $("#optionsTwo").hide();
          $("#optionsThree").show(); 
        }
        else if($scope.questions[$scope.questionCounter].questionType === "bodyPain"){
          $("#optionsOne").hide();
          $("#optionsThree").hide(); 
          $("#optionsTwo").show();
        }        
        $scope.populateAnswers();
  		};

      $scope.populateAnswers = function(){
        $scope.answers = [];
        var selectedAnswer = $scope.checkFromLocalStorage($scope.questions[$scope.questionCounter].quesID);        
        angular.forEach($scope.questions[$scope.questionCounter].answerOptions, function(value, key) {
          console.log(value.answerText);
          $scope.answers.push(value);
          if( selectedAnswer !== 'not set'){
            if( selectedAnswer === parseInt(value.answerID)){
              console.log("here");
              $scope.selectedAnswer = value;
              console.log($scope.selectedAnswer);
            }            
          }
        });        
        console.log($scope.answers);        
      };

      $scope.goPrev = function(){              
        $scope.questionCounter--;
        if($scope.questionCounter === 0)
          $("#prev").addClass("disabled");        
        $("#next").removeClass("disabled");
        $scope.populateQuestions();
      };
      

      $scope.goNext = function(){        
        $scope.questionCounter++;
        if($scope.questionCounter > 0)
          $("#prev").removeClass("disabled");
        if($scope.questionCounter === $scope.questions.length-1)
          $("#next").addClass("disabled");
        $scope.populateQuestions();
        $scope.selectedAnswer = '';
        $("#next").addClass("disabled");
      };

      $scope.changePage = function(path){                                     
          $location.path(path);       
      };


      //body part IDs
      $scope.parts=["frontFaceFill", "frontChestFill", "frontRightHandFill", "frontAbdomenFill", "frontLeftHandFill", "frontRightLegFill", "frontLeftLegFill", "backHeadFill", "backFill", "backLeftLegFill", "backRightLegFill", "backRightHandFill", "backLeftHandFill","backLowerFill"];

      //body part names that will be printed in the text area
      $scope.partNames=["Front Head Area", "Chest Area", "Right Hand Front", "Abdomen Area", "Left Hand Front", "Right Leg Front", "Left Leg Front", "Head Back Area", "Back", "Left Leg Back", "Right Leg Back", "Right Hand Back", "Left Hand Back", "Lower Back"];
      $scope.partClicked = "No Part Selected";
      $scope.painIntensityValue = 0;

      /*jshint -W030 */
      $scope.position;      
      /*jshint -W030 */
      $scope.lastSelectedPart;      
      $scope.noPartSelected=true;
      

      $scope.onClickParts = function($event){              
        $scope.position=$scope.parts.indexOf($event.target.id);
        //clear out other parts
        if($scope.lastSelectedPart!=$event.target){ //hightlight currSelectedPart and update label
          if(typeof $scope.lastSelectedPart!=="undefined"){
            $scope.lastSelectedPart.style.fill='#ffffff';
          }          
          $event.target.style.fill='#e74c3c';
          $scope.noPartSelected=false;
        }
        else{//toggle status according to noPartSelected
              if($scope.noPartSelected){                
                  $event.target.style.fill='#e74c3c';
                  $scope.noPartSelected=false;
              }
              else{                
                  $event.target.style.fill='#ffffff';
                  $scope.partClicked='';                  
                  $scope.noPartSelected=true;
              }
        }
        if($scope.noPartSelected){
          $scope.partClicked="No Part Selected";          
        }
        else{
          $scope.partClicked=$scope.partNames[$scope.position];          
        }        
        $scope.lastSelectedPart=$event.target;        
      };


  		$scope.controllerInit();

    }
  ]);

})();