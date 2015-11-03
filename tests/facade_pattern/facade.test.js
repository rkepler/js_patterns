/**
 * Created by rkepler on 1/15/2015.
 */
'use strict';

var _ = require("lodash");
/*
 Facade Pattern

 Facades are a structural pattern which can often be seen in JavaScript libraries like jQuery where, although an
 implementation may support methods with a wide range of behaviors, only a "facade" or limited abstraction of
 these methods is presented to the public for use.

 */

describe('Facade Pattern', function () {


    describe('...', function () {
        var Mortgage;
        beforeEach(function () {
                //the sample class used in all tests in this describe().
                //for these tests, we assign the class to the variable above

                //The Mortgage object is the Facade in the sample code. It presents a simple interface to the
                //client with only a single method: applyFor. Yet, underneath this simple API lies considerable complexity.
                Mortgage = function (name) {
                    var _name = name;

                    return {

                        applyFor: function (amount) {
                            // access multiple subsystems...
                            var result = "approved";
                            if (!new Bank().verify(_name, amount)) {
                                result = "denied";
                            } else if (!new Credit().get(_name)) {
                                result = "denied";
                            } else if (!new Background().check(_name)) {
                                result = "denied";
                            }
                            return _name + " has been " + result +
                                " for a " + amount + " mortgage";
                        }
                    }
                }
                var Bank = function () {
                    return {
                        verify: function (name, amount) {
                            // complex logic ...
                            return true;
                        }
                    }
                }
                var Credit = function () {
                    return {
                        get: function (name) {
                            // complex logic ...
                            return true;
                        }
                    }
                }
                var Background = function () {
                    return {
                        check: function (name) {
                            // complex logic ...
                            return true;
                        }
                    }
                }

            }
        );

        it('should approve mortgage', function () {
            var mortgage = new Mortgage("Joan Templeton");
            var result = mortgage.applyFor("$100,000");
            expect(result).to.equals("Joan Templeton has been approved for a $100,000 mortgage");
        });

    });
    describe('...', function () {
        var Car;
        beforeEach(function () {
                //the sample class used in all tests in this describe().
                //for these tests, we assign the class to the variable Car

                //...
            }
        );
        it('should ', function () {
            //expect(civic.toString()).to.equals("Honda Civic has done 20000 miles");
        });
        it('should ', function () {
            //expect(civic.toString()).to.equals("Ford Mondeo has done 5000 miles");
        });

    });
});