import React from 'react';

export default function Button({ children, type = 'button', variant = 'primary', onClick, style }) {
  return (
    <button type={type} className={`btn btn-${variant}`} onClick={onClick} style={style}>
      {children}
    </button>
  );
}
