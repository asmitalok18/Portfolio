// import React, { useState, useEffect } from 'react';
// import { Container, Row, Col, Card, Button, Badge } from 'react-bootstrap';
// import { FaGithub, FaExternalLinkAlt, FaCode, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
// import '../styles/custom.css'

// const Projects = () => {
//   const [currentPage, setCurrentPage] = useState(0);
//   const [isAutoPlay, setIsAutoPlay] = useState(true);
//   const projectsPerPage = 3;

//   const projects = [
//     {
//       title: "Blog Project",
//       description: "Built a full-stack blog app with Django REST and React, featuring JWT auth, role-based access, and scalable CRUD APIs. Integrated paginated blog cards, dynamic routing, voice-to-text blog creation, and a user-specific comment system.",
//       image: "/blog_app_image.png",
//       technologies: ["React", "Python", "Django", "MySQL", "JWT","Tailwind css"],
//       github: "https://github.com/yourusername/ecommerce",
//       live: "https://your-ecommerce-demo.vercel.app",
//     //   featured: true
//     },
//     {
//       title: "Portfolio Website",
//       description: "Developed a fully responsive portfolio website using React and Bootstrap, showcasing smooth scroll animations, modern UI design, and optimized performance across devices to highlight personal projects and skills.",
//       image: "/portfolio.png",
//       technologies: ["React", "Bootstrap", "AOS", "CSS3","Javascript"],
//       github: "https://github.com/yourusername/portfolio",
//       live: "https://your-portfolio.vercel.app",
//       featured: false
//     },
//     {
//       title: "Cricket Website",
//       description: "Developed a multi-page web app using IPL 2022 data with features like match winner prediction, team creation (Create XI), match highlights, and a user-friendly toggle switch for theme control.",
//       image: "/cricket_website.png",
//       technologies: ["React", "Material-UI","Javascript","Local Storage","Framer Motion","API"],
//       github: "https://github.com/asmitalok18/Cricket-website",
//       live: "https://cricket-website-five.vercel.app/",
//       featured: false
//     },
//     {
//       title: "PlayTube",
//       description: "Implemented secure authentication using JWT with access/refresh tokens and encrypted passwords. Integrated MongoDB via Mongoose for efficient data handling, and built custom middleware for auth, authorization, and secure file uploads.",
//       image: "/playtube.png",
//       technologies: [ "Node.js", "MongoDB","JWT","Mongoose","Express.js","Access & Refresh Tokens","Middleware","Multer"],
//       github: "https://github.com/asmitalok18/playTube",
//     //   live: "https://your-taskmanager.vercel.app",
//     //   featured: true
//     },
//     {
//       title: "EDUCATOR",
//       description: "Built a learning platform to help students explore multiple technologies, featuring a custom landing page and responsive design using CSS media queries for enhanced user experience.",
//       image: "/educator.png",
//       technologies: ["javascript","HTML","CSS"],
//       github: "https://github.com/asmitalok18/Educator",
//       live: "https://educatorweb.vercel.app/",
//       featured: false
//     },
//     {
//       title: "Student Report Management System",
//       description: "Built a C++ record management system with CRUD operations, linked list-based data storage, a percentage-based grading feature, and a user-friendly menu-driven interface for smooth navigation.",
//       image: "/student_management.jpg",
//       technologies: ["C++","Data Structure","OOPS"],
//       github: "https://github.com/yourusername/chatapp",
//       live: "https://your-chatapp.vercel.app",
//       featured: false
//     }
//   ];

//   const totalPages = Math.ceil(projects.length / projectsPerPage);

//   // Auto-play functionality
//   useEffect(() => {
//     if (!isAutoPlay) return;
    
//     const interval = setInterval(() => {
//       setCurrentPage((prevPage) => (prevPage + 1) % totalPages);
//     }, 4000); // Change page every 4 seconds

//     return () => clearInterval(interval);
//   }, [isAutoPlay, totalPages]);

//   // Get current projects to display
//   const getCurrentProjects = () => {
//     const startIndex = currentPage * projectsPerPage;
//     return projects.slice(startIndex, startIndex + projectsPerPage);
//   };

//   const handlePageChange = (pageIndex) => {
//     setCurrentPage(pageIndex);
//     setIsAutoPlay(false); // Stop auto-play when user manually changes page
//     setTimeout(() => setIsAutoPlay(true), 10000); // Resume auto-play after 10 seconds
//   };

//   const handlePrevPage = () => {
//     const prevPage = currentPage === 0 ? totalPages - 1 : currentPage - 1;
//     handlePageChange(prevPage);
//   };

//   const handleNextPage = () => {
//     const nextPage = (currentPage + 1) % totalPages;
//     handlePageChange(nextPage);
//   };

//   return (
//     <section id="projects" className="section-padding">
//       <Container>
//         <Row>
//           <Col lg={12} className="text-center mb-5">
//             <h2 className="section-title text-light-custom" data-aos="fade-up">
//               Featured Projects
//             </h2>
//             <p className="text-gray lead" data-aos="fade-up" data-aos-delay="200">
//               Here are some of my recent projects that showcase my skills and experience
//             </p>
//           </Col>
//         </Row>
        
//         {/* Projects Grid */}
//         <Row className="min-height-projects">
//           {getCurrentProjects().map((project, index) => (
//             <Col lg={4} md={6} className="mb-5" key={currentPage * projectsPerPage + index}>
//               <Card 
//                 className="card-custom h-100 overflow-hidden"
//                 data-aos="fade-up"
//                 data-aos-delay={index * 100}
//               >
//                 <div className="position-relative overflow-hidden">
//                   <img 
//                     src={project.image} 
//                     alt={project.title}
//                     className="card-img-top project-image"
//                     style={{ 
//                       height: '250px', 
//                       width: '100%',
//                       objectFit: 'cover',
//                       objectPosition: 'center',
//                       transition: 'transform 0.3s ease'
//                     }}
//                     onMouseOver={(e) => e.target.style.transform = 'scale(1.05)'}
//                     onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
//                   />
//                   {project.featured && (
//                     <Badge 
//                       bg="primary" 
//                       className="position-absolute top-0 start-0 m-3"
//                       style={{ backgroundColor: 'var(--primary-color)', color: 'var(--dark-bg)' }}
//                     >
//                       Featured
//                     </Badge>
//                   )}
//                   <div className="position-absolute top-0 end-0 m-3">
//                     <FaCode className="text-primary-custom fs-4" />
//                   </div>
//                 </div>
                
//                 <Card.Body className="d-flex flex-column">
//                   <h5 className="text-light-custom mb-3">{project.title}</h5>
//                   <p className="text-gray mb-4 flex-grow-1">{project.description}</p>
                  
//                   <div className="mb-4">
//                     <div className="d-flex flex-wrap gap-2">
//                       {project.technologies.map((tech, idx) => (
//                         <Badge 
//                           key={idx}
//                           bg="secondary"
//                           className="bg-opacity-25"
//                           style={{ 
//                             backgroundColor: 'rgba(0, 255, 136, 0.2)',
//                             color: 'var(--primary-color)',
//                             border: '1px solid rgba(0, 255, 136, 0.3)'
//                           }}
//                         >
//                           {tech}
//                         </Badge>
//                       ))}
//                     </div>
//                   </div>
                  
//                   <div className="d-flex gap-3">
//                     <Button 
//                       href={project.github}
//                       target="_blank"
//                       className="btn-outline-custom flex-grow-1"
//                       size="sm"
//                     >
//                       <FaGithub className="me-2" />
//                       Code
//                     </Button>
//                     {project.live && (
//                       <Button 
//                         href={project.live}
//                         target="_blank"
//                         className="btn-primary-custom flex-grow-1"
//                         size="sm"
//                       >
//                         <FaExternalLinkAlt className="me-2" />
//                         Live
//                       </Button>
//                     )}
//                   </div>
//                 </Card.Body>
//               </Card>
//             </Col>
//           ))}
//         </Row>
        
//         {/* Pagination Controls */}
//         {totalPages > 1 && (
//           <Row>
//             <Col lg={12} className="text-center">
//               <div className="pagination-controls d-flex align-items-center justify-content-center gap-3 mb-4">
//                 {/* Previous Button */}
//                 <Button
//                   onClick={handlePrevPage}
//                   className="btn-outline-custom btn-pagination"
//                   size="sm"
//                   style={{ 
//                     width: '40px', 
//                     height: '40px',
//                     borderRadius: '50%',
//                     display: 'flex',
//                     alignItems: 'center',
//                     justifyContent: 'center'
//                   }}
//                 >
//                   <FaChevronLeft />
//                 </Button>

//                 {/* Page Indicators */}
//                 <div className="d-flex gap-2">
//                   {Array.from({ length: totalPages }, (_, index) => (
//                     <button
//                       key={index}
//                       onClick={() => handlePageChange(index)}
//                       className={`page-indicator ${currentPage === index ? 'active' : ''}`}
//                       style={{
//                         width: '12px',
//                         height: '12px',
//                         borderRadius: '50%',
//                         border: 'none',
//                         backgroundColor: currentPage === index 
//                           ? 'var(--primary-color)' 
//                           : 'rgba(255, 255, 255, 0.3)',
//                         cursor: 'pointer',
//                         transition: 'all 0.3s ease',
//                         transform: currentPage === index ? 'scale(1.2)' : 'scale(1)'
//                       }}
//                       onMouseOver={(e) => {
//                         if (currentPage !== index) {
//                           e.target.style.backgroundColor = 'rgba(0, 255, 136, 0.6)';
//                         }
//                       }}
//                       onMouseOut={(e) => {
//                         if (currentPage !== index) {
//                           e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.3)';
//                         }
//                       }}
//                     />
//                   ))}
//                 </div>

//                 {/* Next Button */}
//                 <Button
//                   onClick={handleNextPage}
//                   className="btn-outline-custom btn-pagination"
//                   size="sm"
//                   style={{ 
//                     width: '40px', 
//                     height: '40px',
//                     borderRadius: '50%',
//                     display: 'flex',
//                     alignItems: 'center',
//                     justifyContent: 'center'
//                   }}
//                 >
//                   <FaChevronRight />
//                 </Button>
//               </div>

//               {/* Auto-play indicator */}
//               <div className="text-center mb-3">
//                 {/* <small className="text-gray">
//                   {isAutoPlay ? 'Auto-playing...' : 'Auto-play paused'}
//                 </small> */}
//               </div>
//             </Col>
//           </Row>
//         )}
        
//         <Row>
//           <Col lg={12} className="text-center">
//             <Button 
//               href="https://github.com/asmitalok18"
//               target="_blank"
//               className="btn-outline-custom"
//               size="lg"
//               data-aos="fade-up"
//             >
//               <FaGithub className="me-2" />
//               View All Projects on GitHub
//             </Button>
//           </Col>
//         </Row>
//       </Container>

//       <style jsx>{`
//         .min-height-projects {
//           min-height: 600px;
//         }
        
//         .page-indicator {
//           box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
//         }
        
//         .page-indicator.active {
//           box-shadow: 0 0 10px var(--primary-color);
//         }
        
//         .btn-pagination {
//           box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
//         }
        
//         .pagination-controls {
//           animation: fadeIn 0.5s ease-in-out;
//         }
        
//         @keyframes fadeIn {
//           from { opacity: 0; transform: translateY(10px); }
//           to { opacity: 1; transform: translateY(0); }
//         }
//       `}</style>
//     </section>
//   );
// };

// export default Projects;

import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Badge } from 'react-bootstrap';
import { FaGithub, FaExternalLinkAlt, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import '../styles/custom.css'

const Projects = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(true);
  const projectsPerPage = 3;

  const projects = [
    {
      title: "Blog Project",
      description: "Built a full-stack blog app with Django REST and React, featuring JWT auth, role-based access, and scalable CRUD APIs. Integrated paginated blog cards, dynamic routing, voice-to-text blog creation, and a user-specific comment system.",
      image: "/blog_app_image.png",
      technologies: ["React", "Python", "Django", "MySQL", "JWT","Tailwind css"],
      github: "https://github.com/yourusername/ecommerce",
      live: "https://your-ecommerce-demo.vercel.app",
    //   featured: true
    },
    {
      title: "Portfolio Website",
      description: "Developed a fully responsive portfolio website using React and Bootstrap, showcasing smooth scroll animations, modern UI design, and optimized performance across devices to highlight personal projects and skills.",
      image: "/portfolio.png",
      technologies: ["React", "Bootstrap", "AOS", "CSS3","Javascript"],
      github: "https://github.com/yourusername/portfolio",
      live: "https://your-portfolio.vercel.app",
      featured: false
    },
    {
      title: "Cricket Website",
      description: "Developed a multi-page web app using IPL 2022 data with features like match winner prediction, team creation (Create XI), match highlights, and a user-friendly toggle switch for theme control.",
      image: "/cricket_website.png",
      technologies: ["React", "Material-UI","Javascript","Local Storage","Framer Motion","API"],
      github: "https://github.com/asmitalok18/Cricket-website",
      live: "https://cricket-website-five.vercel.app/",
      featured: false
    },
    {
      title: "PlayTube",
      description: "Implemented secure authentication using JWT with access/refresh tokens and encrypted passwords. Integrated MongoDB via Mongoose for efficient data handling, and built custom middleware for auth, authorization, and secure file uploads.",
      image: "/playtube.png",
      technologies: [ "Node.js", "MongoDB","JWT","Mongoose","Express.js","Access & Refresh Tokens","Middleware","Multer"],
      github: "https://github.com/asmitalok18/playTube",
    //   live: "https://your-taskmanager.vercel.app",
    //   featured: true
    },
    {
      title: "EDUCATOR",
      description: "Built a learning platform to help students explore multiple technologies, featuring a custom landing page and responsive design using CSS media queries for enhanced user experience.",
      image: "/educator.png",
      technologies: ["javascript","HTML","CSS"],
      github: "https://github.com/asmitalok18/Educator",
      live: "https://educatorweb.vercel.app/",
      featured: false
    },
    {
      title: "Student Report Management System",
      description: "Built a C++ record management system with CRUD operations, linked list-based data storage, a percentage-based grading feature, and a user-friendly menu-driven interface for smooth navigation.",
      image: "/student_management.jpg",
      technologies: ["C++","Data Structure","OOPS"],
      github: "https://github.com/yourusername/chatapp",
      live: "https://your-chatapp.vercel.app",
      featured: false
    }
  ];

  const totalPages = Math.ceil(projects.length / projectsPerPage);

  // Auto-play functionality
  useEffect(() => {
    if (!isAutoPlay) return;
    
    const interval = setInterval(() => {
      setCurrentPage((prev) => (prev + 1) % totalPages);
    }, 4000);

    return () => clearInterval(interval);
  }, [isAutoPlay, totalPages]);

  // Get current projects to display
  const getCurrentProjects = () => {
    const startIndex = currentPage * projectsPerPage;
    return projects.slice(startIndex, startIndex + projectsPerPage);
  };

  const handlePageChange = (pageIndex) => {
    setCurrentPage(pageIndex);
  };

  const handlePrevPage = () => {
    setCurrentPage((prev) => (prev - 1 + totalPages) % totalPages);
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => (prev + 1) % totalPages);
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const cardVariants = {
    hidden: { 
      opacity: 0,
      y: 100,
      scale: 0.8
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    },
    exit: {
      opacity: 0,
      y: -100,
      scale: 0.8,
      transition: {
        duration: 0.4
      }
    }
  };

  const imageVariants = {
    hover: {
      scale: 1.1,
      rotateY: 10,
      transition: {
        duration: 0.3,
        ease: "easeInOut"
      }
    }
  };

  const buttonVariants = {
    hover: {
      scale: 1.05,
      boxShadow: "0 10px 25px rgba(0, 255, 136, 0.4)",
      transition: {
        duration: 0.2
      }
    },
    tap: {
      scale: 0.95
    }
  };

  return (
    <section id="projects" className="section-padding">
      <Container>
        <Row>
          <Col lg={12} className="text-center mb-5">
            <motion.h2 
              className="section-title text-light-custom"
              data-aos="fade-up"
              initial={{ opacity: 0, y: -50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              Featured Projects
            </motion.h2>
            <motion.p 
              className="text-gray-custom fs-5 mb-4"
              data-aos="fade-up"
              data-aos-delay="200"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Showcasing my latest work and technical expertise
            </motion.p>
          </Col>
        </Row>

        {/* Projects Grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPage}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <Row>
              {getCurrentProjects().map((project, index) => (
                <Col lg={4} md={6} className="mb-4" key={`${currentPage}-${index}`}>
                  <motion.div 
                    variants={cardVariants}
                    data-aos="fade-up"
                    data-aos-delay={index * 100}
                  >
                    <Card className="card-custom" style={{ height: '550px' }}>
                      <div className="position-relative overflow-hidden">
                        <motion.img
                          src={project.image}
                          alt={project.title}
                          className="card-img-top project-image"
                          style={{ height: '200px', objectFit: 'cover' }}
                          variants={imageVariants}
                          whileHover="hover"
                        />
                        <motion.div 
                          className="position-absolute top-0 start-0 w-100 h-100 bg-dark"
                          initial={{ opacity: 0 }}
                          whileHover={{ opacity: 0.8 }}
                          transition={{ duration: 0.3 }}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}
                        >
                          <motion.div
                            initial={{ scale: 0 }}
                            whileHover={{ scale: 1 }}
                            transition={{ duration: 0.3, delay: 0.1 }}
                          >
                            <Button variant="outline-light" size="lg">
                              View Project
                            </Button>
                          </motion.div>
                        </motion.div>
                      </div>
                      
                      <Card.Body className="d-flex flex-column" style={{ height: '350px' }}>
                        <motion.h5 
                          className="text-light-custom mb-3"
                          style={{ height: '60px', overflow: 'hidden' }}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.2 }}
                        >
                          {project.title}
                        </motion.h5>
                        
                        <motion.p 
                          className="text-gray-custom mb-3"
                          style={{ 
                            height: '120px', 
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            display: '-webkit-box',
                            WebkitLineClamp: 5,
                            WebkitBoxOrient: 'vertical'
                          }}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.3 }}
                        >
                          {project.description}
                        </motion.p>
                        
                        <motion.div 
                          className="mb-3"
                          style={{ 
                            height: '80px', 
                            overflow: 'hidden'
                          }}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.4 }}
                        >
                          {project.technologies.map((tech, techIndex) => (
                            <motion.span
                              key={techIndex}
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                            >
                              <Badge 
                                bg="outline-primary" 
                                className="badge-custom me-2 mb-2"
                                style={{
                                  backgroundColor: 'rgba(0, 255, 136, 0.1)',
                                  border: '1px solid var(--primary-color)',
                                  color: 'var(--primary-color)',
                                  fontSize: '0.75rem'
                                }}
                              >
                                {tech}
                              </Badge>
                            </motion.span>
                          ))}
                        </motion.div>
                        
                        <motion.div 
                          className="d-flex gap-2 mt-auto"
                          style={{ height: '50px' }}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.5 }}
                        >
                          <motion.div variants={buttonVariants} whileHover="hover" whileTap="tap">
                            <Button
                              href={project.github}
                              target="_blank"
                              className="btn-outline-custom flex-fill"
                            >
                              <FaGithub className="me-2" />
                              Code
                            </Button>
                          </motion.div>
                          
                          {project.live && (
                            <motion.div variants={buttonVariants} whileHover="hover" whileTap="tap">
                              <Button
                                href={project.live}
                                target="_blank"
                                className="btn-primary-custom flex-fill"
                              >
                                <FaExternalLinkAlt className="me-2" />
                                Live
                              </Button>
                            </motion.div>
                          )}
                        </motion.div>
                      </Card.Body>
                    </Card>
                  </motion.div>
                </Col>
              ))}
            </Row>
          </motion.div>
        </AnimatePresence>

        {/* Navigation Controls */}
        <Row className="mt-5">
          <Col lg={12} className="text-center">
            <motion.div 
              className="d-flex justify-content-center align-items-center gap-3"
              data-aos="fade-up"
              data-aos-delay="300"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <motion.button
                className="btn btn-outline-primary"
                onClick={handlePrevPage}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <FaChevronLeft />
              </motion.button>

              {/* Page indicators */}
              <div className="d-flex gap-2">
                {Array.from({ length: totalPages }, (_, index) => (
                  <motion.button
                    key={index}
                    className={`btn ${currentPage === index ? 'btn-primary-custom' : 'btn-outline-secondary'}`}
                    style={{ width: '40px', height: '40px' }}
                    onClick={() => handlePageChange(index)}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    {index + 1}
                  </motion.button>
                ))}
              </div>

              <motion.button
                className="btn btn-outline-primary"
                onClick={handleNextPage}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <FaChevronRight />
              </motion.button>
            </motion.div>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default Projects;