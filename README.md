# kaplan-meier-estimator

A JavaScript implementation of the [Kaplan-Meier-Estimator](https://en.wikipedia.org/wiki/Kaplan%E2%80%93Meier_estimator) also known as the product limit estimator.

|  # | Time to Event | censored | S(t) |
|---:|--------------:|:--------:|-----:|
|  1 |             1 |    false | 1    |
|  2 |            12 |     true | 0.93 |
|  3 |            22 |    false | 0.93 |
|  4 |            29 |     true | 0.85 |
|  5 |            31 |     true | 0.77 |
|  6 |            36 |    false | 0.77 |
|  7 |            38 |    false | 0.77 |
|  8 |            50 |    false | 0.77 |
|  9 |            60 |    false | 0.77 |
| 10 |            61 |     true | 0.64 |
| 11 |            70 |     true | 0.52 |
| 12 |            88 |    false | 0.52 |
| 13 |            99 |    false | 0.52 |
| 14 |           110 |    false | 0.52 |
| 15 |           140 |    false | 0.52 |

![Kaplan-Meier example plot, CC-0](https://upload.wikimedia.org/wikipedia/commons/f/f9/Kaplan-Meier-sample-plot.svg)
