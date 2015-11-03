/**
 * Created by rkepler on 1/14/2015.
 */
'use strict';


/*
JavaScript doesn't support the concept of classes but it does support special
 constructor functions that work with objects. By simply prefixing a call to a
 constructor function with the keyword "new", we can tell JavaScript we would like
 the function to behave like a constructor and instantiate a new object with the
 members defined by that function.
*/

describe('Constructor Pattern', function() {

    describe('Basic Constructor', function () {
        var Car;
        beforeEach(function () {
                //the sample class used in all tests in this describe().
                //for these tests, we assign the class to the variable Car
                Car = function Car(model, year, miles) {

                    this.model = model;
                    this.year = year;
                    this.miles = miles;

                    this.toString = function () {  //this is actually bad, as it gets copied to each instance. See next test.
                        //Inside a constructor, the keyword this references the new object that's being created.
                        return this.model + " has done " + this.miles + " miles";
                    };
                };

            }
        );
        it('should create new Honda Civic', function () {
            var civic = new Car("Honda Civic", 2009, 20000);
            var focus = new Car("Ford Focus", 2005, 100000); //if you debug, you'll see toString() repeated in each Car instance
            expect(civic.toString()).to.equals("Honda Civic has done 20000 miles");
        });
        it('should create new Ford Mondeo', function () {
            var civic = new Car("Ford Mondeo", 2010, 5000);
            expect(civic.toString()).to.equals("Ford Mondeo has done 5000 miles");
        });
        /*
         The above is a simple version of the constructor pattern but it does suffer from some problems.
         One is that it makes inheritance difficult and the other is that functions such as toString() are
         redefined for each of the new objects created using the Car constructor. This isn't very optimal as
         the function should ideally be shared between all of the instances of the Car type.

         Thankfully as there are a number of both ES3 and ES5-compatible alternatives to constructing objects,
         it's trivial to work around this limitation.
         */
        //it('', function(){
        //
        //});
    });
    describe('Constructor with Prototypes', function () {
        var Car;
        beforeEach(function () {
                //the sample class used in all tests in this describe().
                //for these tests, we assign the class to the variable Car
                Car = function Car(model, year, miles) {
                    this.model = model;
                    this.year = year;
                    this.miles = miles;
                };
                // Note here that we are using Object.prototype.newMethod (toString) rather than
                // Object.prototype so as to avoid redefining the prototype object
                Car.prototype.toString = function () {
                    return this.model + " has done " + this.miles + " miles";
                };
                //Above, a single instance of toString() will now be shared between all of the Car objects.
            }
        );
        it('should create the 2nd new Honda Civic', function () {
            var civic = new Car("Honda Civic", 2009, 20000);
            var focus = new Car("Ford Focus", 2005, 100000);//if you debug, you'll see toString() only inside __proto__ being shared across all instances
            expect(civic.toString()).to.equals("Honda Civic has done 20000 miles");
        });
        it('should create the 2nd new Ford Mondeo', function () {
            var civic = new Car("Ford Mondeo", 2010, 5000);
            expect(civic.toString()).to.equals("Ford Mondeo has done 5000 miles");
        });

    });
});