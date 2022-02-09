<div align="center">
  <h1>GeoFaker</h1>
  <p>Some primitives to easily generate fake but deterministic geographic data.</p>
  
  [![npm version](https://badgen.net/npm/v/geo-faker)](https://www.npmjs.com/package/geo-faker)
  [![npm downloads](https://badgen.net/npm/dm/geo-faker)](https://www.npmjs.com/geo-faker)
</div>


## Installation
 ### npm
    npm install geo-faker 
 ### yarn
    yarn add geo-faker

## Why?
    - for testing
    - for data generation
    - for data validation
    - for data analysis

## How?

```js
import pointGrid from '@turf/point-grid';
import circle from '@turf/circle';
import geoFaker from 'geo-faker';
const { layer, sqrBBox } = geoFaker;

const cellSide = 10;

// creates a grid of random sized circles
const featureCollection = layer()
    .add([...pointGrid(sqrBBox([0, 0], 10), cellSide).features]) // add array of points
    .seed(42) // seed the random generator
    .addProperty('radius') // add a property "radius" to each feature with a random value between 0 and 1
    .map((i: any) => circle(i, i.properties.radius)) // create a circle from each point
    .unwarp() // unwarp the feature collection

 ```
### Adding multiple fake properties 
You can add multiple fake properties to each feature, by seeding the random generator with a different seed. 
```js

const featureArr = ...

const featureCollection = layer()
    .add(featuresArr) // add array of points
    .seed(42) // seed the random generator
    .addProperty('foo') // add a property to each feature with seed 42
    .seed(20) // seed the random generator again 
    .addProperty('bar') // add a property to each feature with seed 20
    .unwarp() // unwarp the feature collection

 ```