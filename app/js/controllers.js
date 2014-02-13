'use strict';

/* Controllers */

angular.module('myApp.controllers', []).
  controller('GameController', [ '$scope', function($scope) {

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
      var x, y;
      do {
        y = rand();
        x = rand();
      } while ($scope.values[y][x] != null);

      $scope.values[y][x] = $scope.playWith == 'X' ? 'O' : 'X';
    };

    $scope.checkWinner = function () {
      var r1 = $scope.values[0];
      var r2 = $scope.values[1];
      var r3 = $scope.values[2];

      $scope.winner = null;

      if (r1[0] == r1[1] && r1[1] == r1[2] && r1[0] != null) $scope.winner = r1[0];
      if (r2[0] == r2[1] && r2[1] == r2[2] && r2[0] != null) $scope.winner = r2[0];
      if (r3[0] == r3[1] && r3[1] == r3[2] && r3[0] != null) $scope.winner = r3[0];

      if (r1[0] == r2[0] && r2[0] == r3[0] && r1[0] != null) $scope.winner = r1[0];
      if (r1[1] == r2[1] && r2[1] == r3[1] && r2[1] != null) $scope.winner = r1[1];
      if (r1[2] == r2[2] && r2[2] == r3[2] && r3[2] != null) $scope.winner = r1[2];

      if (r1[0] == r2[1] && r2[1] == r3[2] && r1[0] != null) $scope.winner = r1[0];
      if (r3[0] == r2[1] && r2[1] == r1[2] && r3[0] != null) $scope.winner = r3[0];

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
    };

    function isFullTable() {
      var FullTable = true;
      for (var i = $scope.values.length - 1; i >= 0; i--) {
        if ($scope.values[i].indexOf(null) > -1) FullTable = false;
      };
      return FullTable;
    }

  }]);