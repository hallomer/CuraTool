import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import html2pdf from 'html2pdf.js';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilePdf } from '@fortawesome/free-solid-svg-icons';
import FooterComponent from './FooterComponent';
import './GuideDetail.css';

const BACKEND_BASE_URL = process.env.REACT_APP_BACKEND_BASE_URL;


const GuideDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [guide, setGuide] = useState(null);
  const [relatedGuides, setRelatedGuides] = useState([]);
  const [completedSteps, setCompletedSteps] = useState(new Set());
  const [showRelatedGuides, setShowRelatedGuides] = useState(false);
  const pdfRef = useRef();
  const [isSticky, setIsSticky] = useState(false);

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
    All: '#2A5D80',
  };

  useEffect(() => {
    const fetchGuide = async () => {
      try {
        const res = await fetch(`${BACKEND_BASE_URL}guides/${id}`);
        const data = await res.json();
        setGuide(data);
      } catch (err) {
        console.error('Failed to fetch guide:', err);
      }
    };

    fetchGuide();
  }, [id]);

  useEffect(() => {
    const fetchRelatedGuides = async () => {
      if (guide) {
        try {
          const res = await fetch(`${BACKEND_BASE_URL}guides?category=${guide.category}`);
          const data = await res.json();
          setRelatedGuides(data.filter(g => g._id !== guide._id));
        } catch (err) {
          console.error('Failed to fetch related guides:', err);
        }
      }
    };

    fetchRelatedGuides();
  }, [guide]);

  useEffect(() => {
    const handleScroll = () => {
      if (pdfRef.current) { 
        const offset = window.scrollY;
        const stickyThreshold = pdfRef.current.offsetTop;
        setIsSticky(offset > stickyThreshold);
      }
    };
  
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!guide) return <p>Loading...</p>;

  const handleStepToggle = (index) => {
    setCompletedSteps((prev) => {
      const updated = new Set(prev);
      updated.has(index) ? updated.delete(index) : updated.add(index);
      return updated;
    });
  };

  const progress = (completedSteps.size / guide.steps.length) * 100;

  const handleSaveAsPDF = () => {
    const options = {
      filename: `${guide.title}.pdf`,
      jsPDF: { unit: 'pt', format: 'a4' },
      html2canvas: { scale: 2 },
    };
    html2pdf().from(pdfRef.current).set(options).save();
  };

  const toggleRelatedGuides = () => setShowRelatedGuides((prev) => !prev);
  const goBack = () => navigate('/guides');

  const titleColor = categoryColors[guide.category] || '#000';

  const lighten = (color, percent) => {
    const num = parseInt(color.slice(1), 16);
    const amt = Math.round(2.55 * percent);
    
    const R = Math.min(255, ((num >> 16) + amt));
    const G = Math.min(255, ((num >> 8) & 0x00FF) + amt);
    const B = Math.min(255, ((num & 0x0000FF) + amt));
    
    return `#${((1 << 24) + (R << 16) + (G << 8) + B).toString(16).slice(1)}`;
  };
  

  return (
    <>
      <div className="guide-detail-container">
        <div ref={pdfRef} className="pdf-container">
          <div className="header">
            <button className="back-button" onClick={goBack}>← Back to Guides</button>
            <h1 style={{ color: titleColor }}>{guide.title}</h1>
            <div className="actions">
              <button onClick={handleSaveAsPDF} className="save-pdf-button">
                <FontAwesomeIcon icon={faFilePdf} style={{ marginRight: '10px' }} />
                Save as PDF
              </button>
            </div>
          </div>

          <div ref={pdfRef} className="content">
            <p className="subtitle">
              {guide.category} | {guide.difficulty} | {guide.timeRequired}
            </p>

            <section>
              <p>{guide.intro}</p>
            </section>

            <section>
              <h2>Materials</h2>
              <ul className="materials-list">
                {guide.materials.map((material, index) => (
                  <li key={index}>{material.name}</li>
                ))}
              </ul>
            </section>

            <section>
              <h2>Steps</h2>
              <div className={`progress-bar ${isSticky ? 'sticky' : ''}`}>
                <div 
                  className="progress" 
                  style={{ width: `${progress}%`, backgroundColor: titleColor }} 
                ></div>
              </div>
              {guide.steps.map((step, index) => (
                <div 
                  className="accordion" 
                  key={index} 
                  style={{ backgroundColor: completedSteps.has(index) ? lighten(titleColor, 20) : '#F5F5F5' }}
                >
                  <input
                    type="checkbox"
                    id={`step-${index}`}
                    checked={completedSteps.has(index)}
                    onChange={() => handleStepToggle(index)}
                  />
                  <label htmlFor={`step-${index}`}>{step.description}</label>
                  {step.imageUrl && (
                    <img
                      src={step.imageUrl}
                      alt={`Step ${index + 1}`}
                      className="step-image"
                    />
                  )}
                </div>
              ))}
            </section>

            <section>
              <h2>Safety Tips</h2>
              <div className="safety-tips">
                {guide.safetyTips.map((tip, index) => (
                  <p key={index}>⚠️ {tip}</p>
                ))}
              </div>
            </section>

            <section>
              <h2>Notes</h2>
              <div className="notes-content">
                {guide.notes.map((note, index) => (
                  <p key={index}>📝 {note}</p>
                ))}
              </div>
            </section>

            <section>
              {relatedGuides.length > 0 && (
                <>
                  <button 
                    className={`toggle-header ${showRelatedGuides ? 'open' : ''}`}
                    onClick={toggleRelatedGuides}
                  >
                    <span className="arrow">{showRelatedGuides ? '▼' : '▶'}</span>
                    Related Guides
                  </button>

                  {showRelatedGuides && (
                    <div className="related-guides-list">
                      {relatedGuides.map((related) => (
                        <div 
                          key={related._id} 
                          className="related-guide-card"
                          onClick={() => navigate(`/guide/${related._id}`)}
                        >
                          <h3>{related.title}</h3>
                          <p>{related.category} | {related.difficulty}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}
            </section>
          </div>
        </div>
      </div>
      <FooterComponent />
    </>
  );
};

export default GuideDetail;
