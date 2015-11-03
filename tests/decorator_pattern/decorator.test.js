/**
 * Created by rkepler on 1/21/2015.
 */
    //'use strict'; //had to run this off to make some of the examples work (e.g. Interface). Not recommended!!

var _ = require("lodash");
/*
 Decorator Pattern

 Decorators are a structural design pattern that aim to promote code re-use. Similar to Mixins, they can be
 considered another viable alternative to object sub-classing.

 Classically, Decorators offered the ability to add behaviour to existing classes in a system dynamically. The
 idea was that the decoration itself wasn't essential to the base functionality of the class, otherwise it would
 be baked into the superclass itself.

 They can be used to modify existing systems where we wish to add additional features to objects without the
 need to heavily modify the underlying code using them. A common reason why developers use them is their
 applications may contain features requiring a large quantity of distinct types of object. Imagine having to
 define hundreds of different object constructors for say, a JavaScript game.

 The object constructors could represent distinct player types, each with differing capabilities. A Lord of
 the Rings game could require constructors for Hobbit, Elf, Orc, Wizard, Mountain Giant, Stone Giant and so on,
 but there could easily be hundreds of these. If we then factored in capabilities, imagine having to
 create sub-classes for each combination of capability type e.g HobbitWithRing,HobbitWithSword,
 HobbitWithRingAndSword and so on.This isn't very practical and certainly isn't manageable when we factor in a
 growing number of different abilities.

 The Decorator pattern isn't heavily tied to how objects are created but instead focuses on the problem of
 extending their functionality. Rather than just relying on prototypal inheritance, we work with a single base
 object and progressively add decorator objects which provide the additional capabilities. The idea is that
 rather than sub-classing, we add (decorate) properties or methods to a base object so it's a little more streamlined.

 Adding new attributes to objects in JavaScript is a very straight-forward process so with this in mind, a
 very simplistic decorator may be implemented as follows:

 */

describe('Decorator Pattern', function() {


    describe('Decorating constructors with new functionality', function () {
        'use strict';
        var Vehicle;
        beforeEach(function () {
                //the sample class used in all tests in this describe().
                //for these tests, we assign the class to the variable Vehicle

                // A vehicle constructor
                Vehicle = function Vehicle( vehicleType ){
                    // some sane defaults
                    this.vehicleType = vehicleType || "car";
                    this.model = "default";
                    this.license = "00000-000";
                }

            }
        );
        it('should decorate new Vehicle instance', function () {
            var truck = new Vehicle("truck");
            // New functionality we're decorating vehicle with
            truck.setModel = function( modelName ){
                this.model = modelName;
            };
            truck.setColor = function( color ){
                this.color = color;
            };
            // Test the value setters and value assignment works correctly
            truck.setModel( "CAT" );
            truck.setColor( "blue" );
            expect(truck.vehicleType).to.equal("truck");
            expect(truck.model).to.equal("CAT");
            expect(truck.color).to.equal("blue");
            // Demonstrate "vehicle" is still unaltered
            var secondInstance = new Vehicle( "car" );
            expect(secondInstance.vehicleType).to.equal("car");
            expect(secondInstance.model).to.equals("default");
            expect(secondInstance.color).to.be.undefined;
            /*
             This type of simplistic implementation is functional, but it doesn't really demonstrate all of the
             strengths Decorators have to offer. For this, we're first going to go through my variation of the
             Coffee example from an excellent book called Head First Design Patterns by Freeman, Sierra and Bates,
             which is modeled around a Macbook purchase.
             */

        });
    });
    describe('Decorating Objects With Multiple Decorators', function () {
        'use strict';
        var MacBook, memory, engraving, insurance;
        beforeEach(function () {
                //the sample class used in all tests in this describe().
                //for these tests, we assign the class to the variable above

                // The constructor to decorate
                MacBook = function MacBook() {
                    this.cost = function () { return 997; };
                    this.screenSize = function () { return 11.6; };
                }
                // Decorator 1
                memory = function memory( macbook ) {
                    var v = macbook.cost();
                    macbook.cost = function() {
                        return v + 75;
                    };
                }
                // Decorator 2
                engraving = function engraving( macbook ){
                    var v = macbook.cost();
                    macbook.cost = function(){
                        return  v + 200;
                    };
                }
                // Decorator 3
                insurance = function insurance( macbook ){
                    var v = macbook.cost();
                    macbook.cost = function(){
                        return  v + 250;
                    };
                }
            }
        );
        it('should decorate constructor with many options', function () {
            var myMac = new MacBook();
            memory(myMac);
            engraving(myMac);
            insurance(myMac);
            expect(myMac.cost()).to.equals(1522);
            expect(myMac.screenSize()).to.equals(11.6);
            /*
             In the above example, our Decorators are overriding the MacBook() super-class objects .cost() function
             to return the current price of the Macbook plus the cost of the upgrade being specified.

             It's considered a decoration as the original Macbook objects constructor methods which are not
             overridden (e.g. screenSize()) as well as any other properties which we may define as a part of
             the Macbook remain unchanged and intact.

             There isn't really a defined interface in the above example and we're shifting away the
             responsibility of ensuring an object meets an interface when moving from the creator to the receiver.
             */
        });
    });
    describe('Introduction to interfaces in JavaScript', function () {
        //warning: not using strict here, or the code presented by the patterns book author doesn't work.
        //it's the fake interface implementation piece that won't run with 'use strict';
        var Interface;
        before( function () {
           //RK: this is the code to fake interface implementation in JavaScript. It's a dynamically typed
           //language and trying to fake what statically typed languages do is tricky. I'm including this here
           //just so one can see it and make their own choices. The code is from here:
           //https://gist.github.com/addyosmani/1057989
           //RK: Also, dangerous code if you ask me, as it won't work when 'use strict'; is turned on.

            /**
             Code copyright Dustin Diaz and Ross Harmes, Pro JavaScript Design Patterns.
             **/
            // Constructor.
            Interface = function (name, methods) {
                if (arguments.length != 2) {
                    throw new Error("Interface constructor called with " + arguments.length + "arguments, but expected exactly 2.");
                }
                this.name = name;
                this.methods = [];
                for (var i = 0, len = methods.length; i < len; i++) {
                    if (typeof methods[i] !== 'string') {
                        throw new Error("Interface constructor expects method names to be " + "passed in as a string.");
                    }
                    this.methods.push(methods[i]);
                }
            };
            // Static class method.
            Interface.ensureImplements = function (object) {
                if (arguments.length < 2) {
                    throw new Error("Function Interface.ensureImplements called with " + arguments.length + "arguments, but expected at least 2.");
                }
                for (var i = 1, len = arguments.length; i < len; i++) {
                    var interface = arguments[i];
                    if (interface.constructor !== Interface) {
                        throw new Error("Function Interface.ensureImplements expects arguments" + "two and above to be instances of Interface.");
                    }
                    for (var j = 0, methodsLen = interface.methods.length; j < methodsLen; j++) {
                        var method = interface.methods[j];
                        if (!object[method] || typeof object[method] !== 'function') {
                            throw new Error("Function Interface.ensureImplements: object " + "does not implement the " + interface.name + " interface. Method " + method + " was not found.");
                        }
                    }
                }
            };


        });
        var reminder, properties, Todo;
        beforeEach(function () {
                'use strict';
                //the sample class used in all tests in this describe().
                //for these tests, we assign the class to the variable above

                // Create interfaces using a pre-defined Interface constructor that accepts an interface name
                // and skeleton methods to expose. In our reminder example summary() and placeOrder()
                // represent functionality the interface should support

                //to-do: need to efine this, as JS doesnt support interfaces, it's not a fit.
                reminder = new Interface( "List", ["summary", "placeOrder"] );

                properties = {
                    name: "Remember to buy the milk",
                    date: "05/06/2016",
                    actions:{
                        summary: function (){
                            return "Remember to buy the milk, we are almost out!";
                        },
                        placeOrder: function (){
                            return "Ordering milk from your local grocery store";
                        }
                    }
                };
                // Now create a constructor implementing the above properties and methods
                Todo = function Todo( config ){
                    // State the methods we expect to be supported as well as the Interface instance being checked
                    // against
                    Interface.ensureImplements( config.actions, reminder );
                    this.name = config.name;
                    this.methods = config.actions;
                }
            }
        );
        it('should create Todo with the required methods in the interface', function () {
            var todoItem = new Todo(properties);
            expect(todoItem.methods.summary()).to.eql("Remember to buy the milk, we are almost out!");
        });
        it('should ', function () {
        });
        /*
         The biggest problem with interfaces is that, as there isn't built-in support for them in JavaScript, there is
         a danger of us attempting to emulate a feature of another language that may not be an ideal fit. Lightweight
         interfaces can be used without a great performance cost however and we will next look at Abstract Decorators
         using this same concept.

         RK comment: since the book's following examples require the use of the Interface emulator function above,
         I won't be covering it here. I wouldn't dare to code anything based on a fake implementation, also where
         one can't turn 'use strict'; on.

         */


    });
});