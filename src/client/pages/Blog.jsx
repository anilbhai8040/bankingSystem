import React from 'react';
import { FaBookOpen, FaUserCircle, FaCalendarAlt, FaArrowRight } from 'react-icons/fa';
import './Blog.css';

const Blog = () => {
  const blogPosts = [
    {
      id: 1,
      title: '5 Smart Strategies to Maximize Fixed Deposit Interest Returns in 2026',
      author: 'Financial Advisory Team',
      date: 'Sep 15, 2026',
      category: 'Investments',
      summary: 'Learn how compounding interest at 7.5% p.a. can significantly accelerate your wealth growth with laddering techniques.',
    },
    {
      id: 2,
      title: 'Understanding Digital Banking Security & Virtual Card Protection',
      author: 'Cybersecurity Desk',
      date: 'Sep 10, 2026',
      category: 'Security',
      summary: 'Discover how 3D virtual debit cards prevent online fraud, card cloning, and unauthorized e-commerce charges.',
    },
    {
      id: 3,
      title: 'How Gold Loans Provide Instant Liquidity During Emergency Capital Needs',
      author: 'Credit Department',
      date: 'Sep 05, 2026',
      category: 'Loans',
      summary: 'Explore the benefits of pledging gold ornaments for 8.5% interest loans with instant locker disbursals.',
    },
  ];

  return (
    <div className="blog-container">
      <div className="page-header text-center mb-4">
        <h1 className="page-title"><FaBookOpen /> Financial <span className="gradient-text">Insights & Blog</span></h1>
        <p className="page-subtitle">Expert guides on personal wealth management, banking security, and smart investments.</p>
      </div>

      <div className="blog-grid">
        {blogPosts.map((post) => (
          <div key={post.id} className="glass-card blog-card">
            <div className="blog-card-header">
              <span className="badge badge-purple">{post.category}</span>
              <span className="blog-date"><FaCalendarAlt /> {post.date}</span>
            </div>

            <h2 className="blog-card-title">{post.title}</h2>
            <p className="blog-card-summary">{post.summary}</p>

            <div className="blog-card-footer">
              <span className="blog-author"><FaUserCircle /> {post.author}</span>
              <button className="read-more-btn">Read Article <FaArrowRight /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Blog;
