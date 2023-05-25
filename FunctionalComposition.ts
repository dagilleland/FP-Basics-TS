// Welcome to the TypeScript Playground, this is a website
// which gives you a chance to write, share and learn TypeScript.

// You could think of it in three ways:
//
//  - A location to learn TypeScript where nothing can break
//  - A place to experiment with TypeScript syntax, and share the URLs with others
//  - A sandbox to experiment with different compiler features of TypeScript

// const anExampleVariable = "Hello World"
// console.log(anExampleVariable)

// To learn more about the language, click above in "Examples" or "What's New".
// Otherwise, get started by removing these comments and the world is your playground.
/* =========================================================================== */

// # What TypeScript Brings to JavaScript
// (This assumes that you already know about arrow-function syntax in JavaScript.)
// Recall that in TypeScript, our normal understanding of JavaScript functions is augmented
// by explicitly stating the data types of the inputs (parameters) and outputs (return values).
// Also recall that with JavaScript we are used to giving names to our functions and our variables:
const myFunc = (a, b) => a + b
//    \name/    |  |     \___/
//              |  |       |- the implementation or "body" of the function; returning a value
//              |  |- `b` is a variable name
//              |- `a` is a variable name
// With TypeScript, we also give names to the Data Types that are in play.
// That is, every data type is "named" just as our functions and variables have been "named".
// What's important to remember is that since functions are "first-class objects" just like our variables,
// that means every function has a "data type" just like every variable has a "data type".
// In TypeScript, the definition of a data type that describes the function will require us
// to also state the data types for the function's parameters and return type. That is,
// the data type of a function will describe the "signature" of the function.
// What follows is an example of declaring the data type for a function,
// and then applying that data type to the function definition.
// - Declare the `AdderFunc` data type
type AdderFunc = (a: number, b: number) => number
//  \ function/ \\____________________/    \____//
//   \  name /   \ |- Parameters            |- Return Type
//    \_____/     \____________________________/
//     |- data-type     |- function signature

// Define the `myFunc_alt` function (name and implementation)
const myFunc_alt: AdderFunc = (a, b) => a + b
//    \__ name  : datatype /|\\____/   \____//
//     \__________________/ | \\__/      |- Body of the function
//       |- function name   |  \|- params  /
//                          |   \_________/
//                          |     |- function implementation

// # Individual Pure Functions
// In the following, we define and then use two functions:
// - `increment` which will add 1 to some numeric input
// - `tostring` which will wrap quotes around a number and output a string

// Before declaring each function, we will declare the data types used in the function
type Increment = (x: number) => number            // The function's data type (+signature)
const increment: Increment = (x) => x + 1         // The function's declaration
//   |- name     |- type   |- implementation
// - Invoke the function:
console.log('Call `increment(2)`', increment(2))  // produces 3

type Tostring = (x: number) => string             // The function's data type (+signature)
const tostring: Tostring = x => `"${x}"`          // The function's declaration
// - Invoke the function:
console.log('Call `increment(2)`', tostring(2))   // produces "2"

// Next, we will create a function whose implementation will make use of our functions above.
// Note how the function data type declares the signature (input/output data types),
// but that the implementation uses functions whose output data types satisfy our signature.
// Re-read that sentence a few times, then compare it to the code below.
type IncrementThenTostring = (x:number) => string // The function's data type (+signature)
const increment_then_tostring: IncrementThenTostring = x => tostring(increment(x))
//                                                     |    \        \__________//
//                                                     |     \        |- number /
//                                                     |      \________________/
//                                                     |       |- string
//                                                     |- number

// - Invoke the function
console.log('Call a single-purpose function', increment_then_tostring(6)); // produces "7"

// (Note: On a personal note, I find this reminiscent of the old C++ programming days when
//  we had to create header files `.h` and implementation files `.cpp`: One file to
//  describe the signatures and another to describe the implementation.)


// # Evolving Toward Function Composition
console.log('--- Towards Function Composition ---');
// Let's describe a `compose` function that does the equivalent of our `increment_then_tostring`,
// but in a way that is more "general" and that doesn't need to specify our `tostring` or `increment` functions explicitly.
// In JavaScript, such a function could be declared like this:
// `const compose = (f, g) => x => f(g(x))`
// and then it could be invoked (or called) like this:
// `const increment_then_tostring_alt = compose(tostring, increment)`
const compose = (f, g) => x => f(g(x)) // `compose` is like a "meta"-function
const increment_then_tostring_alt = compose(tostring, increment)

// If we wanted to express the type of the `compose` function in TypeScript, we could write the following:
// ```ts
// type Compose = (
//     f: (x: number) => string,
//     g: (x: number) => number
// ) => (x: number) => string
// ```
// In English, we could translate it as follows:
//  `Compose` is a type that receives two functions and returns a function as its result.
// Breaking it down line-by-line, we can understand it as follows:
// Line # | TypeScript                       | English
// :----: | :------------------------------- | :----------------
//   1.   | `type Compose = (             `  | Compose is going to receive two functions as its parameters:
//   2.   | `    f: (x: number) => string,`  | the first function is going to receive a number and then returns a string
//   3.   | `    g: (x: number) => number `  | the second function is going to receive a number and then returns a number
//   4.   | `) => (x: number) => string   `  | and then this compose function produces a function that receives a number and returns a string
// Reflect on this code sample and English translation, and take special note of what the TypeScript grammar is saying
// as we describe the function data type (name and signature).
// - Line 1 is the "data type name"; that is, the name of the function Data Type we are declaring
// - Lines 2 through 4 represent the "signature" of the function
//   - Lines 2 & 3 are the parameters for the function signature
//   - Line 4 is the return type of the function signature

// We can then further generalize our Compose type by replacing the explicit types used with generics, as follows:
type Compose = <A, B, C>(
    f: (x: B) => C,
    g: (x: A) => B
) => (x: A) => C

// With this generic `Compose` type, we can use it to re-write our JavaScript-flavoured `compose` function with a type, like this:
const compose_2: Compose = (f, g) => x => f(g(x))
//  |- funcName: Type    |- implementation
// Now our `compose_2` function is explicit in describing its type

// When it comes to actually calling or invoking our `compose_2` function,
// notice how the `<A, B, C>` types will be inferred in our use of the
// previously defined `tostring` and `increment` functions.
const increment_then_tostring_2: IncrementThenTostring = compose_2(tostring, increment)
//    |- funcName: Type                                  |- implementation

console.log('Compose Pattern: `increment_then_tostring_2(8)`', increment_then_tostring_2(8)) // produces "9"
// That is, as we applied `tostring` and `increment` to our `compose_2` function, the
// types for the implementation are inferred as follows:
// ```ts
// const increment_then_tostring_2: IncrementThenTostring = compose_2(tostring, increment)
// // The types are:                \________ C ________/            \__ B __/  \__ A __/
// ```

// # Summary
//
// In this example, we've explored the notion of **Function Composition**, which is a bedrock pattern in the functional programming paradigm.
// We've defined a generic `Compose` data type and created a concrete implementation to demonstrate these concepts.
// Along the way, we've carefully examined how TypeScript can bring clarity to our code through type definitions for our functions.
// In the process, we've had to clearly distinguish the grammatical concepts of
//
// - **Type Definitions**
// - **Function Signatures** (made up of *parameters* and *return types*)
// - **Function Declarations** and **Function Implementations**
//
// This has been a jam-packed lesson. We've carefully assembled what is really a very terse and dense bit of code. As you use the
// Function Composition pattern more in your day-to-day work, I hope this explanation helps you to visualize and understand all the
// "moving parts" that make up this pattern.
//
// ```ts
// type Compose = <A, B, C>(
//     f: (x: B) => C,
//     g: (x: A) => B
// ) => (x: A) => C
//
// const compose_2: Compose = (f, g) => x => f(g(x))
// ```
//
// Hopefully the descriptions used here will act as a solid reference as you move forward to incorporate these in your
// career as a software developer. If you've enjoyed this lesson, be sure to give both me and the video creator a "like"
// and subscribe for more excellent content.