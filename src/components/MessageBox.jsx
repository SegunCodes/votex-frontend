import React from 'react';
import PropTypes from 'prop-types';

const MessageBox = ({ message, clearMessage }) => {
  if (!message || !message.text) return null;

  const bgColor = {
    success: 'bg-green-500',
    error: 'bg-red-500',
    info: 'bg-blue-500',
  }[message.type] || 'bg-gray-700';

  return (
    <div className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 p-4 rounded-lg shadow-xl text-center
      ${bgColor} text-white transition-opacity duration-300 ease-in-out`}
    >
      {message.text}
      <button onClick={clearMessage} className="ml-4 text-white font-bold">&times;</button>
    </div>
  );
};

// Prop type validation
MessageBox.propTypes = {
  message: PropTypes.shape({
    text: PropTypes.string,
    type: PropTypes.oneOf(['success', 'error', 'info']),
  }).isRequired,
  clearMessage: PropTypes.func.isRequired,
};

export default MessageBox;