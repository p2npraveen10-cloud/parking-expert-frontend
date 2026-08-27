import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Building2, ArrowRight, X } from "lucide-react";
import { useNavigate } from "react-router-dom";

const DISMISS_KEY = "companyOnboardingDismissed";

const CompanyOnboardingBanner = () => {
  const navigate = useNavigate();
  const [dismissed, setDismissed] = useState(
    () => sessionStorage.getItem(DISMISS_KEY) === "1"
  );

  const handleDismiss = () => {
    sessionStorage.setItem(DISMISS_KEY, "1");
    setDismissed(true);
  };

  const handleComplete = () => {
    navigate("/manage?tab=company");
  };

  return (
    <AnimatePresence>
      {!dismissed && (
        <motion.div
          initial={{ opacity: 0, y: -12, height: 0 }}
          animate={{ opacity: 1, y: 0, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
          className="overflow-hidden"
        >
          <div
            className="
            flex items-center justify-between gap-4 flex-wrap
            rounded-2xl border border-blue-100 bg-gradient-to-r
            from-blue-50 to-indigo-50 px-5 py-4 mb-2
            "
          >
            <div className="flex items-center gap-3">
              <div className="bg-white text-blue-600 p-2.5 rounded-xl shadow-sm">
                <Building2 size={20} />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-800">
                  Finish setting up your company
                </p>
                <p className="text-xs text-slate-500 mt-0.5">
                  Add your company details to unlock parking management,
                  reports, and invoicing.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={handleComplete}
                className="
                inline-flex items-center gap-1.5
                bg-gradient-to-r from-blue-600 to-indigo-700
                hover:from-blue-500 hover:to-indigo-600
                text-white text-sm font-semibold
                px-4 py-2 rounded-xl shadow-sm
                transition-all duration-200
                "
              >
                Complete now <ArrowRight size={14} />
              </button>

              <button
                type="button"
                onClick={handleDismiss}
                aria-label="Dismiss"
                className="
                text-slate-400 hover:text-slate-600
                p-2 rounded-lg hover:bg-white/60
                transition-colors duration-200
                "
              >
                <X size={16} />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CompanyOnboardingBanner;
