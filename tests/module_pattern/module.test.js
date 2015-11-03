/**
 * Created by rkepler on 1/14/2015.
 */

var express = require('express'),
    _ = require('lodash'),
    app = express();

'use strict';

describe('Module Pattern', function () {
    /*
     The Module pattern was originally defined as a way to provide both private and public encapsulation for
     classes in conventional software engineering.

     In JavaScript, the Module pattern is used to further emulate the concept of classes in such a way that
     we're able to include both public/private methods and variables inside a single object, thus shielding
     particular parts from the global scope. What this results in is a reduction in the likelihood of our function
     names conflicting with other functions defined in additional scripts on the page.

     It should be noted that there isn't really an explicitly true sense of "privacy" inside JavaScript because
     unlike some traditional languages, it doesn't have access modifiers. Variables can't technically be declared
     as being public nor private and so we use function scope to simulate this concept. Within the Module pattern,
     variables or methods declared are only available inside the module itself thanks to closure.
     Variables or methods defined within the returning object however are available to everyone.

     The pattern is quite similar to an immediately-invoked functional expression (IIFE - see the section on
     namespacing patterns for more on this) except that an object is returned rather than a function.
     */

    describe('Basic module pattern implementation', function () {
        var testModule;
        beforeEach(function () {
                //the sample class used in all tests in this describe().
                //for these tests, we assign the class to the variable testModule
                testModule = (function () {
                    var counter = 0;
                    return {
                        incrementCounter: function () {
                            return counter++;
                        },
                        incrementCounterNow: function () {
                            return ++counter;
                        },
                        resetCounter: function () {
                            //console.log("counter value prior to reset: " + counter);
                            counter = 0;
                        }
                    };
                })(); //the () at the end makes this an IIFE: "iffy" or Immediately-Invoked Function Expression

            }
        );
        it('should increment counter', function () {
            testModule.incrementCounter();
            expect(testModule.incrementCounter()).to.equal(1);
        });
        it('should increment counter right away', function () {
            expect(testModule.incrementCounterNow()).to.equal(1);
        });
        it('should reset counter', function () {
            testModule.resetCounter();
            expect(testModule.incrementCounter()).to.equal(0);
        });
        /*
         Here, other parts of the code are unable to directly read the value of our incrementCounter() or resetCounter().
         The counter variable is actually fully shielded from our global scope so it acts just like a private variable
         would - its existence is limited to within the module's closure so that the only code able to access its scope
         are our two functions. Our methods are effectively namespaced so in the test section of our code, we need to
         prefix any calls with the name of the module (e.g. "testModule").
         */

    });
    describe('Module Pattern shopping basket example', function () {
        var basketModule;
        beforeEach(function () {
                //the sample class used in all tests in this describe().
                //for these tests, we assign the class to the variable basketModule
                basketModule = (function () {
                    // privates
                    var basket = [];

                    function doSomethingPrivate() {
                        //...
                    }
                    function doSomethingElsePrivate() {
                        //...
                    }
                    // Return an object exposed to the public
                    return {
                        // Add items to our basket
                        addItem: function (values) {
                            basket.push(values);
                        },
                        // Get the count of items in the basket
                        getItemCount: function () {
                            return basket.length;
                        },
                        // Public alias to a  private function
                        doSomething: doSomethingPrivate,
                        // Get the total value of items in the basket
                        getTotal: function () {
                            var q = this.getItemCount(),
                                p = 0;
                            while (q--) {
                                p += basket[q].price;
                            }
                            return p;
                        }
                    };
                })();
            }
        );
        it('should add item to the basket', function () {
            basketModule.addItem({
                item: "bread",
                price: 0.5
            });
            expect(basketModule.getItemCount()).to.equals(1);
            expect(basketModule.getTotal()).to.equals(0.5);
        });
        it('should not allow the basket to be accessed directly', function () {
            // Outputs: undefined
            // This is because the basket itself is not exposed as a part of the public API
            expect(basketModule.basket).to.be.undefined;
            // This also won't work as it only exists within the scope of our
            // basketModule closure, but not the returned public object
            expect(typeof basket == 'undefined').to.be.true;
        });
        /*
         The methods above are effectively namespaced inside basketModule.
         Notice how the scoping function in the above basket module is wrapped around all of our functions, which we then call
         and immediately store the return value of. This has a number of advantages including:
         - The freedom to have private functions which can only be consumed by our module. As they aren't exposed to the
         rest of the page (only our exported API is), they're considered truly private.
         - Given that functions are declared normally and are named, it can be easier to show call stacks in a debugger
         when we're attempting to discover what function(s) threw an exception.
         */
    });
    describe('Module Pattern with imported mixins', function () {
        /*
        RK Note: this is currently my preferred method

         This variation of the pattern demonstrates how globals (e.g Express, Underscore) can be passed in as arguments
         to our module's anonymous function. This effectively allows us to import them and locally alias them as we wish.
         rk note: this is also a way to use injection through the constructor.
         */
        var myModule;
        beforeEach(function () {
                //the sample class used in all tests in this describe().
                //for these tests, we assign the class to the variable myModule
                myModule = (function (exp, ld) {
                    function privateMethod1() {
                        exp.set("title", "mySite");
                        return exp.get("title");
                    }

                    function privateMethod2() {
                        return ld.min([10, 5, 100, 2, 1000]);
                    }
                    //public space:
                    return {
                        publicMethod1: function () {
                            return privateMethod1();
                        },
                        publicMethod2: function () {
                            return privateMethod2();
                        }
                    };
                    //Pull in Express and Underscore (constructor injection)
                })(app, _);
            }
        );
        it('should return express title', function () {
            expect(myModule.publicMethod1()).to.equals("mySite");
        });
        it('should return min value', function () {
            expect(myModule.publicMethod2()).to.equals(2);
        });
    });
    describe('Module Pattern with Exports', function () {
        /*
         This next variation allows us to declare globals without consuming them and could similarly support the concept
         of global imports seen in the last example.
         */
        var myModule;
        beforeEach(function () {
                //the sample class used in all tests in this describe().
                //for these tests, we assign the class to the variable myModule
                myModule = (function (exp, ld) {
                    var module = {};

                    function privateMethod1() {
                        exp.set("title", "mySite");
                        return exp.get("title");
                    }
                    function privateMethod2() {
                        return ld.min([10, 5, 100, 1, 1000]);
                    }
                    //public space:
                    //the only var made public is what is returned, in this case the 'module' var.
                    module.publicMethod1 = function () {
                        return privateMethod1();
                    };
                    module.publicMethod2 = function () {
                        return privateMethod2();
                    }
                    return module;
                    //Pull in Express and Underscore (constructor injection)
                })(app, _);
            }
        );
        it('should return express title', function () {
            expect(myModule.publicMethod1()).to.equals("mySite");
        });
        it('should return min value', function () {
            expect(myModule.publicMethod2()).to.equals(1);
        });
        it('should not allow access to privateMethod1', function () {
            expect(function() {myModule.privateMethod1(); }).to.throw(TypeError);
        });
        it('should not allow access to privateMethod2', function () {
            var wrapper = function wrapper() {
                return myModule.privateMethod2();
            }
            expect(wrapper).to.throw(TypeError);
        });
    });

    /*
    WHY THE 'Revelaing Module Pattern' ISN'T BEING SHOWN HERE. Basically: I probably won't use it.

    ABOUT THE REVEALIING MODULE PATTERN

     Advantages

     This pattern allows the syntax of our scripts to be more consistent. It also makes it more clear at the end of the
     module which of our functions and variables may be accessed publicly which eases readability.

     Disadvantages

     A disadvantage of this pattern is that if a private function refers to a public function, that public function
     can't be overridden if a patch is necessary. This is because the private function will continue to refer to the
     private implementation and the pattern doesn't apply to public members, only to functions.

     Public object members which refer to private variables are also subject to the no-patch rule notes above.

     As a result of this, modules created with the Revealing Module pattern may be more fragile than those created
     with the original Module pattern, so care should be taken during usage.
     */
});