import React, { useState } from 'react';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import api from '../../services/api';
import { useNavigate } from 'react-router-dom';
import { 
    LuHotel, 
    LuLayers, 
    LuTag, 
    LuCode, 
    LuFileText, 
    LuCheck,
    LuImage, 
    LuList, 
    LuSave, 
    LuCalendar 
} from 'react-icons/lu';



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

  const PRESETS = {
    Standard: { price: 100, amenities: '<ul><li>Free Wi-Fi</li><li>AC</li><li>Flat Screen TV</li></ul>' },
    Deluxe: { price: 250, amenities: '<ul><li>Sea View</li><li>Mini Bar</li><li>Premium Bedding</li><li>Complimentary Breakfast</li></ul>' },
    Suite: { price: 500, amenities: '<ul><li>Private Balcony</li><li>Personal Butler</li><li>Jacuzzi</li><li>Airport Transfer</li></ul>' }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name === 'room_category') {
      const preset = PRESETS[value] || { price: '', amenities: '' };
      setFormData(prev => ({
        ...prev,
        room_category: value,
        price_per_night: preset.price
      }));
      setAmenities(preset.amenities);
      return;
    }

    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    const maxSize = 5 * 1024 * 1024; // 5MB
    
    const validFiles = files.filter(file => {
      if (file.size > maxSize) {
        alert(`File ${file.name} is too large. Max size is 5MB.`);
        return false;
      }
      return true;
    });

    if (validFiles.length !== files.length) {
      e.target.value = ''; // Reset input if some files were invalid
    }

    setImages(validFiles);
    
    // Create previews
    const previews = validFiles.map(file => URL.createObjectURL(file));
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
      <h1 style={{display:'flex', alignItems:'center', gap:'12px'}}>
          <LuHotel /> Add New Room
      </h1>

      
      {error && <div style={{padding: '1rem', background: 'var(--danger)', color: 'white', borderRadius: '0.5rem', marginBottom: '1rem'}}>{error}</div>}

      <form onSubmit={handleSubmit} className="card">
        <div className="grid-2">
            <div className="form-group">
                <label className="label" style={{display:'flex', alignItems:'center', gap:'6px'}}>
                    <LuHotel size={14} /> Property Type
                </label>

                <select name="property_type" className="select" value={formData.property_type} onChange={handleChange}>
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


                <select name="room_category" className="select" value={formData.room_category} onChange={handleChange}>
                    <option value="Standard">Standard</option>
                    <option value="Deluxe">Deluxe</option>
                    <option value="Suite">Suite</option>
                </select>
            </div>
        </div>

        <div className="grid-2">
            <div className="form-group">
                <label className="label" style={{display:'flex', alignItems:'center', gap:'6px'}}>
                    <LuFileText size={14} /> Room Name
                </label>

                <input required name="room_name" className="input" value={formData.room_name} onChange={handleChange} placeholder="e.g. Ocean View Suite" />
            </div>
            <div className="form-group">
                <label className="label" style={{display:'flex', alignItems:'center', gap:'6px'}}>
                    <LuCode size={14} /> Room Code (10 chars)
                </label>

                <input required maxLength="10" name="room_code" className="input" value={formData.room_code} onChange={handleChange} placeholder="e.g. OCEAN00123" />
            </div>
        </div>

        <div className="form-group">
            <label className="label" style={{display:'flex', alignItems:'center', gap:'6px'}}>
                <LuFileText size={14} /> Description
            </label>

            <div className="input" style={{padding: 0, height: 'auto', overflow: 'hidden'}}>
                <ReactQuill theme="snow" value={description} onChange={setDescription} modules={modules} />
            </div>
        </div>

        <div className="form-group">
            <label className="label" style={{display:'flex', alignItems:'center', gap:'6px'}}>
                <LuList size={14} /> Amenities
            </label>

             <div className="input" style={{padding: 0, height: 'auto', overflow: 'hidden'}}>
                <ReactQuill theme="snow" value={amenities} onChange={setAmenities} modules={modules} />
             </div>
        </div>

        <div className="grid-2">
            <div className="form-group">
                <label className="label" style={{display:'flex', alignItems:'center', gap:'6px'}}>
                    <LuTag size={14} /> Price per Night ($)
                </label>

                <input required type="number" name="price_per_night" className="input" value={formData.price_per_night} onChange={handleChange} />
            </div>
            <div className="form-group">
                <label className="label" style={{display:'flex', alignItems:'center', gap:'6px'}}>
                    <LuCalendar size={14} /> Available From
                </label>

                <input required type="datetime-local" name="available_from" className="input" value={formData.available_from} onChange={handleChange} />
            </div>
        </div>

        <div className="form-group">
            <label className="label" style={{display:'flex', alignItems:'center', gap:'6px'}}>
                <LuImage size={14} /> Room Images (Max 5MB each)
            </label>

            <input required type="file" multiple accept="image/*" className="input" onChange={handleFileChange} />
            <div style={{display:'flex', gap:'1rem', marginTop:'1rem', overflowX:'auto'}}>
                {imagePreviews.map((src, i) => (
                    <img key={i} src={src} alt="Preview" style={{width:'80px', height:'80px', objectFit:'cover', borderRadius:'0.5rem'}} />
                ))}
            </div>
        </div>

        <div className="grid-2">
            <div className="form-group">
                <label className="label" style={{display:'flex', alignItems:'center', gap:'6px'}}>
                    <LuList size={14} /> Display Order
                </label>

                <input type="number" name="display_order" className="input" value={formData.display_order} onChange={handleChange} />
            </div>
                 <div className="form-group" style={{display:'flex', alignItems:'center', gap:'0.5rem', paddingTop:'2rem'}}>
                <input type="checkbox" name="active" checked={formData.active} onChange={handleChange} style={{width:'auto'}} />
                <label className="label" style={{margin:0, display:'flex', alignItems:'center', gap:'6px'}}>
                    <LuCheck size={14} /> Active Listing
                </label>
            </div>
        </div>

        <button type="submit" disabled={submitting} className="btn btn-primary" style={{width:'100%', marginTop:'1rem', minHeight: '3.5rem', display:'flex', justifyContent:'center', alignItems:'center', gap:'8px'}}>
            {submitting ? (
                <div style={{display:'flex', alignItems:'center', gap:'1rem'}}>
                    <div className="loader" style={{width:'20px', height:'20px', borderWidth:'2px'}}></div>
                    <span>Creating Room...</span>
                </div>
            ) : <><LuSave size={18} /> Create Room</>}
        </button>

      </form>
    </div>
  );
};

export default RoomForm;
