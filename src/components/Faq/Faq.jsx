import { useState } from "react";
import classes from "./Faq.module.css";
import useScrollReveal from "../../hooks/useScrollReveal";

const questions = [
  {
    question: "What is Shraddhanjali 2026?",
    answer: "Shraddhanjali is the annual cultural celebration of Arya College of Engineering & I.T., Jaipur, held in tribute to founder chairman Late Shri T. K. Agarwal Ji."
  },
  {
    question: "When and where is Shraddhanjali 2026 happening?",
    answer: "Shraddhanjali 2026 takes place on 19 September 2026 at Arya College of Engineering & I.T., Jaipur. Final reporting times will be shared with registered participants."
  },
  {
    question: "Who can participate in the events?",
    answer: "Students with a valid college ID are welcome to participate. Team requirements for each event are listed in its event details."
  },
  {
    question: "How do I register for Gyration or Don-De-Mode?",
    answer: "Open the Events section, choose Gyration or Don-De-Mode, and complete that event’s team registration form."
  },
  {
    question: "Are there entry fees and prizes?",
    answer: "Registration and prize details are confirmed on the relevant event page. Please check the final event guidelines before completing your registration."
  },
  {
    question: "Is the registration fee refundable?",
    answer: "No. All registration fees for Shraddhanjali 2026 are strictly non-refundable, including in cases where a registration is not verified or approved. Please review all team and payment details carefully before submitting."
  },
  {
    question: "Can I participate in multiple events?",
    answer: "Yes. You may participate in multiple events, provided you meet the team and schedule requirements for each event."
  }
];

const Faq = () => {
  const [clicked, setClicked] = useState(null);
  const revealRef = useScrollReveal({ threshold: 0.1 });

  const toggle = (i) => {
    if (clicked === i) {
      return setClicked(null);
    }

    setClicked(i);
  };

  return (
    <section className={classes.faqSection} ref={revealRef}>
      <div className={classes.heading}>FAQ</div>
      <div className={classes.faq}>
        {questions.map((ques, i) => {
          return (
            <div className={classes.single} onClick={() => toggle(i)}>
              <div className={classes.question}>{ques.question}</div>
              <div
                className={`${clicked === i ? classes.answer : classes.noAnswer
                  }`}
              >
                {ques.answer}
              </div>
              <span className={`${classes.btn} ${clicked === i ? classes.btnOpen : ""}`}>+</span>
            </div>
          );
        })}

        {/* <div className={classes.single}>
                <div className={classes.question}>How are you?</div>
                <div className={classes.answer}>I am fine</div>
                <span className={classes.btn}>+</span>
            </div> */}
      </div>
    </section>
  );
};

export default Faq;
