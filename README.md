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
    import { layer, sqrBBox } from 'geo-faker';

    const cellSide = 10;

    // creates a grid of random sized circles
    const featureCollection = layer()
        .seed(42)
        .add([...pointGrid(sqrBBox([0, 0], 10), cellSide).features])
        .addProperty('radius')
        .map((i: any) => circle(i, i.properties.radius))
        .unwarp()
    
    console.log(featureCollection);
 ```
