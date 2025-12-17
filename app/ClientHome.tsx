"use client";

import { useEffect, useState } from "react";
import { 
  Box, Container, Typography, Grid, Chip, IconButton, Button, Card, CardContent, CardMedia, useTheme 
} from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import { FaGithub, FaLinkedin, FaTwitter, FaInstagram, FaEnvelope, FaFileDownload, FaGlobe, FaGraduationCap, FaBook, FaCode } from "react-icons/fa";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, EffectCoverflow, Pagination } from 'swiper/modules';
import { useLocale } from "@/app/context/LocalContext";
import { ScrollObserver } from "@/components/ScrollObserver";

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/effect-coverflow';
import 'swiper/css/pagination';

interface ClientHomeProps {
  projects: any[];
  skills: any[];
  profile: any;
  photos: any[];
  books: any[];
  education: any[];
  certifications: any[];
}

export default function ClientHome({ projects, skills, profile, photos, books, education, certifications }: ClientHomeProps) {
  const { t, locale, toggleLocale } = useLocale();
  const dir = locale === "ar" ? "rtl" : "ltr";
  const theme = useTheme();

  const getLocalized = (item: any, field: string) => {
    // Handle specific array fields like 'bio' differently if needed, 
    // but here we assume we want the string or array as is.
    if (locale === "de" && item[`${field}_de`] && item[`${field}_de`].length > 0) return item[`${field}_de`];
    if (locale === "ar" && item[`${field}_ar`] && item[`${field}_ar`].length > 0) return item[`${field}_ar`];
    return item[field];
  };

  const getBio = () => {
    const bio = getLocalized(profile, 'bio');
    if (Array.isArray(bio)) return bio.join(' ');
    return bio;
  };

  const getTitle = () => {
     // Profile schema has title, title_de, title_ar as strings
     return getLocalized(profile, 'title');
  };

  const getLanguages = () => {
    return profile?.languages?.map((lang: any) => ({
      name: getLocalized(lang, 'name'),
      proficiency: lang.proficiency
    })) || [];
  };

  return (
    <Box className="bg-black text-white min-h-screen font-sans selection:bg-purple-500 selection:text-white" dir={dir}>
      <ScrollObserver />
      
      {/* Floating Language Switcher */}
      <motion.div 
        className="fixed top-6 right-6 z-50"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
         <Button 
            onClick={toggleLocale}
            variant="contained"
            startIcon={<FaGlobe />}
            className="bg-white/10 backdrop-blur-md hover:bg-white/20 text-white rounded-full px-6 py-2"
            sx={{ '& .MuiButton-startIcon': { marginRight: dir === 'rtl' ? 0 : '8px', marginLeft: dir === 'rtl' ? '8px' : 0 } }}
         >
            {locale.toUpperCase()}
         </Button>
      </motion.div>

      {/* Hero Section */}
      <section className="min-h-screen flex items-center justify-center relative overflow-hidden pt-20 pb-10">
         <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-purple-900/40 via-black to-black" />
         
         <Container maxWidth="lg" className="relative z-10">
            <Grid container spacing={8} alignItems="center" direction={dir === 'rtl' ? 'row-reverse' : 'row'}>
               <Grid size={{ xs: 12, md: 6 }} className={dir === 'rtl' ? 'text-right' : 'text-left'}>
                  <motion.div
                     initial={{ opacity: 0, x: -50 }}
                     animate={{ opacity: 1, x: 0 }}
                     transition={{ duration: 0.8 }}
                  >

                     <Typography variant="h2" className="font-bold mb-2 bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent leading-tight">
                        {getLocalized(profile, 'name') || profile?.name || "Sami Kazah"}
                     </Typography>
                     <Typography variant="h4" className="text-gray-200 mb-6 font-light">
                        {getTitle()}
                     </Typography>
                     <Typography className="text-gray-300 mb-8 max-w-lg leading-relaxed text-lg">
                        {getBio()}
                     </Typography>
                     
                     {/* Spoken Languages */}
                     {getLanguages().length > 0 && (
                        <div className="mb-8 flex flex-wrap gap-2">
                           {getLanguages().map((lang: any, i: number) => (
                              <Chip 
                                 key={i} 
                                 icon={<FaGlobe className="text-purple-400" />} 
                                 label={`${lang.name} (${lang.proficiency})`} 
                                 className="bg-gray-800 text-gray-200 border border-gray-700"
                              />
                           ))}
                        </div>
                     )}
                     
                     <div className={`flex ${dir === 'rtl' ? 'flex-row-reverse' : ''} gap-4 flex-wrap`}>
                        {profile?.cvUrl && (
                           <Button 
                              variant="contained" 
                              size="large"
                              href={profile.cvUrl}
                              target="_blank"
                              startIcon={<FaFileDownload />}
                              className="bg-purple-600 hover:bg-purple-700 rounded-full px-8"
                              sx={{ '& .MuiButton-startIcon': { marginRight: dir === 'rtl' ? 0 : '8px', marginLeft: dir === 'rtl' ? '8px' : 0 } }}
                           >
                              {t.resume}
                           </Button>
                        )}
                        <div className={`flex ${dir === 'rtl' ? 'flex-row-reverse' : ''} gap-2`}>
                           {profile?.socialLinks?.github && (
                              <IconButton href={profile.socialLinks.github} target="_blank" style={{ backgroundColor: '#ffffff', color: '#000000' }} className="hover:bg-gray-100 transition-colors border-2 border-white">
                                 <FaGithub size={28} />
                              </IconButton>
                           )}
                           {profile?.socialLinks?.linkedin && (
                              <IconButton href={profile.socialLinks.linkedin} target="_blank" style={{ backgroundColor: '#2563eb', color: '#ffffff' }} className="hover:bg-blue-700 transition-colors border-2 border-blue-600">
                                 <FaLinkedin size={28} />
                              </IconButton>
                           )}
                           {profile?.socialLinks?.twitter && (
                              <IconButton href={profile.socialLinks.twitter} target="_blank" className="bg-[#1DA1F2] text-white hover:bg-[#0c85d0] transition-colors border-2 border-[#1DA1F2]">
                                 <FaTwitter size={28} />
                              </IconButton>
                           )}
                           {profile?.socialLinks?.instagram && (
                              <IconButton href={profile.socialLinks.instagram} target="_blank" className="bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] text-white hover:opacity-90 transition-colors border-2 border-pink-500">
                                 <FaInstagram size={28} />
                              </IconButton>
                           )}
                        </div>
                     </div>
                  </motion.div>
               </Grid>
               
               <Grid size={{ xs: 12, md: 6 }} className="flex justify-center md:justify-end">
                  <motion.div
                     initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
                     animate={{ opacity: 1, scale: 1, rotate: 0 }}
                     transition={{ duration: 0.8 }}
                     className="relative w-80 h-80 md:w-96 md:h-96"
                  >
                     <div className="absolute inset-0 bg-purple-500/20 rounded-full blur-3xl animate-pulse" />
                     <div className="w-full h-full rounded-full border-4 border-white/10 overflow-hidden relative z-10 shadow-2xl">
                        {profile?.avatarUrl ? (
                           <img src={profile.avatarUrl} alt={profile.name} className="w-full h-full object-cover" />
                        ) : (
                           <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                              <span className="text-6xl">👨‍💻</span>
                           </div>
                        )}
                     </div>
                  </motion.div>
               </Grid>
            </Grid>
         </Container>
      </section>

      {/* Skills Section */}
      {skills.length > 0 && (
         <section id="skills" className="py-20 bg-gray-900/50">
            <Container>
               <Typography variant="h3" className="font-bold mb-12 text-center bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">
                  {t.myTechStack || "Skills"}
               </Typography>
               <Grid container spacing={3} justifyContent="center">
                  {skills.map((skill, index) => (
                     <Grid size="auto" key={skill._id}>
                        <motion.div
                           initial={{ opacity: 0, y: 20 }}
                           whileInView={{ opacity: 1, y: 0 }}
                           transition={{ delay: index * 0.05 }}
                           whileHover={{ scale: 1.1 }}
                           className="bg-gray-800 p-4 rounded-xl flex flex-col items-center gap-2 min-w-[120px] border border-gray-700 hover:border-green-500/50 transition-colors"
                        >
                           {skill.icon ? (
                              <img src={skill.icon} alt={skill.name} className="w-10 h-10 object-contain" />
                           ) : (
                              <FaCode size={30} className="text-green-400" />
                           )}
                           <Typography className="font-medium text-gray-200">{getLocalized(skill, 'name') || skill.name}</Typography>
                        </motion.div>
                     </Grid>
                  ))}
               </Grid>
            </Container>
         </section>
      )}

      {/* Projects Section */}
      {projects.length > 0 && (
      <section className="py-20 bg-black">
         <Container>
            <Typography variant="h3" className="font-bold mb-16 text-center bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
               {t.heading2 || "Featured Projects"}
            </Typography>
            <Swiper
               key={dir}
               dir={dir}
               effect={'coverflow'}
               grabCursor={true}
               centeredSlides={true}
               slidesPerView={'auto'}
               coverflowEffect={{
                  rotate: 50,
                  stretch: 0,
                  depth: 100,
                  modifier: 1,
                  slideShadows: true,
               }}
               pagination={true}
               modules={[EffectCoverflow, Pagination, Autoplay]}
               className="w-full py-12"
               autoplay={{ delay: 3000 }}
               breakpoints={{
                  640: { slidesPerView: 2 },
                  1024: { slidesPerView: 3 },
               }}
            >
               {projects.map((project) => (
                  <SwiperSlide key={project._id} className="w-[300px] md:w-[400px] bg-transparent">
                     <div className="bg-gray-900 rounded-2xl overflow-hidden border border-gray-800 hover:border-purple-500/50 transition-all h-full group">
                        <div className="h-48 overflow-hidden relative">
                           {project.imageUrl ? (
                              <img src={project.imageUrl} alt={project.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                           ) : (
                              <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                                 <FaCode size={40} className="text-gray-600" />
                              </div>
                           )}
                           <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                              {project.repoUrl && (
                                 <IconButton href={project.repoUrl} target="_blank" className="bg-white text-black hover:bg-white/90">
                                    <FaGithub />
                                 </IconButton>
                              )}
                              {project.demoUrl && (
                                 <Button
                                    href={project.demoUrl}
                                    target="_blank"
                                    variant="contained"
                                    size="small"
                                    startIcon={<FaGlobe />}
                                    className="bg-purple-600 hover:bg-purple-700 text-white font-bold"
                                    sx={{ '& .MuiButton-startIcon': { marginRight: dir === 'rtl' ? 0 : '8px', marginLeft: dir === 'rtl' ? '8px' : 0 } }}
                                 >
                                    Live Demo
                                 </Button>
                              )}
                           </div>
                        </div>
                        <div className="p-6">
                           <div className="flex justify-between items-start mb-2">
                              <Typography variant="h6" className="font-bold text-white group-hover:text-purple-400 transition-colors">
                                 {getLocalized(project, 'title') || project.title}
                              </Typography>
                              {project.date && (
                                 <span className="text-xs text-white bg-purple-600 px-2 py-1 rounded font-semibold">
                                    {project.date}
                                 </span>
                              )}
                           </div>
                           <Typography className="text-gray-400 mb-4 line-clamp-3">
                              {Array.isArray(getLocalized(project, 'description')) 
                                 ? getLocalized(project, 'description').join(' ') 
                                 : getLocalized(project, 'description') || project.description}
                           </Typography>
                           <div className="flex flex-wrap gap-2">
                              {project.tags && project.tags.map((tag: any, i: number) => (
                                 <Chip key={i} label={typeof tag === 'string' ? tag.trim() : tag} size="small" className="bg-gray-800 text-gray-300" />
                              ))}
                           </div>
                        </div>
                     </div>
                  </SwiperSlide>
               ))}
            </Swiper>
         </Container>
      </section>
      )}

      {/* Education Section */}
      {education.length > 0 && (
         <section className="py-20 bg-gradient-to-b from-black to-gray-900">
            <Container maxWidth="lg">
               <Typography variant="h3" className="font-bold mb-12 text-center bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
                  {t.education || "Education"}
               </Typography>
               <div className="relative border-l-2 border-gray-700 ml-4 md:ml-0 space-y-12">
                  {education.map((edu, index) => (
                     <div key={edu._id} className="relative pl-8 md:pl-12">
                        <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-yellow-500 shadow-lg shadow-yellow-500/50" />
                        <motion.div
                           initial={{ opacity: 0, x: -20 }}
                           whileInView={{ opacity: 1, x: 0 }}
                           transition={{ delay: index * 0.2 }}
                           className="bg-gray-800/50 p-6 rounded-xl border border-gray-700 hover:border-yellow-500/50 transition-all"
                        >
                           <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-2">
                              <Typography variant="h5" className="font-bold text-white">{getLocalized(edu, 'degree') || edu.degree}</Typography>
                              <Chip label={edu.year} className="bg-yellow-500 text-black font-bold mt-2 md:mt-0 w-fit" />
                           </div>
                           <Typography variant="h6" className="text-gray-300 mb-2 flex items-center gap-2">
                              <FaGraduationCap className="text-yellow-500" /> {getLocalized(edu, 'institution') || edu.institution}
                           </Typography>
                           <Typography className="text-gray-400">
                              {getLocalized(edu, "description")}
                           </Typography>
                        </motion.div>
                     </div>
                  ))}
               </div>
            </Container>
         </section>
      )}

       {/* Certifications Section */}
       {certifications && certifications.length > 0 && (
          <section className="py-20 bg-black">
             <Container maxWidth="lg">
                <Typography variant="h3" className="font-bold mb-12 text-center bg-gradient-to-r from-blue-400 to-cyan-500 bg-clip-text text-transparent">
                   {t.certifications || "Certifications"}
                </Typography>
                <Grid container spacing={3}>
                   {certifications.map((cert: any, index: number) => (
                      <Grid size={{ xs: 12, md: 6 }} key={cert._id}>
                         <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            whileHover={{ scale: 1.02 }}
                            className="bg-gray-900 border border-gray-800 p-6 rounded-xl hover:border-blue-500/50 transition-all h-full"
                         >
                            <div className="flex items-start gap-4">
                               <div className="p-3 bg-blue-500/10 rounded-lg">
                                  <FaGraduationCap className="text-blue-400 text-xl" />
                               </div>
                               <div className="flex-1">
                                  <div className="flex justify-between items-start mb-2">
                                     <Typography variant="h6" className="font-bold text-white leading-tight">
                                        {getLocalized(cert, 'name')}
                                     </Typography>
                                     {cert.date && (
                                        <span className="text-xs text-blue-400 bg-blue-500/10 px-2 py-1 rounded border border-blue-500/20 whitespace-nowrap ml-2">
                                           {cert.date}
                                        </span>
                                     )}
                                  </div>
                                  <Typography className="text-gray-400 mb-4 text-sm">
                                     {cert.issuer}
                                  </Typography>
                                  {cert.link && (
                                     <Button 
                                        href={cert.link} 
                                        target="_blank" 
                                        size="small"
                                        variant="outlined" 
                                        className="text-blue-400 border-blue-400 hover:bg-blue-400/10"
                                     >
                                        View Certificate
                                     </Button>
                                  )}
                               </div>
                            </div>
                         </motion.div>
                      </Grid>
                   ))}
                </Grid>
             </Container>
          </section>
       )}

      {/* Books Section */}
      {books.length > 0 && (
         <section className="py-20 bg-gray-900">
            <Container maxWidth="lg">
               <Typography variant="h3" className="font-bold mb-12 text-center bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                  {t.myPublishedBooks || "Publications"}
               </Typography>
               <Grid container spacing={4} justifyContent="center">
                  {books.map((book, index) => (
                     <Grid size={{ xs: 12, sm: 6, md: 4 }} key={book._id}>
                        <motion.div
                           initial={{ opacity: 0, scale: 0.9 }}
                           whileInView={{ opacity: 1, scale: 1 }}
                           whileHover={{ y: -10 }}
                           transition={{ delay: index * 0.1 }}
                           className="bg-black/40 p-4 rounded-xl border border-gray-800 flex flex-col items-center h-full group"
                        >
                           <div className="w-48 h-64 mb-6 shadow-2xl shadow-cyan-500/20 group-hover:shadow-cyan-500/40 transition-all rounded overflow-hidden relative">
                              {book.coverUrl ? (
                                 <img src={book.coverUrl} alt={book.title} className="w-full h-full object-cover" />
                              ) : (
                                 <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                                    <FaBook size={40} className="text-gray-600" />
                                 </div>
                              )}
                           </div>
                           <Typography variant="h6" className="font-bold text-center mb-2 group-hover:text-cyan-400 transition-colors">
                              {getLocalized(book, 'title') || book.title}
                           </Typography>
                            <Typography className="text-gray-300 text-center text-sm mb-4">
                              {getLocalized(book, "description")}
                           </Typography>
                           {book.link && (
                              <Button 
                                 href={book.link} 
                                 target="_blank" 
                                 variant="outlined" 
                                 color="info"
                                 className="mt-auto rounded-full"
                                 sx={{ '& .MuiButton-startIcon': { marginRight: dir === 'rtl' ? 0 : '8px', marginLeft: dir === 'rtl' ? '8px' : 0 } }}
                              >
                                 Read More
                              </Button>
                           )}
                        </motion.div>
                     </Grid>
                  ))}
               </Grid>
            </Container>
         </section>
      )}

      {/* Gallery Section */}
      {photos.length > 0 && (
        <section className="py-20 bg-black">
           <Container>
              <Typography variant="h3" className="font-bold mb-12 text-center text-white">
                 {t.gallery || "Gallery"}
              </Typography>
              <Grid container spacing={2}>
                 {photos.map((photo, i) => (
                    <Grid size={{ xs: 6, md: 4 }} key={photo._id || i}>
                       <motion.div 
                          className="relative aspect-square rounded-lg overflow-hidden group cursor-pointer"
                          whileHover={{ scale: 1.02 }}
                       >
                          <img src={photo.url} alt="Gallery" className="w-full h-full object-cover" />
                          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                             <Typography className="text-white font-bold">{photo.title}</Typography>
                          </div>
                       </motion.div>
                    </Grid>
                 ))}
              </Grid>
           </Container>
        </section>
      )}

      {/* Contact Section */}
      <section className="py-20 bg-gradient-to-t from-gray-900 to-black">
        <Container maxWidth="md" className="text-center">
           <Typography variant="h3" className="font-bold mb-8 bg-gradient-to-r from-gray-200 to-gray-400 bg-clip-text text-transparent">
              {t.contact || "Contact Me"}
           </Typography>
           <Button 
              variant="contained" 
              size="large"
              href={`mailto:samkazah444@gmail.com`}
              startIcon={<FaEnvelope />}
              className="bg-purple-600 hover:bg-purple-700 text-white font-bold px-12 py-4 rounded-full text-lg"
              sx={{ '& .MuiButton-startIcon': { marginRight: dir === 'rtl' ? 0 : '8px', marginLeft: dir === 'rtl' ? '8px' : 0 } }}
           >
              {t.send || "Send Email"}
           </Button>
        </Container>
      </section>

      {/* Footer */}
      <footer className="py-10 bg-black border-t border-gray-900 text-center text-gray-500">
         <Typography>
            © {new Date().getFullYear()} {profile?.name || "Portfolio"}. {t.rights || "All rights reserved."}
         </Typography>
      </footer>
    </Box>
  );
}
