/**
 * Created by rkepler on 1/14/2015.
 */
'use strict';

describe('Object Literals Examples', function () {
    /*
     In object literal notation, an object is described as a set of comma-separated name/value pairs
     enclosed in curly braces ({}). Names inside the object may be either strings or identifiers that are
     followed by a colon.

     var myObjectLiteral = {
     variableKey: variableValue,
     functionKey: function () {
     // ...
     }
     };

     Object literals don't require instantiation using the new operator but shouldn't be used at the start of a
     statement as the opening { may be interpreted as the beginning of a block. Outside of an object, new
     members may be added to it using assignment as follows myModule.property = "someValue";

     */

    var myModule;
    beforeEach(function () {
            //the sample class used in all tests in this describe().
            //for these tests, we assign the class to the variable myModule
            myModule = {

                myProperty: "someValue",

                // object literals can contain properties and methods.
                // e.g we can define a further object for module configuration:
                myConfig: {
                    useCaching: true,
                    language: "en"
                },
                // a very basic method
                saySomething: function () {
                    return "Where in the world is Paul Irish today?";
                },
                // output a value based on the current configuration
                reportMyConfig: function () {
                    return "Caching is: " + ( this.myConfig.useCaching ? "enabled" : "disabled");
                },
                // override the current configuration
                updateMyConfig: function (newConfig) { //pass-in a new configuration object (this is a setter)
                    if (typeof newConfig === "object") {
                        this.myConfig = newConfig;
                    }
                }
            };

        }
    );
    it('should say something', function () {
        expect(myModule.saySomething()).to.equals("Where in the world is Paul Irish today?");
    });
    it('should say caching is enabled', function () {
        expect(myModule.reportMyConfig()).to.equals("Caching is: enabled");
    });
    it('should say caching is disabled', function () {
        var myNewConfig = {
            useCaching: false,
            language: "en"
        }
        myModule.updateMyConfig(myNewConfig);
        expect(myModule.reportMyConfig()).to.equals("Caching is: disabled");
    });

    /*
     Using object literals can assist in encapsulating and organizing your code and Rebecca Murphey has previously
     written about this topic in depth (http://rmurphey.com/blog/2009/10/15/using-objects-to-organize-your-code/)
     should you wish to read into object literals further.

     That said, if we're opting for this technique, we may be equally as interested in the Module pattern.
     It still uses object literals but only as the return value from a scoping function.
     */


});