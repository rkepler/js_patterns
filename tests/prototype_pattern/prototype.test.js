/**
 * Created by rkepler on 1/15/2015.
 */
'use strict';

var _ = require("lodash");
/*
 Prototype Pattern

 The GoF refer to the prototype pattern as one which creates objects based on a template of an existing object through cloning.

 We can think of the prototype pattern as being based on prototypal inheritance where we create objects which act as
 prototypes for other objects. The prototype object itself is effectively used as a blueprint for each object the constructor
 creates. If the prototype of the constructor function used contains a property called name for example (as per the code
 sample lower down), then each object created by that same constructor will also have this same property.

 Reviewing the definitions for this pattern in existing (non-JavaScript) literature, we may find references to classes
 once again. The reality is that prototypal inheritance avoids using classes altogether. There isn't a "definition" object
 nor a core object in theory. We're simply creating copies of existing functional objects.

 One of the benefits of using the prototype pattern is that we're working with the prototypal strengths JavaScript has
 to offer natively rather than attempting to imitate features of other languages. With other design patterns, this isn't
 always the case.

 Not only is the pattern an easy way to implement inheritance, but it can also come with a performance boost as well: when
 defining a function in an object, they're all created by reference (so all child objects point to the same function) instead
 of creating their own individual copies.

 For those interested, real prototypal inheritance, as defined in the ECMAScript 5 standard, requires the use
 of Object.create (which we previously looked at earlier in this section). To remind ourselves, Object.create creates an
 object which has a specified prototype and optionally contains specified properties as well
 (e.g Object.create( prototype, optionalDescriptorObjects )).

 */

describe('Prototype Pattern', function () {

    describe('Basic prototypical cloning', function () {
        var Car;
        var Car2;
        var Car3;
        beforeEach(function () {
                //the sample class used in all tests in this describe().
                //for these tests, we assign the class to the variable Car

                //provide encapsulation, but it defines the methods (copy)on every single instance.
                Car = function Car(modelName) {
                    var _name = modelName;
                    return {
                        name: _name,
                        drive: function () {
                            return "Driving!";
                        },
                        panic: function () {
                            return "Panic!";
                        }
                    }
                };

                //It is unwise to unnecessarily create functions within other functions if closures are not needed for
                //a particular task, as it will negatively affect script performance both in terms of processing
                //speed and memory consumption.
                //
                //For instance, when creating a new object/class, *** methods *** should normally be associated to the
                //object's prototype rather than defined into the object constructor. The reason is that
                //whenever the constructor is called, the methods would get reassigned (that is, for every
                // object creation).
                //Source: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Closures

                //this creates methods ONCE for all instances, but it doesn't protect the scope of this._name, as it's
                //still made public. The Car example above provides encapsulation, but... it defines the methods (copy)
                //on every single instance.
                Car2 = function Car2(modelName) {
                    var _name = modelName;
                }
                Car2.prototype = {
                    getName: function () {
                        return _name;
                    },
                    drive: function () {
                        return "Driving";
                    },
                    panic: function () {
                        return "Panic!";
                    }
                }

                //Car = function Car(modelName) {
                //    this._name = modelName;
                //}(function() {
                //    this.name = function () {
                //        return this._name;
                //    };
                //    this.drive = function () {
                //        return "Driving";
                //    };
                //    this.panic = function () {
                //        return "Panic!";
                //    }
                //}).call(Car.prototype);

            }
        );
        it('should clone 2 cars with Object.create', function () {
            var myCar = new Car("Ford Escort");
            //expect(typeof myCar._name).to.equal("undefined");
            //console.log(typeof myCar._name);
            //expect(myCar.getName.to.eql("Ford Escort");

            //var myOtherCar = Object.create(myCar); //myOtherCar will only have a prototype property. All other functions are pointers
            //expect(myCar.getName()).to.eql(myOtherCar.getName);
        });
    });
    describe('Prototypical inheritance', function () {
        var Rabbit;
        var Dog;
        var inherit;
        beforeEach(function () {
                //the sample class used in all tests in this describe().
                //for these tests, we assign the class to the variable above
                Rabbit = function Rabbit(name) {
                    this.name = name; //R-E-A-L-L-Y   B-A-D  !! because it's using the global scope.
                }

                inherit = function inherit(proto) {
                    function F() {
                    }      //A new function F is created. It doesn’t set anything to 'this', so new F creates an empty object.
                    F.prototype = proto; //F.prototype is set to given proto
                    return new F();      //Bingo! We’ve got an empty object with given proto.
                }

            }
        );
        it('should not inherit by setting prototype after the object creation', function () {
            var animal = {eats: true};
            var rabbit = new Rabbit("fluffy");
            rabbit.prototype = animal; //too late to specify the prototype. Only works during instantiation (object initialization).
            expect(rabbit.eats).to.be.undefined;
        });
        it('should inherit using prototype', function () {
            var animal = {eats: true};
            Rabbit.prototype = animal; //ok to specify prototype before creating a new object, line below:
            var rabbit = new Rabbit("BigEars");

            expect(rabbit.eats).to.be.true;
            expect(rabbit.name).to.equals("BigEars");
        });
        it('should inherit using the module pattern - deterministic inheritance', function () {
            var animal = {
                eats: true
            };

            var Dog = function Dog(dogName) {
                var _animal = typeof animal == 'undefined' ? {} : animal; //var _animal = (animal || {}); //this doesn't work if animal is undefined.
                var _name = dogName;
                var _barks = true;
                //public access
                return {
                    eats: _animal.eats, //no seamless inheritance :-) AND technically you don't need to use private var
                    barks: _barks,
                    name: _name
                }
            };

            //_.assign(Dog.prototype, animal);
            var myDog = new Dog("Fido");
            expect(myDog.barks).to.be.true;
            expect(myDog.name).to.equals("Fido");
            expect(myDog.eats).to.be.true;
            expect(myDog._name).to.be.undefined;
        });
        //this is the right way to do it, using encapsulation with the Module Pattern (not in the book, BTW).
        it('should inherit using the module pattern with prototypical inheritance', function () {
            //it could also be a function
            var animal = {
                eats: true
            };

            var Dog = function Dog(dogName) {
                var _name = dogName;
                var _barks = true;
                Dog.__proto__ = animal;
                //public access
                return {
                    __proto__: Dog.__proto__, //or just place "parent object" here directly, but... prefer to use private access
                    barks: _barks,
                    name: _name
                }
            };

            //_.assign(Dog.prototype, animal); //won't work with the Module Pattern
            var myDog = new Dog("Fido");
            expect(myDog.barks).to.be.true;
            expect(myDog.name).to.equals("Fido");
            expect(myDog.eats).to.be.true;
            expect(myDog._name).to.be.undefined;
        });
    });

});