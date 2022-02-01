import bboxPolygon from '@turf/bbox-polygon';
import midpoint from '@turf/midpoint';
import * as helpers from '@turf/helpers';
import circle from '@turf/circle';
import pointGrid from '@turf/point-grid';
import bbox from '@turf/bbox';

const sqr = Rectangle().bbox([1, 2, 3, 4]);

const cellSide = 10;

const sqrBBox = (center: [number, number], side: number): helpers.BBox =>
  bbox(circle(helpers.point(center), side * 2));

const grid = (extent: helpers.BBox, cellSide: number) =>
  Layer().add([...pointGrid(extent, cellSide).features]);

const circleGrid = (extent: helpers.BBox, cellSide: number, radius: number) =>
  grid(extent, cellSide).map((i: any) => circle(i, radius));

console.log(sqrBBox([0, 0], 100));
console.log(circleGrid(sqrBBox([0, 0], 10), cellSide, 1));

function mulberry32(a: any) {
  return function () {
    var t = (a += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function unwarp(struct: any, method: string, ...args: any) {
  return struct[method](...args)[`_${method}`];
}

function Rectangle(square: any = {}) {
  function middle() {
    const { _bbox } = square;
    const p1 = [_bbox[0], _bbox[1]];
    const p2 = [_bbox[2], _bbox[3]];
    const _midpoint = midpoint(helpers.point(p1), helpers.point(p2));
    const newSquare = { ...square, _middle: _midpoint };

    return Rectangle(newSquare);
  }

  function bbox(arr: helpers.BBox) {
    const newSquare: typeof Rectangle = {
      ...square,
      _bbox: arr,
      ...bboxPolygon(arr),
    };
    return Rectangle(newSquare);
  }

  return { ...square, middle, bbox };
}

function Layer(layer: any = {}) {
  function featureCollection() {
    const newLayer = {
      ...layer,
      _featureCollection: helpers.featureCollection(layer.features),
    };
    return Layer(newLayer);
  }

  function add(featuresArr: any) {
    const { features } = layer.features ? layer : { features: [] };

    const newLayer = { ...layer, features: [...features, ...featuresArr] };
    return Layer(newLayer);
  }

  function map(scale: Function) {
    const { features } = layer.features ? layer : { features: [] };
    const newLayer = {
      ...layer,
      features: features.map(scale),
    };
    return Layer(newLayer);
  }

  return { ...layer, add, featureCollection, map };
}
