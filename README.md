# kaplan-meier-estimator

A JavaScript implementation of the [Kaplan-Meier-Estimator](https://en.wikipedia.org/wiki/Kaplan%E2%80%93Meier_estimator) also known as the product limit estimator.

This library implements the `init` and `compute` functions from the [kaplan-meier](https://www.npmjs.com/package/kaplan-meier) library and is therefore a modern "plug-in" replacement.

## Installation

### node

```sh
npm install --save kaplan-meier-estimator
```

### Browser

```html
<script src="https://unpkg.com/kaplan-meier-estimator@latest/lib/kaplan-meier-estimator.umd.js">
```

## Usage

To be compatible with the [kaplan-meier](https://www.npmjs.com/package/kaplan-meier) package we also provide an `init()` function, that does nothing. No external lodash/underscore functions are needed! This `init` function is deprecated and will be removed in the future (better not use it anymore!).

### esm/typescript usage

See [examples/node](./examples/node/) for an example implementation.

```ts
import { compute } from 'kaplan-meier-estimator';

const timeToEvents = [1, 12, 22, 29, 31, …];
const events = [false, true, false, true, true, …];

const kmData = compute(timeToEvents, events);
console.table(kmData);
```

CommonJs is also supported:

```js
const { compute } = require('kaplan-meier-estimator/lib/kaplan-meier-estimator.cjs';
```

### browser usage

See [examples/browser](./examples/browser/) for an example implementation. To server this example jsu start d webserver in the root of this repository.

```javascript
const timeToEvents = [1, 12, 22, 29, 31, …];
const events = [false, true, false, true, true, …];

const kmData = KME.compute((timeToEvents, events);

console.table(kmData);
```

### example output

```sh
┌─────────┬───────┬──────┬───────┐
│ (index) │  rate │ time │ event │
├─────────┼───────┼──────┼───────┤
│    0    │   1   │  1   │ false │
│    1    │ 0.929 │  12  │ true  │
│    2    │ 0.929 │  22  │ false │
│    3    │ 0.851 │  29  │ true  │
│    4    │ 0.774 │  31  │ true  │
│    …    │   …   │   …  │   …   │
└─────────┴───────┴──────┴───────┘
```

## Example

### Data

|   # | Time to Event |   event   | >   | S(t) |
| --: | ------------: | :-------: | --- | ---: |
|   1 |             1 | **false** |     |    1 |
|   2 |            12 |   true    |     | 0.93 |
|   3 |            22 | **false** |     | 0.93 |
|   4 |            29 |   true    |     | 0.85 |
|   5 |            31 |   true    |     | 0.77 |
|   6 |            36 | **false** |     | 0.77 |
|   7 |            38 | **false** |     | 0.77 |
|   8 |            50 | **false** |     | 0.77 |
|   9 |            60 | **false** |     | 0.77 |
|  10 |            61 |   true    |     | 0.64 |
|  11 |            70 |   true    |     | 0.52 |
|  12 |            88 | **false** |     | 0.52 |
|  13 |            99 | **false** |     | 0.52 |
|  14 |           110 | **false** |     | 0.52 |
|  15 |           140 | **false** |     | 0.52 |

### Plot

![Kaplan-Meier example plot, CC-0](https://upload.wikimedia.org/wikipedia/commons/f/f9/Kaplan-Meier-sample-plot.svg)

## License

Licensed 2022 by [fullstax GmbH & Co. KG](https://www.fullstax.de) under a [Apache 2.0 license](./LICENSE).
