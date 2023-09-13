import React, { useReducer, createContext, useContext } from "react";
interface IState {
  loading: boolean | null;
  account: string;
}

export enum AppActionType {
  SET_LOADING = "SET_LOADING",
  SET_ACCOUNT = "SET_ACCOUNT",
}

interface IAction {
  type: AppActionType;
  payload: any;
}

const INIT_STATE: IState = {
  account: "",
  loading: null,
};

const AppContext = createContext<{
  state: IState;
  dispatch: React.Dispatch<IAction>;
}>({
  state: INIT_STATE,
  dispatch: () => null,
});

const reducer = (state: IState, action: IAction): IState => {
  switch (action.type) {
    case AppActionType.SET_LOADING:
      return { ...state, loading: action.payload };
    case AppActionType.SET_ACCOUNT:
      return { ...state, account: action.payload };

    default:
      throw new Error(`Unknown type: ${action.type}`);
  }
};

const AppProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(reducer, INIT_STATE);
  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => ({ ...useContext(AppContext) });

export default AppProvider;
