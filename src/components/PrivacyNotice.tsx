import React, { useState, useEffect } from 'react';

interface PrivacyNoticeProps {
  externalShow?: boolean;
  onClose?: () => void;
}

export const PrivacyNotice = ({ externalShow, onClose }: PrivacyNoticeProps = {}) => {
  const [internalShow, setInternalShow] = useState(false);

  useEffect(() => {
    // Always show notice on every page load/reload (if not externally controlled)
    if (externalShow === undefined) {
      const timer = setTimeout(() => {
        setInternalShow(true);
        console.log('📊 Data Collection Notice: Displaying on page load');
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [externalShow]);

  const showNotice = externalShow !== undefined ? externalShow : internalShow;

  const handleAccept = () => {
    if (onClose) {
      onClose();
    } else {
      setInternalShow(false);
    }
    console.log('✅ Data Collection Notice: User acknowledged');
  };

  if (!showNotice) return null;

  return (
    <div className="fixed inset-0 bg-black/60 z-[100] flex items-end sm:items-center justify-center p-4">
      <div className="bg-white rounded-t-3xl sm:rounded-3xl max-w-lg w-full p-6 shadow-2xl animate-[slideUp_0.3s_ease-out]">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
            <span className="material-icons-round text-blue-600 text-2xl">privacy_tip</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900">Data Collection Notice</h2>
        </div>

        <div className="space-y-3 text-sm text-slate-700 leading-relaxed mb-6">
          <p>
            <strong>BILAHUJAN</strong> collects <strong>anonymous flood data</strong> to help improve disaster management in Malaysia.
          </p>
          
          <div className="bg-blue-50 rounded-lg p-3 border border-blue-100">
            <p className="font-semibold text-blue-900 mb-2">✓ What we collect:</p>
            <ul className="space-y-1 text-xs text-blue-800 ml-4">
              <li>• Flood locations and severity</li>
              <li>• Weather conditions</li>
              <li>• Water levels and drainage data</li>
              <li>• Photos of flood conditions</li>
              <li>• General timestamps</li>
            </ul>
          </div>

          <div className="bg-green-50 rounded-lg p-3 border border-green-100">
            <p className="font-semibold text-green-900 mb-2">✗ What we DON'T collect:</p>
            <ul className="space-y-1 text-xs text-green-800 ml-4">
              <li>• Your name or identity</li>
              <li>• Phone numbers or contacts</li>
              <li>• Personal information</li>
              <li>• Your precise location history</li>
            </ul>
          </div>

          <p className="text-xs text-slate-600">
            This data helps improve flood monitoring and emergency response systems in Malaysia.
          </p>
        </div>

        <button
          onClick={handleAccept}
          className="w-full bg-[#6366F1] text-white py-3 rounded-xl font-bold hover:bg-[#4f46e5] transition-colors active:scale-95"
        >
          I Understand & Continue
        </button>
      </div>
    </div>
  );
};
