// See "Building Fluent Interfaces in TypeScript"
// https://youtu.be/bH61wRMqp-o?si=WeU5sNxKwkUgvc4i
function pipe<A, B>(fn: (a: A) => B) {
  function run(a:A) {
    return fn(a);
  }

  run.pipe = <C,>(fn2: (b:B) => C) =>
    pipe((a:A) =>
      fn2(fn(a))
    );
  return run;
}
export { pipe }

// Sample usage
const stringToDateAndTime = pipe(Date.parse)
  .pipe((n) => new Date(n))
  .pipe((d) => d.toISOString())
  .pipe((s) => s.split('T'))
  .pipe((a) => ({ date: a[0], time: a[1]});

const result = stringToDateAndTime('Jan 1, 2024');

console.log(result);
