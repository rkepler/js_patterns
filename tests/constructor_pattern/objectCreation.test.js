'use strict';

//var objectCreation = require('../../js/constructor/objectCreation');

describe('Object Creation Pattern', function() {

    it('should set property with dot syntax', function(){
        var newObject = {};
        newObject.someKey = "Hello World";
        expect(newObject.someKey).to.equals("Hello World");
    });

    it('should set property with bracket syntax', function(){
        var newObject = {};
        newObject["someOtherKey"] = "Hello World";
        expect(newObject.someOtherKey).to.equals("Hello World");
    });

    describe('Additional property assignments', function () {
        var newObj = {};
        beforeEach(function () {

            Object.defineProperties( newObj, {
                "someKey": {
                    value: "Hello World",
                    writable: true
                },
                "anotherKey": {
                    value: "Foo bar",
                    writable: false
                }
            });

        });
        it('should set property via defineProperties', function(){
            //notice "value" isn't use to access the property
            expect(newObj.someKey).to.equals("Hello World");
            expect(newObj.anotherKey).to.equals("Foo bar");
        });

        it('should should throw an error when assigning new value to anotherKey', function(){
            var testAssign = function testAssign() {
                newObj.anotherKey = "newVal";
            }
            expect(testAssign).to.throw(TypeError);
        });

    });
    it('', function(){

    });
});