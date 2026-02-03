import React, { useState, useEffect } from 'react';
import api from '../../services/api';

const IncentiveReport = () => {
  const [report, setReport] = useState([]);
  const [filters, setFilters] = useState({ agent_name: '', rating: '', sortBy: '', order: 'asc' });
  const [loading, setLoading] = useState(true);
  const [expandedRow, setExpandedRow] = useState(null);

  useEffect(() => {
    const timer = setTimeout(() => {
        fetchReport();
    }, 300);
    return () => clearTimeout(timer);
  }, [filters]);

  const fetchReport = async () => {
    try {
      setLoading(true);
      const res = await api.get('/reports', { params: filters });
      setReport(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSort = (field) => {
    setFilters(prev => ({
      ...prev,
      sortBy: field,
      order: prev.sortBy === field && prev.order === 'asc' ? 'desc' : 'asc'
    }));
  };

  const exportCSV = () => {
    // Basic CSV export logic
    const headers = ['Agent', 'Total Bookings', 'Total Points', 'Rating', 'Total Incentive'];
    const rows = report.map(r => [r.agent_name, r.total_bookings, r.total_points, r.rating, r.total_incentive]);
    const csvContent = "data:text/csv;charset=utf-8," 
        + headers.join(",") + "\n" 
        + rows.map(e => e.join(",")).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "incentive_report.csv");
    document.body.appendChild(link);
    link.click();
  }

  return (
    <div>
      <div className="page-header">
        <h1>Agent Performance Report</h1>
        <button className="btn btn-primary add-room-btn" onClick={exportCSV}>Export CSV</button>
      </div>

      <div className="card" style={{marginBottom: '2rem'}}>
        <div className="grid-3">
            <div className="form-group">
                <label className="label">Search Agent</label>
                <input 
                    className="input" 
                    placeholder="Result..." 
                    value={filters.agent_name}
                    onChange={e => setFilters({...filters, agent_name: e.target.value})}
                />
            </div>
            <div className="form-group">
                <label className="label">Filter by Rating</label>
                <select 
                    className="select"
                    value={filters.rating}
                    onChange={e => setFilters({...filters, rating: e.target.value})}
                >
                    <option value="">All Ratings</option>
                    <option value="Gold">Gold</option>
                    <option value="Silver">Silver</option>
                    <option value="Bronze">Bronze</option>
                </select>
            </div>
        </div>
      </div>

      <div className="card" style={{padding: 0, overflow: 'hidden'}}>
        <div className="table-container">
            <table className="table">
                <thead>
                    <tr>
                        <th onClick={() => handleSort('agent_name')} style={{cursor:'pointer'}}>Agent Name ↕</th>
                        <th onClick={() => handleSort('total_bookings')} style={{cursor:'pointer'}}>Total Bookings ↕</th>
                        <th onClick={() => handleSort('total_points')} style={{cursor:'pointer'}}>Points ↕</th>
                        <th onClick={() => handleSort('rating')} style={{cursor:'pointer'}}>Rating ↕</th>
                        <th onClick={() => handleSort('total_incentive')} style={{cursor:'pointer'}}>Total Incentive ($) ↕</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {loading ? (
                        <tr>
                            <td colSpan="6" style={{padding: '5rem'}}>
                                <div className="loader-container">
                                    <div className="loader"></div>
                                    <div className="loader-text">Generating Performance Report...</div>
                                </div>
                            </td>
                        </tr>
                    ) : report.length === 0 ? (
                        <tr><td colSpan="6" style={{textAlign:'center'}}>No Data Found</td></tr>
                    ) : (
                        report.map((agent, idx) => (
                            <React.Fragment key={idx}>
                                <tr style={{background: expandedRow === idx ? 'rgba(255,255,255,0.02)' : 'transparent'}}>
                                    <td style={{fontWeight: 600}}>{agent.agent_name}</td>
                                    <td>{agent.total_bookings}</td>
                                    <td>{agent.total_points}</td>
                                    <td>
                                        <span className={`badge badge-${agent.rating.toLowerCase()}`}>
                                            {agent.rating}
                                        </span>
                                    </td>
                                    <td style={{color: 'var(--success)', fontWeight: 'bold'}}>${agent.total_incentive.toFixed(2)}</td>
                                    <td>
                                        <button 
                                            className="btn" 
                                            style={{fontSize:'0.75rem', padding:'0.25rem 0.5rem', background:'var(--bg-main)', border:'1px solid var(--glass-border)', color:'var(--text-main)'}}
                                            onClick={() => setExpandedRow(expandedRow === idx ? null : idx)}
                                        >
                                            {expandedRow === idx ? 'Hide Details' : 'View Breakdown'}
                                        </button>
                                    </td>
                                </tr>
                                {expandedRow === idx && (
                                    <tr>
                                        <td colSpan="6" style={{padding:'0', background:'var(--bg-main)'}}>
                                            <div style={{padding:'1rem 2rem', borderTop:'1px solid var(--glass-border)'}}>
                                                <h4 style={{marginTop:0}}>Incentive Breakdown</h4>
                                                <table className="table" style={{fontSize:'0.875rem'}}>
                                                    <thead>
                                                        <tr>
                                                            <th>Property</th>
                                                            <th>Category</th>
                                                            <th>Count</th>
                                                            <th>Base ($)</th>
                                                            <th>Volume Bonus ($)</th>
                                                            <th>High Perf. Bonus ($)</th>
                                                            <th>Total ($)</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {agent.breakdown.map((item, i) => (
                                                            <tr key={i}>
                                                                <td>{item.property_type}</td>
                                                                <td>{item.room_category}</td>
                                                                <td>{item.count}</td>
                                                                <td>{item.base_incentive}</td>
                                                                <td>{item.volume_bonus}</td>
                                                                <td>{item.high_performer_bonus}</td>
                                                                <td style={{fontWeight:'bold'}}>{item.total}</td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                                <div style={{marginTop:'1rem', textAlign:'right', fontSize:'0.875rem', color:'var(--text-muted)'}}>
                                                    plus Performance Bonus ({agent.performance_bonus > 0 ? (agent.rating === 'Gold' ? '10%' : '5%') : '0%'}): 
                                                    <span style={{color:'var(--text-main)', marginLeft:'0.5rem'}}>${agent.performance_bonus.toFixed(2)}</span>
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </React.Fragment>
                        ))
                    )}
                </tbody>
            </table>
        </div>
      </div>
    </div>
  );
};

export default IncentiveReport;
