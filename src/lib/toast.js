import toast from "react-hot-toast";

const toastOptions = {
  duration: 4000,
  position: "top-right",
  style: {
    background: "var(--color-base-100, #ffffff)",
    color: "var(--color-base-content, #111521)",
    border: "2px solid var(--color-base-300, #e5e7eb)",
    borderRadius: "0px",
    fontWeight: "700",
    fontSize: "0.875rem",
    boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)",
    padding: "12px 16px",
  },
};

export const showToast = {
  success: (msg) =>
    toast.success(msg, {
      ...toastOptions,
      iconTheme: {
        primary: "#16a34a",
        secondary: "#ffffff",
      },
    }),

  error: (msg) =>
    toast.error(msg, {
      ...toastOptions,
      iconTheme: {
        primary: "#dc2626",
        secondary: "#ffffff",
      },
    }),

  warning: (msg) =>
    toast(msg, {
      ...toastOptions,
      iconTheme: {
        primary: "#eab308",
        secondary: "#ffffff",
      },
    }),

  info: (msg) =>
    toast(msg, {
      ...toastOptions,
      iconTheme: {
        primary: "#2563eb",
        secondary: "#ffffff",
      },
    }),

  loading: (msg) =>
    toast.loading(msg, {
      ...toastOptions,
    }),

  dismiss: (id) => toast.dismiss(id),
};

export default showToast;
