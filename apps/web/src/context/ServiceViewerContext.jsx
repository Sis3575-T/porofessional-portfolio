import { createContext, useContext, useReducer, useCallback } from "react";

const ServiceViewerContext = createContext(null);

const initialState = {
  services: [],
  activeIndex: -1,
  isOpen: false,
  isAnimating: false,
  hoveredFace: -1,
};

function reducer(state, action) {
  switch (action.type) {
    case "SET_SERVICES":
      return { ...state, services: action.services };
    case "OPEN_SERVICE":
      return { ...state, activeIndex: action.index, isOpen: true, isAnimating: true };
    case "CLOSE_SERVICE":
      return { ...state, isOpen: false, isAnimating: true };
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
  const openService = useCallback((index) => dispatch({ type: "OPEN_SERVICE", index }), []);
  const closeService = useCallback(() => dispatch({ type: "CLOSE_SERVICE" }), []);
  const animationDone = useCallback(() => dispatch({ type: "ANIMATION_DONE" }), []);
  const setHovered = useCallback((index) => dispatch({ type: "SET_HOVERED", index }), []);
  const reset = useCallback(() => dispatch({ type: "RESET" }), []);

  return (
    <ServiceViewerContext.Provider
      value={{
        ...state,
        setServices,
        openService,
        closeService,
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
