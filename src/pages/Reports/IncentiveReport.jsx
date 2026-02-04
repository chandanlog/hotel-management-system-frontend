import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { 
    LuDownload, 
    LuUser, 
    LuSearch, 
    LuHotel, 
    LuLayers, 
    LuStar, 
    LuChevronDown, 
    LuChevronUp,
    LuArrowUpDown
} from 'react-icons/lu';


const IncentiveReport = () => {
  const [report, setReport] = useState([]);
  const [filters, setFilters] = useState({ agent_name: '', rating: '', property_type: '', room_category: '', sortBy: '', order: 'asc' });
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
    // Define headers
    const headers = ['Agent Name', 'Total Bookings', 'Total Points', 'Rating', 'Total Incentive ($)'];
    
    // Format rows and escape commas/quotes
    const rows = report.map(r => [
      r.agent_name,
      r.total_bookings,
      r.total_points,
      r.rating,
      r.total_incentive.toFixed(2)
    ].map(val => `"${String(val).replace(/"/g, '""')}"`)); // Handle quotes and wrap in quotes

    // Prepare CSV content with BOM for Excel UTF-8 support
    const csvContent = [
      headers.map(h => `"${h}"`).join(","),
      ...rows.map(row => row.join(","))
    ].join("\n");

    const blob = new Blob(["\ufeff" + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `Incentive_Report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  return (
    <div>
      <div className="page-header">
        <h1>Agent Performance Report</h1>
        <button className="btn btn-primary add-room-btn" onClick={exportCSV} style={{display:'flex', alignItems:'center', gap:'8px'}}>
            <LuDownload size={18} /> Export CSV
        </button>
      </div>


      <div className="card" style={{marginBottom: '2rem'}}>
        <div className="grid-3">
            <div className="form-group">
                <label className="label" style={{display:'flex', alignItems:'center', gap:'6px'}}>
                    <LuUser size={14} /> Search Agent
                </label>

                <input 
                    className="input" 
                    placeholder="Result..." 
                    value={filters.agent_name}
                    onChange={e => setFilters({...filters, agent_name: e.target.value})}
                />
            </div>
            <div className="form-group">
                <label className="label" style={{display:'flex', alignItems:'center', gap:'6px'}}>
                    <LuHotel size={14} /> Property Type
                </label>

                <select 
                    className="select"
                    value={filters.property_type}
                    onChange={e => setFilters({...filters, property_type: e.target.value})}
                >
                    <option value="">All Types</option>
                    <option value="Hotel">Hotel</option>
                    <option value="Resort">Resort</option>
                    <option value="Villa">Villa</option>
                    <option value="Apartment">Apartment</option>
                </select>
            </div>
            <div className="form-group">
                <label className="label" style={{display:'flex', alignItems:'center', gap:'6px'}}>
                    <LuLayers size={14} /> Room Category
                </label>


                <select 
                    className="select"
                    value={filters.room_category}
                    onChange={e => setFilters({...filters, room_category: e.target.value})}
                >
                    <option value="">All Categories</option>
                    <option value="Standard">Standard</option>
                    <option value="Deluxe">Deluxe</option>
                    <option value="Suite">Suite</option>
                </select>
            </div>
            <div className="form-group">
                <label className="label" style={{display:'flex', alignItems:'center', gap:'6px'}}>
                    <LuStar size={14} /> Filter by Rating
                </label>

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
                        <th onClick={() => handleSort('agent_name')} style={{cursor:'pointer'}}>
                            <div style={{display:'flex', alignItems:'center', gap:'6px'}}>Agent Name <LuArrowUpDown size={14} /></div>
                        </th>
                        <th onClick={() => handleSort('total_bookings')} style={{cursor:'pointer'}}>
                            <div style={{display:'flex', alignItems:'center', gap:'6px'}}>Total Bookings <LuArrowUpDown size={14} /></div>
                        </th>
                        <th onClick={() => handleSort('total_points')} style={{cursor:'pointer'}}>
                            <div style={{display:'flex', alignItems:'center', gap:'6px'}}>Points <LuArrowUpDown size={14} /></div>
                        </th>
                        <th onClick={() => handleSort('rating')} style={{cursor:'pointer'}}>
                            <div style={{display:'flex', alignItems:'center', gap:'6px'}}>Rating <LuArrowUpDown size={14} /></div>
                        </th>
                        <th onClick={() => handleSort('total_incentive')} style={{cursor:'pointer'}}>
                            <div style={{display:'flex', alignItems:'center', gap:'6px'}}>Total Incentive ($) <LuArrowUpDown size={14} /></div>
                        </th>
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
                                            style={{fontSize:'0.75rem', padding:'0.25rem 0.5rem', background:'var(--bg-main)', border:'1px solid var(--glass-border)', color:'var(--text-main)', display:'inline-flex', alignItems:'center', gap:'4px'}}
                                            onClick={() => setExpandedRow(expandedRow === idx ? null : idx)}
                                        >
                                            {expandedRow === idx ? <><LuChevronUp size={14} /> Hide Details</> : <><LuChevronDown size={14} /> View Breakdown</>}
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
