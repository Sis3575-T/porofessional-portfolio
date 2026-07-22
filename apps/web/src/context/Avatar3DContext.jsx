import { createContext, useContext, useReducer, useCallback, useEffect } from "react";
import { fetchSavedAvatar } from "../utils/avatarService";

const Avatar3DContext = createContext(null);

const initialState = {
  avatarUrl: null,
  avatarId: null,
  photoUrl: null,
  loading: false,
  visible: true,
  generating: false,
  progress: "",
  progressPercent: 0,
  error: null,
};

function avatar3dReducer(state, action) {
  switch (action.type) {
    case "LOAD_START":
      return { ...state, loading: true };
    case "LOAD_SUCCESS":
      return { ...state, loading: false, avatarUrl: action.url, avatarId: action.id, photoUrl: action.photo };
    case "LOAD_FAIL":
      return { ...state, loading: false, error: action.error };
    case "GENERATE_START":
      return { ...state, generating: true, progress: action.progress || "Starting...", progressPercent: action.percent || 0, error: null };
    case "GENERATE_PROGRESS":
      return { ...state, progress: action.progress, progressPercent: action.percent };
    case "GENERATE_SUCCESS":
      return { ...state, generating: false, avatarUrl: action.url, avatarId: action.id, photoUrl: action.photo, progress: "", progressPercent: 0 };
    case "GENERATE_FAIL":
      return { ...state, generating: false, error: action.error, progress: "", progressPercent: 0 };
    case "TOGGLE_VISIBLE":
      return { ...state, visible: !state.visible };
    case "SET_VISIBLE":
      return { ...state, visible: action.visible };
    case "DELETE":
      return { ...initialState };
    case "CLEAR_ERROR":
      return { ...state, error: null };
    default:
      return state;
  }
}

export function Avatar3DProvider({ children }) {
  const [state, dispatch] = useReducer(avatar3dReducer, initialState);

  useEffect(() => {
    const loadSaved = async () => {
      dispatch({ type: "LOAD_START" });
      try {
        const saved = await fetchSavedAvatar();
        if (saved?.modelUrl) {
          dispatch({ type: "LOAD_SUCCESS", url: saved.modelUrl, id: saved.avatarId, photo: saved.photoUrl });
        } else {
          dispatch({ type: "LOAD_FAIL", error: null });
        }
      } catch {
        dispatch({ type: "LOAD_FAIL", error: null });
      }
    };
    loadSaved();
  }, []);

  const setAvatar = useCallback((url, id, photo) => dispatch({ type: "LOAD_SUCCESS", url, id, photo }), []);
  const setGenerating = useCallback((progress, percent) => dispatch({ type: "GENERATE_START", progress, percent }), []);
  const setGenerateProgress = useCallback((progress, percent) => dispatch({ type: "GENERATE_PROGRESS", progress, percent }), []);
  const generateSuccess = useCallback((url, id, photo) => dispatch({ type: "GENERATE_SUCCESS", url, id, photo }), []);
  const generateFail = useCallback((error) => dispatch({ type: "GENERATE_FAIL", error }), []);
  const toggleVisible = useCallback(() => dispatch({ type: "TOGGLE_VISIBLE" }), []);
  const deleteAvatar = useCallback(() => dispatch({ type: "DELETE" }), []);
  const clearError = useCallback(() => dispatch({ type: "CLEAR_ERROR" }), []);

  return (
    <Avatar3DContext.Provider
      value={{
        ...state,
        setAvatar,
        setGenerating,
        setGenerateProgress,
        generateSuccess,
        generateFail,
        toggleVisible,
        deleteAvatar,
        clearError,
      }}
    >
      {children}
    </Avatar3DContext.Provider>
  );
}

export function useAvatar3D() {
  const ctx = useContext(Avatar3DContext);
  if (!ctx) throw new Error("useAvatar3D must be used within Avatar3DProvider");
  return ctx;
}
