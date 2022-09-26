import { ADD_IMAGE, GET_IMAGES } from "../Actions/types";

     const initialState = {
     images: []
      };
     const ImageReducer = function(state = initialState, action) {
       switch (action.type) {
       case ADD_IMAGE:
       return {
        ...state,
        images: [action.payload, ...state.images]
      };
     case GET_IMAGES:
     return { ...state, images: action.payload };
     default:
     return state;
    }
}
export default ImageReducer;