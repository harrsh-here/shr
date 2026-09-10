import React, { useEffect, useRef } from "react";
import classes from "./OrganizerCards.module.css";

import cipherImg from "../../assets/club logos/Arya Cipher Coding Club.jpg";
import musicImg from "../../assets/club logos/Arya Music Club.jpg";
import danceImg from "../../assets/club logos/Arya Dance Club.jpg";
import hackathonImg from "../../assets/club logos/Arya Hackathon Club.jpg";
import photoImg from "../../assets/club logos/Arya PhotoSphere Club.jpg";
import roboticsImg from "../../assets/club logos/Arya Robotics Club.jpg";
import gdgImg from "../../assets/club logos/gdg.png";
import greenEnergyImg from "../../assets/club logos/Arya_Green_Energy.jpg";
import tableTennisImg from "../../assets/club logos/Arya_TableTennis_Club.jpg";
import automationImg from "../../assets/club logos/Arya_Industrial_Automation_Club.jpg";
import basketballImg from "../../assets/club logos/Arya_Basketball_club.jpg";
import cricketImg from "../../assets/club logos/CRICKET_CLUB_LOGO - Vineet Kumar.jpg";
import dramaImg from "../../assets/club logos/Arya_Drama_Club.jpg";
import dronesImg from "../../assets/club logos/Arya_Drones_Club - Jaideep Chouhan.jpeg";
import ecoWarriorsImg from "../../assets/club logos/Arya_Eco_Warrior_Club.jpg";
import esportsImg from "../../assets/club logos/Arya_E-Sports_club.jpeg";
import goKartImg from "../../assets/club logos/GOKART LOGO (1) - Daud Ibrahim.png";
import movieImg from "../../assets/club logos/Arya_Movie_Club.jpg";
import scienceTechnologyImg from "../../assets/club logos/Arya_Science&Technology.png";
import skillDevelopmentImg from "../../assets/club logos/Arya Skill development club - Vaidik Nama.jpg";
import socialActivitiesImg from "../../assets/club logos/Arya Social Activity Club - BaBy Sh.jpg";
import carromImg from "../../assets/club logos/Arya_Carrom_Club.jpg";
import kabaddiImg from "../../assets/club logos/Arya_Kabaddi_Club.jpg";
import lincomImg from "../../assets/club logos/Arya_Lincom_Club.jpg";
import SideAccent from "../common/SideAccent/SideAccent";
import FestivalSprite from "../common/FestivalSprite/FestivalSprite";
import collegeLogo from "../../assets/collegeLogo.png";

// ─── Club list ────────────────────────────────────────────────────────────────
// Every listed club has a supplied logo; unrepresented clubs are intentionally omitted.
const clubs = [
    // ── Priority ────────────────────────────────────────────────────────────

    { name: "Arya Dance Club",                img: danceImg },
    { name: "Arya Music Club",                img: musicImg },
    { name: "Arya Cipher Coding Club",        img: cipherImg },
    { name: "Google Developer Group ACEIT",   img: gdgImg,    bg: "white", logoClass: classes.gdgLogo },
    { name: "Arya Green Energy Club",         img: greenEnergyImg },
    { name: "Arya Table Tennis Club",         img: tableTennisImg },
    // ── Remaining (alphabetical) ─────────────────────────────────────────
    { name: "Arya Automation Club",           img: automationImg },
    { name: "Arya Basketball Club",           img: basketballImg },
    { name: "Arya Carrom Club",               img: carromImg },
    { name: "Arya Cricket Club",              img: cricketImg },
    { name: "Arya Drama Club",                img: dramaImg },
    { name: "Arya Drones Club",               img: dronesImg },
    { name: "Arya Eco Warriors Club",         img: ecoWarriorsImg },
    { name: "Arya E-Sports Club",             img: esportsImg },
    { name: "Arya Go-Kart Club",              img: goKartImg },
    { name: "Arya Kabaddi Club",              img: kabaddiImg },
    { name: "Arya Lincom Club",               img: lincomImg },
    { name: "Arya Movie Club",                img: movieImg },
    { name: "Arya PhotoSphere Club",          img: photoImg },
    { name: "Arya Robotics Club",             img: roboticsImg },
    { name: "Arya Science & Technology Club", img: scienceTechnologyImg },
    { name: "Arya Skill Development Club",    img: skillDevelopmentImg },
    { name: "Arya Social Activities Club",    img: socialActivitiesImg },
    { name: "Arya Hackathon Club",            img: hackathonImg },
];

const OrganizerCards = () => {
    const carouselRef = useRef(null);

    useEffect(() => {
        let frame;
        const glide = () => {
            if (carouselRef.current) {
                carouselRef.current.scrollLeft += 0.45;
                if (carouselRef.current.scrollLeft >= carouselRef.current.scrollWidth / 2) {
                    carouselRef.current.scrollLeft = 0;
                }
            }
            frame = requestAnimationFrame(glide);
        };
        frame = requestAnimationFrame(glide);
        return () => cancelAnimationFrame(frame);
    }, []);

    return (
        <section className={classes.section}>
            <SideAccent side="left" />
            <FestivalSprite side="right" />
            <div className={classes.header}>
                <h3 className={classes.subtitle}>Behind the Magic</h3>

                {/* ── Organizer badge ── */}
                <div className={classes.collegeBadge}>
                    <img src={collegeLogo} alt="Arya College of Engineering and IT" />
                </div>
                <p className={classes.collegeName}>Arya College of Engineering &amp; I.T.</p>

                <p className={classes.organizerAnd}>&amp;</p>

                <h2 className={classes.title}>Arya Student Clubs</h2>
                <div className={classes.divider}></div>
            </div>
            <div className={classes.carousel} ref={carouselRef} aria-label="Arya Student Clubs">
                <div className={classes.track}>
                {[...clubs, ...clubs].map((club, i) => (
                    <div key={`${club.name}-${i}`} className={classes.card}>
                        <div className={classes.imgWrap}>
                            <img
                                src={club.img}
                                alt={club.name}
                                className={`${classes.logo} ${club.logoClass || ''}`}
                                style={{ backgroundColor: club.bg || 'transparent' }}
                                loading="lazy"
                                decoding="async"
                            />
                        </div>
                        <p className={classes.name}>{club.name}</p>
                    </div>
                ))}
                </div>
            </div>
        </section>
    );
};

export default OrganizerCards;
