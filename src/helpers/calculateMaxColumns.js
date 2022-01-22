const rangesDefault = [135, 145, 155];
const calculateMaxColumns = (width, ranges = rangesDefault, gapWidth = 10) => {
  const possibleColumns = [];
  ranges.forEach((range, index) => {
    const columnsNoGap = Math.floor(width / range);
    const columnsWithGap = Math.floor(
      (width - (columnsNoGap - 1) * gapWidth) / range,
    );
    possibleColumns.push(columnsWithGap);
  });
  return Math.max(...possibleColumns);
};

export default calculateMaxColumns;
