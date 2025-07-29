import { useEffect } from "react";
import { Link } from "react-router-dom";

const SubscriptionModal = ({ showModal, setShowModal }) => {
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setShowModal(false);
      }
    };

    if (showModal) {
      window.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [showModal, setShowModal]);

  if (!showModal) return null;

  return (
    <>
     
      <div 
        className="fixed inset-0 z-40 bg-black/30"
        onClick={() => setShowModal(false)}
      />
      
     
      <div className="fixed inset-0 z-50 flex items-start justify-center p-4 overflow-y-auto">
        
        <div 
          className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 relative my-8 mx-auto"
          onClick={(e) => e.stopPropagation()}
        >
        
          <button
            onClick={() => setShowModal(false)}
            className="btn btn-sm btn-circle absolute right-2 top-2"
            aria-label="Close modal"
          >
            ✕
          </button>

          <h3 className="text-2xl font-bold mb-4">Upgrade to Premium!</h3>

          <div className="space-y-4">
            <p>
              Enjoy unlimited access to all premium content and features with our subscription plans.
            </p>

            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <span className="text-success">✓</span>
                <span>Access to premium articles</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-success">✓</span>
                <span>Ad-free reading experience</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-success">✓</span>
                <span>Unlimited article submissions</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-success">✓</span>
                <span>Exclusive content</span>
              </div>
            </div>

            <div className="modal-action flex flex-col gap-2 mt-6">
              <Link
                to="/subscription"
                className="btn btn-primary w-full"
                onClick={() => setShowModal(false)}
              >
                View Subscription Plans
              </Link>
              <button
                onClick={() => setShowModal(false)}
                className="btn btn-outline w-full"
              >
                Maybe Later
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SubscriptionModal;