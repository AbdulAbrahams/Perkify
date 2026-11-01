import { useEffect, useRef } from "react";
import { Platform } from "react-native";
import { router } from "expo-router";
import * as Notifications from "expo-notifications";

export function configureNotificationHandler() {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowBanner: true,
      shouldShowList: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
    }),
  });
}

export async function getNotificationPermissionGranted() {
  if (Platform.OS === "web") return false;
  const permissions = await Notifications.getPermissionsAsync();
  return permissions.granted;
}

export async function requestNotificationPermission() {
  if (Platform.OS === "web") return false;

  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("default", {
      name: "Default",
      importance: Notifications.AndroidImportance.DEFAULT,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#3DDAC0",
    });
  }

  const currentPermissions = await Notifications.getPermissionsAsync();
  if (currentPermissions.granted) return true;

  const requestedPermissions = await Notifications.requestPermissionsAsync();
  return requestedPermissions.granted;
}

export function NotificationResponseHandler() {
  const handledNotificationId = useRef<string | null>(null);

  useEffect(() => {
    if (Platform.OS === "web") return;

    const handleResponse = (response: Notifications.NotificationResponse) => {
      const notificationId = response.notification.request.identifier;
      if (handledNotificationId.current === notificationId) return;
      handledNotificationId.current = notificationId;
      router.push("/history");
    };

    const subscription = Notifications.addNotificationResponseReceivedListener(handleResponse);
    Notifications.getLastNotificationResponseAsync()
      .then((response) => {
        if (response) handleResponse(response);
      })
      .catch((error: unknown) => {
        console.error("Unable to read the last notification response.", error);
      });

    return () => subscription.remove();
  }, []);

  return null;
}
