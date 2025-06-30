import Echo from "laravel-echo";
import Pusher from "pusher-js";
import Cookies from "js-cookie";
window.Pusher = Pusher;

window.Echo = new Echo({
  broadcaster: "reverb",
  key: import.meta.env.VITE_REVERB_APP_KEY,
  wsHost: import.meta.env.VITE_REVERB_HOST,
  wsPort: import.meta.env.VITE_REVERB_PORT ?? 80,
  wssPort: import.meta.env.VITE_REVERB_PORT ?? 443,
  forceTLS: (import.meta.env.VITE_REVERB_SCHEME ?? "https") === "https",
  enabledTransports: ["ws", "wss"],
  authEndpoint:
    (import.meta.env.VITE_DOMAIN ?? "http://localhost:8000") +
    "/broadcasting/auth",
  auth: {
    headers: {
      Authorization: `Bearer ${Cookies.get("token")}`,
    },
  },
});

export default window.Echo;
