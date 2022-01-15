# kaplan-meier-estimator

A JavaScript implementation of the [Kaplan-Meier-Estimator](https://en.wikipedia.org/wiki/Kaplan%E2%80%93Meier_estimator) also known as the product limit estimator.

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

### node/typescript usage

```ts
import { compute } from 'kaplan-meier-estimator';

const events = [1, 12, 22, 29, 31, …];
const censored = [false, true, false, true, true, …];

const kmData = compute(events, censored);
consol.dir(kmData);
```

### browser usage

```javascript
const events = [1, 12, 22, 29, 31, …];
const censored = [false, true, false, true, true, …];

const kmData = KME.compute((events, censored);

consol.dir(kmData);
```

### example output

```sh
0: {rate: 1, time: 1}
1: {rate: 0.9285714285714286, time: 12}
2: {rate: 0.9285714285714286, time: 22}
3: {rate: 0.8511904761904762, time: 29}
4: {rate: 0.7738095238095237, time: 31}
…
```

## Example

### Data

|   # | Time to Event | censored | >   | S(t) |
| --: | ------------: | :------: | --- | ---: |
|   1 |             1 |  false   |     |    1 |
|   2 |            12 |   true   |     | 0.93 |
|   3 |            22 |  false   |     | 0.93 |
|   4 |            29 |   true   |     | 0.85 |
|   5 |            31 |   true   |     | 0.77 |
|   6 |            36 |  false   |     | 0.77 |
|   7 |            38 |  false   |     | 0.77 |
|   8 |            50 |  false   |     | 0.77 |
|   9 |            60 |  false   |     | 0.77 |
|  10 |            61 |   true   |     | 0.64 |
|  11 |            70 |   true   |     | 0.52 |
|  12 |            88 |  false   |     | 0.52 |
|  13 |            99 |  false   |     | 0.52 |
|  14 |           110 |  false   |     | 0.52 |
|  15 |           140 |  false   |     | 0.52 |

### Plot

![Kaplan-Meier example plot, CC-0](https://upload.wikimedia.org/wikipedia/commons/f/f9/Kaplan-Meier-sample-plot.svg)

## License

Licensed 2022 by [fullstax GmbH & Co. KG](https://www.fullstax.de) under a [Apache 2.0 license](./LICENSE).
