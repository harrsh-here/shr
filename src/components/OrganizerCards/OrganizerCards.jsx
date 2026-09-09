import React, { useEffect, useRef } from "react";
import classes from "./OrganizerCards.module.css";

import cipherImg from "../../assets/club logos/Arya Cipher Coding Club.jpg";
import musicImg from "../../assets/club logos/Arya Music Club.jpg";
import danceImg from "../../assets/club logos/Arya Dance Club.jpg";
import hackathonImg from "../../assets/club logos/Arya Hackathon Club.jpg";
import photoImg from "../../assets/club logos/Arya PhotoSphere Club.jpg";
import roboticsImg from "../../assets/club logos/Arya Robotics Club.jpg";
import gdgImg from "../../assets/club logos/gdg.png";
import SideAccent from "../common/SideAccent/SideAccent";
import FestivalSprite from "../common/FestivalSprite/FestivalSprite";
import collegeLogo from "../../assets/collegeLogo.png";

// Placeholder SVG data-URI used for clubs whose logo image is not yet available.
// Replace by adding the real image file and updating the import + clubs entry below.
const PLACEHOLDER =
    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='110' height='110'%3E%3Crect width='110' height='110' rx='55' fill='%23501010'/%3E%3Ctext x='50%25' y='54%25' dominant-baseline='middle' text-anchor='middle' font-size='38' fill='%23E8A33D'%3E%E2%9C%A6%3C%2Ftext%3E%3C%2Fsvg%3E";

// ─── Club list ────────────────────────────────────────────────────────────────
// Priority clubs first (Cipher, GDG, Dance, Music), then the rest alphabetically.
// Set img: null for clubs whose logo is not yet available — a placeholder is shown.
const clubs = [
    // ── Priority ────────────────────────────────────────────────────────────

    { name: "Arya Dance Club",                img: danceImg },
    { name: "Arya Music Club",                img: musicImg },
    { name: "Arya Cipher Coding Club",        img: cipherImg },
    { name: "Google Developer Group ACEIT",   img: gdgImg,    bg: "white" },
    { name: "Arya Green Energy Club",         img: null },
    { name: "Arya Table Tennis Club",         img: null },
    // ── Remaining (alphabetical) ─────────────────────────────────────────
    { name: "Arya Automation Club",           img: null },
    { name: "Arya Badminton Club",            img: null },
    { name: "Arya Basketball Club",           img: null },
    { name: "Arya Chess Club",                img: null },
    { name: "Arya Cricket Club",              img: null },
    { name: "Arya Drama Club",                img: null },
    { name: "Arya Drones Club",               img: null },
    { name: "Arya Eco Warriors Club",         img: null },
    { name: "Arya E-Sports Club",             img: null },
    { name: "Arya Football Club",             img: null },
    { name: "Arya Go-Kart Club",              img: null },
    { name: "Arya Intelverse Club",           img: null },
    { name: "Arya Literature Club",           img: null },
    { name: "Arya Movie Club",                img: null },
    { name: "Arya PhotoSphere Club",          img: photoImg },
    { name: "Arya Robotics Club",             img: roboticsImg },
    { name: "Arya Science & Technology Club", img: null },
    { name: "Arya Skill Development Club",    img: null },
    { name: "Arya Social Activities Club",    img: null },
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
                                src={club.img ?? PLACEHOLDER}
                                alt={club.img ? club.name : `${club.name} — logo coming soon`}
                                className={classes.logo}
                                style={{ backgroundColor: club.bg || (club.img ? 'transparent' : '#501010') }}
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
