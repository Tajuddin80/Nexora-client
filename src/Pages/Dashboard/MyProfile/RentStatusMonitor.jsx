import React, { useEffect, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Swal from "sweetalert2";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import useAuth from "../../../hooks/useAuth";

const RentStatusMonitor = () => {
  //   const axiosSecure = useAxiosSecure();
  //   const { user } = useAuth();
  //   const queryClient = useQueryClient();
  //   const warnedRef = useRef(false);
  //   const downgradedRef = useRef(false);
  
  //   const { data: unpaidRents = [], isLoading } = useQuery({
  //     queryKey: ["unpaid-rents-monitor", user?.email],
  //     queryFn: async () => {
  //       const res = await axiosSecure.get(
  //         `/rent-payments/${user.email}?status=unpaid`
  //       );
  //       return res.data;
  //     },
  //     enabled: !!user?.email,
  //     refetchInterval: 60 * 1000, // poll every minute
  //   });
  
  //   const downgradeMutation = useMutation({
  //     mutationFn: async () => {
  //       await axiosSecure.patch(`/users/${user.email}/role`, { role: "user" });
  //     },
  //     onSuccess: () => {
  //       Swal.fire({
  //         icon: "error",
  //         title: "Membership Downgraded",
  //         html: `<p>You have 3 or more unpaid rents.</p><p>Your membership has been <b>downgraded to 'user'</b>.</p>`,
  //       });
  //       downgradedRef.current = true;
  
  //       //  Invalidate relevant queries so UI updates
  //       queryClient.invalidateQueries({ queryKey: ["unpaid-rents-monitor"] });
  //       queryClient.invalidateQueries({ queryKey: ["accepted-agreement"] });
  //       queryClient.invalidateQueries({ queryKey: ["user-role"] });
  //     },
  //     onError: () => {
  //       Swal.fire({
  //         icon: "error",
  //         title: "Server Error",
  //         text: "Could not downgrade membership, please contact support.",
  //       });
  //     },
  //   });
  
  //   useEffect(() => {
  //     if (isLoading || !user?.email) return;
  
  //     // reset warn if less than 2
  //     if (unpaidRents.length < 2) warnedRef.current = false;
  
  //     if (unpaidRents.length === 2 && !warnedRef.current) {
  //       Swal.fire({
  //         icon: "warning",
  //         title: "Payment Reminder",
  //         html: `<p>You have <b>2 unpaid rents</b>.</p><p>If you miss one more month, your membership will be downgraded.</p>`,
  //         confirmButtonText: "Okay",
  //         confirmButtonColor: "#f97316",
  //       });
  //       warnedRef.current = true;
  //     }
  
  //     if (unpaidRents.length >= 3 && !downgradedRef.current) {
  //       downgradedRef.current = true;
  //       downgradeMutation.mutate();
  //     }
  //   }, [isLoading, unpaidRents, downgradeMutation, user]);
  
  //   return null; // nothing visible
  };

export default RentStatusMonitor;
