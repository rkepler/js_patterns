/**
 * Created by rkepler on 1/15/2015.
 */
'use strict';

var _ = require("lodash");
/*
 Mixin Pattern

 In JavaScript, we can look at inheriting from Mixins as a means of collecting functionality through extension.
 Each new object we define has a prototype from which it can inherit further properties. Prototypes can inherit
 from other object prototypes but, even more importantly, can define properties for any number of object
 instances. We can leverage this fact to promote function re-use.

 Mixins allow objects to borrow (or inherit) functionality from them with a minimal amount of complexity.
 As the pattern works well with JavaScripts object prototypes, it gives us a fairly flexible way to share
 functionality from not just one Mixin, but effectively many through multiple inheritance.

 They can be viewed as objects with attributes and methods that can be easily shared across a number of other
 object prototypes.

 */

describe('Mixin Pattern', function() {


    describe('Simulating inheritance with mixins', function () {
        var Car;
        beforeEach(function () {
                //the sample class used in all tests in this describe().
                //for these tests, we assign the class to the variable Car

                //...
            }
        );
        it('should merge mixins using the lodash _ utility', function () {

            var myMixins = {
                moveUp: function(){
                    return "move up";
                },
                moveDown: function(){
                    return "move down";
                },
                stop: function(){
                    return "stop!";
                }
            };
            // A skeleton carAnimator constructor
            var CarAnimator = function CarAnimator(){
                this.moveLeft = function(){
                    return "move left";
                };
            }
            // A skeleton personAnimator constructor
            var PersonAnimator = function PersonAnimator(){
                this.moveRandomly = function(){ return "move randomly" };
            }

            // Extend both constructors with our Mixin. Use lodash to do that.See var _ = require("lodash") above
            _.assign( CarAnimator.prototype, myMixins );
            _.assign( PersonAnimator.prototype, myMixins );

            var myAnimator = new CarAnimator();
            expect(myAnimator.moveUp()).to.equals("move up");
            expect(myAnimator.moveLeft()).to.equals("move left");
            //As we can see, this allows us to easily "mix" in common behaviour into object constructors fairly trivially.
        });
        it('should ', function () {
            //expect(civic.toString()).to.equals("Ford Mondeo has done 5000 miles");
        });
    });
    describe('Constructor with Prototypes', function () {
        //In the next example, we have two constructors: a Car and a Mixin. What we're going to do is augment (
        // another way of saying extend) the Car so that it can inherit specific methods defined in the Mixin,
        // namely driveForward() and driveBackward(). This time we won't be using Underscore.js. RK comment: eh! why not?

        //Instead, this example will demonstrate how to augment a constructor to include functionality without
        // the need to duplicate this process for every constructor function we may have.
        var Car, Mixin, augment;
        beforeEach(function () {
                //the sample class used in all tests in this describe().
                //for these tests, we assign the class to the variable Car

                // Define a simple Car constructor
                Car = function ( settings ) {
                    this.model = settings.model || "no model provided";
                    this.color = settings.color || "no colour provided";
                };
                // Mixin
                Mixin = function () {};
                Mixin.prototype = {
                    driveForward: function () {
                        return "drive forward";
                    },
                    driveBackward: function () {
                        return "drive backward";
                    },
                    driveSideways: function () {
                        return "drive sideways";
                    }
                };
                // Extend an existing object with a method from another
                //rk comment: this is crazy utility code, that's why we have lodash
                augment = function augment( receivingClass, givingClass ) {
                    // only provide certain methods
                    if ( arguments[2] ) {
                        for ( var i = 2, len = arguments.length; i < len; i++ ) {
                            receivingClass.prototype[arguments[i]] = givingClass.prototype[arguments[i]];
                        }
                    }
                    // provide all methods
                    else {
                        for ( var methodName in givingClass.prototype ) {
                            // check to make sure the receiving class doesn't
                            // have a method of the same name as the one currently
                            // being processed
                            if ( !Object.hasOwnProperty.call(receivingClass.prototype, methodName) ) {
                                receivingClass.prototype[methodName] = givingClass.prototype[methodName];
                            }
                            // Alternatively (check prototype chain as well):
                            // if ( !receivingClass.prototype[methodName] ) {
                            //  receivingClass.prototype[methodName] = givingClass.prototype[methodName];
                            // }
                        }
                    }
                }

                //...
            }
        );
        it('should augment the Car constructor to include driveForward and driveBackward', function () {
            augment(Car, Mixin, "driveForward", "driveBackward");
            //now, create a new car
            var myCar = new Car({
                model: "Ford Escort",
                color: "blue"
            });
            expect(myCar.driveForward()).to.equals("drive forward");
            expect(myCar.driveBackward()).to.equals("drive backward");
            expect(typeof myCar.driveSideways).to.equal('undefined');

        });
        it('should augment the car constructor to include all mixin functions', function () {
            // We can also augment Car to include all functions from our mixin
            // by not explicitly listing a selection of them
            augment(Car, Mixin);
            //now, create a new car
            var myCar = new Car({
                model: "Porche",
                color: "red"
            });
            expect(myCar.driveForward()).to.equals("drive forward");
            expect(myCar.driveBackward()).to.equals("drive backward");
            expect(myCar.driveSideways()).to.equals("drive sideways");
        });
        it('should augment the car constructor to include all mixin functions using lodash', function () {
            //Car.prototype = _.create(Mixin.prototype);
            _.assign(Car.prototype, Mixin.prototype);
            //now, create a new car
            var myCar = new Car({
                model: "Porche",
                color: "red"
            });
            expect(myCar.driveForward()).to.equals("drive forward");
            expect(myCar.driveBackward()).to.equals("drive backward");
            expect(myCar.driveSideways()).to.equals("drive sideways");
        });
        it('should ', function () {
        });
        /*
         Advantages & Disadvantages
         --------------------------
         Mixins assist in decreasing functional repetition and increasing function re-use in a system. Where an
         application is likely to require shared behaviour across object instances, we can easily avoid any
         duplication by maintaining this shared functionality in a Mixin and thus focusing on implementing only
         the functionality in our system which is truly distinct.

         That said, the downsides to Mixins are a little more debatable. Some developers feel that injecting
         functionality into an object prototype is a bad idea as it leads to both prototype pollution and a
         level of uncertainly regarding the origin of our functions. In large systems this may well be the case.

         I [the author] would argue that strong documentation can assist in minimizing the amount of confusion
         regarding the source of mixed in functions, but as with every pattern, if care is taken during
         implementation we should be okay.

         */


    });
});