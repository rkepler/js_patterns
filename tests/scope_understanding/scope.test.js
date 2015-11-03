/**
 * Created by rkepler on 1/19/2015.
 */
'use strict';

/*
 Understanding how scoping works and 'this'

 */

describe('Scope Understanding', function () {

    describe('Basic Scope', function () {

        it('should have variable defined in the "global" scope', function () {
            var x = 10; //lame, but to show that vars declared this way are in the global scope (not really in a unit test)
            expect(x).to.equal(10);
        });

        it('should have variable in global accessed inside function', function () {
            var x = 5;
            var myFunction = function myFunction() {
                x = 10; //this is really bad!, but it's accessing the x from the global scope. Don't forget to use var x ...
            };
            myFunction();
            expect(x).to.equal(10);
        });

        it('should have variable declared inside functions to not be accessible outside them', function () {
            var myFunction = function myFunction() {
                var x = 10;
            };
            myFunction();
            expect(typeof x).to.equal('undefined');
        });

        it('should have declarations wrapped inside anonymous functions be private', function () {
            (function () {
                var x = 10;                //by wrapping declarations in a function which is then immediately invoked
            })();                          //means all the variables within that function are bound to the local scope.

            expect(typeof x).to.equal('undefined');
        });

        it('should have inner function access the outer scope', function () {
            //Whenever you see a function within another function, the inner function has access to the scope in the outer
            //function, this is called Lexical Scope or Closure - also referred to as Static Scope.
            var result = function myOuterFunction() {
                var x = 10;
                var myInnerFunction1 = function () {
                    var y = 'y';
                    x = 11;
                };
                myInnerFunction1();         //or we could add "()" at the end of the above statement to have the
                                            // function self-invoke (IIFE)
                return {
                    x: x,                   //we're returning an object to capture multiple results
                    y: typeof y             //variable 'y' isn't accessible from here, only from myInnerFunction1()
                };
            }();                            //IIFE - immediately invoked function expression ("iify")
            expect(result.x).to.equals(11);
            expect(result.y).to.equals("undefined");
        });

        it('should show scope is created only with functions, nothing else', function () {
            //All scopes in JavaScript are created with Function Scope only, they aren't created by
            //for or while loops or expression statements like if or switch. New
            //functions = new scope - that's the rule. A simple example to demonstrate this scope creation:
            var x = 10;
            for (var i = 0; i < 2; i++) {
                var y = 'a';                 //notice a new scope is NOT created inside a for loop!
            }
            expect(y).to.equals('a');        //ok to access from outside for loop
        });
        it('should return a function and do nothing', function () {
            function saySomething(sayIt) {
                return function() {
                        return "You asked me to say " + sayIt;
                }
            }
            expect(saySomething("hello")).to.be.a.function; //meaning, returns nothing, just a function
        });
        it('should return a function and call it', function () {
            var sayHi = function saySomething(sayIt) {

                return function(dontSayIt) {
                    return dontSayIt ? "You asked me NOT to say " + dontSayIt : "You asked me to say " + sayIt;
                }

            }("hi")("oops"); //we initialize the outer function saySomething with 'hi' and then
                             //the result function(dontSayIt) with 'oops'

            expect(sayHi).to.equals("You asked me NOT to say oops");

        });
        //mnemonic help:
        //call : comma separated arguments
        //apply : array as arguments
        it('should call function with call() and apply()', function () {
            var myFunction = function myFunction(name, profession) {
                return "My name is " + name + " and I am a " + profession;
            }
            var newThis = undefined; //the scope of 'this' inside myFunction is unchanged
            expect(myFunction.call(newThis, "Manfred", "mechanic")).to.eql("My name is Manfred and I am a mechanic")
            expect(myFunction.apply(newThis, ["Mary", "teacher"])).to.eql("My name is Mary and I am a teacher")
        });

        it('should call function with call() and apply() and modify scope', function () {
            var myThis = {hello : "world"};
            var myFunction = function myFunction(name, profession) {
                return this.hello;
            }
            //notice how the scope of "this" inside "myFunction" is changed.
            expect(myFunction.call(myThis, "Manfred", "mechanic")).to.eql("world")
            expect(myFunction.apply(myThis, ["Mary", "teacher"])).to.eql("world")
        });
        it('should show the this scope inside a function', function () {
            this.x = 9;
            var module = {
                x : 81,
                getX : function() {return this.x;}
            }
            expect(module.getX()).to.equals(81);
        });
        //The simplest use of bind() is to make a function that, no matter how it is called, is called with a
        //particular 'this' value.
        it('should use bind() to modify the this scope', function () {
            var module = {
                x : 81,
                getX : function() {return this.x;} //without changing the scope, this.x == 81
            }
            var module2 = {
                x : 10
            }
            var getX = module.getX;             //optional: stores the reference to a function
            var boundGetX = getX.bind(module2); //changing the scope for module.getX to be module2
            expect(module.getX()).to.equal(81); //not bound, so use original module where x = 81
            expect(boundGetX()).to.equals(10); //10, because in this case we changed the scope to module2
        });
        it('should use bind() to make a function with pre-specified initial arguments', function () {
            function list() {
                return Array.prototype.slice.call(arguments); //a trick to capture all passed-in arguments in an array
            }
            var list1 = list(1, 2, 3); // [1, 2, 3]
            expect(list1).to.have.members([1, 2, 3]);

            // Create a function with a preset leading argument
            //rk comment: this can be a debugging nightmare. Use with caution...
            var leadingThirtysevenList = list.bind(undefined, 37); //first argument 'undefined is 'this',
                                                                   // but we won't change it.
            var list2 = leadingThirtysevenList(); // [37]
            expect(list2).to.have.members([37]);

            var list3 = leadingThirtysevenList(1, 2, 3); // [37, 1, 2, 3]. Imagine you coding (1, 2, 3) and
            expect(list3).to.have.members([37, 1, 2, 3]); //then seeing (37, 1, 2, 3). Good grief, but maybe needed in some cases
            //for more binding horror, check here:
            // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/bind

        });
        it('should show a textual example on "this" (no test)', function () {
            /*
            // just another example on the scope of 'this':
             function foo() {
             console.log(this); //global object
             };

             var myapp = {};
             myapp.foo = function() {
             console.log(this); //points to myapp object
             }

             var link = document.getElementById("myId");
             link.addEventListener("click", function() {
                    console.log(this); //points to link
             }, false);

             Those are all fairly obvious. The MDN has a nice explanation for the third & why this happens:

             It is often desirable to reference the element from which the event handler was fired, such as when
             using a generic handler for a series of similar elements. When attaching a function using addEventListener()
             the value of this is changed—note that the value of this is passed to a function from the caller.

             So, now we know that, we are in a position to figure out why var _this = this; is required in the above code.

             Doing $("myLink").on("click", function() {}) means that when the element is clicked, the function is
             fired. But this function is bound as an event handler, so this is set to the reference to the DOM
             element myLink. The success method you define within the Ajax request is just a regular function,
             and as such when it's invoked, this is set to the global object, as it is when any function that's
             not an event handler or an object method is.

             The above is precisely why you'll see a lot of people doing var _this = this or var that = this or
             similar, to store the current value. It's also seen by many as what the correct value should be, but
             that debate is for another day.

             $("myLink").on("click", function() {
                    console.log(this); //points to myLink (as expected)
                    var _this = this;  //store reference
                    $.ajax({
                        //ajax set up
                        success: function() {
                                console.log(this); //points to the global object. Huh?
                                console.log(_this); //better!
                            }
                         });
                });
             */
        });
    });
});