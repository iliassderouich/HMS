import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Link as ScrollLink } from 'react-scroll';


function Home() {
    const [menushow, setMenuShow] = useState(false);
    const [guideSectionVisible, setGuideSectionVisible] = useState(false);
    const [serviceSectionVisible, setServiceSectionVisible] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            const guideSection = document.getElementById('guide-service');
            const serviceSection = document.getElementById('services');
            
            // Handle the possibility of guideSection and serviceSection being null
            const guideSectionPosition = guideSection?.getBoundingClientRect().top ?? 0;
            const serviceSectionPosition = serviceSection?.getBoundingClientRect().top ?? 0;
            const windowHeight = window.innerHeight;

            // Check if the guide-service section is in the viewport
            if (guideSectionPosition < windowHeight / 2 && guideSectionPosition > -windowHeight / 2) {
                setGuideSectionVisible(true);
            } else {
                setGuideSectionVisible(false);
            }

            if (serviceSectionPosition < windowHeight / 2 && serviceSectionPosition > -windowHeight / 2) {
                setServiceSectionVisible(true);
            } else {
                setServiceSectionVisible(false);
            }
        };

        // Add event listener for scroll
        window.addEventListener('scroll', handleScroll);

        // Clean up event listener on component unmount
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

  return (
    <>

<header className="header" style={{backgroundImage: "url('./images/3.jpg')", backgroundPosition: "center", backgroundSize: "cover"}}>
        <nav className="navbar">
            <div className="container flex">
                <Link to="/" className="navbar-brand">
                    <img src="images/Rodoil-logo.png" alt="site logo" style={{width: "200px", height: "80px"}}/>
                </Link>
                <button type="button" className="navbar-show-btn">
                    <img src="images/ham-menu-icon.png" alt=''/>
                </button>
    
                <div className="navbar-collapse bg-white">
                    <button type="button" className="navbar-hide-btn">
                        <img src="images/close-icon.png" alt=''/>
                    </button>
                    <ul className="navbar-nav">
                        <li className="nav-item">
                            <Link to="/" className="nav-link">Home</Link>
                        </li>
                        <li className="nav-item">
                      <ScrollLink to="about" spy={true} smooth={true} offset={-30}duration={500}>
                      <Link to="#about" className="nav-link">About us</Link>
                           </ScrollLink>

                            
                            
                        </li>
                        <li className="nav-item">
                        <ScrollLink to="services" spy={true} smooth={true} offset={-30}duration={500}>
                            <Link to="#services" className="nav-link">Services</Link>
                        </ScrollLink>
                        </li>
                        <li className="nav-item">
                        <ScrollLink to="guide-service" spy={true} smooth={true} offset={-30}duration={500}>
                            <Link to="#guide-service" className="nav-link">Guide</Link>
                            </ScrollLink>
                        </li>
                        <li className="nav-item">
                        <ScrollLink to="contact" spy={true} smooth={true} offset={-30}duration={500}>
                            <Link to="#contact" className="nav-link">Contact</Link>
                            </ScrollLink>
                        </li>
                        <li className="nav-item">
                            <Link onClick={e=>setMenuShow(!menushow)} className="btn btn-white" id="loginBtn">Login</Link>
                            <div className={menushow?"dropdown-menu show":"dropdown-menu"} id="dropdownMenu">
                                <Link to="/patient-auth" className="dropdown-item">Patient</Link>
                                <Link to="/doctor-auth" className="dropdown-item">Doctor</Link>
                                <Link to="/receptionist-auth" className="dropdown-item">Receptionist</Link>
                            </div>
                        </li>
                        <li className="nav-item">
                            <Link to="/patient-auth?reg=true" className="btn btn-blue">Register</Link>
                        </li>
                    </ul>
                    

                    
                </div> 
            </div>
        </nav>

        <div class= "header-inner text-white text-center">
            <div className= "container grid">
                <div className= "header-inner-left">
                    <h1 style={{fontSize:" 40px"}}>Together Towards<br/> <span>Healthier Tomorrow</span></h1>
                    <p className= "lead">Your Wellness, Our Mission</p>
                    <p className= "text text-md">Good health is key to a happy life. It's not just about our bodies but also our minds and feelings. It lets us enjoy life and reach our goals. At Rodoil Hospital, we're here to help everyone stay healthy and live well.</p>
                
                </div>
                <div className= "header-inner-right">
                    <img src = "images/header1.png" alt=''/>
                </div>
            </div>
        </div>
    </header>
    {/* <!-- end of header --> */}

    <main>
        {/* <!-- about section --> */}
        <section id = "about" className= "about py">
            <div className= "about-inner">
                <div className= "container grid">
                    <div className= "about-left text-center">
                        <div className= "section-head">
                            <h2>About Us</h2>
                            <div className= "border-line"></div>
                        </div>
                        <p className= "text text-lg justify">Rodoil Hospital is a leading healthcare institution dedicated to providing exceptional medical care and personalized attention to our patients. Founded with a commitment to excellence and compassion, we have been serving our community for 25 years. Our team of skilled healthcare professionals is dedicated to delivering high-quality care, utilizing advanced technology and innovative treatments to improve the health and well-being of those we serve.</p>
                    </div>
                    <div className= "about-right flex">
                        <div className= "img">
                            <img src = "images/about-img-off.png" alt=''/>
                        </div>
                    </div>
                </div>
            </div>
        </section>
        {/* <!-- end of about section -->

        <!-- banner one --> */}
        <section id = "banner-one" className= "banner-one text-center">
            <div className= "container text-white">
                <blockquote className= "lead"><i className= "fas fa-quote-left"></i>  It's not coincidence that four of the six letter in health are heal   <i className= "fas fa-quote-right"></i></blockquote>
                <small className= "text text-sm">- Ed Northstrum</small>
            </div>
        </section>
        {/* <!-- end of banner one -->

        <!-- services section --> */}
        <section id = "services" className= "services py">
            <div className= "container">
                <div className="section-head text-center">
                    <p className={`text text-lg service-heading ${serviceSectionVisible? 'show': ''}`}>
                        We offer a diverse range of services</p>
                    <div className="line-art flex">
                        <div></div>
                        <img src="images/4-dots1.png" alt=''/>
                        <div></div>
                    </div>
                </div>
                
                <div className= "services-inner text-center grid">
                    <article className={`service-item ${serviceSectionVisible? 'show': ''}`}>
                        <div className= "icon">
                            <img src = "images/icon4.png" alt=''/>
                        </div>
                        <h3>Primary Care</h3>
                        <p className= "text text-sm">Our primary care practice delivers comprehensive and personalized medical care for all ages. Offering preventive screenings, routine check-ups, and chronic disease management, we collaborate with patients to promote overall health and well-being, supporting them every step of the way.</p>
                    </article>

                    <article className={`service-item ${serviceSectionVisible? 'show': ''}`}>
                        <div className= "icon">
                            <img src = "images/icon1.png" alt=''/>
                        </div>
                        <h3>Surgical Services</h3>
                        <p className= "text text-sm">Highly skilled surgeons offer excellence in surgical care across specialties. With advanced techniques and technology, we provide a comprehensive range of procedures, aiming for optimal outcomes and improved quality of life.</p>
                    </article>

                    <article className={`service-item ${serviceSectionVisible? 'show': ''}`}>
                        <div className= "icon">
                            <img src = "images/icon3.png" alt=''/>
                        </div>
                        <h3>Emergency Services</h3>
                        <p className= "text text-sm">Our 24/7 emergency department provides expert care for urgent medical needs, from minor injuries to life-threatening conditions. Staffed by experienced physicians and nurses, we ensure rapid assessment, treatment, and stabilization for every patient.</p>
                    </article>

                    <article className={`service-item ${serviceSectionVisible? 'show': ''}`}>
                        <div className= "icon">
                            <img src = "images/icon2.png" alt=''/>
                        </div>
                        <h3>Wellness Programs</h3>
                        <p className= "text text-sm">Tailored wellness plans offer educational workshops, fitness regimens, and lifestyle counseling for holistic well-being. Empowering individuals to make positive health choices, our programs provide support for long-term wellness goals and healthier lives.</p>
                    </article>
                </div>
            </div>
        </section>
        {/* <!-- end of services section --> */}

        {/* <!-- guide services section --> */}
        <section id = "guide-service" className={`guide-service py text-center`}>
            <div className= "container">
                <div className= "guide-service-head text-white">
                    <h2>Healthy Lifestyle Guide</h2>
                    <p className= "text text-lg">Get healthy tips and resources</p>
                </div>
                <div className= "guide-service-inner grid">
                    <div className={`guide-service-item bg-white ${guideSectionVisible ? 'show' : ''}`}>
                        <div className= "icon flex">
                            <i className= "fas fa-carrot fa-2x"></i>
                        </div>
                        <h3>Nutrition</h3>
                        <p className= "text text-sm">Balanced nutrition with fruits, veggies, whole grains, lean proteins & healthy fats supports overall health. Portion control & mindful eating aid in weight management and digestion. Hydration and nutritious choices fuel vitality.</p>
                        <Link href = "#" className= "btn btn-blue">Read More</Link>
                    </div>

                    <div className= {`guide-service-item bg-white ${guideSectionVisible ? 'show' : ''}`}>
                        <div className= "icon flex">
                            <i className="fas fa-running fa-2x"></i>
                        </div>
                        <h3>Exercise</h3>
                        <p className= "text text-sm">Regular exercise, including aerobic, strength, and flexibility activities, enhances well-being. Enjoy activities like walking, cycling, swimming, or yoga. Warm up, hydrate, and listen to your body for injury prevention.</p>
                        <Link href = "#" className= "btn btn-blue">Read More</Link>
                    </div>
                    
                    <div className={`guide-service-item bg-white ${guideSectionVisible ? 'show' : ''}`}>
                        <div className= "icon flex">
                            <i className= "fas fa-brain fa-2x"></i>
                        </div>
                        <h3>Mental Health</h3>
                        <p className= "text text-sm">Prioritize mental well-being with self-care like meditation and nature walks. Ensure adequate sleep and set healthy boundaries. Seek support from loved ones or professionals when needed. It's okay to ask for help.</p>
                        <Link href = "#" className= "btn btn-blue">Read More</Link>
                    </div>
                </div>
            </div>
        </section>
        {/* <!-- end of guide services section -->

        <!-- contact section --> */}
        <section id = "contact" className= "contact py">
            <div className= "container grid">
                <div className= "contact-left">
                    <iframe title='google' src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3007.1588713970164!2d29.0024769!3d41.08737530000001!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14cab7aa10f57337%3A0xfe146f71ae3b881f!2sRodoil%20Hospital!5e0!3m2!1sen!2str!4v1713739558162!5m2!1sen!2str" width="600" height="450" style={{border:0}} allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>
                </div>
                <div className= "contact-right text-white text-center">
                    <div className= "contact-head">
                        <h3 className= "lead">Contact Us</h3>
                        <p className= "text text-md">Get in touch with us for any questions, requests, or concerns you may have. We're always ready to assist you!</p>
                    </div>
                    <form>
                        <div className= "form-element">
                            <input type = "text" className= "form-control" placeholder="Your name"/>
                        </div>
                        <div className= "form-element">
                            <input type = "email" className= "form-control" placeholder="Your email"/>
                        </div>
                        <div className= "form-element">
                            <textarea rows = "5" placeholder="Your Message" className= "form-control"></textarea>
                        </div>
                        <button type = "submit" className= "btn btn-white btn-submit">
                            <i className= "fas fa-arrow-right"></i> Send Message
                        </button>
                    </form>
                </div>
            </div>
        </section>
        {/* <!-- end of contact section --> */}
    </main>

    {/* <!-- footer  --> */}
    <footer id = "footer" className= "footer text-center">
        <div className= "container">
            <div className= "footer-inner text-white py grid">
                <div className= "footer-item">
                    <h3 className= "footer-head">about us</h3>
                    <div className= "icon">
                        <img src="images/Rodoil-logo.png" alt="site logo" style={{width: "200px", height: "auto"}}/>                    </div>
                    <p className= "text text-md">Rodoil Hospital, with 25 years of commitment, offers exceptional medical care and personalized attention. Our skilled professionals prioritize high-quality care, utilizing advanced technology and innovative treatments to enhance the health and well-being of our patients.</p>
                    
                </div>

                <div className= "footer-item">
                    <h3 className= "footer-head">tags</h3>
                    <ul className= "tags-list flex">
                        <li>medical care</li>
                        <li>emergency</li>
                        <li>HospitalServices</li>
                        <li>surgery</li>
                        <li>medication</li>
                        <li>Wellness</li>
                        <li>MentalHealth</li>
                    </ul>
                </div>

                <div className= "footer-item">
                    <h3 className= "footer-head">Quick Links</h3>
                    <ul>
                        <li><Link href = "index.html" className= "text-white">Home</Link></li>
                        <li><Link href = "#services" className= "text-white">Our Services</Link></li>
                        <li><Link href = "#guide-service" className= "text-white">Healthy Lifestyle Guide</Link></li>
                    </ul>
                </div>

                <div className= "footer-item">
                    <h3 className= "footer-head">General</h3>
                    <address>
                        Rodoil Hospital <br/>
                        Emniyet Evleri, Bitki Sk. <br/>
                        Kâğıthane/Istanbul <br/>
                        Turkey
                    </address>
                    <ul className= "appointment-info">
                        <li>8:00 AM - 12:00 AM
                           </li><li>
                            <i className= "fas fa-envelope"></i>
                            <span>infos@rodoil.com</span>
                        </li>
                        <li>
                            <i className= "fas fa-phone"></i>
                            <span>+90 000 000 00 00</span>
                        </li>
                    </ul>
                </div>
            </div>

            <div className= "footer-links">
                <ul className= "flex">
                    <li><Link href = "https://www.facebook.com/" className= "text-white flex" target="_blank"> <i className= "fab fa-facebook-f"></i></Link></li>
                    <li><Link href = "https://twitter.com/?lang=en" className= "text-white flex" target="_blank"> <i className= "fab fa-twitter"></i></Link></li>
                    <li><Link href = "https://www.linkedin.com/feed/" className= "text-white flex" target="_blank"> <i className= "fab fa-linkedin"></i></Link></li>
                    <li><Link to="https://www.instagram.com/" className="text-white flex" target="_blank"><i className="fab fa-instagram"></i></Link></li>
                    <li><Link to="https://wa.me/900000000000" className="text-white flex" target="_blank"><i className="fab fa-whatsapp"></i></Link></li>

                </ul>
            </div>
        </div>
    </footer>
    </>
  )
}

export default Home