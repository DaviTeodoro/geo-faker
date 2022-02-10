import bboxPolygon from '@turf/bbox-polygon';
import midpoint from '@turf/midpoint';
import * as helpers from '@turf/helpers';
import circle from '@turf/circle';

import SimplexNoise from 'simplex-noise';

import bbox from '@turf/bbox';

export default {
  layer,
  unwarp,
  rectangle,
  sqrBBox,
};

function sqrBBox(center: [number, number], side: number): helpers.BBox {
  return bbox(circle(helpers.point(center), side * 2));
}

function layer(_layer: any = {}) {
  const random = _layer._seed ? mulberry32(_layer._seed) : mulberry32(42);
  const noise = _layer._seed
    ? new SimplexNoise(_layer._seed)
    : new SimplexNoise();

  function featureCollection() {
    const newLayer = {
      ..._layer,
      _featureCollection: helpers.featureCollection(_layer.features),
    };
    return layer(newLayer);
  }

  function add(featuresArr: any) {
    const { features } = _layer.features ? _layer : { features: [] };

    const newLayer = { ..._layer, features: [...features, ...featuresArr] };
    return layer(newLayer);
  }

  function map(scale: Function) {
    const { features } = _layer.features ? _layer : { features: [] };
    const newLayer = {
      ..._layer,
      features: features.map(scale),
    };
    return layer(newLayer);
  }

  function seed(seed: number) {
    const newLayer = { ..._layer, _seed: seed };
    return layer(newLayer);
  }

  interface AddPropertySettings {
    type: string;
  }

  function addProperty(
    prop: string,
    config: AddPropertySettings = { type: 'random' }
  ) {
    const { features } = _layer.features ? _layer : { features: [] };
    const { type } = config;
    const newLayer = {
      ..._layer,
      features: features.map((feature: any) => {
        if (type === 'random') {
          const newFeature = {
            ...feature,
            properties: { ...feature.properties, [prop]: random() },
          };
          return newFeature;
        } else if (type === 'noise') {
          const featureCenterPointCoords = center(feature).geometry.coordinates; // this may be slow...

          const newFeature = {
            ...feature,
            properties: {
              ...feature.properties,
              [prop]: noise.noise2D(
                featureCenterPointCoords[0],
                featureCenterPointCoords[1]
              ),
            },
          };
          return newFeature;
        }
      }),
    };
    return layer(newLayer);
  }

  function unwarp() {
    return helpers.featureCollection(_layer.features);
  }

  return {
    type: 'FeatureCollection',
    ..._layer,
    add,
    featureCollection,
    map,
    seed,
    random,
    addProperty,
    unwarp,
  };
}

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

function center(feature: any) {
  if (feature.geometry.type === 'Point') return feature;

  const featureBBox = bbox(feature);

  // the segment p1-p2 is the diagonal of the square
  const p1 = [featureBBox[0], featureBBox[1]];
  const p2 = [featureBBox[2], featureBBox[3]];
  return midpoint(helpers.point(p1), helpers.point(p2));
}

function rectangle(square: any = {}) {
  function middle() {
    const { _bbox } = square;
    const p1 = [_bbox[0], _bbox[1]];
    const p2 = [_bbox[2], _bbox[3]];
    const _midpoint = midpoint(helpers.point(p1), helpers.point(p2));
    const newSquare = { ...square, _middle: _midpoint };

    return rectangle(newSquare);
  }

  function bbox(arr: helpers.BBox) {
    const newSquare: typeof rectangle = {
      ...square,
      _bbox: arr,
      ...bboxPolygon(arr),
    };
    return rectangle(newSquare);
  }

  return { ...square, middle, bbox };
}
