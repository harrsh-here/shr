import { useState } from "react";
import classes from "./Faq.module.css";
import useScrollReveal from "../../hooks/useScrollReveal";

const questions = [
  {
    question: "What is Shraddhanjali 2026?",
    answer: "Shraddhanjali 2026 is one of the biggest Cultural events."
  },
  {
    question: "When and where is Shraddhanjali 2026 happening?",
    answer: "[PLACEHOLDER: Updated answer for Shraddhanjali — to be provided by user]"
  },
  {
    question: "Who can participate in the events?",
    answer: "[PLACEHOLDER: Updated answer for Shraddhanjali — to be provided by user]"
  },
  {
    question: "How do I register for events like Cipher Premier League or Gyration?",
    answer: "[PLACEHOLDER: Updated answer for Shraddhanjali — to be provided by user]"
  },
  {
    question: "Are there entry fees and prizes?",
    answer: "[PLACEHOLDER: Updated answer for Shraddhanjali — to be provided by user]"
  },
  {
    question: "Can I participate in multiple events?",
    answer: "[PLACEHOLDER: Updated answer for Shraddhanjali — to be provided by user]"
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
