/**
 * Created by rkepler on 1/22/2015.
 */
'use strict';

var _ = require("lodash");
/*
 Flyweight Pattern
 =================
 The Flyweight pattern is a classical structural solution for optimizing code that is repetitive, slow and
 inefficiently shares data. It aims to minimize the use of memory in an application by sharing as much data as
 possible with related objects (e.g application configuration, state and so on).

 The pattern was first conceived by Paul Calder and Mark Linton in 1990 and was named after the boxing weight
 class that includes fighters weighing less than 112lb. The name Flyweight itself is derived from this weight
 classification as it refers to the small weight (memory footprint) the pattern aims to help us achieve.

 In practice, Flyweight data sharing can involve taking several similar objects or data constructs used by a
 number of objects and placing this data into a single external object. We can pass through this object
 through to those depending on this data, rather than storing identical data across each one.

 Using Flyweights
 ----------------
 There are two ways in which the Flyweight pattern can be applied. The first is at the data-layer, where we
 deal with the concept of sharing data between large quantities of similar objects stored in memory.

 The second is at the DOM-layer where the Flyweight can be used as a central event-manager to avoid attaching
 event handlers to every child element in a parent container we wish to have some similar behavior.

 As the data-layer is where the flyweight pattern is most used traditionally, we'll take a look at this first.

 Flyweights and sharing data
 ---------------------------
 For this application, there are a few more concepts around the classical Flyweight pattern that we need to
 be aware of. In the Flyweight pattern there's a concept of two states - intrinsic and extrinsic. Intrinsic
 information may be required by internal methods in our objects which they absolutely cannot function
 without. Extrinsic information can however be removed and stored externally.

 Objects with the same intrinsic data can be replaced with a single shared object, created by a factory
 method. This allows us to reduce the overall quantity of implicit data being stored quite significantly.

 The benefit of this is that we're able to keep an eye on objects that have already been instantiated so that new
 copies are only ever created should the intrinsic state differ from the object we already have.

 We use a manager to handle the extrinsic states. How this is implemented can vary, but one approach to this to
 have the manager object contain a central database of the extrinsic states and the flyweight objects which they belong to.

 */

describe('Flyweight Pattern', function() {

    describe('Flyweights and sharing data', function () {
        /*
         We will be making use of three types of Flyweight components in this implementation, which are listed below:

         Flyweight corresponds to an interface through which flyweights are able to receive and act on extrinsic states
         Concrete Flyweight actually implements the Flyweight interface and stores intrinsic state. Concrete Flyweights
         need to be sharable and capable of manipulating state that is extrinsic
         Flyweight Factory manages flyweight objects and creates them too. It makes sure that our flyweights are
         shared and manages them as a group of objects which can be queried if we require individual instances. If an object has been already created in the group it returns it, otherwise it adds a new object to the pool and returns it.

         These correspond to the following definitions in our implementation:

         CoffeeOrder: Flyweight
         CoffeeFlavor: Concrete Flyweight
         CoffeeOrderContext: Helper
         CoffeeFlavorFactory: Flyweight Factory
         testFlyweight: Utilization of our Flyweights
         */
        var CoffeeOrder, CoffeeFlavor, CoffeeOrderContext, CoffeeFlavorFactory;
        before(function() {

            //Function.prototype.implementsFor works on an object constructor and will accept a parent
            //class (function) or object and either inherit from this using normal inheritance (for functions) or
            //virtual inheritance (for objects).
            Function.prototype.implementsFor = function( parentClassOrObject ){
                if ( parentClassOrObject.constructor === Function )
                {
                    // Normal Inheritance
                    this.prototype = new parentClassOrObject();
                    this.prototype.constructor = this;
                    this.prototype.parent = parentClassOrObject.prototype;
                }
                else
                {
                    // Pure Virtual Inheritance
                    this.prototype = parentClassOrObject;
                    this.prototype.constructor = this;
                    this.prototype.parent = parentClassOrObject;
                }
                return this;
            };

            // Flyweight object
            CoffeeOrder = {
                // Interfaces
                serveCoffee:function(context){},
                getFlavor:function(){}

            };
            // ConcreteFlyweight object that creates ConcreteFlyweight
            // Implements CoffeeOrder
            //rk comment: this is the product you're selling
            CoffeeFlavor = function CoffeeFlavor( newFlavor ){
                var flavor = newFlavor;
                // If an interface has been defined for a feature, implement the feature
                if( typeof this.getFlavor === "function" ){
                    this.getFlavor = function() {
                        return flavor;
                    };
                }
                if( typeof this.serveCoffee === "function" ){
                    this.serveCoffee = function( context ) {
                        return "Serving Coffee flavor " + flavor + " to table number " + context.getTable();
                    };
                }
            }

            // Implement interface for CoffeeOrder
            CoffeeFlavor.implementsFor( CoffeeOrder );

            // Handle table numbers for a coffee order
            CoffeeOrderContext = function CoffeeOrderContext( tableNumber ) {
                return{
                    getTable: function() {
                        return tableNumber;
                    }
                };
            }

            CoffeeFlavorFactory = function CoffeeFlavorFactory() {
                var flavors = {},
                    length = 0;
                return {
                    getCoffeeFlavor: function (flavorName) {
                        var flavor = flavors[flavorName];

                        if (typeof flavor === "undefined") {
                            flavor = new CoffeeFlavor(flavorName);
                            flavors[flavorName] = flavor;
                            length++;
                        }
                        return flavor;
                    },
                    getTotalCoffeeFlavorsMade: function () {
                        return length;
                    }
                };
            }


        });
        //now setup the test for the flyweight defined above
        var flavors, tables, ordersMade, takeOrders;
        var flavorFactory; // The CoffeeFlavorFactory instance
        beforeEach(function () {
                //the sample class used in all tests in this describe().
                //for these tests, we assign the class to the variable above

                flavors = new CoffeeFlavor(); // The flavors ordered.
                tables = new CoffeeOrderContext(); // The tables for the orders.
                ordersMade = 0; // Number of orders made

                takeOrders = function takeOrders( flavorIn, table) {
                    flavors[ordersMade] = flavorFactory.getCoffeeFlavor( flavorIn );
                    tables[ordersMade++] = new CoffeeOrderContext( table );
                }

                flavorFactory = new CoffeeFlavorFactory();
        });
        it('should make several coffee orders', function () {
            takeOrders("Cappuccino", 2);
            takeOrders("Cappuccino", 2);
            takeOrders("Frappe", 1);
            takeOrders("Frappe", 1);
            takeOrders("Xpresso", 1);
            takeOrders("Frappe", 897);
            takeOrders("Cappuccino", 97);
            takeOrders("Cappuccino", 97);
            takeOrders("Frappe", 3);
            takeOrders("Xpresso", 3);
            takeOrders("Cappuccino", 3);
            takeOrders("Xpresso", 96);
            takeOrders("Frappe", 552);
            takeOrders("Cappuccino", 121);
            takeOrders("Xpresso", 121);

            for (var i = 0; i < ordersMade; ++i) {
                var result = flavors[i].serveCoffee(tables[i]);
                expect(result).to.equals("Serving Coffee flavor " + flavors[i].getFlavor() + " to table number " + tables[i].getTable());
            }
            expect(flavorFactory.getTotalCoffeeFlavorsMade()).to.equals(3); //it stored 3 orders instead of 15

        });
    });
});