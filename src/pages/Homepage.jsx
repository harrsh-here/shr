import { useEffect } from "react";
import { useParams } from "react-router-dom";
import About from "../components/About/About";
import Contact from "../components/Contact/Contact";
import Hero from "../components/Hero/Hero";
import MainEvents from "../components/MainEvents/MainEvents";
import SingleEventPage from "../components/SingleEventPage/SingleEventPage";
import OrganizerCards from "../components/OrganizerCards/OrganizerCards";
import SectionDivider from "../components/common/SectionDivider/SectionDivider";
import EventStats from "../components/EventStats/EventStats";
import ReactGA from "react-ga";

const Homepage = () => {
  const { eventId } = useParams();

  useEffect(() => {
    ReactGA.pageview(window.location.pathname);
  }, []);

  return (
    <>
      <Hero />
      <EventStats />
      <SectionDivider />
      <div id="events">
        <MainEvents />
      </div>
      <SectionDivider />
      <About />
      <SectionDivider />
      <Contact />
      <SectionDivider />
      <OrganizerCards />
      {eventId && <SingleEventPage />}
    </>
  );
};

export default Homepage;
