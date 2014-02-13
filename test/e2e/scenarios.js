'use strict';

/* https://github.com/angular/protractor/blob/master/docs/getting-started.md */

describe('my app', function() {

  browser.get('index.html');

  it('should automatically redirect to /game when location hash/fragment is empty', function() {
    expect(browser.getLocationAbsUrl()).toMatch("/game");
  });



});
