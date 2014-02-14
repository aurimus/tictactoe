'use strict';

/* Controllers */

angular.module('myApp.controllers', []).
  controller('GameController', [ '$scope', function($scope) {

    /* Init */

    var winPatters = [ // row, column
      // rows
      [[0,0],[0,1],[0,2]], // pattern 0
      [[1,0],[1,1],[1,2]], // pattern 1
      [[2,0],[2,1],[2,2]], // pattern 2

      // columns
      [[0,0],[1,0],[2,0]], // pattern 3
      [[0,1],[1,1],[2,1]], // pattern 4
      [[0,2],[1,2],[2,2]], // pattern 5
      
      // crosses
      [[0,0],[1,1],[2,2]], // pattern 6
      [[0,2],[1,1],[2,0]], // pattern 7
    ]

    /* Public */

    $scope.reset = function () {
      $scope.values = [
        [null, null, null],
        [null, null, null],
        [null, null, null]
      ];

      $scope.playWith = null;
      $scope.winner = null;
    }
    $scope.reset();

    $scope.playerMove = function(which, x, y) {
      if ($scope.playWith == null) $scope.playWith = which;

      if ($scope.values[y][x] == null){
        // Player move
        if(! $scope.winner) $scope.values[y][x] = $scope.playWith;
        $scope.checkWinner();
        
        // AI move
        if (! isFullTable()  && ! $scope.winner) $scope.AIMove();
        $scope.checkWinner();
      }
      
    };

    $scope.AIMove = function() {
      var AIsym = $scope.playWith == 'X' ? 'O' : 'X';
      var bestAIpatterns = getMostFilled(AIsym)
      var bestPlayerPatterns = getMostFilled($scope.playWith)

      var bestPatterns = _.intersection(bestAIpatterns, bestPlayerPatterns)
      if (bestPatterns.length == 0) bestPatterns = bestPlayerPatterns 

      var chosenPattern = winPatters[bestPatterns[Math.floor(Math.random()*bestPatterns.length)]]
      var coord = findEmptySquare(chosenPattern)

      $scope.values[ coord[0] ][ coord[1] ] = AIsym;
    };

    $scope.checkWinner = function () {
      $scope.winner = null;

      if (getFilled('X')) $scope.winner = 'X';
      if (getFilled('O')) $scope.winner = 'O';

      if ($scope.winner == null && isFullTable() ) $scope.winner = 'draw';
    }

    $scope.whoHasWon = function() {
      if ($scope.winner == null) return "Keep playing..";
      if ($scope.winner == 'draw') return "It is a draw!";

      if ($scope.winner == $scope.playWith){
        return 'You have won!';
      } else {
        return 'AI has beaten you, try again!';
      }
    };

    /* Private */

    function rand() {
      return Math.round(Math.random()*2);
    }

    function getMostFilled (predicate) {
      var bestPatterns = {}
      var occupiedPatterns = getOccupiedPatterns()
      
      for (var i = winPatters.length - 1; i >= 0; i--) {
        if (predicate)
          var i_filled = getNumFilled(winPatters[i], predicate) //- getNumFilled(winPatters[i], predicate == 'X' ? 'O' : 'X')
        else
          var i_filled = getNumFilled(winPatters[i])
        if (bestPatterns[i_filled] == undefined) bestPatterns[i_filled] = []
        bestPatterns[i_filled].push(i)
      }

      var occupiedPatterns = getOccupiedPatterns()
      
      for (var k = 3; k >= 0; k--) {
        if (bestPatterns[k] && _.difference(bestPatterns[k], occupiedPatterns).length > 0) 
          return bestPatterns[k];
      };
    }

    function getOccupiedPatterns () {
      var patterns = []
      for (var i = winPatters.length - 1; i >= 0; i--) {
        if (isOccupied(winPatters[i]))
          patterns.push(i)
      }
      return patterns
    }

    function isOccupied (pattern) {
      var Xnum = 0, Onum = 0;
      for (var i = pattern.length - 1; i >= 0; i--) {
        if ($scope.values[ pattern[i][0] ][ pattern[i][1] ] == 'X') Xnum++;
        if ($scope.values[ pattern[i][0] ][ pattern[i][1] ] == 'O') Onum++;
      }

      return Xnum && Onum
    }

    function getFilled (predicate) {
      for (var i = winPatters.length - 1; i >= 0; i--) {
        if (getNumFilled(winPatters[i], predicate) == 3)
          return i;
      };
    }

    function findEmptySquare (pattern) {
      for (var i = pattern.length - 1; i >= 0; i--) {
        if ($scope.values[ pattern[i][0] ][ pattern[i][1] ] == null)
          return pattern[i]
      };
    }

    function getNumFilled (pattern, predicate) {
      var count = 0;
      if (predicate){
        for (var i = pattern.length - 1; i >= 0; i--) {
          if ($scope.values[ pattern[i][0] ][ pattern[i][1] ] == predicate)
            count++;
        };
      } else {
        for (var i = pattern.length - 1; i >= 0; i--) {
          if ($scope.values[ pattern[i][0] ][ pattern[i][1] ] != null)
            count++;
        };
      }

      return count;
    }

    function isFullTable() {
      var FullTable = true;
      for (var i = $scope.values.length - 1; i >= 0; i--) {
        if ($scope.values[i].indexOf(null) > -1) FullTable = false;
      };
      return FullTable;
    }

  }]);