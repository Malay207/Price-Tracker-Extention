import React from 'react';

const WarningMessage: React.FC = () => {
  const warningStyle: React.CSSProperties = {
    border: '1px solid #FFA500',
    backgroundColor: '#FFF3E0',
    color: '#CC3300',
    borderRadius: '5px',
    fontSize: '12px',
    fontWeight: 'bold',
    textAlign: 'center',
    margin: '0 10px',
  };

  return (
    <div style={warningStyle}>
      <p>⚠️ I use a shared database, so the process may take some time to process the data.</p>
    </div>
  );
};

export default WarningMessage;
