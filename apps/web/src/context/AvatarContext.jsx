import { createContext, useContext, useReducer, useCallback } from "react";

const AvatarContext = createContext(null);

const initialState = {
  textureUrl: null,
  textureBlob: null,
  position: [1.15, 0.7, 0.2],
  rotation: [0, 0, 0],
  scale: [1, 1, 1],
  visible: true,
  locked: false,
  mirrored: false,
  processing: false,
  progress: "",
  progressPercent: 0,
  error: null,
};

function avatarReducer(state, action) {
  switch (action.type) {
    case "SET_PROCESSING":
      return { ...state, processing: true, progress: action.progress, progressPercent: action.percent, error: null };
    case "SET_TEXTURE":
      return {
        ...state,
        processing: false,
        textureUrl: action.url,
        textureBlob: action.blob,
        progress: "",
        progressPercent: 0,
        error: null,
      };
    case "SET_ERROR":
      return { ...state, processing: false, error: action.error, progress: "", progressPercent: 0 };
    case "SET_POSITION":
      return { ...state, position: action.position };
    case "SET_ROTATION":
      return { ...state, rotation: action.rotation };
    case "SET_SCALE":
      return { ...state, scale: action.scale };
    case "TOGGLE_VISIBLE":
      return { ...state, visible: !state.visible };
    case "TOGGLE_LOCK":
      return { ...state, locked: !state.locked };
    case "TOGGLE_MIRROR":
      return { ...state, mirrored: !state.mirrored };
    case "SNAP_TO_CHAIR":
      return { ...state, position: [1.15, 0.7, 0.2], rotation: [0, -Math.PI / 2, 0], scale: [1, 1, 1] };
    case "RESET_POSITION":
      return { ...state, position: [1.15, 0.7, 0.2], rotation: [0, 0, 0], scale: [1, 1, 1] };
    case "DELETE":
      if (state.textureUrl) URL.revokeObjectURL(state.textureUrl);
      return { ...initialState };
    default:
      return state;
  }
}

export function AvatarProvider({ children }) {
  const [state, dispatch] = useReducer(avatarReducer, initialState);

  const setProcessing = useCallback((progress, percent) => dispatch({ type: "SET_PROCESSING", progress, percent }), []);
  const setTexture = useCallback((url, blob) => dispatch({ type: "SET_TEXTURE", url, blob }), []);
  const setError = useCallback((error) => dispatch({ type: "SET_ERROR", error }), []);
  const setPosition = useCallback((position) => dispatch({ type: "SET_POSITION", position }), []);
  const setRotation = useCallback((rotation) => dispatch({ type: "SET_ROTATION", rotation }), []);
  const setScale = useCallback((scale) => dispatch({ type: "SET_SCALE", scale }), []);
  const toggleVisible = useCallback(() => dispatch({ type: "TOGGLE_VISIBLE" }), []);
  const toggleLock = useCallback(() => dispatch({ type: "TOGGLE_LOCK" }), []);
  const toggleMirror = useCallback(() => dispatch({ type: "TOGGLE_MIRROR" }), []);
  const snapToChair = useCallback(() => dispatch({ type: "SNAP_TO_CHAIR" }), []);
  const resetPosition = useCallback(() => dispatch({ type: "RESET_POSITION" }), []);
  const deleteAvatar = useCallback(() => dispatch({ type: "DELETE" }), []);

  return (
    <AvatarContext.Provider
      value={{
        ...state,
        setProcessing,
        setTexture,
        setError,
        setPosition,
        setRotation,
        setScale,
        toggleVisible,
        toggleLock,
        toggleMirror,
        snapToChair,
        resetPosition,
        deleteAvatar,
      }}
    >
      {children}
    </AvatarContext.Provider>
  );
}

export function useAvatar() {
  const ctx = useContext(AvatarContext);
  if (!ctx) throw new Error("useAvatar must be used within AvatarProvider");
  return ctx;
}
