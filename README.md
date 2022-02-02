# geo-faker

Some primitives to easily generate fake but deterministic geographic data.

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