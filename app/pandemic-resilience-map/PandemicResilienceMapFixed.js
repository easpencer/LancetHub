'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { FaArrowLeft, FaLayerGroup, FaChartBar, FaInfo, FaGlobe, FaVirus, FaShieldAlt, FaDownload, FaSearch, FaFilter, FaExchangeAlt, FaClock, FaMapMarkedAlt, FaStar } from 'react-icons/fa';
import styles from './pandemic-resilience-map.module.css';
import LandscapeTopicsVisualization from '../../components/LandscapeTopicsVisualization';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import Chart from 'chart.js/auto';
// Import country resilience data
import { countryResilienceData, regionalGroups, calculateRegionalScores } from './worldCountries';

// Fix Leaflet default icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

// Major pandemic events with detailed information
const pandemicEvents = [
  {
    name: 'COVID-19',
    year: '2019-present',
    origin: [30.5928, 114.3055],
    originName: 'Wuhan, China',
    affected: 'Global',
    deaths: '6.9M+',
    type: 'Coronavirus',
    color: '#dc2626',
    resilienceImpact: 'Exposed global vulnerabilities in health systems, information ecosystems, and social cohesion',
    spread: [
      { lat: 35.6762, lng: 139.6503, location: 'Tokyo, Japan', date: '2020-01' },
      { lat: 37.5665, lng: 126.9780, location: 'Seoul, South Korea', date: '2020-01' },
      { lat: 47.6062, lng: -122.3321, location: 'Seattle, USA', date: '2020-01' },
      { lat: 45.4642, lng: 9.1900, location: 'Milan, Italy', date: '2020-02' },
      { lat: 40.7128, lng: -74.0060, location: 'New York, USA', date: '2020-03' },
      { lat: -23.5505, lng: -46.6333, location: 'São Paulo, Brazil', date: '2020-03' }
    ]
  },
  {
    name: 'H1N1 Influenza',
    year: '2009-2010',
    origin: [23.6345, -102.5528],
    originName: 'Mexico',
    affected: '214 countries',
    deaths: '151K-575K',
    type: 'Influenza',
    color: '#f59e0b',
    resilienceImpact: 'Highlighted importance of vaccine development and distribution infrastructure',
    spread: [
      { lat: 32.7767, lng: -96.7970, location: 'Dallas, USA', date: '2009-04' },
      { lat: 40.7128, lng: -74.0060, location: 'New York, USA', date: '2009-04' },
      { lat: 51.5074, lng: -0.1278, location: 'London, UK', date: '2009-04' },
      { lat: 35.6762, lng: 139.6503, location: 'Tokyo, Japan', date: '2009-05' }
    ]
  },
  {
    name: 'SARS',
    year: '2002-2003',
    origin: [23.1291, 113.2644],
    originName: 'Guangdong, China',
    affected: '26 countries',
    deaths: '774',
    type: 'Coronavirus',
    color: '#8b5cf6',
    resilienceImpact: 'Led to improvements in disease surveillance and hospital infection control',
    spread: [
      { lat: 22.3193, lng: 114.1694, location: 'Hong Kong', date: '2003-02' },
      { lat: 1.3521, lng: 103.8198, location: 'Singapore', date: '2003-03' },
      { lat: 43.6532, lng: -79.3832, location: 'Toronto, Canada', date: '2003-03' }
    ]
  },
  {
    name: 'MERS',
    year: '2012-present',
    origin: [24.7136, 46.6753],
    originName: 'Saudi Arabia',
    affected: '27 countries',
    deaths: '935+',
    type: 'Coronavirus',
    color: '#ec4899',
    resilienceImpact: 'Emphasized need for One Health approaches and zoonotic disease monitoring',
    spread: [
      { lat: 24.4539, lng: 54.3773, location: 'Abu Dhabi, UAE', date: '2013-04' },
      { lat: 37.5665, lng: 126.9780, location: 'Seoul, South Korea', date: '2015-05' }
    ]
  },
  {
    name: 'Ebola',
    year: '2014-2016',
    origin: [8.4606, -11.7799],
    originName: 'Guinea',
    affected: 'West Africa',
    deaths: '11,325',
    type: 'Filovirus',
    color: '#ef4444',
    resilienceImpact: 'Demonstrated importance of community engagement and trust in public health response',
    spread: [
      { lat: 6.4281, lng: -9.4295, location: 'Monrovia, Liberia', date: '2014-06' },
      { lat: 8.4840, lng: -13.2299, location: 'Freetown, Sierra Leone', date: '2014-05' }
    ]
  },
  {
    name: 'Zika',
    year: '2015-2016',
    origin: [-15.8267, -47.9218],
    originName: 'Brazil',
    affected: 'Americas',
    deaths: 'Low mortality',
    type: 'Flavivirus',
    color: '#10b981',
    resilienceImpact: 'Revealed vulnerabilities in maternal health systems and vector control',
    spread: [
      { lat: 4.7110, lng: -74.0721, location: 'Bogotá, Colombia', date: '2015-10' },
      { lat: 25.7617, lng: -80.1918, location: 'Miami, USA', date: '2016-07' }
    ]
  }
];

export default function PandemicResilienceMapFixed() {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const router = useRouter();
  const [activeLayer, setActiveLayer] = useState('resilience');
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [showLandscapeTopics, setShowLandscapeTopics] = useState(false);
  const [comparisonMode, setComparisonMode] = useState(false);
  const [selectedCountries, setSelectedCountries] = useState([]);
  const [timeSliderValue, setTimeSliderValue] = useState(2024);
  const [searchTerm, setSearchTerm] = useState('');
  const [resilienceFilter, setResilienceFilter] = useState('all');
  const [showRegionalView, setShowRegionalView] = useState(false);
  const [featuredCountries, setFeaturedCountries] = useState([]);
  const [mapStats, setMapStats] = useState({
    countriesAnalyzed: Object.keys(countryResilienceData).length,
    avgResilience: 67,
    highRiskCountries: 3,
    dataLastUpdated: new Date().toLocaleDateString()
  });

  const countriesLayerRef = useRef(null);
  const pandemicLayerRef = useRef(null);
  const radarChartRef = useRef(null);
  const zoomControlRef = useRef(null);

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    // Initialize map
    const map = L.map(mapRef.current, {
      center: [20, 0],
      zoom: 2.5,
      minZoom: 2,
      maxZoom: 8,
      worldCopyJump: true,
      preferCanvas: true,
      zoomControl: false
    });

    // Dark theme tile layer
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      attribution: '© OpenStreetMap contributors © CARTO',
      subdomains: 'abcd',
      maxZoom: 20
    }).addTo(map);

    // Add custom zoom control
    L.control.zoom({
      position: 'topright'
    }).addTo(map);

    mapInstanceRef.current = map;

    // Create layer groups
    countriesLayerRef.current = L.layerGroup().addTo(map);
    pandemicLayerRef.current = L.layerGroup().addTo(map);

    // Calculate featured countries (top 5 by resilience score)
    const topCountries = Object.entries(countryResilienceData)
      .sort((a, b) => b[1].overallScore - a[1].overallScore)
      .slice(0, 5)
      .map(([name, data]) => ({ name, ...data }));
    setFeaturedCountries(topCountries);

    // Calculate map statistics
    const scores = Object.values(countryResilienceData).map(c => c.overallScore);
    const avgScore = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
    const highRisk = scores.filter(s => s < 50).length;
    
    setMapStats({
      countriesAnalyzed: Object.keys(countryResilienceData).length,
      avgResilience: avgScore,
      highRiskCountries: highRisk,
      dataLastUpdated: new Date().toLocaleDateString()
    });

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (!mapInstanceRef.current) return;

    // Clear existing layers
    if (countriesLayerRef.current) countriesLayerRef.current.clearLayers();
    if (pandemicLayerRef.current) pandemicLayerRef.current.clearLayers();

    if (activeLayer === 'resilience' || activeLayer === 'vulnerabilities') {
      if (showRegionalView) {
        addRegionalLayers();
      } else {
        addCountryLayers();
      }
    }
    
    if (activeLayer === 'outbreaks') {
      addPandemicLayers();
    }

  }, [activeLayer, showRegionalView, timeSliderValue, resilienceFilter]);

  const getResilienceColor = (score) => {
    if (score >= 80) return '#10b981';
    if (score >= 70) return '#3b82f6';
    if (score >= 60) return '#f59e0b';
    if (score >= 50) return '#f97316';
    return '#ef4444';
  };

  // Simulate time-based resilience changes
  const getTimeAdjustedScore = (baseScore, year) => {
    const yearDiff = year - 2024;
    const trend = baseScore > 70 ? 1.5 : 0.8; // Better countries improve faster
    const adjustedScore = Math.round(baseScore + (yearDiff * trend));
    return Math.max(0, Math.min(100, adjustedScore));
  };

  // Filter countries based on resilience level
  const filterCountriesByResilience = (countries) => {
    if (resilienceFilter === 'all') return countries;
    
    return Object.entries(countries).reduce((filtered, [name, data]) => {
      const score = getTimeAdjustedScore(data.overallScore, timeSliderValue);
      
      if (resilienceFilter === 'high' && score >= 70) filtered[name] = data;
      else if (resilienceFilter === 'medium' && score >= 50 && score < 70) filtered[name] = data;
      else if (resilienceFilter === 'low' && score < 50) filtered[name] = data;
      
      return filtered;
    }, {});
  };

  // Search countries
  const searchCountries = (term) => {
    if (!term) return countryResilienceData;
    
    const lowerTerm = term.toLowerCase();
    return Object.entries(countryResilienceData).reduce((filtered, [name, data]) => {
      if (name.toLowerCase().includes(lowerTerm)) {
        filtered[name] = data;
      }
      return filtered;
    }, {});
  };

  const addCountryLayers = () => {
    // Apply search and filter
    const searchFiltered = searchCountries(searchTerm);
    const filteredCountries = filterCountriesByResilience(searchFiltered);
    
    // Fetch and add proper GeoJSON layer for countries
    fetch('https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/ne_110m_admin_0_countries.geojson')
      .then(response => response.json())
      .then(geoData => {
        const geoJsonLayer = L.geoJSON(geoData, {
          style: (feature) => {
            // Try multiple property names to match country
            const countryName = feature.properties.NAME || feature.properties.ADMIN || feature.properties.SOVEREIGNT;
            const countryData = findCountryData(countryName);
            
            // Check if country should be shown based on filters
            if (!countryData || !filteredCountries[countryData.name]) {
              return {
                fillColor: '#374151',
                weight: 1,
                opacity: 0.3,
                color: '#6b7280',
                fillOpacity: 0.2
              };
            }
            
            const score = getTimeAdjustedScore(countryData.overallScore, timeSliderValue);
            const color = getResilienceColor(score);
            
            return {
              fillColor: color,
              weight: 2,
              opacity: 1,
              color: 'white',
              fillOpacity: comparisonMode && selectedCountries.find(c => c.name === countryData.name) ? 0.9 : 0.7
            };
          },
          onEachFeature: (feature, layer) => {
            // Try multiple property names to match country
            const countryName = feature.properties.NAME || feature.properties.ADMIN || feature.properties.SOVEREIGNT;
            const countryData = findCountryData(countryName);
            
            if (countryData && filteredCountries[countryData.name]) {
              const adjustedScore = getTimeAdjustedScore(countryData.overallScore, timeSliderValue);
              const popupContent = `
                <div class="${styles.popup}">
                  <h3>${countryData.name}</h3>
                  <div class="${styles.scoreContainer}">
                    <div class="${styles.overallScore}" style="background: ${getResilienceColor(adjustedScore)}">
                      ${adjustedScore}
                    </div>
                    <span>Overall Resilience Score</span>
                    ${timeSliderValue !== 2024 ? `<small>Projected for ${timeSliderValue}</small>` : ''}
                  </div>
                  <div class="${styles.dimensionScores}">
                    <div>Healthcare: ${countryData.dimensions.healthcare}</div>
                    <div>Information: ${countryData.dimensions.information}</div>
                    <div>Social: ${countryData.dimensions.social}</div>
                    <div>Governance: ${countryData.dimensions.governance}</div>
                  </div>
                  <button onclick="window.selectCountry('${countryData.name}')" class="${styles.detailsBtn}">
                    ${comparisonMode ? 'Add to Comparison' : 'View Details'}
                  </button>
                </div>
              `;

              layer.bindPopup(popupContent, {
                maxWidth: 300,
                className: styles.customPopup
              });

              layer.on('click', () => {
                if (comparisonMode) {
                  handleCountrySelection(countryData);
                } else {
                  setSelectedCountry({
                    ...countryData,
                    population: feature.properties.POP_EST,
                    gdp: feature.properties.GDP_MD,
                    region: feature.properties.SUBREGION
                  });
                }
              });

              // Add hover effect
              layer.on('mouseover', function() {
                this.setStyle({
                  weight: 3,
                  color: '#fff',
                  fillOpacity: 0.9
                });
                
                // Show tooltip with basic info
                const tooltip = L.tooltip({
                  permanent: false,
                  direction: 'top',
                  className: styles.hoverTooltip
                }).setContent(`
                  <div style="text-align: center;">
                    <strong>${countryData.name}</strong><br>
                    Score: ${adjustedScore}
                  </div>
                `);
                this.bindTooltip(tooltip).openTooltip();
              });

              layer.on('mouseout', function() {
                geoJsonLayer.resetStyle(this);
                this.closeTooltip();
              });
            }
          }
        });

        geoJsonLayer.addTo(countriesLayerRef.current);
      })
      .catch(error => {
        console.error('Error loading GeoJSON:', error);
        // Fallback to basic country markers if GeoJSON fails
        addCountryMarkers();
      });
  };

  const addPandemicLayers = () => {
    pandemicEvents.forEach(event => {
      // Add origin marker
      const originIcon = L.divIcon({
        className: styles.pandemicMarker,
        html: `<div style="background: ${event.color}; width: 30px; height: 30px; border-radius: 50%; display: flex; align-items: center; justify-content: center; border: 2px solid white; box-shadow: 0 2px 8px rgba(0,0,0,0.3);"><i class="fas fa-virus" style="color: white; font-size: 16px;"></i></div>`,
        iconSize: [30, 30]
      });

      const originMarker = L.marker(event.origin, { icon: originIcon })
        .addTo(pandemicLayerRef.current);

      originMarker.bindPopup(`
        <div class="${styles.popup}">
          <h3>${event.name}</h3>
          <p><strong>Origin:</strong> ${event.originName}</p>
          <p><strong>Period:</strong> ${event.year}</p>
          <p><strong>Type:</strong> ${event.type}</p>
          <p><strong>Affected:</strong> ${event.affected}</p>
          <p><strong>Deaths:</strong> ${event.deaths}</p>
          <p><strong>Resilience Impact:</strong> ${event.resilienceImpact}</p>
        </div>
      `);

      // Add spread lines
      if (event.spread) {
        event.spread.forEach(location => {
          const line = L.polyline([event.origin, [location.lat, location.lng]], {
            color: event.color,
            weight: 2,
            opacity: 0.6,
            dashArray: '5, 10'
          }).addTo(pandemicLayerRef.current);

          // Add spread location marker
          const spreadIcon = L.divIcon({
            className: styles.spreadMarker,
            html: `<div style="background: ${event.color}; width: 15px; height: 15px; border-radius: 50%; border: 2px solid white; opacity: 0.8;"></div>`,
            iconSize: [15, 15]
          });

          const spreadMarker = L.marker([location.lat, location.lng], { icon: spreadIcon })
            .addTo(pandemicLayerRef.current);

          spreadMarker.bindPopup(`
            <div class="${styles.popup}">
              <h4>${location.location}</h4>
              <p><strong>Outbreak:</strong> ${event.name}</p>
              <p><strong>Date:</strong> ${location.date}</p>
            </div>
          `);
        });
      }
    });
  };

  // Helper function to find country data with fuzzy matching
  const findCountryData = (countryName) => {
    if (!countryName) return null;
    
    // Direct match
    if (countryResilienceData[countryName]) {
      return countryResilienceData[countryName];
    }
    
    // Try common variations
    const variations = {
      'United States of America': 'United States',
      'USA': 'United States',
      'UK': 'United Kingdom',
      'Great Britain': 'United Kingdom',
      'Russian Federation': 'Russia',
      'Iran (Islamic Republic of)': 'Iran',
      'Korea, Republic of': 'South Korea',
      'Bolivia (Plurinational State of)': 'Bolivia',
      'Venezuela (Bolivarian Republic of)': 'Venezuela',
      'Vietnam': 'Viet Nam',
      'Czechia': 'Czech Republic'
    };
    
    if (variations[countryName]) {
      return countryResilienceData[variations[countryName]];
    }
    
    // Partial match
    for (const key in countryResilienceData) {
      if (key.toLowerCase().includes(countryName.toLowerCase()) || 
          countryName.toLowerCase().includes(key.toLowerCase())) {
        return countryResilienceData[key];
      }
    }
    
    return null;
  };

  // Fallback function to add basic country markers
  const addCountryMarkers = () => {
    Object.entries(countryResilienceData).forEach(([name, data]) => {
      if (data.coordinates) {
        const color = getResilienceColor(data.overallScore);
        const marker = L.circleMarker(data.coordinates, {
          radius: Math.sqrt(data.population || 50000000) / 2000,
          fillColor: color,
          color: '#ffffff',
          weight: 2,
          opacity: 1,
          fillOpacity: 0.8
        });
        
        marker.bindPopup(`
          <div class="${styles.popup}">
            <h3>${data.name}</h3>
            <div class="${styles.scoreContainer}">
              <div class="${styles.overallScore}" style="background: ${color}">
                ${data.overallScore}
              </div>
              <span>Overall Resilience Score</span>
            </div>
          </div>
        `);
        
        marker.on('click', () => setSelectedCountry(data));
        marker.addTo(countriesLayerRef.current);
      }
    });
  };

  // Make selectCountry available globally for popup button
  useEffect(() => {
    window.selectCountry = (countryName) => {
      const data = findCountryData(countryName);
      if (data) {
        if (comparisonMode) {
          handleCountrySelection(data);
        } else {
          setSelectedCountry(data);
        }
      }
    };
  }, [comparisonMode]);

  // Handle country selection for comparison mode
  const handleCountrySelection = (country) => {
    if (selectedCountries.find(c => c.name === country.name)) {
      setSelectedCountries(selectedCountries.filter(c => c.name !== country.name));
    } else if (selectedCountries.length < 3) {
      setSelectedCountries([...selectedCountries, country]);
    }
  };

  // Create radar chart for country comparison
  const createRadarChart = useCallback(() => {
    if (!radarChartRef.current || selectedCountries.length === 0) return;

    const ctx = radarChartRef.current.getContext('2d');
    
    if (window.radarChart) {
      window.radarChart.destroy();
    }

    const datasets = selectedCountries.map((country, index) => ({
      label: country.name,
      data: Object.values(country.dimensions),
      borderColor: ['#3b82f6', '#10b981', '#f59e0b'][index],
      backgroundColor: ['rgba(59, 130, 246, 0.2)', 'rgba(16, 185, 129, 0.2)', 'rgba(245, 158, 11, 0.2)'][index],
      pointBackgroundColor: ['#3b82f6', '#10b981', '#f59e0b'][index],
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: ['#3b82f6', '#10b981', '#f59e0b'][index]
    }));

    window.radarChart = new Chart(ctx, {
      type: 'radar',
      data: {
        labels: Object.keys(selectedCountries[0].dimensions).map(key => 
          key.charAt(0).toUpperCase() + key.slice(1)
        ),
        datasets
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            labels: {
              color: '#cbd5e1'
            }
          }
        },
        scales: {
          r: {
            angleLines: {
              color: '#334155'
            },
            grid: {
              color: '#334155'
            },
            pointLabels: {
              color: '#cbd5e1'
            },
            ticks: {
              color: '#64748b',
              backdropColor: 'transparent'
            },
            suggestedMin: 0,
            suggestedMax: 100
          }
        }
      }
    });
  }, [selectedCountries]);

  useEffect(() => {
    if (comparisonMode && selectedCountries.length > 0) {
      createRadarChart();
    }
  }, [selectedCountries, comparisonMode, createRadarChart]);

  // Download functionality
  const downloadCountryReport = async (country) => {
    const pdf = new jsPDF();
    
    // Add title
    pdf.setFontSize(20);
    pdf.text(`${country.name} - Pandemic Resilience Report`, 20, 20);
    
    // Add date
    pdf.setFontSize(10);
    pdf.text(`Generated: ${new Date().toLocaleDateString()}`, 20, 30);
    
    // Add overall score
    pdf.setFontSize(16);
    pdf.text(`Overall Resilience Score: ${country.overallScore}/100`, 20, 45);
    
    // Add dimensions
    pdf.setFontSize(14);
    pdf.text('Resilience Dimensions:', 20, 60);
    pdf.setFontSize(12);
    
    let yPos = 70;
    Object.entries(country.dimensions).forEach(([key, value]) => {
      pdf.text(`${key.charAt(0).toUpperCase() + key.slice(1)}: ${value}`, 30, yPos);
      yPos += 10;
    });
    
    // Add key metrics
    pdf.setFontSize(14);
    pdf.text('Key Metrics:', 20, yPos + 10);
    pdf.setFontSize(12);
    yPos += 20;
    
    Object.entries(country.keyMetrics).forEach(([key, value]) => {
      if (yPos > 260) {
        pdf.addPage();
        yPos = 20;
      }
      pdf.text(`${key}: ${value}`, 30, yPos);
      yPos += 10;
    });
    
    // Add strengths and vulnerabilities
    pdf.setFontSize(14);
    pdf.text('Strengths:', 20, yPos + 10);
    pdf.setFontSize(12);
    yPos += 20;
    
    country.strengths.forEach(strength => {
      if (yPos > 260) {
        pdf.addPage();
        yPos = 20;
      }
      pdf.text(`• ${strength}`, 30, yPos);
      yPos += 10;
    });
    
    pdf.setFontSize(14);
    pdf.text('Vulnerabilities:', 20, yPos + 10);
    pdf.setFontSize(12);
    yPos += 20;
    
    country.vulnerabilities.forEach(vuln => {
      if (yPos > 260) {
        pdf.addPage();
        yPos = 20;
      }
      pdf.text(`• ${vuln}`, 30, yPos);
      yPos += 10;
    });
    
    // Save the PDF
    pdf.save(`${country.name}_Resilience_Report.pdf`);
  };

  // Add regional view layers
  const addRegionalLayers = () => {
    const regionalScores = calculateRegionalScores();
    const regionBounds = {
      'North America': [[15, -170], [72, -50]],
      'South America': [[-56, -82], [13, -34]],
      'Europe': [[35, -10], [71, 40]],
      'Asia': [[0, 60], [55, 150]],
      'Africa': [[-35, -20], [37, 52]],
      'Middle East': [[12, 25], [42, 63]],
      'Oceania': [[-47, 110], [-10, 180]],
      'Central America & Caribbean': [[7, -92], [23, -59]]
    };

    Object.entries(regionBounds).forEach(([region, bounds]) => {
      const regionData = regionalScores[region];
      if (regionData) {
        const color = getResilienceColor(regionData.overallScore);
        const rectangle = L.rectangle(bounds, {
          color: 'white',
          fillColor: color,
          fillOpacity: 0.4,
          weight: 2
        });

        rectangle.bindPopup(`
          <div class="${styles.popup}">
            <h3>${region}</h3>
            <div class="${styles.scoreContainer}">
              <div class="${styles.overallScore}" style="background: ${color}">
                ${regionData.overallScore}
              </div>
              <span>Regional Average Score</span>
            </div>
            <p>Countries analyzed: ${regionData.countriesCount}</p>
          </div>
        `);

        rectangle.addTo(countriesLayerRef.current);
      }
    });
  };

  return (
    <div className={styles.container}>
      {/* Top Navigation */}
      <div className={styles.topNav}>
        <div className={styles.navLeft}>
          <button onClick={() => router.back()} className={styles.backButton}>
            <FaArrowLeft /> Back
          </button>
          <div>
            <div className={styles.navTitle}>Pandemic Resilience Deep Dive</div>
            <div className={styles.navSubtitle}>
              The Lancet Commission on US Societal Resilience in a Global Pandemic Age: Lessons for the Present from the Future
            </div>
          </div>
        </div>
        
        <div className={styles.layerControls}>
          <button 
            className={`${styles.layerBtn} ${activeLayer === 'resilience' ? styles.active : ''}`}
            onClick={() => setActiveLayer('resilience')}
          >
            <FaShieldAlt /> Resilience Scores
          </button>
          <button 
            className={`${styles.layerBtn} ${activeLayer === 'outbreaks' ? styles.active : ''}`}
            onClick={() => setActiveLayer('outbreaks')}
          >
            <FaVirus /> Historic Outbreaks
          </button>
          <button 
            className={`${styles.layerBtn} ${activeLayer === 'vulnerabilities' ? styles.active : ''}`}
            onClick={() => setActiveLayer('vulnerabilities')}
          >
            <FaLayerGroup /> Vulnerabilities
          </button>
          <button 
            className={`${styles.layerBtn} ${comparisonMode ? styles.active : ''}`}
            onClick={() => {
              setComparisonMode(!comparisonMode);
              setSelectedCountries([]);
            }}
          >
            <FaExchangeAlt /> Compare
          </button>
          <button 
            className={`${styles.layerBtn} ${showRegionalView ? styles.active : ''}`}
            onClick={() => setShowRegionalView(!showRegionalView)}
          >
            <FaMapMarkedAlt /> Regions
          </button>
          <button 
            className={`${styles.layerBtn} ${showLandscapeTopics ? styles.active : ''}`}
            onClick={() => setShowLandscapeTopics(!showLandscapeTopics)}
          >
            <FaChartBar /> Landscape Topics
          </button>
        </div>
      </div>

      {/* Map Container */}
      <div className={styles.mapContainer}>
        <div ref={mapRef} id="resilienceMap" className={styles.map}></div>
        
        {/* Search and Filter Controls */}
        <div className={styles.mapControls}>
          <div className={styles.searchContainer}>
            <FaSearch className={styles.searchIcon} />
            <input
              type="text"
              placeholder="Search countries..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={styles.searchInput}
            />
          </div>
          
          <div className={styles.filterContainer}>
            <FaFilter className={styles.filterIcon} />
            <select
              value={resilienceFilter}
              onChange={(e) => setResilienceFilter(e.target.value)}
              className={styles.filterSelect}
            >
              <option value="all">All Resilience Levels</option>
              <option value="high">High (70+)</option>
              <option value="medium">Medium (50-69)</option>
              <option value="low">Low (&lt;50)</option>
            </select>
          </div>
        </div>

        {/* Time Slider */}
        {activeLayer === 'resilience' && (
          <div className={styles.timeSlider}>
            <div className={styles.timeSliderLabel}>
              <FaClock /> Time Projection: {timeSliderValue}
            </div>
            <input
              type="range"
              min="2020"
              max="2030"
              value={timeSliderValue}
              onChange={(e) => setTimeSliderValue(parseInt(e.target.value))}
              className={styles.slider}
            />
            <div className={styles.timeLabels}>
              <span>2020</span>
              <span>2025</span>
              <span>2030</span>
            </div>
          </div>
        )}

        {/* Comparison Mode Banner */}
        {comparisonMode && (
          <div className={styles.comparisonBanner}>
            <div className={styles.comparisonText}>
              Comparison Mode: Click countries to compare (max 3)
            </div>
            <div className={styles.selectedCountriesCount}>
              Selected: {selectedCountries.length}/3
            </div>
          </div>
        )}
        
        {/* Map Legend */}
        <div className={styles.mapLegend}>
          <div className={styles.legendTitle}>
            {activeLayer === 'resilience' ? 'Resilience Score' : 'Outbreak Severity'}
          </div>
          {activeLayer === 'resilience' ? (
            <>
              <div className={styles.legendItem}>
                <div className={styles.legendColor} style={{ background: '#10b981' }}></div>
                <span>80-100 (Very High)</span>
              </div>
              <div className={styles.legendItem}>
                <div className={styles.legendColor} style={{ background: '#3b82f6' }}></div>
                <span>70-79 (High)</span>
              </div>
              <div className={styles.legendItem}>
                <div className={styles.legendColor} style={{ background: '#f59e0b' }}></div>
                <span>60-69 (Moderate)</span>
              </div>
              <div className={styles.legendItem}>
                <div className={styles.legendColor} style={{ background: '#f97316' }}></div>
                <span>50-59 (Low)</span>
              </div>
              <div className={styles.legendItem}>
                <div className={styles.legendColor} style={{ background: '#ef4444' }}></div>
                <span>&lt;50 (Very Low)</span>
              </div>
            </>
          ) : (
            <>
              <div className={styles.legendItem}>
                <div className={styles.legendColor} style={{ background: '#dc2626' }}></div>
                <span>Pandemic</span>
              </div>
              <div className={styles.legendItem}>
                <div className={styles.legendColor} style={{ background: '#f59e0b' }}></div>
                <span>Epidemic</span>
              </div>
              <div className={styles.legendItem}>
                <div className={styles.legendColor} style={{ background: '#8b5cf6' }}></div>
                <span>Regional</span>
              </div>
            </>
          )}
        </div>

        {/* Quick Stats */}
        <div className={styles.quickStats}>
          <div className={styles.statItem}>
            <FaGlobe />
            <div>
              <div className={styles.statValue}>{mapStats.countriesAnalyzed}</div>
              <div className={styles.statLabel}>Countries Analyzed</div>
            </div>
          </div>
          <div className={styles.statItem}>
            <FaChartBar />
            <div>
              <div className={styles.statValue}>{mapStats.avgResilience}</div>
              <div className={styles.statLabel}>Avg Resilience</div>
            </div>
          </div>
          <div className={styles.statItem}>
            <FaInfo />
            <div>
              <div className={styles.statValue}>{mapStats.highRiskCountries}</div>
              <div className={styles.statLabel}>High Risk</div>
            </div>
          </div>
        </div>

        {/* Featured Countries */}
        <div className={styles.featuredCountries}>
          <div className={styles.featuredTitle}>
            <FaStar /> Featured Countries
          </div>
          <div className={styles.featuredList}>
            {featuredCountries.slice(0, 3).map((country, index) => (
              <div
                key={country.name}
                className={styles.featuredItem}
                onClick={() => setSelectedCountry(country)}
              >
                <div className={styles.featuredRank}>#{index + 1}</div>
                <div className={styles.featuredInfo}>
                  <div className={styles.featuredName}>{country.name}</div>
                  <div className={styles.featuredScore}>{country.overallScore}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Data Panel */}
      <div className={styles.dataPanel}>
        <div className={styles.dataContent}>
          {showLandscapeTopics ? (
            <LandscapeTopicsVisualization />
          ) : comparisonMode && selectedCountries.length > 0 ? (
            <>
              <div className={styles.comparisonHeader}>
                <h2>Country Comparison</h2>
                <button
                  className={styles.clearButton}
                  onClick={() => setSelectedCountries([])}
                >
                  Clear All
                </button>
              </div>
              
              <div className={styles.comparisonContent}>
                {/* Radar Chart */}
                <div className={styles.radarChartContainer}>
                  <h3>Resilience Dimensions Comparison</h3>
                  <canvas ref={radarChartRef} className={styles.radarChart}></canvas>
                </div>

                {/* Country Cards Comparison */}
                <div className={styles.comparisonCards}>
                  {selectedCountries.map((country, index) => (
                    <div key={country.name} className={styles.comparisonCard}>
                      <div className={styles.comparisonCountryHeader}>
                        <h3>{country.name}</h3>
                        <button
                          className={styles.removeCountryBtn}
                          onClick={() => setSelectedCountries(
                            selectedCountries.filter(c => c.name !== country.name)
                          )}
                        >
                          ×
                        </button>
                      </div>
                      
                      <div className={styles.comparisonScore}>
                        <div 
                          className={styles.comparisonScoreValue}
                          style={{ background: getResilienceColor(country.overallScore) }}
                        >
                          {country.overallScore}
                        </div>
                      </div>
                      
                      <div className={styles.comparisonDimensions}>
                        {Object.entries(country.dimensions).map(([key, value]) => (
                          <div key={key} className={styles.comparisonDimensionRow}>
                            <span>{key.charAt(0).toUpperCase() + key.slice(1)}</span>
                            <span>{value}</span>
                          </div>
                        ))}
                      </div>

                      <button
                        className={styles.downloadBtn}
                        onClick={() => downloadCountryReport(country)}
                      >
                        <FaDownload /> Download Report
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </>
          ) : selectedCountry ? (
            <>
              <div className={styles.countryHeader}>
                <h2>{selectedCountry.name} - Pandemic Resilience Profile</h2>
                <button
                  className={styles.downloadBtn}
                  onClick={() => downloadCountryReport(selectedCountry)}
                >
                  <FaDownload /> Download Report
                </button>
              </div>
              
              <div className={styles.countryGrid}>
                {/* Overall Score Card */}
                <div className={styles.scoreCard}>
                  <h3>Overall Resilience Score</h3>
                  <div 
                    className={styles.bigScore}
                    style={{ color: getResilienceColor(selectedCountry.overallScore) }}
                  >
                    {getTimeAdjustedScore(selectedCountry.overallScore, timeSliderValue)}
                  </div>
                  <div className={styles.scoreLabel}>out of 100</div>
                  {timeSliderValue !== 2024 && (
                    <div className={styles.projectionNote}>
                      Projected for {timeSliderValue}
                    </div>
                  )}
                </div>

                {/* Mini Radar Chart */}
                <div className={styles.miniRadarCard}>
                  <h3>Dimension Overview</h3>
                  <div className={styles.miniRadarContainer}>
                    <svg className={styles.miniRadar} viewBox="0 0 200 200">
                      {/* Create a simple radar chart with SVG */}
                      {Object.entries(selectedCountry.dimensions).map(([key, value], index) => {
                        const angle = (index * 2 * Math.PI) / Object.keys(selectedCountry.dimensions).length;
                        const radius = (value / 100) * 80;
                        const x = 100 + radius * Math.cos(angle - Math.PI / 2);
                        const y = 100 + radius * Math.sin(angle - Math.PI / 2);
                        return (
                          <g key={key}>
                            <circle
                              cx={x}
                              cy={y}
                              r="3"
                              fill={getResilienceColor(value)}
                            />
                            <text
                              x={100 + 90 * Math.cos(angle - Math.PI / 2)}
                              y={100 + 90 * Math.sin(angle - Math.PI / 2)}
                              textAnchor="middle"
                              fontSize="10"
                              fill="#cbd5e1"
                            >
                              {key.charAt(0).toUpperCase()}
                            </text>
                          </g>
                        );
                      })}
                      {/* Grid circles */}
                      <circle cx="100" cy="100" r="20" fill="none" stroke="#334155" strokeWidth="1" />
                      <circle cx="100" cy="100" r="40" fill="none" stroke="#334155" strokeWidth="1" />
                      <circle cx="100" cy="100" r="60" fill="none" stroke="#334155" strokeWidth="1" />
                      <circle cx="100" cy="100" r="80" fill="none" stroke="#334155" strokeWidth="1" />
                    </svg>
                  </div>
                </div>

                {/* Dimension Scores */}
                <div className={styles.dimensionCard}>
                  <h3>Resilience Dimensions</h3>
                  {Object.entries(selectedCountry.dimensions).map(([key, value]) => (
                    <div key={key} className={styles.dimensionRow}>
                      <span className={styles.dimensionName}>
                        {key.charAt(0).toUpperCase() + key.slice(1)}
                      </span>
                      <div className={styles.dimensionBar}>
                        <div 
                          className={styles.dimensionFill}
                          style={{ 
                            width: `${value}%`,
                            background: getResilienceColor(value)
                          }}
                        ></div>
                      </div>
                      <span className={styles.dimensionValue}>{value}</span>
                    </div>
                  ))}
                </div>

                {/* Key Metrics */}
                <div className={styles.metricsCard}>
                  <h3>Key Metrics</h3>
                  {Object.entries(selectedCountry.keyMetrics).map(([key, value]) => (
                    <div key={key} className={styles.metricRow}>
                      <span className={styles.metricName}>{key}</span>
                      <span className={styles.metricValue}>{value}</span>
                    </div>
                  ))}
                </div>

                {/* Strengths & Vulnerabilities */}
                <div className={styles.analysisCard}>
                  <div className={styles.strengthsSection}>
                    <h4>Strengths</h4>
                    <ul>
                      {selectedCountry.strengths.map((strength, i) => (
                        <li key={i}>{strength}</li>
                      ))}
                    </ul>
                  </div>
                  <div className={styles.vulnerabilitiesSection}>
                    <h4>Vulnerabilities</h4>
                    <ul>
                      {selectedCountry.vulnerabilities.map((vuln, i) => (
                        <li key={i}>{vuln}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <>
              <h2>Global Pandemic Resilience Overview</h2>
              
              <div className={styles.overviewGrid}>
                {/* Global Statistics */}
                <div className={styles.globalStatsCard}>
                  <h3>Global Resilience Statistics</h3>
                  <div className={styles.statsGrid}>
                    <div className={styles.statCard}>
                      <div className={styles.statValue}>{mapStats.countriesAnalyzed}</div>
                      <div className={styles.statLabel}>Countries Analyzed</div>
                    </div>
                    <div className={styles.statCard}>
                      <div className={styles.statValue}>{mapStats.avgResilience}</div>
                      <div className={styles.statLabel}>Average Resilience Score</div>
                    </div>
                    <div className={styles.statCard}>
                      <div className={styles.statValue}>{mapStats.highRiskCountries}</div>
                      <div className={styles.statLabel}>High Risk Countries</div>
                    </div>
                    <div className={styles.statCard}>
                      <div className={styles.statValue}>{pandemicEvents.length}</div>
                      <div className={styles.statLabel}>Major Outbreaks Tracked</div>
                    </div>
                  </div>
                </div>

                {/* Recent Pandemic Events */}
                <div className={styles.eventsCard}>
                  <h3>Recent Pandemic Events</h3>
                  <div className={styles.eventsList}>
                    {pandemicEvents.slice(0, 4).map((event, i) => (
                      <div key={i} className={styles.eventItem}>
                        <div 
                          className={styles.eventIndicator}
                          style={{ background: event.color }}
                        ></div>
                        <div className={styles.eventDetails}>
                          <h4>{event.name}</h4>
                          <p>{event.year} • {event.affected}</p>
                          <p className={styles.eventImpact}>{event.resilienceImpact}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Key Insights */}
                <div className={styles.insightsCard}>
                  <h3>Key Resilience Insights</h3>
                  <ul className={styles.insightsList}>
                    <li>Healthcare infrastructure remains the strongest predictor of pandemic resilience</li>
                    <li>Information system trust significantly impacts public health compliance</li>
                    <li>Social cohesion and community networks provide critical support during crises</li>
                    <li>Economic resilience enables sustained public health measures</li>
                    <li>Environmental health factors increasingly influence disease emergence</li>
                  </ul>
                </div>

                {/* Call to Action */}
                <div className={styles.ctaCard}>
                  <h3>Explore More</h3>
                  <p>Click on any country to view detailed resilience profiles</p>
                  <p>Toggle layers to explore different aspects of pandemic preparedness</p>
                  <button 
                    className={styles.ctaButton}
                    onClick={() => setShowLandscapeTopics(true)}
                  >
                    View Landscape Topics Analysis
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}