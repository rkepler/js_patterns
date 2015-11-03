/**
 * Created by rkepler on 1/15/2015.
 */
'use strict';

describe('Singleton Pattern', function () {
    /*
     Singletons differ from static classes (or objects) as we can delay their initialization, generally because they
     require some information that may not be available during initialization time. They don't provide a way for code
     that is unaware of a previous reference to them to easily retrieve them. This is because it is neither the object
     or "class" that's returned by a Singleton, it's a structure. Think of how closured variables aren't actually
     closures - the function scope that provides the closure is the closure.

     In JavaScript, Singletons serve as a shared resource namespace which isolate implementation code from the global
     namespace so as to provide a single point of access for functions.
    */

    var mySingleton;
    beforeEach(function () {
            //the sample class used in all tests in this describe().
            //for these tests, we assign the class to the variable mySingleton
            mySingleton = (function () {
                // Instance stores a reference to the Singleton
                var instance;
                function init() {
                    // Singleton
                    // Private methods and variables
                    function privateMethod(){
                        return "I am private";
                    }
                    var privateVariable = "Im also private";
                    var privateRandomNumber = Math.random();
                    // Public methods and variables
                    return {
                        publicMethod: function () {
                            return "The public can see me!";
                        },
                        publicProperty: "I am also public",
                        getRandomNumber: function() {
                            return privateRandomNumber;
                        }
                    };
                };
                return {
                    // Get the Singleton instance if one exists
                    // or create one if it doesn't
                    getInstance: function () {
                        if ( !instance ) {
                            instance = init();
                        }
                        return instance;
                    }
                };
            })();

        }
    );
    it('should have 2 instantiations be 1 and the same', function () {
        var singleA = mySingleton.getInstance();
        var singleB = mySingleton.getInstance();
        expect(singleA.getRandomNumber()).to.eql(singleB.getRandomNumber());
    });

    /*
     Whilst the Singleton has valid uses, often when we find ourselves needing it in JavaScript it's a sign that we may need
     to re-evaluate our design.

     They're often an indication that modules in a system are either tightly coupled or that logic is overly spread across
     multiple parts of a codebase. Singletons can be more difficult to test due to issues ranging from hidden dependencies,
     the difficulty in creating multiple instances, difficulty in stubbing dependencies and so on.

     */

});