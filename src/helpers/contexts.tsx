import { ReactNode, createContext, useReducer } from "react";
import { notificationReducer } from "./services";
import {
  NotificationActionInterface,
  NotificationReducerInterface,
} from "./types";
import { produceDefaultNotificationStatus } from "./utils";

export const LoadingStateResetContext = createContext<null | (() => void)>(
  null
);
export const NotificationsContext =
  createContext<null | NotificationReducerInterface>(null);
export const NotificationsDispatchContext =
  createContext<null | React.Dispatch<NotificationActionInterface>>(null);

const LoadingStateResetContextProvider = function (
  children: ReactNode,
  resetter: () => void
) {
  return (
    <LoadingStateResetContext.Provider value={resetter}>
      {children}
    </LoadingStateResetContext.Provider>
  );
};

const NotificationsContextProvider = function (children: ReactNode) {
  const defaultNotificationStatus = produceDefaultNotificationStatus();
  const [notifications, dispatch] = useReducer(
    notificationReducer,
    defaultNotificationStatus
  );
  return (
    <NotificationsContext.Provider value={notifications}>
      <NotificationsDispatchContext.Provider value={dispatch}>
        {children}
      </NotificationsDispatchContext.Provider>
    </NotificationsContext.Provider>
  );
};

export const PostContextProvider = function (
  children: ReactNode,
  resetter: () => void
) {
  const NotificationContextElement = NotificationsContextProvider(children);
  return LoadingStateResetContextProvider(NotificationContextElement, resetter);
};
