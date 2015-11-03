/**
 * Created by rkepler on 1/15/2015.
 */
'use strict';

var _ = require("lodash");
/*
 Command Pattern

 The general idea behind the Command pattern is that it provides us a means to separate the responsibilities
 of issuing commands from anything executing commands, delegating this responsibility to different objects instead.

 Implementation wise, simple command objects bind together both an action and the object wishing to invoke the
 action. They consistently include an execution operation (such as run() or execute()). All Command objects
 with the same interface can easily be swapped as needed and this is considered one of the larger
 benefits of the pattern.

 */

describe('Command Pattern', function () {

    describe('Very simple command pattern', function () {
        var carManager;
        beforeEach(function () {
                //the sample class used in all tests in this describe().
                //for these tests, we assign the class to the variable above

                carManager = {
                    // request information
                    requestInfo: function (model, id) {
                        return "The information for " + model + " with ID " + id + " is foobar";
                    },
                    // purchase the car
                    buyVehicle: function (model, id) {
                        return "You have successfully purchased Item " + id + ", a " + model;
                    },
                    // arrange a viewing
                    arrangeViewing: function (model, id) {
                        return "You have successfully booked a viewing of " + model + " ( " + id + " )";
                    }
                };

                carManager.execute = function (name) {
                    return carManager[name] && carManager[name].apply(carManager, [].slice.call(arguments, 1));
                };

            }
        );
        it('should call arrangeViewing for a Ferrari', function () {

            expect(carManager.execute("arrangeViewing", "Ferrari", "14523"))
                .to.equals("You have successfully booked a viewing of Ferrari ( 14523 )");
        });
        it('should call requestInfo for a Ford Mondeo', function () {

            expect(carManager.execute( "requestInfo", "Ford Mondeo", "54323" ))
                .to.equals("The information for Ford Mondeo with ID 54323 is foobar" );
        });
        it('should call buyVehicle for a Ford Mondeo', function () {

            expect(carManager.execute( "buyVehicle", "Ford Escort", "34232" ))
                .to.equals("You have successfully purchased Item 34232, a Ford Escort" );
        });

    });
    describe('More beefed up command pattern', function () {
        var CommandHandler;
        var Command;
        var addMilkCmd, addCoffeeCmd, addSugarCmd, addShotsCmd;
        var cmdContext = {
            milk : "",
            coffee: "",
            sugar: "",
            numberShots: 0
        };
        beforeEach(function () {
                //the sample class used in all tests in this describe().
                //for these tests, we assign the class to the variable above

                Command = function Command(execute, context) {
                    var _execute = execute;
                    var _context = context;
                    return {
                        execute : _execute,
                        context : _context
                    }
                }


                addMilkCmd = function addMilkCmd(cmdContext) {
                    var _addMilk = function _addMilk(context) {
                        context.milk = "milk added";
                        //console.log("command called:" + context.milk);
                    }
                    return new Command(_addMilk, context);
                }

                addCoffeeCmd = function addCoffeeCmd(cmdContext) {
                    var _addCoffee = function _addCoffee(context) {
                        context.coffee = "roasted";
                        //console.log("command called:" + context.coffee);
                    }
                    return new Command(_addCoffee, context);
                }

                CommandHandler = function commandHandler(context, commands) {
                    var _context = context;
                    var _commands = commands || [];

                    return {
                        executeCommands : function executeCommands() {
                            for (var i = 0; i < _commands.length; i++) {
                                _commands[i].execute(_context);
                            }
                        },
                        getContext      : _context,
                        setContext      : function setContext(context) { _context = context},
                        addCommand      : function addCommand(command) { _command.push(command)}
                    }
                }

            }
        );
        it('should have context show milk and roasted', function () {
            var commandHandler = new CommandHandler(cmdContext, [new addMilkCmd(cmdContext), new addCoffeeCmd(cmdContext)]);
            commandHandler.executeCommands();
            expect(commandHandler.getContext.milk).to.equals("milk added");
            expect(commandHandler.getContext.coffee).to.equals("roasted");
        });


    });
    describe('Non-optimized calculator example using command pattern', function () {
        var AddCommand, SubCommand, MulCommand, DivCommand, Calculator, log, Command;
        beforeEach(function () {
                //the sample class used in all tests in this describe().
                //for these tests, we assign the class to the variable above

                function add(x, y) { return x + y; }
                function sub(x, y) { return x - y; }
                function mul(x, y) { return x * y; }
                function div(x, y) { return x / y; }

                Command = function (execute, undo, value) {
                    this.execute = execute;
                    this.undo = undo;
                    this.value = value;
                }

                AddCommand = function (value) {
                    return new Command(add, sub, value);
                };

                SubCommand = function (value) {
                    return new Command(sub, add, value);
                };

                MulCommand = function (value) {
                    return new Command(mul, div, value);
                };

                DivCommand = function (value) {
                    return new Command(div, mul, value);
                };

                Calculator = function () {
                    var current = 0;
                    var commands = [];

                    //function action(command) {
                    //    var name = command.execute.toString().substr(9, 3);
                    //    return name.charAt(0).toUpperCase() + name.slice(1);
                    //}

                    return {
                        execute: function (command) {
                            current = command.execute(current, command.value);
                            commands.push(command);
//                            log.add(action(command) + ": " + command.value);
                        },

                        undo: function () {
                            var command = commands.pop();
                            current = command.undo(current, command.value);
                            //log.add("Undo " + action(command) + ": " + command.value);
                        },

                        getCurrentValue: function () {
                            return current;
                        }
                    }
                }

            }
        );
        it('calculation should equal to 76', function () {

            var calculator = new Calculator();

            // issue commands

            calculator.execute(new AddCommand(100));
            calculator.execute(new SubCommand(24));
            calculator.execute(new MulCommand(6));
            calculator.execute(new DivCommand(2));

            // reverse last two commands

            calculator.undo();
            calculator.undo();

            expect(calculator.getCurrentValue()).to.equal(76);
            //console.log("\nValue: " + calculator.getCurrentValue());

        });


    });
});