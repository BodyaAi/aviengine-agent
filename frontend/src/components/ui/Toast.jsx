import { Snackbar } from "@vkontakte/vkui";
import { Icon16Cancel } from "@vkontakte/icons";
import { useEffect } from "react";

export default function Toast({ message, onClose, duration = 2500 }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose?.();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  return (
    <Snackbar
      onClose={onClose}
      before={<Icon16Cancel />}
    >
      {message}
    </Snackbar>
  );
}