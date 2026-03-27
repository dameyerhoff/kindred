"use client";
import { useState, useEffect } from "react";

export default function LandingController({ userId, landing, dashboard }) {
  const [showDashboard, setShowDashboard] = useState(false);
  const [isFirstVisit, setIsFirstVisit] = useState(true);

  useEffect(() => {
    // Check if the user has already seen the animation in this session
    const hasSeenAnimation = sessionStorage.getItem("kindred_entered");

    if (userId) {
      if (hasSeenAnimation) {
        // Skip the wait and go straight to dashboard
        setShowDashboard(true);
        setIsFirstVisit(false);
      } else {
        // First time this session - show the 3-second "cinema"
        const timer = setTimeout(() => {
          setShowDashboard(true);
          sessionStorage.setItem("kindred_entered", "true");
        }, 3000);
        return () => clearTimeout(timer);
      }
    }
  }, [userId]);

  // If NOT logged in, always show landing page (Enter Site button)
  if (!userId) {
    // Clear the session flag when logged out so they see it again next login
    if (typeof window !== "undefined") {
      sessionStorage.removeItem("kindred_entered");
    }
    return landing;
  }

  // If logged in, skip the landing shell if it's not the first visit
  return showDashboard ? dashboard : landing;
}
