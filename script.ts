let list: number[] = [1, 2, 3];
let x: [string, number] = ["hello", 10];

let notSure: any = 4;
notSure = "maybe a string";

let uncertain: unknown = 4;
if(typeof uncertain === "number") {
    let num: number= uncertain;
}

{
type StringOrNumber = string | number;
let value: StringOrNumber = "hello";

type Loggable = { log(): void };
type Printable = { print(): void };
type LoggableAndPrintable = Loggable & Printable;
}

{
type Easing = "ease-in" | "ease-out" | "ease-in-out";
let animation: Easing = "ease-in";

type Point = { x: number; y: number };
let center: Point = { x: 0, y: 0 };
}

{
enum Color {
    Red,
    Green,
    Blue,
}
let c: Color = Color.Red;
}

{
function add(x: number, y: number): number {
    return x + y;
}
function buildName(firstName: string, lastName: string): string {
    return lastName ? `${firstName} ${lastName}` : firstName;
}
}