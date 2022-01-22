export default function tileWidthReducer(state, action) {
  switch (action.type) {
    case 'addTileWidth':
      if (state[action.width] === action.tileWidth) {
        return state;
      }
      return {
        ...state,
        [action.width]: action.tileWidth,
      };
    default:
      return state;
  }
}
