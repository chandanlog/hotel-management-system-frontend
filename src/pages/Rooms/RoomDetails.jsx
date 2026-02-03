import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../../services/api';

const RoomDetails = () => {
  const { id } = useParams();
  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    const fetchRoom = async () => {
      try {
        const res = await api.get(`/rooms/${id}`);
        setRoom(res.data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchRoom();
  }, [id]);

  if (loading) return <div className="container" style={{textAlign:'center', marginTop:'4rem'}}>Loading...</div>;
  if (!room) return <div className="container" style={{textAlign:'center', marginTop:'4rem'}}>Room not found</div>;

  let images = [];
  try {
      images = typeof room.images === 'string' ? JSON.parse(room.images) : room.images;
  } catch (e) { images = []; }

  return (
    <div className="container animate-fade-in">
      <Link to="/" className="btn btn-secondary" style={{marginBottom:'2rem', paddingLeft:'1rem'}}>← Back to Collection</Link>
      
      <div className="card" style={{padding:0, overflow:'hidden', border:'none', boxShadow:'0 20px 40px -10px rgba(0,0,0,0.5)'}}>
        <div className="room-header" style={{height:'50vh', background:'#0f172a', position:'relative'}}>
             {images.length > 0 && (
                <img 
                    src={images[activeImage].startsWith('data:') ? images[activeImage] : `${import.meta.env.VITE_API_URL.replace('/api', '')}${images[activeImage]}`} 
                    alt={room.room_name} 
                    style={{width:'100%', height:'100%', objectFit:'cover', filter: 'brightness(0.9)'}}
                />
             )}
             <div className="room-header-content" style={{
                 position:'absolute', bottom:0, left:0, width:'100%', 
                 background: 'linear-gradient(to top, var(--bg-main), transparent)',
                 padding: '3rem 2rem 2rem 2rem',
                 display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between'
             }}>
                 <div>
                    <div style={{display:'flex', gap:'0.75rem', marginBottom:'1rem'}}>
                        <span className="badge badge-gold" style={{fontSize: '0.85rem'}}>{room.property_type}</span>
                        <span className="badge badge-silver" style={{fontSize: '0.85rem'}}>{room.room_category}</span>
                    </div>
                    <h1 className="room-title" style={{fontSize:'3.5rem', margin:0, lineHeight:1, textShadow: '0 4px 10px rgba(0,0,0,0.5)', color: 'white'}}>{room.room_name}</h1>
                 </div>
                 <div className="room-thumbnails" style={{display:'flex', gap:'10px'}}>
                     {images.map((img, idx) => (
                         <button 
                            key={idx}
                            onClick={() => setActiveImage(idx)}
                            style={{
                                width:'80px', height:'50px', flexShrink: 0,
                                border: activeImage === idx ? '2px solid var(--primary)' : '2px solid rgba(255,255,255,0.3)',
                                borderRadius: '0.5rem',
                                backgroundImage: `url(${img.startsWith('data:') ? img : `${import.meta.env.VITE_API_URL.replace('/api', '')}${img}`})`,
                                backgroundSize: 'cover',
                                cursor: 'pointer',
                                transition: 'all 0.2s'
                            }}
                         />
                     ))}
                 </div>
             </div>
        </div>

        <div className="room-body" style={{padding:'3rem', background: 'var(--bg-card)'}}>
            <div className="room-price-row" style={{display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:'2rem'}}>
                <div style={{color:'var(--text-muted)', fontSize:'1.1rem'}}>
                    Code: <span style={{color:'var(--text-main)', fontFamily:'monospace'}}>{room.room_code}</span>
                </div>
                <div className="room-price-amount" style={{textAlign:'right'}}>
                    <div style={{fontSize:'2.5rem', fontWeight:'700', color:'var(--primary)', lineHeight:1}}>${room.price_per_night}</div>
                    <div style={{color:'var(--text-muted)', fontSize:'0.9rem'}}>per night</div>
                </div>
            </div>

            <div className="grid-2" style={{gap:'4rem', gridTemplateColumns: 'repeat(auto-fit, minmax(min(450px, 100%), 1fr))'}}>
                <div style={{minWidth: 'min(400px, 100%)'}}>
                    <h3 style={{borderBottom:'1px solid var(--glass-border)', paddingBottom:'0.5rem', marginBottom:'1rem'}}>About this suite</h3>
                    <div style={{maxHeight: '350px', overflowY: 'auto', paddingRight: '0.5rem', scrollbarWidth: 'thin'}}>
                        <div style={{lineHeight:'1.8', color:'var(--text-muted)', fontSize:'1.05rem'}} dangerouslySetInnerHTML={{__html: room.description}} />
                    </div>
                </div>
                <div style={{minWidth: 'min(400px, 100%)'}}>
                    <h3 style={{borderBottom:'1px solid var(--glass-border)', paddingBottom:'0.5rem', marginBottom:'1rem'}}>Luxurious Amenities</h3>
                    <div style={{maxHeight: '350px', overflowY: 'auto', paddingRight: '0.5rem', scrollbarWidth: 'thin'}}>
                        <div style={{lineHeight:'1.8', color:'var(--text-muted)', fontSize:'1.05rem'}} dangerouslySetInnerHTML={{__html: room.amenities}} />
                    </div>
                </div>
            </div>
            
            <div className="room-footer" style={{marginTop:'4rem', paddingTop:'2rem', borderTop:'1px solid var(--glass-border)', display:'flex', justifyContent:'space-between', alignItems:'center'}}>
                <div>
                    <div className="label">Next Available Date</div>
                    <div style={{fontSize:'1.25rem', fontWeight:'600'}}>{new Date(room.available_from).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</div>
                </div>
                <button className="btn btn-primary" style={{fontSize:'1.1rem', padding:'1rem 4rem'}}>Book Now</button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default RoomDetails;
