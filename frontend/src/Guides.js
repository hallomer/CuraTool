import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; 
import axios from 'axios';
import FooterComponent from './FooterComponent';
import './Guides.css';


const BACKEND_BASE_URL = process.env.REACT_APP_BACKEND_BASE_URL;

const Guides = () => {
  const [guides, setGuides] = useState([]);
  const [filteredGuides, setFilteredGuides] = useState([]);
  const [activeCategory, setActiveCategory] = useState('All');
  const [categories, setCategories] = useState([]);
  const [sortOption, setSortOption] = useState('Alphabetical (A-Z)');
  const navigate = useNavigate();

  const categoryColors = {
    Emergency: '#D9534F',
    Respiratory: '#2E8B8B',
    'Water Safety': '#A1D9CE',
    'Infection Control': '#2D8A60',
    Diagnostics: '#FFC857',
    'Mobility Aids': '#9B59B6',
    Surgery: '#9D0610',
    'IV & Fluids Setup': '#F4A261',
    Power: '#E67E22',
    'Newborn Care': '#F5C6CE',
    All: '#2A5D80'
  };

  
  useEffect(() => {
    fetchGuides(); // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sortOption]);

  const fetchGuides = async () => {
    try {
      const response = await axios.get(`${BACKEND_BASE_URL}guides`);
      setGuides(response.data);
      setFilteredGuides(sortGuides(response.data, sortOption));

      const uniqueCategories = [
        ...new Set(response.data.map((guide) => guide.category))
      ].sort();
      setCategories(['All', ...uniqueCategories]);
    } catch (error) {
      console.error('Error fetching guides:', error);
    }
  };

  const sortGuides = (guides, option) => {
    switch (option) {
      case 'Alphabetical (A-Z)':
        return [...guides].sort((a, b) => a.title.localeCompare(b.title));
      case 'Alphabetical (Z-A)':
        return [...guides].sort((a, b) => b.title.localeCompare(a.title));
      case 'Time Required (Longest First)':
        return [...guides].sort((a, b) => b.timeRequired.localeCompare(a.timeRequired));
      case 'Time Required (Shortest First)':
        return [...guides].sort((a, b) => a.timeRequired.localeCompare(b.timeRequired));
      case 'Difficulty (Hard to Easy)':
        const difficultyOrderDesc = { Easy: 1, Medium: 2, Hard: 3 };
        return [...guides].sort((a, b) => difficultyOrderDesc[b.difficulty] - difficultyOrderDesc[a.difficulty]);
      case 'Difficulty (Easy to Hard)':
        const difficultyOrderAsc = { Easy: 1, Medium: 2, Hard: 3 };
        return [...guides].sort((a, b) => difficultyOrderAsc[a.difficulty] - difficultyOrderAsc[b.difficulty]);
      default:
        return guides;
    }
  };

  const handleFilterChange = (category) => {
    setActiveCategory(category);
    let filtered = category === 'All' ? guides : guides.filter((guide) => guide.category === category);
    setFilteredGuides(sortGuides(filtered, sortOption));
  };

  const handleSortChange = (event) => {
    setSortOption(event.target.value);
    const sorted = sortGuides(filteredGuides, event.target.value);
    setFilteredGuides(sorted);
  };

  const getGuideBackground = (guide) => {
    const color = categoryColors[guide.category] || '#2A5D80';
    const symbolUrl = guide.symbol ? `url(http://localhost:5000${guide.symbol})` : '';
    return {
      backgroundColor: color,
      backgroundImage: symbolUrl ? `${symbolUrl}, linear-gradient(${color}, ${color})` : '',
      backgroundSize: 'contain',
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'center',
    };
  };

  const handleViewGuide = (id) => {
    navigate(`/guide/${id}`);
  };

  return (
    <>
      <div className="guides-container">
        <div className="filter-bar">
          {categories.map((category) => (
            <span
              key={category}
              className={`filter-item ${activeCategory === category ? 'active' : ''}`}
              onClick={() => handleFilterChange(category)}
            >
              {category}
            </span>
          ))}
        </div>
        <div className="guide-info">
          <p className="guide-count">{filteredGuides.length} Guides</p>
          <select className="sort-dropdown" value={sortOption} onChange={handleSortChange}>
            <option value="Alphabetical (A-Z)">Alphabetical (A-Z)</option>
            <option value="Alphabetical (Z-A)">Alphabetical (Z-A)</option>
            <option value="Time Required (Longest First)">Time Required (Longest First)</option>
            <option value="Time Required (Shortest First)">Time Required (Shortest First)</option>
            <option value="Difficulty (Hard to Easy)">Difficulty (Hard to Easy)</option>
            <option value="Difficulty (Easy to Hard)">Difficulty (Easy to Hard)</option>
          </select>
        </div>

        <div className="grid-container">
          {filteredGuides.map((guide) => (
            <div 
              key={guide._id} 
              className="guide-card"
              style={getGuideBackground(guide)}
            >
              <h3>{guide.title}</h3>
              <div className="overlay">
              <button className="view-button" onClick={() => handleViewGuide(guide._id)}>
                &gt; View Guide
              </button>
              </div>
            </div>
          ))}
        </div>
      </div>
      <FooterComponent />
    </>
  );
};

export default Guides;
