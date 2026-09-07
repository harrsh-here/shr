import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import About from "../components/About/About";
import Contact from "../components/Contact/Contact";
import Hero from "../components/Hero/Hero";
import MainEvents from "../components/MainEvents/MainEvents";
import SingleEventPage from "../components/SingleEventPage/SingleEventPage";
import OrganizerCards from "../components/OrganizerCards/OrganizerCards";
import SectionDivider from "../components/common/SectionDivider/SectionDivider";
import ReactGA from "react-ga";

const Homepage = () => {
  const { eventId } = useParams();

  useEffect(() => {
    ReactGA.pageview(window.location.pathname);
  }, []);

  return (
    <>
      <Hero />
      <SectionDivider />
      <About />
      <SectionDivider />
      <div id="events">
        <MainEvents />
      </div>
      <SectionDivider />
      <Contact />
      <SectionDivider />
      <OrganizerCards />
      {eventId && <SingleEventPage />}
    </>
  );
};

export default Homepage;
