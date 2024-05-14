import { Mock, mock } from '../../../checkeroni/src/index.ts';
import { check } from '../../../checkeroni/src/Checks.ts';
import { test } from '../../../checkeroni/src/Test.ts';
import { TestSuite } from '../../../checkeroni/src/TestSuite.ts';
import { beforeEach } from '../../../checkeroni/src/TestSuiteOperators.ts';

class Motor {
    engineSize = 5;

    generatePower() {
        return 20;
    }
}

class Car {
    constructor(private motor: Motor) {}

    drive() {
        console.log(`driving ${this.motor.generatePower()} kilometers`);
    }

    makeWroom() {
        console.log(`wr${"o".repeat(this.motor.engineSize)}m`);
    }
}


let testSubject: Car;
let motorMock: Motor;

new TestSuite(
    "Testing a Car",
    beforeEach(() => {
        (console.log as Mock) = mock.spyOnly(console.log);

        (motorMock as Mock) = mock.object({
            engineSize: mock.value(10),
            generatePower: mock.returnValue(20),
        });

        testSubject = new Car(motorMock);
    }),

    test.that("car drives", () => {
        testSubject.drive();
        check(console.log).calledWith(["driving 20 kilometers"]);
    }),
    
    test.that("Car makes wrooooom", () => {
        testSubject.makeWroom();
        check(console.log).calledWith(["wroooooooooom"]);
    }),

    test.that("Mocking constant objects", () => {
        const constantMotor = new Motor();
        const car = new Car(constantMotor);

        /* since we can't reassign constants, use 
        mock.constantObject which works by replacing its individual fields */
        mock.constantObject(constantMotor, 
            mock.object({
                engineSize: mock.value(3),
            })
        );

        car.makeWroom();
        check(console.log).calledWith(["wrooom"]);
    })
)

