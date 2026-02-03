import React, { useState } from 'react';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import api from '../../services/api';
import { useNavigate } from 'react-router-dom';

const RoomForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    property_type: 'Hotel',
    room_category: 'Standard',
    room_name: '',
    room_code: '',
    price_per_night: '',
    available_from: '',
    active: true,
    display_order: 0
  });

  const [description, setDescription] = useState('');
  const [amenities, setAmenities] = useState('');
  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const modules = {
    toolbar: [
      [{ 'header': [1, 2, false] }],
      ['bold', 'italic', 'underline', 'strike', 'blockquote'],
      [{'list': 'ordered'}, {'list': 'bullet'}],
      ['clean']
    ],
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setImages(files);
    
    // Create previews
    const previews = files.map(file => URL.createObjectURL(file));
    setImagePreviews(previews);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      const data = new FormData();
      Object.keys(formData).forEach(key => data.append(key, formData[key]));
      // Append rich text content
      data.append('description', description);
      data.append('amenities', amenities);
      
      images.forEach(file => {
        data.append('images', file);
      });

      await api.post('/rooms', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container animate-fade-in" style={{maxWidth: '900px'}}>
      <h1>Add New Room</h1>
      
      {error && <div style={{padding: '1rem', background: 'var(--danger)', color: 'white', borderRadius: '0.5rem', marginBottom: '1rem'}}>{error}</div>}

      <form onSubmit={handleSubmit} className="card">
        <div className="grid-2">
            <div className="form-group">
                <label className="label">Property Type</label>
                <select name="property_type" className="select" value={formData.property_type} onChange={handleChange}>
                    <option value="Hotel">Hotel</option>
                    <option value="Resort">Resort</option>
                    <option value="Villa">Villa</option>
                    <option value="Apartment">Apartment</option>
                </select>
            </div>
            <div className="form-group">
                <label className="label">Room Category</label>
                <select name="room_category" className="select" value={formData.room_category} onChange={handleChange}>
                    <option value="Standard">Standard</option>
                    <option value="Deluxe">Deluxe</option>
                    <option value="Suite">Suite</option>
                </select>
            </div>
        </div>

        <div className="grid-2">
            <div className="form-group">
                <label className="label">Room Name</label>
                <input required name="room_name" className="input" value={formData.room_name} onChange={handleChange} placeholder="e.g. Ocean View Suite" />
            </div>
            <div className="form-group">
                <label className="label">Room Code (10 chars)</label>
                <input required maxLength="10" name="room_code" className="input" value={formData.room_code} onChange={handleChange} placeholder="e.g. OCEAN00123" />
            </div>
        </div>

        <div className="form-group">
            <label className="label">Description</label>
            <div className="input" style={{padding: 0, height: 'auto', overflow: 'hidden'}}>
                <ReactQuill theme="snow" value={description} onChange={setDescription} modules={modules} />
            </div>
        </div>

        <div className="form-group">
            <label className="label">Amenities</label>
             <div className="input" style={{padding: 0, height: 'auto', overflow: 'hidden'}}>
                <ReactQuill theme="snow" value={amenities} onChange={setAmenities} modules={modules} />
             </div>
        </div>

        <div className="grid-2">
            <div className="form-group">
                <label className="label">Price per Night ($)</label>
                <input required type="number" name="price_per_night" className="input" value={formData.price_per_night} onChange={handleChange} />
            </div>
            <div className="form-group">
                <label className="label">Available From</label>
                <input required type="datetime-local" name="available_from" className="input" value={formData.available_from} onChange={handleChange} />
            </div>
        </div>

        <div className="form-group">
            <label className="label">Room Images (Max 5MB each)</label>
            <input required type="file" multiple accept="image/*" className="input" onChange={handleFileChange} />
            <div style={{display:'flex', gap:'1rem', marginTop:'1rem', overflowX:'auto'}}>
                {imagePreviews.map((src, i) => (
                    <img key={i} src={src} alt="Preview" style={{width:'80px', height:'80px', objectFit:'cover', borderRadius:'0.5rem'}} />
                ))}
            </div>
        </div>

        <div className="grid-2">
            <div className="form-group">
                <label className="label">Display Order</label>
                <input type="number" name="display_order" className="input" value={formData.display_order} onChange={handleChange} />
            </div>
                 <div className="form-group" style={{display:'flex', alignItems:'center', gap:'0.5rem', paddingTop:'2rem'}}>
                <input type="checkbox" name="active" checked={formData.active} onChange={handleChange} style={{width:'auto'}} />
                <label className="label" style={{margin:0}}>Active Listing</label>
            </div>
        </div>

        <button type="submit" disabled={submitting} className="btn btn-primary" style={{width:'100%', marginTop:'1rem'}}>
            {submitting ? 'Creating...' : 'Create Room'}
        </button>
      </form>
    </div>
  );
};

export default RoomForm;
