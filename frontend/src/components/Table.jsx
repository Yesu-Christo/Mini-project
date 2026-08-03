import React from 'react';
import { FileX } from 'lucide-react';

export default function Table({ headers, data = [], renderRow, loading }) {
  if (loading) {
    return (
      <div className="center-flex">
        <div className="spinner" />
        <span>Loading data…</span>
      </div>
    );
  }

  return (
    <div className="table-wrapper">
      <table className="data-table">
        <thead>
          <tr>
            {headers.map((h, i) => <th key={i}>{h}</th>)}
          </tr>
        </thead>
        <tbody>
          {data.length > 0 ? (
            data.map((item, i) => renderRow(item, i))
          ) : (
            <tr>
              <td colSpan={headers.length}>
                <div className="empty-state">
                  <FileX className="empty-state-icon" size={48} />
                  <p className="empty-state-text">No records found.</p>
                </div>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
