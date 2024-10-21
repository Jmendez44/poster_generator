import React from 'react';

interface DownloadPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onDownloadLowRes: () => void;
  onSignUp: (email: string) => void;
  isLoading: boolean;
}

const DownloadPopup: React.FC<DownloadPopupProps> = ({ isOpen, onClose, onDownloadLowRes, onSignUp, isLoading }) => {
  const [email, setEmail] = React.useState('');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl">
        <h2 className="text-xl font-bold mb-4">Download Options</h2>
        <button
          onClick={onDownloadLowRes}
          className="w-full mb-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Download Low Res
        </button>
        <div className="mb-4">
          <p className="mb-2">Sign up for high-res download:</p>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>
        <button
          onClick={() => onSignUp(email)}
          disabled={isLoading || !email.trim()}
          className="w-full px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:bg-gray-400"
        >
          {isLoading ? 'Processing...' : 'Sign Up & Download High Res'}
        </button>
        <button
          onClick={onClose}
          className="mt-4 w-full px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default DownloadPopup;
