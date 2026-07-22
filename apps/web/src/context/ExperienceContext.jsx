import { createContext, useContext, useReducer, useCallback } from "react";

const ExperienceContext = createContext(null);

const initialState = {
  experiences: [],
  activeIndex: -1,
  doorOpen: false,
  isAnimating: false,
  hoveredFace: -1,
};

function reducer(state, action) {
  switch (action.type) {
    case "SET_EXPERIENCES":
      return { ...state, experiences: action.experiences };
    case "OPEN_DOOR":
      return { ...state, activeIndex: action.index, doorOpen: true, isAnimating: true };
    case "CLOSE_DOOR":
      return { ...state, doorOpen: false, isAnimating: true };
    case "ANIMATION_DONE":
      return { ...state, isAnimating: false };
    case "SET_HOVERED":
      return { ...state, hoveredFace: action.index };
    default:
      return state;
  }
}

export function ExperienceProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const setExperiences = useCallback((experiences) => dispatch({ type: "SET_EXPERIENCES", experiences }), []);
  const openDoor = useCallback((index) => dispatch({ type: "OPEN_DOOR", index }), []);
  const closeDoor = useCallback(() => dispatch({ type: "CLOSE_DOOR" }), []);
  const animationDone = useCallback(() => dispatch({ type: "ANIMATION_DONE" }), []);
  const setHovered = useCallback((index) => dispatch({ type: "SET_HOVERED", index }), []);

  return (
    <ExperienceContext.Provider value={{ ...state, setExperiences, openDoor, closeDoor, animationDone, setHovered }}>
      {children}
    </ExperienceContext.Provider>
  );
}

export function useExperience() {
  const ctx = useContext(ExperienceContext);
  if (!ctx) throw new Error("useExperience must be inside ExperienceProvider");
  return ctx;
}
