import React, { useState, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import {
  FaBell,
  FaBullhorn,
  FaComments,
  FaCreditCard,
  FaCheckDouble,
  FaTimes,
} from "react-icons/fa";
import useAuth from "../../hooks/useAuth";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import useUserRole from "../../hooks/useUserRole";

const NavbarNotificationBell = () => {
  const { user } = useAuth();
  const { role } = useUserRole();
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [isOpen, setIsOpen] = useState(false);
  const [readNotificationIds, setReadNotificationIds] = useState(() => {
    if (!user?.email) return [];
    try {
      const stored = localStorage.getItem(`nexora_read_notifs_${user.email}`);
      return stored ? JSON.parse(stored) : [];
    } catch (e) {
      return [];
    }
  });

  // Save read notification IDs to localStorage
  useEffect(() => {
    if (user?.email) {
      localStorage.setItem(
        `nexora_read_notifs_${user.email}`,
        JSON.stringify(readNotificationIds)
      );
    }
  }, [readNotificationIds, user?.email]);

  // 1. Fetch Announcements
  const { data: announcementsData = [] } = useQuery({
    queryKey: ["notifications-announcements"],
    queryFn: async () => {
      const res = await axiosSecure.get("/announcements");
      return res.data || [];
    },
    enabled: !!user?.email,
    refetchInterval: 15000,
  });

  // 2. Fetch Unread Messages with Admin
  const { data: chatMessagesData = [] } = useQuery({
    queryKey: ["notifications-messages", user?.email],
    queryFn: async () => {
      const res = await axiosSecure.get("/chat/messages/admin@nexora.com");
      return res.data || [];
    },
    enabled: !!user?.email,
    refetchInterval: 10000,
  });

  // 3. Fetch Monthly Rent Bills
  const { data: rentPaymentsData = [] } = useQuery({
    queryKey: ["notifications-rent-payments", user?.email],
    queryFn: async () => {
      const res = await axiosSecure.get(`/rent-payments/${user.email}`);
      return res.data || [];
    },
    enabled: !!user?.email,
    refetchInterval: 15000,
  });

  if (!user) return null;

  // Ensure Array Safety
  const announcements = Array.isArray(announcementsData)
    ? announcementsData
    : announcementsData?.announcements || [];

  const chatMessages = Array.isArray(chatMessagesData)
    ? chatMessagesData
    : chatMessagesData?.messages || [];

  const rentPayments = Array.isArray(rentPaymentsData)
    ? rentPaymentsData
    : rentPaymentsData?.rents || [];

  // Assemble notifications from 3 sources
  const notifications = [];

  // A. Admin Announcements
  announcements.forEach((item) => {
    if (item && item._id) {
      notifications.push({
        id: `announcement_${item._id}`,
        type: "announcement",
        icon: FaBullhorn,
        title: "General Announcement",
        message: item.title || item.description || "New property update",
        date: item.createdAt ? new Date(item.createdAt) : new Date(),
        targetUrl: "/about",
      });
    }
  });

  // B. Direct Messages from Admin
  chatMessages
    .filter(
      (m) =>
        m &&
        m.senderEmail?.toLowerCase() !== user.email?.toLowerCase() &&
        m.read === false
    )
    .forEach((item) => {
      notifications.push({
        id: `msg_${item._id}`,
        type: "message",
        icon: FaComments,
        title: "Admin Message",
        message: item.message || "Sent a media attachment",
        date: item.createdAt ? new Date(item.createdAt) : new Date(),
        targetUrl: "/dashboard/chat",
      });
    });

  // C. Unpaid Monthly Rent Bills (Only for Members / Admins)
  if (role === "member" || role === "admin") {
    rentPayments
      .filter((p) => p && p.status === "unpaid")
      .forEach((item) => {
        notifications.push({
          id: `bill_${item._id}`,
          type: "bill",
          icon: FaCreditCard,
          title: "Monthly Rent Bill Due",
          message: `${item.month}: $${item.amount} rent payment requested.`,
          date: item.generatedAt
            ? new Date(item.generatedAt)
            : item.createdAt
            ? new Date(item.createdAt)
            : new Date(),
          targetUrl: "/dashboard/makepayment",
        });
      });
  }

  // Sort newest first
  notifications.sort((a, b) => b.date - a.date);

  // Unread items count
  const unreadCount = notifications.filter(
    (n) => !readNotificationIds.includes(n.id)
  ).length;

  const handleNotificationClick = async (notif) => {
    if (!readNotificationIds.includes(notif.id)) {
      setReadNotificationIds((prev) => [...prev, notif.id]);
    }

    if (notif.type === "message") {
      try {
        await axiosSecure.patch("/chat/read", {
          userEmail: user.email,
          senderEmail: "admin@nexora.com",
        });
        queryClient.invalidateQueries(["notifications-messages"]);
      } catch (err) {
        console.error("Mark message read error:", err);
      }
    }

    setIsOpen(false);
    if (notif.targetUrl) {
      if (notif.targetUrl === "/dashboard/makepayment" && role !== "member" && role !== "admin") {
        navigate("/dashboard/my-profile");
        return;
      }
      navigate(notif.targetUrl);
    }
  };

  const handleMarkAllRead = () => {
    const allIds = notifications.map((n) => n.id);
    setReadNotificationIds(allIds);
  };

  return (
    <div className="relative">
      {/* Bell Button & Unread Counter Badge */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="btn btn-ghost btn-circle border border-base-content/20 text-base-content hover:bg-base-content/10 relative"
        title="Notifications"
      >
        <FaBell className="text-base" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-rose-600 text-white font-black text-[10px] px-1.5 py-0.5 rounded-full shadow-xs border border-base-100">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {/* Notifications Dropdown Panel */}
      {isOpen && (
        <div className="absolute right-0 mt-3 w-80 sm:w-96 bg-base-100 border border-base-content/25 shadow-2xl z-[999] p-0 text-base-content rounded-none animate-fade-in">
          {/* Panel Header */}
          <div className="p-4 border-b border-base-content/15 flex items-center justify-between bg-base-100">
            <div className="flex items-center gap-2">
              <span className="text-xs font-black uppercase tracking-wider text-base-content">
                Notifications
              </span>
              {unreadCount > 0 && (
                <span className="px-2 py-0.5 text-[10px] font-black uppercase bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-500/30">
                  {unreadCount} Unread
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              {unreadCount > 0 && (
                <button
                  type="button"
                  onClick={handleMarkAllRead}
                  className="text-[10px] font-bold uppercase tracking-wider text-base-content/70 hover:text-base-content flex items-center gap-1 cursor-pointer"
                  title="Mark all as read"
                >
                  <FaCheckDouble className="text-xs" /> Mark Read
                </button>
              )}
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="text-base-content/60 hover:text-base-content text-sm p-1 cursor-pointer"
              >
                <FaTimes />
              </button>
            </div>
          </div>

          {/* Panel List Body */}
          <div className="max-h-80 overflow-y-auto divide-y divide-base-content/10">
            {notifications.length === 0 ? (
              <div className="p-6 text-center text-xs text-base-content/60 font-medium">
                No notifications right now.
              </div>
            ) : (
              notifications.map((n) => {
                const isRead = readNotificationIds.includes(n.id);
                const IconComponent = n.icon;

                return (
                  <div
                    key={n.id}
                    onClick={() => handleNotificationClick(n)}
                    className={`p-3.5 flex items-start gap-3 transition-colors cursor-pointer ${
                      isRead
                        ? "bg-base-100 opacity-65 hover:opacity-100"
                        : "bg-base-content/5 font-bold hover:bg-base-content/10"
                    }`}
                  >
                    <div className="w-8 h-8 bg-base-content/10 text-base-content border border-base-content/20 flex items-center justify-center text-xs shrink-0 mt-0.5">
                      <IconComponent />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1 mb-0.5">
                        <span className="text-[11px] font-black uppercase tracking-wider text-base-content truncate">
                          {n.title}
                        </span>
                        {!isRead && (
                          <span className="w-2 h-2 rounded-full bg-rose-500 shrink-0" />
                        )}
                      </div>
                      <p className="text-xs text-base-content/85 font-medium leading-snug line-clamp-2">
                        {n.message}
                      </p>
                      <span className="text-[10px] text-base-content/50 font-mono mt-1 block">
                        {n.date.toLocaleDateString()} • {n.date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NavbarNotificationBell;
