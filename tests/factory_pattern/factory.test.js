/**
 * Created by rkepler on 1/19/2015.
 */
'use strict';

var _ = require("lodash");
/*
 Factory Pattern

 The Factory pattern is another creational pattern concerned with the notion of creating objects. Where it differs from
 the other patterns in its category is that it doesn't explicitly require us use a constructor. Instead, a Factory can
 provide a generic interface for creating objects, where we can specify the type of factory object we wish to be created.

 Imagine that we have a UI factory where we are asked to create a type of UI component. Rather than creating this
 component directly using the new operator or via another creational constructor, we ask a Factory object for a new
 component instead. We inform the Factory what type of object is required (e.g "Button", "Panel") and it instantiates this,
 returning it to us for use.

 This is particularly useful if the object creation process is relatively complex, e.g. if it strongly depends on dynamic
 factors or application configuration.

 Examples of this pattern can be found in UI libraries such as ExtJS where the methods for creating objects or
 components may be further subclassed.

 */

describe('Factory Pattern', function () {


    describe('Factory Pattern Example', function () {
        var Car, Truck, VehicleFactory;
        beforeEach(function () {
            //the sample class used in all tests in this describe().
            //for these tests, we assign the class to the variable above

            // Types.js - Constructors used behind the scenes
            // A constructor for defining new cars
            Car = function Car(options) {
                // some defaults
                this.doors = options.doors || 4;
                this.state = options.state || "brand new";
                this.color = options.color || "silver";
            }
            // A constructor for defining new trucks
            Truck = function Truck(options) {
                this.state = options.state || "used";
                this.wheelSize = options.wheelSize || "large";
                this.color = options.color || "blue";
            }

            // FactoryExample.js
            // Define a skeleton vehicle factory
            VehicleFactory = function VehicleFactory() {
            }
            // Define the prototypes and utilities for this factory
            // Our default vehicleClass is Car
            VehicleFactory.prototype.vehicleClass = Car;

            // Our Factory method for creating new Vehicle instances
            VehicleFactory.prototype.createVehicle = function (options) {
                switch (options.vehicleType) {
                    case "car":
                        this.vehicleClass = Car;
                        break;
                    case "truck":
                        this.vehicleClass = Truck;
                        break;
                    //defaults to VehicleFactory.prototype.vehicleClass (Car)
                }
                return new this.vehicleClass(options);
            };

        });

        it('should create a car from factory', function () {
            // Create an instance of our factory that makes cars
            var carFactory = new VehicleFactory();
            var car = carFactory.createVehicle({
                vehicleType: "car",
                color: "yellow",
                doors: 6
            });
            expect(car instanceof Car).to.be.true;
        });
        it('should create a yellow car from factory', function () {
            // Create an instance of our factory that makes cars
            var carFactory = new VehicleFactory();
            var car = carFactory.createVehicle({
                vehicleType: "car",
                color: "yellow",
                doors: 6
            });
            expect(car.color).to.equals("yellow");
        });
        it('should create a truck from Factory', function () {
            var vehicleFactory = new VehicleFactory();
            var movingTruck = vehicleFactory.createVehicle({
                vehicleType: "truck",
                state: "like new",
                color: "red",
                wheelSize: "small"
            });
            expect(movingTruck instanceof Truck).to.be.true;
            expect(movingTruck.color).to.equals("red");
        });
        it('should extend factory to default to trucks', function () {
            var TruckFactory = function TruckFactory() {
            };
            TruckFactory.prototype = new VehicleFactory();
            TruckFactory.prototype.vehicleClass = Truck;

            var truckFactory = new TruckFactory();
            var myBigTruck = truckFactory.createVehicle({
                state: "omg..so bad.",
                color: "pink",
                wheelSize: "so big"
            });
            expect(myBigTruck instanceof Truck).to.be.true;
            expect(myBigTruck.color).to.equals("pink");
        });
    });
    /*

     When To Use The Factory Pattern
     ===============================
     The Factory pattern can be especially useful when applied to the following situations:

     * When our object or component setup involves a high level of complexity
     * When we need to easily generate different instances of objects depending on the environment we are in
     * When we're working with many small objects or components that share the same properties
     * When composing objects with instances of other objects that need only satisfy an API contract (aka, duck typing)
     to work. This is useful for decoupling.

     When Not To Use The Factory Pattern
     ===================================
     When applied to the wrong type of problem, this pattern can introduce an unnecessarily great deal of complexity to
     an application. Unless providing an interface for object creation is a design goal for the library or framework
     we are writing, I would suggest sticking to explicit constructors to avoid the unnecessary overhead.

     */

    describe('Abstract vehicle factory', function () {
        var abstractVehicleFactory, Car, Truck;
        beforeEach(function () {
            //the sample class used in all tests in this describe().
            //for these tests, we assign the class to the variable above

            abstractVehicleFactory = (function () {
                var types = {};  // Storage for our vehicle types
                return {
                    getVehicle: function (type, customizations) {
                        var Vehicle = types[type]; //Vehicle here is a Car or Truck (polymorphism). type = 'car' or 'truck'
                        //if it's been defined (registered) create a new instance, otherwise do nothing (null).
                        return (Vehicle ? new Vehicle(customizations) : null);
                    },
                    registerVehicle: function (type, Vehicle) {
                        //var proto = Vehicle.prototype;
                        // only register classes that fulfill the vehicle contract
                        //if (proto.drive && proto.breakDown) {
                            types[type] = Vehicle; //here it's a Car or Truck
                        //}
                        return abstractVehicleFactory;
                    }
                };
            })();

            // Types.js - Constructors used behind the scenes
            // A constructor for defining new cars
            Car = function Car(options) {
                // some defaults
                this.doors = options.doors || 4;
                this.state = options.state || "brand new";
                this.color = options.color || "silver";
            }
            // A constructor for defining new trucks
            Truck = function Truck(options) {
                this.state = options.state || "used";
                this.wheelSize = options.wheelSize || "large";
                this.color = options.color || "blue";
            }
            //------------------------------------------------------------
            // Usage:
            abstractVehicleFactory.registerVehicle("car", Car);
            abstractVehicleFactory.registerVehicle("truck", Truck);
            //------------------------------------------------------------

        });
        it('should produce a Car', function () {
            //Instantiate a new car based on the abstract vehicle type.
            // Only instantiates what has been defined (registered).
            var car = abstractVehicleFactory.getVehicle("car", {
                color: "lime green",
                state: "like new"
            });
            expect(car instanceof Car).to.be.true;
            expect(car.color).to.equals("lime green");
        });
        it('should produce a Truck', function () {
            // Instantiate a new truck in a similar manner
            var truck = abstractVehicleFactory.getVehicle("truck", {
                wheelSize: "medium",
                color: "neon yellow"
            });
            expect(truck instanceof Truck).to.be.true;
            expect(truck.color).to.equals("neon yellow");
        });

    });
});