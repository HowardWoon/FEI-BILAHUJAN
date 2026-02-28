import { useState, useEffect } from 'react';

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
    <div className="fixed inset-0 bg-black/60 z-[100] flex items-center justify-center p-3">
      <div className="bg-white rounded-2xl w-full max-w-[260px] p-3 shadow-xl animate-[slideUp_0.3s_ease-out]">
        <div className="flex items-center gap-1.5 mb-2">
          <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center shrink-0">
            <span className="material-icons-round text-blue-600 text-sm">privacy_tip</span>
          </div>
          <h2 className="text-sm font-bold text-slate-900 leading-tight">Data Collection Notice</h2>
        </div>

        <p className="text-[10px] text-slate-600 mb-2 leading-snug">
          <strong>BILAHUJAN</strong> collects <strong>anonymous flood data</strong> to improve disaster response in Malaysia.
        </p>

        <div className="grid grid-cols-2 gap-1.5 mb-2">
          <div className="bg-blue-50 rounded-lg p-1.5 border border-blue-100">
            <p className="font-semibold text-blue-900 text-[10px] mb-0.5">✓ We collect:</p>
            <ul className="text-[9px] text-blue-800 space-y-0.5">
              <li>• Flood locations</li>
              <li>• Weather data</li>
              <li>• Water levels</li>
              <li>• Flood photos</li>
            </ul>
          </div>
          <div className="bg-green-50 rounded-lg p-1.5 border border-green-100">
            <p className="font-semibold text-green-900 text-[10px] mb-0.5">✗ NOT collected:</p>
            <ul className="text-[9px] text-green-800 space-y-0.5">
              <li>• Your identity</li>
              <li>• Phone number</li>
              <li>• Personal info</li>
              <li>• Location history</li>
            </ul>
          </div>
        </div>

        <button
          onClick={handleAccept}
          className="w-full bg-[#6366F1] text-white py-1.5 rounded-lg font-bold text-xs hover:bg-[#4f46e5] transition-colors active:scale-95"
        >
          I Understand & Continue
        </button>
      </div>
    </div>
  );
};
