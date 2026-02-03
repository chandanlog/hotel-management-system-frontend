import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { Link } from 'react-router-dom';

const RoomList = () => {
  const [rooms, setRooms] = useState([]);
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('latest');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(fetchRooms, 300);
    return () => clearTimeout(timer);
  }, [search, sort]);

  const fetchRooms = async () => {
    try {
      setLoading(true);
      const res = await api.get('/rooms', { params: { search, sort } });
      setRooms(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <div>
           <h1>Discover Luxury</h1>
           <p className="page-subtitle">Find your perfect stay from our curated collection.</p>
        </div>
        <Link to="/rooms/create" className="btn btn-primary add-room-btn">
            <span style={{fontSize:'1.2rem'}}>+</span> <span className="btn-text">Add New Room</span>
        </Link>
      </div>

      <div className="card" style={{marginBottom:'2rem'}}>
        <div className="grid-2">
            <div className="form-group">
                <label className="label">Search by Name or Code</label>
                <input 
                    className="input" 
                    placeholder="Enter keywords..." 
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                />
            </div>
            <div className="form-group">
                <label className="label">Sort By</label>
                <select className="select" value={sort} onChange={e => setSort(e.target.value)}>
                    <option value="latest">Latest First</option>
                    <option value="display_order">Display Order</option>
                    <option value="available_from">Available From</option>
                </select>
            </div>
        </div>
      </div>

      {loading ? (
          <div style={{textAlign:'center', padding:'2rem', color:'var(--text-muted)'}}>Loading rooms...</div>
      ) : rooms.length === 0 ? (
          <div style={{textAlign:'center', padding:'4rem', border:'2px dashed var(--glass-border)', borderRadius:'1rem', color:'var(--text-muted)'}}>
              <h3>No rooms found</h3>
              <p>Try adjusting your search criteria or add a new room.</p>
          </div>
      ) : (
          <div className="grid-3">
              {rooms.map(room => {
                  let images = [];
                  try {
                      images = typeof room.images === 'string' ? JSON.parse(room.images) : room.images;
                  } catch (e) { images = []; }
                  
                  return (
                    <div key={room.id} className="card" style={{padding:'0', overflow:'hidden'}}>
                        <div style={{height:'200px', background:'var(--bg-main)'}}>
                            {images[0] && (
                                <img 
                                    src={images[0].startsWith('data:') ? images[0] : `${import.meta.env.VITE_API_URL.replace('/api', '')}${images[0]}`}
                                    alt={room.room_name} 
                                    className="room-image"
                                    style={{height:'200px', width:'100%', borderRadius:0, margin:0}}
                                />
                            )}
                        </div>
                        <div style={{padding:'1.5rem'}}>
                            <div style={{display:'flex', justifyContent:'space-between', alignItems:'start'}}>
                                <div>
                                    <span className="badge badge-silver" style={{marginBottom:'0.5rem', display:'inline-block'}}>{room.room_category}</span>
                                    <h3 style={{fontSize:'1.25rem', marginBottom:'0.5rem', marginTop:0}}>{room.room_name}</h3>
                                </div>
                                <div className="room-price">${room.price_per_night}</div>
                            </div>
                            
                            <div className="room-meta">
                                <span>Code: {room.room_code}</span>
                                <span>•</span>
                                <span>{room.property_type}</span>
                            </div>
                            
                            <div className="room-meta">
                                <span>Available: {new Date(room.available_from).toLocaleDateString()}</span>
                            </div>

                            <div style={{marginTop:'1rem', display:'flex', gap:'0.5rem'}}>
                                <Link to={`/rooms/${room.id}`} className="btn btn-primary" style={{flex:1, fontSize:'0.8rem'}}>View Details</Link>
                            </div>
                        </div>
                    </div>
                  );
              })}
          </div>
      )}
    </div>
  );
};

export default RoomList;
