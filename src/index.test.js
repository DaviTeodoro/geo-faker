const pointGrid = require('@turf/point-grid').default;
const circle = require('@turf/circle').default;

const { layer, sqrBBox } = require('./index.ts').default;

const cellSide = 10;
const pointsArr = pointGrid(sqrBBox([0, 0], 10), cellSide).features;

const featuresLayer = layer().add(pointsArr).seed(13);

test('it should update seed', () => {
  expect(featuresLayer._seed).toBe(13);
});

test('it should add features', () => {
  expect(featuresLayer.features).toHaveLength(pointsArr.length);
});

test('it should add property', () => {
  expect(
    featuresLayer.addProperty('radius').features[0].properties
  ).toHaveProperty('radius');
});

const circleCollection = featuresLayer
  .addProperty('radius', { type: 'noise' })
  .map((i) => circle(i, i.properties.radius))
  .unwarp();

test('it should map features', () => {
  expect(circleCollection.features.length).toBe(pointsArr.length);
});
