import { createContext, useContext, useReducer, useCallback } from "react";

const ServiceViewerContext = createContext(null);

const initialState = {
  services: [],
  activeIndex: -1,
  doorOpen: false,
  isAnimating: false,
  hoveredFace: -1,
};

function reducer(state, action) {
  switch (action.type) {
    case "SET_SERVICES":
      return { ...state, services: action.services };
    case "OPEN_DOOR":
      return { ...state, activeIndex: action.index, doorOpen: true, isAnimating: true };
    case "CLOSE_DOOR":
      return { ...state, doorOpen: false, isAnimating: true };
    case "ANIMATION_DONE":
      return { ...state, isAnimating: false };
    case "SET_HOVERED":
      return { ...state, hoveredFace: action.index };
    case "RESET":
      return { ...initialState, services: state.services };
    default:
      return state;
  }
}

export function ServiceViewerProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const setServices = useCallback((services) => dispatch({ type: "SET_SERVICES", services }), []);
  const openDoor = useCallback((index) => dispatch({ type: "OPEN_DOOR", index }), []);
  const closeDoor = useCallback(() => dispatch({ type: "CLOSE_DOOR" }), []);
  const animationDone = useCallback(() => dispatch({ type: "ANIMATION_DONE" }), []);
  const setHovered = useCallback((index) => dispatch({ type: "SET_HOVERED", index }), []);
  const reset = useCallback(() => dispatch({ type: "RESET" }), []);

  return (
    <ServiceViewerContext.Provider
      value={{
        ...state,
        setServices,
        openDoor,
        closeDoor,
        animationDone,
        setHovered,
        reset,
      }}
    >
      {children}
    </ServiceViewerContext.Provider>
  );
}

export function useServiceViewer() {
  const ctx = useContext(ServiceViewerContext);
  if (!ctx) throw new Error("useServiceViewer must be inside ServiceViewerProvider");
  return ctx;
}
