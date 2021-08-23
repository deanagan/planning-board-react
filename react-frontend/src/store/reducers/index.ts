import { combineReducers } from "redux";
import taskReducer from "./taskReducer";

const reducers = combineReducers({
    task: taskReducer
});

export default reducers;

export type State = ReturnType<typeof reducers>;