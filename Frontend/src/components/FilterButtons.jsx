
import React from 'react';

const FILTERS = ['All', 'JavaScript', 'React', 'Node.js', 'CSS', 'HTML'];

export default function FilterButtons({ active, onChange }) {
  return (
    <div style={styles.container}>
      {FILTERS.map((f) => (
        <button
          key={f}
          onClick={() => onChange(f)}
          style={{
            ...styles.btn,
            ...(active === f ? styles.activeBtn : {}),
          }}
        >
          {f}
        </button>
      ))}
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    gap: '8px',
    padding: '16px',
    overflowX: 'auto',
    backgroundColor: '#fff',
    borderBottom: '1px solid #ddd',
  },
  btn: {
    border: 'none',
    padding: '8px 16px',
    borderRadius: '20px',
    background: '#f1f1f1',
    cursor: 'pointer',
  },
  activeBtn: {
    background: '#dcdcdc',
    fontWeight: 'bold',
  },
};
