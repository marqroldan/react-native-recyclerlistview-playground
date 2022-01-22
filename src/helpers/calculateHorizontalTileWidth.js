const tileWidthRange__horizontal = [120, 132.5, 145];
const lastItemPercentRemainderRange = [13.333, 23.53];

const getFinalDimension = (
  prevDimension,
  nextDimension,
  lastItemPercentRange,
) => {
  if (prevDimension) {
    const prevDiff =
      lastItemPercentRange[1] - prevDimension.remainderPercentage;
    const nextDiff =
      lastItemPercentRange[1] - nextDimension.remainderPercentage;
    if (prevDiff > nextDiff) {
      return nextDimension;
    }
  } else {
    return nextDimension;
  }
  return prevDimension;
};

/// `listAreaWidth` should have its left padding deducted already if there's one
export default function calculateHorizontalTileWidth(
  listAreaWidth = 0,
  ranges = tileWidthRange__horizontal,
  gapWidth = 10,
  lastItemPercentRange = lastItemPercentRemainderRange,
) {
  let dimensionWithinRange;
  let dimensionOutsideOfRange;

  ranges.forEach(range => {
    const totalTileDims = range + gapWidth;
    const tileCount = listAreaWidth / totalTileDims;
    const remainder = listAreaWidth % totalTileDims;
    const remainderPercentage = (remainder / listAreaWidth) * 100;

    const tileDimensions = {
      tileWidth: range,
      totalTileDims,
      tileCountRaw: tileCount,
      tileCount: Math.floor(tileCount),
      remainder,
      remainderPercentage,
    };
    if (
      remainderPercentage <= lastItemPercentRange[1] &&
      remainderPercentage >= lastItemPercentRange[0]
    ) {
      dimensionWithinRange = getFinalDimension(
        dimensionWithinRange,
        tileDimensions,
        lastItemPercentRange,
      );
    } else {
      dimensionOutsideOfRange = getFinalDimension(
        dimensionOutsideOfRange,
        tileDimensions,
        lastItemPercentRange,
      );
    }
  });

  return (dimensionWithinRange || dimensionOutsideOfRange).tileWidth;
}
