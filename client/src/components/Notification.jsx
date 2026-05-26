import { useState, useEffect } from "react";
import notifyService from "../services/NotifyService.js";

function Notification() {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const listener = (notification) => {
      setNotifications(prev => [...prev, notification]);
      setTimeout(() => {
        setNotifications(prev => prev.filter(n => n.id !== notification.id));
      }, 3000);
    };
    notifyService.subscribe(listener);
    return () => notifyService.unsubscribe(listener);
  }, []);

  return (
    <div style={{ position: "fixed", top: 20, right: 20, zIndex: 9999 }}>
      {notifications.map(n => (
        <div
          key={n.id}
          className={`alert alert-${
            n.type === "success" ? "success" :
            n.type === "error" ? "danger" :
            n.type === "warning" ? "warning" : "info"
          } shadow`}
          style={{ minWidth: 250 }}
        >
          {n.message}
        </div>
      ))}
    </div>
  );
}

export default Notification;