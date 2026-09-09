import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import classes from './Register.module.css';

const FormContainer = ({ children, title }) => {
    const navigate = useNavigate();
    return (
        <div className={classes.pageContainer}>
            <div className={classes.formMotion} aria-hidden="true">
                <span></span><span></span><span></span><span></span><span></span>
            </div>
            <div className={classes.formRangoli} aria-hidden="true">✦</div>
            <div className={classes.glassCard}>
                <button className={classes.closeBtn} onClick={() => navigate("/")} aria-label="Close">
                    <FontAwesomeIcon icon={faXmark} />
                </button>
                {title && <h1 className={classes.title}>{title}</h1>}
                {title && <p className={classes.formIntro}>Shraddhanjali ’26 · 19 September · 6:30 PM onwards</p>}
                <div className={classes.formContent}>
                    {children}
                </div>
            </div>
        </div>
    );
};

export default FormContainer;
