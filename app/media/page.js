'use client';

import { useState } from 'react';
import styles from './media.module.css';

export default function MediaPage() {
  const [activeTab, setActiveTab] = useState('events');
  
  const events = [
    {
      id: 1,
      title: "Lancet Commission on Societal Resilience Launch",
      date: "September 15, 2024",
      location: "London, UK & Virtual",
      description: "The official launch event for the Lancet Commission on Societal Resilience, featuring keynote presentations from commission chairs and panel discussions on key resilience challenges.",
      image: "/images/event-launch.jpg",
      link: "#"
    },
    {
      id: 2,
      title: "Public Health Resilience Workshop",
      date: "October 10, 2024",
      location: "Geneva, Switzerland",
      description: "A collaborative workshop bringing together public health officials, researchers, and community leaders to explore strategies for strengthening health system resilience.",
      image: "/images/event-workshop.jpg",
      link: "#"
    },
    {
      id: 3,
      title: "Community Resilience Symposium",
      date: "November 5-7, 2024",
      location: "Cape Town, South Africa",
      description: "A three-day symposium focused on community-level resilience building, featuring case studies from around the world and practical implementation strategies.",
      image: "/images/event-symposium.jpg",
      link: "#"
    },
    {
      id: 4,
      title: "Digital Innovation for Crisis Response",
      date: "December 12, 2024",
      location: "Virtual",
      description: "An online conference exploring how digital technologies can enhance resilience and crisis response capabilities at local, national, and global levels.",
      image: "/images/event-digital.jpg",
      link: "#"
    }
  ];
  
  const posts = [
    {
      id: 1,
      title: "Beyond Recovery: Building True Resilience After COVID-19",
      author: "Dr. Helena Rodriguez",
      date: "August 31, 2024",
      excerpt: "The pandemic revealed critical weaknesses in our global systems. To build true resilience, we must address the root causes of vulnerability rather than simply returning to 'normal.'",
      image: "/images/blog-resilience.jpg",
      link: "#"
    },
    {
      id: 2,
      title: "Five Key Dimensions of Societal Resilience",
      author: "Prof. James Chen",
      date: "September 5, 2024",
      excerpt: "This article outlines the five interconnected dimensions of societal resilience that form the foundation of the Commission's analytical framework.",
      image: "/images/blog-dimensions.jpg",
      link: "#"
    },
    {
      id: 3,
      title: "Community Voices: Grassroots Perspectives on Resilience",
      author: "Maria Nkosi",
      date: "September 12, 2024",
      excerpt: "Highlighting successful community-led resilience initiatives from around the world and the importance of local knowledge in resilience building.",
      image: "/images/blog-community.jpg",
      link: "#"
    },
    {
      id: 4,
      title: "The Economics of Resilience: Investing in Preparedness",
      author: "Dr. Thomas Weiss",
      date: "September 18, 2024",
      excerpt: "Analysis of the economic case for investing in resilience, showing how preventive measures deliver substantial returns compared to crisis response.",
      image: "/images/blog-economics.jpg",
      link: "#"
    }
  ];
  
  const press = [
    {
      id: 1,
      title: "Lancet Launches Major Commission on Societal Resilience",
      outlet: "Reuters",
      date: "August 31, 2024",
      excerpt: "The prestigious medical journal has assembled a global team of experts to develop frameworks for strengthening societal resilience in the face of future crises.",
      link: "#"
    },
    {
      id: 2,
      title: "After COVID: Can We Build More Resilient Societies?",
      outlet: "BBC World Service",
      date: "September 3, 2024",
      excerpt: "Interview with Commission Co-Chair on lessons learned from the pandemic and the path toward greater societal resilience.",
      link: "#"
    },
    {
      id: 3,
      title: "New Global Initiative Aims to Transform Crisis Response",
      outlet: "Al Jazeera",
      date: "September 7, 2024",
      excerpt: "The Lancet Commission on Societal Resilience seeks to develop a blueprint for communities and nations to better withstand future shocks.",
      link: "#"
    },
    {
      id: 4,
      title: "Experts Warn: Most Countries Still Unprepared for Next Pandemic",
      outlet: "The Guardian",
      date: "September 15, 2024",
      excerpt: "Despite lessons from COVID-19, a new report from the Lancet Commission suggests many nations remain vulnerable to future health crises.",
      link: "#"
    }
  ];

  return (
    <div className={styles.container}>
      <h1>Media & Events</h1>
      <p className={styles.intro}>
        Stay updated with the latest news, events, publications, and press coverage related to the Lancet Commission on Societal Resilience.
      </p>
      
      <div className={styles.tabs}>
        <button 
          className={`${styles.tabButton} ${activeTab === 'events' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('events')}
        >
          Upcoming Events
        </button>
        <button 
          className={`${styles.tabButton} ${activeTab === 'posts' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('posts')}
        >
          Blog Posts
        </button>
        <button 
          className={`${styles.tabButton} ${activeTab === 'press' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('press')}
        >
          Press Coverage
        </button>
      </div>
      
      <div className={styles.tabContent}>
        {activeTab === 'events' && (
          <div className={styles.eventsGrid}>
            {events.map(event => (
              <div key={event.id} className={styles.eventCard}>
                {event.image && (
                  <div className={styles.eventImage}>
                    <img src={event.image} alt={event.title} />
                  </div>
                )}
                <div className={styles.eventContent}>
                  <h2>{event.title}</h2>
                  <div className={styles.eventMeta}>
                    <span className={styles.eventDate}>{event.date}</span>
                    <span className={styles.eventLocation}>{event.location}</span>
                  </div>
                  <p>{event.description}</p>
                  <a href={event.link} className={styles.eventLink}>Learn More</a>
                </div>
              </div>
            ))}
          </div>
        )}
        
        {activeTab === 'posts' && (
          <div className={styles.postsGrid}>
            {posts.map(post => (
              <div key={post.id} className={styles.postCard}>
                {post.image && (
                  <div className={styles.postImage}>
                    <img src={post.image} alt={post.title} />
                  </div>
                )}
                <div className={styles.postContent}>
                  <h2>{post.title}</h2>
                  <div className={styles.postMeta}>
                    <span className={styles.postAuthor}>By {post.author}</span>
                    <span className={styles.postDate}>{post.date}</span>
                  </div>
                  <p>{post.excerpt}</p>
                  <a href={post.link} className={styles.postLink}>Read More</a>
                </div>
              </div>
            ))}
          </div>
        )}
        
        {activeTab === 'press' && (
          <div className={styles.pressList}>
            {press.map(item => (
              <div key={item.id} className={styles.pressItem}>
                <h2>{item.title}</h2>
                <div className={styles.pressMeta}>
                  <span className={styles.pressOutlet}>{item.outlet}</span>
                  <span className={styles.pressDate}>{item.date}</span>
                </div>
                <p>{item.excerpt}</p>
                <a href={item.link} className={styles.pressLink}>Read Original Article</a>
              </div>
            ))}
          </div>
        )}
      </div>
      
      <div className={styles.subscribeBox}>
        <h2>Stay Informed</h2>
        <p>Subscribe to our newsletter to receive updates on events, publications, and opportunities to engage with the Commission's work.</p>
        <form className={styles.subscribeForm}>
          <input type="email" placeholder="Your email address" required />
          <button type="submit">Subscribe</button>
        </form>
      </div>
    </div>
  );
}
